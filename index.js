// Cataclysme : détruire des planètes en pixels avec des astéroïdes, des comètes, des bombes et des trous noirs.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Cataclysme</span><span class="hint">glisser : lancer · 1 à 7 : arme · flèches, A / E et Espace : viser au clavier · manette · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="ctCanvas" width="240" height="150" role="img" aria-label="Cataclysme"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="ctStats"></div></div>
      <div class="row"><button class="btn main" id="ctNew">NOUVELLE PARTIE</button><button class="btn" id="ctFs">PLEIN ÉCRAN</button></div>
      <div class="row"><button class="btn" id="ctSand" aria-pressed="false">BAC À SABLE : NON</button></div>
      <div class="hint">Appuie dans l'espace, tire en arrière comme un lance-pierre et lâche : les pointillés montrent la trajectoire, courbée par la gravité. Chaque pixel arraché devient un débris : lent, il retombe et se recolle ; rapide, il part dans l'espace. Plus la planète maigrit, moins elle attire. La comète traverse, la bombe se pose puis explose, le trou noir avale tout ce qui l'approche. Le laser orbital creuse une ligne droite, le virus ronge la croûte de proche en proche, la lune s'écrase de tout son poids. Sur les planètes habitées, les villes s'allument du côté de la nuit ; l'eau et la lave coulent dans les cratères. Une étoile ouvre la planète suivante. Au clavier : flèches pour le viseur, A et E pour l'angle, Espace maintenu pour la puissance. À la manette : stick gauche ou croix pour le viseur, stick droit ou LB / RB pour l'angle, A maintenu pour la puissance, X pour changer d'arme, Start pour la pause.</div>
      <div class="hint">Bac à sable : toutes les armes à volonté sur toutes les planètes, pour le plaisir ; ni étoiles ni record.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 560px;min-width:min(100%,560px);position:relative}
.gameBox canvas{width:min(100%,max(320px,calc((100vh - 200px) * 240 / 150)));height:auto;aspect-ratio:240/150;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gameBox:fullscreen{padding:0;display:grid;place-items:center}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 240 / 150))}
.gSide{display:flex;flex-direction:column;gap:14px;flex:0 1 320px;min-width:250px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '∞': '....... ....... .##.##. #..#..# .##.##. ....... .......', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "CATACLYSME", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#ff8a2a", "accL": "#ffe0b0", "accS": "#c0501a", "accD": "#2a1008", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#2a1008", "spark2": "#ff8a2a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", "....kkkk....", "..kkaaaakk..", ".kaawaaaaak.", ".kawa.kaaak.", "kaaa.oo.aaak", "kaaak.o.kaak", ".kaa.oo.aak.", ".kaaak.aaak.", "..kkaaaakk..", "....kkkk....", "............"],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Cataclysme : une planète en pixels au milieu de l'écran. Lance-lui des astéroïdes, des comètes, des bombes et des trous noirs :
   chaque pixel arraché devient un débris qui retombe ou s'échappe selon sa vitesse, et la planète attire moins à mesure qu'elle maigrit.
   Détruis assez de planète avec ce qu'on te donne : sept planètes, trois étoiles chacune ---------- */
const CT = {W: 240, H: 150, CX: 120, CY: 82, TOP: 14, VMAX: 4.2, G: .035, SETTLE: 240, CAP: 4500, SLOW: 170};
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const cts = gstore('cataclysme', {best: {}, stars: {}, wins: 0, games: 0, level: 0});
let ct = null, ctac = null, ctMute = false, ctSandOn = false;  // ctSandOn : le bac à sable, pour la partie en cours (pas enregistré)
function ctSound(kind, size = 1) {
  if (ctMute) return;
  try {
    ctac ??= new AudioContext(); const t = ctac.currentTime, g = ctac.createGain();
    if (kind === 'boom') {  // un bruit filtré qui s'éteint : plus le cratère est gros, plus il est grave et long
      const d = .25 + size * .5, b = ctac.createBuffer(1, Math.ceil(ctac.sampleRate * d), ctac.sampleRate), a = b.getChannelData(0);
      for (let i = 0; i < a.length; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / a.length) ** 2;
      const s = ctac.createBufferSource(), f = ctac.createBiquadFilter(); s.buffer = b; f.type = 'lowpass';
      f.frequency.setValueAtTime(1800 - size * 900, t); f.frequency.exponentialRampToValueAtTime(80, t + d);
      g.gain.value = .12 + size * .1; s.connect(f).connect(g).connect(ctac.destination); s.start(t); return;
    }
    const o = ctac.createOscillator(), [f0, f1, d, ty] = {laser: [1400, 220, .6, 'sawtooth'], virus: [180, 620, .35, 'triangle'], city: [300, 90, .4, 'square'], launch: [520, 180, .18, 'square'], pick: [660, 660, .05, 'square'], hole: [90, 30, 1.2, 'sawtooth'], win: [440, 880, .5, 'square'], tick: [880, 880, .03, 'square']}[kind];
    o.type = ty; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + d);
    g.gain.setValueAtTime(.035, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(ctac.destination); o.start(t); o.stop(t + d);
  } catch {}
}
// les matières : dureté (un cratère est plus petit dans du dur) et couleurs ; « glow » : brille sans ombre (magma, noyau)
const CT_MAT = [null,
  {n: 'croûte', h: 1, c: ['#8a7a68', '#76665a', '#9a8a76']},
  {n: 'roche', h: 1.25, c: ['#5a4848', '#4e3e40', '#685454']},
  {n: 'magma', h: .8, c: ['#ff6a1a', '#e8501a', '#ff8a2a'], glow: 1},
  {n: 'noyau', h: 2.2, c: ['#ffd84a', '#ffc030', '#ffe88a'], glow: 1},
  {n: 'gravats', h: .7, c: ['#6a5a4a']},
  {n: 'glace', h: .85, c: ['#c8e4f8', '#b0d4f0', '#e0f0ff']},
  {n: 'métal', h: 1.7, c: ['#7a8a98', '#6a7a88', '#909eac']},
  {n: 'eau', h: .6, c: ['#2a64c0', '#2458b0', '#3474d0']},
  {n: 'herbe', h: 1, c: ['#4a9a3a', '#3e8a32', '#5aaa44']},
  {n: 'cristal', h: 1.1, c: ['#b85ad8', '#a04ac8', '#d07ae8']},
  {n: 'sable', h: .9, c: ['#d8b870', '#c8a860', '#e8c880']},
];
// les armes : stock donné par planète
const CT_W = {ast: 'Astéroïde', com: 'Comète', bomb: 'Bombe', hole: 'Trou noir', laser: 'Laser', virus: 'Virus', moon: 'Lune'};
const CT_WK = Object.keys(CT_W);
// les planètes : rayon, couches de l'extérieur vers le centre [fraction du rayon, matière], stock d'armes, étoiles (% détruit)
const CT_LEVELS = [
  {name: 'Rocaille', r: 30, layers: [[1, 1], [.72, 2], [.3, 4]], w: {ast: 5}, goals: [40, 50, 60]},
  {name: 'Givre', r: 36, layers: [[1, 6], [.78, 2], [.3, 4]], w: {ast: 3, com: 3}, goals: [30, 40, 48]},
  {name: 'Brasier', r: 38, layers: [[1, 1], [.84, 3], [.3, 4]], w: {ast: 3, bomb: 3}, veins: 3, goals: [45, 55, 65]},
  {name: 'Ceinture', r: 34, layers: [[1, 10], [.7, 2], [.3, 4]], w: {ast: 4, com: 2, bomb: 2}, ring: 110, goals: [40, 55, 65]},
  {name: 'Ferrum', r: 38, layers: [[1, 7], [.32, 4]], w: {ast: 2, bomb: 3, hole: 2}, goals: [35, 45, 52]},
  {name: 'Azur', r: 44, layers: [[1, 8], [.88, 2], [.58, 3], [.28, 4]], w: {ast: 3, com: 2, bomb: 2, hole: 1}, land: 9, goals: [40, 50, 58]},
  {name: 'Titan', r: 52, layers: [[1, 11], [.9, 1], [.75, 2], [.55, 3], [.36, 4]], w: {ast: 4, com: 3, bomb: 3, hole: 2}, goals: [40, 50, 60]},
  {name: 'Gaïa', r: 40, layers: [[1, 8], [.86, 1], [.6, 3], [.28, 4]], w: {ast: 4, laser: 2, virus: 2}, land: 9, cities: 6, goals: [30, 40, 50]},
  {name: 'Métropole', r: 44, layers: [[1, 1], [.8, 2], [.55, 3], [.3, 4]], w: {bomb: 2, laser: 2, virus: 2, moon: 1}, land: 9, cities: 9, goals: [45, 58, 70]},
  {name: 'Jumelle', r: 50, layers: [[1, 8], [.9, 6], [.7, 2], [.45, 3], [.25, 4]], w: {ast: 3, com: 2, hole: 1, moon: 2}, land: 11, goals: [45, 58, 70]},
];
const ctUnlocked = li => li === 0 || ctSandOn || (cts.stars[li - 1] || 0) >= 1;
const ctHas = w => ct.sand || ct.L.w[w] != null;  // les armes de cette partie (toutes au bac à sable)
// une couleur #rrggbb, assombrie ou éclaircie, rangée comme un pixel d'ImageData (petit-boutiste : 0xAABBGGRR)
const ctPack = (hex, f = 1) => { const v = i => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * f))); return (255 << 24 | v(5) << 16 | v(3) << 8 | v(1)) >>> 0; };
const ctMix = (a, b, t) => { const c = (s, k) => (a >>> s & 255) * (1 - t) + (b >>> s & 255) * t; return (255 << 24 | c(16) << 16 | c(8) << 8 | c(0)) >>> 0; };
// un bruit doux (valeurs sur une grille, interpolées) pour les taches de couleur et les continents
function ctNoise(rng, n = 16) { const v = Array.from({length: (n + 1) * (n + 1)}, rng);
  return (x, y) => { const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, a = (u, w) => v[((w % n + n) % n) * (n + 1) + (u % n + n) % n];
    const s = t => t * t * (3 - 2 * t), l = (p, q, t) => p + (q - p) * s(t); return l(l(a(i, j), a(i + 1, j), fx), l(a(i, j + 1), a(i + 1, j + 1), fx), fy); }; }
