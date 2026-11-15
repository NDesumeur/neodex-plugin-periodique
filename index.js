// Périodique : le tableau des 118 éléments en pixel art. Survole ou choisis un élément pour sa fiche, filtre par famille, cherche, et joue au quiz « où est… ? ».
// Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Périodique</span><span class="hint">Clic ou flèches : un élément · une famille dans la légende pour l'isoler · Q : quiz</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="peCanvas" width="258" height="190" role="img" aria-label="Tableau périodique"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>FICHE</b><div class="gStats" id="peCard"></div></div>
      <div class="row"><input class="f" id="peFind" placeholder="Chercher : fer, Au, 79…" spellcheck="false"><button class="btn main" id="peQuiz">QUIZ</button></div>
      <div class="sysCard"><b>QUIZ</b><div class="gStats" id="peStats"></div></div>
      <div class="hint">Le quiz te donne un nom d'élément : clique sa case dans le tableau. Dix questions par partie, et ta meilleure série est gardée.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto}
.gameBox canvas{height:min(74vh,600px);width:auto;aspect-ratio:258/190;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:260px;max-width:400px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:auto 1fr;gap:4px 14px}
.gStats b{text-align:right}`;
// symbole, nom, masse atomique, famille, état à 20 °C (s solide, l liquide, g gaz, u inconnu)
const PE_DATA = `H Hydrogène 1.008 nm g|He Hélium 4.0026 gn g|Li Lithium 6.94 am s|Be Béryllium 9.0122 at s|B Bore 10.81 md s|C Carbone 12.011 nm s|N Azote 14.007 nm g|O Oxygène 15.999 nm g|F Fluor 18.998 ha g|Ne Néon 20.180 gn g
Na Sodium 22.990 am s|Mg Magnésium 24.305 at s|Al Aluminium 26.982 pm s|Si Silicium 28.085 md s|P Phosphore 30.974 nm s|S Soufre 32.06 nm s|Cl Chlore 35.45 ha g|Ar Argon 39.948 gn g
K Potassium 39.098 am s|Ca Calcium 40.078 at s|Sc Scandium 44.956 mt s|Ti Titane 47.867 mt s|V Vanadium 50.942 mt s|Cr Chrome 51.996 mt s|Mn Manganèse 54.938 mt s|Fe Fer 55.845 mt s|Co Cobalt 58.933 mt s|Ni Nickel 58.693 mt s|Cu Cuivre 63.546 mt s|Zn Zinc 65.38 mt s|Ga Gallium 69.723 pm s|Ge Germanium 72.630 md s|As Arsenic 74.922 md s|Se Sélénium 78.971 nm s|Br Brome 79.904 ha l|Kr Krypton 83.798 gn g
Rb Rubidium 85.468 am s|Sr Strontium 87.62 at s|Y Yttrium 88.906 mt s|Zr Zirconium 91.224 mt s|Nb Niobium 92.906 mt s|Mo Molybdène 95.95 mt s|Tc Technétium 98 mt s|Ru Ruthénium 101.07 mt s|Rh Rhodium 102.91 mt s|Pd Palladium 106.42 mt s|Ag Argent 107.87 mt s|Cd Cadmium 112.41 mt s|In Indium 114.82 pm s|Sn Étain 118.71 pm s|Sb Antimoine 121.76 md s|Te Tellure 127.60 md s|I Iode 126.90 ha s|Xe Xénon 131.29 gn g
Cs Césium 132.91 am s|Ba Baryum 137.33 at s|La Lanthane 138.91 la s|Ce Cérium 140.12 la s|Pr Praséodyme 140.91 la s|Nd Néodyme 144.24 la s|Pm Prométhium 145 la s|Sm Samarium 150.36 la s|Eu Europium 151.96 la s|Gd Gadolinium 157.25 la s|Tb Terbium 158.93 la s|Dy Dysprosium 162.50 la s|Ho Holmium 164.93 la s|Er Erbium 167.26 la s|Tm Thulium 168.93 la s|Yb Ytterbium 173.05 la s|Lu Lutécium 174.97 la s
Hf Hafnium 178.49 mt s|Ta Tantale 180.95 mt s|W Tungstène 183.84 mt s|Re Rhénium 186.21 mt s|Os Osmium 190.23 mt s|Ir Iridium 192.22 mt s|Pt Platine 195.08 mt s|Au Or 196.97 mt s|Hg Mercure 200.59 mt l|Tl Thallium 204.38 pm s|Pb Plomb 207.2 pm s|Bi Bismuth 208.98 pm s|Po Polonium 209 pm s|At Astate 210 ha s|Rn Radon 222 gn g
Fr Francium 223 am s|Ra Radium 226 at s|Ac Actinium 227 ac s|Th Thorium 232.04 ac s|Pa Protactinium 231.04 ac s|U Uranium 238.03 ac s|Np Neptunium 237 ac s|Pu Plutonium 244 ac s|Am Américium 243 ac s|Cm Curium 247 ac s|Bk Berkélium 247 ac s|Cf Californium 251 ac s|Es Einsteinium 252 ac s|Fm Fermium 257 ac s|Md Mendélévium 258 ac s|No Nobélium 259 ac s|Lr Lawrencium 266 ac s
Rf Rutherfordium 267 mt u|Db Dubnium 268 mt u|Sg Seaborgium 269 mt u|Bh Bohrium 270 mt u|Hs Hassium 277 mt u|Mt Meitnérium 278 mt u|Ds Darmstadtium 281 mt u|Rg Roentgenium 282 mt u|Cn Copernicium 285 mt u|Nh Nihonium 286 pm u|Fl Flérovium 289 pm u|Mc Moscovium 290 pm u|Lv Livermorium 293 pm u|Ts Tennesse 294 ha u|Og Oganesson 294 gn u`;
// famille : nom, couleur, nom court pour la légende du tableau
const PE_FAM = { am: ['Métaux alcalins', '#ff7a6a', 'Alcalins'], at: ['Alcalino-terreux', '#ffb05a', 'Alc.-terr.'], mt: ['Métaux de transition', '#e8c868', 'Transition'], pm: ['Métaux pauvres', '#9ad08a', 'Pauvres'], md: ['Métalloïdes', '#6ac8a8', 'Métalloïd.'],
  nm: ['Non-métaux', '#6ab0f0', 'Non-métal'], ha: ['Halogènes', '#8a9af8', 'Halogènes'], gn: ['Gaz nobles', '#c08af8', 'Gaz nobles'], la: ['Lanthanides', '#f88ac8', 'Lanthan.'], ac: ['Actinides', '#e86a9a', 'Actinides'] };
const PE_STATE = { s: 'solide', l: 'liquide', g: 'gazeux', u: 'inconnu (éphémère)' };
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
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
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
  const host = ctx.host, { el, toast } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
  const sprite = (g, rows, x, y, pal) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } });
  const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };
  const gameText = (g, w, lines, y0) => {  // lignes centrées en police pixel, sur une bande sombre
    g.fillStyle = 'rgba(11,3,28,.78)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
    lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
  };
  const theme = (acc, accL, accS, accD, acc2, base = ['#0c0a12', '#16121e', '#221c2c', '#2e263a', '#3a3046', '#62566e']) => {
    const [k, k2, fill, fillOn, hl, line] = base;
    return { k, k2, fill, fillOn, hl, line, acc, accL, accS, accD, rivet: '#f0f0f8', btn: hl, btnHi: line, btnLo: k2, btnHov: '#443852', btnHovHi: '#82768e', text: '#f4f0f8', muted: '#c0b8cc',
      acc2, gold: '#ffd84a', orange: '#ff8a3a', red: '#ff4a3a', green: '#7ee07a', green2: '#2f8a3a', bg: '#100c16', bgDot: fill, bgDot2: k2, spark: accD, spark2: acc,
      tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................', '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] };
  };
  let ac = null, mute = false;
  const beep = (f, d, type = 'square', slide = 0, vol = .03, at = 0) => { if (mute) return; try { ac ??= new AudioContext(); const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + at; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d); } catch {} };
  const on = () => view.classList.contains('on');
  // la manette : croix et stick gauche = flèches, A = Entrée, B = Échap, X = Retour arrière, Y = H, Start = P ; envoyées comme des touches du clavier
  const padKeys = (map = {}) => {
    const KEY = { 12: 'ArrowUp', 13: 'ArrowDown', 14: 'ArrowLeft', 15: 'ArrowRight', 0: 'Enter', 1: 'Escape', 2: 'Backspace', 3: 'h', 9: 'p', ...map };
    const held = new Map(), send = (k, type) => document.dispatchEvent(new KeyboardEvent(type, { key: k, bubbles: true }));
    const loop = () => {
      requestAnimationFrame(loop);
      if (!on() || !navigator.getGamepads) return;
      const p = [...navigator.getGamepads()].find(Boolean); if (!p) return;
      const now = performance.now(), down = new Set();
      for (const [i, k] of Object.entries(KEY)) if (p.buttons[i]?.pressed) down.add(k);
      const [ax = 0, ay = 0] = p.axes;
      if (ax < -.5) down.add('ArrowLeft'); if (ax > .5) down.add('ArrowRight'); if (ay < -.5) down.add('ArrowUp'); if (ay > .5) down.add('ArrowDown');
      for (const k of down) { const t = held.get(k); if (t === undefined) { held.set(k, now + 260); send(k, 'keydown'); } else if (/^Arrow/.test(k) && now > t) { held.set(k, now + 110); send(k, 'keydown'); } }
      for (const k of [...held.keys()]) if (!down.has(k)) { held.delete(k); send(k, 'keyup'); }
    };
    requestAnimationFrame(loop);
  };
  pxSkin(view.querySelector('.appWrap'), { title: 'PÉRIODIQUE', T: theme('#6ab0f0', '#d8ecff', '#3a78b8', '#0a1828', '#ffd84a'),
    emblem: ['............', 'kkkkkkkkkkk.', 'kbbbbbbbbbk.', 'kbwwbbbbbbk.', 'kbwbbbbbbbk.', 'kbwwbwwbbbk.', 'kbbbbwbbbbk.', 'kbbbbwwbbbk.', 'kbbbbbbbbbk.', 'kkkkkkkkkkk.', '............', '............'],
    icons: [[/^QUIZ/, 'star'], [/^FICHE/, 'folder']] });
  const EL = PE_DATA.split(/[|\n]/).map((s, i) => { const [sym, name, mass, fam, state] = s.trim().split(' '); return { z: i + 1, sym, name, mass: +mass, fam, state }; });
  // la place de chaque élément : ligne et colonne (les lanthanides et actinides sur deux lignes à part, en bas)
  for (const e of EL) { const z = e.z; let r, c;
    if (z <= 2) { r = 0; c = z === 1 ? 0 : 17; }
    else if (z <= 18) { r = z <= 10 ? 1 : 2; const k = z - (r === 1 ? 3 : 11); c = k < 2 ? k : k + 10; }
    else if (z <= 54) { r = z <= 36 ? 3 : 4; c = z - (r === 3 ? 19 : 37); }
    else { r = z <= 86 ? 5 : 6; const k = z - (r === 5 ? 55 : 87); if (k < 2) c = k; else if (k <= 16) { r += 3; c = k; } else c = k - 14; }
    e.r = r; e.c = c; e.period = z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : z <= 36 ? 4 : z <= 54 ? 5 : z <= 86 ? 6 : 7; e.group = r >= 8 ? null : c + 1; }
  const W = 258, H = 190, CW = 14, CH = 15, X0 = 3, Y0 = 4, YF = Y0 + 7 * CH + 6;
  const at = e => [X0 + e.c * CW, e.r >= 8 ? YF + (e.r - 8) * CH : Y0 + e.r * CH];
  const save = { best: 0, games: 0, right: 0, last: 26, ...(await doc('quiz')) };
  const keep = () => folder.write('quiz', save).catch(() => {});
  let sel = EL.find(e => e.z === save.last) || EL[25], hover = null, only = null, find = '', quiz = null, g = null, tick = 0;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const match = e => !find || e.z === +find || norm(e.sym) === norm(find) || norm(e.name).startsWith(norm(find));
  const legend = () => Object.keys(PE_FAM).map((k, i) => [k, [4, 67, 128, 196][i % 4], YF + 2 * CH + 4 + Math.floor(i / 4) * 9]);  // une bande sous les lanthanides et actinides, 4 familles par ligne
  function card(e) {
    const rows = [['Numéro', e.z], ['Symbole', e.sym], ['Nom', e.name], ['Masse', e.mass.toLocaleString('fr-FR') + ' u'], ['Famille', PE_FAM[e.fam][0]], ['État à 20 °C', PE_STATE[e.state]],
      ['Période', e.period], ['Groupe', e.group ?? (e.fam === 'la' ? 'lanthanides' : 'actinides')], ['Radioactif', e.z === 43 || e.z === 61 || e.z >= 84 ? 'oui' : 'non']];
    $('peCard').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
  }
  function stats() { $('peStats').replaceChildren(...[['Meilleure série', save.best + ' / 10'], ['Parties', save.games], ['Bonnes réponses', save.right]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))])); }
  const choose = e => { if (!e) return; sel = e; card(e); if (save.last !== e.z) { save.last = e.z; keep(); } };
  // le quiz : 10 éléments à retrouver ; d'abord les plus connus (Z ≤ 56), puis tous
  function newQuiz() { const pool = EL.filter(e => e.z <= 56 || Math.random() < .3).sort(() => Math.random() - .5).slice(0, 10); quiz = { pool, i: 0, ok: 0, fx: null }; only = null; find = ''; $('peFind').value = ''; }
  function answer(e) {
    const want = quiz.pool[quiz.i], good = e === want; quiz.fx = { e, want, good, t: 50 };
    if (good) { quiz.ok++; save.right++; beep(880, .08); beep(1320, .1, 'square', 0, .03, .08); } else beep(180, .25, 'sawtooth', 90);
    choose(want);
    if (++quiz.i >= quiz.pool.length) { save.games++; if (quiz.ok > save.best) save.best = quiz.ok; keep(); stats(); quiz.done = 140; }
  }
  function draw() {
    g.imageSmoothingEnabled = false; tick++;
    px(g, '#0c1422', 0, 0, W, H);
    for (const e of EL) { const [x, y] = at(e), col = PE_FAM[e.fam][1], dim = (only && e.fam !== only) || !match(e), hide = quiz && !quiz.done;
      px(g, '#05080e', x, y, CW - 1, CH - 1); px(g, dim ? '#1a2434' : col, x + 1, y + 1, CW - 3, CH - 3);
      if (!dim) px(g, 'rgba(255,255,255,.35)', x + 1, y + 1, CW - 3, 1);
      if (!hide) PXK.fill(g, e.sym, x + 6.5, y + 11, dim ? '#3a4a5e' : '#0c1422', 1, 'center'); }
    for (const z of [57, 89]) { const e = EL[z - 1], y = Y0 + (e.r - 3) * CH; px(g, '#05080e', X0 + 2 * CW, y, CW - 1, CH - 1); px(g, PE_FAM[e.fam][1], X0 + 2 * CW + 1, y + 1, CW - 3, CH - 3); PXK.fill(g, '*', X0 + 2 * CW + 6.5, y + 11, '#0c1422', 1, 'center'); }
    for (const [k, x, y] of legend()) { px(g, PE_FAM[k][1], x, y + 1, 5, 5); if (only === k) px(g, '#ffffff', x - 1, y + 7, 7, 1); PXK.fill(g, PE_FAM[k][2], x + 7, y + 7, only && only !== k ? '#3a4a5e' : '#c8d8e8', 1); }
    const mark = (e, c) => { const [x, y] = at(e); px(g, c, x - 1, y - 1, CW + 1, 1); px(g, c, x - 1, y + CH - 1, CW + 1, 1); px(g, c, x - 1, y - 1, 1, CH + 1); px(g, c, x + CW - 1, y - 1, 1, CH + 1); };
    if (hover && hover !== sel) mark(hover, '#8a9ab0');
    if (!quiz || quiz.done) mark(sel, tick % 40 < 28 ? '#ffffff' : '#ffd84a');
    // le grand symbole dans le creux du bas, ou la question du quiz
    const big = quiz && !quiz.done ? null : hover || sel;
    if (quiz && !quiz.done) { pxFont(g, 'Où est : ' + quiz.pool[quiz.i].name + ' ?', W / 2, H - 4, '#ffd84a', 8, 'center'); pxFont(g, (quiz.i + 1) + '/10', W - 4, H - 4, '#8a9ab0', 8, 'right'); }
    else if (big) {  // la fiche en grand dans le creux du haut du tableau
      const col = PE_FAM[big.fam][1], tx = X0 + 2 * CW + 4, tw = 10 * CW - 9, ty = Y0 + 1, th = 3 * CH - 2;
      px(g, '#05080e', tx, ty, tw, th); px(g, col, tx + 1, ty + 1, tw - 2, th - 2); px(g, '#0c1422', tx + 3, ty + 3, tw - 6, th - 6);
      pxFont(g, String(big.z), tx + 6, ty + 11, col, 8); pxFont(g, big.mass.toLocaleString('fr-FR') + ' u', tx + tw - 6, ty + 11, '#c8d8e8', 8, 'right');
      pxFont(g, big.sym, tx + tw / 2, ty + 28, col, 16, 'center'); pxFont(g, big.name, tx + tw / 2, ty + th - 6, '#ffffff', 8, 'center');
    }
    if (quiz?.fx?.t > 0) { quiz.fx.t--; mark(quiz.fx.want, '#7ee07a'); if (!quiz.fx.good) mark(quiz.fx.e, '#ff4a3a'); }
    if (quiz?.done && --quiz.done <= 0) quiz = null;
    else if (quiz?.done) gameText(g, W, [['QUIZ FINI', '#6ab0f0', 12], [quiz.ok + ' sur 10' + (quiz.ok === save.best && quiz.ok ? ' · record !' : ''), '#ffd84a']], 64);
    if (tick % 20 === 0) g.canvas.setAttribute('aria-label', quiz && !quiz.done ? 'Quiz : où est ' + quiz.pool[quiz.i].name + ' ? Question ' + (quiz.i + 1) + ' sur 10, ' + quiz.ok + ' bonnes réponses.' : 'Tableau périodique, élément choisi : ' + sel.z + ' ' + sel.name + ' (' + sel.sym + ').' + (quiz?.done ? ' Quiz fini : ' + quiz.ok + ' sur 10.' : ''));
  }
  const cellAt = (x, y) => EL.find(e => { const [cx, cy] = at(e); return x >= cx && x < cx + CW - 1 && y >= cy && y < cy + CH - 1; });
  { const cv = $('peCanvas'), pos = e => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) / b.width * W, (e.clientY - b.top) / b.height * H]; };
    cv.onpointermove = e => { hover = cellAt(...pos(e)) || null; };
    cv.onpointerleave = () => { hover = null; };
    cv.onpointerdown = e => { e.preventDefault(); const [x, y] = pos(e), c = cellAt(x, y);
      if (c) { if (quiz && !quiz.done) answer(c); else choose(c); return; }
      const l = legend().find(([, lx, ly]) => x >= lx - 1 && x < lx + 60 && y >= ly && y < ly + 8); if (l) only = only === l[0] ? null : l[0]; };
  }
  $('peFind').oninput = e => { find = e.target.value.trim(); const f = EL.find(e => e.z === +find || norm(e.sym) === norm(find)) || EL.find(match); if (find && f) choose(f); };  // un symbole exact passe avant un début de nom (S : soufre, pas sodium)
  $('peQuiz').onclick = () => { newQuiz(); $('peQuiz').blur(); };
  document.addEventListener('keydown', e => {
    if (!on() || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    const mv = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (mv) { e.preventDefault(); let { r, c } = sel; for (let n = 0; n < 18; n++) { c += mv[0]; r += mv[1]; if (r === 7) r += mv[1]; const t = EL.find(x => x.r === r && x.c === c); if (t) { choose(t); break; } if (r < 0 || r > 9 || c < 0 || c > 17) break; } return; }
    if ((e.key === 'Enter' || e.key === ' ') && quiz && !quiz.done) { e.preventDefault(); answer(sel); return; }
    if (e.key === 'q' || e.key === 'Q') newQuiz();
    if (e.key === 'Escape') { only = null; quiz = null; }
  });
  padKeys({ 3: 'q' });
  {  // vérification : 118 éléments à des places toutes différentes, les bonnes cases (Fe en 4e ligne, 8e colonne ; Og en bas à droite ; Lu au bout des lanthanides), masses croissantes à peu près
    const bad = [], seen = new Set();
    if (EL.length !== 118) bad.push(EL.length + ' éléments');
    for (const e of EL) { const k = e.r + ',' + e.c; if (seen.has(k)) bad.push('place prise deux fois : ' + e.sym); seen.add(k); if (!PE_FAM[e.fam] || !PE_STATE[e.state] || !(e.mass > 0)) bad.push('donnée : ' + e.sym); }
    const F = s => EL.find(e => e.sym === s);
    if (F('Fe').r !== 3 || F('Fe').c !== 7) bad.push('Fe mal placé'); if (F('Og').r !== 6 || F('Og').c !== 17) bad.push('Og mal placé'); if (F('Lu').r !== 8 || F('Lu').c !== 16) bad.push('Lu mal placé');
    if (F('Hf').c !== 3 || F('Rf').c !== 3 || F('Al').c !== 12) bad.push('groupes 4 / 13');
    for (let i = 1; i < 118; i++) if (EL[i].mass < EL[i - 1].mass - 2) bad.push('masse ' + EL[i].sym);
    console.assert(!bad.length, 'periodique', bad); view.dataset.selfcheck = bad.join(' | ') || 'ok';
  }
  card(sel); stats();
  let raf = 0; const frame = () => { if (!on()) { raf = 0; return; } raf = requestAnimationFrame(frame); draw(); };
  ctx.onOpen(() => { g ??= $('peCanvas').getContext('2d'); if (!raf) raf = requestAnimationFrame(frame); });
  $('peCanvas').__quiz = () => quiz && !quiz.done ? quiz.pool[quiz.i].sym : null;
}
