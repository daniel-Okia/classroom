<script lang="ts">
  import { page } from '$app/stores';
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import Tabs from '$lib/ui/Tabs.svelte';
  let { form }: { form: any } = $props();
  const tab = $derived($page.url.searchParams.get('tab') ?? 'notice');
</script>
<svelte:head><title>Post to families · Classroom</title></svelte:head>
<PageHead eyebrow="School" title="Post to families" back="/school" backLabel="School" />
<Flash error={form?.error} ok={form?.posted ? 'Notice posted.' : form?.eventPosted ? 'Event added.' : null} />
<Tabs tabs={[{ id: 'notice', label: 'Notice' }, { id: 'event', label: 'Event' }]} />
{#if tab === 'notice'}
<form method="post" action="?/notice" class="card">
  <label for="nt">Title</label><input id="nt" name="title" required /><label for="nb">Message</label><textarea id="nb" name="body" rows="4" required></textarea>
  <label for="np">Priority</label><select id="np" name="priority"><option value="normal">Normal</option><option value="important">Important</option><option value="emergency">Emergency (ignores quiet hours)</option></select>
  <label for="na">Send to</label><select id="na" name="audience"><option value="school">Whole school</option><option value="level">One level</option></select>
  <label for="nl">Level (if one level)</label><input id="nl" name="level" placeholder="S4" />
  <label for="nv">School verse (optional)</label><input id="nv" name="verse" /><button class="green" style="margin-top:14px">Post notice</button></form>
{:else}
<form method="post" action="?/event" class="card">
  <label for="et">Title</label><input id="et" name="title" required /><label for="ek">Type</label><select id="ek" name="kind"><option>meeting</option><option>trip</option><option>exam</option><option>holiday</option><option>sports</option></select>
  <label for="es">Starts</label><input id="es" name="starts" type="datetime-local" required /><label for="ed">Reply by (optional)</label><input id="ed" name="deadline" type="datetime-local" />
  <label class="check"><input type="checkbox" name="consent" /> Needs parent permission</label>
  <button class="green" style="margin-top:14px">Add event</button></form>
{/if}
