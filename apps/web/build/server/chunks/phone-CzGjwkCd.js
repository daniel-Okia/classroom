function normalisePhone(input) {
  const d = input.replace(/[\s\-().]/g, "");
  const m = d.match(/^(?:\+?256|0)?(7\d{8}|3\d{8}|4\d{8})$/);
  return m ? `+256${m[1]}` : null;
}

export { normalisePhone as n };
//# sourceMappingURL=phone-CzGjwkCd.js.map
