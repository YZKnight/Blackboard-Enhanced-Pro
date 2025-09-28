// Ensure JSZip is loaded before docx-preview attaches
// Load both vendor bundles in the userscript scope to avoid CJS `require`
// The code runs in the userscript sandbox, not the page, so page CSP 'script-src' inline rules do not block it.

import jszipCode from './jszip.min.js?raw';
import docxPreviewCode from './docx-preview.min.js?raw';

export function loadDocx() {
  if (typeof window === 'undefined') return undefined;
  if (window.docx) return window.docx;
  // Execute UMD scripts so they attach JSZip and docx to the global object
  try {
    // eslint-disable-next-line no-new-func
    new Function(jszipCode)();
  } catch (_) {}
  try {
    // eslint-disable-next-line no-new-func
    new Function(docxPreviewCode)();
  } catch (_) {}
  return window.docx;
}

export default loadDocx;

