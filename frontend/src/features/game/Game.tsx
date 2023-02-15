import React, { useRef, useEffect } from "react";


/* global variables */
let context: CanvasRenderingContext2D | null;
let canvas:  HTMLCanvasElement | null;
let raf : number;
let isRunning : boolean;

/*
ballの情報をオブジェクト化して、drawで描けるようになってる
-> ballのx, yを更新できるようにしていく
 */

const ball = {
    x: 255,
    y: 155,
    /* vx/vyはあくまで最初の段階での動きをrandomにしているだけ */
    vx: Math.cos(randomInt(0, 360) * (Math.PI / 180)),
    vy: Math.sin(randomInt(0, 360) * (Math.PI / 180)),
    radius: 25,
    color: "red",
    draw() {
        context?.beginPath();// 自身を書く関数をpropertyのなかに格納
        context?.arc(this.x, this.y, this.radius, 0, Math.PI * 2 );
        context?.closePath();
        context?.fillStyle && (context.fillStyle = this.color);
        context?.fill();
    }
}


/* Helper */
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*
後に変更のないobject
(ex) line
 */
function drawStaticObject() {
    // create a field of game
    /* lineを出す */
    context?.beginPath();
    /*
    rectangleの外枠だけを出力する関数
    x、 y(始点)、幅、高さ
     */
    context?.strokeRect(5, 5, 505, 305);

    /*
    strokeを用いて、設定情報からlineをひく
     */
    context?.beginPath();
    context?.moveTo(255, 5);
    context?.lineTo(255, 310);
    context?.stroke();
}

/*
後があるobject
 */

function draw() {
    context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;
    /* より現実に近くなるようにする */
    ball.vy *= 0.99;
    ball.vy += 0.25;

    /* judge conflict */
    if (canvas == null) {
        return ;
    }
    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
    }
    if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
    }

    raf = window.requestAnimationFrame(draw);
}

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        canvas = canvasRef.current;
        if (!canvas) {
            return ;
        }
        context = canvas.getContext('2d');
        if (!context) {
            return ;
        }
        drawStaticObject();

        canvas.addEventListener('mousemove', (e) => {
            if (!isRunning) {
                raf = window.requestAnimationFrame(draw);
                isRunning = true;
            }
        });
        canvas.addEventListener('mouseout', (e) => {
            window.cancelAnimationFrame(raf);
            isRunning = false;
        });
        ball.draw();
    }, []);
    return <canvas ref={canvasRef} height="1000" width="1000"/>
}

export default Canvas;
