import { e as error } from "../../../../../chunks/index2.js";
import { a as needActor } from "../../../../../chunks/ctx.js";
import { l as listEvents, i as icsFor } from "../../../../../chunks/hub.js";
const GET = async ({ locals, params }) => {
  const e = (await listEvents(needActor(locals))).find((x) => x.id === params.id.replace(/\.ics$/, ""));
  if (!e) throw error(404, "Event not found");
  return new Response(icsFor(e), { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="event.ics"' } });
};
export {
  GET
};
