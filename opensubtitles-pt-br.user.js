// ==UserScript==
// @name         OpenSubtitles: força pt-BR (/pb)
// @namespace    opensubtitles-pt-br.user.js
// @version      1.0
// @icon         https://img.icons8.com/?size=100&id=nsHROZ0QAjiG&format=png&color=000000
// @description  Redireciona opensubtitles.org para /pb (pt-BR) quando cair em /pt (pt-PT) ou na raiz.
// @author       lourencosv (GPT)
// @license      CC BY-NC 4.0
// @updateURL    https://gist.githubusercontent.com/lourencosv/3450244a50ec91bff19b12af376d2908/raw/opensubtitles-pt-br.user.js
// @downloadURL  https://gist.githubusercontent.com/lourencosv/3450244a50ec91bff19b12af376d2908/raw/opensubtitles-pt-br.user.js
// @match        https://www.opensubtitles.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const url = new URL(window.location.href);

  // Se já está em /pb, não mexe.
  if (url.pathname === '/pb' || url.pathname.startsWith('/pb/')) return;

  // Se cai na raiz ("/") ou em /pt (pt-PT), manda para /pb mantendo o resto do caminho.
  const isRoot = (url.pathname === '/' || url.pathname === '');
  const isPtPt = (url.pathname === '/pt' || url.pathname.startsWith('/pt/'));

  if (isRoot || isPtPt) {
    if (isRoot) {
      url.pathname = '/pb';
    } else {
      url.pathname = url.pathname.replace(/^\/pt(\/|$)/, '/pb$1');
    }
    // Mantém querystring e hash automaticamente.
    window.location.replace(url.toString());
  }
})();