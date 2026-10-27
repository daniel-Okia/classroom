<script lang="ts">
  import { hm, pct } from '$lib/format';
  let { w }: { w: { days: boolean[]; minutes: number; goalHours: number; dayIndex: number } } = $props();
  const D = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], N = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
</script>
<div class="dots" role="img" aria-label={`Study days this week: ${w.days.map((d, i) => `${N[i]} ${d ? 'studied' : 'not yet'}`).join(', ')}`}>
  {#each w.days as d, i}<div><span class:on={d} class:today={!d && i === w.dayIndex} class:future={!d && i > w.dayIndex} aria-hidden="true">{d ? '✓' : ''}</span>{D[i]}</div>{/each}
</div>
<div class="row" style="margin-top:8px"><span class="muted">{hm(w.minutes)} of {w.goalHours}h goal</span><strong>{pct(w.minutes, w.goalHours)}%</strong></div>
<div class="bar" aria-hidden="true" style="margin-top:6px"><i style={`width:${pct(w.minutes, w.goalHours)}%`}></i></div>
