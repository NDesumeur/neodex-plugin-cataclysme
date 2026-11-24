// lancé par le test « local » de NeoDex : la vérification interne (planètes, armes, bac à sable, ralenti), trois astéroïdes à la souris (lance-pierre),
// la visée et le tir à la manette, la pause voulue qui reste et celle de l'onglet qui se lève, le bac à sable, le ralenti, le plein écran et la place prise
// (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const label = () => pj(`document.getElementById('ctCanvas').getAttribute('aria-label') || ''`);
  const C = code => pj(`(() => { const T = document.getElementById('ctCanvas').__ct, ct = T.st(), CT = T.CT; ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('ctCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'cataclysme-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const ptr = (type, x, y) => pj(`(() => { const c = document.getElementById('ctCanvas'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('${type}', {pointerId: 1, clientX: r.left + ${x} / 240 * r.width, clientY: r.top + ${y} / 150 * r.height, bubbles: true})); return 0; })()`);
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
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
  // la manette : le stick déplace le viseur, A maintenu puis relâché tire
  await pj(`(() => { const pad = {axes: [0, 0, 0, 0], buttons: Array.from({length: 17}, () => ({pressed: false}))}; window.__pad = pad; navigator.getGamepads = () => [pad]; return 0; })()`);
  const a0 = await C('return ct.aim.y;');
  await pj(`(__pad.axes[1] = -1, 0)`); await sleep(400); await pj(`(__pad.axes[1] = 0, 0)`); await sleep(50);
  const a1 = await C('return ct.aim.y;'); if (!(a1 < a0 - 5)) throw new Error('le stick ne monte pas le viseur : ' + a0 + ' → ' + a1);
  await C('ct.aim.x = 30; ct.aim.y = CT.CY; return 0;');
  const f0 = await C('return ct.fired;');
  await pj(`(__pad.buttons[0].pressed = true, 0)`); await sleep(500); await pj(`(__pad.buttons[0].pressed = false, 0)`); await sleep(100);
  const f1 = await C('return ct.fired;'); if (f1 !== f0 + 1) throw new Error('A maintenu puis relâché ne tire pas (' + f0 + ' → ' + f1 + ')');
  await pj(`navigator.getGamepads = () => [], 0`); await sleep(1500);
  // la pause : celle du changement d'onglet se lève au retour, celle demandée (P) reste
  await C(`ct.mode = 'pause'; ct.user = false; T.open(); return 0;`); if (await C('return ct.mode;') !== 'play') throw new Error('la partie ne reprend pas au retour sur l\'onglet');
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'p', bubbles: true})), 0`); await sleep(100); await C('T.open(); return 0;');
  if (!/: pause,/.test(await label()) && await C('return ct.mode;') !== 'pause') throw new Error('la pause demandée devait rester');
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'p', bubbles: true})), 0`);
  // le bac à sable : armes à volonté, toutes affichées ; puis le ralenti quand la planète éclate
  await pj(`document.getElementById('ctSand').click(), 0`); await sleep(200);
  const sand = await C('return ct.sand && ct.ammo.hole === Infinity && ct.mode;'); if (sand !== 'ready') throw new Error('bac à sable : ' + sand);
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: ' ', bubbles: true})), 0`); await sleep(200);
  for (const [x0, y0, x, y] of [[50, 82, -10, 82], [50, 60, -10, 70], [190, 82, 250, 82], [190, 100, 250, 110], [120, 30, 120, -30]]) { await ptr('pointerdown', x0, y0); await ptr('pointermove', x, y); await ptr('pointerup', x, y); await sleep(200); }
  await sleep(800); await shot('3-bac-a-sable');
  const left = await C('return ct.ammo.ast === Infinity;'); if (!left) throw new Error('le bac à sable devait garder les astéroïdes à volonté');
  await C('for (let i = 0; i < ct.grid.length && ct.alive > ct.n0 * .075; i++) if (ct.grid[i]) { ct.grid[i] = 0; ct.cov[i] = 0; ct.alive--; } ct.wsel = "bomb"; return 0;'); await ptr('pointerdown', 120, 30); await ptr('pointerup', 120, 30);  // la planète vidée à 92 % : elle éclate (une bombe en plus)
  for (let i = 0; i < 60 && !(await C('return ct.slow;')); i++) await sleep(100); await sleep(500); await shot('4-ralenti');
  const slow = await C('return ct.slow;'); if (!(slow > 0)) throw new Error('pas de ralenti quand la planète éclate : ' + JSON.stringify(await C('return {m: ct.mode, p: ct.pulver, a: ct.alive, n: ct.n0, s: ct.slow, sand: ct.sand};')));
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pj(`document.getElementById('ctSand').click(), 0`); await sleep(200);
  // Gaïa : ses villes allumées, puis le laser (touche 2) et le virus (touche 3) ; et le joueur automatique sur les trois nouvelles planètes
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  await C('T.go(7); ct.tick = 200; return 0;'); await sleep(500); await shot('5-gaia');
  await key('2'); await ptr('pointerdown', 40, 82); await ptr('pointermove', -10, 82); await ptr('pointerup', -10, 82); await sleep(400);
  await key('3'); await ptr('pointerdown', 200, 50); await ptr('pointermove', 250, 30); await ptr('pointerup', 250, 30); await sleep(900); await shot('6-laser-virus');
  const used = await C('return ct.ammo.laser + ":" + ct.ammo.virus;'); if (used !== '1:1') throw new Error('laser et virus au clavier : ' + used);
  const bots = await C('return [7, 8, 9].map(li => T.bot(li, 3)).join(" / ");'); const botsTxt = ' · automatique ' + bots;
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.getElementById('ctFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('ctCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('ctCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('ctCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 200) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok' + botsTxt + ' · ' + m[1] + ' % au lance-pierre · manette · reprise au retour · bac à sable · ralenti · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
