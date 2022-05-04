// ==UserScript==
// @name        Elden Ring Wiki Map Toggle fixes
// @namespace   https://github.com/piksel/monkeyscripts
// @match       https://eldenring.wiki.fextralife.com/file/Elden-Ring/map-*.html
// @grant       none
// @version     1.0
// @author      nils måsén (github.com/piksel)
// @require     https://github.com/piksel/monkeyscripts/raw/main/src/monkeyutils.js
// @icon        https://p1k.se/favicon.ico
// @updateURL   https://github.com/piksel/monkeyscripts/raw/main/src/eldenringwiki-map-toggle.user.js
// ==/UserScript==

// Replace bad unicode char with a regular close symbol
$q('#closeSideBarIn').then(e => e.innerHTML = '&times;');

// Remove the inline styles that prevent the sidebar from working on maps B and C
$q('#sidebar').then(e => e.style.display = 'block');

// Stop the buttons from moving on hover
$css(`.leaflet-touch .leaflet-bar a:hover {height: 30px; width: 30px}`);
