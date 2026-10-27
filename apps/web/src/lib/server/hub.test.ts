import { describe, it, expect, afterAll } from 'vitest';
import { client, inSchool, schema } from './db';
import { seedSchool, login } from './testkit';
import { actorFor } from './auth';
import { postNotice, noticesForGuardian, markRead, readReport, createEvent, rsvp, icsFor, ensureRequestTypes, submitRequest, updateRequest, myRequests, requestInbox, sendMessage, readThread, reportMessage, reportedMessages } from './hub';
import { Forbidden } from './schools';
afterAll(() => client.end());

describe('MVP acceptance: notice + event -> parent RSVPs and requests -> office responds', () => {
  it('works end to end', async () => {
    const s = await seedSchool();
    const n = await postNotice(s.admin, { title: 'Term starts', body: 'Welcome back on Monday.', priority: 'important', audience: { kind: 'school' } });
    const ev = await createEvent(s.admin, { title: 'Trip to museum', kind: 'trip', startsAt: new Date('2027-01-20T07:00:00Z'), rsvpDeadline: new Date('2027-01-10T00:00:00Z'), needsConsent: true });
    const feed = await noticesForGuardian(s.guardian);
    expect(feed.map((x) => x.id)).toContain(n.id);
    await markRead(s.guardian, n.id);
    expect((await noticesForGuardian(s.guardian)).find((x) => x.id === n.id)!.read).toBe(true);
    expect((await readReport(s.admin, n.id)).readCount).toBe(1);

    await rsvp(s.guardian, ev.id, s.childId, 'consent', new Date('2027-01-05T00:00:00Z'));
    await expect(rsvp(s.guardian, ev.id, s.childId, 'yes', new Date('2027-01-11T00:00:00Z'))).rejects.toThrow('deadline');
    expect(icsFor({ id: ev.id, title: 'Trip, museum', startsAt: ev.startsAt })).toContain('SUMMARY:Trip\\, museum');

    const types = await ensureRequestTypes(s.reg.schoolId);
    expect(types.length).toBe(7);
    const leave = types.find((t) => t.name === 'Absence or leave')!;
    const r = await submitRequest(s.guardian, leave.id, s.childId, 'Amina has a clinic visit on Friday.', 'rq-1');
    expect((await submitRequest(s.guardian, leave.id, s.childId, 'dup', 'rq-1')).id).toBe(r.id);
    expect((await requestInbox(s.admin)).map((x) => x.id)).toContain(r.id);
    await updateRequest(s.admin, r.id, 'seen');
    await updateRequest(s.admin, r.id, 'resolved', 'Approved. Get well soon.', s.adminId);
    await expect(updateRequest(s.admin, r.id, 'seen')).rejects.toThrow('back');
    const mine = (await myRequests(s.guardian))[0]!;
    expect(mine.status).toBe('resolved'); expect(mine.trail.map((t) => t.status)).toEqual(['submitted', 'seen', 'resolved']);
    await expect(requestInbox(s.guardian)).rejects.toThrow(Forbidden);
  });
});

