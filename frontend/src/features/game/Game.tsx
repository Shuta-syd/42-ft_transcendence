import React from "react";
import './Game.css';
import * as THREE from 'three';
import {Mesh} from "three";

type Key = {

    A: number,
    W: number,
    D: number,
    S: number,

    // add your required key code (ASCII) along with the name here
    // for example:
    SPACE: number,

    isDown: (keyCode: number) => boolean,
    onKeydown: (event: KeyboardEvent) => void,
    onKeyup: (event: KeyboardEvent) => void,
};


function Game() {


    window.addEventListener('keyup', (event) => { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', (event) => { Key.onKeydown(event); }, false);

    const pressed: {[keycode: number]: boolean} = {};

    const Key: Key = {

        A: 65,
        W: 87,
        D: 68,
        S: 83,
        SPACE: 32,

        isDown(keyCode: number): boolean {
            return pressed[keyCode];
        },

        onKeydown (event) {
            pressed[event.keyCode] = true;
        },

        onKeyup (event) {
            delete pressed[event.keyCode];
        }
    };

    // set up the paddle vars
    const paddleWidth = 10;
    const paddleHeight = 30;
    const paddleDepth = 10;
    const paddleQuality = 1;

    const scene = new THREE.Scene();

    const paddle1Material  = new THREE.MeshLambertMaterial(
        {
            color: 0x4BD121
        }
    );
    const paddle2Material  = new THREE.MeshLambertMaterial(
        {
            color: 0x4BD121
        }
    );
// set up paddle 1
    const paddle1: Mesh = new THREE.Mesh(
        new THREE.BoxGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
        paddle1Material);

// add the paddle to the scene
    scene.add(paddle1);

// Set up the second paddle
    const paddle2 = new THREE.Mesh(
        new THREE.BoxGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
        paddle2Material);

// Add the second paddle to the scene
    scene.add(paddle2);

    const fieldWidth = 50;
// set paddles on each side of the table
    paddle1.position.x = -fieldWidth/2 + paddleWidth;
    paddle2.position.x = fieldWidth/2 - paddleWidth;

// lift paddles over playing surface
    paddle1.position.z = paddleDepth;
    paddle2.position.z = paddleDepth;
    // // create a point light
    const pointLight = new THREE.PointLight(0xF8D898);

// set its position
    pointLight.position.x = -1000;
    pointLight.position.y = 0;
    pointLight.position.z = 1000;
    pointLight.intensity = 2.9;
    pointLight.distance = 10000;

// add to the scene
    scene.add(pointLight);

    const WIDTH = 640;
    const HEIGHT = 360;

    const VIEW_ANGLE = 50;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    const camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);


// add the camera to the scene
    scene.add(camera);


// set a default position for the camera
// not doing this somehow messes up shadow rendering
    camera.position.z = 320;

    const setup = () : void => {
        draw();
    }


    // set the scene size

// create a WebGL renderer, camera
// and a scene
    const renderer = new THREE.WebGLRenderer();

// start the renderer
    renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element (the gameCanvas)
    const c: HTMLElement | null = document.getElementById("gameCanvas");
    c?.appendChild(renderer.domElement);


    function draw()
    {
        // draw THREE.JS scene
        renderer.render(scene, camera);

        // loop the draw() function
        requestAnimationFrame(draw);

        // process game logic
    }

// ---------------------------------
// Based on Aerotwist's cool tutorial - http://www.aerotwist.com/tutorials/getting-started-with-three-js/
// ---------------------------------

// set up the sphere vars
// lower 'segment' and 'ring' values will increase performance
    const radius = 5;
    const segments = 6;
    const rings = 6;



// create the sphere's material
    const sphereMaterial =
        new THREE.MeshLambertMaterial(
            {
                color: 0xD43001
            });

// Create a ball with sphere geometry
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(radius,
            segments,
            rings),
        sphereMaterial);

// add the sphere to the scene
    scene.add(ball);

    // create the plane's material
    const planeMaterial =
        new THREE.MeshLambertMaterial(
            {
                color: 0x4BD121
            });

    const fieldHeight = 200;


    const planeQuality = 10;
    const planeHeight = fieldHeight;
    const planeWidth = fieldWidth;
// create the playing surface plane
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(
            planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
            planeHeight,
            planeQuality,
            planeQuality),
        planeMaterial);

    scene.add(plane);

    // ball's x-direction, y-direction and speed per frame
    const ballDirX = 1;
    let ballDirY = 1;
    const ballSpeed = 2;

    // update ball position over time
    ball.position.x += ballDirX * ballSpeed;
    ball.position.y += ballDirY * ballSpeed;

    // limit ball's y-speed to 2x the x-speed
// this is so the ball doesn't speed from left to right super fast
// keeps game playable for humans
    if (ballDirY > ballSpeed * 2)
    {
        ballDirY = ballSpeed * 2;
    }
    else if (ballDirY < -ballSpeed * 2)
    {
        ballDirY = -ballSpeed * 2;
    }

    // if ball goes off the top side (side of table)
    if (ball.position.y <= -fieldHeight/2)
    {
        ballDirY = -ballDirY;
    }

// if ball goes off the bottom side (side of table)
    if (ball.position.y >= fieldHeight/2)
    {
        ballDirY = -ballDirY;
    }

    // move left

    let paddle1DirY = 0;
    const paddle2DirY = 0;
    const paddleSpeed = 3;


    if (Key.isDown(Key.A)) {
        // if paddle is not touching the side of table
        // we move
        if (paddle1.position.y < fieldHeight * 0.45) {
            paddle1DirY = paddleSpeed * 0.5;
        }
        // else we don't move and stretch the paddle
        // to indicate we can't move
        else {
            paddle1DirY = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
      // code to move paddle left
    }

    return (
    <div id='scoreboard'>
        <h1 id='title'>3D PONG</h1>
         <div id="gameCanvas" />
        <h2 id='scores'>0-0</h2>
         <h2 id='winnerBoard'>First to 7, wins!!!!</h2>
         {/* <script src={'./Game.tsx'}></script> */}
        <br/>
    </div>
    );
}

export default Game;
