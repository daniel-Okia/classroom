<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form }: { data: any; form: any } = $props();
  const pct = (m: number, h: number) => (h ? Math.min(100, Math.round((m / (h * 60)) * 100)) : 0);
  const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const DAYNAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const label: Record<string, string> = { on_track: 'On track', behind: 'Behind', not_started: 'Not started' };
</script>
<svelte:head><title>Home · Classroom</title></svelte:head>

{#snippet verseCard(v: any)}
  {#if v}<section class="card" aria-label="Verse of the day"><strong>{v.reference}</strong>{#if v.reflection}<p>{v.reflection}</p><p class="muted"><em>{v.question}</em></p>{/if}</section>{/if}
{/snippet}
{#snippet week(w: any)}
  <div class="dots" role="img" aria-label={`Study days this week: ${w.days.map((d: boolean, i: number) => `${DAYNAMES[i]} ${d ? 'studied' : 'not yet'}`).join(', ')}`}>
    {#each w.days as d, i}<span class:on={d} aria-hidden="true">{d ? '✓' : DAYS[i]}</span>{/each}
  </div>
  <p>{Math.floor(w.minutes / 60)}h {w.minutes % 60}m of {w.goalHours}h goal</p>
  <div class="bar" aria-hidden="true"><i style={`width:${pct(w.minutes, w.goalHours)}%`}></i></div>
{/snippet}

{#if data.mode === 'none'}
  <h1>Welcome</h1>
  <p>Join your child's school, or register your school.</p>
  <a class="btn btn-primary" href="/join">Join my child's school</a>
  <p></p><a class="btn btn-secondary" href="/schools/register">Register a school</a>
{:else if data.mode === 'platform'}
  <h1>Platform admin</h1><a class="btn btn-primary" href="/platform">Verify schools</a>
{:else if data.mode === 'student'}
  <h1>Good morning, {data.name.split(' ')[0]}</h1>
  <form method="post" action="?/exitChild"><button class="secondary" style="width:auto">Switch back to parent</button></form>
  {#if data.enrolment}
    <section class="hero">
      <p style="margin:0">{data.enrolment.pkg.name} · {data.enrolment.slotStart ? `Today at ${data.enrolment.slotStart}` : 'Pick a daily time'}</p>
      <h2>{data.enrolment.slotStart ? 'Ready when you are' : 'Choose your study time'}</h2>
      {#if data.enrolment.slotStart}<a class="btn btn-primary" href="/learn">Start today's session</a>{:else}<a class="btn btn-primary" href={`/slot/${data.enrolment.id}`}>Choose a time</a>{/if}
    </section>
  {:else}<p class="card">Your parent can enrol you in a holiday package from their Home screen.</p>{/if}
  {@render verseCard(data.verse)}
  <section class="card"><strong>This week</strong>{@render week(data.week)}</section>
{:else if data.mode === 'guardian'}
  <h1>Today</h1>
  {@render verseCard(data.verse)}
  {#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
  {#each data.children as c}
    <section class="card">
      <div class="row"><h2 style="margin:0">{c.name}</h2>
        <form method="post" action="?/studyAs" use:enhance><input type="hidden" name="child" value={c.id} /><button class="secondary" style="width:auto">Study as {c.name.split(' ')[0]}</button></form></div>
      {#if c.enrolment}{@render week(c.week)}
        <a href="/progress?child={c.id}">See progress</a>
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
  {/each}
  {#each data.notices as n}<article class="card"><span class={`pill ${n.priority === 'emergency' ? 'emergency' : n.priority === 'important' ? 'warn' : ''}`}>{n.priority}</span> <strong>{n.title}</strong><p>{n.body}</p>{#if n.verse}<p class="muted">{n.verse}</p>{/if}</article>{/each}
  {#each data.requests as r}<div class="card row"><span>{r.body.slice(0, 50)}</span><span class="pill">{r.status.replace('_', ' ')}</span></div>{/each}
{:else if data.mode === 'staff'}
  <h1>Class overview</h1>
  {#if data.pending}<a class="card" style="display:block" href="/school/requests"><strong>{data.pending}</strong> family request{data.pending > 1 ? 's' : ''} waiting for approval</a>{/if}
  {#if data.isAdmin}<div class="row"><a class="btn btn-secondary" href="/school/setup">Classes and packages</a><a class="btn btn-secondary" href="/school/poster.pdf">Poster (PDF)</a></div>{/if}
  {#each data.classes as c}
    <section class="card"><h2 style="margin-top:0">{c.cls.name} <span class="muted">code {c.cls.joinCode}</span></h2>
      {#if c.students.length}
      <table><thead><tr><th>Student</th><th>Slot</th><th>This week</th><th>Last quiz</th><th>Status</th></tr></thead><tbody>
        {#each c.students as s}<tr><td>{s.name}</td><td>{s.slot ?? '-'}</td><td>{Math.floor(s.minutes / 60)}h {s.minutes % 60}m</td><td>{s.last === null ? 'n/a' : s.last + '%'}</td>
          <td><span class={`pill ${s.status === 'behind' ? 'warn' : s.status === 'not_started' ? 'dark' : ''}`}>{label[s.status]}</span></td></tr>{/each}
      </tbody></table>
      <a class="btn btn-secondary" style="margin-top:12px" href={`/teacher/${c.cls.id}`}>Assign a task or review work</a>
      {:else}<p class="muted">No students yet. Share the class code or poster.</p>{/if}
    </section>
  {/each}
{/if}
<form method="post" action="/logout" style="margin-top:32px"><button class="secondary" style="width:auto">Sign out</button></form>
