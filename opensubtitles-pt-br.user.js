// ==UserScript==
// @name         OpenSubtitles: força pt-BR
// @namespace    opensubtitles-pt-br.user.js
// @version      1.3
// @icon         https://img.icons8.com/?size=100&id=qlnCw19aQxaU&format=png&color=000000
// @description  Redireciona opensubtitles para pt-BR quando cair na raiz.
// @author       lourencosv (GPT)
// @license      CC BY-NC 4.0
// @updateURL    https://raw.githubusercontent.com/vibeinstance/opensubtitles-brazilian/refs/heads/main/opensubtitles-pt-br.user.js
// @downloadURL  https://raw.githubusercontent.com/vibeinstance/opensubtitles-brazilian/refs/heads/main/opensubtitles-pt-br.user.js
// @match        https://www.opensubtitles.org/*
// @match        https://www.opensubtitles.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const href = window.location.href;

  // Anubis bot-wall (opensubtitles.org). Do not touch its URL.
  if (href.includes('.within.website')) return;

  const url = new URL(href);
  const host = url.hostname.toLowerCase();
  const before = url.pathname + url.search;

  const LOCALE_RE = /^[a-z]{2}(?:-[a-z]{2})?$/i;
  const segments = url.pathname.split('/').filter(Boolean);

  if (host.endsWith('opensubtitles.org')) {
    // Locale prefix: /pb
    if (segments.length === 0 || segments[0].toLowerCase() !== 'pb') {
      if (segments.length && /^[a-z]{2}$/i.test(segments[0])) segments[0] = 'pb';
      else segments.unshift('pb');
    }

    // Force sublanguageid-pob on search paths.
    const subIdx = segments.findIndex(s => s.startsWith('sublanguageid-'));
    if (subIdx !== -1) {
      segments[subIdx] = 'sublanguageid-pob';
    } else {
      const searchIdx = segments.findIndex(s => s === 'search' || s === 'ssearch');
      if (searchIdx !== -1) segments.splice(searchIdx + 1, 0, 'sublanguageid-pob');
    }

    if (url.searchParams.get('sublanguageid') && url.searchParams.get('sublanguageid') !== 'pob') {
      url.searchParams.set('sublanguageid', 'pob');
    }
  } else if (host.endsWith('opensubtitles.com')) {
    // Locale prefix: /pt-BR
    if (segments.length === 0 || segments[0] !== 'pt-BR') {
      if (segments.length && LOCALE_RE.test(segments[0])) segments[0] = 'pt-BR';
      else segments.unshift('pt-BR');
    }
  } else {
    return;
  }

  url.pathname = '/' + segments.join('/');

  if (url.pathname + url.search !== before) {
    window.location.replace(url.toString());
  }
})();
