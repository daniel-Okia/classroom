<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  import { hm, pct } from '$lib/format';
  let { data }: { data: any } = $props();
  const w = $derived(data.week);
  const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
</script>
<svelte:head><title>Progress · Classroom</title></svelte:head>
<PageHead eyebrow={`Week ${w.weekNo} of ${w.weeks}`} title="Progress" />
<section class="card"><div class="row"><strong>Study days</strong><span class="muted">{hm(w.minutes)} of {w.goalHours}h goal</span></div>
  <div class="dots">{#each w.days as d, i}<div><span class:on={d} class:today={!d && i === w.dayIndex} class:future={!d && i > w.dayIndex}>{d ? '✓' : ''}</span>{DAYS[i]}</div>{/each}</div>
  <div class="bar" style="margin-top:8px"><i style={`width:${pct(w.minutes, w.goalHours)}%`}></i></div></section>
<section class="card"><strong>Latest quiz scores</strong>
  {#each w.subjectScores as s}<div class="row" style="margin-top:8px"><span>{s.subject}</span><span class={`chip ${s.pct < 40 ? 'gold' : ''}`}>{s.pct}%{s.pct < 40 ? ' · needs support' : ''}</span></div>{:else}<p class="muted">No quizzes taken yet.</p>{/each}</section>
<p class="muted">Frequently tested topics will appear here when teachers add them. Frequently tested, not a prediction.</p>
