<script lang="ts">
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import Tabs from '$lib/ui/Tabs.svelte';
  import Empty from '$lib/ui/Empty.svelte';
  let { data, form }: { data: any; form: any } = $props();
  const k = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));
  const next: Record<string, string> = { submitted: 'seen', seen: 'in_progress', in_progress: 'resolved' };
  const fmt = (d: string | Date) => new Date(d).toLocaleString('en-UG', { dateStyle: 'medium', timeStyle: 'short' });
  const tab = $derived($page.url.searchParams.get('tab') ?? (data.guardian ? 'notices' : 'events'));
  const unread = $derived(data.notices.filter((n: any) => !n.read).length);
  const tabs = $derived(data.guardian
    ? [{ id: 'notices', label: 'Notices', count: unread }, { id: 'events', label: 'Events' }, { id: 'requests', label: 'Requests' }]
    : [{ id: 'events', label: 'Events' }, { id: 'requests', label: 'Requests', count: data.inbox.filter((r: any) => r.status !== 'resolved').length }]);
  const pill = (p: string) => (p === 'emergency' ? 'emergency' : p === 'important' ? 'warn' : '');
</script>
<svelte:head><title>School · Classroom</title></svelte:head>
<PageHead eyebrow={`${data.school.district} · ${data.school.contact_phone}`} title={data.school.name}>
  {#if !data.guardian}<a class="btn btn-primary sm" href="/school/notices">Post notice or event</a>{/if}
</PageHead>
<Flash error={form?.error} ok={form?.rsvp ? 'Reply saved.' : form?.requested ? 'Request sent to the school.' : null} />
<Tabs {tabs} />

{#if tab === 'notices' && data.guardian}
  {#each data.notices as n}<article class="card"><div class="row"><span class={`pill ${pill(n.priority)}`}>{n.priority}</span>{#if !n.read}<span class="chip gold">New</span>{/if}</div>
    <h2 style="margin:.4em 0 0">{n.title}</h2><p>{n.body}</p>{#if n.verse}<p class="muted"><em>{n.verse}</em></p>{/if}
    {#if !n.read}<form method="post" action="?/read" use:enhance><input type="hidden" name="id" value={n.id} /><button class="secondary sm">Mark as read</button></form>{/if}</article>
  {:else}<Empty title="No notices yet">Messages from the school appear here.</Empty>{/each}

{:else if tab === 'events'}
  {#each data.events as e}<article class="card"><div class="row"><h2 style="margin:0">{e.title}</h2><span class="chip">{e.kind}</span></div>
    <p>{fmt(e.startsAt)}</p>{#if e.rsvpDeadline}<p class="muted">Reply by {fmt(e.rsvpDeadline)}</p>{/if}
    {#if data.guardian}{#each data.children as c}<form method="post" action="?/rsvp" use:enhance class="rsvp"><input type="hidden" name="event" value={e.id} /><input type="hidden" name="child" value={c.id} />
      <span>{c.name}</span><span class="rsvp-btns"><button class="secondary sm" name="response" value="yes">Yes</button><button class="secondary sm" name="response" value="no">No</button>
      {#if e.needsConsent}<button class="primary sm" name="response" value="consent">I give permission</button>{/if}</span></form>{/each}{/if}
    <a href={`/school/event/${e.id}.ics`}>Add to phone calendar</a></article>
  {:else}<Empty title="No events yet">Meetings, trips and exams will be listed here.</Empty>{/each}

{:else}
  {#if data.guardian && data.children.length}
    <form method="post" action="?/request" use:enhance class="card"><h2>Ask the school</h2><input type="hidden" name="key" value={k()} />
      <label for="rt">What do you need?</label><select id="rt" name="type">{#each data.types as t}<option value={t.id}>{t.name}</option>{/each}</select>
      <label for="rc">For which child?</label><select id="rc" name="child">{#each data.children as c}<option value={c.id}>{c.name}</option>{/each}</select>
      <label for="rb">Details</label><textarea id="rb" name="body" rows="3" required></textarea><button class="green" style="margin-top:12px">Send to the school</button></form>
    {#each data.mine as r}<div class="card"><div class="row"><strong>{r.body.slice(0, 60)}</strong><span class="chip">{r.status.replace('_', ' ')}</span></div>
      <ol class="muted trail">{#each r.trail as t}<li>{t.status.replace('_', ' ')} · {fmt(t.at)}{#if t.note} · {t.note}{/if}</li>{/each}</ol></div>{/each}
  {/if}
  {#each data.inbox as r}<div class="card"><div class="row"><strong>{r.body.slice(0, 80)}</strong><span class="chip">{r.status.replace('_', ' ')}</span></div>
    {#if next[r.status]}<form method="post" action="?/status" use:enhance><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={next[r.status]} />
      <label for={`n${r.id}`}>Note to family (optional)</label><input id={`n${r.id}`} name="note" /><button class="green" style="margin-top:10px">Mark as {next[r.status].replace('_', ' ')}</button></form>{/if}</div>{/each}
  {#if !data.mine.length && !data.inbox.length}<Empty title="No requests yet">Fees and results are coming in the next release.</Empty>{/if}
{/if}
