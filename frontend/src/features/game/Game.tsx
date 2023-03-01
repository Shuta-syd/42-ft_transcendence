import React, { useRef, useEffect, useState, useCallback } from "react";
import useQueryUserGame from "../../hooks/game/useQueryGame";
import { User } from "../../types/PrismaType";
import { GameSocket } from "../../contexts/WebsocketContext";


// global variables
let context: CanvasRenderingContext2D | null;
let canvas:  HTMLCanvasElement | null;
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
const MIDDLEX = 450;
// const MIDDLEY = 450;

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
    color: "black",
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
};

// const [LeftPaddlePos, setLeftPaddlePos] = useState<number>(LPADDLEY);

const leftPaddle = {
    x: LPADDLEX,
    // get y() {
    //     return LeftPaddlePos;
    // },
    // set y(value) {
    //     setLeftPaddlePos(value);
    // },
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

// eslint-disable-next-line react-hooks/rules-of-hooks
// const [LeftPaddlePos, setLeftPaddlePos] = useState<number>(LPADDLEY);

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
    context?.moveTo(MIDDLEX, FIELDY);
    context?.lineTo(MIDDLEX, FIELDWIDTH - 100);
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
    if (keycode === 'KeyW') {
        // if(leftPaddle.y  > FIELDY) {
        //     leftPaddle.y -= 50;
        // }
        if (rightPaddle.y  > FIELDY) {
            rightPaddle.y -= 50;
            GameSocket.emit('GameToServer', rightPaddle.y);
        }
    }
    if (keycode === 'KeyS') {
        // if(leftPaddle.y  + PADDLEWHEIGHT < FIELDHEIGHT + FIELDY) {
        //     leftPaddle.y += 50;
        // }
        if (rightPaddle.y + PADDLEWHEIGHT < FIELDHEIGHT + FIELDY) {
            rightPaddle.y += 50;
            GameSocket.emit('GameToServer', rightPaddle.y);
        }
    }

    // leftPaddle.y = LeftPaddlePos;



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
    window.requestAnimationFrame(draw);
}

// type Game = {
//     paddleTopleft: number;
// };
//
// type GameLog = Array<Game>

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
        window.requestAnimationFrame(draw);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);


        GameSocket.on('GameToClient', (leftPaddley: number) => {
            console.log('---')
            console.log('leftPaddley', leftPaddley)
            console.log('leftPaddle.y', leftPaddle.y)
            console.log('---')
            leftPaddle.y = leftPaddley;
        });

    }, []);

    /* player1 */
    const [name1, setName] = useState('');
    const UserPromise1 = useQueryUserGame('1');
    useEffect(() => {
        UserPromise1.then((user: User) => {
            setName(user.name);
        });
    }, [UserPromise1]);

    /* player2 */
    const [name2, setName2] = useState('');
    const UserPromise2 = useQueryUserGame('2');
    useEffect(() => {
        UserPromise2.then((user: User) => {
            setName2(user.name);
        });
    }, [UserPromise2]);

    type Chat = {
        socketId: string
        uname: string
        time: string
        text: string
    }
    type ChatLog = Array<Chat>
        const [chatLog, setChatLog] = useState<ChatLog>([])
        const [uname, setUname] = useState<string>('')
        const [text, setText] = useState<string>('')
    // useEffect(() => {
    //     setPaddlePos(rightPaddle.y);
    // }, [rightPaddle.y]);

    useEffect(() => {
        GameSocket.on('connect', () => {
            console.log('接続ID : ', GameSocket.id)
        })

        return () => {
            console.log('切断')
            GameSocket.disconnect()
        }
    }, [])

    useEffect(() => {
        GameSocket.on('chatToClient', (chat: Chat) => {
            console.log('chat受信', chat)
            const newChatLog = [...chatLog]
            newChatLog.push(chat)
            setChatLog(newChatLog)
        });
    }, [chatLog])

/*
        GameSocket.on('GameToClient', (game: number) => {
            console.log('chat receive game info', game)
            leftPaddle.y = game;
        });
*/

    const getNow = useCallback((): string => {
        const datetime = new Date();
        return `${datetime.getFullYear()}/${datetime.getMonth() + 1}/${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`
    }, [])

        useEffect(() => {
    }, [rightPaddle.y]);

    const sendChat = useCallback((): void => {
        if (!uname) {
            alert('ユーザー名を入れてください。')
            return;
        }
        console.log('送信')
        GameSocket.emit('chatToServer', { uname, text, time: getNow() });
        setText('');
    }, [uname, text])


    return (
        <div>
            <h1>[PONG GAME]</h1>
            <h2>player1:{name1}</h2>
            <h2>
                player2:{name2}
            </h2>
            <canvas ref={canvasRef} height={HEIGHT} width={WIDTH}/>
            <div>ユーザー名</div>
            <div>
                <input type="text" value={uname} onChange={(event) => { setUname(event.target.value) }} />
            </div>
            <br />
            <section style={{ backgroundColor: 'rgba(30,130,80,0.3)', height: '50vh', overflow: 'scroll' }}>
                <h2>GAME CHAT</h2>
                <hr />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                    {
                        chatLog.map((chat, index) => (
                            <li key={index} style={{ margin: uname === chat.uname ? '0 15px 0 auto ' : '0 auto 0 15px' }}>
                                <div><small>{chat.time} [{chat.socketId}]</small></div>
                                <div>【{chat.uname}】 : {chat.text}</div>
                            </li>
                        ))
                    }
                </ul>
            </section>
            <br />
            <div>
                送信内容
            </div>
            <div>
                <input type="text" value={text} onChange={(event) => { setText(event.target.value) }} />
            </div>
            <br />
            <div>
                <button onClick={sendChat}> send </button>
            </div>
            <br />
        </div>
    );
}

export default Canvas;
