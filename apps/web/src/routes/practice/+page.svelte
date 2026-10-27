<script lang="ts">
  let { data, form }: { data: any; form: any } = $props();
  const k = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));
</script>
<h1>Practice</h1>
{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}{#if form?.saved}<p class="ok">Sent to your teacher. They will review it.</p>{/if}
{#each data.tasks as t}
  <section class="card"><h2 style="margin-top:0">{t.title}</h2><p style="white-space:pre-wrap">{t.instructions}</p>
    <form method="post" action="?/submit"><input type="hidden" name="task" value={t.id} /><input type="hidden" name="key" value={k()} />
      <label for={`a${t.id}`}>Type your working here</label><textarea id={`a${t.id}`} name="text" rows="5"></textarea>
      <button class="primary" style="margin-top:8px">Submit answer</button></form></section>
{:else}<p class="card">No tasks right now.</p>{/each}
{#if data.feedback.length}<h2>Teacher feedback</h2>{#each data.feedback as f}<div class="card"><strong>{f.title}</strong> · {f.score}/{f.max}<p>{f.comment}</p></div>{/each}{/if}
