<script lang="ts">
  import { enhance } from '$app/forms';
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import Empty from '$lib/ui/Empty.svelte';
  let { data, form }: { data: any; form: any } = $props();
  const k = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));
</script>
<svelte:head><title>Messages · Classroom</title></svelte:head>
<PageHead eyebrow="Parents and teachers" title="Messages" />
<p class="muted">Messages are visible to the school's administration to keep everyone safe.</p>
<Flash error={form?.error} ok={form?.reported ? 'Thank you. The school has been told.' : null} />
{#each data.threads as t}
  <section class="card"><span class="chip">{t.kind === 'parent_teacher' ? 'Class teacher' : 'School office'}</span>
    <div style="margin-top:8px">{#each t.messages as m}
      <div class={`bubble ${m.senderId === data.me ? 'me' : ''}`}>{m.body}
        {#if m.senderId !== data.me}<form method="post" action="?/report" use:enhance style="display:inline"><input type="hidden" name="id" value={m.id} /><button class="linklike" aria-label="Report this message">Report</button></form>{/if}</div>{/each}</div>
    <form method="post" action="?/send" use:enhance class="reply"><input type="hidden" name="key" value={k()} /><input type="hidden" name="thread" value={t.id} /><input type="hidden" name="child" value={t.childId} /><input type="hidden" name="kind" value={t.kind} />
      <input id={`r${t.id}`} name="body" aria-label="Reply" placeholder="Write a reply" required /><button class="green sm">Send</button></form></section>
{:else}{#if !data.children.length}<Empty title="No messages yet">Messages appear here once you are linked to a child.</Empty>{/if}{/each}
{#if data.children.length}
<form method="post" action="?/send" use:enhance class="card"><h2>New message</h2><input type="hidden" name="key" value={k()} />
  <label for="mc">About which child?</label><select id="mc" name="child">{#each data.children as c}<option value={c.id}>{c.name}</option>{/each}</select>
  <label for="mk">To</label><select id="mk" name="kind"><option value="parent_teacher">Class teacher</option><option value="parent_office">School office</option></select>
  <label for="mb">Message</label><textarea id="mb" name="body" rows="3" required></textarea><button class="green" style="margin-top:12px">Send</button></form>
{/if}