const ctIdx = (x, y) => y * CT.W + x;
const ctPct = () => ct.n0 ? Math.min(100, Math.floor((ct.n0 - ct.alive) / ct.n0 * 100)) : 0;
const ctGM = () => CT.G * ct.L.r * ct.L.r * Math.max(.05, ct.alive / ct.n0);
function ctNew(li = cts.level) {
  const g = ct?.g, img = ct?.img, L = CT_LEVELS[li], rng = seeded(li * 131 + 7), {W, H, CX, CY} = CT;
  ct = renew(ct, {g, img, li, L, mode: 'ready', tick: 0, seen: 0, dead: 0, grid: new Uint8Array(W * H), col: new Uint32Array(W * H), skin: new Uint32Array(W * H), cov: new Uint8Array(W * H), bg: new Uint32Array(W * H), n0: 0, alive: 0,
    parts: [], shots: [], holes: [], fx: [], sand: ctSandOn, ammo: ctSandOn ? Object.fromEntries(CT_WK.map(k => [k, Infinity])) : {...L.w}, wsel: ctSandOn ? 'ast' : CT_WK.find(k => L.w[k]), slow: 0, slowAcc: 0, user: false, aim: {x: 30, y: CY, a: 0}, drag: null, charge: -1, idle: 0, shake: 0, flash: 0,
    stars: 0, record: false, msg: null, keys: new Set(), fired: 0, pulver: false, rng, beams: [], vir: [], virLeft: 0, inf: new Uint8Array(W * H), cities: [], cityLost: 0});
  // le ciel : étoiles de trois éclats et un soleil dans le coin, d'où vient la lumière
  ct.bg.fill(ctPack('#0a0818'));
  for (let i = 0; i < 260; i++) { const x = Math.floor(rng() * W), y = Math.floor(rng() * H), b = rng(); ct.bg[ctIdx(x, y)] = ctPack(b < .7 ? '#3a3458' : b < .93 ? '#7a74a0' : '#e8e4ff'); }
  for (let y = 0; y < 34; y++) for (let x = 0; x < 34; x++) { const d = Math.hypot(x, y); if (d < 11) ct.bg[ctIdx(x, y + CT.TOP)] = ctPack(d < 8 ? '#fff0b0' : '#ffd060');
    else if (d < 30 && (x * 7 + y * 3) % (d < 18 ? 5 : 9) === 0) ct.bg[ctIdx(x, y + CT.TOP)] = ctPack('#5a3a28'); }
  // la planète : couches, taches de couleur, ombre en quatre bandes (lumière en haut à gauche)
  const R = L.r, nz = ctNoise(rng), nz2 = ctNoise(rng, 8), lx = -.5, ly = -.55, lz = .67;
  for (let y = CY - R; y <= CY + R; y++) for (let x = CX - R; x <= CX + R; x++) {
    const dx = x - CX + .5, dy = y - CY + .5, d = Math.hypot(dx, dy); if (d > R) continue;
    const f = d / R; let m = L.layers[0][1]; for (const [fr, mm] of L.layers) if (f <= fr) m = mm;
    let sm = L.layers[0][1];  // la matière de surface au-dessus de ce point : continents, veines de lave
    if (L.land && nz2(x / 9, y / 9) > .56) { sm = L.land; if (m === L.layers[0][1]) m = sm; }
    if (L.veins && Math.abs(nz(x / 5, y / 5) - .5) < .03 * L.veins) { sm = 3; if (m === 1) m = 3; }
    const n = nz(x / 4, y / 4), pick = M => M.c[n < .38 ? 1 : n > .64 ? 2 : 0] || M.c[0], M = CT_MAT[m], S = CT_MAT[sm];
    const lam = Math.max(0, (dx * lx + dy * ly) / R + Math.sqrt(Math.max(0, 1 - f * f)) * lz), band = [.5, .7, .88, 1.06][Math.min(3, Math.floor(lam * 3.2))];
    const i = ctIdx(x, y); ct.grid[i] = m; ct.cov[i] = 1; ct.n0++;
    ct.skin[i] = ctPack(pick(S), S.glow ? .75 + band * .3 : band); ct.col[i] = ctPack(pick(M), M.glow ? 1 : .78 + band * .2);
  }
  ct.alive = ct.n0;
  if (L.cities) for (let k = 0; k < 120 && ct.cities.length < L.cities; k++) {  // les villes : sur la terre ferme, bien espacées
    const a = k * 2.399, ux = Math.cos(a), uy = Math.sin(a); let r = R + 1; while (r > 2 && !ct.grid[ctIdx(Math.floor(CX + ux * r), Math.floor(CY + uy * r))]) r -= .5;
    const bx = CX + ux * r, by = CY + uy * r, top = ct.grid[ctIdx(Math.floor(bx), Math.floor(by))];
    if (top === 8 || ct.cities.some(c => Math.abs(((c.a - a) % 6.283 + 9.425) % 6.283 - 3.1416) < 3 / L.cities)) continue;
    const cells = []; for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) { const X = Math.floor(bx - ux * 1.5) + x, Y = Math.floor(by - uy * 1.5) + y; if (Math.hypot(x, y) < 2.6 && ct.grid[ctIdx(X, Y)]) cells.push(ctIdx(X, Y)); }
    ct.cities.push({a, cells, lost: false, n: ct.cities.length});
  }
  if (L.ring) for (let i = 0; i < L.ring; i++) {  // une ceinture de rochers en orbite : ils arrêtent les tirs
    const a = rng() * Math.PI * 2, r = R + 16 + rng() * 9, v = Math.sqrt(ctGM() / r);
    ct.parts.push({x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r, vx: -Math.sin(a) * v, vy: Math.cos(a) * v, m: 10, col: ctPack(rng() < .5 ? '#9a8a9a' : '#6a5a6a'), hot: 0, ring: 1, life: 0});
  }
  ctInfo();
}
const ctSay = txt => { ct.msg = {txt, t: 120}; };
function ctReveal(x0, y0, r) { for (let y = Math.max(0, Math.floor(y0 - r)); y <= Math.min(CT.H - 1, y0 + r); y++) for (let x = Math.max(0, Math.floor(x0 - r)); x <= Math.min(CT.W - 1, x0 + r); x++) if (Math.hypot(x + .5 - x0, y + .5 - y0) < r) ct.cov[ctIdx(x, y)] = 0; }
// arrache un pixel de la planète : il devient un débris (ou s'évapore s'il y en a déjà trop)
function ctTear(i, vx, vy, hot, sucked = 0) {
  const m = ct.grid[i]; if (!m) return; ct.grid[i] = 0; ct.alive--;
  if (ct.parts.length < CT.CAP && (sucked || ct.rng() < .6)) ct.parts.push({x: i % CT.W + .5, y: Math.floor(i / CT.W) + .5, vx, vy, m, col: ct.col[i], hot, life: 0, sucked});
}
// un cratère : tout ce qui est à moins de R (divisé par la dureté) part, projeté vers l'extérieur
function ctCrater(x0, y0, R, power, dx = 0, dy = 0) {
  const {W, H, CX, CY} = CT, rng = ct.rng;
  for (let y = Math.max(0, Math.floor(y0 - R)); y <= Math.min(H - 1, y0 + R); y++) for (let x = Math.max(0, Math.floor(x0 - R)); x <= Math.min(W - 1, x0 + R); x++) {
    const i = ctIdx(x, y), m = ct.grid[i]; if (!m) continue;
    const ex = x + .5 - x0, ey = y + .5 - y0, d = Math.hypot(ex, ey), r = R / CT_MAT[m].h; if (d > r) continue;
    const nx = x + .5 - CX, ny = y + .5 - CY, nd = Math.hypot(nx, ny) || 1, k = d || 1;
    const ux = ex / k * .6 + nx / nd * .7 - dx * .25, uy = ey / k * .6 + ny / nd * .7 - dy * .25, s = power * (.3 + .7 * rng()) * (1 - d / r * .5) / (Math.hypot(ux, uy) || 1);
    ctTear(i, ux * s + (rng() - .5) * .4, uy * s + (rng() - .5) * .4, d < r * .7 ? 1 : .5);
  }
  ctReveal(x0, y0, R + 2); ct.fx.push({x: x0, y: y0, r: 1, R: R * 1.6, t: 0}); ct.shake = Math.max(ct.shake, Math.min(6, R / 3)); ct.flash = Math.max(ct.flash, Math.min(.35, (R - 8) / 40));
  ctSound('boom', Math.min(1, R / 18));
}
const ctSolid = (x, y) => { const X = Math.floor(x), Y = Math.floor(y); return X >= 0 && Y >= 0 && X < CT.W && Y < CT.H && ct.grid[ctIdx(X, Y)]; };
function ctPull(o, f = 1) {  // la planète et les trous noirs attirent
  const dx = CT.CX - o.x, dy = CT.CY - o.y, d2 = Math.max(16, dx * dx + dy * dy), d = Math.sqrt(d2), a = ctGM() / d2 * f;
  o.vx += dx / d * a; o.vy += dy / d * a;
  for (const h of ct.holes) { const hx = h.x - o.x, hy = h.y - o.y, e2 = Math.max(9, hx * hx + hy * hy), e = Math.sqrt(e2), b = Math.min(.5, 70 / e2) * f; o.vx += hx / e * b; o.vy += hy / e * b; }
}
// les tirs : vitesse (vx, vy) en pixels par image
function ctFire(x, y, vx, vy) {
  const w = ct.wsel; if (!ct.ammo[w] || ct.mode !== 'play') return false;
  if (w !== 'hole' && ctSolid(x, y)) return false;
  ct.ammo[w]--; ct.fired++; ct.idle = 0;
  if (w === 'hole') { ct.holes.push({x, y, t: 0, life: 260}); ctSound('hole'); }
  else if (w === 'laser') { const l = Math.hypot(vx, vy) || 1; ct.beams.push({x, y, ux: vx / l, uy: vy / l, t: 0, life: 70, hx: x, hy: y}); ctSound('laser'); }
  else { const s = w === 'com' ? 1.35 : w === 'moon' ? .85 : 1; ct.shots.push({w, x, y, vx: vx * s, vy: vy * s, t: 0, e: 700, stuck: 0, trail: []}); ctSound('launch'); }
  if (!ct.ammo[w]) ct.wsel = CT_WK.find(k => ct.ammo[k]) || w;
  return true;
}
function ctShotStep(s) {
  const sp = Math.hypot(s.vx, s.vy), n = Math.max(1, Math.ceil(sp));
  for (let k = 0; k < n; k++) {
    ctPull(s, 1 / n);
    const ox = s.x, oy = s.y; s.x += s.vx / n; s.y += s.vy / n;
    for (const p of ct.parts) if (p.ring && Math.abs(p.x - s.x) < 2.5 && Math.abs(p.y - s.y) < 2.5) {  // un rocher de la ceinture arrête le tir
      ct.parts = ct.parts.filter(q => Math.hypot(q.x - s.x, q.y - s.y) > 5 || !q.ring); ctCrater(s.x, s.y, 5, 1); return false; }
    if (!ctSolid(s.x, s.y)) { if (s.w === 'com' && s.dig && Math.hypot(s.x - CT.CX, s.y - CT.CY) > ct.L.r + 3) { ctCrater(s.x, s.y, 5, 1.2, s.vx / sp, s.vy / sp); return false; } continue; }
    if (s.w === 'ast') { ctCrater(s.x, s.y, 5 + sp * 3, sp * 1.05, s.vx / sp, s.vy / sp); return false; }
    if (s.w === 'virus') { ctInfect(Math.floor(s.x), Math.floor(s.y)); return false; }
    if (s.w === 'moon') {  // la lune s'écrase : un cratère énorme, et ses propres roches volent en éclats
      ctCrater(s.x, s.y, 28 + sp * 2, sp * 1.3 + 2, s.vx / sp, s.vy / sp); ct.slow = Math.max(ct.slow, 60);
      for (let k = 0; k < 90; k++) { const a = ct.rng() * 6.283, v = .6 + ct.rng() * 1.6; ct.parts.push({x: ox, y: oy, vx: Math.cos(a) * v - s.vx * .3, vy: Math.sin(a) * v - s.vy * .3, m: 2, col: ctPack(k % 3 ? '#9a9aa8' : '#6a6a78'), hot: .6, life: 0}); }
      return false; }
    if (s.w === 'bomb') { s.x = ox; s.y = oy; s.stuck = 1; s.vx = s.vy = 0; s.t = 0; ctSound('tick'); return true; }
    // la comète creuse un tunnel et ralentit à chaque pixel arraché
    s.dig = 1; const before = ct.alive; ctReveal(s.x, s.y, 5);
    for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (x * x + y * y <= 9) { const X = Math.floor(s.x) + x, Y = Math.floor(s.y) + y;
      if (X >= 0 && Y >= 0 && X < CT.W && Y < CT.H) { const i = ctIdx(X, Y), m = ct.grid[i]; if (m && ct.rng() < 1 / CT_MAT[m].h) ctTear(i, -s.vx * .3 + (ct.rng() - .5) * 1.4, -s.vy * .3 + (ct.rng() - .5) * 1.4, 1); } }
    s.e -= (before - ct.alive) * .8 + 1; s.vx *= .995; s.vy *= .995;
    if (s.e <= 0 || sp < .5) { ctCrater(s.x, s.y, 7, 1.4, s.vx / sp, s.vy / sp); return false; }
  }
  if (s.w === 'com' && s.t % 2 === 0) ct.fx.push({x: s.x, y: s.y, dot: 1, t: 0, c: s.dig ? '#ffffff' : '#a0e0ff'});
  return s.x > -80 && s.y > -80 && s.x < CT.W + 80 && s.y < CT.H + 80 && s.t < 900;
}
function ctInfect(x, y) {  // le virus se pose : il ronge ensuite tout ce qui est tendre autour de lui
  for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { const X = x + i, Y = y + j; if (X < 0 || Y < 0 || X >= CT.W || Y >= CT.H) continue; const k = ctIdx(X, Y); if (ct.grid[k] && !ct.inf[k]) { ct.inf[k] = 1; ct.vir.push(k); } }
  ct.virLeft += 1400; ctReveal(x, y, 3); ctSound('virus');
}
function ctVirus() {  // douze bouchées par image : le pixel rongé disparaît et le virus gagne ses voisins (moins vite dans le dur, jamais dans le noyau)
  const {W} = CT;
  for (let n = 0; n < 12 && ct.vir.length && ct.virLeft > 0; n++) {
    const j = Math.floor(ct.rng() * ct.vir.length), i = ct.vir[j]; ct.vir[j] = ct.vir[ct.vir.length - 1]; ct.vir.pop(); ct.inf[i] = 0;
    const m = ct.grid[i]; if (!m || m === 3 || m === 8 || CT_MAT[m].h >= 2) continue;
    ct.grid[i] = 0; ct.alive--; ct.virLeft--; if (ct.rng() < .15) ct.fx.push({x: i % W, y: Math.floor(i / W), dot: 1, t: 0, c: '#8ae86a'});
    for (const k of [i - 1, i + 1, i - W, i + W]) { ct.cov[k] = 0; const q = ct.grid[k]; if (q && !ct.inf[k] && ct.rng() < .95 / CT_MAT[q].h) { ct.inf[k] = 1; ct.vir.push(k); } }
  }
  if (ct.vir.length && ct.virLeft <= 0) { for (const i of ct.vir) ct.inf[i] = 0; ct.vir = []; }
}
function ctBeams() {  // le laser orbital : chaque image, il arrache les premiers pixels qu'il rencontre sur sa ligne
  ct.beams = ct.beams.filter(b => {
    b.t++; let s = 0, got = 0;
    for (; s < 300 && got < 4; s += .7) { const X = Math.floor(b.x + b.ux * s), Y = Math.floor(b.y + b.uy * s); if (X < 0 || Y < CT.TOP || X >= CT.W || Y >= CT.H) break;
      for (const o of [-1, 0, 1]) { const XX = Math.floor(b.x + b.ux * s - b.uy * o), YY = Math.floor(b.y + b.uy * s + b.ux * o); if (XX < 0 || YY < 0 || XX >= CT.W || YY >= CT.H) continue; const i = ctIdx(XX, YY), m = ct.grid[i];
        if (m) { got++; if (ct.rng() < .5 / CT_MAT[m].h) ctTear(i, -b.ux * 1.4 + (ct.rng() - .5) * 1.2, -b.uy * 1.4 + (ct.rng() - .5) * 1.2, 1); } } }
    b.hx = b.x + b.ux * s; b.hy = b.y + b.uy * s; if (b.t % 3 === 0) ctReveal(b.hx, b.hy, 3);
    return b.t < b.life;
  });
}
function ctFlow() {  // l'eau (et plus lentement la lave) coule vers le centre et remplit les creux
  const {W, H, CX, CY} = CT, R = ct.L.r + 3, rng = ct.rng;
  for (let k = 0; k < 600; k++) {
    const x = Math.floor(CX - R + rng() * 2 * R), y = Math.floor(CY - R + rng() * 2 * R); if (x < 1 || y < CT.TOP || x >= W - 1 || y >= H - 1) continue;
    const i = ctIdx(x, y), m = ct.grid[i]; if (m !== 8 && !(m === 3 && rng() < .3)) continue;
    const dx = CX - x - .5, dy = CY - y - .5, d = Math.hypot(dx, dy); if (d < 1.5) continue;
    const ux = dx / d, uy = dy / d, side = rng() < .5 ? 1 : -1, tries = [[ux, uy], [ux - uy * side, uy + ux * side], [ux + uy * side, uy - ux * side], [-uy * side, ux * side]];
    for (const [tx, ty] of tries) { const X = Math.round(x + tx), Y = Math.round(y + ty); if (X === x && Y === y) continue; const j = ctIdx(X, Y); if (ct.grid[j]) continue;
      if (Math.hypot(X + .5 - CX, Y + .5 - CY) > d) continue;  // jamais vers l'extérieur
      ct.grid[j] = m; ct.col[j] = ct.col[i]; ct.cov[j] = 0; ct.grid[i] = 0; ct.cov[i] = 0; break; }
  }
}
function ctCities() {  // une ville dont la moitié du sol a disparu s'éteint
  for (const c of ct.cities) if (!c.lost && c.cells.filter(i => ct.grid[i]).length < c.cells.length / 2) {
    c.lost = true; ct.cityLost++; if (!ct.sand) cts.cities = (cts.cities || 0) + 1; ctSay(ct.cityLost === ct.cities.length ? 'Plus une lumière...' : 'Une ville s\'éteint'); ctSound('city'); }
}
function ctUpdate() {  // une image ; pendant le ralenti, le monde n'avance qu'une image sur quatre au début, puis reprend peu à peu sa vitesse
  if (ct.flash > 0) ct.flash = Math.max(0, ct.flash - .04);  // l'éclair passe en temps réel, même au ralenti
  if (ct.slow > 0) { ct.slow--; ct.slowAcc += .22 + .78 * (1 - ct.slow / CT.SLOW) ** 2; if (ct.slowAcc < 1) return; ct.slowAcc--; }
  ctStep();
}
function ctStep() {
  if (ct.msg && --ct.msg.t <= 0) ct.msg = null;
  // le clavier : flèches = viseur, A / E = angle, Espace maintenu = puissance
  if (ct.keys.size || ct.pad?.size) { const k = c => ct.keys.has(c) || !!ct.pad?.has(c), a = ct.aim; a.x = Math.max(2, Math.min(CT.W - 3, a.x + (k('R') - k('L')) * 1.5)); a.y = Math.max(CT.TOP + 2, Math.min(CT.H - 3, a.y + (k('D') - k('U')) * 1.5));
    a.a = Math.max(-1.2, Math.min(1.2, a.a + (k('E') - k('A')) * .025)); }
  if (ct.charge >= 0) ct.charge = Math.min(1, ct.charge + 1 / 50);
  ct.shots = ct.shots.filter(s => {
    s.t++;
    if (s.stuck) { if (++s.t > 80) { ctCrater(s.x, s.y, 20, 2.8); return false; } if (s.t % 20 === 0) ctSound('tick'); return true; }
    return ctShotStep(s);
  });
  // les trous noirs : ils arrachent ce qui est proche et avalent tout ce qui les touche
  ct.holes = ct.holes.filter(h => {
    h.t++; const R = 26 * Math.min(1, h.t / 30) * (h.t > h.life - 30 ? (h.life - h.t) / 30 : 1); if (h.t % 6 === 0) ctReveal(h.x, h.y, R * .8);
    for (let k = 0; k < 26; k++) {
      const a = ct.rng() * Math.PI * 2, d = Math.sqrt(ct.rng()) * R, X = Math.floor(h.x + Math.cos(a) * d), Y = Math.floor(h.y + Math.sin(a) * d);
      if (X < 0 || Y < 0 || X >= CT.W || Y >= CT.H) continue; const i = ctIdx(X, Y), m = ct.grid[i]; if (!m) continue;
      if (d < 4) { ct.grid[i] = 0; ct.alive--; continue; }
      if (ct.rng() < (1 - d / R) * .9 / CT_MAT[m].h) ctTear(i, -Math.sin(a) * .9 - Math.cos(a) * .2, Math.cos(a) * .9 - Math.sin(a) * .2, 0, 1);
    }
    if (h.t % 2 === 0) ct.fx.push({x: h.x, y: h.y, hole: 1, t: 0, a: ct.rng() * 6.3, d: 12 + ct.rng() * 8});
    return h.t < h.life;
  });
  ctBeams(); ctVirus(); ctFlow(); if (ct.tick % 10 === 0) ctCities();
  // les débris : attirés, ils retombent et se recollent s'ils sont lents, rebondissent sinon, ou partent dans l'espace
  const {W, H} = CT;
  ct.parts = ct.parts.filter(p => {
    p.life++; if (p.hot > 0) p.hot -= .015;
    ctPull(p);
    for (const h of ct.holes) if (Math.abs(h.x - p.x) < 3 && Math.abs(h.y - p.y) < 3) return false;
    const nx = p.x + p.vx, ny = p.y + p.vy;
    if (nx < -60 || ny < -60 || nx > W + 60 || ny > H + 60) return false;
    if (!p.sucked && ctSolid(nx, ny)) {
      if (p.ring) return false;
      if (p.vx * p.vx + p.vy * p.vy < 1.1) { const X = Math.floor(p.x), Y = Math.floor(p.y);
        if (X >= 0 && Y >= 0 && X < W && Y < H && !ct.grid[ctIdx(X, Y)]) { const i = ctIdx(X, Y); ct.grid[i] = p.m === 8 ? 8 : 5; ct.cov[i] = 0; ct.col[i] = p.m === 8 ? p.col : p.hot > .3 ? ctMix(p.col, ctPack('#ff8a3a'), .5) : ctMix(p.col, ctPack('#3a3040'), .25); ct.alive++; }
        return false; }
      p.vx *= -.35; p.vy *= -.35; return true;
    }
    p.x = nx; p.y = ny;
    return p.ring || p.sucked || p.life < 1800;
  });
  ct.fx = ct.fx.filter(f => ++f.t < (f.R ? 14 : f.hole ? 24 : 20));
  if (ct.shake > 0) ct.shake = Math.max(0, ct.shake - .3);
  // planète presque finie : elle éclate d'un coup
  if (!ct.pulver && ctPct() >= 92) {
    ct.pulver = true; ctSound('boom', 1); ctSound('hole'); ct.shake = 8; ct.flash = 1; ct.slow = CT.SLOW;  // le noyau explose : ralenti
    for (let i = 0; i < ct.grid.length; i++) if (ct.grid[i]) { const x = i % W - CT.CX, y = Math.floor(i / W) - CT.CY, d = Math.hypot(x, y) || 1, s = 1.6 + ct.rng() * 2.4; ctTear(i, x / d * s, y / d * s, 1); }
  }
  // fin : plus de munitions, plus rien en vol, et les débris ont eu le temps de retomber
  const busy = ct.shots.length || ct.holes.length || ct.beams.length || ct.vir.length;
  if (busy) ct.idle = 0; else if (!CT_WK.some(k => ct.ammo[k]) || ct.pulver) { if (++ct.idle > (ct.pulver ? 120 : CT.SETTLE)) ctEnd(); }
}
function ctEnd() {
  const p = ctPct(), L = ct.L; ct.mode = 'over'; ct.dead = 0;
  if (ct.sand) { ct.stars = 0; ctSound('win'); return; }  // le bac à sable ne compte rien
  ct.stars = L.goals.filter(g => p >= g).length; cts.games++;
  if (p > (cts.best[ct.li] ?? -1)) { ct.record = cts.best[ct.li] != null; cts.best[ct.li] = p; }
  if (ct.stars > (cts.stars[ct.li] || 0)) cts.stars[ct.li] = ct.stars;
  if (ct.stars) { cts.wins++; ctSound('win'); if (ct.li + 1 < CT_LEVELS.length) cts.level = ct.li + 1; }
  saveGames(); ctInfo();
}
// les dessins des tirs
const CT_AST = [['.kkk.', 'kaAak', 'kaaak', 'kdaak', '.kkd.'], ['.kkk.', 'kadak', 'kAaak', 'kaaak', '.kkk.']];
const CT_BOMB = ['..r..', '.kkk.', 'kaAak', 'kaaak', '.kkk.'];
const CT_SPAL = {k: '#1a1010', a: '#8a7060', A: '#c0a890', d: '#5a4838'};
const CT_BPAL = {k: '#101018', a: '#3a3a4a', A: '#7a7a8a', r: '#ff3a2a'};
const CT_ICON = {
  ast: ['..kkk..', '.kaAak.', 'kaAaaak', 'kaaaadk', 'kdaaadk', '.kddak.', '..kkk..'],
  com: ['......k', '....kwk', '..kwwk.', 'kwWwk..', 'kWWwk..', 'kwWk...', '.kk....'],
  bomb: ['....r..', '...k...', '.kkkk..', 'kaAaak.', 'kaaaak.', 'kaaaak.', '.kkkk..'],
  hole: ['..ooo..', '.okkko.', 'okkkkko', 'okkkkko', 'okkkkko', '.okkko.', '..ooo..'],
  laser: ['......r', '.....rW', '....rW.', '...rW..', 'kkrW...', 'kAkr...', 'kkk....'],
  virus: ['.g.g.g.', 'gGgGgGg', '.gGGGg.', 'gGGkGGg', '.gGGGg.', 'gGgGgGg', '.g.g.g.'],
  moon: ['..kkk..', '.kmMmk.', 'kmMmmnk', 'kmmnmmk', 'knmmmnk', '.knnmk.', '..kkk..'],
};
const CT_IPAL = {k: '#0a0810', a: '#8a7060', A: '#c0a890', d: '#5a4838', w: '#a0e0ff', W: '#ffffff', r: '#ff3a2a', o: '#ff8a2a', g: '#3aa83a', G: '#8ae86a', m: '#9a9aa8', M: '#d0d0dc', n: '#5a5a68'};
const CT_IDIM = Object.fromEntries(Object.keys(CT_IPAL).map(k => [k, /[AwWoGM]/.test(k) ? '#3a3048' : '#2a2038']));  // une arme vide, toute grise
const CT_STAR = ['...k...', '..kyk..', 'kkkyykk', 'kyyyyyk', '.kyyyk.', '.kykyk.', 'kk...kk'];
function ctStars(g, n, x, y) { for (let i = 0; i < 3; i++) CT_STAR.forEach((r, j) => [...r].forEach((c, k) => { const col = (i < n ? {k: '#1a1008', y: '#ffd84a'} : {k: '#5a5068', y: '#3a3046'})[c]; if (col) px(g, col, x + i * 18 + k * 2, y + j * 2, 2, 2); })); }
// la trajectoire prévue d'un tir (pointillés), la même physique que le vrai tir
function ctPath(x, y, vx, vy) {
  const s = ct.wsel === 'com' ? 1.35 : ct.wsel === 'moon' ? .85 : 1, o = {x, y, vx: vx * s, vy: vy * s}, out = []; let lx = x, ly = y;
  if (ct.wsel === 'laser') { const l = Math.hypot(vx, vy) || 1; o.vx = vx / l * 3; o.vy = vy / l * 3; }  // le laser va tout droit
  for (let k = 0; k < 160; k++) { if (ct.wsel !== 'laser') ctPull(o); o.x += o.vx; o.y += o.vy; if (ctSolid(o.x, o.y) || o.x < -5 || o.y < -5 || o.x > CT.W + 5 || o.y > CT.H + 5) break;
    if (Math.hypot(o.x - lx, o.y - ly) >= 4) { out.push([o.x, o.y]); lx = o.x; ly = o.y; } }
  return out;
}
// le tir au clavier : du viseur vers le centre de la planète, tourné de l'angle choisi
function ctKeyVel(p) { const dx = CT.CX - ct.aim.x, dy = CT.CY - ct.aim.y, d = Math.hypot(dx, dy) || 1, c = Math.cos(ct.aim.a), s = Math.sin(ct.aim.a), v = CT.VMAX * (.3 + .7 * p);
  return [(dx * c - dy * s) / d * v, (dx * s + dy * c) / d * v]; }
