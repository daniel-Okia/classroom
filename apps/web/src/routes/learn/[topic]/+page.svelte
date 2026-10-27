<script lang="ts">
  import 'katex/dist/katex.min.css';
  import { onMount } from 'svelte';
  import { send, key } from '$lib/outbox';
  import PageHead from '$lib/ui/PageHead.svelte';
  import Steps from '$lib/ui/Steps.svelte';
  let { data }: { data: any } = $props();
  const steps = $derived([...(data.opening ? ['open'] : []), 'notes', 'practice', 'check', 'done']);
  let step = $state(0);
  let answers: (number | null)[] = $state(data.items.map(() => null));
  let result: any = $state(null); let queued = $state(false); let checkedIn = $state(false); let failMsg = $state('');
  let seconds = $state(0); let lastActive = Date.now();
  const quizKey = key(), checkKey = key();
  const notes = $derived(data.sections.filter((s: any) => s.title === 'Key idea' || s.title === 'Worked example'));
  const practice = $derived(data.sections.find((s: any) => s.title === 'Practice'));
  const checklist = $derived(data.sections.find((s: any) => s.title === 'Check yourself'));

  // Active time: count seconds only while the page is visible and the learner touched it in the last 60s.
  onMount(() => {
    const touch = () => (lastActive = Date.now());
    for (const ev of ['pointerdown', 'keydown', 'scroll']) addEventListener(ev, touch, { passive: true });
    const t = setInterval(() => { if (document.visibilityState === 'visible' && Date.now() - lastActive < 60_000) seconds += 1; }, 1000);
    return () => clearInterval(t);
  });
  async function submitQuiz() {
    failMsg = '';
    try { const r = await send({ type: 'quiz', clientKey: quizKey, quizId: data.quizId, answers }); if (r) result = r; else queued = true; step = steps.indexOf('done'); }
    catch (e: any) { failMsg = e.message; }
  }
  async function checkIn() {
    const r = await send({ type: 'checkin', clientKey: checkKey, date: new Date().toISOString().slice(0, 10), activeSeconds: seconds });
    checkedIn = true; if (!r) queued = true;
  }
  const mins = $derived(Math.floor(seconds / 60));
</script>
<svelte:head><title>{data.title} · Classroom</title></svelte:head>
<PageHead eyebrow="Lesson" title={data.title} back="/learn" backLabel="Library" />
<Steps steps={steps.map((x) => ({ open: 'Moment', notes: 'Notes', practice: 'Practice', check: 'Quiz', done: 'Done' }[x] ?? x))} at={step} />

{#if steps[step] === 'open'}
  <section class="card" aria-label="Opening moment">
    <h2>A quiet moment</h2>
    {#if data.opening.verse}<p><strong>{data.opening.verse.reference}</strong></p>{/if}
    <p>{data.opening.prayer}</p>
    <button class="green" onclick={() => (step += 1)}>Begin</button>
  </section>
{:else if steps[step] === 'notes'}
  {#each notes as s}<section class="card"><h2>{s.title}</h2>{@html s.html}</section>{/each}
  <button class="green" onclick={() => (step += 1)}>Now practise</button>
{:else if steps[step] === 'practice'}
  {#if practice}<section class="card"><h2>{practice.title}</h2>{@html practice.html}</section>{/if}
  {#if checklist}<section class="card"><h2>{checklist.title}</h2>{@html checklist.html}</section>{/if}
  <button class="green" onclick={() => (step += 1)}>{data.items.length ? 'Take the quiz' : 'Finish'}</button>
{:else if steps[step] === 'check'}
  {#if !data.canSubmit}<p class="ok">You are previewing as an adult. Tap "Study as" on the Home screen to take the quiz as your child.</p>{/if}
  {#if failMsg}<p class="err" role="alert">{failMsg}</p>{/if}
  <form onsubmit={(e) => { e.preventDefault(); submitQuiz(); }}>
    {#each data.items as it, i}
      <fieldset class="card"><legend><strong>{i + 1}. {it.q}</strong></legend>
        {#each it.options as o, j}<label style="font-weight:400;display:flex;gap:10px;align-items:center;min-height:44px"><input type="radio" style="width:24px;min-height:24px" name={`q${i}`} value={j} checked={answers[i] === j} onchange={() => (answers[i] = j)} /> {o}</label>{/each}
      </fieldset>{/each}
    <button class="green" style="width:100%" disabled={!data.canSubmit}>Submit my answers</button>
  </form>
{:else}
  <section class="card" aria-live="polite">
    {#if result}
      <h2>You scored {result.score} out of {result.max}</h2>
      <ul>{#each result.feedback as f, i}<li>{f.correct ? '✓' : '✗'} Question {i + 1}: {f.correct ? 'Well done.' : `The answer is ${f.right}.`} {f.explain}</li>{/each}</ul>
    {:else if queued}<h2>Saved on this phone</h2><p>You are offline. We will send your answers and mark them when you are back online.</p>
    {:else}<h2>Well done</h2>{/if}
    <p class="muted">Active study time today in this lesson: {mins} min.</p>
    {#if data.canSubmit && !checkedIn}<button class="green" onclick={checkIn}>I studied today: check in</button>{:else if checkedIn}<p class="ok">{queued ? 'Check-in saved, it will sync later.' : 'Checked in. Great work today.'}</p>{/if}
    <p><a class="btn btn-secondary" href="/learn">Back to library</a></p>
  </section>
{/if}
