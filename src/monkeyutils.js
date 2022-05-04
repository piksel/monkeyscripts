class TimeoutError extends Error {
  constructor(timeout, message, ...params) {
    super(`${message}, timed out after ${(timeout/1000).toFixed(1)} seconds`, ...params);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) Error.captureStackTrace(this, TimeoutError);
    this.name = 'TimeoutError';
  }
}
  
/**
 * Asynchronously tries to find the element matching `selector`
 * @param {string | HTMLElement} selector A CSS selector for (or a resolved `HTMLElement` instance of) the target element
 * @param {number} [timeout=2000] (ms) Timeout before failure (default 2000)
 * @param {number} [delay=200] (ms) The amount of time between attempts to query for the element in ms (default 200)
 * @throws {TimeoutError} Will throw an error if the element was not found before `timeout` ms
 * @example
 * ```js
 * // Using await (in an async context):
 * const annoyingDiv = await $q('div.annoying');
 * annoyingDiv.style.display = 'inline-block';
 * ```
 * @example
 * ```js
 * //  Using Promise.then:
 * $q('div.annoying').then(annoyingDiv => {
 *    annoyingDiv.style.display = 'inline-block';
 * });
 * ```
 * @returns {Promise<HTMLElement>}
 */
const $q = async (selector, timeout = 2000, delay = 200) => {
  if (selector instanceof HTMLElement) return selector;
  let el, attempts = Math.floor(timeout / delay);
  while (attempts--) el = document.querySelector(selector) || await new Promise(r => setTimeout(() => r(false), delay));
  if (!el) throw new TimeoutError(timeout, `Could not find element "${selector}"`);
  return el;
}

  /**
 * Adds a css stylesheet to the document containing the passed css styles
 * @param {string} styles CSS style rules
 * @returns {Promise<CSSStyleSheet>}
 */
const $css = async (styles) => {
  const css = await new CSSStyleSheet().replace(styles);
  document.adoptedStyleSheets?.push(css);// = [...document.adoptedStyleSheets, css];
  return css;
}

/**
 * Adds a css stylesheet (using {@link $css}) to the document that hides all the elements matching the passed selectors
 * @param {...string} selectors One or more css selectors that the rule should apply to 
 * @example
 * ```js
 * $hide('div.annoying', '#top-menu', 'a[href$="subscribe"]');
 * ```
 * Result: 
 * ```css
 * div.annoying, #top-menu, a[href$="subscribe"] { display: none!important }
 * ```
 * @returns {Promise<CSSStyleSheet>}
 */
const $hide = (...selectors) => $css(`${selectors.flat().join(', ')}{ display: none!important }`)

/**
 * Move element node `item` to container `target`
 * @param {HTMLElement | string} item The element (or a selector for it) to move
 * @param {HTMLElement | string} target The new container element (or a selector for it)
 * @param {number} [timeout=2000] (ms) The maximum amount of time to wait for the elements to be found (default 2000)
 */
const $move = async (item, target, timeout=2000) => {
  item = await $q(item);
  target = await $q(target);
  item.parentElement?.removeChild(item);
  target.append(item);
}

/**
 * Create an HTML element with the specified tag and child-nodes 
 * @param {string} tag Element tag
 * @param {(string | Node)[]} children 
 * @returns {HTMLElement}
 */
const $elem = (tag, ...children) => {
  const el = document.createElement(tag);
  el.append(...children);
  return el;
}


/**
 * @callback SetStylesFunc
 * @param {string} btnId The unique ID for the toggle button
 * @returns {string}
 * 
 * @typedef ButtonOptions
 * @property {boolean} enabled
 * @property {string} textEnabled
 * @property {string} textDisabled
 * @property {string} title
 * @property {'top' | 'bottom'} vpos
 * @property {'left' | 'right'} hpos
 * @property {string} margin
 * @property {string | HTMLElement} container
 * @property {SetStylesFunc} setStyles
 */

/** @type {ButtonOptions} */
const DefaultToggleButtonOptions = {
  enabled: true, 
  icon: '🐵', 
  text: '', 
  title: 'Toggle page customizations', 
  vpos: 'bottom', 
  hpos: 'left', 
  margin: '10px', 
  container: 'body',
  setStyles: btnId => `
    #${btnId}                                { box-shadow: 0px 0px 5px black; position: fixed; display: flex; column-gap: .2em; flex-direction: row }
    #${btnId} i                              { position: relative; display: inline-block; font-style: normal }
    #${btnId}[data-enabled="false"] i::after { content: "❌"; position: absolute; width: 100%; left: 0; }
  `,
};

/**
 * Create a button that toggles the passed `styleSheets`
 * @param {Promise<CSSStyleSheet>[]} styleSheets 
 * @param {ButtonOptions} [buttonOpts=] {@link ButtonOptions}
 */
const $toggle = async (styleSheets, buttonOpts) => {
  const opts = {...DefaultToggleButtonOptions, ...buttonOpts};

  const btn = $elem('button', ...[$elem('i', opts.icon), opts.text]);

  btn.id = `toggle-${(new Date()).getTime().toString(16)}`;
  btn.style[opts.vpos] = opts.margin;
  btn.style[opts.hpos] = opts.margin;

  const styles = await Promise.all(styleSheets);
  const updateState = (enabled) => {
    btn.dataset.enabled = enabled; 
    styles.forEach(ss => ss.disabled = !enabled);
    btn.title = `${opts.title} (currently ${enabled?'en':'dis'}abled)`;
  }
  btn.onclick = () => updateState(btn.dataset.enabled === 'false');

  $css(opts.setStyles(btn.id));
  
  updateState(opts.enabled);
  $move(btn, opts.container);
}
