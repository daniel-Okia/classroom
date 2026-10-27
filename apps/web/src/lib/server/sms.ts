/** SMS provider adapter. The console provider prints codes in dev; Africa's Talking is plugged in via env (see docs). */
export interface SmsProvider { send(phone: string, text: string): Promise<void> }
export const consoleSms: SmsProvider = { async send(phone, text) { console.log(`[sms:dev] to ${phone}: ${text}`); } };
export const africasTalking: SmsProvider = {
  async send(phone, text) {
    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: { apiKey: process.env.AT_API_KEY!, 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({ username: process.env.AT_USERNAME!, to: phone, message: text }),
    });
    if (!res.ok) throw new Error(`SMS failed ${res.status}`);
  },
};
export let sms: SmsProvider = process.env.AT_API_KEY ? africasTalking : consoleSms;
export const setSmsProvider = (p: SmsProvider) => { sms = p; };
