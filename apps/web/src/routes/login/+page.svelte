<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>
<svelte:head><title>Sign in · Classroom</title></svelte:head>
<h1>Welcome to Classroom</h1>
<p class="muted">Built on faith. Strengthened at home. Learning together.</p>
{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
{#if !form?.sent}
  <form method="post" action="?/send" use:enhance class="card">
    <label for="phone">Your phone number</label>
    <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0772 123 456" value={form?.phone ?? ''} required />
    <p class="muted">We will text you a 6-digit code. No password needed.</p>
    <button class="primary">Send my code</button>
  </form>
{:else}
  <form method="post" action="?/verify" class="card">
    <input type="hidden" name="phone" value={form.phone} />
    <p class="ok">We sent a code to {form.phone}.</p>
    {#if form.demoCode}<p class="muted" role="status">Demo site: no SMS is sent. Your code is <strong>{form.demoCode}</strong>.</p>{/if}
    <label for="code">6-digit code</label>
    <input id="code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required />
    <label for="name">Your name (first time only)</label>
    <input id="name" name="name" autocomplete="name" />
    <button class="primary" style="margin-top:16px">Continue</button>
  </form>
{/if}
