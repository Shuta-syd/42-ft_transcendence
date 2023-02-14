import React, { useRef, useEffect } from "react";

const Game = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas == null) {
            return ;
        }
        const ctx = canvas.getContext("2d");
        if (ctx == null) {
            return ;
        }
        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let dx = 2;
        let dy = -2;
        const ballRadius = 10;

        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();

            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
                dy = -dy;
            }

            x += dx;
            y += dy;
        };

        const interval = setInterval(draw, 10);
    }, []);

    return <canvas ref={canvasRef} width={400} height={400} />;
};

export default Game;
