import VNode from 'snabbdom/vnode'
import h from 'snabbdom/h'
import hh from 'hyperscript-helpers'

/**
 * Create helpers using the `hyperscript-helpers` factory. These are just simple
 * wrappers around snabbdom's `h` function.
 */
const {
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, main, map, mark, menu, meta, nav, noscript,
  object, ol, optgroup, option, p, param, pre, q, rp, rt,
  ruby, s, samp, script, section, select, small, source, span,
  strong, style, sub, sup, table, tbody, td, textarea, tfoot,
  th, thead, title, tr, u, ul, video, progress
} = hh(h)

/**
 * The way we have rendering set up, all vnode text is escaped by default. You can
 * mark a vnode as `safe` by setting `data.safe = true`, or by using this helper function.
 *
 * @param {string} ...text
 * @returns {VNode}
 */
function safe(...text) {
  return VNode(undefined, {safe: true}, undefined, text.join(''))
}

export default h
export {
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, main, map, mark, menu, meta, nav, noscript,
  object, ol, optgroup, option, p, param, pre, q, rp, rt,
  ruby, s, samp, script, section, select, small, source, span,
  strong, style, sub, sup, table, tbody, td, textarea, tfoot,
  th, thead, title, tr, u, ul, video, progress, safe
}
