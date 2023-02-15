import React, { useRef, useEffect } from "react";

// const Game = () => {
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//
//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (canvas == null) {
//             return ;
//         }
//         const ctx = canvas.getContext("2d");
//         if (ctx == null) {
//             return ;
//         }
//         let x = canvas.width / 2;
//         let y = canvas.height - 30;
//         let dx = 2;
//         let dy = -2;
//         const ballRadius = 10;
//
//         const drawBall = () => {
//             ctx.beginPath();
//             ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
//             ctx.fillStyle = "#0095DD";
//             ctx.fill();
//             ctx.closePath();
//         };
//
//         const draw = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             drawBall();
//
//             if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
//                 dx = -dx;
//             }
//             if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
//                 dy = -dy;
//             }
//
//             x += dx;
//             y += dy;
//         };
//
//         const interval = setInterval(draw, 10);
//     }, []);
//
//     return <canvas ref={canvasRef} width={400} height={400} />;
// };


function pong() {

}


function draeStaticObjsct(context:  CanvasRenderingContext2D) {
    // create a field of game
    context.beginPath();
    context.strokeRect(5, 5, 505, 305);
    context.stroke();

    // center line
    context.beginPath();
    context.moveTo(255, 5);
    context.lineTo(255, 305);
    context.stroke();
}



function drawDynamicOnjsct(context:  CanvasRenderingContext2D) {

    // for (;;) {
    //     statement
    //
    // }
}


const Canvas = () => {


    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return ;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            return ;
        }

        // drawing smile face
        // context.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
        // context.moveTo(110, 75);
        // context.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
        // context.moveTo(65, 65);
        // context.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
        // context.moveTo(95, 65);
        // context.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
        // context.stroke();

        draeStaticObjsct(context);
        drawDynamicOnjsct(context);




    }, []);


    return <canvas ref={canvasRef} height="1000" width="1000"/>
}

export default Canvas;
