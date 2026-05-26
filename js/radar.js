let radarCanvas, radarCtx;
const RADAR_W = 200;
const RADAR_H = Math.round(RADAR_W * gameHeight / gameWidth); // ~113

function initRadar() {
    radarCanvas = document.getElementById('radar');
    radarCanvas.width  = RADAR_W;
    radarCanvas.height = RADAR_H;
    radarCtx = radarCanvas.getContext('2d');
}

function renderRadar() {
    if (!radarCtx) return;
    const ctx = radarCtx;
    const W = RADAR_W;
    const H = RADAR_H;

    ctx.fillStyle = '#001500';
    ctx.fillRect(0, 0, W, H);

    // World → radar coordinate helpers
    const toRX = wx => (wx + halfWidth)  / gameWidth  * W;
    const toRY = wy => (halfHeight - wy) / gameHeight * H;

    // Terrain: flat landing zones brighter/thicker
    for (let i = 0; i < lineSegments.length; i++) {
        const lv = lineSegments[i][0];
        const rv = lineSegments[i][1];
        const isFlat = heightDifferences[i] < 0.0001;
        ctx.strokeStyle = isFlat ? '#00cc55' : '#2a5530';
        ctx.lineWidth   = isFlat ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(toRX(lv.x), toRY(lv.y));
        ctx.lineTo(toRX(rv.x), toRY(rv.y));
        ctx.stroke();
    }

    // Viewport rectangle — always shown, brighter when zoomed
    {
        const vwHalf = isZoomed ? visibleHalfW / zoom : visibleHalfW;
        const vhHalf = isZoomed ? halfHeight   / zoom : halfHeight;
        const cx = camera.position.x;
        const cy = isZoomed ? camera.position.y : 0;
        ctx.strokeStyle = isZoomed ? '#44ff88' : '#22cc55';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            toRX(cx - vwHalf),
            toRY(cy + vhHalf),
            (vwHalf * 2 / gameWidth)  * W,
            (vhHalf * 2 / gameHeight) * H
        );
    }

    // Lander dot — yellow when thrusting, cyan otherwise
    if (lander && lander.visible) {
        ctx.fillStyle = accelerating ? '#ffee00' : '#00ffcc';
        ctx.beginPath();
        ctx.arc(toRX(lander.position.x), toRY(lander.position.y), 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
