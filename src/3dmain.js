'use strict'

import '../libs/weapp-adapter'
import { audio, submitRequest } from '../utils/index'
import threeDep from '../utils/parse'
import model from '../models/index'
import config from '../config/index'
import { __TWEEN } from '../libs/tween'
const THREE = require('../libs/three.min')

const vm = {
	innerAudioContext: {},
	scene: {},
	renderer: {},
	camera: {},
	aRequest: {},
	cube: [],
	len: 1,
	nx: 40,                     //范围宽
	ny: 40,                     //范围高
	snake: [],
	snakeVolumn: 14,
	startX: 0,
	startY: 0,
	headX: 0,                   //开始X
	headY: 0,                  //开始Y
	headForward: 2,             //方向
	pauseFlag: true,
	directionX: [0, -1, 1, 0],
	directionY: [1, 0, 0, -1],
	clickCount: 0,
	end: false,
	models: [],
	snakeSpeed: 5,
	fps: 60,
	now: '',
	then: Date.now(),
	delta: '',
	getFoodCount: 0,
	blockAnimateIndex: 0,
	initCubePosition: {},
	initGeometry: {},
	initMaterial: {}
}

let plane, planeSize = 400 //地板范围

export default class gameDanceLine {
	calval = {
		foodMesh: null,
		sortMeshs: null
	}

	constructor() {
		this.init()
		this.run()
		//调整屏幕
		this.onWindowResize()
	}

	init() {
		//方块常量
		vm.geometry = new THREE.BoxGeometry(vm.snakeVolumn, vm.snakeVolumn, vm.snakeVolumn / 1.3)
		vm.material = new THREE.MeshLambertMaterial({color: '#ffb463'})
		//渲染
		this.initRender()
		vm.scene = new THREE.Scene()
		//素材
		this.initMaterials()
		//音乐
		this.initAudio()
		//相机
		this.initCamera()
		//灯源
		this.initLight()
		//事件
		this.initEvents()
		//运动方块块
		this.initSnake()
		//初始化开始位置
		this.setInitCubePosition({x: vm.cube[0].position.x, y: vm.cube[0].position.y})
		//板块
		// plane = this.initPlane(planeSize);
		// plane.position.set(-5, -5, -5);
		// plane.receiveShadow = true;
		// vm.scene.add(plane);
	}

