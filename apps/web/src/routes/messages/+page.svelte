<script lang="ts">
  let { data, form }: { data: any; form: any } = $props();
  const k = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));
</script>
<h1>Messages</h1>
<p class="muted">Messages are visible to the school's administration to keep everyone safe.</p>
{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}{#if form?.reported}<p class="ok">Thank you. The school has been told.</p>{/if}
{#if data.children.length}
<form method="post" action="?/send" class="card"><input type="hidden" name="key" value={k()} />
  <label for="mc">About which child?</label><select id="mc" name="child">{#each data.children as c}<option value={c.id}>{c.name}</option>{/each}</select>
  <label for="mk">To</label><select id="mk" name="kind"><option value="parent_teacher">Class teacher</option><option value="parent_office">School office</option></select>
  <label for="mb">Message</label><textarea id="mb" name="body" rows="3" required></textarea><button class="primary" style="margin-top:8px">Send</button></form>
{/if}
{#each data.threads as t}
  <section class="card"><span class="pill">{t.kind === 'parent_teacher' ? 'Teacher' : 'Office'}</span>
    {#each t.messages as m}<div style={m.senderId === data.me ? 'text-align:right' : ''}>{m.body}
      <form method="post" action="?/report" style="display:inline"><input type="hidden" name="id" value={m.id} /><button class="secondary" style="min-height:32px;padding:0 10px;font-size:.8rem">Report</button></form></div>{/each}
    <form method="post" action="?/send"><input type="hidden" name="key" value={k()} /><input type="hidden" name="thread" value={t.id} /><input type="hidden" name="child" value={t.childId} /><input type="hidden" name="kind" value={t.kind} />
      <label for={`r${t.id}`}>Reply</label><input id={`r${t.id}`} name="body" required /><button class="primary" style="margin-top:8px">Send reply</button></form></section>
{:else}<p class="card">No messages yet.</p>{/each}
