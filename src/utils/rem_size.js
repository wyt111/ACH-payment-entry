(function (doc, win) {
    const uiWidth = 375; // view width
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


