<script lang="ts">
  let { data, form } = $props();
</script>
<h1>Classes and holiday packages</h1>
{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
<section class="card"><h2 style="margin-top:0">Classes</h2>
  {#each data.classes as c}<p><strong>{c.name}</strong> ({c.level}) · join code <code>{c.joinCode}</code></p>{/each}
  <form method="post" action="?/addClass"><label for="cn">Class name</label><input id="cn" name="name" placeholder="S4 East" required />
    <label for="cl">Level</label><input id="cl" name="level" placeholder="S4" required /><button class="primary" style="margin-top:12px">Add class</button></form></section>
<section class="card"><h2 style="margin-top:0">Holiday packages</h2>
  {#each data.packages as p}<p><strong>{p.name}</strong> · {p.startDate} to {p.endDate} · {p.weeklyHourGoal}h a week · slots {p.slotOptions.join(', ')}</p>{/each}
  <form method="post" action="?/addPackage"><label for="pn">Name</label><input id="pn" name="name" placeholder="December Holiday Pack" required />
    <label for="ps">Start date</label><input id="ps" name="start" type="date" required /><label for="pe">End date</label><input id="pe" name="end" type="date" required />
    <label for="pg">Weekly hour goal</label><input id="pg" name="goal" type="number" min="1" max="14" value="9" required />
    <label for="pl">Daily start times (comma separated)</label><input id="pl" name="slots" value="09:00, 16:00, 18:00" required />
    <button class="primary" style="margin-top:12px">Add package</button></form></section>
