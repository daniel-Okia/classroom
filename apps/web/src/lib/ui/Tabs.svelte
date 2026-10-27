<script lang="ts">
  import { page } from '$app/stores';
  /** Server-driven segmented control: each tab is a link to `?tab=<id>`, so it works without JavaScript. */
  let { tabs, param = 'tab' }: { tabs: { id: string; label: string; count?: number }[]; param?: string } = $props();
  const cur = $derived($page.url.searchParams.get(param) ?? tabs[0]!.id);
</script>
<nav class="seg" aria-label="Sections">
  {#each tabs as t}<a href={`?${param}=${t.id}`} aria-current={cur === t.id ? 'page' : undefined} data-sveltekit-replacestate>{t.label}{#if t.count}<b>{t.count}</b>{/if}</a>{/each}
</nav>
