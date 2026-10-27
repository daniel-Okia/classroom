<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import { clock } from '$lib/format';
  let { data, form } = $props();
</script>
<svelte:head><title>Study time · Classroom</title></svelte:head>
<PageHead eyebrow="Holiday pack" title="Choose a study time" back="/" />
{#if !data.pkg}<Flash error="We could not find that package." />{:else}
<Flash error={form?.error} />
<form method="post" class="card">
  <p>Goal: <strong>{data.pkg.weeklyHourGoal} hours a week</strong>.</p>
  <label for="start">Start time</label><select id="start" name="start">{#each data.pkg.slotOptions as s}<option value={s}>{clock(s)}</option>{/each}</select>
  <label for="minutes">How long each day</label><select id="minutes" name="minutes"><option value="60">1 hour</option><option value="90" selected>1 hour 30 minutes</option><option value="120">2 hours</option></select>
  <button class="green" style="margin-top:14px">Save study time</button>
</form>{/if}
