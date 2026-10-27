<script lang="ts">
  let { data }: { data: any } = $props();
</script>
<svelte:head><title>Account · Classroom</title></svelte:head>
<p class="eyebrow">Account</p>
<h1>{data.name}</h1>
<section class="card">
  <div class="row"><span class="muted">Phone</span><strong>{data.phone}</strong></div>
  <div class="row" style="margin-top:8px"><span class="muted">Role</span><span class="chip">{data.roles.map((r: string) => r.replace('_', ' ')).join(', ') || 'No school yet'}</span></div>
</section>
<form method="post" action="/logout"><button class="secondary" style="width:100%">Sign out</button></form>
