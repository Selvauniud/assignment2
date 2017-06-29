console.log("GAME.JS")

// DEGREE TO RADIAN
Math.radians = function(degrees) {return degrees * Math.PI / 180;};

////DEFINE KEYPRESS EVENT LISTENERS (X & Y MOTION AND CAMERA CHOOSER)
window.addEventListener('keyup', function(event) { event.preventDefault(); Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { event.preventDefault(); Key.onKeydown(event); }, false);
var Key = {
	_pressed: {},
	shift: 16, 
	left: 37, up: 38, right: 39, down: 40,
	A: 65,W: 87,D: 68,S: 83,
	one: 49,two: 50, three: 51, zero: 48,
	equal: 187, dash: 189,
	isDown: function (keyCode) {return this._pressed[keyCode];},
	onKeydown: function (event) {this._pressed[event.keyCode] = true;},
//	onKeyup: function (event) {if (event.keyCode === 16){rexMesh.rotation.y = 0;} delete this._pressed[event.keyCode];}
	onKeyup: function (event) {delete this._pressed[event.keyCode];}	
};

////DOM SETUP
var renderer = new THREE.WebGLRenderer();
var display = document.getElementById('game-display');
var displayStyle = window.getComputedStyle(display);
var displayWidth = parseInt(displayStyle.width);
var displayHeight = parseInt(displayStyle.width) / 1.78;
renderer.setSize(displayWidth, displayHeight);
display.appendChild(renderer.domElement);

////WINDOW RESIZE LISTENER
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
		var displayWidth = parseInt(displayStyle.width);
		var displayHeight = parseInt(displayStyle.width) / 2;
		if (typeof orbitCamera != "undefined"){
			orbitCamera.aspect = displayWidth / displayHeight;
			orbitCamera.updateProjectionMatrix();
		} else if (typeof gameCamera != "undefined"){
			gameCamera.aspect = displayWidth / displayHeight;
			gameCamera.updateProjectionMatrix();
		} else if (typeof sideCamera != "undefined" ){
			sideCamera.aspect = displayWidth / displayHeight;
			sideCamera.updateProjectionMatrix();
		} else if (typeof startCamera != "undefined"){
			startCamera.aspect = displayWidth / displayHeight;
			startCamera.updateProjectionMatrix();
		}
		renderer.setSize(displayWidth, displayHeight);
	}	

/////////////////////////////////////////////////////////////////////////////////////      END GLOBAL

////GAME STATE

setGameState("menu");

