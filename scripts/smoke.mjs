#!/usr/bin/env node
// End-to-end MVP acceptance over real HTTP against a running dev server + dev DB.
//   DEV_LOG=<path to server log> BASE=http://localhost:5173 node scripts/smoke.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const BASE = process.env.BASE ?? 'http://localhost:5173';
const LOG = process.env.DEV_LOG;
const psql = (sql) => execFileSync('/Library/PostgreSQL/18/bin/psql', ['-h', '127.0.0.1', '-p', '54329', '-U', 'dev', '-d', 'classroom', '-At', '-c', sql], { encoding: 'utf8' }).trim();
let passed = 0;
const ok = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1); } passed++; console.log('ok  ', msg); };

class Client {
  jar = {};
  async req(path, { method = 'GET', form, json } = {}) {
    const headers = { cookie: Object.entries(this.jar).map(([k, v]) => `${k}=${v}`).join('; '), origin: BASE };
    let body; if (form) { body = new URLSearchParams(form); headers['content-type'] = 'application/x-www-form-urlencoded'; headers['x-sveltekit-action'] = 'true'; headers.accept = 'application/json'; }
    if (json) { body = JSON.stringify(json); headers['content-type'] = 'application/json'; }
    const r = await fetch(BASE + path, { method, headers, body, redirect: 'manual' });
    for (const c of r.headers.getSetCookie?.() ?? []) { const [kv] = c.split(';'); const i = kv.indexOf('='); const k = kv.slice(0, i), v = kv.slice(i + 1); if (/Max-Age=0|expires=Thu, 01 Jan 1970/i.test(c)) delete this.jar[k]; else this.jar[k] = v; }
    return r;
  }
  async html(path) { let r = await this.req(path); for (let i = 0; i < 5 && r.status >= 300 && r.status < 400; i++) r = await this.req(r.headers.get('location')); return { status: r.status, text: await r.text() }; }
  async act(path, form) { const r = await this.req(path, { method: 'POST', form }); const t = await r.text(); try { return { status: r.status, ...JSON.parse(t) }; } catch { return { status: r.status, text: t }; } }
  async login(phone, name) {
    await this.act('/login?/send', { phone });
    await new Promise((r) => setTimeout(r, 300));
    const digits = '+256' + phone.replace(/^0/, '');
    const lines = readFileSync(LOG, 'utf8').split('\n').filter((l) => l.includes(`[sms:dev] to ${digits}`));
    const code = lines.at(-1).match(/code is (\d{6})/)[1];
    const r = await this.act('/login?/verify', { phone, code, name });
    ok(r.type === 'redirect' || r.status === 200 || r.status === 303, `login ${name}`);
  }
}
const rnd = () => '07' + String(Math.floor(Math.random() * 1e8)).padStart(8, '0');

const admin = new Client(), platform = new Client(), parent = new Client(), teacher = new Client();
await admin.login(rnd(), 'Head Teacher'); await platform.login(rnd(), 'Platform'); await parent.login(rnd(), 'Mama Amina'); const tPhone = rnd(); await teacher.login(tPhone, 'Mr Okello');

// 1. School registers, platform admin verifies
let r = await admin.act('/schools/register', { name: 'Smoke Secondary', district: 'Kampala', from: 'S1', to: 'S6', contact: '0700123456', faith: 'light' });
ok(JSON.stringify(r).includes('Thank you') || r.type === 'success', 'school registered');
const schoolId = psql("select id from school where name='Smoke Secondary' order by created_at desc limit 1".replace('created_at', 'id'));
// unverified school cannot be joined
const joinCode = psql(`select join_code from school where id='${schoolId}'`);
let page = await parent.html(`/join?c=${joinCode}`); ok(page.text.includes('not valid'), 'unverified school code is refused');
psql(`update "user" set is_platform_admin=true where name='Platform'`);
r = await platform.act('/platform?/decide', { id: schoolId, approve: '1' });
ok(psql(`select verify_status from school where id='${schoolId}'`) === 'verified', 'platform admin verified the school');

