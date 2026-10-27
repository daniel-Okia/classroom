<script lang="ts">
  let { data }: { data: any } = $props();
</script>
<svelte:head><title>Library · Classroom</title></svelte:head>
<h1>Library</h1>
<div class="row" role="tablist" aria-label="Curriculum">
  <a class="btn {data.track === 'new' ? 'btn-primary' : 'btn-secondary'}" style="flex:1" href="?track=new" aria-current={data.track === 'new' ? 'true' : undefined}>New curriculum</a>
  <a class="btn {data.track === 'legacy' ? 'btn-primary' : 'btn-secondary'}" style="flex:1" href="?track=legacy" aria-current={data.track === 'legacy' ? 'true' : undefined}>Older syllabus</a>
</div>
{#each data.tree as n}
  <details class="card" open={n.topics.some((t: { hasLesson: boolean }) => t.hasLesson)}>
    <summary><strong>{n.level} · {n.subject}</strong> <span class="muted">{n.topics.filter((t: { hasLesson: boolean }) => t.hasLesson).length} of {n.topics.length} topics ready</span></summary>
    <ul style="padding-left:1.1em">{#each n.topics as t}
      <li>{#if t.hasLesson}<a href={`/learn/${t.id}`}>{t.name}</a>{:else}<span class="muted">{t.name} · coming soon</span>{/if}</li>{/each}</ul>
  </details>
{:else}<p class="card">No content has been loaded yet.</p>{/each}
