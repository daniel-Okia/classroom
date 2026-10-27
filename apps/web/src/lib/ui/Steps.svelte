<script lang="ts">
  /** Horizontal progress through a short journey. `at` is the 0-based current step. */
  let { steps, at }: { steps: string[]; at: number } = $props();
</script>
<ol class="steps" aria-label="Progress">
  {#each steps as s, i}<li class:done={i < at} class:now={i === at} aria-current={i === at ? 'step' : undefined}><span>{i < at ? '✓' : i + 1}</span>{s}</li>{/each}
</ol>
