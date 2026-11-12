// lancé par le test « local » de NeoDex : commence la première planète, lance trois astéroïdes à la souris (lance-pierre),
// vérifie que la planète perd des pixels et que le stock baisse, puis pause (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const label = () => pj(`document.getElementById('ctCanvas').getAttribute('aria-label') || ''`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('ctCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'cataclysme-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const ptr = (type, x, y) => pj(`(() => { const c = document.getElementById('ctCanvas'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('${type}', {pointerId: 1, clientX: r.left + ${x} / 240 * r.width, clientY: r.top + ${y} / 150 * r.height, bubbles: true})); return 0; })()`);
  await sleep(600); await shot('0-depart');
  let l = await label(); if (!/: prête, 0 % détruits/.test(l)) throw new Error('la planète devait attendre le départ : « ' + l + ' »');
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: ' ', bubbles: true})), 0`); await sleep(300);
  for (const [x0, y0, x, y] of [[50, 82, -10, 82], [120, 30, 120, -30], [190, 120, 240, 160]]) {
    await ptr('pointerdown', x0, y0); await ptr('pointermove', x, y); await sleep(250); if (x0 === 50) await shot('1-viser');
    await ptr('pointerup', x, y); await sleep(1200);
  }
  await shot('2-impacts');
  l = await label(); const m = /: en jeu, (\d+) % détruits, arme Astéroïde, reste (\d+) Astéroïde/.exec(l);
  if (!m || +m[1] < 10 || +m[2] !== 2) throw new Error('trois astéroïdes devaient creuser la planète : « ' + l + ' »');
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'p', bubbles: true})), 0`); await sleep(300);
  if (!/: pause,/.test(await label())) throw new Error('P devait mettre en pause : « ' + await label() + ' »');
  return l;
};
