<script lang="ts">
  let { data } = $props();
</script>
<h1>Families waiting for approval</h1>
<p class="muted">Check each name against your school register before approving.</p>
{#each data.requests as r}
  <section class="card"><h2 style="margin:0">{r.childName}</h2>
    <form method="post" action="?/decide" class="row"><input type="hidden" name="id" value={r.id} />
      <button class="primary" name="approve" value="1">Approve</button><button class="secondary" name="approve" value="0">Not a pupil here</button></form></section>
{:else}<p class="card">No requests waiting.</p>{/each}
