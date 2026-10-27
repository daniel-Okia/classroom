import { pgTable, uuid, text, timestamp, boolean, integer, date, jsonb, pgEnum, uniqueIndex, index, primaryKey } from 'drizzle-orm/pg-core';

// Phase 1 schema. Money and results tables (docs/04-erd.md) arrive in Phase 2.
// Every tenant table has school_id; RLS policies in migrations/rls.sql key on app.school_id.

const id = () => uuid('id').primaryKey().defaultRandom();
const created = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const schoolId = () => uuid('school_id').notNull().references(() => schools.id);

export const roleEnum = pgEnum('role', ['student', 'guardian', 'teacher', 'school_admin', 'content_editor', 'platform_admin', 'bursar', 'head_teacher']);
export const faithEnum = pgEnum('faith_setting', ['full', 'light', 'off']);
export const trackEnum = pgEnum('track', ['legacy', 'new']);
export const verifyEnum = pgEnum('verify_status', ['pending', 'verified', 'rejected']);
export const joinEnum = pgEnum('join_status', ['pending', 'approved', 'rejected']);
export const priorityEnum = pgEnum('priority', ['normal', 'important', 'emergency']);
export const requestStatusEnum = pgEnum('request_status', ['submitted', 'seen', 'in_progress', 'resolved']);
export const reviewEnum = pgEnum('review_status', ['draft', 'reviewed', 'published']);

export const schools = pgTable('school', {
  id: id(), name: text('name').notNull(), district: text('district').notNull(),
  levelFrom: text('level_from').notNull(), levelTo: text('level_to').notNull(),
  contactPhone: text('contact_phone').notNull(), verifyStatus: verifyEnum('verify_status').notNull().default('pending'),
  qrTokenHash: text('qr_token_hash').notNull(), joinCode: text('join_code').notNull(), created: created(),
}, (t) => [uniqueIndex('school_join_code').on(t.joinCode)]);

export const schoolSettings = pgTable('school_settings', {
  schoolId: uuid('school_id').primaryKey().references(() => schools.id),
  languages: jsonb('languages').$type<string[]>().notNull().default(['en']),
  faith: faithEnum('faith').notNull().default('light'),
  schoolVerse: text('school_verse'), showRanking: boolean('show_ranking').notNull().default(false),
});

// Phone is the login. Stored normalised (E.164); never shown to other families.
export const users = pgTable('user', {
  id: id(), phone: text('phone'), name: text('name').notNull(), dob: date('dob'), locale: text('locale').notNull().default('en'), isPlatformAdmin: boolean('is_platform_admin').notNull().default(false),
  created: created(),
}, (t) => [uniqueIndex('user_phone').on(t.phone)]);

export const userRoles = pgTable('user_role', {
  userId: uuid('user_id').notNull().references(() => users.id), schoolId: schoolId(), role: roleEnum('role').notNull(),
}, (t) => [primaryKey({ columns: [t.userId, t.schoolId, t.role] })]);

export const classes = pgTable('class', {
  id: id(), schoolId: schoolId(), name: text('name').notNull(), level: text('level').notNull(),
  joinCode: text('join_code').notNull(), teacherId: uuid('teacher_id').references(() => users.id),
}, (t) => [uniqueIndex('class_join_code').on(t.joinCode)]);

export const joinRequests = pgTable('join_request', {
  id: id(), schoolId: schoolId(), guardianId: uuid('guardian_id').notNull().references(() => users.id),
  childName: text('child_name').notNull(), classId: uuid('class_id').references(() => classes.id),
  status: joinEnum('status').notNull().default('pending'), decidedBy: uuid('decided_by').references(() => users.id),
  decidedAt: timestamp('decided_at', { withTimezone: true }), created: created(),
});

export const parentChildLinks = pgTable('parent_child_link', {
  id: id(), schoolId: schoolId(), guardianId: uuid('guardian_id').notNull().references(() => users.id),
  childId: uuid('child_id').notNull().references(() => users.id),
  canPay: boolean('can_pay').notNull().default(false), canViewResults: boolean('can_view_results').notNull().default(true),
  canMessage: boolean('can_message').notNull().default(true), mayCollect: boolean('may_collect').notNull().default(false),
}, (t) => [uniqueIndex('pcl_unique').on(t.guardianId, t.childId)]);

export const enrolments = pgTable('enrolment', {
  id: id(), schoolId: schoolId(), classId: uuid('class_id').notNull().references(() => classes.id),
  studentId: uuid('student_id').notNull().references(() => users.id),
}, (t) => [uniqueIndex('enrol_unique').on(t.classId, t.studentId)]);

export const holidayPackages = pgTable('holiday_package', {
  id: id(), schoolId: schoolId(), name: text('name').notNull(), startDate: date('start_date').notNull(), endDate: date('end_date').notNull(),
  weeklyHourGoal: integer('weekly_hour_goal').notNull(), slotOptions: jsonb('slot_options').$type<string[]>().notNull(),
  subjectIds: jsonb('subject_ids').$type<string[]>().notNull(), classIds: jsonb('class_ids').$type<string[]>().notNull(),
});

