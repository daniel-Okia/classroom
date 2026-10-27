import { ar as head, am as ensure_array_like, at as attr_class, an as attr } from './index-DLOa9kpw.js';
import { e as escape_html } from './escaping-DWwx1bxi.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const k = () => crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
    const next = {
      submitted: "seen",
      seen: "in_progress",
      in_progress: "resolved"
    };
    const fmt = (d) => new Date(d).toLocaleString("en-UG", { dateStyle: "medium", timeStyle: "short" });
    head("z908u1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>School · Classroom</title>`);
      });
    });
    $$renderer2.push(`<h1>${escape_html(data.school.name)}</h1> <p class="muted">${escape_html(data.school.district)} · ${escape_html(data.school.contact_phone)}</p> `);
    if (form?.error) {
      $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (form?.rsvp) {
      $$renderer2.push(`<!--[0--><p class="ok">Reply saved.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (form?.requested) {
      $$renderer2.push(`<!--[0--><p class="ok">Request sent to the school.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.guardian || data.notices.length) {
      $$renderer2.push(`<!--[0--><h2>Notices</h2> `);
      const each_array = ensure_array_like(data.notices);
      if (each_array.length !== 0) {
        $$renderer2.push("<!--[-->");
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let n = each_array[$$index];
          $$renderer2.push(`<article class="card"><span${attr_class(`pill ${n.priority === "emergency" ? "emergency" : n.priority === "important" ? "warn" : ""}`)}>${escape_html(n.priority)}</span> <strong>${escape_html(n.title)}</strong><p>${escape_html(n.body)}</p>`);
          if (n.verse) {
            $$renderer2.push(`<!--[0--><p class="muted">${escape_html(n.verse)}</p>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (!n.read) {
            $$renderer2.push(`<!--[0--><form method="post" action="?/read"><input type="hidden" name="id"${attr("value", n.id)}/><button class="secondary" style="width:auto">Mark as read</button></form>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></article>`);
        }
      } else {
        $$renderer2.push(`<!--[!--><p class="card">No notices yet.</p>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.guardian) {
      $$renderer2.push(`<!--[0--><p><a class="btn btn-secondary" href="/school/notices">Post a notice</a></p>`);
    } else {
      $$renderer2.push(`<!--[-1--><p><a class="btn btn-primary" href="/school/notices">Post a notice or event</a></p>`);
    }
    $$renderer2.push(`<!--]--> <h2>Events</h2> `);
    const each_array_1 = ensure_array_like(data.events);
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let e = each_array_1[$$index_2];
        $$renderer2.push(`<article class="card"><strong>${escape_html(e.title)}</strong> <span class="pill">${escape_html(e.kind)}</span><p>${escape_html(fmt(e.startsAt))}`);
        if (e.rsvpDeadline) {
          $$renderer2.push(`<!--[0--><br/><span class="muted">Reply by ${escape_html(fmt(e.rsvpDeadline))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></p> `);
        if (data.guardian) {
          $$renderer2.push(`<!--[0--><!--[-->`);
          const each_array_2 = ensure_array_like(data.children);
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let c = each_array_2[$$index_1];
            $$renderer2.push(`<form method="post" action="?/rsvp" class="row"><input type="hidden" name="event"${attr("value", e.id)}/><input type="hidden" name="child"${attr("value", c.id)}/> <span>${escape_html(c.name)}</span><span><button class="secondary" name="response" value="yes" style="width:auto">Yes</button> <button class="secondary" name="response" value="no" style="width:auto">No</button> `);
            if (e.needsConsent) {
              $$renderer2.push(`<!--[0--><button class="primary" name="response" value="consent" style="width:auto">I give permission</button>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--></span></form>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <a${attr("href", `/school/event/${e.id}.ics`)}>Add to phone calendar</a></article>`);
      }
    } else {
      $$renderer2.push(`<!--[!--><p class="card">No events yet.</p>`);
    }
    $$renderer2.push(`<!--]--> <h2>Requests</h2> `);
    if (data.guardian && data.children.length) {
      $$renderer2.push(`<!--[0--><form method="post" action="?/request" class="card"><input type="hidden" name="key"${attr("value", k())}/> <label for="rt">What do you need?</label><select id="rt" name="type"><!--[-->`);
      const each_array_3 = ensure_array_like(data.types);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let t = each_array_3[$$index_3];
        $$renderer2.option({ value: t.id }, ($$renderer3) => {
          $$renderer3.push(`${escape_html(t.name)}`);
        });
      }
      $$renderer2.push(`<!--]--></select> <label for="rc">For which child?</label><select id="rc" name="child"><!--[-->`);
      const each_array_4 = ensure_array_like(data.children);
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let c = each_array_4[$$index_4];
        $$renderer2.option({ value: c.id }, ($$renderer3) => {
          $$renderer3.push(`${escape_html(c.name)}`);
        });
      }
      $$renderer2.push(`<!--]--></select> <label for="rb">Details</label><textarea id="rb" name="body" rows="3" required=""></textarea><button class="primary" style="margin-top:8px">Send to the school</button></form> <!--[-->`);
      const each_array_5 = ensure_array_like(data.mine);
      for (let $$index_6 = 0, $$length = each_array_5.length; $$index_6 < $$length; $$index_6++) {
        let r = each_array_5[$$index_6];
        $$renderer2.push(`<div class="card"><div class="row"><span>${escape_html(r.body.slice(0, 60))}</span><span class="pill">${escape_html(r.status.replace("_", " "))}</span></div> <ol class="muted"><!--[-->`);
        const each_array_6 = ensure_array_like(r.trail);
        for (let $$index_5 = 0, $$length2 = each_array_6.length; $$index_5 < $$length2; $$index_5++) {
          let t = each_array_6[$$index_5];
          $$renderer2.push(`<li>${escape_html(t.status.replace("_", " "))} · ${escape_html(fmt(t.at))}`);
          if (t.note) {
            $$renderer2.push(`<!--[0-->· ${escape_html(t.note)}`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></li>`);
        }
        $$renderer2.push(`<!--]--></ol></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array_7 = ensure_array_like(data.inbox);
    for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
      let r = each_array_7[$$index_7];
      $$renderer2.push(`<div class="card"><div class="row"><span>${escape_html(r.body.slice(0, 80))}</span><span class="pill">${escape_html(r.status.replace("_", " "))}</span></div> `);
      if (next[r.status]) {
        $$renderer2.push(`<!--[0--><form method="post" action="?/status"><input type="hidden" name="id"${attr("value", r.id)}/><input type="hidden" name="status"${attr("value", next[r.status])}/> <label${attr("for", `n${r.id}`)}>Note to family (optional)</label><input${attr("id", `n${r.id}`)} name="note"/><button class="primary" style="margin-top:8px">Mark as ${escape_html(next[r.status].replace("_", " "))}</button></form>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> <h2>Fees and results</h2><p class="card muted">Fees, payments and results are coming in the next release.</p>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DOmA-0XG.js.map
