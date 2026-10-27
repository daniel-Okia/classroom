<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { flush } from '$lib/outbox';
  let { data, children } = $props();
  onMount(() => { flush(); addEventListener('online', flush); });
  const nav = $derived(
    data.roles.includes('guardian') ? [['/', 'Home'], ['/learn', 'Learn'], ['/school', 'School'], ['/messages', 'Messages']]
    : data.roles.includes('student') ? [['/', 'Home'], ['/learn', 'Library'], ['/practice', 'Practice'], ['/progress', 'Progress']]
    : data.roles.some((r) => ['teacher', 'school_admin', 'head_teacher', 'bursar'].includes(r)) ? [['/', 'Overview'], ['/learn', 'Library'], ['/school', 'School'], ['/messages', 'Messages']]
    : []);
</script>
<a class="skip" href="#main">Skip to content</a>
<main id="main">{@render children()}</main>
{#if data.user && nav.length}
  <nav class="bottom" aria-label="Main">
    {#each nav as [href, label]}<a {href} aria-current={$page.url.pathname === href ? 'page' : undefined}>{label}</a>{/each}
  </nav>
{/if}