describe('audiences and privacy', () => {
  it('targets by class, level and family; hides scheduled sends; other families see nothing', async () => {
    const s = await seedSchool();
    const g2 = await login();
    await inSchool(s.reg.schoolId, async (tx) => { // a second family in a different class/level
      const { classes } = schema; const [c2] = await tx.insert(classes).values({ schoolId: s.reg.schoolId, name: 'P3', level: 'P3', joinCode: 'ZZ' + Math.random().toString(36).slice(2, 6) }).returning();
      const [kid] = await tx.insert(schema.users).values({ name: 'Joseph' }).returning();
      await tx.insert(schema.userRoles).values({ userId: g2.userId, schoolId: s.reg.schoolId, role: 'guardian' });
      await tx.insert(schema.parentChildLinks).values({ schoolId: s.reg.schoolId, guardianId: g2.userId, childId: kid!.id });
      await tx.insert(schema.enrolments).values({ schoolId: s.reg.schoolId, classId: c2!.id, studentId: kid!.id });
    });
    const g2a = await actorFor(g2.userId);
    const a = await postNotice(s.admin, { title: 'S4 only', body: 'b', audience: { kind: 'level', level: 'S4' } });
    const b = await postNotice(s.admin, { title: 'Family', body: 'b', audience: { kind: 'family', childId: s.childId } });
    const c = await postNotice(s.admin, { title: 'Later', body: 'b', audience: { kind: 'school' }, sendAt: new Date(Date.now() + 86400_000) });
    const mine = (await noticesForGuardian(s.guardian)).map((x) => x.id);
    expect(mine).toContain(a.id); expect(mine).toContain(b.id); expect(mine).not.toContain(c.id);
    const theirs = (await noticesForGuardian(g2a)).map((x) => x.id);
    expect(theirs).not.toContain(a.id); expect(theirs).not.toContain(b.id);
    await expect(markRead(g2a, b.id)).rejects.toThrow(Forbidden);
    await expect(postNotice(s.guardian, { title: 't', body: 'b', audience: { kind: 'school' } })).rejects.toThrow(Forbidden);
    await expect(postNotice(s.teacher, { title: 't', body: 'b', audience: { kind: 'school' } })).rejects.toThrow(Forbidden);
    await postNotice(s.teacher, { title: 'Class note', body: 'b', audience: { kind: 'class', classId: s.cls.id } });
  });
  it('a guardian cannot RSVP or submit requests for a child they are not linked to', async () => {
    const s = await seedSchool(); const o = await seedSchool('Other');
    const ev = await createEvent(s.admin, { title: 'Sports', kind: 'sports', startsAt: new Date() });
    await expect(rsvp(o.guardian, ev.id, s.childId, 'yes')).rejects.toThrow();
    const types = await ensureRequestTypes(s.reg.schoolId);
    const g2 = await login(); const a2 = await actorFor(g2.userId);
    await expect(submitRequest(a2, types[0]!.id, s.childId, 'x', 'k')).rejects.toThrow();
  });
});

describe('messaging safety', () => {
  it('admin can read every thread; outsiders cannot; reports reach the admin', async () => {
    const s = await seedSchool();
    const m1 = await sendMessage(s.guardian, { childId: s.childId, kind: 'parent_teacher', body: 'Hello teacher' }, 'm-1');
    expect((await sendMessage(s.guardian, { childId: s.childId, kind: 'parent_teacher', body: 'again' }, 'm-1')).id).toBe(m1.id);
    await sendMessage(s.teacher, { childId: s.childId, kind: 'parent_teacher', body: 'Hi!', threadId: m1.threadId }, 'm-2');
    expect((await readThread(s.admin, m1.threadId)).map((m) => m.body)).toEqual(['Hello teacher', 'Hi!']);
    expect(await readThread(s.teacher, m1.threadId)).toHaveLength(2);
    const stranger = await actorFor((await login()).userId);
    await expect(readThread(stranger, m1.threadId)).rejects.toThrow();
    const o = await seedSchool('Other');
    await expect(readThread(o.admin, m1.threadId)).rejects.toThrow();
    await expect(sendMessage(o.guardian, { childId: s.childId, kind: 'parent_office', body: 'x' }, 'm-9')).rejects.toThrow();
    await reportMessage(s.guardian, m1.id);
    expect((await reportedMessages(s.admin)).map((m) => m.id)).toEqual([m1.id]);
    await expect(reportedMessages(s.guardian)).rejects.toThrow(Forbidden);
  });
  it('a guardian whose canMessage is off cannot message', async () => {
    const s = await seedSchool();
    await inSchool(s.reg.schoolId, (tx) => tx.update(schema.parentChildLinks).set({ canMessage: false }));
    await expect(sendMessage(s.guardian, { childId: s.childId, kind: 'parent_office', body: 'x' }, 'mm')).rejects.toThrow(Forbidden);
  });
});
