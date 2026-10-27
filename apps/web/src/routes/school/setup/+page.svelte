<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import Tabs from '$lib/ui/Tabs.svelte';
  import Empty from '$lib/ui/Empty.svelte';
  import { page } from '$app/stores';
  import { clock } from '$lib/format';
  let { data, form } = $props();
  const tab = $derived($page.url.searchParams.get('tab') ?? 'classes');
</script>
<svelte:head><title>Classes and packages · Classroom</title></svelte:head>
<PageHead eyebrow="School admin" title="Classes and packages" back="/">
  <a class="btn btn-secondary sm" href="/school/poster.pdf">Poster (PDF)</a>
</PageHead>
<Flash error={form?.error} />
<Tabs tabs={[{ id: 'classes', label: 'Classes', count: data.classes.length }, { id: 'packages', label: 'Holiday packages', count: data.packages.length }]} />
{#if tab === 'classes'}
  {#each data.classes as c}<div class="card row"><div><strong>{c.name}</strong><p class="muted">{c.level}</p></div><span class="chip">Code {c.joinCode}</span></div>
  {:else}<Empty title="No classes yet">Add your first class below. Each class gets a join code for families.</Empty>{/each}
  <form method="post" action="?/addClass" class="card"><h2>Add a class</h2>
    <label for="cn">Class name</label><input id="cn" name="name" placeholder="S4 East" required />
    <label for="cl">Level</label><input id="cl" name="level" placeholder="S4" required />
    <button class="green" style="margin-top:12px">Add class</button></form>
{:else}
  {#each data.packages as p}<div class="card"><strong>{p.name}</strong><p class="muted">{p.startDate} to {p.endDate} · {p.weeklyHourGoal}h a week</p><p>Start times: {p.slotOptions.map(clock).join(', ')}</p></div>
  {:else}<Empty title="No holiday packages yet">A package sets the dates, weekly hours and daily start times for families.</Empty>{/each}
  <form method="post" action="?/addPackage" class="card"><h2>Add a package</h2>
    <label for="pn">Name</label><input id="pn" name="name" placeholder="December Holiday Pack" required />
    <div class="row" style="align-items:flex-start"><div style="flex:1"><label for="ps">Start date</label><input id="ps" name="start" type="date" required /></div><div style="flex:1"><label for="pe">End date</label><input id="pe" name="end" type="date" required /></div></div>
    <label for="pg">Weekly hour goal</label><input id="pg" name="goal" type="number" min="1" max="14" value="9" required />
    <label for="pl">Daily start times (comma separated)</label><input id="pl" name="slots" value="09:00, 16:00, 18:00" required />
    <button class="green" style="margin-top:12px">Add package</button></form>
{/if}
