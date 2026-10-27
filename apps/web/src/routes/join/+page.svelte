<script lang="ts">
  let { data, form } = $props();
</script>
<svelte:head><title>Join a school · Classroom</title></svelte:head>
<h1>Join your child's school</h1>
{#if form?.sent}
  <p class="ok">Thank you. {form.school} will review your request. You will see your child here once the school approves. Scanning a code does not give access on its own.</p>
{:else if data.target}
  <p class="card"><strong>{data.target.schoolName}</strong>{#if data.target.className} · {data.target.className}{/if}</p>
  {#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
  <form method="post" action="?/request" class="card">
    <input type="hidden" name="code" value={data.code} />
    <label for="child">Your child's full name</label><input id="child" name="child" required />
    <button class="primary" style="margin-top:12px">Ask the school to link my child</button>
  </form>
{:else}
  {#if data.notFound}<p class="err" role="alert">That code is not valid, or the school has not been verified yet.</p>{/if}
  {#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
  <form method="post" action="?/lookup" class="card">
    <label for="code">School or class code</label><input id="code" name="code" autocapitalize="characters" placeholder="K7QM-4TXD" required />
    <p class="muted">Find it on the school's poster, or scan the QR code with your phone camera.</p>
    <button class="primary">Continue</button>
  </form>
{/if}
