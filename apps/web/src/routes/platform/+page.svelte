<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  import Empty from '$lib/ui/Empty.svelte';
  let { data } = $props();
</script>
<svelte:head><title>Verify schools · Classroom</title></svelte:head>
<PageHead eyebrow="Platform admin" title="Schools waiting" back="/" />
{#each data.schools as s}
  <section class="card"><h2>{s.name}</h2><p>{s.district} · {s.levelFrom} to {s.levelTo} · {s.contactPhone}</p>
    <p class="muted">Call the school's contact number to confirm before approving.</p>
    <form method="post" action="?/decide" class="actions2"><input type="hidden" name="id" value={s.id} />
      <button class="green" name="approve" value="1">Approve</button><button class="secondary" name="approve" value="0">Reject</button></form></section>
{:else}<Empty title="Nothing waiting" />{/each}
