import adapter from '@sveltejs/adapter-node';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default { preprocess: vitePreprocess(), kit: { adapter: process.env.VERCEL ? vercel({ runtime: 'nodejs22.x' }) : adapter() } };