export const packageEnrolments = pgTable('package_enrolment', {
  id: id(), schoolId: schoolId(), packageId: uuid('package_id').notNull().references(() => holidayPackages.id),
  studentId: uuid('student_id').notNull().references(() => users.id),
  consentLogId: uuid('consent_log_id'),            // required when student is under 18; enforced in core
  slotStart: text('slot_start'), slotMinutes: integer('slot_minutes'),
}, (t) => [uniqueIndex('pkgenrol_unique').on(t.packageId, t.studentId)]);

export const sessions = pgTable('session', {
  id: id(), schoolId: schoolId(), enrolmentId: uuid('enrolment_id').notNull().references(() => packageEnrolments.id),
  date: date('date').notNull(), activeSeconds: integer('active_seconds').notNull().default(0),
  checkedInAt: timestamp('checked_in_at', { withTimezone: true }), clientKey: text('client_key').notNull(),
}, (t) => [uniqueIndex('session_client_key').on(t.schoolId, t.clientKey)]);   // idempotency for offline retries

// Content: legacy and new tracks are separate level trees; topic_link cross-links them.
export const levels = pgTable('level', { id: id(), track: trackEnum('track').notNull(), code: text('code').notNull(), name: text('name').notNull() });
export const subjects = pgTable('subject', { id: id(), levelId: uuid('level_id').notNull().references(() => levels.id), code: text('code').notNull(), name: text('name').notNull() });
export const topics = pgTable('topic', { id: id(), subjectId: uuid('subject_id').notNull().references(() => subjects.id), name: text('name').notNull(), position: integer('position').notNull().default(0) });
export const topicLinks = pgTable('topic_link', { fromTopic: uuid('from_topic').notNull().references(() => topics.id), toTopic: uuid('to_topic').notNull().references(() => topics.id), relation: text('relation').notNull() },
  (t) => [primaryKey({ columns: [t.fromTopic, t.toTopic] })]);
export const resources = pgTable('resource', {
  id: id(), title: text('title').notNull(), sourceUrl: text('source_url'), licence: text('licence').notNull(),
  retrievedAt: timestamp('retrieved_at', { withTimezone: true }), sha256: text('sha256'), verdict: text('verdict').notNull(),
  publishable: boolean('publishable').notNull().default(false),          // false = blocked from production builds
});
export const lessons = pgTable('lesson', {
  id: id(), topicId: uuid('topic_id').notNull().references(() => topics.id), title: text('title').notNull(), bodyMd: text('body_md').notNull(),
  resourceId: uuid('resource_id').references(() => resources.id), authorId: uuid('author_id').references(() => users.id), review: reviewEnum('review').notNull().default('draft'),
});
export const quizzes = pgTable('quiz', { id: id(), topicId: uuid('topic_id').notNull().references(() => topics.id), title: text('title').notNull(), items: jsonb('items').notNull() });
export const attempts = pgTable('attempt', {
  id: id(), schoolId: schoolId(), quizId: uuid('quiz_id').notNull().references(() => quizzes.id), studentId: uuid('student_id').notNull().references(() => users.id),
  answers: jsonb('answers').notNull(), score: integer('score'), max: integer('max'), clientKey: text('client_key').notNull(), created: created(),
}, (t) => [uniqueIndex('attempt_client_key').on(t.schoolId, t.clientKey)]);

export const devotionEntries = pgTable('devotion_entry', {
  id: id(), day: integer('day').notNull(), reference: text('reference').notNull(), reflection: text('reflection').notNull(), question: text('question').notNull(),
  review: reviewEnum('review').notNull().default('draft'),               // only 'published' (chaplain-reviewed) is served
});

// Hub (Phase 1 subset)
export const announcements = pgTable('announcement', {
  id: id(), schoolId: schoolId(), authorId: uuid('author_id').notNull().references(() => users.id), title: text('title').notNull(), body: text('body').notNull(),
  priority: priorityEnum('priority').notNull().default('normal'), audience: jsonb('audience').notNull(), sendAt: timestamp('send_at', { withTimezone: true }), verse: text('verse'),
});
export const readReceipts = pgTable('read_receipt', { schoolId: schoolId(), announcementId: uuid('announcement_id').notNull().references(() => announcements.id), userId: uuid('user_id').notNull().references(() => users.id), readAt: timestamp('read_at', { withTimezone: true }).notNull().defaultNow() },
  (t) => [primaryKey({ columns: [t.announcementId, t.userId] })]);