const ctDragVel = d => { let vx = (d.x0 - d.x) * .07, vy = (d.y0 - d.y) * .07; const v = Math.hypot(vx, vy); if (v > CT.VMAX) { vx *= CT.VMAX / v; vy *= CT.VMAX / v; } return [vx, vy]; };
function ctDraw() {
  const g = ct.g, {W, H, TOP} = CT;
  for (; ct.seen < ct.tick; ct.seen++) if (ct.mode === 'over') ct.dead++;
  g.imageSmoothingEnabled = false;
  ct.img ??= g.createImageData(W, H);
  const buf = new Uint32Array(ct.img.data.buffer), grid = ct.grid, col = ct.col, skin = ct.skin, cov = ct.cov, inf = ct.inf, virC = ctPack((ct.tick >> 2) % 2 ? '#5ae83a' : '#a8ff7a');
  buf.set(ct.bg);
  for (let i = W * TOP; i < grid.length; i++) if (grid[i]) {
    if (inf[i]) { buf[i] = virC; continue; }  // le virus, en vert qui palpite
    if (cov[i]) { buf[i] = skin[i]; continue; }
    const m = grid[i]; let c = col[i];
    // les bords des cratères : un pixel intérieur touché par le vide s'assombrit, pour lire la forme du trou
    if (!CT_MAT[m].glow && (!grid[i - 1] || !grid[i + 1] || !grid[i - W] || !grid[i + W])) c = ctMix(c, 0xff180a0a, .35);
    buf[i] = c;
  }
  const hotA = ctPack('#fff0a0'), hotB = ctPack('#ff6a1a');
  for (const p of ct.parts) {
    const X = Math.floor(p.x), Y = Math.floor(p.y); if (X < 0 || Y < TOP || X >= W || Y >= H) continue;
    const c = p.hot > 0 ? (p.hot > .5 ? ctMix(hotB, hotA, (p.hot - .5) * 2) : ctMix(p.col, hotB, p.hot * 2)) : p.col;
    buf[ctIdx(X, Y)] = c; if (p.ring && X + 1 < W && Y + 1 < H) { buf[ctIdx(X + 1, Y)] = c; buf[ctIdx(X, Y + 1)] = ctMix(c, 0xff000000, .3); buf[ctIdx(X + 1, Y + 1)] = ctMix(c, 0xff000000, .3); }
  }
  const sx = ct.shake ? Math.round((ct.rng() - .5) * ct.shake) : 0, sy = ct.shake ? Math.round((ct.rng() - .5) * ct.shake) : 0;
  if (sx || sy) { g.fillStyle = '#0a0818'; g.fillRect(0, 0, W, H); }
  g.putImageData(ct.img, sx, sy);
  g.save(); g.translate(sx, sy);
  for (const f of ct.fx) {
    if (f.R) { const r = f.r + (f.R - f.r) * f.t / 14, n = Math.ceil(r * 6); for (let k = 0; k < n; k++) { const a = k / n * 6.283; px(g, f.t < 6 ? '#fff0c0' : '#ff8a3a', f.x + Math.cos(a) * r, f.y + Math.sin(a) * r); } }
    else if (f.hole) { const a = f.a + f.t * .25, d = f.d * (1 - f.t / 24); px(g, f.t < 12 ? '#ffb040' : '#c04a1a', f.x + Math.cos(a) * d, f.y + Math.sin(a) * d); }
    else if (f.dot) px(g, f.c, f.x, f.y);
  }
  for (const b of ct.beams) { const n = Math.ceil(Math.hypot(b.hx - b.x, b.hy - b.y)), w = b.t < 6 || b.t > b.life - 8 ? 0 : 1;  // le rayon, du satellite à l'impact
    px(g, '#c8d0e0', b.x - 2, b.y - 1, 5, 3); px(g, '#ff4a6a', b.x - 1, b.y, 3, 1);
    for (let k = 0; k < n; k++) { const x = b.x + b.ux * k, y = b.y + b.uy * k; if (w) px(g, '#ff4a6a', x - b.uy, y + b.ux); px(g, (k + b.t) % 4 ? '#ffe0e8' : '#ff8aa0', x, y); }
    px(g, '#ffffff', b.hx - 1, b.hy - 1, 3, 3); }
  for (const c of ct.cities) if (!c.lost) {  // les villes : bâtiments gris le jour, lumières la nuit (elles s'allument une à une au début)
    const night = Math.cos(c.a) * -.67 + Math.sin(c.a) * -.74 < .15, on = ct.tick > 20 + c.n * 12;
    c.cells.forEach((i, k) => { if (!ct.grid[i]) return; const x = i % W, y = Math.floor(i / W); px(g, night ? (on && (k * 7 + (ct.tick >> 4)) % 9 ? (k % 3 ? '#ffe080' : '#fff4c0') : '#3a3048') : (k % 2 ? '#d8d0c0' : '#8a8478'), x, y); }); }
  for (const h of ct.holes) { const r = h.t < 20 ? h.t / 5 : h.t > h.life - 20 ? (h.life - h.t) / 5 : 4;
    for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) { const d = Math.hypot(x, y); if (d < r) px(g, '#000000', h.x + x, h.y + y); else if (d < r + 1.2) px(g, (x + y + h.t) % 3 ? '#ff8a2a' : '#fff0a0', h.x + x, h.y + y); } }
  for (const s of ct.shots) {
    if (s.w === 'ast') sprite(g, CT_AST[(s.t >> 3) & 1], s.x - 2, s.y - 2, CT_SPAL);
    else if (s.w === 'bomb') sprite(g, CT_BOMB, s.x - 2, s.y - 2, {...CT_BPAL, r: s.stuck && s.t % 20 < 10 ? '#ffffff' : '#ff3a2a'});
    else if (s.w === 'virus') { px(g, '#1a4a1a', s.x - 2, s.y - 2, 5, 5); px(g, s.t % 10 < 5 ? '#8ae86a' : '#3aa83a', s.x - 1, s.y - 1, 3, 3); }
    else if (s.w === 'moon') sprite(g, CT_ICON.moon, s.x - 3, s.y - 3, CT_IPAL);
    else { px(g, '#ffffff', s.x - 1, s.y - 1, 3, 3); px(g, '#a0e0ff', s.x - 1, s.y - 1); }
  }
  // la visée
  if (ct.mode === 'play') {
    const hole = ct.wsel === 'hole';
    if (ct.drag && ct.ammo[ct.wsel]) { const d = ct.drag;
      if (!hole) { const [vx, vy] = ctDragVel(d), n = Math.ceil(Math.hypot(d.x - d.x0, d.y - d.y0) / 3);  // l'élastique du lance-pierre, puis la trajectoire
        for (let k = 1; k < n; k++) px(g, '#6a5a88', d.x0 + (d.x - d.x0) * k / n, d.y0 + (d.y - d.y0) * k / n);
        ctPath(d.x0, d.y0, vx, vy).forEach(([x, y], k) => px(g, k % 2 ? '#ffb040' : '#ffe890', x, y, k < 8 ? 2 : 1, k < 8 ? 2 : 1)); px(g, '#ffffff', d.x0 - 1, d.y0 - 1, 3, 3); }
      else px(g, '#ff8a2a', d.x - 1, d.y - 1, 3, 3); }
    else if (ct.ammo[ct.wsel] && !ct.shots.some(s => !s.stuck) && ct.kb) {
      const a = ct.aim; px(g, '#ffffff', a.x - 3, a.y, 2, 1); px(g, '#ffffff', a.x + 2, a.y, 2, 1); px(g, '#ffffff', a.x, a.y - 3, 1, 2); px(g, '#ffffff', a.x, a.y + 2, 1, 2);
      if (!hole) { const [vx, vy] = ctKeyVel(Math.max(0, ct.charge)); ctPath(a.x, a.y, vx, vy).forEach(([x, y], k) => px(g, ct.charge >= 0 ? (k % 2 ? '#ffb040' : '#ffe890') : k % 2 ? '#8a7aa8' : '#c8c0e0', x, y, k < 8 ? 2 : 1, k < 8 ? 2 : 1)); }
    }
  }
  g.restore();
  if (ct.flash > 0) { g.fillStyle = 'rgba(255,240,200,' + (ct.flash * .5).toFixed(2) + ')'; g.fillRect(0, 0, W, H); }
  if (ct.slow > 0) { const b = Math.round(10 * Math.min(1, ct.slow / 30, (CT.SLOW - ct.slow) / 12)); px(g, '#000000', 0, TOP, W, b); px(g, '#000000', 0, H - b, W, b); }  // le ralenti : deux bandes noires, comme au cinéma
  // en haut : le nom, la jauge de destruction avec les marques des étoiles ; en bas : les armes
  px(g, '#140e20', 0, 0, W, TOP); px(g, '#2a2038', 0, TOP - 1, W, 1);
  pxFont(g, (ct.li + 1) + '. ' + ct.L.name.toUpperCase(), 3, 10, '#ffd84a', 8);
  const p = ctPct(), gx = 92, gw = 110;
  px(g, '#05010b', gx - 1, 3, gw + 2, 8); px(g, '#2a2038', gx, 4, gw, 6); px(g, p >= ct.L.goals[0] ? '#ff8a2a' : '#c04a3a', gx, 4, Math.round(gw * p / 100), 6); px(g, '#ffd0a0', gx, 4, Math.round(gw * p / 100), 1);
  if (!ct.sand) ct.L.goals.forEach((v, k) => { const x = gx + Math.round(gw * v / 100); px(g, p >= v ? '#ffd84a' : '#ffffff', x, 2, 1, 10); });
  pxFont(g, p + ' %', W - 3, 10, '#ffffff', 8, 'right');
  if (ct.cities.length) pxFont(g, 'villes ' + (ct.cities.length - ct.cityLost) + '/' + ct.cities.length, W - 3, TOP + 9, ct.cityLost === ct.cities.length ? '#ff8a6a' : '#ffe080', 6, 'right');
  CT_WK.forEach((w, k) => { if (!ctHas(w)) return; const x = 3 + CT_WK.filter(ctHas).indexOf(w) * 30, y = H - 13, on = ct.wsel === w, n = ct.ammo[w];
    px(g, on ? '#ffd84a' : '#2a2038', x, y, 28, 12); px(g, n ? (on ? '#3a2a18' : '#140e20') : '#0a0810', x + 1, y + 1, 26, 10);
    sprite(g, CT_ICON[w], x + 3, y + 3, n ? CT_IPAL : CT_IDIM);
    pxFont(g, n === Infinity ? '∞' : '×' + n, x + 25, y + 10, n ? '#ffffff' : '#5a5068', 7, 'right'); });
  if (ct.msg) pxFont(g, ct.msg.txt, W / 2, H - 18, '#ffffff', 7, 'center');
  if (ct.mode === 'ready') {
    gameText(g, W, [[(ct.li + 1) + '. ' + ct.L.name.toUpperCase(), '#ffd84a', 12], ct.sand ? ['BAC À SABLE : toutes les armes à volonté', '#ffffff'] : [CT_WK.filter(w => ct.L.w[w]).map(w => ct.L.w[w] + ' ' + CT_W[w].toLowerCase() + (ct.L.w[w] > 1 && w !== 'virus' ? 's' : '')).join(' · ').replace('trou noirs', 'trous noirs'), '#ffffff'],
      ct.sand ? ['Ni étoiles ni record', '#ffd84a'] : ['Étoiles : ' + ct.L.goals.join(' · ') + ' % détruits', '#ffd84a'], ['Glisse depuis l\'espace pour lancer', '#b8d0ff'], ['← → : planète · Espace : commencer', '#b8b0c8']], 44);
  }
  if (ct.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['Entrée : reprendre', '#b8b0c8']], 70);
  if (ct.mode === 'over' && ct.dead > 20) {
    gameText(g, W, [[ct.pulver ? 'PLANÈTE PULVÉRISÉE !' : ct.stars ? 'PLANÈTE DÉTRUITE !' : 'ELLE RÉSISTE ENCORE...', ct.stars ? '#ffd84a' : '#ff8a6a', 12], [p + ' % détruits' + (ct.record ? ' · RECORD !' : ''), '#ffffff'], ['', ''],
      [ct.stars || ct.sand ? '' : 'Il faut ' + ct.L.goals[0] + ' % pour la première étoile', '#b8d0ff'], [ct.dead > 50 ? 'Espace : rejouer · ← → : planète' : '', '#b8b0c8']], 50);
    if (!ct.sand) ctStars(g, ct.stars, W / 2 - 25, 71);
  }
  if (ct.tick % 15 === 0) g.canvas.setAttribute('aria-label', 'Cataclysme, planète ' + ct.L.name + ' : ' + {ready: 'prête', play: 'en jeu', pause: 'pause', over: 'fini'}[ct.mode] + ', ' + p + ' % détruits, arme ' + CT_W[ct.wsel] +
    ', reste ' + CT_WK.filter(ctHas).map(w => (ct.ammo[w] === Infinity ? 'à volonté' : ct.ammo[w]) + ' ' + CT_W[w]).join(', ') + (ct.sand ? ', bac à sable' : '') + ', ' + ct.parts.length + ' débris' + (ct.mode === 'over' ? ', ' + ct.stars + ' étoiles' : '') + '.');
}
function ctInfo() {
  setTimeout(ctTrophies);
  const li = ct ? ct.li : cts.level, L = CT_LEVELS[li];
  $('ctStats').replaceChildren(...[['Planète', (li + 1) + '. ' + L.name], ['Record', cts.best[li] != null ? cts.best[li] + ' %' : '--'], ['Étoiles', (cts.stars[li] || 0) + ' / 3'], ['Pour 3 étoiles', L.goals[2] + ' %'],
    ['Planètes détruites', cts.wins], ['Villes éteintes', cts.cities || 0], ['Étoiles en tout', Object.values(cts.stars).reduce((a, b) => a + b, 0) + ' / ' + CT_LEVELS.length * 3]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
}
const CT_KEYS = {ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R', a: 'A', A: 'A', q: 'A', Q: 'A', e: 'E', E: 'E'};
function ctPick(dir) { let li = ct.li; do li = (li + dir + CT_LEVELS.length) % CT_LEVELS.length; while (!ctUnlocked(li)); cts.level = li; saveGames(); ctNew(li); }
function ctStart() { if (ct.mode === 'over') ctNew(ct.li); ct.mode = 'play'; }
function ctWeapon(w) { if (!ctHas(w)) return; if (!ct.ammo[w]) { ctSay('Plus de ' + CT_W[w].toLowerCase() + ' !'); return; } ct.wsel = w; ctSound('pick'); }
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !ct || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key;
  if (ct.mode === 'over' || ct.mode === 'ready') {
    const ok = ct.mode === 'ready' || ct.dead > 50;
    if ((k === 'ArrowLeft' || k === 'ArrowRight') && ok) { e.preventDefault(); ctPick(k === 'ArrowLeft' ? -1 : 1); return; }
    if ((k === ' ' || k === 'Enter') && ok) { e.preventDefault(); ctStart(); }
    return;
  }
  if (k === 'p' || k === 'P' || k === 'Escape') { ctPause(ct.mode === 'play'); return; }
  if (k === 'Enter' && ct.mode === 'pause') { ctPause(false); return; }
  if (ct.mode !== 'play') return;
  const live = CT_WK.filter(ctHas);
  if (/^[1-7]$/.test(k) && live[k - 1]) { ctWeapon(live[k - 1]); return; }
  if (k === 'Tab') { e.preventDefault(); ctNextWeapon(); return; }
  if (k === ' ') { e.preventDefault(); if (!e.repeat) ctChargeDown(); return; }
  if (CT_KEYS[k]) { e.preventDefault(); ct.kb = true; ct.keys.add(CT_KEYS[k]); }
});
document.addEventListener('keyup', e => {
  if (!ct) return; if (CT_KEYS[e.key]) ct.keys.delete(CT_KEYS[e.key]);
  if (e.key === ' ') ctChargeUp();
});
function ctPause(on) { ct.mode = on ? 'pause' : 'play'; ct.user = on; }  // une pause voulue reste ; celle du changement d'onglet se lève au retour
function ctNextWeapon() { const live = CT_WK.filter(ctHas), i = live.indexOf(ct.wsel); for (let j = 1; j <= live.length; j++) if (ct.ammo[live[(i + j) % live.length]]) { ctWeapon(live[(i + j) % live.length]); break; } }
function ctChargeDown() { ct.kb = true; if (ct.wsel === 'hole') ctFire(ct.aim.x, ct.aim.y, 0, 0) || ctSay('Pas ici'); else ct.charge = 0; }
function ctChargeUp() { if (ct.charge < 0) return; const [vx, vy] = ctKeyVel(ct.charge); ct.charge = -1; ctFire(ct.aim.x, ct.aim.y, vx, vy) || ctSay('Le viseur est dans la planète'); }
// la manette : stick gauche ou croix pour le viseur, stick droit ou LB / RB pour l'angle, A maintenu pour la puissance (relâché : tir), X pour l'arme suivante, Start pour la pause ;
// avant la partie et à la fin : gauche / droite pour la planète, A ou Start pour commencer
{ let prev = [];
  const loop = () => { requestAnimationFrame(loop); if (!view.classList.contains('on') || !ct) return;
    const p = [...(navigator.getGamepads?.() || [])].find(Boolean); if (!p) return;
    const b = i => !!p.buttons[i]?.pressed, [lx = 0, ly = 0, rx = 0] = p.axes;
    const now = [b(14) || lx < -.4, b(15) || lx > .4, b(12) || ly < -.4, b(13) || ly > .4, b(4) || rx < -.4, b(5) || rx > .4, b(0), b(2), b(9)], hit = i => now[i] && !prev[i];
    ct.pad ??= new Set(); ct.pad.clear();
    if (ct.mode === 'ready' || (ct.mode === 'over' && ct.dead > 50)) { if (hit(0) || hit(1)) ctPick(hit(0) ? -1 : 1); else if (hit(6) || hit(8)) ctStart(); }
    else if (ct.mode === 'pause') { if (hit(8) || hit(6)) ctPause(false); }
    else if (ct.mode === 'play') {
      ['L', 'R', 'U', 'D', 'A', 'E'].forEach((c, i) => { if (now[i]) ct.pad.add(c); }); if (now.slice(0, 6).some(Boolean)) ct.kb = true;
      if (hit(6)) ctChargeDown(); if (prev[6] && !now[6]) ctChargeUp(); if (hit(7)) ctNextWeapon(); if (hit(8)) ctPause(true);
    }
    prev = now; };
  requestAnimationFrame(loop); }
$('ctFs').onclick = () => { $('ctFs').blur(); if (document.fullscreenElement) document.exitFullscreen(); else $('ctCanvas').parentElement.requestFullscreen?.().catch(() => {}); };
$('ctSand').onclick = () => { ctSandOn = !ctSandOn; $('ctSand').textContent = 'BAC À SABLE : ' + (ctSandOn ? 'OUI' : 'NON'); $('ctSand').setAttribute('aria-pressed', String(ctSandOn)); $('ctSand').blur(); ctNew(ctUnlocked(ct?.li ?? 0) ? ct?.li ?? 0 : 0); };
{ const cv = $('ctCanvas'), at = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * CT.W, (e.clientY - r.top) / r.height * CT.H]; };
  // à la souris ou au doigt : on appuie dans l'espace, on tire en arrière comme un lance-pierre, on lâche ; un simple clic vise le centre
  cv.onpointerdown = e => {
    e.preventDefault(); if (!ct) return;
    if (ct.mode === 'ready' || (ct.mode === 'over' && ct.dead > 50)) return ctStart();
    if (ct.mode !== 'play') return;
    const [x, y] = at(e), live = CT_WK.filter(ctHas);
    if (y > CT.H - 14 && x < 3 + live.length * 30) return ctWeapon(live[Math.floor((x - 3) / 30)] || ct.wsel);
    ct.kb = false; ct.drag = {x0: x, y0: y, x, y}; try { cv.setPointerCapture(e.pointerId); } catch {}
  };
  cv.onpointermove = e => { if (ct?.drag) [ct.drag.x, ct.drag.y] = at(e); };
  cv.onpointerup = () => {
    const d = ct?.drag; if (!d) return; ct.drag = null;
    if (ct.wsel === 'hole') { ctFire(d.x, d.y, 0, 0); return; }
    let [vx, vy] = ctDragVel(d);
    if (Math.hypot(vx, vy) < .4) { const dx = CT.CX - d.x0, dy = CT.CY - d.y0, l = Math.hypot(dx, dy) || 1; vx = dx / l * CT.VMAX * .7; vy = dy / l * CT.VMAX * .7; }
    ctFire(d.x0, d.y0, vx, vy) || ctSay('Lance depuis l\'espace, pas depuis la planète');
  }; }
