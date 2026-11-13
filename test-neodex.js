// lancé par le test « local » de NeoDex : vérification interne, cherche « fer » (fiche), puis joue un quiz parfait en cliquant les bonnes cases
module.exports = async ({ pj, sleep }) => {
  const sc = await pj(`document.querySelector('[data-selfcheck]')?.dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  await pj(`(() => { const f = document.getElementById('peFind'); f.value = 'fer'; f.dispatchEvent(new Event('input')); })(), 0`); await sleep(200);
  const card = await pj(`document.getElementById('peCard').innerText`);
  if (!/55,845/.test(card)) throw new Error('fiche du fer : ' + card.replace(/\s+/g, ' ').slice(0, 120));
  await pj(`document.getElementById('peFind').value = ''; document.getElementById('peFind').dispatchEvent(new Event('input')); document.getElementById('peQuiz').click(); 0`);
  for (let i = 0; i < 10; i++) {
    const sym = await pj(`document.getElementById('peCanvas').__quiz()`); if (!sym) throw new Error('quiz fini trop tôt');
    // la case de l'élément, retrouvée par la recherche puis les flèches : on passe par la fiche pour sélectionner, puis Entrée
    await pj(`(() => { const f = document.getElementById('peFind'); f.value = ${JSON.stringify(sym)}; f.dispatchEvent(new Event('input')); f.blur(); })(), 0`);
    await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true})), 0`); await sleep(60);
  }
  await sleep(400);
  const l = await pj(`document.getElementById('peCanvas').getAttribute('aria-label')`);
  if (!/Quiz fini : 10 sur 10/.test(l)) throw new Error('quiz : « ' + l + ' »');
  return l;
};
