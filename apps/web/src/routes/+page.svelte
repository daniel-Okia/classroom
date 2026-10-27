<script lang="ts">
  import { enhance } from '$app/forms';
  import { slotRange, clock, hm, greeting } from '$lib/format';
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import Empty from '$lib/ui/Empty.svelte';
  import Steps from '$lib/ui/Steps.svelte';
  import Week from '$lib/ui/Week.svelte';
  import Checklist from '$lib/ui/Checklist.svelte';
  let { data, form }: { data: any; form: any } = $props();
  const label: Record<string, string> = { on_track: 'On track', behind: 'Behind', not_started: 'Not started' };
  const tone: Record<string, string> = { on_track: '', behind: 'gold', not_started: 'dark' };
  const students = $derived(data.mode === 'staff' ? data.classes.flatMap((c: any) => c.students) : []);
  const stat = $derived({
    enrolled: students.length, today: students.filter((s: any) => s.studiedToday).length,
    avg: students.length ? (students.reduce((a: number, s: any) => a + s.minutes, 0) / students.length / 60).toFixed(1) : '0',
    attention: students.filter((s: any) => s.status !== 'on_track').length,
  });
  const setup = $derived(data.mode === 'staff' && data.isAdmin ? [
    { label: 'School verified', done: data.verified, hint: 'A platform admin confirms your school by phone, usually within a day.' },
    { label: 'Create a class', done: data.classes.length > 0, href: '/school/setup', cta: 'Add class', hint: 'Each class gets its own join code.' },
    { label: 'Create a holiday package', done: data.packageCount > 0, href: '/school/setup', cta: 'Add package', hint: 'Set dates, weekly hours and daily start times.' },
    { label: 'Invite families', done: students.length > 0 || data.pending > 0, href: '/school/poster.pdf', cta: 'Get poster', hint: 'Print the poster or share the class code.' },
    { label: 'Approve family requests', done: students.length > 0 && data.pending === 0, href: '/school/requests', cta: data.pending ? `Review ${data.pending}` : 'Open', hint: 'Check each name against your register.' },
  ] : []);
  const kidSteps = (c: any) => [
    { label: 'Linked to school', done: true },
    { label: 'Enrol in a holiday package', done: !!c.enrolment, hint: 'You give consent for their learning data to be used.' },
    { label: 'Choose a daily study time', done: !!c.enrolment?.slotStart, href: c.enrolment ? `/slot/${c.enrolment.id}` : undefined, cta: 'Choose time', hint: 'One to two hours, at a time that suits home.' },
    { label: 'First study session', done: c.week.studyDays > 0, hint: `Open Study as ${c.name.split(' ')[0]} and press Start.` },
  ];
</script>
<svelte:head><title>{data.mode === 'public' ? 'Classroom · Learning together' : 'Home · Classroom'}</title></svelte:head>

