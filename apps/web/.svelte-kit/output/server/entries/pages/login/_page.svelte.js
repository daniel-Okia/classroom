import { h as head, a as attr } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { form } = $$props;
    head("1x05zx6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Sign in · Classroom</title>`);
      });
    });
    $$renderer2.push(`<h1>Welcome to Classroom</h1> <p class="muted">Built on faith. Strengthened at home. Learning together.</p> `);
    if (form?.error) {
      $$renderer2.push(`<!--[0--><p class="err" role="alert">${escape_html(form.error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!form?.sent) {
      $$renderer2.push(`<!--[0--><form method="post" action="?/send" class="card"><label for="phone">Your phone number</label> <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0772 123 456"${attr("value", form?.phone ?? "")} required=""/> <p class="muted">We will text you a 6-digit code. No password needed.</p> <button class="primary">Send my code</button></form>`);
    } else {
      $$renderer2.push(`<!--[-1--><form method="post" action="?/verify" class="card"><input type="hidden" name="phone"${attr("value", form.phone)}/> <p class="ok">We sent a code to ${escape_html(form.phone)}.</p> <label for="code">6-digit code</label> <input id="code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required=""/> <label for="name">Your name (first time only)</label> <input id="name" name="name" autocomplete="name"/> <button class="primary" style="margin-top:16px">Continue</button></form>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
