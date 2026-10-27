<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import Steps from '$lib/ui/Steps.svelte';
  let { data, form } = $props();
</script>
<svelte:head><title>Join a school · Classroom</title></svelte:head>
<PageHead eyebrow="Parents" title="Join your child's school" back="/" />
<Steps steps={['School code', 'Your child', 'School approves']} at={form?.sent ? 2 : data.target ? 1 : 0} />
{#if form?.sent}
  <section class="card"><h2>Request sent</h2><p>{form.school} will review it. You will see your child on your Home screen once the school approves. Scanning a code does not give access on its own.</p><a class="btn btn-green" href="/">Back to Home</a></section>
{:else if data.target}
  <section class="card"><strong>{data.target.schoolName}</strong>{#if data.target.className}<p class="muted">{data.target.className}</p>{/if}</section>
  <Flash error={form?.error} />
  <form method="post" action="?/request" class="card">
    <input type="hidden" name="code" value={data.code} />
    <label for="child">Your child's full name</label><input id="child" name="child" required autocomplete="off" />
    <button class="green" style="margin-top:14px">Ask the school to link my child</button>
  </form>
{:else}
  <Flash error={data.notFound ? 'That code is not valid, or the school has not been verified yet.' : form?.error} />
  <form method="post" action="?/lookup" class="card">
    <label for="code">School or class code</label><input id="code" name="code" autocapitalize="characters" placeholder="K7QM-4TXD" required />
    <p class="muted">Find it on the school's poster, or scan the QR code with your phone camera.</p>
    <button class="green">Continue</button>
  </form>
{/if}