{#if data.mode === 'public'}
  <div class="landing">
    <div class="logo">Classroom</div>
    <h1>Learning together, at home and at school.</h1>
    <p class="lead">Free study help for Ugandan families, from nursery to S6. Works on cheap phones and slow data.</p>
    <a class="path" href="/login"><span class="ico" aria-hidden="true">👨‍👩‍👧</span><span><strong>I'm a parent or student</strong><span class="d">Sign in with your phone number</span></span><span class="go" aria-hidden="true">→</span></a>
    <a class="path gold" href="/schools/register"><span class="ico" aria-hidden="true">🏫</span><span><strong>I'm a school</strong><span class="d">Register your school, it takes two minutes</span></span><span class="go" aria-hidden="true">→</span></a>
    <h2>How it works</h2>
    <ol class="how">
      <li><b>1</b><span>The school registers and is verified.</span></li>
      <li><b>2</b><span>Parents join with the school's class code. The school approves each family.</span></li>
      <li><b>3</b><span>Your child picks a daily study time and learns with short notes, practice and quizzes.</span></li>
      <li><b>4</b><span>Parents and teachers see progress and stay in touch.</span></li>
    </ol>
    <p class="faith">Built on faith. Strengthened at home. Learning together.</p>
  </div>

{:else if data.mode === 'none'}
  <PageHead eyebrow="Welcome" title="Let's get you started" />
  <Steps steps={['Sign in', 'Join or register', 'Start learning']} at={1} />
  <a class="path" href="/join"><span class="ico" aria-hidden="true">👨‍👩‍👧</span><span><strong>Join my child's school</strong><span class="d">Use the code from the school's poster</span></span><span class="go" aria-hidden="true">→</span></a>
  <a class="path gold" href="/schools/register"><span class="ico" aria-hidden="true">🏫</span><span><strong>Register my school</strong><span class="d">For head teachers and school administrators</span></span><span class="go" aria-hidden="true">→</span></a>

{:else if data.mode === 'platform'}
  <PageHead eyebrow="Platform admin" title="Schools waiting" />
  <a class="btn btn-primary" href="/platform">Verify schools</a>

{:else if data.mode === 'student'}
  <PageHead eyebrow={data.enrolment?.pkg.name ?? 'Holiday pack'} title={`${greeting()}, ${data.name.split(' ')[0]}`}>
    {#if data.week.streak >= 2}<span class="chip gold">{data.week.streak}-day streak</span>{/if}
  </PageHead>
  {#if data.enrolment}
    <section class="hero">
      <p class="eyebrow">{data.enrolment.slotStart ? `Today · ${slotRange(data.enrolment.slotStart, data.enrolment.slotMinutes ?? 90)}` : 'Next step'}</p>
      <h2>{data.enrolment.slotStart ? 'Ready when you are' : 'Choose your study time'}</h2>
      <p>{data.enrolment.slotStart ? 'Notes, practice and a quick check. Take your time.' : 'Pick a time each day that works at home.'}</p>
      {#if data.enrolment.slotStart}<a class="btn btn-primary" href="/learn">Start today's session</a>{:else}<a class="btn btn-primary" href={`/slot/${data.enrolment.id}`}>Choose a time</a>{/if}
    </section>
  {:else}<Empty title="Waiting for your parent">Your parent can enrol you in a holiday package from their Home screen.</Empty>{/if}
  <section class="card"><div class="row"><strong>This week</strong><span class="muted">{data.week.studyDays} of 7 study days</span></div><Week w={data.week} /></section>
  <section class="card"><strong>Your subjects</strong>
    {#each data.week.subjectScores as s}<div class="meter"><div class="row"><span>{s.subject}</span><span>{s.pct}%</span></div><div class="bar"><i style={`width:${s.pct}%`}></i></div></div>
    {:else}<p class="muted">Finish a quiz and your subjects appear here.</p>{/each}</section>
  {#if data.verse}<section class="note gold" aria-label="Verse of the day"><span class="label">Verse of the day · {data.verse.reference}</span>{#if data.verse.reflection}<p>{data.verse.reflection}</p>{/if}</section>{/if}
  <form method="post" action="?/exitChild"><button class="secondary sm">Switch back to parent</button></form>

{:else if data.mode === 'guardian'}
  <PageHead eyebrow="Parent view" title="Home" />
  <Flash error={form?.error} />
  {#each data.children as c}
    <section class="card">
      <div class="row"><div><p class="eyebrow">{c.enrolment ? `Week ${c.week.weekNo} of ${c.week.weeks}` : 'Not enrolled yet'}</p><h2 style="margin:0">{c.name}</h2></div>
        {#if c.enrolment?.slotStart}<form method="post" action="?/studyAs" use:enhance><input type="hidden" name="child" value={c.id} /><button class="secondary sm">Study as {c.name.split(' ')[0]}</button></form>{/if}</div>
      {#if c.enrolment?.slotStart}
        <div class="row" style="margin-top:10px"><strong>Study days</strong><span class="muted">{clock(c.enrolment.slotStart)} daily</span></div><Week w={c.week} />
        {#if c.week.subjectScores.length}<div style="margin-top:12px"><strong>Latest quiz scores</strong>
          {#each c.week.subjectScores as s}<div class="row" style="margin-top:6px"><span>{s.subject}</span><span class={`chip ${s.pct < 40 ? 'gold' : ''}`}>{s.pct}%{s.pct < 40 ? ' · needs support' : ''}</span></div>{/each}</div>{/if}
        <a class="btn btn-green" style="margin-top:14px" href={`/progress?child=${c.id}`}>See progress</a>
      {/if}
    </section>
    {#if !c.enrolment}
      <Checklist title={`Get ${c.name.split(' ')[0]} started`} items={kidSteps(c)} />
      {#if data.packages.length}
        <form method="post" action="?/enrol" use:enhance class="card">
          <input type="hidden" name="child" value={c.id} />
          <label for={`p${c.id}`}>Holiday package</label>
          <select id={`p${c.id}`} name="pkg">{#each data.packages as p}<option value={p.id}>{p.name}</option>{/each}</select>
          <p class="muted">By enrolling {c.name.split(' ')[0]} you consent to their learning data being used for this package.</p>
          <button class="primary">Enrol with my consent</button>
        </form>
      {:else}<Empty title="No holiday package yet">The school has not opened one. You will see it here when it does.</Empty>{/if}
    {:else if !c.enrolment.slotStart}<Checklist title={`Get ${c.name.split(' ')[0]} started`} items={kidSteps(c)} />{/if}
  {:else}<Empty title="No children linked yet"><a href="/join">Join a school</a> with its class code. The school approves each request.</Empty>{/each}
  {#each data.notices.slice(0, 2) as n}<article class="card"><span class={`pill ${n.priority === 'emergency' ? 'emergency' : n.priority === 'important' ? 'warn' : ''}`}>{n.priority}</span> <strong>{n.title}</strong><p>{n.body}</p></article>{/each}
  {#if data.notices.length}<a href="/school?tab=notices">All school notices →</a>{/if}
  {#if data.verse}<section class="note gold" aria-label="Verse of the day"><span class="label">Verse of the day · {data.verse.reference}</span>{#if data.verse.reflection}<p>{data.verse.reflection}</p>{/if}</section>{/if}

{:else if data.mode === 'staff'}
  <PageHead eyebrow={data.classes[0]?.cls.name ?? 'Your school'} title="Overview">
    {#if data.classes[0]}<a class="btn btn-primary" href={`/teacher/${data.classes[0].cls.id}`}>Assign today's task</a>{/if}
  </PageHead>
  {#if data.isAdmin && setup.some((i: any) => !i.done)}<Checklist title="Set up your school" items={setup} />{/if}
  {#if data.pending}<a class="card" href="/school/requests"><strong>{data.pending}</strong> family request{data.pending > 1 ? 's' : ''} waiting for approval →</a>{/if}
  <div class="tiles">
    <div class="tile"><small>Enrolled</small><b>{stat.enrolled}</b></div>
    <div class="tile"><small>Studied today</small><b>{stat.today}</b></div>
    <div class="tile"><small>Avg hours this week</small><b>{stat.avg}</b></div>
    <div class="tile"><small>Need attention</small><b>{stat.attention}</b></div>
  </div>
  {#each data.classes as c}
    <section class="card"><div class="row"><h2>{c.cls.name}</h2><span class="muted">Class code <strong>{c.cls.joinCode}</strong></span></div>
      {#if c.students.length}
      <div class="scroll"><table><thead><tr><th>Student</th><th>Study slot</th><th>This week</th><th>Last quiz</th><th>Status</th></tr></thead><tbody>
        {#each c.students as s}<tr><td>{s.name}</td><td>{s.slot ? clock(s.slot) : '–'}</td><td>{hm(s.minutes)}</td><td>{s.last === null ? 'n/a' : s.last + '%'}</td>
          <td><span class={`chip ${tone[s.status]}`}>{label[s.status]}</span></td></tr>{/each}
      </tbody></table></div>
      <a class="btn btn-secondary sm" style="margin-top:12px" href={`/teacher/${c.cls.id}`}>Assign a task or review work</a>
      {:else}<p class="empty muted">No students yet. Share the class code or the poster.</p>{/if}
    </section>
  {:else}{#if !data.isAdmin}<Empty title="No classes yet">Ask your school administrator to add you to a class.</Empty>{/if}{/each}
{/if}
