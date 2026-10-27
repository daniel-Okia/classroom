<script lang="ts">
  import { enhance } from '$app/forms';
  import PageHead from '$lib/ui/PageHead.svelte';
  import Flash from '$lib/ui/Flash.svelte';
  import Tabs from '$lib/ui/Tabs.svelte';
  import Empty from '$lib/ui/Empty.svelte';
  import { page } from '$app/stores';
  let { data, form }: { data: any; form: any } = $props();
  const tab = $derived($page.url.searchParams.get('tab') ?? 'review');
</script>
<svelte:head><title>Tasks and marking · Classroom</title></svelte:head>
<PageHead eyebrow="Class" title="Tasks and marking" back="/" backLabel="Overview" />
<Flash error={form?.error} ok={form?.assigned ? 'Task assigned.' : null} />
<Tabs tabs={[{ id: 'review', label: 'To review', count: data.queue.filter((q: any) => !q.markId).length }, { id: 'assign', label: 'Assign a task' }]} />
{#if tab === 'assign'}
<form method="post" action="?/assign" class="card">
  <label for="t">Title</label><input id="t" name="title" required /><label for="i">Instructions</label><textarea id="i" name="instructions" rows="4" required></textarea>
  <label for="d">Due date (optional)</label><input id="d" name="due" type="date" /><button class="green" style="margin-top:14px">Assign to class</button></form>
{:else}
{#each data.queue as q}
  <section class="card"><div class="row"><strong>{q.student}</strong><span class="muted">{q.taskTitle}</span></div>
    <p class="answerbox">{q.text ?? '(photo answer)'}</p>
    {#if q.markId}<span class="chip">Marked</span>{/if}
    <form method="post" action="?/mark" use:enhance><input type="hidden" name="id" value={q.id} />
      <div class="row" style="align-items:flex-start"><div style="flex:1"><label for={`s${q.id}`}>Score</label><input id={`s${q.id}`} name="score" type="number" min="0" required /></div>
        <div style="flex:1"><label for={`m${q.id}`}>Out of</label><input id={`m${q.id}`} name="max" type="number" min="1" value="4" required /></div></div>
      <label for={`c${q.id}`}>Comment</label><textarea id={`c${q.id}`} name="comment" rows="2"></textarea>
      <button class="green" style="margin-top:10px">{q.markId ? 'Update mark' : 'Save mark'}</button></form></section>
{:else}<Empty title="Nothing to review yet">When students submit answers they appear here.</Empty>{/each}
{/if}
