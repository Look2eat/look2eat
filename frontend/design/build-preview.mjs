// Renders the .dc.html artboards as a plain, standalone landing page you can
// open in a browser. Regenerate after editing any artboard:
//   node design/build-preview.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, 'preview')
mkdirSync(out, { recursive: true })

function parse(file) {
  const src = readFileSync(join(here, file), 'utf8')
  const helmet = src.match(/<helmet>([\s\S]*?)<\/helmet>/)
  const body = src.match(/<\/helmet>([\s\S]*?)<\/x-dc>/)
  if (!helmet || !body) throw new Error(`could not parse ${file}`)
  return { head: helmet[1].trim(), body: body[1].trim() }
}

const desktop = parse('Main.dc.html')
const mobile = parse('Mobile.dc.html')

// Both artboards carry the same helmet, so one copy in <head> covers both.
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Zuplin — landing page preview</title>
${desktop.head}
<style>
  body { background: #05060A; }
  .zp-switch {
    position: fixed; z-index: 999; bottom: 14px; left: 14px;
    display: flex; gap: 4px; padding: 4px; border-radius: 999px;
    background: rgba(12,14,20,0.82); border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(10px); font-family: 'Poppins', system-ui, sans-serif;
  }
  .zp-switch button {
    appearance: none; border: 0; cursor: pointer; padding: 7px 15px; border-radius: 999px;
    background: transparent; color: #9BA1AF; font: inherit; font-size: 13px; font-weight: 500;
  }
  .zp-switch button[aria-pressed="true"] { background: #2135DD; color: #fff; }
  .zp-board { display: none; }
  .zp-board[data-active] { display: block; }
  /* The desktop artboard is a fixed 1440px; scale it down to fit narrow
     windows so the whole layout is visible without horizontal scrolling. */
  #board-desktop { overflow: hidden; }
  #board-desktop > div { transform-origin: top left; }
  .zp-fit-note {
    position: fixed; z-index: 999; bottom: 18px; right: 14px;
    padding: 6px 13px; border-radius: 999px; font-family: 'Poppins', system-ui, sans-serif;
    font-size: 11.5px; color: #9BA1AF; background: rgba(12,14,20,0.82);
    border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(10px);
  }
  #board-mobile {
    padding: 28px 20px 76px;
  }
  #board-mobile > div {
    width: 390px; margin: 0 auto; border-radius: 34px; overflow: hidden;
    box-shadow: 0 40px 90px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08);
  }
</style>
</head>
<body>

<div class="zp-switch">
  <button type="button" data-target="desktop" aria-pressed="true">Desktop &middot; 1440</button>
  <button type="button" data-target="mobile" aria-pressed="false">Mobile &middot; 390</button>
</div>

<div class="zp-fit-note" id="fit-note"></div>

<div class="zp-board" id="board-desktop" data-active>
${desktop.body}
</div>

<div class="zp-board" id="board-mobile">
${mobile.body}
</div>

<script>
  const boards = { desktop: document.getElementById('board-desktop'), mobile: document.getElementById('board-mobile') };
  document.querySelectorAll('.zp-switch button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      document.querySelectorAll('.zp-switch button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      Object.entries(boards).forEach(([name, el]) => {
        if (name === target) el.setAttribute('data-active', '');
        else el.removeAttribute('data-active');
      });
      window.scrollTo(0, 0);
      fit();
    });
  });

  const board = boards.desktop.firstElementChild;
  const note = document.getElementById('fit-note');

  function fit() {
    if (!boards.desktop.hasAttribute('data-active')) {
      note.textContent = 'Mobile \u00b7 390px at 100%';
      boards.desktop.style.height = '';
      return;
    }
    const scale = Math.min(1, document.documentElement.clientWidth / 1440);
    board.style.transform = scale < 1 ? 'scale(' + scale + ')' : 'none';
    // Keep the page's scroll length honest about the scaled-down height.
    boards.desktop.style.height = scale < 1 ? board.offsetHeight * scale + 'px' : '';
    note.textContent = 'Desktop \u00b7 1440px at ' + Math.round(scale * 100) + '%';
  }

  fit();
  addEventListener('resize', fit);
</script>

</body>
</html>
`

writeFileSync(join(out, 'index.html'), page)
console.log('wrote design/preview/index.html —', (page.length / 1024).toFixed(0) + 'KB')
