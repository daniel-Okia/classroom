<script lang="ts">
  let { data, form } = $props();
</script>
<h1>Choose your study time</h1>
{#if !data.pkg}<p class="err">We could not find that package.</p>{:else}
{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
<form method="post" class="card">
  <p>Goal: {data.pkg.weeklyHourGoal} hours a week.</p>
  <label for="start">Start time</label><select id="start" name="start">{#each data.pkg.slotOptions as s}<option>{s}</option>{/each}</select>
  <label for="minutes">How long each day</label><select id="minutes" name="minutes"><option value="60">1 hour</option><option value="90" selected>1 hour 30 minutes</option><option value="120">2 hours</option></select>
  <button class="primary" style="margin-top:12px">Save my study time</button>
</form>{/if}
