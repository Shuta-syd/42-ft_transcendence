import React, { useRef, useEffect, useState, useCallback } from "react";
import {Button} from "@mui/material";
import { GameSocket } from "../../contexts/WebsocketContext";
import {User} from "../../types/PrismaType";
import {useGameUser} from "../../hooks/game/useGameuser";

const GamePlayer2 = () => {
    // global variables
    let context: CanvasRenderingContext2D | null;
    let keycode = '';
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
        if (!user?.name)
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

        /* check keycode */
        if (keycode === 'KeyW') {
            if (rightPaddle.y  > FIELDY) {
                rightPaddle.y -= 50;
            }
        }
        if (keycode === 'KeyS') {
            if (rightPaddle.y + PADDLEWHEIGHT < FIELDHEIGHT + FIELDY) {
                rightPaddle.y += 50;
            }
        }
        keycode = '';
        const paddleAndRoom = {
            paddleHeight: rightPaddle.y,
            name: user?.name.toString(),
        }
        GameSocket.emit('GameToServer', paddleAndRoom);
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
        if (leftScore < lastScore && rightScore < lastScore) {
            window.requestAnimationFrame(draw);
        } else if (leftScore === lastScore) {
            context.fillStyle = 'blue'
            context.font = "bold 50px 'ＭＳ 明朝'";
            context.fillText('You Lose!', 360,  300);
            context.fillStyle = 'black'
            context.fillText('5秒後にgameページに戻ります.', 100,  600);
            if (window.location.pathname === "/game/player2") {
                setTimeout(() => {
                    window.location.href = "/game";
                }, 3 * 1000);
            }
        } else {
            context.fillStyle = 'red'
            context.font = "bold 50px 'ＭＳ 明朝'";
            context.fillText('You Win!', 360, 300);
            context.fillStyle = 'black'
            context.fillText('5秒後にgameページに戻ります.', 100,  600);
            if (window.location.pathname === "/game/player2") {
                setTimeout(() => {
                    window.location.href = "/game";
                }, 3 * 1000);
            }
        }
    }

    const [user, setUser] = useState<User>();
    const UserPromises = useGameUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
            GameSocket.emit('JoinRoom', userDto.name);
        });
    }, []);

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
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);
        window.requestAnimationFrame(draw);
    }, [user]);

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

    GameSocket.on('GameToClient', (leftPaddley: PaddleAndRoom, socketid: string) => {
        if (GameSocket.id !== socketid)
            leftPaddle.y = leftPaddley.paddleHeight;
    });
    GameSocket.on('BallPosToClient', (BallPos: BallPos, SocketId: string) => {
        ball.x = BallPos.x;
        ball.y = BallPos.y;
    });

    GameSocket.on('Ping', (name: string, SocketId: string) => {
        console.log(name, SocketId, 'Ping');
        GameSocket.emit('Pong', user?.name);
    });

    type Score = {
        player1: number
        player2: number
        name: string
    }

    function pageReload() {
        window.location.reload();
    }

    GameSocket.on('ScoreToClient', (Score: Score, SocketId: string) => {
        leftScore = Score.player1;
        rightScore = Score.player2;
    });

    return (
        <div>
            <h1>[PONG GAME]</h1>
            <h1>Player2: {user?.name}</h1>
            <Button
                variant="outlined"
                size="large"
                color="primary"
                onClick={pageReload}
            >
                🦺RECONNECT🦺
            </Button>
            <canvas ref={canvasRef} height={HEIGHT} width={WIDTH}/>
            <div>
                <input type="text" value={uname} onChange={(event) => { setUname(event.target.value) }} />
            </div>
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
