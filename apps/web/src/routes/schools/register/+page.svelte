<script lang="ts">
  let { form } = $props();
  const levels = ['Nursery', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
</script>
<svelte:head><title>Register your school · Classroom</title></svelte:head>
{#if form?.done}
  <h1>Thank you</h1>
  <p class="ok">Your school is registered. A platform admin will verify it, usually within a day. Parents can join once it is verified.</p>
  <p>Your school code: <strong>{form.code}</strong></p><a class="btn btn-primary" href="/">Continue</a>
{:else}
  <h1>Register your school</h1>
  {#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}
  <form method="post" class="card">
    <label for="name">School name</label><input id="name" name="name" value={form?.v?.name ?? ''} required />
    <label for="district">District</label><input id="district" name="district" value={form?.v?.district ?? ''} required />
    <label for="from">Lowest class</label><select id="from" name="from">{#each levels as l}<option>{l}</option>{/each}</select>
    <label for="to">Highest class</label><select id="to" name="to">{#each levels as l, i}<option selected={i === levels.length - 1}>{l}</option>{/each}</select>
    <label for="contact">School contact phone</label><input id="contact" name="contact" type="tel" value={form?.v?.contact ?? ''} required />
    <label for="faith">Faith content</label>
    <select id="faith" name="faith"><option value="light" selected>Light (verse of the day, opening moment)</option><option value="full">Full (adds devotions and reflections)</option><option value="off">Off (no faith content)</option></select>
    <p class="muted">You can change this later. Families can adjust it too.</p>
    <button class="primary" style="margin-top:12px">Register school</button>
  </form>
{/if}
