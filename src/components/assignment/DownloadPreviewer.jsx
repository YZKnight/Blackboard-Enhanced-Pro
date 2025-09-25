import React from 'react';
import ReactDOM from 'react-dom/client';
import DeductionsToolbar from './DeductionsToolbar';
import Memo from './Memo';

export default class DownloadPreviewer {
  constructor(gradeProps) {
    this.timer = null;
    this.objectUrl = null;
    this.inited = false;
    this.iframe = null;
    this.container = null;
    this.maxHeightPx = null;
    this.toolbar = null;
    this.dedRoot = null;
    this.memoRoot = null;
    this.gradeProps = gradeProps;
    this.hiddenEls = [];
    this.checkDOMReady();
  }

  checkDOMReady() {
    this.timer = setInterval(() => {
      try {
        const btn = document.querySelector('#downloadPanelButton');
        const previewer = document.querySelector('#previewer');
        const inner = document.querySelector('#previewerInner');
        if (btn && previewer && inner && !this.inited) {
          this.inited = true;
          clearInterval(this.timer);
          this.timer = null;
          this.replaceWithIframe(btn.getAttribute('href'), inner);
        }
      } catch (e) {}
    }, 500);
  }

  async replaceWithIframe(href, container) {
    try {
      const loading = document.getElementById('loadingMessage');
      if (loading) loading.style.display = '';

      const blob = await this._downloadPdfWithRetry(href, 3);
      if (!blob) {
        if (loading) loading.style.display = 'none';
        const extra = document.getElementById('downloadPanelExtraMessage');
        if (extra) {
          extra.textContent = '无法在线预览，请重新刷新页面。若仍不行，请点击下方“Download”查看。';
          extra.style.display = '';
        }
        return;
      }
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = URL.createObjectURL(blob);

      try {
        const outer = document.getElementById('previewer');
        let h = 0;
        if (outer) h = outer.getBoundingClientRect().height;
        if (!h && container) h = container.getBoundingClientRect().height;
        if (h) this.maxHeightPx = Math.max(100, Math.floor(h));
      } catch (_) {}

      while (container.firstChild) container.removeChild(container.firstChild);

      const dedMount = document.createElement('div');
      container.appendChild(dedMount);
      try {
        this.dedRoot = ReactDOM.createRoot(dedMount);
        this.dedRoot.render(<DeductionsToolbar />);
      } catch (_) {}

      const memoHost = document.createElement('div');
      memoHost.className = 'bbep-preview-memo';
      container.appendChild(memoHost);
      try {
        this.memoRoot = ReactDOM.createRoot(memoHost);
        this.memoRoot.render(<Memo props={this.gradeProps} />);
      } catch (_) {}
      this.toolbar = memoHost;

      const iframe = document.createElement('iframe');
      iframe.src = this.objectUrl;
      iframe.style.width = '100%';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      iframe.setAttribute('title', 'Assignment Preview');
      container.appendChild(iframe);

      this.iframe = iframe;
      this.container = container;
      this.updateIframeHeight();

      iframe.onload = () => {
        try {
          iframe.style.visibility = '';
          this.updateIframeHeight();
        } catch (_) {}
        const downloadPanel = document.getElementById('downloadPanel');
        if (downloadPanel) downloadPanel.style.display = 'none';
        if (loading) loading.style.display = 'none';

        // Collapse top nav and breadcrumbs after PDF is ready
        this.collapseTopAreas();

        // Scroll to grading controls panel if available
        setTimeout(() => this.scrollToPanelButton(), 0);
      };
    } catch (e) {
      const loading = document.getElementById('loadingMessage');
      if (loading) loading.style.display = 'none';
    }
  }

  collapseTopAreas() {
    const targets = ['#globalNavPageNavArea', '#breadcrumbs', '#actionbar'];
    targets.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) {
        const prev = el.style.display;
        this.hiddenEls.push({ el, prev });
        el.style.display = 'none';
      }
    });
  }

  scrollToPanelButton() {
    try {
      const el = document.getElementById('panelbutton2');
      if (!el) return;
      if (el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } else {
        const y = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 8;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } catch (_) {}
  }

  updateIframeHeight() {
    if (!this.iframe || !this.container) return;
    try {
      let base = this.maxHeightPx;
      if (!base) {
        const outer = document.getElementById('previewer');
        if (outer) base = Math.floor(outer.getBoundingClientRect().height);
        if (!base && this.container) base = Math.floor(this.container.getBoundingClientRect().height);
      }
      if (!base || base <= 0) base = 600;
      const toolbarH = this.toolbar ? Math.ceil(this.toolbar.getBoundingClientRect().height) : 0;
      let desired = base - toolbarH;
      if (desired < 120) desired = 120;
      this.iframe.style.height = desired + 'px';
    } catch (_) {}
  }

  async _downloadPdfWithRetry(href, maxAttempts = 3) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetch(href, { method: 'GET' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        let isPdf = false;
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/pdf')) {
          isPdf = true;
        } else {
          try {
            const head = await blob.slice(0, 5).text();
            if (head && head.startsWith('%PDF')) isPdf = true;
          } catch (_) {}
        }
        if (isPdf) return blob;
        throw new Error('Not PDF');
      } catch (e) {
        if (attempt < maxAttempts) {
          await sleep(600 * attempt);
          continue;
        } else {
          return null;
        }
      }
    }
    return null;
  }

  remove() {
    if (this.timer) clearInterval(this.timer);
    if (this.objectUrl) {
      try { URL.revokeObjectURL(this.objectUrl); } catch (_) {}
    }
    if (this.dedRoot) {
      try { this.dedRoot.unmount(); } catch (_) {}
      this.dedRoot = null;
    }
    if (this.memoRoot) {
      try { this.memoRoot.unmount(); } catch (_) {}
      this.memoRoot = null;
    }
    // restore collapsed areas
    if (this.hiddenEls && this.hiddenEls.length) {
      this.hiddenEls.forEach(({ el, prev }) => {
        try { el.style.display = prev; } catch (_) {}
      });
      this.hiddenEls = [];
    }
  }
}
