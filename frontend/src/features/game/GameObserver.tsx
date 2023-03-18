import React, { useRef, useEffect, useState, useCallback } from "react";
import { GameSocket } from "../../contexts/WebsocketContext";
import {User, Game} from '../../types/PrismaType';
import {useGameUser} from "../../hooks/game/useGameuser";
import {fetchObserverGameinfo} from "../../hooks/game/useGameObserver";

const GamePlayer2 = () => {
    // global variables
    let context: CanvasRenderingContext2D | null;
    let canvas:  HTMLCanvasElement | null;
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

    /* Left Paddle macro */
    const LPADDLEX = 5;
    const LPADDLEY = 100;

    /* Right Paddle macro */
    const RPADDLEX = FIELDX + FIELDWIDTH - PADDLEWIDTH;
    const RPADDLEY = 100;

    /* Display macro */

    const WIDTH = 1000;
    const HEIGHT = 900;

    const ball = {
        x: BALLX,
        y: BALLY,
        vx: 2,
        vy: 2,
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
            this.vx = 2;
            this.vy = 2;
        }
    };

    // Player 2
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

    // Player 1
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

    function drawStaticObject() {
        context?.beginPath();
        context?.strokeRect(FIELDX, FIELDY, FIELDWIDTH, FIELDHEIGHT);
        context?.beginPath();
        context?.moveTo(MIDDLEX, FIELDY);
        context?.lineTo(MIDDLEX, FIELDWIDTH - 100);
        context?.stroke();
    }
    type BallPos = {
        x: number;
        y: number;
        name: string | undefined;
    };

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const lastScore = 5;

    function draw() {
        if (!user?.name || !game)
            return;
        context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
        drawStaticObject();

        /* check collision */
        if (ball.x - ball.radius <= leftPaddle.x + PADDLEWIDTH
            && (ball.y <= leftPaddle.y + PADDLEWHEIGHT
                && ball.y >= leftPaddle.y)){
            ball.vx = -ball.vx;
        } else if (ball.x + ball.radius >= rightPaddle.x
            && (ball.y <= rightPaddle.y + PADDLEWHEIGHT
                && ball.y >= rightPaddle.y)) {
            ball.vx = -ball.vx;
        } else if (FIELDHEIGHT + FIELDY < ball.y || ball.y < FIELDY) {
            ball.vy = -ball.vy;
        } else if (ball.x < FIELDX) {
            ball.init();
        } else if (FIELDX + FIELDWIDTH < ball.x) {
            ball.init();
        }

        /* draw part */
        leftPaddle.draw();
        rightPaddle.draw();
        ball.draw();
        if (canvas == null || context == null) {
            return ;
        }

        context.fillStyle = 'black';
        context.font = "bold 50px 'ＭＳ 明朝'";

        context.fillText(game.player1, 200, 50);
        context.fillText(rightScore.toString() , 360, 50);
        context.fillText( '-', 440, 50);
        context.fillText( leftScore.toString(), 500, 50);
        context.fillText( game.player2, 660, 50);
        window.requestAnimationFrame(draw);

        if (rightScore == lastScore) {

            context.fillStyle = 'blue'
            context.font = "bold 50px 'ＭＳ 明朝'";
            context.fillText('Lose!', 200,  200);

            context.fillStyle = 'red'
            context.font = "bold 50px 'ＭＳ 明朝'";
            context.fillText('Win!', 500, 200);
        } else if (leftScore == lastScore) {

            context.fillStyle = 'red'
            context.font = "bold 50px 'ＭＳ 明朝'";
            context.fillText('Win!', 200, 200);

            context.fillStyle = 'blue'
            context.font = "bold 50px 'ＭＳ 明朝'";
            context.fillText('Lose!', 500,  200);

        }
    }


    const [user, setUser] = useState<User>();
    const [game, setGame] = useState<Game>();
    const UserPromises = useGameUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
            GameSocket.emit('JoinRoom', userDto.name);
            const GamePromises = fetchObserverGameinfo(userDto);
            GamePromises.then((gameDto:Game) => {
                setGame(gameDto);
            });
        });
    }, []);

    useEffect(() => {
        canvas = canvasRef.current;
        if (!canvas) {
            return ;
        }
        context = canvas.getContext('2d');
        if (!context) {
            return ;
        }

        window.requestAnimationFrame(draw);
    }, [user, game]);

    type Chat = {
        socketId: string,
        uname: string,
        time: string,
        text: string
        name: string,
    }
    type ChatLog = Array<Chat>


    const [chatLog, setChatLog] = useState<ChatLog>([])
    const [uname, setUname] = useState<string>('')
    const [text, setText] = useState<string>('')


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
            console.log('GAME CHAT受信', chat)
            const newChatLog = [...chatLog]
            newChatLog.push(chat)
            setChatLog(newChatLog)
        });
    }, [chatLog])

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
        GameSocket.emit('chatToServer', { uname, text, time: getNow(), name: user?.name});
        setText('');
    }, [uname, text])

    type PaddleAndRoom = {
        paddleHeight: number;
        name: string;
    };

    GameSocket.on('GameToClient', (Paddley: PaddleAndRoom, socketid: string) => {
        if (Paddley.name === game?.player2)
            rightPaddle.y = Paddley.paddleHeight;
        else if (Paddley.name === game?.player1)
            leftPaddle.y = Paddley.paddleHeight;
    });

    GameSocket.on('BallPosToClient', (BallPos: BallPos, SocketId: string) => {
        ball.x = BallPos.x;
        ball.y = BallPos.y;
    });

    type Score = {
        player1: number
        player2: number
        name: string
    }
    GameSocket.on('ScoreToClient', (Score: Score, SocketId: string) => {
        rightScore = Score.player1;
        leftScore = Score.player2;
    });

    return (
        <div>
            <h1>[PONG GAME]</h1>
            <h1>[Observer]</h1>
            <canvas ref={canvasRef} height={HEIGHT} width={WIDTH}/>
            <div>
                <input type="text" value={uname} onChange={(event) => { setUname(event.target.value) }} />
            </div>sss
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
        </div>
    );
}

export default GamePlayer2;
