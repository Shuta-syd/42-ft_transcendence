import React, { useRef, useEffect } from "react";

/* global variables */
let context: CanvasRenderingContext2D | null;
let canvas:  HTMLCanvasElement | null;
let raf;
let keycode = '';
let leftScore = 0;
let rightScore = 0;

/* Ball macro */
const BALLX = 455;
const BALLY = 450;
const RADIUS = 25;

/* Paddle macro */

const PADDLEWIDTH = 20;
const PADDLEWHEIGHT = 200;

/* Field macro */
const FIELDX = 5;
const FIELDY = 100;
const FIELDWIDTH = 900;
const FIELDHEIGHT = 700;
const MIDX = 450;
const MIDY = 450;

/* Left Paddle macro */
const LPADDLEX = 5;
const LPADDLEY = 100;

/* Right Paddle macro */
const RPADDLEX = FIELDX + FIELDWIDTH - PADDLEWIDTH;
const RPADDLEY = 100;


/* Display macro */

const WIDTH = 1000;
const HEIGHT = 900;
/*
ballの情報をオブジェクト化して、drawで描けるようになってる
-> ballのx, yを更新できるようにしていく
 */

const ball = {
    x: BALLX,
    y: BALLY,
    /* vx/vyはあくまで最初の段階での動きをrandomにしているだけ */
    vx: Math.cos(randomInt(0, 30) * (Math.PI / 180)) * 8,
    vy: Math.sin(randomInt(0, 30) * (Math.PI / 180)) * 8,
    radius: RADIUS,
    color: "red",
    draw() {
        context?.beginPath();// 自身を書く関数をpropertyのなかに格納
        context?.arc(this.x, this.y, this.radius, 0, Math.PI * 2 );
        context?.closePath();
        context?.fillStyle && (context.fillStyle = this.color);
        context?.fill();
    },
    init(){
        this.x = BALLX;
        this.y = BALLY;
        this.vx = Math.cos(randomInt(0, 360) * (Math.PI / 180)) * 8;
        this.vy = Math.sin(randomInt(0, 360) * (Math.PI / 180)) * 8;
    }
}

const leftPaddle = {
    x: LPADDLEX,
    y: LPADDLEY,
    color: "black",
    draw() {
        context?.beginPath();
        context?.rect(this.x, this.y, PADDLEWIDTH, PADDLEWHEIGHT);
        context?.closePath();
        context?.fillStyle && (context.fillStyle = this.color);
        context?.fill();
    }
}

const rightPaddle = {
    x: RPADDLEX,
    y: RPADDLEY,
    color: "black",
    draw() {
        context?.beginPath();
        context?.rect(this.x, this.y, PADDLEWIDTH, PADDLEWHEIGHT);
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
    context?.strokeRect(FIELDX, FIELDY, FIELDWIDTH, FIELDHEIGHT);
    /*
    strokeを用いて、設定情報からlineをひく
     */
    context?.beginPath();
    context?.moveTo(MIDX, FIELDY);
    context?.lineTo(MIDX, FIELDWIDTH);
    context?.stroke();
}

/*
後があるobject
 */

function draw() {
    context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    drawStaticObject();

    /* check collision */
    if (ball.x - ball.radius <= leftPaddle.x + PADDLEWIDTH
        && (ball.y <= leftPaddle.y + PADDLEWHEIGHT
            && ball.y >= leftPaddle.y)){
        ball.vx = -ball.vx;
    }else if (ball.x + ball.radius >= rightPaddle.x
        && (ball.y <= rightPaddle.y + PADDLEWHEIGHT
            && ball.y >= rightPaddle.y)) {
        ball.vx = -ball.vx;
    } else if (FIELDHEIGHT + FIELDY < ball.y || ball.y < FIELDY) {
        /* -------Ballでのconflict------- */
        ball.vy = -ball.vy;
        /* -----------reset------------- */
    } else if (ball.x < FIELDX) {
        rightScore += 1;
        ball.init();
    } else if (FIELDX + FIELDWIDTH < ball.x) {
        leftScore += 1;
        ball.init();
    }

    /* check keycode */
    if (keycode == 'KeyW') {
        if(leftPaddle.y  > FIELDY) {
            leftPaddle.y -= 50;
        }
        if (rightPaddle.y  > FIELDY) {
            rightPaddle.y -= 50;
        }
    }
    if (keycode == 'KeyS') {
        if(leftPaddle.y  + PADDLEWHEIGHT < FIELDHEIGHT + FIELDY) {
            leftPaddle.y += 50;
        }if (rightPaddle.y + PADDLEWHEIGHT < FIELDHEIGHT + FIELDY) {
            rightPaddle.y += 50;
        }
    }
    keycode = '';

    ball.x += ball.vx;
    ball.y += ball.vy;

    /* draw part */
    leftPaddle.draw();
    rightPaddle.draw();
    ball.draw();
    if (canvas == null || context == null) {
        return ;
    }
    context.fillStyle = 'black';
    context.font = "bold 50px 'ＭＳ 明朝'";
    context.fillText(leftScore.toString() , 360, 50);
    context.fillText( '-', 440, 50);
    context.fillText( rightScore.toString(), 500, 50);

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


    return (
        <div>
            <h2>[PONG GAME]</h2>
            <canvas ref={canvasRef} height={HEIGHT} width={WIDTH}/>
        </div>
    );
}

export default Canvas;
