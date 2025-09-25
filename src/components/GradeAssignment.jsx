

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client';
import './GradeAssignment.css'
import DownloadPreviewer from './assignment/DownloadPreviewer';
import HeaderDedMeta from './assignment/HeaderDedMeta';

// Memo, DeductionsToolbar, HeaderDedMeta, DownloadPreviewer moved to ./assignment/*


class PrettierPage {
    constructor() {
        this.expand;
        this.fb;

        this.checkDOMReady();
    }

    checkDOMReady() {
        try {
            const checkInterval = setInterval(() => {
                this.expand = document.querySelector("#currentAttempt_gradeDataPanel");
                this.fb = document.querySelector('#feedbacktext_tbl > tbody > tr > td > span')
                const help = document.getElementById('helpPageTitle');

                if (this.expand && this.fb) {
                    this.expand.style.display = '';
                    this.fb.remove();
                    clearInterval(checkInterval);
                }

                if (help) {
                    try { help.remove(); } catch (_) { /* noop */ }
                }
            }, 500);

        } catch (err) { console.log }
    }
}


class AutoCalculator {
    constructor() {
        this.textArea;
        this.fillSpace;

        this.totolGrade;
        this.lastGrade;

        this.checkDOMReady();
    }

    checkDOMReady() {
        const checkInterval = setInterval(() => {
            try {
                this.textArea = this.return_textArea();
                this.fillSpace = this.return_fillSpace();
                this.totolGrade = this.return_totalGrade();
                this.lastGrade = this.return_lastGrade();

                if (this.textArea && this.fillSpace && this.totolGrade && this.lastGrade) {
                    clearInterval(checkInterval);
                    this.setupEventListeners();
                }
            } catch (err) { console.log }
        }, 500);
    }

    setupEventListeners() {
        this.textArea.addEventListener('input', this.handleInput.bind(this));

        if (this.lastGrade != '-') {
            this.fillSpace.value = this.lastGrade;
        } else {
            this.fillSpace.value = this.totolGrade;
        }
    }

    return_textArea() {
        return document.querySelector("#feedbacktext_ifr").contentDocument.documentElement.querySelector("body");
    }

    return_fillSpace() {
        return document.querySelector("#currentAttempt_grade");
    }

    return_totalGrade() {
        return parseFloat(document.querySelector("#currentAttempt_pointsPossible").innerHTML.split('/')[1]);
    }

    return_lastGrade() {
        return document.querySelector("#aggregateGrade").value;
    }


    handleInput(e) {
        const numsArr = e.target.innerHTML.match(/-\d+(\.\d+)?/g);

        if (!numsArr) {
            this.fillSpace.value = this.totolGrade;
        } else {
            let grade = this.totolGrade;
            numsArr.forEach(num => {
                grade += parseFloat(num);
            })
            this.fillSpace.value = grade;
        }
    }

    remove() {
        if (this.textArea) {
            this.textArea.removeEventListener('input', this.handleInput)
        }
    }

}


// Replace previewer panel with inline PDF iframe when a download button exists
// DownloadPreviewer moved to separate file



export function GradeAssignment(props) {
    // addMemo()
    useEffect(() => {
        const PP = new PrettierPage();
        const AC = new AutoCalculator();
        const DP = new DownloadPreviewer(props);


        const bro = document.querySelector('#currentAttempt_submission');
        const app = document.createElement('div');
        bro.parentNode.style.height = 'auto';
        bro.parentNode.insertBefore(app, bro);
        const root = ReactDOM.createRoot(app);
        root.render(<></>);

        // mount header controls (count + step) inline with page title
        let headerRoot = null;
        let headerHost = null;
        try {
            const titleExtra = document.getElementById('_titlebarExtraContent') || document.getElementById('pageTitleBar');
            if (titleExtra) {
                headerHost = document.createElement('span');
                headerHost.className = 'bbep-header-meta-container';
                titleExtra.appendChild(headerHost);
                headerRoot = ReactDOM.createRoot(headerHost);
                headerRoot.render(<HeaderDedMeta />);
            }
        } catch (_) { /* noop */ }

        return () => {
            if (root) {
                root.unmount();
            }
            AC.remove();
            DP.remove();
            if (headerRoot) {
                try { headerRoot.unmount(); } catch (_) {}
                if (headerHost && headerHost.parentNode) headerHost.parentNode.removeChild(headerHost);
            }
        }
    }, []);


    return <>
    </>
}
