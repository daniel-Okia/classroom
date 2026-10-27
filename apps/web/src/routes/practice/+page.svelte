<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  import { enhance } from '$app/forms';
  let { data, form }: { data: any; form: any } = $props();
  const k = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));
</script>
<svelte:head><title>Practice · Classroom</title></svelte:head>
<PageHead eyebrow="Practice" title="Your tasks" />
{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}{#if form?.saved}<p class="ok" role="status">Sent to your teacher. They will review it.</p>{/if}
{#each data.tasks as t, i}
  <section class="card">
    <div class="qhead"><span class="qtag">Task {i + 1} of {data.tasks.length}</span></div>
    <p class="qtext">{t.title}</p>
    <p style="white-space:pre-wrap">{t.instructions}</p>
    <form method="post" action="?/submit" use:enhance>
      <input type="hidden" name="task" value={t.id} /><input type="hidden" name="key" value={k()} />
      <label for={`a${t.id}`}>Type your working here</label>
      <textarea class="answer" id={`a${t.id}`} name="text" placeholder="Write your answer and show your working."></textarea>
      <button class="green" style="margin-top:12px;width:100%">Submit answer</button>
    </form>
  </section>
{:else}<section class="card empty">No tasks right now. Check back after your teacher assigns one.</section>{/each}
{#if data.feedback.length}<h2>Teacher feedback</h2>{#each data.feedback as f}<div class="note"><span class="label">{f.title} · {f.score}/{f.max}</span><p>{f.comment}</p></div>{/each}{/if}
