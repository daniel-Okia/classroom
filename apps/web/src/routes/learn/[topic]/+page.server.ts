import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { lessonForTopic, verseOfTheDay } from '$lib/server/library';
import { renderLesson } from '$lib/server/render';
import { faithFor } from '$lib/server/views';
import { needUser } from '$lib/server/ctx';

const PRAYERS = ['Lord, thank you for this time to learn. Help me to work with a calm mind and an honest heart. Amen.', 'God, open my mind and help me to understand. Amen.', 'Thank you, Father, for teachers, family and friends who help me learn. Amen.'];

export const load: PageServerLoad = async ({ params, locals }) => {
  needUser(locals);
  const l = await lessonForTopic(params.topic);
  if (!l) throw error(404, 'This lesson is not ready yet');
  const sections = l.lesson.bodyMd.split(/^## /m).filter(Boolean).map((s) => { const [title, ...rest] = s.split('\n'); return { title: title!.trim(), html: renderLesson(rest.join('\n')) }; });
  const a = locals.actor; const faith = a?.schoolId ? await faithFor(a.schoolId) : 'light';
  const doy = Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 864e5);
  return { title: l.lesson.title, sections, items: l.items, quizId: l.quizId, faith, canSubmit: !!a?.roles.includes('student'),
    opening: faith === 'off' ? null : { prayer: PRAYERS[doy % PRAYERS.length], verse: await verseOfTheDay(faith as any, doy) } };
};
