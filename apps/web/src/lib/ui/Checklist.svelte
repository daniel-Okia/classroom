<script lang="ts">
  /** "What to do next": the first unfinished item is highlighted and carries the action. */
  type Item = { label: string; done: boolean; href?: string; cta?: string; hint?: string };
  let { items, title = 'Getting started' }: { items: Item[]; title?: string } = $props();
  const next = $derived(items.findIndex((i) => !i.done));
</script>
<section class="card checklist" aria-label={title}>
  <div class="row"><strong>{title}</strong><span class="muted">{items.filter((i) => i.done).length} of {items.length} done</span></div>
  <ul>
    {#each items as it, i}
      <li class:done={it.done} class:next={i === next}>
        <span class="tick" aria-hidden="true">{it.done ? '✓' : i + 1}</span>
        <div><span class="lbl">{it.label}</span>{#if i === next && it.hint}<p class="muted">{it.hint}</p>{/if}</div>
        {#if i === next && it.href}<a class="btn btn-primary btn-sm" href={it.href}>{it.cta ?? 'Open'}</a>{/if}
      </li>
    {/each}
  </ul>
</section>
