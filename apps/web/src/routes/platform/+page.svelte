<script lang="ts">
  let { data } = $props();
</script>
<h1>Schools waiting for verification</h1>
{#each data.schools as s}
  <section class="card"><h2 style="margin:0">{s.name}</h2><p>{s.district} · {s.levelFrom} to {s.levelTo} · {s.contactPhone}</p>
    <p class="muted">Call the school's contact number to confirm before approving.</p>
    <form method="post" action="?/decide" class="row"><input type="hidden" name="id" value={s.id} />
      <button class="primary" name="approve" value="1">Approve</button><button class="secondary" name="approve" value="0">Reject</button></form></section>
{:else}<p class="card">Nothing waiting.</p>{/each}