// 2. Admin sets up class + package, teacher assigned
await admin.act('/school/setup?/addClass', { name: 'S4 East', level: 'S4' });
await admin.act('/school/setup?/addPackage', { name: 'December Pack', start: '2026-12-01', end: '2026-12-28', goal: '9', slots: '09:00, 16:00' });
const classId = psql(`select id from class where school_id='${schoolId}'`), classCode = psql(`select join_code from class where id='${classId}'`);
ok(!!classCode, 'class created with join code');
const tid = psql(`select id from "user" where phone='+256${tPhone.slice(1)}'`);
psql(`insert into user_role(user_id,school_id,role) values ('${tid}','${schoolId}','teacher'); update class set teacher_id='${tid}' where id='${classId}'`);

// 3. Poster
r = await admin.req('/school/poster.pdf'); ok(r.headers.get('content-type') === 'application/pdf', 'poster PDF served');
ok((await r.arrayBuffer()).byteLength > 1000, 'poster has content');

// 4. Parent: scan, ask to link; QR alone gives no access
page = await parent.html(`/join?c=${classCode}`); ok(page.text.includes('Smoke Secondary') && page.text.includes('S4 East'), 'class code resolves to school and class');
r = await parent.act('/join?/request', { code: classCode, child: 'Amina Nakato' }); ok(JSON.stringify(r).includes('sent'), 'join request sent');
page = await parent.html('/'); ok(!page.text.includes('Amina Nakato'), 'pending request gives no access to the child');
page = await parent.html('/school'); ok(page.status !== 200 || !page.text.includes('Smoke Secondary'), 'pending parent cannot open school area');

// 5. Admin approves
page = await admin.html('/school/requests'); ok(page.text.includes('Amina Nakato'), 'admin sees the request');
const jrId = psql(`select id from join_request where school_id='${schoolId}'`);
await admin.act('/school/requests?/decide', { id: jrId, approve: '1' });
page = await parent.html('/'); ok(page.text.includes('Amina Nakato'), 'after approval the parent sees the child');

// 6. Enrol with consent, switch to student, pick a slot
const pkgId = psql(`select id from holiday_package where school_id='${schoolId}'`), childId = psql(`select id from "user" where name='Amina Nakato'`);
await parent.act('/?/enrol', { pkg: pkgId, child: childId });
ok(psql(`select count(*) from consent_log where purpose like 'holiday_package:%' and school_id='${schoolId}'`) === '1', 'consent recorded on enrolment');
await parent.act('/?/studyAs', { child: childId });
page = await parent.html('/'); ok(page.text.includes('Choose your study time'), 'student mode shows slot choice');
const enrId = psql(`select id from package_enrolment where school_id='${schoolId}'`);
await parent.act(`/slot/${enrId}`, { start: '16:00', minutes: '90' });
ok(psql(`select slot_start from package_enrolment where id='${enrId}'`) === '16:00', 'slot saved');

// 7. Lesson, quiz, check-in (replayed to mimic an offline outbox)
const topicId = psql(`select t.id from topic t join lesson l on l.topic_id=t.id join subject s on s.id=t.subject_id join level v on v.id=s.level_id where v.code='S1' and s.code='mathematics'`);
page = await parent.html(`/learn/${topicId}`); ok(page.text.includes('Key idea') && page.text.includes('katex'), 'lesson renders with maths');
ok(!page.text.includes('"answer"'), 'answer key is not sent to the browser');
const quizId = psql(`select id from quiz where topic_id='${topicId}'`);
for (let i = 0; i < 2; i++) {
  r = await parent.req('/api/sync', { method: 'POST', json: { type: 'quiz', clientKey: 'smoke-q', quizId, answers: [0, 1, 2, 1] } }); const j = await r.json();
  ok(j.score === 4, `quiz marked on server (replay ${i + 1})`);
  r = await parent.req('/api/sync', { method: 'POST', json: { type: 'checkin', clientKey: 'smoke-c', date: new Date().toISOString().slice(0, 10), activeSeconds: 1800 } }); const c = await r.json();
  ok(c.minutes === 30, `check-in recorded once (replay ${i + 1})`);
}
await parent.act('/?/exitChild', {});
page = await parent.html('/'); ok(/0h 30m of 9h/.test(page.text), 'parent sees 30 minutes of study');

