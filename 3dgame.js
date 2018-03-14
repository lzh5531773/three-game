// let THREE = require('./three/three')
let THREE = require('three.min')
import 'weapp-adapter.js'
import {threeParse} from './parse'

let renderer,
	camera,
	scene,
	light,
	cube = [];  //snake body object
let plane, 
	fo,
	nx = 40, //范围宽
	ny = 40, //范围高
	size = 20,
	start_point_x = 200,
	start_point_y = 190,
	len = 1,
	head_pos_x = 6,   //开始X
	head_pos_y = 32,  //开始Y
	head_for = 2,     //方向
	dir_x = [0, -1, 1, 0],
	dir_y = [1, 0, 0, -1],
	status = -1;  //the status of the game, -1 represents not start
let pauseFlag = true;  //in order to support pause function
let board = []  //The state of game
let the_last_head = head_for;  //The direction of snake
let snake = [] //store snake
let clickCount = 0,
	gameover = false,
	cameraHelper

let fps = 25,
	now,
	then = Date.now(),
	interval = 1000 / fps,
	delta

export default class game3d {
	aRequest = {}

	constructor() {
		this.init()
	}

	init() {
		renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true
		});
		// renderer.setSize(width, height);
		renderer.shadowMapEnabled = true;
		renderer.setClearColor('#feffdd', 1);

		camera = new THREE.PerspectiveCamera(55, 0.5, 1, 10000);
		// camera.position.x = -180;
		// camera.position.y = -480;
		// camera.position.z = 350; //俯视的高度
		camera.position.set(-250, -480, 450);  //3参数越小，离表面越近
		camera.up.x = 0;
		camera.up.y = 0;
		camera.up.z = 1;
		camera.lookAt({x: 250, y: 0, z: -200});

		scene = new THREE.Scene();

		light = new THREE.DirectionalLight('white', 1.0, 0);
		light.position.set(-600, -600, -600);
		scene.add(light);

		plane = this.createPlane(400);
		plane.position.set(-5, -5, -5);
		plane.receiveShadow = true;
		scene.add(plane);

		let pointColor = "#ffffff";
		let directionalLight = new THREE.DirectionalLight(pointColor);
		directionalLight.position.set(0, 0, 1);
		directionalLight.intensity = 0.8;
		scene.add(directionalLight);

		for (let i = 0; i < nx; i++) { //0 = none, 1 = snake body, 2 = food
			board[i] = []
			for (let k = 0; k < ny; k++) {
				board[i][k] = 0;
			}
		}
		fo = this.createCube(10, 10, 50);
		fo.castShadow = true;
		scene.add(fo);
		for (let i = 0; i < len; i++) {
			snake[i] = {}
			snake[i].x = head_pos_x + i * dir_x[3 - head_for];
			snake[i].y = head_pos_y + i * dir_y[3 - head_for];
			cube[i] = this.createCube(12, 12, 12);
			cube[i].position.x = snake[i].x * 10 - start_point_x;
			cube[i].position.y = -snake[i].y * 10 + start_point_y;
			cube[i].castShadow = true;
			scene.add(cube[i]);
			board[snake[i].x][snake[i].y] = 1;
		}
		// Camera helper
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.sqrt(3) * (this.side * this.thickness)), 0, 0);
		cameraHelper = new THREE.Line(geometry);
		scene.add(cameraHelper);
		cameraHelper.visible = false;
		cameraHelper.targetRotation = false;
		cameraHelper.rotation.set(0, 1.362275, 0.694716);

		status = 0;
		this.getFood();
		this.run();

		this.initMesh()

		// pauseFlag = true;
		document.addEventListener('touchstart', this.onTouchStart, false);
		document.addEventListener('resize', this.onWindowResize, false);
		this.onWindowResize()
	}

	createCube(_s1, _s2, _s3) {
		let geometry = new THREE.BoxGeometry(_s1, _s2, _s3 , 1, 1, 1);
		for (let i = 0; i < geometry.faces.length; i += 2) {
			let hex = '#ffe3ae', hex1 = '#ff9632'
			geometry.faces[i].color.setHex(hex);
			geometry.faces[i + 1].color.setHex(hex1);
		}
		let material = new THREE.MeshLambertMaterial({color: '#ffb463'});
		return new THREE.Mesh(geometry, material);
	}

	createPlane(_size) {  //地板
		let geometry = new THREE.PlaneGeometry(_size, _size, 40, 40);
		let material = new THREE.MeshLambertMaterial({color: '#feffdd'});
		return new THREE.Mesh(geometry, material);
	}

	render() {
		if (cameraHelper.targetRotation !== false) {
			cameraHelper.rotation.z += (cameraHelper.targetRotation.z - cameraHelper.rotation.z) / 10;
			cameraHelper.rotation.y += (cameraHelper.targetRotation.y - cameraHelper.rotation.y) / 10;
		}
		for (let i = 0; i < len; ++i) {
			cube[i].position.x = snake[i].x * 10 - start_point_x;
			cube[i].position.y = -snake[i].y * 10 + start_point_y;
			cube[i].position.z = 12;
		}
		// camera.position = cameraHelper.geometry.vertices[1].clone().applyProjection(cameraHelper.matrixWorld);
		//随着线的运动，镜头跟着走
		camera.position.x = snake[0].x * 4 - 480; //修改该值能控制物体角度
		camera.position.y = -snake[0].y * 4 - 300;
		renderer.render(scene, camera);
	}

	getMove() {
		let tx = snake[0].x + dir_x[head_for];
		let ty = snake[0].y + dir_y[head_for];
		if (tx >= 0 && tx < nx && ty >= 0 && ty < ny) {
			if (board[tx][ty] !== 1) {
				if(!pauseFlag){
					the_last_head = head_for;
					snake[len] = {}
					snake[len].x = snake[len - 1].x;
					snake[len].y = snake[len - 1].y;
					cube[len] = this.createCube(12, 12, 12);
					cube[len].position.x = snake[len].x * 10 - start_point_x;
					cube[len].position.y = -snake[len].y * 10 + start_point_y;
					cube[len].castShadow = true;
					scene.add(cube[len]);
					board[tx][ty] = 1;
					len++;
				}
				if (board[tx][ty] === 2) {
					this.getFood();
				}
				for (let i = len - 1; i > 0; i--) {
					snake[i].x = snake[i - 1].x;
					snake[i].y = snake[i - 1].y;
				}
				snake[0].x = tx;
				snake[0].y = ty;
			}
			else {
				if (the_last_head + head_for !== 3) {
					this.gameover()
				}
				else {
					head_for = the_last_head;
				}
			}
		} else {
			this.gameover()
		}
		for (let i = 0; i < nx; i++) {
			for (let k = 0; k < ny; k++) {
				if (board[i][k] == 1)
					board[i][k] = 0;
			}
		}
		for (let i = 0; i < len; i++) {
			board[snake[i].x][snake[i].y] = 1;
		}
	}

	getFood() {
		let tx, ty;
		do {
			tx = Math.ceil(Math.random() * 1000) % nx;
			ty = Math.ceil(Math.random() * 1000) % ny;
		} while (board[tx][ty]);
		board[tx][ty] = 2;
		fo.position.x = tx * 10 - start_point_x;
		fo.position.y = -ty * 10 + start_point_y;
		fo.position.z = 20;
	}

	initMesh() {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				let json = JSON.parse(request.responseText)
				let texturePath = "http://act.cmcmcdn.com/liebao/wechatGame/1.json"
				let object = threeParse(json, texturePath);
				let geometry = object.geometry,
					materials = object.materials
				let mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
				mesh.scale.x = mesh.scale.y = mesh.scale.z = 10;
				mesh.translation = THREE.GeometryUtils.center(geometry);
				scene.add(mesh);
				mesh.position.x = 550;
				mesh.position.y = 630;
				mesh.position.z = 1;  //距离平面高度
				mesh.rotation.x = -1.6;
				mesh.rotation.y = 0.8;
			}
		};
		request.open('get', "http://act.cmcmcdn.com/liebao/wechatGame/1.json");
		request.send();
	}

	run() {
		this.aRequest = window.requestAnimationFrame(this.run.bind(this), canvas)
		now = Date.now();
		delta = now - then;
		if (delta > interval) {
			then = now - (delta % interval);
			if (!pauseFlag){
				this.getMove()
			}
			this.render();
			gameover && window.cancelAnimationFrame(this.aRequest);
		}
	}
	// run() {
	// 	if (!pauseFlag){
	// 		this.getMove()
	// 	}
	// 	this.render();
	// 	this.aRequest = window.requestAnimationFrame(this.run.bind(this), canvas);
	// 	gameover && window.cancelAnimationFrame(this.aRequest);
	// }

	onTouchStart(event) {
		pauseFlag && (pauseFlag = false)
		clickCount%2===0 && (head_for = 2)
		clickCount%2===1 && (head_for = 3)
		clickCount++
	}

	onWindowResize() {
		let width = window.innerWidth || window.document.body.clientWidth;
		let height = window.innerHeight || window.document.body.clientHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	};

	gameover() {
		gameover = true
		wx.showToast({title: "game over!"})
		// location.reload();
	}


}

