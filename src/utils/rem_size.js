import common from './common.js';

export default function rem_size(){
    (function (doc, win) {
        const uiWidth = common.uiSize; // view width 375
        const docEl = doc.documentElement;
        const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
        const recalc = function () {
            let clientWidth = docEl.clientWidth;
            if (!clientWidth) {
                return;
            }
            // if (clientWidth >= uiWidth) {
            //     clientWidth = uiWidth;
            // }
            docEl.style.fontSize = 100 * (clientWidth / uiWidth) + 'px';
        };
        if (!doc.addEventListener) {
            return;
        }
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
        recalc();
    })(document, window);
}
