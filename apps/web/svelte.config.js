import adapter from '@sveltejs/adapter-node';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// fra1 (Frankfurt) sits next to the Supabase project in eu-central-1: every page makes several database round trips.
export default { preprocess: vitePreprocess(), kit: { adapter: process.env.VERCEL ? vercel({ runtime: 'nodejs22.x', regions: ['fra1'] }) : adapter() } };
