
var GAME;

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
var SCREEN_WIDTH = 1000;
var SCREEN_HEIGHT = 480;
var FLOOR = -160;

var camera, controls, scene, renderer;
var container, stats;

var NEAR = 1, FAR = 3000;

var sceneHUD, cameraOrtho, hudMaterial;

var morph, morphs = [];

var light;

var clock = new THREE.Clock();

var effectFocus;

var models = {};

loadGeometry();
setTimeout(preInit,1000);

function preInit()
{
	if(ig.game)
	{
		init();
	} else
	{
		setTimeout(preInit,500);
	}
}


var flameLight;
var composer, rtParameters;
function init() {

	//container = document.createElement( 'div' );
	//document.body.appendChild( container );

	container = document.getElementById('container');
	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0xffbf6b, 1000, FAR );
	//.fog.ColorUtils.adjustHSV( scene.fog.color, 0.02, -0.15, -0.65 );

	camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );
	camera.position.set( 0, -90, 140 );
	scene.add( camera );

	var ambient = new THREE.AmbientLight( 0x242424 );
	scene.add( ambient );

	light = new THREE.SpotLight( 0xd6e2ff, 1, 0, Math.PI, 1 );
	light.position.set( 600, 400, 1000 );
	light.target.position.set( 0, 0, 0 );

	light.castShadow = true;
	light.shadowCameraNear = 200;
	light.shadowCameraFar = 1800;
	light.shadowCameraFov = 45;
	//light.shadowCameraVisible = true;

	light.shadowBias = 0.0005;
	light.shadowDarkness = .55;

	light.shadowMapWidth = SHADOW_MAP_WIDTH;
	light.shadowMapHeight = SHADOW_MAP_HEIGHT;
	light.shadowMapSoft = true;
	scene.add( light );
	
	var specLight = new THREE.PointLight( 0x058ee4, .2, 0, Math.PI, 1 );
	////flameLight.position.set( 600, 400, 1000 );
	//specLight.target.position.set( 0, 0, 0 );
	scene.add(specLight);


	flameLight = new THREE.PointLight( 0xff7301, 1, 0, Math.PI, 1 );
	//flameLight.position.set( 600, 400, 1000 );
	//flameLight.target.position.set( 0, 0, 0 );


	flameLight.distance = 200;
	scene.add(flameLight);
	flameLight.intensity = 0;

	createScene();






	// RENDERER
	renderer = new THREE.WebGLRenderer( { clearColor: 0xffffff, antialias: false } );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	//renderer.domElement.style = "width:1200px;height:480px;margin:0px auto;text-align:left;"
	container.appendChild( renderer.domElement );





	//renderer.setClearColor( scene.fog.color, 1 );
	renderer.autoClear = false;
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;

	var renderModel = new THREE.RenderPass( scene, camera );
	//effectFocus = new THREE.ShaderPass(THREE.ShaderExtras["bokeh"]);
	var effectBloom = new THREE.BloomPass( .9 );
	var effectVignette = new THREE.ShaderPass(THREE.ShaderExtras["colorCorrection"]);
	var effectFilm = new THREE.FilmPass( .3, .3,1024,false );
	var effectFXAA = new THREE.ShaderPass( THREE.ShaderExtras[ "sepia" ] );

	effectFilm.renderToScreen = true;
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( renderModel );
	//composer.addPass( effectFocus );
	//composer.addPass( effectFXAA );
	composer.addPass( effectBloom );
	composer.addPass( effectVignette );
	composer.addPass( effectFilm );
	
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.left = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	impact3D.init(scene);
	addGUI();
	animate();
}

var SettingsObj = function() {
	  this.postProcessing = true;
	  this.animateLight = false;
	  this.zoom =  140;
	  this.gravity = 100;
};

var settings;
function addGUI()
{
	settings = new SettingsObj()
	var gui = new dat.GUI();
		gui.add(settings, 'postProcessing');
		gui.add(settings, 'animateLight')
		gui.add(settings,'zoom',30,300)
		//gui.add(settings,'gravity',-50,200)
}

function loadGeometry()
{
	var loader = new THREE.JSONLoader();
	loader.load("crate.js",function(geometry){impact3D.addModel(geometry,"2")});
	loader.load("char.js",function(geometry){impact3D.addModel(geometry,"1")});	
	loader.load("bullet.js",function(geometry){impact3D.addModel(geometry,"0")});
}

