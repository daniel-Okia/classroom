<script lang="ts">
  let { data }: { data: any } = $props();
  const w = $derived(data.week);
</script>
<h1>Progress</h1>
<section class="card"><strong>Study days</strong>
  <div class="dots">{#each w.days as d, i}<span class:on={d}>{d ? '✓' : 'MTWTFSS'[i]}</span>{/each}</div>
  <p>{Math.floor(w.minutes / 60)}h {w.minutes % 60}m of {w.goalHours}h goal</p></section>
<section class="card"><strong>Quiz scores</strong>
  {#each w.scores as s}<div class="row"><span>{s.topic}</span><span>{Math.round((s.score / s.max) * 100)}%</span></div>{:else}<p class="muted">No quizzes taken yet.</p>{/each}</section>
<p class="muted">Frequently tested topics will appear here when teachers add them. Frequently tested, not a prediction.</p>
