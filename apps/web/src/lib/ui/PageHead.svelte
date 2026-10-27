<script lang="ts">
  import type { Snippet } from 'svelte';
  let { title, eyebrow, back, backLabel = 'Back', children }: { title: string; eyebrow?: string; back?: string; backLabel?: string; children?: Snippet } = $props();
</script>
{#if back}<a class="back" href={back}><span aria-hidden="true">←</span> {backLabel}</a>{/if}
<header class="pagehead">
  <div>{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}<h1>{title}</h1></div>
  {#if children}<div class="head-actions">{@render children()}</div>{/if}
</header>
