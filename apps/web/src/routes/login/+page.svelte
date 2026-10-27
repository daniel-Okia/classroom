<script lang="ts">
  import { enhance } from '$app/forms';
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import Steps from '$lib/ui/Steps.svelte';
  let { data, form } = $props();
</script>
<svelte:head><title>Sign in · Classroom</title></svelte:head>
<div class="landing">
  <a class="back" href="/"><span aria-hidden="true">←</span> Back</a>
  <PageHead eyebrow="Classroom" title={form?.sent ? 'Enter your code' : 'Sign in'} />
  <Steps steps={['Phone number', 'Code']} at={form?.sent ? 1 : 0} />
  <Flash error={form?.error} />
  {#if !form?.sent}
    <form method="post" action="?/send" use:enhance class="card">
      <input type="hidden" name="next" value={data.next ?? ''} />
      <label for="phone">Your phone number</label>
      <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0772 123 456" value={form?.phone ?? ''} required />
      <p class="muted">We text you a 6-digit code. No password needed.</p>
      <button class="green" style="margin-top:8px">Send my code</button>
    </form>
  {:else}
    <form method="post" action="?/verify" class="card">
      <input type="hidden" name="phone" value={form.phone} /><input type="hidden" name="next" value={form.next ?? data.next ?? ''} />
      <p class="ok">We sent a code to {form.phone}.</p>
      {#if form.demoCode}<p class="note gold" role="status"><span class="label">Demo site</span> No SMS is sent. Your code is <strong>{form.demoCode}</strong>.</p>{/if}
      <label for="code">6-digit code</label>
      <input id="code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required />
      <label for="name">Your name (first time only)</label>
      <input id="name" name="name" autocomplete="name" />
      <button class="green" style="margin-top:14px">Continue</button>
      <p style="text-align:center"><a href="/login">Use a different number</a></p>
    </form>
  {/if}
</div>
