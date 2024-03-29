import React, {useContext, useEffect, useRef} from 'react';
import {Grid} from '@mui/material';
import {Socket} from 'socket.io-client';
import {useNavigate} from 'react-router-dom';
import {User} from '../../types/PrismaType';
import {RootWebsocketContext} from '../../contexts/WebsocketContext';

const GamePlayer2 = (props: { socket: Socket, user: User }) => {
    const {socket, user} = props;
    const rootSocket: Socket = useContext(RootWebsocketContext);

    // global variables
    let context: CanvasRenderingContext2D | null;
    let keycode = '';
    let canvas: HTMLCanvasElement | null;
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
        color: 'black',
        draw() {
            context?.beginPath(); // 自身を書く関数をpropertyのなかに格納
            context?.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context?.closePath();
            context?.fillStyle && (context.fillStyle = this.color);
            context?.fill();
        },
        init() {
            this.x = BALLX;
            this.y = BALLY;
            this.vx = 2;
            this.vy = 2;
        },
    };

    const leftPaddle = {
        x: LPADDLEX,
        y: LPADDLEY,
        color: 'black',
        draw() {
            context?.beginPath();
            context?.rect(this.x, this.y, PADDLEWIDTH, PADDLEWHEIGHT);
            context?.closePath();
            context?.fillStyle && (context.fillStyle = this.color);
            context?.fill();
        },
    };

    const rightPaddle = {
        x: RPADDLEX,
        y: RPADDLEY,
        color: 'black',
        draw() {
            context?.beginPath();
            context?.rect(this.x, this.y, PADDLEWIDTH, PADDLEWHEIGHT);
            context?.closePath();
            context?.fillStyle && (context.fillStyle = this.color);
            context?.fill();
        },
    };

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
        playerName: string;
    };

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const lastScore = 5;

    const history = useNavigate();

    function draw() {
        if (!user?.name) return;
        context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
        drawStaticObject();

        /* check collision */
        if (
            ball.x - ball.radius <= leftPaddle.x + PADDLEWIDTH &&
            ball.y <= leftPaddle.y + PADDLEWHEIGHT &&
            ball.y >= leftPaddle.y
        ) {
            ball.vx = -ball.vx;
        } else if (
            ball.x + ball.radius >= rightPaddle.x &&
            ball.y <= rightPaddle.y + PADDLEWHEIGHT &&
            ball.y >= rightPaddle.y
        ) {
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
            if (rightPaddle.y > FIELDY) {
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
            playerName: user.name,
        };
        socket.emit('GameToServer', paddleAndRoom);

        /* draw part */
        leftPaddle.draw();
        rightPaddle.draw();
        ball.draw();
        if (canvas == null || context == null) {
            return;
        }
        const handleInGameStatusDelete = () => {
            rootSocket.emit("in_game_status_delete");

            // onlineに戻るイベントを送る

            setTimeout(() => {
                history("/game-rewrite");
            }, 3 * 1000);
        };

        context.fillStyle = 'black';
        context.font = "bold 50px 'ＭＳ 明朝'";
        context.fillText(leftScore.toString(), 360, 50);
        context.fillText('-', 440, 50);
        context.fillText(rightScore.toString(), 500, 50);
        if (leftScore < lastScore && rightScore < lastScore) {
            window.requestAnimationFrame(draw);
        } else if (leftScore === lastScore) {
            context.fillStyle = 'blue';
            context.font = "bold 50px 'ＭＳ 明朝'";
            context.fillText('You Lose!', 360, 300);
            context.fillStyle = 'black';
            context.fillText('5秒後にgameページに戻ります.', 100, 600);
            handleInGameStatusDelete();
        } else {
            context.fillStyle = 'red';
            context.font = "bold 50px 'ＭＳ 明朝'";
            context.fillText('You Win!', 360, 300);
            context.fillStyle = 'black';
            context.fillText('5秒後にgameページに戻ります.', 100, 600);
            handleInGameStatusDelete();
        }
    }

    useEffect(() => {
        socket.emit('JoinRoom', {name: user.name});
        rootSocket.emit('in_game_status_check');
    }, [rootSocket])

    useEffect(() => {
        const handleKeyUp = (): void => {
            keycode = '';
        };
        const handleKeyDown = (e: KeyboardEvent): void => {
            keycode = e.code;
        };
        canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        context = canvas.getContext('2d');
        if (!context) {
            return;
        }
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);
        window.requestAnimationFrame(draw);
    }, [user]);

    type PaddleAndRoom = {
        paddleHeight: number;
        playerName: string;
    };

    socket.on('GameToClient', (leftPaddley: PaddleAndRoom, socketid: string) => {
        if (socket.id !== socketid) leftPaddle.y = leftPaddley.paddleHeight;
    });
    socket.on('BallPosToClient', (BallPos: BallPos, SocketId: string) => {
        ball.x = BallPos.x;
        ball.y = BallPos.y;
    });

    socket.on('Ping', (dto: { name: string }, SocketId: string) => {
        socket.emit('Pong', {name: user.name});
    });

    type Score = {
        player1: number;
        player2: number;
        playName: string;
    };

    socket.on('ExitGame', () => {
        alert('異常終了しました。/game-rewriteに戻ります。');
        window.location.href = '/game-rewrite';
    });

    socket.on('ScoreToClient', (Score: Score, SocketId: string) => {
        leftScore = Score.player1;
        rightScore = Score.player2;
    });

    socket.on('GameOut', () => {
        rootSocket.emit('in_game_status_delete');
    });

    return (
        <div
            style={{
                backgroundColor: '#EDF0F4',
                minHeight: '100vh',
            }}
        >
            <h1>[PONG GAME]</h1>
            <Grid container>
                <h1>Player2: {user?.name}</h1>
                <canvas ref={canvasRef} height={HEIGHT} width={WIDTH}/>
            </Grid>
        </div>
    );
};

export default GamePlayer2;
