<script lang="ts">
  import PageHead from '$lib/ui/PageHead.svelte';
  import Empty from '$lib/ui/Empty.svelte';
  let { data }: { data: any } = $props();
  const ready = (n: any) => n.topics.filter((t: { hasLesson: boolean }) => t.hasLesson).length;
</script>
<svelte:head><title>Library · Classroom</title></svelte:head>
<PageHead eyebrow="Notes and quizzes" title="Library" />
<nav class="seg" aria-label="Curriculum">
  <a href="?track=new" aria-current={data.track === 'new' ? 'page' : undefined}>New curriculum</a>
  <a href="?track=legacy" aria-current={data.track === 'legacy' ? 'page' : undefined}>Older syllabus</a>
</nav>
{#each data.tree as n}
  <details class="card" open={ready(n) > 0}>
    <summary class="row"><strong>{n.level} · {n.subject}</strong><span class="chip">{ready(n)} of {n.topics.length} ready</span></summary>
    <ul class="topics">{#each n.topics as t}
      <li>{#if t.hasLesson}<a href={`/learn/${t.id}`}><span>{t.name}</span><span aria-hidden="true">→</span></a>{:else}<span class="soon"><span>{t.name}</span><small>Coming soon</small></span>{/if}</li>{/each}</ul>
  </details>
{:else}<Empty title="No content yet">Lessons will appear here once they are added.</Empty>{/each}
