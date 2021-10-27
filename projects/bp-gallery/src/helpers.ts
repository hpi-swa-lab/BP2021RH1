
/**
* Draws a rounded rectangle using the current state of the canvas.
* If you omit the last three params, it will draw a rectangle
* outline with a 5 pixel border radius
* @param {CanvasRenderingContext2D} ctx
* @param {Number} x The top left x coordinate
* @param {Number} y The top left y coordinate
* @param {Number} width The width of the rectangle
* @param {Number} height The height of the rectangle
* @param {Number} [radius = 5] The corner radius; It can also be an object 
*                 to specify different radii for corners
* @param {Number} [radius.tl = 0] Top left
* @param {Number} [radius.tr = 0] Top right
* @param {Number} [radius.br = 0] Bottom right
* @param {Number} [radius.bl = 0] Bottom left
* @param {Boolean} [fill = false] Whether to fill the rectangle.
* @param {Boolean} [stroke = true] Whether to stroke the rectangle.
*/
export function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
    stroke = true;
    }
    if (typeof radius === 'undefined') {
    radius = 5;
    }
    if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
    }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
    ctx.fill();
    }
    if (stroke) {
    ctx.stroke();
    }
}

export function drawBackground(ctx: CanvasRenderingContext2D) {
    let particles = [];
    window.setInterval(() => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (Math.random() < 0.04) {
            // New particle
            particles.push({
                x: Math.random(),
                y: Math.random(),
                time: Date.now(),
                direction: Math.random() > 0.5 ? 1 : -1,
                destroy: false
            });
        }
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        for (const particle of particles) {
            // Draw particle
            const progress = (Date.now() - particle.time) / 8000;
            ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * (-Math.pow(2 * progress - 1, 2) + 1)})`;
            roundRect(ctx, particle.x * ctx.canvas.width, particle.y * ctx.canvas.height, 150, 20, 15, true, false);
            particle.x += particle.direction / ctx.canvas.width;
            if (progress > 1) {particle.destroy = true;}
        }
        particles = particles.filter(p => !p.destroy);
        // Draw hills
        // ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        // ctx.shadowBlur = 15;
        // ctx.fillStyle='#111111';
        // ctx.beginPath();
        // const maxHeight = ctx.canvas.height / 5;
        // const winScroll = document.body.scrollTop || document.documentElement.scrollTop
        // const progress = winScroll;
        // for (let i = 0; i < 5; i++) {
        //     const height = (Math.sin(12.9898 * i) * 43758.5453) % 1 + 0.6;
        //     const startHeight = (Math.sin(13.9448528 * i) * 45756.5453) % 1;
        //     const endHeight = (Math.sin(13.9448528 * (i + 1)) * 45756.5453) % 1;
        //     const begin = i * (ctx.canvas.width / 5);
        //     ctx.moveTo(begin, ctx.canvas.height * (3/4) - progress + startHeight * maxHeight);
        //     ctx.lineTo(begin + ctx.canvas.width / (5 * 2) - 20, ctx.canvas.height * (3/4) - progress - height * maxHeight);
        //     ctx.lineTo(begin + ctx.canvas.width / 5, ctx.canvas.height * (3/4) - progress + endHeight * maxHeight);
        // }
        // ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        // ctx.lineTo(0, ctx.canvas.height);
        // ctx.lineTo(0, ctx.canvas.height * (3/4) - progress );
        // ctx.fill();
    }, 20);
}