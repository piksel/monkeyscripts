// ==UserScript==
// @name         Prisjakt Wide Compare
// @namespace    https://github.com/piksel/monkeyscripts
// @version      0.2
// @description  Use all available screen space when comparing products
// @author       nils måsen
// @match        https://www.prisjakt.nu/jamfor/produkter/*,*
// @icon         https://p1k.se/favicon.ico
// @grant        none
// @updateURL    https://github.com/piksel/monkeyscripts/raw/main/src/prisjakt-wide-compare.user.js
// ==/UserScript==

/* eslint no-return-assign: 0, no-multi-spaces: 0 */

(function() {
    'use strict';

    const classStartsWith = $csw = (name) => `[class^='${name}']`;
    const queryFromPath = (classes) => (Array.isArray(classes) ? classes : [classes]).map(classStartsWith).join(' ');
    const queryAll = (queries) => queries.flatMap(q => Array.from(document.querySelectorAll(q)));
    const prependParents = (qs, q, i) => Array.isArray(qs) ? [...qs, `${qs.at(-1)} ${q}`] : prependParents([qs], q, i);

    // Apply callback to all supplied selector paths, appending the previous as a specializing selector (`foo`, `foo bar`, `foo bar baz`)
    const $qcr = (cb, ...paths) => queryAll(paths.map(queryFromPath).reduce(prependParents)).forEach(cb);
    
    // Apply callbacks to all results matching the supplied selectors
    const $qcs = (cb, ...paths) => queryAll(paths.map(queryFromPath)).forEach(cb)

    $qcr(e => { e.style.maxWidth = '100%';   }, $csw`PageContent`, $csw`Wrapper`, $csw`Content`);
    $qcs(e => { e.style.display = 'none';    }, $csw`OutsiderAds`);

    // Float sidebar above content
    $qcs(e => { e.style.marginLeft = '40px'; }, $csw`PageContent`);
    $qcs(e => { e.style.width = 'auto';      }, $csw`Sidebar`);
})();
