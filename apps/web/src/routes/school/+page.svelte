<script lang="ts">
  let { data, form }: { data: any; form: any } = $props();
  const k = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));
  const next: Record<string, string> = { submitted: 'seen', seen: 'in_progress', in_progress: 'resolved' };
  const fmt = (d: string | Date) => new Date(d).toLocaleString('en-UG', { dateStyle: 'medium', timeStyle: 'short' });
</script>
<svelte:head><title>School · Classroom</title></svelte:head>
<h1>{data.school.name}</h1>
<p class="muted">{data.school.district} · {data.school.contact_phone}</p>
{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}{#if form?.rsvp}<p class="ok">Reply saved.</p>{/if}{#if form?.requested}<p class="ok">Request sent to the school.</p>{/if}
{#if data.guardian || data.notices.length}
<h2>Notices</h2>
{#each data.notices as n}<article class="card"><span class={`pill ${n.priority === 'emergency' ? 'emergency' : n.priority === 'important' ? 'warn' : ''}`}>{n.priority}</span> <strong>{n.title}</strong><p>{n.body}</p>{#if n.verse}<p class="muted">{n.verse}</p>{/if}
  {#if !n.read}<form method="post" action="?/read"><input type="hidden" name="id" value={n.id} /><button class="secondary" style="width:auto">Mark as read</button></form>{/if}</article>
{:else}<p class="card">No notices yet.</p>{/each}
{/if}
{#if data.guardian}<p><a class="btn btn-secondary" href="/school/notices">Post a notice</a></p>{:else}<p><a class="btn btn-primary" href="/school/notices">Post a notice or event</a></p>{/if}
<h2>Events</h2>
{#each data.events as e}<article class="card"><strong>{e.title}</strong> <span class="pill">{e.kind}</span><p>{fmt(e.startsAt)}{#if e.rsvpDeadline}<br /><span class="muted">Reply by {fmt(e.rsvpDeadline)}</span>{/if}</p>
  {#if data.guardian}{#each data.children as c}<form method="post" action="?/rsvp" class="row"><input type="hidden" name="event" value={e.id} /><input type="hidden" name="child" value={c.id} />
    <span>{c.name}</span><span><button class="secondary" name="response" value="yes" style="width:auto">Yes</button> <button class="secondary" name="response" value="no" style="width:auto">No</button>
    {#if e.needsConsent}<button class="primary" name="response" value="consent" style="width:auto">I give permission</button>{/if}</span></form>{/each}{/if}
  <a href={`/school/event/${e.id}.ics`}>Add to phone calendar</a></article>
{:else}<p class="card">No events yet.</p>{/each}
<h2>Requests</h2>
{#if data.guardian && data.children.length}
<form method="post" action="?/request" class="card"><input type="hidden" name="key" value={k()} />
  <label for="rt">What do you need?</label><select id="rt" name="type">{#each data.types as t}<option value={t.id}>{t.name}</option>{/each}</select>
  <label for="rc">For which child?</label><select id="rc" name="child">{#each data.children as c}<option value={c.id}>{c.name}</option>{/each}</select>
  <label for="rb">Details</label><textarea id="rb" name="body" rows="3" required></textarea><button class="primary" style="margin-top:8px">Send to the school</button></form>
{#each data.mine as r}<div class="card"><div class="row"><span>{r.body.slice(0, 60)}</span><span class="pill">{r.status.replace('_', ' ')}</span></div>
  <ol class="muted">{#each r.trail as t}<li>{t.status.replace('_', ' ')} · {fmt(t.at)}{#if t.note} · {t.note}{/if}</li>{/each}</ol></div>{/each}
{/if}
{#each data.inbox as r}<div class="card"><div class="row"><span>{r.body.slice(0, 80)}</span><span class="pill">{r.status.replace('_', ' ')}</span></div>
  {#if next[r.status]}<form method="post" action="?/status"><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={next[r.status]} />
    <label for={`n${r.id}`}>Note to family (optional)</label><input id={`n${r.id}`} name="note" /><button class="primary" style="margin-top:8px">Mark as {next[r.status].replace('_', ' ')}</button></form>{/if}</div>{/each}
<h2>Fees and results</h2><p class="card muted">Fees, payments and results are coming in the next release.</p>