// 8. Teacher assigns, student submits, teacher reviews, family sees feedback
await teacher.html('/'); r = await teacher.act(`/teacher/${classId}?/assign`, { title: 'Quadratics 1', instructions: 'Solve x^2 - 5x + 6 = 0' }); ok(JSON.stringify(r).includes('assigned'), 'teacher assigned a task');
const taskId = psql(`select id from task where school_id='${schoolId}'`);
await parent.act('/?/studyAs', { child: childId });
page = await parent.html('/practice'); ok(page.text.includes('Quadratics 1'), 'student sees the task');
await parent.act('/practice?/submit', { task: taskId, key: 'smoke-s', text: '(x-2)(x-3)=0 so x=2 or 3' });
page = await teacher.html(`/teacher/${classId}`); ok(page.text.includes('x=2 or 3'), 'teacher sees the submission');
const subId = psql(`select id from submission where school_id='${schoolId}'`);
await teacher.act(`/teacher/${classId}?/mark`, { id: subId, score: '4', max: '4', comment: 'Well done' });
page = await parent.html('/practice'); ok(page.text.includes('Well done') && page.text.includes('4/4'), 'student sees teacher feedback');
page = await teacher.html('/'); ok(page.text.includes('Amina Nakato') && page.text.includes('On track'), 'teacher dashboard shows the student on track');
await parent.act('/?/exitChild', {});

// 9. Notice + event -> parent RSVPs, submits request -> office responds
await admin.act('/school/notices?/notice', { title: 'Term starts Monday', body: 'Welcome back.', priority: 'important', audience: 'school' });
await admin.act('/school/notices?/event', { title: 'Museum trip', kind: 'trip', starts: '2027-01-20T07:00', deadline: '2030-01-01T00:00', consent: 'on' });
page = await parent.html('/school'); ok(page.text.includes('Term starts Monday') && page.text.includes('Museum trip'), 'parent sees notice and event');
const evId = psql(`select id from event where school_id='${schoolId}'`);
r = await parent.act('/school?/rsvp', { event: evId, child: childId, response: 'consent' }); ok(!r.error && psql(`select response from event_rsvp where event_id='${evId}'`) === 'consent', 'parent gave trip consent');
r = await parent.req(`/school/event/${evId}.ics`); ok((await r.text()).includes('SUMMARY:Museum trip'), 'calendar file downloads');
const typeId = psql(`select id from request_type where school_id='${schoolId}' and name='Absence or leave'`);
await parent.act('/school?/request', { type: typeId, child: childId, body: 'Clinic visit Friday', key: 'smoke-r' });
const reqId = psql(`select id from parent_request where school_id='${schoolId}'`);
await admin.act('/school?/status', { id: reqId, status: 'seen' }); await admin.act('/school?/status', { id: reqId, status: 'in_progress', note: 'Noted' });
page = await parent.html('/school?tab=requests'); ok(page.text.includes('in progress') && page.text.includes('Noted'), 'parent sees the request status trail');
await parent.act('/school?/request', { type: typeId, child: childId, body: 'Clinic visit Friday', key: 'smoke-r' });
ok(psql(`select count(*) from parent_request where school_id='${schoolId}'`) === '1', 'duplicate request submission is ignored');

// 10. Messages are visible to admin
await parent.act('/messages?/send', { child: childId, kind: 'parent_teacher', body: 'Hello Mr Okello', key: 'smoke-m' });
page = await admin.html('/messages'); ok(page.text.includes('Hello Mr Okello'), 'admin can read parent-teacher messages');

// 11. Isolation
const other = new Client(); await other.login(rnd(), 'Stranger');
page = await other.html('/school'); ok(!page.text.includes('Smoke Secondary'), 'a stranger cannot see the school');
r = await other.req(`/learn/${topicId}`); ok(r.status === 200, 'library is readable by any signed-in user');
r = await other.req('/api/sync', { method: 'POST', json: { type: 'quiz', clientKey: 'x', quizId, answers: [0, 0, 0, 0] } }); ok(r.status === 401, 'sync refuses users without a school');
console.log(`\n${passed} checks passed`);
