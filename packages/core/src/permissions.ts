export type Role =
  | 'student' | 'guardian' | 'teacher' | 'school_admin'
  | 'content_editor' | 'platform_admin' | 'bursar' | 'head_teacher';

export type Action =
  | 'school.verify' | 'school.settings.write'
  | 'join.request.create' | 'join.request.decide'
  | 'class.manage' | 'package.manage'
  | 'content.read' | 'content.write' | 'content.publish'
  | 'progress.read' | 'task.assign' | 'submission.mark'
  | 'notice.send' | 'request.submit' | 'request.manage'
  | 'message.send' | 'message.audit'
  | 'fees.read' | 'fees.manage' | 'payment.make'
  | 'results.read' | 'results.write' | 'results.publish'
  | 'audit.read';

/** Per-guardian flags (brief 4B). Absent flag = false. */
export interface GuardianFlags { canPay: boolean; canViewResults: boolean; canMessage: boolean; mayCollect: boolean }

export interface Actor {
  id: string;
  roles: Role[];
  /** School the session belongs to. Null only for platform admins. */
  schoolId: string | null;
}

export interface Resource {
  schoolId: string | null;      // school that owns the resource
  childId?: string;             // child the resource is about
  classId?: string;
  /** Present when the actor is a guardian of childId. */
  guardianFlags?: GuardianFlags;
  /** True when the actor teaches classId. */
  actorTeachesClass?: boolean;
  /** True when the resource is the actor's own (e.g. student acting on themself). */
  isSelf?: boolean;
}

const ROLE_ACTIONS: Record<Role, readonly Action[]> = {
  student: ['content.read', 'progress.read', 'message.send'],
  guardian: ['join.request.create', 'content.read', 'progress.read', 'request.submit', 'message.send', 'fees.read', 'payment.make', 'results.read'],
  teacher: ['content.read', 'progress.read', 'task.assign', 'submission.mark', 'notice.send', 'request.manage', 'message.send', 'results.write'],
  school_admin: ['school.settings.write', 'join.request.decide', 'class.manage', 'package.manage', 'content.read', 'progress.read', 'notice.send', 'request.manage', 'message.audit', 'results.publish', 'audit.read'],
  content_editor: ['content.read', 'content.write', 'content.publish'],
  platform_admin: ['school.verify', 'audit.read'],
  bursar: ['fees.read', 'fees.manage', 'request.manage', 'audit.read'],
  head_teacher: ['content.read', 'progress.read', 'notice.send', 'request.manage', 'message.audit', 'results.read', 'results.publish', 'audit.read'],
};

/** Actions that touch a child and need an extra relationship check. */
const NEEDS_CHILD_LINK: Partial<Record<Action, keyof GuardianFlags | true>> = {
  'fees.read': 'canPay', 'payment.make': 'canPay', 'results.read': 'canViewResults', 'progress.read': true, 'message.send': 'canMessage',
};

const FINANCE_ROLES: Role[] = ['bursar', 'head_teacher', 'school_admin'];

/**
 * Single server-side authorisation point. Deny by default.
 * Fee data: only guardians with canPay, bursar, or head/school admin of the same school.
 * Platform admins never read school-private data (fees, results, messages).
 */
export function can(actor: Actor, action: Action, res: Resource): boolean {
  // Tenant isolation first.
  const platformOnly = action === 'school.verify';
  if (!platformOnly) {
    if (actor.schoolId === null || res.schoolId === null || actor.schoolId !== res.schoolId) {
      // Any signed-in person (even with no role yet) may ask to join a school; this grants no access.
      return action === 'join.request.create' && res.schoolId !== null && actor.schoolId === null;
    }
  } else {
    return actor.roles.includes('platform_admin');
  }

  return actor.roles.some((role) => {
    if (!ROLE_ACTIONS[role].includes(action)) return false;
    if (role === 'guardian' || role === 'student') {
      if (role === 'student' && !res.isSelf) return false;
      if (role === 'guardian') {
        const need = NEEDS_CHILD_LINK[action];
        if (need !== undefined) {
          if (!res.childId || !res.guardianFlags) return false;
          if (need !== true && !res.guardianFlags[need]) return false;
        }
      }
      return true;
    }
    if (role === 'teacher') {
      const classScoped: Action[] = ['progress.read', 'task.assign', 'submission.mark', 'results.write'];
      if (classScoped.includes(action) && !res.actorTeachesClass) return false;
    }
    if ((action === 'fees.read') && !FINANCE_ROLES.includes(role)) return false;
    return true;
  });
}
