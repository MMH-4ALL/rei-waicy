import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
function open(hash = '') {
  return new JSDOM(html, {
    url: `https://example.test/rei-waicy/${hash}`,
    runScripts: 'dangerously', pretendToBeVisual: true,
    beforeParse(window) {
      window.scrollTo = () => {};
      window.matchMedia = () => ({ matches: true });
    },
  });
}

test('shared section links open the correct page and invalid routes show home', () => {
  for (const [hash, expected] of [['#demo', 'page-demo'], ['#ethics', 'page-ethics'], ['#missing', 'page-home']]) {
    const dom = open(hash);
    try { assert.equal(dom.window.document.querySelector('.page.active').id, expected); }
    finally { dom.window.close(); }
  }
});

test('navigation updates links, page state, keyboard focus and browser history', async () => {
  const dom = open('#home');
  try {
    const { window } = dom;
    window.nav('demo');
    assert.equal(window.location.hash, '#demo');
    assert.equal(window.document.querySelector('[data-page="demo"]').getAttribute('aria-current'), 'page');
    assert.equal(window.document.activeElement.tagName, 'H2');
    window.history.back();
    await new Promise(resolve => window.addEventListener('popstate', resolve, { once: true }));
    assert.equal(window.document.querySelector('.page.active').id, 'page-home');
    window.toggleNav();
    assert.equal(window.document.getElementById('hamBtn').getAttribute('aria-expanded'), 'true');
    window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    assert.equal(window.document.getElementById('hamBtn').getAttribute('aria-expanded'), 'false');
  } finally { dom.window.close(); }
});

test('Enter cannot enqueue overlapping replies while the send button is busy', () => {
  const dom = open('#demo');
  try {
    const { window } = dom;
    const input = window.document.getElementById('chatIn');
    input.value = 'A fictional school question';
    window.sendMsg();
    input.value = 'A second question';
    window.sendMsg();
    assert.equal(window.document.querySelectorAll('#chatMsgs .msg.user').length, 1);
    assert.equal(input.value, 'A second question');
  } finally { dom.window.close(); }
});
