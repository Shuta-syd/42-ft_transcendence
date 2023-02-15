import React, { useRef, useEffect } from "react";


/* global variables */
let gContext: CanvasRenderingContext2D | null;
let gCanvas:  HTMLCanvasElement | null;
let gRaf : number;

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
        gContext?.beginPath();// 自身を書く関数をpropertyのなかに格納
        gContext?.arc(this.x, this.y, this.radius, 0, Math.PI * 2 );
        gContext?.closePath();
        gContext?.fillStyle && (gContext.fillStyle = this.color);
        gContext?.fill();
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
    gContext?.beginPath();
    /*
    rectangleの外枠だけを出力する関数
    x、 y(始点)、幅、高さ
     */
    gContext?.strokeRect(5, 5, 505, 305);

    /*
    strokeを用いて、設定情報からlineをひく
     */
    gContext?.beginPath();
    gContext?.moveTo(255, 5);
    gContext?.lineTo(255, 310);
    gContext?.stroke();
}

/*
後があるobject
 */

function drawDynamicObject() {
    ball.draw();
}


function draw() {
    gContext?.clearRect(0, 0, gCanvas?.width || 0, gCanvas?.height || 0);
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;
    gRaf = window.requestAnimationFrame(draw);
}

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        gCanvas = canvasRef.current;
        if (!gCanvas) {
            return ;
        }
        gContext = gCanvas.getContext('2d');
        if (!gContext) {
            return ;
        }
        drawStaticObject();
        drawDynamicObject();

        gCanvas.addEventListener('mousemove', (e) => {
            gRaf = window.requestAnimationFrame(draw);
        });


    }, []);
    return <canvas ref={canvasRef} height="1000" width="1000"/>
}

export default Canvas;

/*
TODO
 *requestAnimationFrame関数を利用して
 ballを動かせるようにする
 (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations)
 ↑参考url
 *globalにしないで済むかどうかも検討
 */