	initRender() {
		vm.renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true
		})
		vm.renderer.shadowMapEnabled = true
		vm.renderer.setClearColor('#f0edc8', 1)
	}

	initCamera() {
		// vm.camera = new THREE.PerspectiveCamera(20, 0.5, 1, 12000)
		// vm.camera.position.set(-1675, -1680, 3050);  //3 俯视的高度
		vm.camera = new THREE.PerspectiveCamera(40, 0.5, 1, 1500)  //far: 加载的范围，与性能有关
		vm.camera.position.set(-375, -380, 600)
		vm.camera.up.x = 0
		vm.camera.up.y = 0
		vm.camera.up.z = 1
		vm.camera.lookAt(vm.scene.position)
		// vm.camera.lookAt({x: 12830, y: 12800, z: -14000})
		// vm.camera.lookAt({x: 2130, y: 2100, z: -2900})
		// vm.camera.lookAt({x: 2130, y: 2200, z: -2900})
	}

	initLight() {
		const light = new THREE.DirectionalLight('#fff', 1)  //平行光
		light.position.set(-10, -6, -6)  //光源方向
		vm.scene.add(light)
		const directionalLight = new THREE.DirectionalLight("#fff")
		directionalLight.position.set(0, 0, 1)
		directionalLight.shadowMapHeight = 2048
		directionalLight.shadowMapWidth = 2048
		vm.scene.add(directionalLight)
	}

	initCube() {
		const hex = ['#ffe3ae', '#ff9632'];
		for (let i = 0; i < vm.geometry.faces.length; i += 2) {
			vm.geometry.faces[i].color.setHex(hex[0])
			vm.geometry.faces[i + 1].color.setHex(hex[1])
		}
		const mesh = new THREE.Mesh(vm.geometry, vm.material)
		mesh.updateMatrix()
		return mesh
	}

	initPlane(_size) {  //地板
		let geometry = new THREE.PlaneBufferGeometry(_size, _size, vm.nx, vm.ny)
		let material = new THREE.MeshLambertMaterial({color: '#ffecb4'})
		return new THREE.Mesh(geometry, material)
	}

	initMaterials() {
		model.materials.forEach((mate) => {
			submitRequest({url: mate.url}).then((res) =>{
				if(res) {
					const json = res,
						url = mate.url,
						blocks = mate.blocks,
						object = threeDep.threeParse(json, url),
						materials = mate.material ? mate.material : object.materials,
						param = {
							geometry: object.geometry,
							material :new THREE.MeshLambertMaterial(materials),
							scale: mate.scale,
							name: mate.name,
							opacity: mate.opacity
						}
					if (blocks instanceof Array) {
						blocks.forEach((block) => {
							param.block = block
							this.initMesh(param)
						})
					} else {
						param.block = blocks
						this.initMesh(param)
					}
				}
			}).catch((err) => {
				console.log('error:', err)
			})
		})
	}

	initAudio() {
		vm.innerAudioContext = wx.createInnerAudioContext()
		vm.innerAudioContext.src = config.musicSrc
	}

	initMesh({block, geometry, material, scale, name, opacity}) {
		const mesh = new THREE.Mesh(geometry, material)
		mesh.name = name
		// mesh.opacity = opacity
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale
		mesh.translation = geometry.center()
		mesh.position.set(block.x, block.y, block.z)
		mesh.rotation.set(block.rotationX, block.rotationY, block.rotationZ)
		mesh.animated = false
		mesh.msort = block.msort || 0
		mesh.direction = block.direction || 0
		mesh.updateMatrix()
		vm.scene.add(mesh)
		vm.models.push(mesh)
	}

	initSnake() {
		if(!vm.len) return
		const duration = 0.5,
			delay = 1
		for (let i = 0; i < vm.len; i++) {
			vm.snake[i] = {}
			vm.snake[i].x = vm.headX + i * vm.directionX[3 - vm.headForward]
			vm.snake[i].y = vm.headY + i * vm.directionY[3 - vm.headForward]
			vm.cube[i] = this.initCube()
			vm.cube[i].position.x = vm.snake[i].x * vm.snakeSpeed - vm.startX
			vm.cube[i].position.y = -vm.snake[i].y * vm.snakeSpeed + vm.startY
			vm.cube[i].visible = false
			vm.scene.add(vm.cube[i])
			new __TWEEN.Tween({scale: 0, rotation: 0, mesh: vm.cube[0]})
				.to({
					scale: 1,
					rotation: 0.5* Math.PI
				}, duration)
				.delay(delay)
				.onUpdate(function() {
					this.mesh.scale.z = this.scale
					this.mesh.rotation.z = this.rotation
				})
				.onStart(function () {
					this.mesh.visible = true;
				})
				.start()
		}
	}

	initCalVals() {
		if(vm.models.length>0 && !this.calval.foodMesh && !this.calval.sortMeshs) {
			this.calval.foodMesh = vm.models.find(model => model.name === 'FOOD')
			this.calval.sortMeshs = vm.models.filter(model => model.msort !== 0)
			this.calval.sortMeshs.sort((a, b) => {
				if(a.msort > b.msort) return 1
				else if(a.msort < b.msort) return -1
			})
		}
	}

	initEvents() {
		document.addEventListener('touchstart', this.onTouchStart, false)
		document.addEventListener('resize', this.onWindowResize, false)
	}

	removeEvents() {
		document.removeEventListener('touchstart', this.onTouchStart, false)
		document.removeEventListener('resize', this.onWindowResize, false)
	}

	doRender() {
		//运动的位置随速度变化
		if (vm.pauseFlag) {
			vm.cube[0].position.x = vm.snake[0].x * vm.snakeSpeed - vm.startX
			vm.cube[0].position.y = -vm.snake[0].y * vm.snakeSpeed + vm.startY
			vm.cube[0].position.z = 0
		} else {
			vm.cube[0].geometry.parameters.width = ++vm.cube[0].geometry.parameters.width
		}
		for (let i = 0; i < vm.len; ++i) {
			vm.cube[i].position.x = vm.snake[i].x * vm.snakeSpeed - vm.startX
			vm.cube[i].position.y = -vm.snake[i].y * vm.snakeSpeed + vm.startY
			vm.cube[i].position.z = 0
		}
		//相机随着线的运动，镜头跟着走
		const offest = 400,
			zAsc = 0.08 //夹角增量
		vm.camera.position.x = vm.cube[0].position.x - offest
		vm.camera.position.y = vm.cube[0].position.y - offest
		!vm.pauseFlag && (vm.camera.position.z += zAsc)
		vm.renderer.render(vm.scene, vm.camera)

		//初始化Mesh分类的数组
		this.initCalVals()
	}

	getMove() {
		const tx = vm.snake[0].x + vm.directionX[vm.headForward],
			ty = vm.snake[0].y + vm.directionY[vm.headForward]
		if (!vm.pauseFlag) {
			vm.snake[vm.len] = {}
			vm.snake[vm.len].x = vm.snake[vm.len - 1].x
			vm.snake[vm.len].y = vm.snake[vm.len - 1].y
			vm.cube[vm.len] = this.initCube()
			vm.cube[vm.len].name = 'SNAKE_CUBE_'+vm.len
			vm.scene.add(vm.cube[vm.len])
			vm.len++
		}
		for (let i = vm.len - 1; i > 0; i--) {
			vm.snake[i].x = vm.snake[i - 1].x
			vm.snake[i].y = vm.snake[i - 1].y
		}
		// console.log(vm.cube[0].geometry.parameters.width)
		vm.snake[0].x = tx
		vm.snake[0].y = ty

		//销毁超出屏幕的对象
		this.release()
	}

	run() {
		vm.aRequest = window.requestAnimationFrame(this.run.bind(this), canvas)
		vm.now = Date.now()
		vm.delta = vm.now - vm.then
		if (vm.delta > 1000 / vm.fps) {
			vm.then = vm.now - (vm.delta % 1000 / vm.fps)
			if (!vm.pauseFlag){
				this.getMove()
				this.checkCollision()
			}
			this.doRender()
			this.animates()
			vm.end && window.cancelAnimationFrame(vm.aRequest)
			__TWEEN.update()
		}
		// if (!vm.pauseFlag) {
		// 	this.getMove()
		// 	//检查碰撞
		// 	this.checkCollision()
		// }
		// this.doRender()
		// this.animates()
		// vm.end && window.cancelAnimationFrame(vm.aRequest)
		// __TWEEN.update()
	}

	changeFoodPosition(food) {
		const position = model.foodOffests[++vm.getFoodCount]
		!position && this.destory(food)
		position && food.position.set(position.x, position.y, position.z)
	}

	checkCollision() {
		const movingCube = vm.cube[0],
			collisions = vm.models.filter(model => !~['LEFT_BARRICADE', 'RIGHT_BARRICADE', 'BARRICADE'].indexOf(model.name))
		let originPoint = movingCube.position.clone()
		for (let vertexIndex = 0; vertexIndex < movingCube.geometry.vertices.length; vertexIndex++) {
			// 顶点原始坐标
			let localVertex = movingCube.geometry.vertices[vertexIndex].clone()
			// 顶点经过变换后的坐标
			let globalVertex = localVertex.applyMatrix4(movingCube.matrix)
			let directionVector = globalVertex.sub(movingCube.position)
			let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize())
			let collisionResults = ray.intersectObjects(collisions)
			if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
				if (collisionResults[0].object.name === 'FOOD') {
					this.changeFoodPosition(collisionResults[0].object)
				} else {
					this.gameover('游戏结束！')
					break
				}
			}
		}
	}

	gameover(title) {
		vm.end = true
		wx.showToast({
			title: title
		})
		this.removeEvents()
		setTimeout(() => {
			// location.reload()
			audio(2, vm.innerAudioContext)
		}, 1000)
	}

	animates() {
		this.calval.foodMesh && this.animateFood(this.calval.foodMesh)
		!vm.pauseFlag && this.calval.sortMeshs && this.calval.sortMeshs.length>0 && this.animateBlocks(this.calval.sortMeshs[vm.blockAnimateIndex])
	}

	animateFood(food) {
		Object.keys(food).length>0 && (food.rotation.y += 0.01)
	}

	destory(mesh) {
		const meshObj = vm.scene.getObjectByName(mesh.name)
		mesh && vm.scene.remove(meshObj)
	}

	release() {
		const beyonds = 200,
			keeps = 90,
			screenWidth = window.innerWidth/2,
			screenHeight = window.innerHeight/2,
			cubeX = vm.cube[0].position.x,
			cubeY = vm.cube[0].position.y
		if(cubeX > vm.initCubePosition.x + screenWidth && cubeY > vm.initCubePosition.y + screenHeight) {
			vm.cube.forEach((c, i) => {
				i > keeps && this.destory(vm.cube[i])
			})
			vm.cube = vm.cube.slice(0, keeps)
			vm.len = keeps
			this.setInitCubePosition({x: vm.cube[0].position.x, y: vm.cube[0].position.y})
		}
		// if(vm.len >= beyonds) {
		// 	console.log('in release vm.len', vm.len)
		// 	console.log('in release vm.cube', vm.cube[0])
		// 	vm.cube.forEach((c, i) => {
		// 		if(i > releases) {
		// 			this.destory(vm.cube[i])
		// 		}
		// 	})
		// 	vm.cube = vm.cube.slice(0, releases)
		// 	vm.len = releases
		// }
	}

	animateBlocks(block) {
		if(!block) return
		const rotate = 0.01,
			animateSpeed = 3
		if(block.direction === 0) {  //左边块
			if(!block.animated && block.rotation.z >= rotate*Math.PI) {
				block.animated = true
			} else if (!block.animated) {
				block.rotation.z += 0.002
			} else if (block.animated && block.rotation.z >= 0) {
				if(block.rotation.z < 0.001* animateSpeed) {  //回到原位
					block.animated = false
					vm.blockAnimateIndex++
				}
				block.rotation.z -= 0.001* animateSpeed
			}
		} else if (block.direction === 1) {  //右边块
			if(!block.animated && block.rotation.z <= -rotate*Math.PI) {
				block.animated = true
			} else if (!block.animated) {
				block.rotation.z -= 0.002
			} else if (block.animated && block.rotation.z <= 0) {
				if(block.rotation.z > -0.001* animateSpeed) {
					block.animated = false
					vm.blockAnimateIndex++
				}
				block.rotation.z += 0.001* animateSpeed
			}
		}
	}

	onTouchStart(event) {
		vm.pauseFlag && (vm.pauseFlag = false)
		vm.clickCount === 0 && audio(1, vm.innerAudioContext)
		vm.clickCount % 2 === 0 && (vm.headForward = 2)
		vm.clickCount % 2 === 1 && (vm.headForward = 3)
		vm.clickCount++
	}

	onWindowResize() {
		let width = window.innerWidth || window.document.body.clientWidth
		let height = window.innerHeight || window.document.body.clientHeight
		vm.renderer.setSize(width, height)
		vm.camera.aspect = width / height
		vm.camera.updateProjectionMatrix()
	}

	setInitCubePosition ({x, y}) {
		vm.initCubePosition.x = x
		vm.initCubePosition.y = y
	}

}

