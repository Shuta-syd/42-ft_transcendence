import React, { useContext, useEffect, useRef } from 'react';
import { Button, Grid } from '@mui/material';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/PrismaType';
import { RootWebsocketContext } from '../../contexts/WebsocketContext';

const GamePlayer1 = (props: { socket: Socket, user: User }) => {
  const { socket, user } = props;
  const rootSocket: Socket = useContext(RootWebsocketContext);
  const [roomId, setRoomId] = React.useState<string>('');



  // global variables
  let context: CanvasRenderingContext2D | null;
  let canvas: HTMLCanvasElement | null;
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
  const MIDDLEX = 455;

  /* Left Paddle macro */
  const LPADDLEX = 5;
  const LPADDLEY = 100;

  /* Right Paddle macro */
  const RPADDLEX = FIELDX + FIELDWIDTH - PADDLEWIDTH;
  const RPADDLEY = 100;

  /* Display macro */

  const WIDTH = 1000;
  const HEIGHT = 900;

  /* start flag */
  let isRecievePong = false;
  let ballDefaultSpeed = 2;

  const ball = {
    x: BALLX,
    y: BALLY,
    vx: ballDefaultSpeed,
    vy: ballDefaultSpeed,
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
      this.vx = ballDefaultSpeed;
      this.vy = ballDefaultSpeed;
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
  const history = useNavigate();

  const lastScore = 5;
  let p2name: string;

  //---------------------------------------------------------------------------------
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
    } else if (
        FIELDHEIGHT + FIELDY < ball.y + ball.radius ||
        ball.y - ball.radius < FIELDY
    ) {
      ball.vy = -ball.vy;
    } else if (ball.x < FIELDX) {
      rightScore += 1;
      ball.init();
    } else if (FIELDX + FIELDWIDTH < ball.x) {
      leftScore += 1;
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

    const paddleAndRoom = {
      paddleHeight: rightPaddle.y,
      playerName: user.name,
    };
    socket.emit('GameToServer', paddleAndRoom);
    keycode = '';

    /* send ball pos to server */
    if (isRecievePong) {
      ball.x += ball.vx;
      ball.y += ball.vy;
    }

    const BallPos: BallPos = {
      x: ball.x,
      y: ball.y,
      playerName: user?.name.toString(),
    };

    const vectorMiddleTo1X = BallPos.x - MIDDLEX;
    const reverseVectorMiddleTo1X = -vectorMiddleTo1X;
    BallPos.x = MIDDLEX + reverseVectorMiddleTo1X;
    socket.emit('BallPosToServer', BallPos);

    /* draw part */
    leftPaddle.draw();
    rightPaddle.draw();
    ball.draw();
    if (canvas == null || context == null) {
      return;
    }
    type Scoredto = {
      player1: number;
      player2: number;
      playerName: string;
    };
    const score: Scoredto = {
      player1: rightScore,
      player2: leftScore,
      playerName: user.name,
    };
    socket.emit('ScoreToServer', score);

    context.fillStyle = 'black';
    context.font = "bold 50px 'ＭＳ 明朝'";
    context.fillText(leftScore.toString(), 360, 50);
    context.fillText('-', 440, 50);
    context.fillText(rightScore.toString(), 500, 50);

    const handleInGameStatusDelete = () => {
      rootSocket.emit("in_game_status_delete");

      setTimeout(() => {
        history("/game");
      }, 3 * 1000);
    };
  //---------------------------------------------------------------------

    if (leftScore < lastScore && rightScore < lastScore) {
      window.requestAnimationFrame(draw);
    } else if (leftScore === lastScore) {
      /*
            hit api of "http://localhost:8080/match"ん
            ここでmatchの結果が決まるのでそのタイミングでhistoryとしてrequestを送信する
             */
      const matchData = {
        player1: user.name,
        player2: p2name,
        winner_id: 2,
        roomId,
      };
      axios
          .post('http://localhost:8080/match', matchData)
          .catch(
              (error) => alert('エラーが起きました。ページをリロードしてください。')
          );
      context.fillStyle = 'blue';
      context.font = "bold 50px 'ＭＳ 明朝'";
      context.fillText('You Lose!', 360, 300);
      context.fillStyle = 'black';
      context.fillText('5秒後にgameページに戻ります.', 100, 600);
      socket.emit('TerminateGame', { name: user.name });
      if (window.location.pathname === '/game/player1') {
        handleInGameStatusDelete();
      }
    } else if (rightScore === lastScore) {
      const matchData = {
        player1: user.name,
        player2: p2name,
        winner_id: 1,
        roomId,
      };
      axios
          .post('http://localhost:8080/match', matchData)
          .catch((error) => alert('エラーが起きました。ページをリロードしてください。'));
      context.fillStyle = 'red';
      context.font = "bold 50px 'ＭＳ 明朝'";
      context.fillText('You Win!', 360, 300);
      context.fillStyle = 'black';
      context.fillText('5秒後にgameページに戻ります.', 100, 600);
      socket.emit('TerminateGame', { name: user.name });
      if (window.location.pathname === '/game/player1') {
        handleInGameStatusDelete();
      }
    }
  }

  useEffect(() => {
    socket.emit('JoinRoom', { name: user.name });
    socket.emit('Ping', { name: user.name });
    rootSocket.emit('in_game_status_check');
  }, []);

  function pageReload() {
    window.location.reload();
  }

  const sendPing = setInterval(() => {
    if (user.name) {
      socket.emit('Ping', { name: user.name });
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(sendPing);
  }, 10000000);

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
    window.requestAnimationFrame(draw);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);
  }, [user]);

  useEffect(() => {}, [rightPaddle.y]);

  type PaddleAndRoom = {
    paddleHeight: number;
    playerName: string;
  };

  socket.on('ExitGame', () => {
    window.location.href = '/game-rewrite';
  });

  socket.on('GameToClient', (leftPaddley: PaddleAndRoom, socketid: string) => {
    if (socket.id !== socketid) leftPaddle.y = leftPaddley.paddleHeight;
  });

  socket.on('Pong', (dto: { name: string}, socketid: string, roomIdDto: string) => {
    isRecievePong = true;
    p2name = dto.name;
    setRoomId(roomIdDto);
  });

  const BallSpeedUp = () => {
    ballDefaultSpeed += 0.5;
  };
  const BallSpeedDown = () => {
    ballDefaultSpeed -= 0.5;
  };

  const LevelButton = () => (
      <div>
        <Button
            variant={'contained'}
            size={'large'}
            color={'success'}
            onClick={(e) => {
              BallSpeedUp();
            }}
        >
          LEVEL UP
        </Button>
        <Button
            variant={'contained'}
            size={'large'}
            color={'error'}
            onClick={(e) => {
              BallSpeedDown();
            }}
        >
          LEVEL DOWN
        </Button>
      </div>
  );

  return (
      <div
          style={{
            backgroundColor: '#EDF0F4',
            minHeight: '100vh',
          }}
      >
        <h1>[PONG GAME]</h1>
        <Grid container>
          <h1>Player1: {user?.name}</h1>
          <Button
              variant="outlined"
              color="primary"
              size="medium"
              onClick={pageReload}
          >
            🦺RECONNECT🦺
          </Button>
          <canvas ref={canvasRef} height={HEIGHT} width={WIDTH} />
          <LevelButton />
        </Grid>
      </div>
  );
};

export default GamePlayer1;
