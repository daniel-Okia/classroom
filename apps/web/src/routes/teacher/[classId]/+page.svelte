<script lang="ts">
  let { data, form }: { data: any; form: any } = $props();
</script>
<h1>Tasks and marking</h1>
{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}{#if form?.assigned}<p class="ok">Task assigned.</p>{/if}
<form method="post" action="?/assign" class="card"><h2 style="margin-top:0">Assign a task</h2>
  <label for="t">Title</label><input id="t" name="title" required /><label for="i">Instructions</label><textarea id="i" name="instructions" rows="4" required></textarea>
  <label for="d">Due date (optional)</label><input id="d" name="due" type="date" /><button class="primary" style="margin-top:12px">Assign to class</button></form>
<h2>To review</h2>
{#each data.queue as q}
  <section class="card"><div class="row"><strong>{q.student}</strong><span class="muted">{q.taskTitle}</span></div>
    <p style="white-space:pre-wrap">{q.text ?? '(photo answer)'}</p>
    {#if q.markId}<p class="pill">Marked</p>{/if}
    <form method="post" action="?/mark"><input type="hidden" name="id" value={q.id} />
      <div class="row"><div style="flex:1"><label for={`s${q.id}`}>Score</label><input id={`s${q.id}`} name="score" type="number" min="0" required /></div>
        <div style="flex:1"><label for={`m${q.id}`}>Out of</label><input id={`m${q.id}`} name="max" type="number" min="1" value="4" required /></div></div>
      <label for={`c${q.id}`}>Comment</label><textarea id={`c${q.id}`} name="comment" rows="2"></textarea>
      <button class="primary" style="margin-top:8px">{q.markId ? 'Update mark' : 'Save mark'}</button></form></section>
{:else}<p class="card">Nothing to review yet.</p>{/each}
