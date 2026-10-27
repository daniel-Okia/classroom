<script lang="ts">
  let { error, ok }: { error?: string | null; ok?: string | null } = $props();
</script>
{#if error}<p class="err" role="alert">{error}</p>{/if}
{#if ok}<p class="ok" role="status">{ok}</p>{/if}
