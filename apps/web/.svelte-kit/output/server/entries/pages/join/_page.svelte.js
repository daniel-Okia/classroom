import { h as head, a as attr } from "../../../chunks/index.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    head("1rdz7hh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Join a school · Classroom</title>`);
      });
    });
    $$renderer2.push(`<h1>Join your child's school</h1> `);
    if (form?.sent) {
      $$renderer2.push(`<!--[0--><p class="ok">Thank you. ${escape_html(form.school)} will review your request. You will see your child here once the school approves. Scanning a code does not give access on its own.</p>`);
    } else if (data.target) {
      $$renderer2.push(`<!--[1--><p class="card"><strong>${escape_html(data.target.schoolName)}</strong>`);
      if (data.target.className) {
        $$renderer2.push(`<!--[0-->· ${escape_html(data.target.className)}`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></p> `);
      if (form?.error) {
        $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form method="post" action="?/request" class="card"><input type="hidden" name="code"${attr("value", data.code)}/> <label for="child">Your child's full name</label><input id="child" name="child" required=""/> <button class="primary" style="margin-top:12px">Ask the school to link my child</button></form>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      if (data.notFound) {
        $$renderer2.push(`<!--[0--><p class="err" role="alert">That code is not valid, or the school has not been verified yet.</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (form?.error) {
        $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form method="post" action="?/lookup" class="card"><label for="code">School or class code</label><input id="code" name="code" autocapitalize="characters" placeholder="K7QM-4TXD" required=""/> <p class="muted">Find it on the school's poster, or scan the QR code with your phone camera.</p> <button class="primary">Continue</button></form>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
