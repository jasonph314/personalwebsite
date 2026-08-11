/* ================================================================
   Cursor laser trail
   Inspired by gloriazh.com (which does the same thing in p5.js).

   Four ideas stacked:
     1. Never clear the canvas -- paint a nearly-transparent rect of
        the page background over it each frame, so old strokes wash
        out exponentially. The canvas itself is the trail's memory.
     2. Draw from a *lagging* point (eased toward the cursor) to the
        actual cursor. Fast movement stretches that gap into a streak.
     3. Stroke width is inversely proportional to speed, so fast
        flicks taper to a hairline instead of a fat crayon mark.
     4. Skip drawing below a velocity threshold, so an idle cursor
        doesn't stamp a growing blob.
   ================================================================ */

(function () {
    "use strict";

    var CONFIG = {
        color: "#b9a3ee",        // fallbacks; the real values come from the
        fade: [250, 248, 253],   // CSS custom properties read below
        fadeAlpha: 0.06,         // per-frame wash while drawing
        idleFadeAlpha: 0.25,     // stronger wash once the cursor stops (kills 8-bit residue)
        idleDelay: 900,          // ms of stillness before the stronger wash kicks in
        easing: 0.1,             // how fast the tail point chases the cursor (0-1)
        strokeMin: 1,            // hairline width at max speed
        strokeScale: 10,         // width at zero speed
        maxVel: 5,               // speed at which width bottoms out
        minVel: 0.1              // below this, don't draw at all
    };

    var canvas = document.getElementById("cs_trail_canvas");
    if (!canvas || !canvas.getContext) return;

    // Respect the OS "reduce motion" setting.
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce && reduce.matches) return;

    var ctx = canvas.getContext("2d");
    var w = 0, h = 0;
    var mouseX = -1, mouseY = -1;   // live cursor
    var oldX = -1, oldY = -1;       // lagging tail point
    var lastMove = 0;
    var rafId = null;

    // Pull the palette from CSS so style.css stays the single source of truth.
    // The fade color MUST match the page background, or the trail will wash
    // toward the wrong color and leave a visible rectangle.
    function cssVar(name) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(name).trim();
    }
    function hexToRGB(hex) {
        var m = /^#?([0-9a-f]{6})$/i.exec(hex);
        if (!m) return null;
        var n = parseInt(m[1], 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    var themeColor = cssVar("--cs-trail-color");
    if (themeColor) CONFIG.color = themeColor;

    var themeFade = hexToRGB(cssVar("--cs-page-bg-color"));
    if (themeFade) CONFIG.fade = themeFade;

    var fadeRGB = CONFIG.fade[0] + "," + CONFIG.fade[1] + "," + CONFIG.fade[2];

    function viewportW() {
        return window.innerWidth || document.documentElement.clientWidth || 0;
    }
    function viewportH() {
        return window.innerHeight || document.documentElement.clientHeight || 0;
    }

    function resize() {
        var dpr = window.devicePixelRatio || 1;
        w = viewportW();
        h = viewportH();
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        // Resizing wipes the bitmap, so re-apply all context state.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = CONFIG.color;
    }

    function frame(now) {
        rafId = window.requestAnimationFrame(frame);

        // Self-healing sizing: the viewport can still be 0 when this script
        // first runs (background/prerendered tabs), and a resize event isn't
        // guaranteed afterward. Cheap to re-check; only re-sizes on change.
        if (viewportW() !== w || viewportH() !== h) resize();
        if (w === 0 || h === 0) return;

        // (1) The wash. Fade harder once the cursor has been still for a
        // while -- at alpha 0.06 the 8-bit rounding stalls before the last
        // few levels and would leave faint permanent ghosts otherwise.
        var idle = (now - lastMove) > CONFIG.idleDelay;
        ctx.fillStyle = "rgba(" + fadeRGB + "," +
            (idle ? CONFIG.idleFadeAlpha : CONFIG.fadeAlpha) + ")";
        ctx.fillRect(0, 0, w, h);

        if (mouseX < 0) return;                       // pointer hasn't entered yet
        if (oldX < 0) { oldX = mouseX; oldY = mouseY; return; }   // seed the tail

        // (2) Ease the tail point toward the cursor.
        var newX = (mouseX - oldX) * CONFIG.easing + oldX;
        var newY = (mouseY - oldY) * CONFIG.easing + oldY;

        var dx = newX - oldX;
        var dy = newY - oldY;
        var v = Math.sqrt(dx * dx + dy * dy);

        // (3) + (4) Width falls off with speed; skip micro-movements.
        if (v >= CONFIG.minVel) {
            ctx.lineWidth = Math.max(
                CONFIG.strokeScale * (1 - v / CONFIG.maxVel),
                CONFIG.strokeMin
            );
            ctx.beginPath();
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
        }

        oldX = newX;
        oldY = newY;
    }

    function onMove(e) {
        if (e.pointerType === "touch") return;   // don't draw while scrolling on mobile
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMove = e.timeStamp;
    }

    function onLeave() {
        // Drop the tail so re-entering doesn't draw a line across the page.
        mouseX = -1; mouseY = -1;
        oldX = -1; oldY = -1;
    }

    function start() {
        if (rafId === null) rafId = window.requestAnimationFrame(frame);
    }

    function stop() {
        if (rafId !== null) { window.cancelAnimationFrame(rafId); rafId = null; }
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) { stop(); } else { start(); }
    });

    resize();
    start();
})();
