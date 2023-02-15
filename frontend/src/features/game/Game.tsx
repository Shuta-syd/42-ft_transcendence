import React, { useRef, useEffect } from "react";

let gContext: CanvasRenderingContext2D | null;
let gCanvas:  HTMLCanvasElement | null;

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

function drawDynamicOnjsct() {
    ball.draw();
}


function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw() {
    gContext?.clearRect(5, 5, 500, 300);
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;
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
        drawDynamicOnjsct();
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
