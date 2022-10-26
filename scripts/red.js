import { loadCSS } from './lib-franklin.js';

export default async function decorateTemplate() {
  loadCSS(`${window.hlx.codeBasePath}/styles/red.css`);
}
