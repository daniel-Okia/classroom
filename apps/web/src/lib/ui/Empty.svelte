<script lang="ts">
  import type { Snippet } from 'svelte';
  let { title, children }: { title: string; children?: Snippet } = $props();
</script>
<section class="card empty"><strong>{title}</strong>{#if children}<p class="muted">{@render children()}</p>{/if}</section>