$('ctNew').onclick = () => { ctNew(ct?.li ?? cts.level); $('ctNew').blur(); };
// le joueur automatique de la vérification : chaque arme à pleine vitesse vers le centre, depuis des angles au hasard
function ctBot(li, seed = 1) {
  ctNew(li); ct.mode = 'play'; const r = seeded(seed); let wait = 0;
  for (let t = 0; t < 20000 && ct.mode === 'play'; t++) {
    if (!ct.shots.length && !ct.holes.length && ++wait > 70 && CT_WK.some(k => ct.ammo[k])) {
      wait = 0; ct.wsel = ['moon', 'bomb', 'laser', 'virus', 'com', 'hole', 'ast'].find(k => ct.ammo[k]);
      const a = r() * 6.283, d = ct.L.r + 9, x = Math.max(4, Math.min(CT.W - 4, CT.CX + Math.cos(a) * d)), y = Math.max(CT.TOP + 4, Math.min(CT.H - 4, CT.CY + Math.sin(a) * d));
      if (ct.wsel === 'hole') ctFire(CT.CX + Math.cos(a) * ct.L.r * .4, CT.CY + Math.sin(a) * ct.L.r * .4, 0, 0);
      else { const dx = CT.CX - x, dy = CT.CY - y, l = Math.hypot(dx, dy); ctFire(x, y, dx / l * CT.VMAX, dy / l * CT.VMAX); }
    }
    ctUpdate(); ct.tick++;
  }
  return ctPct();
}
let ctCheckResult = 'pas encore';
setTimeout(() => {  // vérification, 2 s après le chargement pour ne pas retarder l'ouverture : chaque planète est bien construite, un astéroïde creuse, les débris lents se recollent, la bombe attend puis explose,
   // le trou noir avale, la comète creuse plus loin qu'un astéroïde (le joueur automatique, lui, est essayé par le simulateur)
  const bad = [], keep = ct, keepS = JSON.stringify(cts); ct = null;
  ctMute = true;
  for (let li = 0; li < CT_LEVELS.length; li++) { ctNew(li); const L = CT_LEVELS[li];
    if (ct.n0 < Math.PI * L.r * L.r * .95 || ct.n0 > Math.PI * (L.r + 1) ** 2) bad.push(L.name + ' : ' + ct.n0 + ' pixels');
    if (!ct.grid[ctIdx(CT.CX, CT.CY)] || CT_MAT[ct.grid[ctIdx(CT.CX, CT.CY)]].n !== 'noyau') bad.push(L.name + ' : pas de noyau');
    if (L.goals.some((g, k) => k && g <= L.goals[k - 1])) bad.push(L.name + ' : étoiles'); }
  ctNew(0); ct.mode = 'play';
  ctFire(CT.CX - 60, CT.CY, CT.VMAX, 0); for (let i = 0; i < 40; i++) ctUpdate();
  const hole1 = CT.CX - ct.L.r; if (ct.grid[ctIdx(hole1 + 1, CT.CY)] || ct.alive >= ct.n0) bad.push('l\'astéroïde ne creuse pas');
  ct.parts = [{x: CT.CX + .5, y: CT.CY - ct.L.r - 3.5, vx: 0, vy: .3, m: 1, col: 0xffffffff, hot: 0, life: 0}]; const a0 = ct.alive;
  for (let i = 0; i < 40; i++) ctUpdate(); if (ct.alive !== a0 + 1 || ct.parts.length) bad.push('le débris lent ne se recolle pas');
  ctNew(2); ct.mode = 'play'; ct.wsel = 'bomb'; ctFire(CT.CX, CT.CY - 60, 0, CT.VMAX); for (let i = 0; i < 30; i++) ctUpdate();
  const b = ct.shots[0]; if (!b?.stuck) bad.push('la bombe ne se pose pas'); const a1 = ct.alive; for (let i = 0; i < 90; i++) ctUpdate(); if (ct.shots.length || a1 - ct.alive < 200) bad.push('la bombe n\'explose pas');
  ctNew(4); ct.mode = 'play'; ct.wsel = 'hole'; const a2 = ct.alive; ctFire(CT.CX, CT.CY - 20, 0, 0); for (let i = 0; i < 270; i++) ctUpdate(); if (ct.holes.length || a2 - ct.alive < 300) bad.push('le trou noir n\'avale pas');
  const dig = w => { ctNew(1); ct.mode = 'play'; ct.wsel = w; ctFire(CT.CX - 70, CT.CY, CT.VMAX / (w === 'com' ? 1.35 : 1), 0); let far = 0; for (let i = 0; i < 120; i++) { ctUpdate(); for (let x = CT.CX - ct.L.r; x < CT.CX + ct.L.r; x++) if (!ct.grid[ctIdx(x, CT.CY)]) far = Math.max(far, x); } return far; };
  if (dig('com') <= dig('ast')) bad.push('la comète ne creuse pas plus loin');
  ctNew(7); if (ct.cities.length !== 6) bad.push('Gaïa : ' + ct.cities.length + ' villes');
  ctNew(8); ct.mode = 'play'; ct.wsel = 'laser'; const a3 = ct.alive; ctFire(CT.CX - 70, CT.CY, 1, 0); for (let i = 0; i < 80; i++) ctUpdate();  // le laser : une ligne droite vers le cœur
  if (ct.beams.length || a3 - ct.alive < 60 || ct.grid[ctIdx(CT.CX - ct.L.r + 12, CT.CY)]) bad.push('le laser ne creuse pas : ' + (a3 - ct.alive));
  if (ct.cities.length !== 9) bad.push('Métropole : ' + ct.cities.length + ' villes');
  const cv0 = ct.cities[0]; for (const i of cv0.cells) if (ct.grid[i]) { ct.grid[i] = 0; ct.alive--; } ct.tick = 0; ctUpdate(); if (!cv0.lost || ct.cityLost < 1) bad.push('la ville ne s\'éteint pas');
  ctNew(8); ct.mode = 'play'; ct.wsel = 'virus'; const a4 = ct.alive; ctFire(CT.CX - 70, CT.CY, CT.VMAX, 0); for (let i = 0; i < 400; i++) ctUpdate();
  if (ct.vir.length || a4 - ct.alive < 500 || ct.inf.some(Boolean) || !ct.grid[ctIdx(CT.CX, CT.CY)]) bad.push('le virus ne ronge pas : ' + (a4 - ct.alive));
  const mo = w => { ctNew(9); ct.mode = 'play'; ct.wsel = w; const a = ct.alive; ctFire(CT.CX - 75, CT.CY, CT.VMAX / (w === 'moon' ? .85 : 1), 0); for (let i = 0; i < 60; i++) ctUpdate(); return a - ct.alive; };
  if (mo('moon') < mo('ast') * 2) bad.push('la lune ne frappe pas plus fort');
  ctNew(9); const wy = CT.CY - ct.L.r + 1, wx = CT.CX; for (let y = wy - 1; y <= wy + 1; y++) for (let x = wx - 8; x <= wx + 8; x++) if (ct.grid[ctIdx(x, y)]) ct.grid[ctIdx(x, y)] = 8;
  for (let y = wy + 2; y < wy + 9; y++) for (let x = wx - 3; x <= wx + 3; x++) { const i = ctIdx(x, y); if (ct.grid[i]) { ct.grid[i] = 0; ct.alive--; } }  // un trou sous l'eau : l'eau descend dedans
  const wet = () => { let n = 0; for (let y = wy + 2; y < wy + 9; y++) for (let x = wx - 3; x <= wx + 3; x++) if (ct.grid[ctIdx(x, y)] === 8) n++; return n; }, w0 = wet(), aw = ct.alive; for (let i = 0; i < 300; i++) ctFlow();
  if (wet() <= w0 || ct.alive !== aw) bad.push('l\'eau ne coule pas (' + w0 + ' → ' + wet() + ')');
  ctSandOn = true; ctNew(0); ct.mode = 'play'; for (let i = 0; i < 8; i++) { ct.wsel = CT_WK[i % 4]; ctFire(CT.CX - 70, CT.CY, CT.VMAX, 0); } if (ct.ammo.ast !== Infinity || ct.holes.length + ct.shots.length < 8) bad.push('bac à sable : armes à volonté');
  ct.alive = Math.floor(ct.n0 * .05); ct.shots = []; ct.holes = []; let steps = 0; ctUpdate(); if (!ct.slow) bad.push('pas de ralenti'); for (let i = 0; i < 40; i++) { const before = ct.parts.length ? ct.parts[0].x : 0; ctUpdate(); if (ct.parts.length && ct.parts[0].x !== before) steps++; }
  if (steps > 20) bad.push('le ralenti ne ralentit pas (' + steps + ' / 40)'); for (let i = 0; i < 600 && ct.mode === 'play'; i++) ctUpdate(); if (ct.mode !== 'over' || cts.best[0] !== JSON.parse(keepS).best[0]) bad.push('le bac à sable compte un record'); ctSandOn = false;
  console.assert(!bad.length, 'cataclysme', bad); ctCheckResult = bad.length ? bad.join(', ') : 'ok';
  Object.assign(cts, JSON.parse(keepS)); for (const k of Object.keys(cts)) if (!(k in JSON.parse(keepS))) delete cts[k];
  ct = keep; ctMute = false; if (ct) ctInfo();
}, 2000);
function ctOpen() {
  if (!ct || !ct.g) { ctNew(ctUnlocked(cts.level) ? cts.level : 0); ct.g = $('ctCanvas').getContext('2d'); }
  if (ct.mode === 'pause' && !ct.user) ct.mode = 'play';  // retour sur l'onglet : la partie reprend toute seule, sauf pause demandée
  gameLoop(ct, 'cataclysme', ctUpdate, ctDraw); ctInfo();
}
$('ctCanvas').__ct = {st: () => ct, open: ctOpen, check: () => ctCheckResult, CT, bot: ctBot, go: li => { ctNew(li); ct.mode = 'play'; }};  // pour l'auto-test
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function ctTrophies() {
  const s = CT_LEVELS.map((_, i) => cts.stars[i] || 0), n = s.reduce((a, x) => a + x, 0), won = s.filter(x => x > 0).length, top = Math.max(-1, ...Object.values(cts.best));
  const sig = [cts.games, n, top].join(); if (sig === ctTrophies.sig) return; ctTrophies.sig = sig;
  trophyRecord('etoiles', n || null); trophyRecord('destruction', top >= 0 ? top : null);
  if (won >= 1) trophy('premier'); if (won >= 5) trophy('p5'); if (won >= CT_LEVELS.length) trophy('toutes');
  if (s.some(x => x >= 3)) trophy('etoiles3'); if (s.every(x => x >= 3)) trophy('etoiles'); if (top >= 90) trophy('p90'); if (cts.games >= 20) trophy('vingt');
}
ctx.onOpen(ctOpen);
}