function startMenu(){
	function killStartMenu(){
		cancelAnimationFrame(sMA);
		for( var i = startMenuScene.children.length - 1; i >= 0; i--) {
			object = startMenuScene.children[i];
			startMenuScene.remove(object);
		}
		startMenuScene.remove();
		startCamera.remove();
		rexMesh.remove();
		rexPivot.remove();
		gameLogo.remove();
		startSphereMesh.remove();
		startButton.remove();
		setGameState("game");
	}
	
	////CREATE SCENE
	var startMenuScene = new THREE.Scene();
	
	////LIGHTS
	startMenuScene.add(new THREE.AmbientLight(0xCCCCCC));
	
	////START CAMERA
	var startCamera = new THREE.PerspectiveCamera(55, displayWidth / displayHeight, 0.1, 500);
	startCamera.position.set(0,60,100);
	startCamera.lookAt(startMenuScene.position);

	////START SPHERE 
	var sphereGeometry = new THREE.SphereGeometry(150,50,50);
	var sphereColor = Math.floor(Math.random() * 16777215).toString(16);
	var sphereMaterial = new THREE.MeshBasicMaterial({color:"#" + sphereColor, wireframe: true, transparent: false, opacity: .3})
	var startSphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	startMenuScene.add(startSphereMesh);
	
	////DOM SETUP - START GAME
	var startButton = document.createElement('button');
	startButton.id = "start-button"
	startButton.innerHTML = 'START GAME';
	display.appendChild(startButton);
	startButton.addEventListener('click',function(){killStartMenu();})
	
	////DOM SETUP - LOGO
	var gameLogo = document.createElement('pre');
	gameLogo.id = "game-logo"
	gameLogo.innerHTML = '██████╗ ███████╗████████╗██████╗  ██████╗ ███████╗██╗  ██╗██████╗ ██████╗ ███████╗███████╗███████╗\r\n██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝\r\n██████╔╝█████╗     ██║   ██████╔╝██║   ██║█████╗   ╚███╔╝ ██████╔╝██████╔╝█████╗  ███████╗███████╗\r\n██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║██╔══╝   ██╔██╗ ██╔═══╝ ██╔══██╗██╔══╝  ╚════██║╚════██║\r\n██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝███████╗██╔╝ ██╗██║     ██║  ██║███████╗███████║███████║\r\n╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝';
	var gameLogoStyle = window.getComputedStyle(gameLogo);
	display.appendChild(gameLogo);
	
	
	////GEOMETRY
	////REX (SPACESHIP) - CENTERED ON AXIS
	var rexPivot = new THREE.Object3D();
	var rexShape = new THREE.Shape();
	////REX SVG COORDINATES - CENTERED
	function rexShapeData() {
		rexShape.moveTo(0, -35);
		rexShape.lineTo(9.3, -17.7);
		rexShape.lineTo(50, 21.8);
		rexShape.lineTo(6.6, 21.8);
		rexShape.lineTo(0, 35);
		rexShape.lineTo(-6.6, 21.8);
		rexShape.lineTo(-50, 21.8);
		rexShape.lineTo(-9.3, -17.7);
	}
	rexShapeData() //GRABS SVG DATA
	var rexExtrusion = {amount: 4, bevelEnabled: false};
	var rexGeometry = new THREE.ExtrudeGeometry(rexShape, rexExtrusion);
	//	var rexMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true});
	
	//added Texture By Selvakumar
	var rexMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('/game-master/img/ships.jpg') } );
	var rexMesh = new THREE.Mesh(rexGeometry, rexMaterial);
	//var rexMesh = new Physijs.ConvexMesh(rexGeometry, rexMaterial);
	rexMesh.rotateX(Math.radians(90));
	rexPivot.add(rexMesh);
	startMenuScene.add(rexPivot);
	
	var secretMode = false;
	
	var startMenuAnimate = function(){
		sMA = requestAnimationFrame(startMenuAnimate);
		rexPivot.rotateY(Math.radians(.9));
		startSphereMesh.rotateY(Math.radians(-.1));
		if (Key.isDown(Key.zero)) {
			secretMode = true;
		}
		if (secretMode === true){
			var newStartSphereColor = Math.floor(Math.random() * 16777215).toString(16);
			startSphereMesh.material.color.setHex( "0x" + newStartSphereColor );
		}
		var gameLogoColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
		gameLogo.style.color = gameLogoColor;
		renderer.render(startMenuScene, startCamera);
	};
	startMenuAnimate();
}


