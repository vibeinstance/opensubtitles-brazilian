// ==UserScript==
// @name         OpenSubtitles: força pt-BR
// @namespace    opensubtitles-pt-br.user.js
// @version      1.2
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

  const url = new URL(window.location.href);
  const host = url.hostname.toLowerCase();

  function splitPath(pathname) {
    return pathname.split('/').filter(Boolean);
  }

  function joinPath(segments) {
    return '/' + segments.join('/');
  }

  function looksLikeLocale(seg) {
    return /^[a-z]{2}(?:-[a-z]{2})?$/i.test(seg);
  }

  function isAnubisWrapper(u) {
    const segments = splitPath(u.pathname);
    return (
      segments.includes('.within.website') ||
      (u.searchParams.get('redir') || '').includes('.within.website')
    );
  }

  function normalizeOrg(u) {
    const segments = splitPath(u.pathname);
    let changed = false;

    if (segments.length === 0) {
      segments.push('pb');
      changed = true;
    } else if (segments[0] !== 'pb') {
      if (/^[a-z]{2}$/i.test(segments[0])) segments[0] = 'pb';
      else segments.unshift('pb');
      changed = true;
    }

    const subIdx = segments.findIndex(s => s.startsWith('sublanguageid-'));
    if (subIdx !== -1) {
      if (segments[subIdx] !== 'sublanguageid-pob') {
        segments[subIdx] = 'sublanguageid-pob';
        changed = true;
      }
    } else {
      const searchIdx = segments.findIndex(s => s === 'search' || s === 'ssearch');
      if (searchIdx !== -1) {
        segments.splice(searchIdx + 1, 0, 'sublanguageid-pob');
        changed = true;
      }
    }

    if (u.searchParams.has('sublanguageid') && u.searchParams.get('sublanguageid') !== 'pob') {
      u.searchParams.set('sublanguageid', 'pob');
      changed = true;
    }

    const newPath = joinPath(segments);
    if (u.pathname !== newPath) {
      u.pathname = newPath;
      changed = true;
    }

    return changed;
  }

  function normalizeCom(u) {
    const segments = splitPath(u.pathname);
    let changed = false;

    if (segments.length === 0) {
      segments.push('pt-BR');
      changed = true;
    } else if (segments[0] !== 'pt-BR') {
      if (looksLikeLocale(segments[0])) segments[0] = 'pt-BR';
      else segments.unshift('pt-BR');
      changed = true;
    }

    const searchAllIdx = segments.indexOf('search-all');
    if (searchAllIdx !== -1) {
      if (searchAllIdx >= 2) {
        if (segments[searchAllIdx - 1] !== 'pt-BR') {
          segments[searchAllIdx - 1] = 'pt-BR';
          changed = true;
        }
      } else if (searchAllIdx === 1) {
        segments.splice(1, 0, 'pt-BR');
        changed = true;
      }
    }

    const newPath = joinPath(segments);
    if (u.pathname !== newPath) {
      u.pathname = newPath;
      changed = true;
    }

    return changed;
  }

  let changed = false;

  if (isAnubisWrapper(url)) {
    return;
  }

  if (host.endsWith('opensubtitles.org')) {
    changed = normalizeOrg(url);
  } else if (host.endsWith('opensubtitles.com')) {
    changed = normalizeCom(url);
  }

  if (changed) {
    window.location.replace(url.toString());
  }
})();
