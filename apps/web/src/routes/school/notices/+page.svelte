<script lang="ts">
  let { form }: { form: any } = $props();
</script>
<h1>Post to families</h1>
{#if form?.error}<p class="err" role="alert">{form.error}</p>{/if}{#if form?.posted}<p class="ok">Notice posted.</p>{/if}{#if form?.eventPosted}<p class="ok">Event added.</p>{/if}
<form method="post" action="?/notice" class="card"><h2 style="margin-top:0">Notice</h2>
  <label for="nt">Title</label><input id="nt" name="title" required /><label for="nb">Message</label><textarea id="nb" name="body" rows="4" required></textarea>
  <label for="np">Priority</label><select id="np" name="priority"><option value="normal">Normal</option><option value="important">Important</option><option value="emergency">Emergency (ignores quiet hours)</option></select>
  <label for="na">Send to</label><select id="na" name="audience"><option value="school">Whole school</option><option value="level">One level</option></select>
  <label for="nl">Level (if one level)</label><input id="nl" name="level" placeholder="S4" />
  <label for="nv">School verse (optional)</label><input id="nv" name="verse" /><button class="primary" style="margin-top:12px">Post notice</button></form>
<form method="post" action="?/event" class="card"><h2 style="margin-top:0">Event</h2>
  <label for="et">Title</label><input id="et" name="title" required /><label for="ek">Type</label><select id="ek" name="kind"><option>meeting</option><option>trip</option><option>exam</option><option>holiday</option><option>sports</option></select>
  <label for="es">Starts</label><input id="es" name="starts" type="datetime-local" required /><label for="ed">Reply by (optional)</label><input id="ed" name="deadline" type="datetime-local" />
  <label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" name="consent" style="width:24px;min-height:24px" /> Needs parent permission</label>
  <button class="primary" style="margin-top:12px">Add event</button></form>
