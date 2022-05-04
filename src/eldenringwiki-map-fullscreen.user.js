// ==UserScript==
// @name        Elden Ring Wiki Map Fullscreen fix
// @namespace   https://github.com/piksel/monkeyscripts
// @match       https://eldenring.wiki.fextralife.com/Interactive+Map
// @grant       none
// @version     1.0
// @author      nils måsén (github.com/piksel)
// @require     https://github.com/piksel/monkeyscripts/raw/main/src/monkeyutils.js
// @icon        https://p1k.se/favicon.ico
// @updateURL   https://github.com/piksel/monkeyscripts/raw/main/src/eldenringwiki-map-fullscreen.user.js
// ==/UserScript==

$move('#mapA', 'body');
$move('#mapB', 'body');
$move('#mapC', 'body');
$css(`
  .interactivemapcontainer {
    height:100vh!important;
    position: absolute; 
    top: 0
  }
`);
$hide('.fex-main', '.footer-sticky', 'footer', '#fex-menu-fixed', '#fex-account', 'a[href^="https://discord.gg"]');
