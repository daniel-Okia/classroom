<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  let { data }: { data: any } = $props();
</script>
<svelte:head><title>Account · Classroom</title></svelte:head>
<PageHead eyebrow="Account" title={data.name} back="/" backLabel="Home" />
<section class="card">
  <div class="row"><span class="muted">Phone</span><strong>{data.phone}</strong></div>
  <div class="row" style="margin-top:10px"><span class="muted">Role</span><span class="chip">{data.roles.map((r: string) => r.replace('_', ' ')).join(', ') || 'No school yet'}</span></div>
</section>
<form method="post" action="/logout"><button class="secondary" style="width:100%">Sign out</button></form>