export const events = pgTable('event', {
  id: id(), schoolId: schoolId(), title: text('title').notNull(), kind: text('kind').notNull(), startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  rsvpDeadline: timestamp('rsvp_deadline', { withTimezone: true }), needsConsent: boolean('needs_consent').notNull().default(false),
});
export const eventRsvps = pgTable('event_rsvp', { schoolId: schoolId(), eventId: uuid('event_id').notNull().references(() => events.id), guardianId: uuid('guardian_id').notNull().references(() => users.id), childId: uuid('child_id').notNull().references(() => users.id), response: text('response').notNull() },
  (t) => [primaryKey({ columns: [t.eventId, t.guardianId, t.childId] })]);
export const requestTypes = pgTable('request_type', { id: id(), schoolId: schoolId(), name: text('name').notNull(), builtin: boolean('builtin').notNull().default(false) });
export const parentRequests = pgTable('parent_request', {
  id: id(), schoolId: schoolId(), typeId: uuid('type_id').notNull().references(() => requestTypes.id), guardianId: uuid('guardian_id').notNull().references(() => users.id),
  childId: uuid('child_id').notNull().references(() => users.id), body: text('body').notNull(), status: requestStatusEnum('status').notNull().default('submitted'),
  assigneeId: uuid('assignee_id').references(() => users.id), dueAt: timestamp('due_at', { withTimezone: true }), clientKey: text('client_key').notNull(),
}, (t) => [uniqueIndex('req_client_key').on(t.schoolId, t.clientKey)]);
export const requestStatusHistory = pgTable('request_status_history', {
  id: id(), schoolId: schoolId(), requestId: uuid('request_id').notNull().references(() => parentRequests.id), status: requestStatusEnum('status').notNull(), actorId: uuid('actor_id').notNull().references(() => users.id), note: text('note'), at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
});
export const messageThreads = pgTable('message_thread', { id: id(), schoolId: schoolId(), kind: text('kind').notNull(), childId: uuid('child_id').references(() => users.id) });
export const messages = pgTable('message', {
  id: id(), schoolId: schoolId(), threadId: uuid('thread_id').notNull().references(() => messageThreads.id), senderId: uuid('sender_id').notNull().references(() => users.id), body: text('body').notNull(),
  reportedAt: timestamp('reported_at', { withTimezone: true }), clientKey: text('client_key').notNull(), created: created(),
}, (t) => [index('msg_thread').on(t.threadId), uniqueIndex('msg_client_key').on(t.schoolId, t.clientKey)]);
export const notificationPreferences = pgTable('notification_preference', {
  userId: uuid('user_id').primaryKey().references(() => users.id), channel: text('channel').notNull().default('in_app'), language: text('language').notNull().default('en'),
  quietFrom: text('quiet_from'), quietTo: text('quiet_to'), smsConsent: boolean('sms_consent').notNull().default(false),
});

export const consentLog = pgTable('consent_log', {
  id: id(), schoolId: schoolId(), subjectId: uuid('subject_id').notNull().references(() => users.id), givenBy: uuid('given_by').notNull().references(() => users.id),
  purpose: text('purpose').notNull(), at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
});
export const auditLog = pgTable('audit_log', {
  id: id(), schoolId: uuid('school_id'), actorId: uuid('actor_id'), action: text('action').notNull(), target: text('target'), detail: jsonb('detail'), at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('audit_school_at').on(t.schoolId, t.at)]);

// Auth (no school_id: a phone number belongs to a person, not a school)
export const otpCodes = pgTable('otp_code', {
  id: id(), phone: text('phone').notNull(), codeHash: text('code_hash').notNull(), expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  attempts: integer('attempts').notNull().default(0), consumed: boolean('consumed').notNull().default(false),
}, (t) => [index('otp_phone').on(t.phone)]);
export const authSessions = pgTable('auth_session', {
  id: text('id').primaryKey(), userId: uuid('user_id').notNull().references(() => users.id), expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

// Teacher tasks, student submissions (text or photo), teacher marks
export const tasks = pgTable('task', {
  id: id(), schoolId: schoolId(), classId: uuid('class_id').notNull().references(() => classes.id), teacherId: uuid('teacher_id').notNull().references(() => users.id),
  title: text('title').notNull(), instructions: text('instructions').notNull(), topicId: uuid('topic_id').references(() => topics.id), dueDate: date('due_date'), created: created(),
});
export const submissions = pgTable('submission', {
  id: id(), schoolId: schoolId(), taskId: uuid('task_id').notNull().references(() => tasks.id), studentId: uuid('student_id').notNull().references(() => users.id),
  answerText: text('answer_text'), photoKey: text('photo_key'), moderation: text('moderation').notNull().default('pending'), clientKey: text('client_key').notNull(), created: created(),
}, (t) => [uniqueIndex('submission_client_key').on(t.schoolId, t.clientKey), uniqueIndex('submission_once').on(t.taskId, t.studentId)]);
export const marks = pgTable('mark', {
  id: id(), schoolId: schoolId(), submissionId: uuid('submission_id').notNull().references(() => submissions.id), markerId: uuid('marker_id').notNull().references(() => users.id),
  score: integer('score').notNull(), max: integer('max').notNull(), comment: text('comment'), at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex('mark_once').on(t.submissionId)]);
