<script lang="ts">
  import { enhance } from '$app/forms';
  import { slotRange, clock, hm, pct, greeting } from '$lib/format';
  let { data, form }: { data: any; form: any } = $props();
  const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const DAYNAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const label: Record<string, string> = { on_track: 'On track', behind: 'Behind', not_started: 'Not started' };
  const tone: Record<string, string> = { on_track: '', behind: 'gold', not_started: 'dark' };
  const students = $derived(data.mode === 'staff' ? data.classes.flatMap((c: any) => c.students) : []);
  const stat = $derived({
    enrolled: students.length,
    today: students.filter((s: any) => s.studiedToday).length,
    avg: students.length ? (students.reduce((a: number, s: any) => a + s.minutes, 0) / students.length / 60).toFixed(1) : '0',
    attention: students.filter((s: any) => s.status !== 'on_track').length,
  });
</script>
<svelte:head><title>Home · Classroom</title></svelte:head>

{#snippet verseCard(v: any)}
  {#if v}<section class="note gold" aria-label="Verse of the day"><span class="label">Verse of the day · {v.reference}</span>{#if v.reflection}<p>{v.reflection}</p><p class="muted"><em>{v.question}</em></p>{/if}</section>{/if}
{/snippet}
{#snippet week(w: any)}
  <div class="dots" role="img" aria-label={`Study days this week: ${w.days.map((d: boolean, i: number) => `${DAYNAMES[i]} ${d ? 'studied' : 'not yet'}`).join(', ')}`}>
    {#each w.days as d, i}<div><span class:on={d} class:today={!d && i === w.dayIndex} class:future={!d && i > w.dayIndex} aria-hidden="true">{d ? '✓' : ''}</span>{DAYS[i]}</div>{/each}
  </div>
  <div class="row" style="margin-top:8px"><span class="muted">{hm(w.minutes)} of {w.goalHours}h goal</span><strong>{pct(w.minutes, w.goalHours)}%</strong></div>
  <div class="bar" aria-hidden="true" style="margin-top:6px"><i style={`width:${pct(w.minutes, w.goalHours)}%`}></i></div>
{/snippet}

{#if data.mode === 'none'}
  <p class="eyebrow">Welcome</p><h1>Learning together</h1>
  <p class="muted">Join your child's school with its class code, or register your school.</p>
  <div class="stack"><a class="btn btn-primary" href="/join">Join my child's school</a><a class="btn btn-secondary" style="width:100%" href="/schools/register">Register a school</a></div>
{:else if data.mode === 'platform'}
  <p class="eyebrow">Platform admin</p><h1>Schools waiting</h1><a class="btn btn-primary" href="/platform">Verify schools</a>
{:else if data.mode === 'student'}
  <div class="row" style="align-items:flex-start">
    <div><p class="eyebrow">{data.enrolment?.pkg.name ?? 'Holiday pack'}</p><h1>{greeting()},<br />{data.name.split(' ')[0]}</h1></div>
    {#if data.week.streak >= 2}<span class="chip gold">{data.week.streak}-day streak</span>{/if}
  </div>
  {#if data.enrolment}
    <section class="hero">
      <p class="eyebrow" style="margin:0">{data.enrolment.slotStart ? `Today · ${slotRange(data.enrolment.slotStart, data.enrolment.slotMinutes ?? 90)}` : 'Next step'}</p>
      <h2>{data.enrolment.slotStart ? data.enrolment.pkg.name : 'Choose your study time'}</h2>
      <p>{data.enrolment.slotStart ? 'Notes, practice and a quick check. Take your time.' : 'Pick a time each day that works at home.'}</p>
      {#if data.enrolment.slotStart}<a class="btn btn-primary" href="/learn">Start today's session</a>{:else}<a class="btn btn-primary" href={`/slot/${data.enrolment.id}`}>Choose a time</a>{/if}
    </section>
  {:else}<section class="card"><p>Your parent can enrol you in a holiday package from their Overview screen.</p></section>{/if}
  <section class="card"><div class="row"><strong>This week</strong><span class="muted">{data.week.studyDays} of 7 study days</span></div>{@render week(data.week)}</section>
  <section class="card"><strong>Your subjects</strong>
    {#each data.week.subjectScores as s}<div class="meter"><div class="row"><span>{s.subject}</span><span>{s.pct}%</span></div><div class="bar"><i style={`width:${s.pct}%`}></i></div></div>
    {:else}<p class="muted">Finish a quiz and your subjects appear here.</p>{/each}
  </section>
  {@render verseCard(data.verse)}
  <form method="post" action="?/exitChild"><button class="secondary sm">Switch back to parent</button></form>
{:else if data.mode === 'guardian'}
  <p class="eyebrow">Parent view</p><h1>Today</h1>
  {#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
  {#each data.children as c}
    <section class="card">
      <div class="row"><div><p class="eyebrow">{c.enrolment ? `Week ${c.week.weekNo} of ${c.week.weeks}` : 'Not enrolled yet'}</p><h2 style="margin:0">{c.name}</h2></div>
        <form method="post" action="?/studyAs" use:enhance><input type="hidden" name="child" value={c.id} /><button class="secondary sm">Study as {c.name.split(' ')[0]}</button></form></div>
      {#if c.enrolment}
        <div style="margin-top:12px"><strong>Study days</strong>{@render week(c.week)}</div>
        {#if c.week.subjectScores.length}<div style="margin-top:10px"><strong>Latest quiz scores</strong>
          {#each c.week.subjectScores as s}<div class="row" style="margin-top:6px"><span>{s.subject}</span><span class={`chip ${s.pct < 40 ? 'gold' : ''}`}>{s.pct}%{s.pct < 40 ? ' · needs support' : ''}</span></div>{/each}</div>{/if}
        <a class="btn btn-green" style="margin-top:14px" href="/progress?child={c.id}">See progress</a>
      {:else if data.packages.length}
        <form method="post" action="?/enrol" use:enhance>
          <input type="hidden" name="child" value={c.id} />
          <label for={`p${c.id}`}>Holiday package</label>
          <select id={`p${c.id}`} name="pkg">{#each data.packages as p}<option value={p.id}>{p.name}</option>{/each}</select>
          <p class="muted">By enrolling {c.name.split(' ')[0]} you consent to their learning data being used for this package.</p>
          <button class="primary">Enrol with my consent</button>
        </form>
      {:else}<p class="muted">The school has not opened a holiday package yet.</p>{/if}
    </section>
  {:else}<section class="card empty">No children linked yet. <a href="/join">Join a school</a> with its class code.</section>{/each}
  {@render verseCard(data.verse)}
  {#each data.notices as n}<article class="card"><span class={`pill ${n.priority === 'emergency' ? 'emergency' : n.priority === 'important' ? 'warn' : ''}`}>{n.priority}</span> <strong>{n.title}</strong><p>{n.body}</p>{#if n.verse}<p class="muted">{n.verse}</p>{/if}</article>{/each}
  {#each data.requests as r}<div class="card row"><span>{r.body.slice(0, 50)}</span><span class="pill">{r.status.replace('_', ' ')}</span></div>{/each}
  <a class="btn btn-secondary" style="width:100%" href="/messages">Message teacher</a>
{:else if data.mode === 'staff'}
  <div class="pagehead"><div><p class="eyebrow">{data.classes[0]?.cls.name ?? 'Your school'}</p><h1 style="margin:0">Class overview</h1></div>
    {#if data.classes[0]}<a class="btn btn-primary" href={`/teacher/${data.classes[0].cls.id}`}>Assign today's task</a>{/if}</div>
  {#if data.pending}<a class="card" href="/school/requests"><strong>{data.pending}</strong> family request{data.pending > 1 ? 's' : ''} waiting for approval →</a>{/if}
  <div class="tiles">
    <div class="tile"><small>Enrolled</small><b>{stat.enrolled}</b></div>
    <div class="tile"><small>Studied today</small><b>{stat.today}</b></div>
    <div class="tile"><small>Avg hours this week</small><b>{stat.avg}</b></div>
    <div class="tile"><small>Need attention</small><b>{stat.attention}</b></div>
  </div>
  {#if data.isAdmin}<div class="row" style="justify-content:flex-start;flex-wrap:wrap"><a class="btn btn-secondary sm" href="/school/setup">Classes and packages</a><a class="btn btn-secondary sm" href="/school/poster.pdf">Poster (PDF)</a></div>{/if}
  {#each data.classes as c}
    <section class="card"><div class="row"><h2>{c.cls.name}</h2><span class="muted">Class code <strong>{c.cls.joinCode}</strong></span></div>
      {#if c.students.length}
      <div class="scroll"><table><thead><tr><th>Student</th><th>Study slot</th><th>This week</th><th>Last quiz</th><th>Status</th></tr></thead><tbody>
        {#each c.students as s}<tr><td>{s.name}</td><td>{s.slot ? clock(s.slot) : '–'}</td><td>{hm(s.minutes)}</td><td>{s.last === null ? 'n/a' : s.last + '%'}</td>
          <td><span class={`chip ${tone[s.status]}`}>{label[s.status]}</span></td></tr>{/each}
      </tbody></table></div>
      <a class="btn btn-secondary sm" style="margin-top:12px" href={`/teacher/${c.cls.id}`}>Assign a task or review work</a>
      {:else}<p class="empty">No students yet. Share the class code or the poster.</p>{/if}
    </section>
  {:else}<section class="card empty">No classes yet.{#if data.isAdmin} <a href="/school/setup">Create your first class</a>.{/if}</section>{/each}
{/if}
