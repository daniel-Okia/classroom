<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import Steps from '$lib/ui/Steps.svelte';
  let { form } = $props();
  const levels = ['Nursery', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
</script>
<svelte:head><title>Register your school · Classroom</title></svelte:head>
<PageHead eyebrow="Schools" title={form?.done ? 'Thank you' : 'Register your school'} back="/" />
<Steps steps={['School details', 'Verification', 'Invite families']} at={form?.done ? 1 : 0} />
{#if form?.done}
  <section class="card"><p class="ok">Your school is registered. A platform admin will verify it, usually within a day. Parents can join once it is verified.</p>
  <p>Your school code: <strong>{form.code}</strong></p><a class="btn btn-green" href="/">Continue</a></section>
{:else}
  <Flash error={form?.error} />
  <form method="post" class="card">
    <label for="name">School name</label><input id="name" name="name" value={form?.v?.name ?? ''} required />
    <label for="district">District</label><input id="district" name="district" value={form?.v?.district ?? ''} required />
    <div class="row" style="align-items:flex-start"><div style="flex:1"><label for="from">Lowest class</label><select id="from" name="from">{#each levels as l}<option>{l}</option>{/each}</select></div>
    <div style="flex:1"><label for="to">Highest class</label><select id="to" name="to">{#each levels as l, i}<option selected={i === levels.length - 1}>{l}</option>{/each}</select></div></div>
    <label for="contact">School contact phone</label><input id="contact" name="contact" type="tel" value={form?.v?.contact ?? ''} required />
    <label for="faith">Faith content</label>
    <select id="faith" name="faith"><option value="light" selected>Light (verse of the day, opening moment)</option><option value="full">Full (adds devotions and reflections)</option><option value="off">Off (no faith content)</option></select>
    <p class="muted">You can change this later. Families can adjust it too.</p>
    <button class="green" style="margin-top:12px">Register school</button>
  </form>
{/if}
