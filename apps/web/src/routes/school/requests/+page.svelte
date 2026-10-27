<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  import Empty from '$lib/ui/Empty.svelte';
  let { data } = $props();
</script>
<svelte:head><title>Family requests · Classroom</title></svelte:head>
<PageHead eyebrow="School admin" title="Families waiting" back="/" />
<p class="muted">Check each name against your school register before approving.</p>
{#each data.requests as r}
  <section class="card"><h2>{r.childName}</h2>
    <form method="post" action="?/decide" class="actions2"><input type="hidden" name="id" value={r.id} />
      <button class="green" name="approve" value="1">Approve</button><button class="secondary" name="approve" value="0">Not a pupil here</button></form></section>
{:else}<Empty title="No requests waiting">New families appear here when they join with your class code.</Empty>{/each}
