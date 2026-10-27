import type { PageServerLoad } from './$types';
import { needActor } from '$lib/server/ctx';
import { weekFor, childrenOf } from '$lib/server/views';
import { Forbidden } from '$lib/server/schools';
export const load: PageServerLoad = async ({ locals, url }) => {
  const a = needActor(locals); const want = url.searchParams.get('child') ?? a.id;
  if (want !== a.id) { const kids = await childrenOf(a); if (!kids.some((k) => k.id === want)) throw new Forbidden(); }
  return { week: await weekFor(a, want) };
};
