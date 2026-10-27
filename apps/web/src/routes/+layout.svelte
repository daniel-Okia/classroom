<script lang="ts">
  import '../app.css';
  import { page, navigating } from '$app/stores';
  import { onMount } from 'svelte';
  import { flush } from '$lib/outbox';
  let { data, children } = $props();
  const STAFF = ['teacher', 'school_admin', 'head_teacher', 'bursar'];
  const staff = $derived(data.roles.some((r: string) => STAFF.includes(r)) && !data.roles.includes('student'));
  // One short menu per role. Account lives behind the avatar at the top.
  const nav = $derived(
    data.roles.includes('student') ? [['/', 'Home'], ['/learn', 'Library'], ['/practice', 'Practice'], ['/progress', 'Progress']]
    : data.roles.includes('guardian') ? [['/', 'Home'], ['/progress', 'Progress'], ['/school', 'School'], ['/messages', 'Messages']]
    : staff ? [['/', 'Home'], ['/learn', 'Library'], ['/school', 'School'], ['/messages', 'Messages']]
    : []);
  const side = $derived([['/', 'Overview'], ...(data.roles.includes('school_admin') ? [['/school/setup', 'Classes and packages'], ['/school/requests', 'Family requests']] : []), ['/learn', 'Content library'], ['/school', 'School notices'], ['/messages', 'Messages'], ['/account', 'Account']]);
  const initials = $derived((data.user?.name ?? '?').split(/\s+/).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
  const here = (href: string, path: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));

  // Every form button shows a spinner as soon as it is pressed, and cannot be double-pressed.
  onMount(() => {
    flush(); addEventListener('online', flush);
    const busy = (e: SubmitEvent) => {
      const b = (e.submitter ?? (e.target as HTMLFormElement).querySelector('button:not([type=button])')) as HTMLElement | null;
      if (!b) return; b.setAttribute('aria-busy', 'true'); setTimeout(() => b.removeAttribute('aria-busy'), 2500);
    };
    addEventListener('submit', busy, true);
    return () => removeEventListener('submit', busy, true);
  });
</script>
<a class="skip" href="#main">Skip to content</a>
{#if $navigating}<div class="navbar" role="progressbar" aria-label="Loading page"></div>{/if}
<div class="shell" class:staff>
  {#if staff}
    <aside class="side" aria-label="Sections">
      <div class="brand">Classroom</div>
      {#each side as [href, label]}<a {href} aria-current={here(href, $page.url.pathname) ? 'page' : undefined}>{label}</a>{/each}
      <div class="who">{data.user?.name}</div>
    </aside>
  {/if}
  <div class="content">
  {#if data.user}
    <div class="topbar"><div><a class="brand" href="/">Classroom</a>{#if data.school}<span class="school">{data.school}</span>{/if}</div>
      <a class="avatar" href="/account" aria-label="Account">{initials}</a></div>
  {/if}
  <main id="main" class:loading={!!$navigating} aria-busy={!!$navigating}>{@render children()}</main>
  </div>
</div>
{#if data.user && nav.length}
  <nav class="bottom" aria-label="Main">
    {#each nav as [href, label]}<a {href} aria-current={here(href, $page.url.pathname) ? 'page' : undefined}>{label}</a>{/each}
  </nav>
{/if}