function startGame(){
	
	function killGame(){
		clearInterval(enemyCreateInterval);
		for( var i = enemyPivot.children.length - 1; i >= 0; i--) {
			selectedEnemyMesh = enemyPivot.children[i];
			selectedEnemyMesh.position.set(0,0,0);
			enemyPivot.remove(selectedEnemyMesh);
		}
//		gameScene.dispose();
//		gameCamera.dispose();
//		sideCamera.dispose();
//		gridLine.dispose();
//		gridLineTop.dispose();
//		cubeMesh.dispose();
//		rexMesh.dispose();
//		rexPivot.dispose();
//		enemyMesh.dispose();
//		enemyPivot.dispose();
//		scoreDisplay.dispose();
//		orbitMessage.dispose();
//		resetButton.dispose();
		
		gameScene.remove();
		gameCamera.remove();
		sideCamera.remove();
		gridLine.remove();
		gridLineTop.remove();
		cubeMesh.remove();
		rexMesh.remove();
		rexPivot.remove();
		enemyMesh.position.set(0,0,-5000);
		enemyPivot.position.set(0,0,-5000);
		enemyMesh.remove();
		enemyPivot.remove();
		scoreDisplay.remove();
		orbitMessage.remove();
		resetButton.remove();
		godMode = null;
		

		setGameState("menu")
	}
	
	function setRexAlive(boolean){
		switch (boolean){
			case true:
				aliveGameOver(true);
				break;
			case false:
				aliveGameOver(false);
				break;
		}
	}
		
	////CHECK DIFFICULTY
	function checkDifficulty(time) {
		////WORLD TRANSLATION && DIFFICULTY 
		////***** LEVEL 11 *****
		if(time >= 100.0){difficulty = 2;}
		////***** LEVEL 10 *****
		if(time >= 90.0 && time < 100.0){difficulty = 1;}
		////***** LEVEL 9 *****
		if(time >= 80.0 && time < 90.0){difficulty = .999;}
		////***** LEVEL 8 *****
		if(time >= 70.0 && time < 80.0){difficulty = .888;}
		////***** LEVEL 7 *****
		if(time >= 60.0 && time < 70.0){difficulty = .777;}
		////***** LEVEL 6 *****
		if(time >= 50.0 && time < 60.0){difficulty = .666;}
		////***** LEVEL 5 *****
		if(time >= 40.0 && time < 50.00 ){difficulty = .555;}
		////***** LEVEL 4 *****
		if(time >= 30.0 && time < 40.0){difficulty = .444;}
		////***** LEVEL 3 *****
		if(time >= 20.0 && time < 30.0){difficulty = .333;}
		////***** LEVEL 2 *****
		if (time >= 10.0 && time < 20.0){difficulty = .222;}
		////***** LEVEL 1 *****
		if(time >= 0.0 && time < 10.0){difficulty = .111;}
		gridLine.translateZ(gridLineSpeed*difficulty)
		cubeMesh.translateZ(cubeMeshSpeed*difficulty)
		checkForEnemies(difficulty)
	}
	////CHECK FOR COLLISION
	function checkForCollision() {
		for (var i = 0; i < enemyPivot.children.length; i++) {
			var rexPosition = new THREE.Box3().setFromObject(rexMesh);
			var enemyPosition = new THREE.Box3().setFromObject(enemyPivot.children[i]);
			if (enemyPosition.isIntersectionBox(rexPosition)) {
				setRexAlive(false)
			}
		}
	}
	////CHECK IF ENEMIES EXIST
	function checkForEnemies(){
		if (typeof enemyMesh != "undefined") {
			enemyPivot.translateZ(enemyPivotSpeed*difficulty)

//			if (enemyPivot.children[0].matrixWorld.elements[14] > 200 && enemyPivot.children[0].material.opacity > 0) {
//				enemyPivot.children[0].material.opacity -= .1;
//			}
			if (enemyPivot.children[0].matrixWorld.elements[14] > 1200) {
				scoreCounter += 1;
				scoreDisplay.innerHTML = 'SCORE: ' + scoreCounter;
				deleteEnemy()
			}
		}
	}
	////REX WOBBLE
	function rexWobble() {
		if (rexDirection === "up") {
			rexPivot.translateY(.05)
			if (rexPivot.position.y > 1) {
				rexDirection = "down"
			}
		} else if (rexDirection === "down") {
			rexPivot.translateY(-.05)
			if (rexPivot.position.y < -1) {
				rexDirection = "up"
			}
		}
	}
	//// SHIP CONTROLS - TRANSLATES REX ON KEYPRESS
	function shipControls() {
		//ARROW KEY & WASD CONTROLS
		if (Key.isDown(Key.left) || Key.isDown(Key.A)) {
			if (rexPivot.position.x > - 450) {
				rexPivot.translateX(-20), rexMesh.rotateY(Math.radians(.1)), gameScene.rotateZ(Math.radians(.1))
			}
		}
		if (Key.isDown(Key.right) || Key.isDown(Key.D)) {
			if (rexPivot.position.x < 450) {
				rexPivot.translateX(20), rexMesh.rotateY(Math.radians(-.1)), gameScene.rotateZ(Math.radians(-.1))
			}
		}
		if (Key.isDown(Key.up) || Key.isDown(Key.W)) {
			if (rexPivot.position.y < 400) {
				rexPivot.translateY(15), gameScene.translateY(-2.5), rexMesh.rotateX(Math.radians(-.1)), gameScene.rotateX(Math.radians(-.1))
			}
		}
		if (Key.isDown(Key.down) || Key.isDown(Key.S)) {
			if (rexPivot.position.y > -400) {
				rexPivot.translateY(-15), gameScene.translateY(2.5), rexMesh.rotateX(Math.radians(.1)), gameScene.rotateX(Math.radians(.1))
			}
		}
		////SHIFT KEY (VERTICAL MODE)
		if (Key.isDown(Key.shift)){
			rexMesh.rotation.y = Math.radians(90);
			if(cameraSwitcher === "cockpitCamera"){
				cockpitCamera.rotation.z = Math.radians(90)
			}
		}////SHIFT KEYUP RESET IS IN ANIMATE FUNCTION
	}
	
	// change postion of  LIGHTS by Selvakumar
	function gameLights(){
		
		var time = Date.now() * 0.00025;
		var z = 20, d = 150;
		light1.position.x = Math.sin( time * 0.7 ) * d;
		light1.position.z = Math.cos( time * 0.3 ) * d;
		light2.position.x = Math.cos( time * 0.3 ) * d;
		light2.position.z = Math.sin( time * 0.7 ) * d;
		light3.position.x = Math.sin( time * 0.7 ) * d;
		light3.position.z = Math.sin( time * 0.5 ) * d;
		light4.position.x = Math.sin( time * 0.3 ) * d;
		light4.position.z = Math.sin( time * 0.5 ) * d;
		light5.position.x = Math.cos( time * 0.3 ) * d;
		light5.position.z = Math.sin( time * 0.5 ) * d;
		light6.position.x = Math.cos( time * 0.7 ) * d;
		light6.position.z = Math.cos( time * 0.5 ) * d;
	}
	
	////ENEMY GENERATION
	function createEnemy() {
		if (enemyPivot.children.length <= 99) {

			if (typeof enemyMesh != "undefined") {
				var lastEnemyPosition = enemyMesh.position.z;
				var newEnemyPosition = lastEnemyPosition - 200;
			} else {
				var newEnemyPosition = -5000;
			}

			var enemyColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

			var enemyGeometry = new THREE.BoxGeometry(Math.floor(Math.random() * 50) + 50, Math.floor(Math.random() * 50) + 50, Math.floor(Math.random() * 50) + 50, 2, 2, 2)
			//var enemyMaterial = new THREE.MeshBasicMaterial({
				//color: enemyColor,
			//	wireframe: true
			//});
			//adding fragment and vertext shader by Selvakumar
			
				
			var enemyMaterial = new THREE.ShaderMaterial( {
						uniforms:'fragment_shader',
						//uniforms : uniforms,
						vertexShader: document.getElementById( 'vertexShader' ).textContent,
						fragmentShader: document.getElementById('fragment_shader' ).textContent
			} );
		//	var enemyMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('/game-master/img/dummy.jpg') } );
			enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
			var enemyBox = new THREE.Box3().setFromObject(enemyMesh);
			var enemyHalfX = enemyBox.max.x
			var enemyHalfY = enemyBox.max.y

			enemyId += 1;
			enemyMesh.name = "enemy" + parseInt(enemyId);

			////PHYSI.JS
			enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
			//		enemyMesh = new Physijs.BoxMesh(enemyGeometry, enemyMaterial);
			
			//var light = new THREE.AmbientLight( 0x404040 ); // soft white light
				//enemyPivot.add( light );
					// adding three lights on enemy mesh..
				/*	var light = new THREE.PointLight( 0xff0000, 1, 100 );
					light.position.set( 50, 50, 50 );
					enemyMesh.add( light );
					*/
					var spotLight = new THREE.SpotLight( 0xff0000 );
					spotLight.position.set( 100, 1000, 100 );
					enemyMesh.add( spotLight );
					
					
				

			var switchNum = Math.floor(Math.random() * 21);
			switch (switchNum) {
				case 0:
					////TOP RIGHT
					enemyMesh.position.set((Math.floor(Math.random() * 500) - enemyHalfX), (Math.floor(Math.random() * 400) - enemyHalfY), newEnemyPosition)
					break;
				case 1:
					////TOP LEFT
					enemyMesh.position.set((Math.floor(Math.random() * -500) + enemyHalfX), (Math.floor(Math.random() * 400) - enemyHalfY ), newEnemyPosition)
					break;
				case 2:
					////BOTTOM LEFT
					enemyMesh.position.set((Math.floor(Math.random() * -500) + enemyHalfX), (Math.floor(Math.random() * -400) + enemyHalfY), newEnemyPosition)
					break;
				case 3:
					////BOTTOM RIGHT
					enemyMesh.position.set((Math.floor(Math.random() * 500) - enemyHalfX), (Math.floor(Math.random() * -400) + enemyHalfY), newEnemyPosition)
					break;
				case 4:
					////CENTER
					enemyMesh.position.set(0, 0, newEnemyPosition)
					break;
				case 5:
					////TOP CENTER
					enemyMesh.position.set(0, 400 - enemyHalfY, newEnemyPosition)
					break;
				case 6:
					////BOTTOM CENTER
					enemyMesh.position.set(0, -400 + enemyHalfY, newEnemyPosition)
					break;
				case 7:
					////LEFT CENTER
					enemyMesh.position.set(-500 + enemyHalfX, 0, newEnemyPosition)
					break;
				case 8:
					////RIGHT CENTER
					enemyMesh.position.set(500 - enemyHalfX, 0, newEnemyPosition)
					break;
				case 9:
					////TOP LEFT
					enemyMesh.position.set(-500 + enemyHalfX, 400 - enemyHalfY, newEnemyPosition)
					break;
				case 10:
					////TOP RIGHT
					enemyMesh.position.set(500 - enemyHalfX, 400 - enemyHalfY, newEnemyPosition)
					break;
				case 11:
					////BOTTOM LEFT
					enemyMesh.position.set(-500 + enemyHalfX, -400 + enemyHalfY, newEnemyPosition)
					break;
				case 12:
					////BOTTOM RIGHT
					enemyMesh.position.set(500 - enemyHalfX, -400 + enemyHalfY, newEnemyPosition)
					break;
				case 13:
					////QUAD 1 BOTTOM LEFT
					enemyMesh.position.set(0 + enemyHalfX, 0 + enemyHalfY, newEnemyPosition)
					break;
				case 14:
					////QUAD 2 BOTTOM RIGHT
					enemyMesh.position.set(0 - enemyHalfX, 0 + enemyHalfY, newEnemyPosition)
					break;
				case 15:
					////QUAD 3 TOP RIGHT
					enemyMesh.position.set(0 - enemyHalfX, 0 - enemyHalfY, newEnemyPosition)
					break;
				case 16:
					////QUAD 4 TOP LEFT
					enemyMesh.position.set(0 + enemyHalfX, 0 - enemyHalfY, newEnemyPosition)
					break;
				case 17:
					////QUAD 1 CENTER
					enemyMesh.position.set(250, 200, newEnemyPosition)
					break;
				case 18:
					////QUAD 2 CENTER
					enemyMesh.position.set(-250, 200, newEnemyPosition)
					break;
				case 19:
					////QUAD 3 CENTER
					enemyMesh.position.set(-250, -200, newEnemyPosition)
					break;
				case 20:
					////QUAD 4 CENTER
					enemyMesh.position.set(250, -200, newEnemyPosition)
					break;
			}
			enemyPivot.add(enemyMesh)
		}
	}
	////DELETE ENEMY
	function deleteEnemy() {
		enemyPivot.remove(enemyPivot.children[0])
	}
	/////////////////////////////////////////////////////////////////
	
	////CREATE SCENE
	var gameScene = new THREE.Scene();//var gameScene = new Physijs.Scene();////PHYSJS VERSION
	
	////LIGHTS
	gameScene.add(new THREE.AmbientLight(0xCCCCCC));
	
	////FOG
	gameScene.fog = new THREE.FogExp2(0x000000, 0.0005);
	renderer.setClearColor(gameScene.fog.color, 1);
	
	////GAME CAMERA (3D)
	var gameCamera = new THREE.PerspectiveCamera(55, displayWidth / displayHeight, 0.1, 2500);
	gameCamera.position.set(0, 100, 1000);
	gameCamera.lookAt(gameScene.position);

	////SIDE CAMERA (2.5D)
	var sideCamera = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 2500);
	sideCamera.position.set(1000, 0, -300);
	sideCamera.rotateY(Math.radians(90));
	//sideCamera.lookAt(gameScene.position);
	
	////CREATE CLOCK
	var gameClock = new THREE.Clock();
	
	////REQUIRE PHYSI.JS
		//Physijs.scripts.worker = '/physijs/physijs_worker.js';
		//Physijs.scripts.ammo = '/physijs/examples/js/ammo.js';
	
	////DOM SETUP - SCORE COUNTER
	var scoreCounter = 0;
	var scoreDisplay = document.createElement('div');
	scoreDisplay.id = 'score-display'
	scoreDisplay.innerHTML = 'SCORE: ' + scoreCounter;
	display.appendChild(scoreDisplay);
	
	////DOM SETUP - RESET GAME
	var resetButton = document.createElement('button');
	resetButton.id = "reset-button"
	resetButton.innerHTML = 'RESET GAME';
	
	var orbitMessage = document.createElement('div');
	orbitMessage.id = "orbit-message";
	orbitMessage.innerHTML = "<p>Click and drag your mouse to rotate the camera!  You can zoom too!</p>"

	
	////WORLD GEOMETRY
	////GRID PLANE (BOTTOM)
	var gridSize = 300000;
	var gridStep = 100;
	var gridGeometry = new THREE.Geometry();
	var gridColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
	var gridMaterial = new THREE.LineBasicMaterial({color: gridColor});
	for (var i = -gridSize; i <= gridSize; i += gridStep) {
		gridGeometry.vertices.push(new THREE.Vector3(-gridSize, -0.04, i));
		gridGeometry.vertices.push(new THREE.Vector3(gridSize, -0.04, i));
		gridGeometry.vertices.push(new THREE.Vector3(i, -0.04, -gridSize));
		gridGeometry.vertices.push(new THREE.Vector3(i, -0.04, gridSize));
	}
	var gridLine = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);
	var gridLineSpeed = 32;
	gridLine.position.y = -500;
	gridLine.position.z = 150000;
	////GRID PLANE (TOP)
	var gridLineTop = gridLine.clone();
	gridLineTop.position.y = 500;

	////CUBE (TUNNEL)
	var cubeGeometry = new THREE.BoxGeometry(4000, 1100, 300000, 10, 10, 1000);
	var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x666666, wireframe: true});
	var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
	var cubeMeshSpeed = 32;
	cubeMesh.material.side = THREE.DoubleSide;
	
	
	////ADD WORLD GEOMETRY
	gameScene.add(cubeMesh);
	gameScene.add(gridLine);
	gameScene.add(gridLineTop);
	
	////ENEMY PIVOT (PARENT CONTROL - USE THIS TO MOVE BLOCKS)
	var enemyPivot = new THREE.Object3D();
	var enemyPivotSpeed = 50;
	var enemyId = 0;

	////ADD REX
	////REX (SPACESHIP) - CENTERED ON AXIS
	var rexPivot = new THREE.Object3D();
	var rexShape = new THREE.Shape();
	////REX SVG COORDINATES - CENTERED
	function rexShapeData() {
		rexShape.moveTo(0, -35);
		rexShape.lineTo(9.3, -17.7);
		rexShape.lineTo(50, 21.8);
		rexShape.lineTo(6.6, 21.8);
		rexShape.lineTo(0, 35);
		rexShape.lineTo(-6.6, 21.8);
		rexShape.lineTo(-50, 21.8);
		rexShape.lineTo(-9.3, -17.7);
	}
	rexShapeData() //GRABS SVG DATA
	var rexExtrusion = {amount: 4, bevelEnabled: false};
	var rexGeometry = new THREE.ExtrudeGeometry(rexShape, rexExtrusion);
	//var rexMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true});
	//load textures by Selvakumar
	var rexMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('/game-master/img/ships.jpg') } );
	rexMesh = new THREE.Mesh(rexGeometry, rexMaterial);
	//var rexMesh = new Physijs.ConvexMesh(rexGeometry, rexMaterial);
	var rexDirection = "up";
	rexMesh.rotateX(Math.radians(90));
	rexPivot.translateZ(100);
	rexPivot.rotation.y = 0;
	gameScene.add(rexPivot)
	rexPivot.add(rexMesh);
	
	gameScene.add(enemyPivot);
	
	//FIRST PERSON CAMERA
	cockpitCamera = new THREE.PerspectiveCamera(80, displayWidth / displayHeight, 1, 3000);
	cockpitCamera.rotateY(90)
	cockpitCamera.lookAt(gameScene.position)
	cockpitCamera.position.set(0,0,-10)
	
	rexPivot.add(cockpitCamera)
	
	// adding 3 types  LIGHTS by Selvakumar
	var intensity = 10;
	var distance = 5;
	var decay = 10;
	var color1 = 0xff0040, color2 = 0x0040ff, color3 = 0x80ff80, color4 = 0xffaa00, color5 = 0x00ffaa, color6 = 0xff1100;
	var sphere = new THREE.SphereGeometry( 0.75, 16, 8 );
	light1 = new THREE.PointLight( color1, intensity, distance, decay );
	light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color1 } ) ) );
	gameScene.add( light1 );
	light2 = new THREE.PointLight( color2, intensity, distance, decay );
	light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color2 } ) ) );
	gameScene.add( light2 );
	light3 = new THREE.PointLight( color3, intensity, distance, decay );
	light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color3 } ) ) );
	gameScene.add( light3 );
	light4 = new THREE.PointLight( color4, intensity, distance, decay );
	light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color4 } ) ) );
	gameScene.add( light4 );
	light5 = new THREE.PointLight( color5, intensity, distance, decay );
	light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color5 } ) ) );
	gameScene.add( light5 );
	light6 = new THREE.PointLight( color6, intensity, distance, decay );
	light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color6 } ) ) );
	gameScene.add( light6 );
	var dlight = new THREE.DirectionalLight( 0xffffff, 0.05 );
	dlight.position.set( 0.5, 1, 0 ).normalize();
	gameScene.add( dlight );
	
	window.addEventListener( 'resize', onWindowResize, false );
	
	////function for changing postion of lights.
	var enemyCreateInterval = setInterval(gameLights, 3000)
	
	////CREATE AND DELETE OBSTACLES ON INTERVAL
	var enemyCreateInterval = setInterval(createEnemy, 10)
	//var enemyDeleteInterval = setInterval(deleteEnemy, 10)
	
	godMode = false;
	
	function aliveGameOver(boolean){
		switch(boolean){
			case true:
				cameraSwitcher = "gameCamera"
				function gameAnimate(){
					gA = requestAnimationFrame(gameAnimate);
					//gameScene.simulate() //start physics
					var delta = gameClock.getDelta()
					var time = parseInt(gameClock.getElapsedTime());
					var newColor = Math.floor(Math.random() * 16777215).toString(16);
					
					////BARREL ROLL RESET
					rexMesh.rotation.y = 0;
					if(cameraSwitcher === "cockpitCamera"){
						cockpitCamera.rotation.z = 0
					}
					
					////WORLD TRANSLATION && DIFFICULTY    
					checkDifficulty(time) 
					checkForEnemies()
					
					if (godMode === false){
						checkForCollision();
						//rexMesh.material.color.setHex(0x00FF00);
					} else if (godMode === true){
						////PSYCHEDLEIC MODE	
						rexMesh.material.color.setHex( "0x" + newColor );
					}
					
					shipControls();
					rexWobble();
					
		
	
					
					if (Key.isDown(Key.one)) {
						cameraSwitcher = "gameCamera"
					} else if (Key.isDown(Key.two)) {
						cameraSwitcher = "sideCamera"
					} else if (Key.isDown(Key.three)) {
						cameraSwitcher = "cockpitCamera"
					} else if (Key.isDown(Key.equal)) {
						godMode = true;
					} else if (Key.isDown(Key.dash)) {
						godMode = false;
					}
					
					if (cameraSwitcher === "gameCamera") {
						renderer.render(gameScene, gameCamera);
					} else if (cameraSwitcher === "sideCamera") {
						renderer.render(gameScene, sideCamera);
					} else if (cameraSwitcher === "cockpitCamera"){
						renderer.render(gameScene, cockpitCamera)
					}
					
				};
				gameAnimate();
				break;
			case false:
				function gameOver(){
					cancelAnimationFrame(gA);
					////ORBIT CAMERA (DEATH CAM)
					var orbitCamera = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 2500);
					orbitCamera.position.set(300, 300, 100);

					////ORBIT CONTROLS
					var orbitControls = new THREE.OrbitControls( orbitCamera, renderer.domElement );
					//orbitControls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
					orbitControls.enableDamping = true;
					orbitControls.dampingFactor = 0.25;
					orbitControls.minDistance = 300;
					orbitControls.maxDistance = 1000;
					orbitControls.enableZoom = false;

					////ADD RESET BUTTON & ORBIT MESSAGE
					display.appendChild(orbitMessage);
					display.appendChild(resetButton);
					resetButton.addEventListener('click',function(){killGame();})

					///ORBIT CAMERA DEATH
					rexPivot.add(orbitCamera)
					orbitCamera.lookAt(rexMesh.position);

					var gameOverAnimate = function(){
						gOA = requestAnimationFrame(gameOverAnimate);
						renderer.render(gameScene, orbitCamera);
					}
					gameOverAnimate();
				}
				gameOver();
				break;	
		}
	}
	setRexAlive(true)
}

function setGameState(gameState){
	switch (gameState){
		case "menu":
			startMenu();
			break;
		case "game":
			startGame();
			break;
	}
}