var player; 
var fan;
function createScene( ) {

	// GROUND
	var geometry = new THREE.PlaneGeometry( 100, 100 );
	var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
	THREE.ColorUtils.adjustHSV( planeMaterial.color, 0, 0, 0.9 );
	planeMaterial.ambient = planeMaterial.color;

	var ground = new THREE.Mesh( geometry, planeMaterial );

	ground.position.set( 0, FLOOR - 68, 0 );
	ground.scale.set( 100, 100, 100 );

	ground.castShadow = false;
	ground.receiveShadow = true;

				
		var loader = new THREE.JSONLoader();
		var lvlGeometry;
		var createMesh = function( geometry )
		{
		   // var zmesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0xffffff,shininess:5000,specular:1000}) );
		 	var zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );

		   	zmesh.scale.set( 1, 1, 1 );
		   	zmesh.position.set( 0,-240, 0 );
			zmesh.receiveShadow = true;
			zmesh.castShadow = true;
		    scene.add(zmesh);
		    
		};
		loader.load("testlevel.js",createMesh);


		var createFan = function(geometry)
		{
		 	fan = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0xa1592f,shininess:10000,specular:10}) );
		    fan.position.set( 156.3,-92.3, -150.3);
		    fan.receiveShadow =true;
		    fan.castShadow = true;
		    scene.add(fan);
		}

		loader.load("fan.js",createFan);
		flame = new JetpackFlame();
		scene.add(flame.system)

}
var flame;
var c=0;
var camOffset = {x:0,y:0};
var flameIntensity = 0;
var lastGravity = 100;
function animate() {
	requestAnimationFrame( animate );
	
	c++;
	
	impact3D.update();
	/*effectFocus.uniforms[ 'focus' ].value = settings.focus;
	effectFocus.uniforms[ 'aperture' ].value = settings.aperture;
	effectFocus.uniforms[ 'maxblur' ].value = settings.maxblur;
	*/

	camera.lookAt(impact3D.player.position)
	camera.position.x += ((impact3D.player.position.x - camera.position.x) + camOffset.x )* .02;
	camera.position.y += (((impact3D.player.position.y+30 ) - camera.position.y) + camOffset.y ) * .08 
	
	camera.position.y = Math.min(camera.position.y, -40)
	camera.position.z += ((settings.zoom) - camera.position.z) * .08;

	//if(c%10 == 0)
	//camOffset.y = Math.random() * 10 - 5;

	camOffset.x = Math.sin(c/20) * 8 - 4 + Math.random() * 6;
	camOffset.y = Math.cos(c/30) * 6 - 3 + Math.random() * 2;

	if(settings.animateLight)
	{
		light.position.x = 600 + (Math.sin(c/100) * 500 - 250)
		light.position.y = 400 + (Math.sin(c/100) * 100 - 50)
	}



	var delta = clock.getDelta();
	
	if(fan)
	fan.rotation.z += 0.012;

	if(flame)
	{
		if(impact3D.player.rotation.y < 0)
		flame.emitterpos.x = impact3D.player.position.x + 3;
		else 	flame.emitterpos.x = impact3D.player.position.x - 3;

		flame.emitterpos.y = impact3D.player.position.y - 5;

		//flame.y = 500;
		//flame.x = impact3D.player.position.x;

		if( ig.input.state('jump') ) {
			flame.counter.rate = 200;
			flameIntensity = 1 + (Math.sin(c) + 2);
			flameLight.position = impact3D.player.position;
		} else
		{
			flameIntensity = 0;
			flame.counter.rate = 0;
		}
		flameLight.intensity += ((flameIntensity) - flameLight.intensity) * .09;
	}
	/*if(lastGravity != settings.gravity)
	{
		var gravity = new b2.Vec2( 0, settings.gravity * b2.SCALE );
		ig.world.SetGravity( gravity );

	}
	lastGravity = settings.gravity;
	*/
	render();
	stats.update();
}

function render() {
	flame.system.geometry.verticesNeedUpdate = true;
	flame.attributes.size.needsUpdate = true;
	flame.attributes.pcolor.needsUpdate = true;


	renderer.clear();
	
	if(!settings.postProcessing) renderer.render( scene, camera );
	else	composer.render(0.1  );
}