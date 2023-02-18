import React, { useRef, useEffect } from "react";

/* global variables */
let context: CanvasRenderingContext2D | null;
let canvas:  HTMLCanvasElement | null;
let raf : number;
const middleLine = 450;
let keycode = '';
/*
ballの情報をオブジェクト化して、drawで描けるようになってる
-> ballのx, yを更新できるようにしていく
 */

const ball = {
    x: 255,
    y: 155,
    /* vx/vyはあくまで最初の段階での動きをrandomにしているだけ */
    vx: Math.cos(randomInt(0, 360) * (Math.PI / 180)) * 8,
    vy: Math.sin(randomInt(0, 360) * (Math.PI / 180)) * 8,
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

const leftPaddle = {
    x: 5,
    y: 100,
    color: "black",
    draw() {
        context?.beginPath();
        context?.rect(this.x, this.y, 50, 200);
        context?.closePath();
        context?.fillStyle && (context.fillStyle = this.color);
        context?.fill();
    }
}

const rightPaddle = {
    x: 855,
    y: 100,
    color: "black",
    draw() {
        context?.beginPath();
        context?.rect(this.x, this.y, 50, 200);
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
    context?.strokeRect(5, 100, 900, 700);
    /*
    strokeを用いて、設定情報からlineをひく
     */
    context?.beginPath();
    context?.moveTo(middleLine, 100);
    context?.lineTo(middleLine, 800);
    context?.stroke();
}

/*
後があるobject
 */

function draw() {
    context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    drawStaticObject();
    ball.draw();

    const h = 790;
    const w = 890;
    if (ball.x - ball.radius <= leftPaddle.x + 50
        && (ball.y <= leftPaddle.y + 200
        && ball.y >= leftPaddle.y)){
        ball.vx = -ball.vx;
    }else if (ball.x + ball.radius >= rightPaddle.x
        && (ball.y <= rightPaddle.y + 200
        && ball.y >= rightPaddle.y)) {
        ball.vx = -ball.vx;
    } else if (h < ball.y || ball.y < 100) {
        /* -------Ballでのconflict------- */
        ball.vy = -ball.vy;
    }
    /* 本当はreset */
    else if (ball.x < 5 || w < ball.x) {
        ball.vx = -ball.vx;
    }
    console.log(keycode);
    if (keycode == 'KeyW') {
        if(leftPaddle.y  > 100) {
            leftPaddle.y -= 50;
        }
        if (rightPaddle.y  > 100) {
            rightPaddle.y -= 50;
        }
    }
    if (keycode == 'KeyS') {
        if(leftPaddle.y  + 200 < 800) {
            leftPaddle.y += 50;
        }if (rightPaddle.y + 200 < 800) {
            rightPaddle.y += 50;
        }
    }
    keycode = '';

    ball.x += ball.vx;
    ball.y += ball.vy;

    leftPaddle.draw();
    rightPaddle.draw();

    /* judge conflict */
    if (canvas == null) {
        return ;
    }
    raf = window.requestAnimationFrame(draw);
}

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const handleKeyUp = ():void => {
            keycode =  '';
        }
        const handleKeyDown = (e:KeyboardEvent):void  => {
            keycode = e.code;
        }
        canvas = canvasRef.current;
        if (!canvas) {
            return ;
        }
        context = canvas.getContext('2d');
        if (!context) {
            return ;
        }
        raf = window.requestAnimationFrame(draw);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    }, []);

    // const handleDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     leftPaddle.y += 100;
    // };
    // const handleUp = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     leftPaddle.y += -100;
    // };

    return (
        <div>
            <canvas ref={canvasRef} height="900" width="1000"/>
        </div>
        );
}

export default Canvas;
