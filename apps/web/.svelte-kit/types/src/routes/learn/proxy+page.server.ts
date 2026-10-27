// @ts-nocheck
import type { PageServerLoad } from './$types';
import { libraryTree } from '$lib/server/library';
import { needUser } from '$lib/server/ctx';
export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
  needUser(locals);
  const track = url.searchParams.get('track') === 'legacy' ? 'legacy' : 'new';
  return { track, tree: await libraryTree(track) };
};
