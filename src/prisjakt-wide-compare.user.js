// ==UserScript==
// @name         Prisjakt Wide Compare
// @namespace    https://webapa.piksel.se/
// @version      0.1
// @description  Use all available screen space when comparing products
// @author       nils måsen
// @match        https://www.prisjakt.nu/jamfor/produkter/*,*
// @icon         https://www.google.com/s2/favicons?domain=prisjakt.nu
// @grant        none
// ==/UserScript==

/* eslint no-return-assign: 0, no-multi-spaces: 0 */

(function() {
    'use strict';

    const classStartsWith = (name) => `[class^='${name}']`
    const queryFromPath = (classes) => (Array.isArray(classes) ? classes : [classes]).map(classStartsWith).join(' ');
    const queryAll = (queries) => queries.flatMap(q => Array.from(document.querySelectorAll(q)));
    const prependParents = (qs, q, i) => Array.isArray(qs) ? [...qs, `${qs.at(-1)} ${q}`] : prependParents([qs], q, i);

    const $qcr = (cb, ...paths) => queryAll(paths.map(queryFromPath).reduce(prependParents)).forEach(cb);
    const $qcs = (cb, ...paths) => queryAll(paths.map(queryFromPath)).forEach(cb)

    $qcr(e => { e.style.maxWidth = '100%';   }, `PageContent`, `Wrapper`, `Content`);
    $qcs(e => { e.style.display = 'none';    }, `OutsiderAds`);

    // Float sidebar above content
    $qcs(e => { e.style.marginLeft = '40px'; }, `PageContent`);
    $qcs(e => { e.style.width = 'auto';      }, `Sidebar`);
})();
