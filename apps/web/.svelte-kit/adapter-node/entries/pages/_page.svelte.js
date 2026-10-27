import { h as head, a as attr, e as ensure_array_like, b as stringify, c as attr_class, f as attr_style } from "../../chunks/index.js";
import "../../chunks/client.js";
import { e as escape_html } from "../../chunks/escaping.js";
function verseCard($$renderer, v) {
  if (v) {
    $$renderer.push(`<!--[0--><section class="card" aria-label="Verse of the day"><strong>${escape_html(v.reference)}</strong>`);
    if (v.reflection) {
      $$renderer.push(`<!--[0--><p>${escape_html(v.reflection)}</p><p class="muted"><em>${escape_html(v.question)}</em></p>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]--></section>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const pct = (m, h) => h ? Math.min(100, Math.round(m / (h * 60) * 100)) : 0;
    const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
    const DAYNAMES = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
    const label = {
      on_track: "On track",
      behind: "Behind",
      not_started: "Not started"
    };
    function week($$renderer3, w) {
      $$renderer3.push(`<div class="dots" role="img"${attr("aria-label", `Study days this week: ${w.days.map((d, i) => `${DAYNAMES[i]} ${d ? "studied" : "not yet"}`).join(", ")}`)}><!--[-->`);
      const each_array = ensure_array_like(w.days);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let d = each_array[i];
        $$renderer3.push(`<span aria-hidden="true"${attr_class("", void 0, { "on": d })}>${escape_html(d ? "✓" : DAYS[i])}</span>`);
      }
      $$renderer3.push(`<!--]--></div> <p>${escape_html(Math.floor(w.minutes / 60))}h ${escape_html(w.minutes % 60)}m of ${escape_html(w.goalHours)}h goal</p> <div class="bar" aria-hidden="true"><i${attr_style(`width:${pct(w.minutes, w.goalHours)}%`)}></i></div>`);
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Home · Classroom</title>`);
      });
    });
    if (data.mode === "none") {
      $$renderer2.push(`<!--[0--><h1>Welcome</h1> <p>Join your child's school, or register your school.</p> <a class="btn btn-primary" href="/join">Join my child's school</a> <p></p><a class="btn btn-secondary" href="/schools/register">Register a school</a>`);
    } else if (data.mode === "platform") {
      $$renderer2.push(`<!--[1--><h1>Platform admin</h1><a class="btn btn-primary" href="/platform">Verify schools</a>`);
    } else if (data.mode === "student") {
      $$renderer2.push(`<!--[2--><h1>Good morning, ${escape_html(data.name.split(" ")[0])}</h1> <form method="post" action="?/exitChild"><button class="secondary" style="width:auto">Switch back to parent</button></form> `);
      if (data.enrolment) {
        $$renderer2.push(`<!--[0--><section class="hero"><p style="margin:0">${escape_html(data.enrolment.pkg.name)} · ${escape_html(data.enrolment.slotStart ? `Today at ${data.enrolment.slotStart}` : "Pick a daily time")}</p> <h2>${escape_html(data.enrolment.slotStart ? "Ready when you are" : "Choose your study time")}</h2> `);
        if (data.enrolment.slotStart) {
          $$renderer2.push(`<!--[0--><a class="btn btn-primary" href="/learn">Start today's session</a>`);
        } else {
          $$renderer2.push(`<!--[-1--><a class="btn btn-primary"${attr("href", `/slot/${data.enrolment.id}`)}>Choose a time</a>`);
        }
        $$renderer2.push(`<!--]--></section>`);
      } else {
        $$renderer2.push(`<!--[-1--><p class="card">Your parent can enrol you in a holiday package from their Home screen.</p>`);
      }
      $$renderer2.push(`<!--]--> `);
      verseCard($$renderer2, data.verse);
      $$renderer2.push(`<!----> <section class="card"><strong>This week</strong>`);
      week($$renderer2, data.week);
      $$renderer2.push(`<!----></section>`);
    } else if (data.mode === "guardian") {
      $$renderer2.push(`<!--[3--><h1>Today</h1> `);
      verseCard($$renderer2, data.verse);
      $$renderer2.push(`<!----> `);
      if (form?.error) {
        $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_1 = ensure_array_like(data.children);
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let c = each_array_1[$$index_2];
        $$renderer2.push(`<section class="card"><div class="row"><h2 style="margin:0">${escape_html(c.name)}</h2> <form method="post" action="?/studyAs"><input type="hidden" name="child"${attr("value", c.id)}/><button class="secondary" style="width:auto">Study as ${escape_html(c.name.split(" ")[0])}</button></form></div> `);
        if (c.enrolment) {
          $$renderer2.push("<!--[0-->");
          week($$renderer2, c.week);
          $$renderer2.push(`<!----> <a${attr("href", `/progress?child=${stringify(c.id)}`)}>See progress</a>`);
        } else if (data.packages.length) {
          $$renderer2.push(`<!--[1--><form method="post" action="?/enrol"><input type="hidden" name="child"${attr("value", c.id)}/> <label${attr("for", `p${c.id}`)}>Holiday package</label> <select${attr("id", `p${c.id}`)} name="pkg"><!--[-->`);
          const each_array_2 = ensure_array_like(data.packages);
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let p = each_array_2[$$index_1];
            $$renderer2.option({ value: p.id }, ($$renderer3) => {
              $$renderer3.push(`${escape_html(p.name)}`);
            });
          }
          $$renderer2.push(`<!--]--></select> <p class="muted">By enrolling ${escape_html(c.name.split(" ")[0])} you consent to their learning data being used for this package.</p> <button class="primary">Enrol with my consent</button></form>`);
        } else {
          $$renderer2.push(`<!--[-1--><p class="muted">The school has not opened a holiday package yet.</p>`);
        }
        $$renderer2.push(`<!--]--></section>`);
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_3 = ensure_array_like(data.notices);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let n = each_array_3[$$index_3];
        $$renderer2.push(`<article class="card"><span${attr_class(`pill ${n.priority === "emergency" ? "emergency" : n.priority === "important" ? "warn" : ""}`)}>${escape_html(n.priority)}</span> <strong>${escape_html(n.title)}</strong><p>${escape_html(n.body)}</p>`);
        if (n.verse) {
          $$renderer2.push(`<!--[0--><p class="muted">${escape_html(n.verse)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></article>`);
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_4 = ensure_array_like(data.requests);
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let r = each_array_4[$$index_4];
        $$renderer2.push(`<div class="card row"><span>${escape_html(r.body.slice(0, 50))}</span><span class="pill">${escape_html(r.status.replace("_", " "))}</span></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else if (data.mode === "staff") {
      $$renderer2.push(`<!--[4--><h1>Class overview</h1> `);
      if (data.pending) {
        $$renderer2.push(`<!--[0--><a class="card" style="display:block" href="/school/requests"><strong>${escape_html(data.pending)}</strong> family request${escape_html(data.pending > 1 ? "s" : "")} waiting for approval</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.isAdmin) {
        $$renderer2.push(`<!--[0--><div class="row"><a class="btn btn-secondary" href="/school/setup">Classes and packages</a><a class="btn btn-secondary" href="/school/poster.pdf">Poster (PDF)</a></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_5 = ensure_array_like(data.classes);
      for (let $$index_6 = 0, $$length = each_array_5.length; $$index_6 < $$length; $$index_6++) {
        let c = each_array_5[$$index_6];
        $$renderer2.push(`<section class="card"><h2 style="margin-top:0">${escape_html(c.cls.name)} <span class="muted">code ${escape_html(c.cls.joinCode)}</span></h2> `);
        if (c.students.length) {
          $$renderer2.push(`<!--[0--><table><thead><tr><th>Student</th><th>Slot</th><th>This week</th><th>Last quiz</th><th>Status</th></tr></thead><tbody><!--[-->`);
          const each_array_6 = ensure_array_like(c.students);
          for (let $$index_5 = 0, $$length2 = each_array_6.length; $$index_5 < $$length2; $$index_5++) {
            let s = each_array_6[$$index_5];
            $$renderer2.push(`<tr><td>${escape_html(s.name)}</td><td>${escape_html(s.slot ?? "-")}</td><td>${escape_html(Math.floor(s.minutes / 60))}h ${escape_html(s.minutes % 60)}m</td><td>${escape_html(s.last === null ? "n/a" : s.last + "%")}</td><td><span${attr_class(`pill ${s.status === "behind" ? "warn" : s.status === "not_started" ? "dark" : ""}`)}>${escape_html(label[s.status])}</span></td></tr>`);
          }
          $$renderer2.push(`<!--]--></tbody></table> <a class="btn btn-secondary" style="margin-top:12px"${attr("href", `/teacher/${c.cls.id}`)}>Assign a task or review work</a>`);
        } else {
          $$renderer2.push(`<!--[-1--><p class="muted">No students yet. Share the class code or poster.</p>`);
        }
        $$renderer2.push(`<!--]--></section>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="post" action="/logout" style="margin-top:32px"><button class="secondary" style="width:auto">Sign out</button></form>`);
  });
}
export {
  _page as default
};
