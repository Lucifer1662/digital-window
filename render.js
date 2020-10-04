var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
var width = window.innerWidth;
var height = window.innerHeight;

const ratio = width / height;

const offset = 1;
const cwidth = 1 * ratio * offset;
const cheight = 1 * offset;
let screenHeightM = 0.165;


var screenCamera = new THREE.OrthographicCamera(cwidth / - 2, cwidth / 2, cheight / 2, cheight / - 2, 1, 1000);
screenCamera.position.z = 2;
screenCamera.position.x = 0;
screenCamera.position.y = 0;
screenCamera.lookAt(0, 0, 0);

var renderCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
renderCamera.position.z = 2;
renderCamera.position.x = 0;
renderCamera.position.y = 0;
renderCamera.lookAt(0, 0, 0);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var renderScene = new THREE.Scene();
renderScene.add(renderCamera);

const renderTarget = new THREE.WebGLRenderTarget(width, height);


scene.background = new THREE.Color('red');
renderScene.background = new THREE.Color('orange');

var geometry = new THREE.BoxGeometry(0.08, 0.1, 0.08);
var material = new THREE.MeshStandardMaterial ({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
cube.position.x = 0;
cube.position.z = -0.26;
cube.position.y = 0.05;
scene.add(cube);


var light = new THREE.PointLight( 0xfffffff, 1, 100 );
light.position.set( 0.5, 1, 0 );
light.castShadow = true;
scene.add( light );


var redmaterial = new THREE.MeshStandardMaterial ({ color: 0x0f00f0 });

var cube = new THREE.Mesh(geometry, redmaterial);
cube.position.x = 0.05;
cube.position.z = 0.1;
cube.position.y = 0.05;
scene.add(cube);
//renderScene.add(cube);



const renderMaterial = new THREE.MeshBasicMaterial({
    map: renderTarget.texture,
});


var renderrectgeometry = new THREE.PlaneGeometry(ratio, 1);
const renderRect = new THREE.Mesh(renderrectgeometry, renderMaterial);
renderScene.add(renderRect);



var rectgeometry = new THREE.PlaneGeometry(screenHeightM * ratio, screenHeightM);
var rectangle = new THREE.Mesh(rectgeometry, redmaterial);
rectangle.position.y = screenHeightM / 2 + 0.01;

//scene.add(rectangle);

var blackmaterial = new THREE.MeshBasicMaterial({ color: 0x00000 });

var tablegeometry = new THREE.BoxGeometry(3, 0.001, 1.2);
var table = new THREE.Mesh(tablegeometry, blackmaterial);
scene.add(table);




camera.position.z = -1;
camera.position.x = 0;
camera.position.y = 0.2;


let target = new THREE.Vector3();
let speed = 1;


let finalCamera;



var animate = function () {

    renderCamera.position.lerp(target, speed);

    camera.position.copy(renderCamera.position);
    camera.quaternion.copy(renderCamera.quaternion);

    const portalHalfWidth = screenHeightM * ratio / 2;
    const portalHalfHeight = screenHeightM / 2;
    const portalPosition = rectangle.position.clone();
    camera.updateMatrixWorld();
    camera.worldToLocal(portalPosition);

    let left = portalPosition.x - portalHalfWidth;
    let right = portalPosition.x + portalHalfWidth;
    let top = portalPosition.y + portalHalfHeight;
    let bottom = portalPosition.y - portalHalfHeight;

    const near = 0.01;
    const distance = Math.abs(portalPosition.z);
    const scale = near / distance;
    left *= scale;
    right *= scale;
    top *= scale;
    bottom *= scale;
    let far = 1000;

    camera.projectionMatrix.makePerspective(left, right, top, bottom, near, far);

   


    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    // renderer.setRenderTarget(null);
    // renderer.render(renderScene, renderCamera);

    
    // renderer.setRenderTarget(null);
    // renderer.render(renderScene, screenCamera);

    requestAnimationFrame(animate);
};

setupKeyControls();
animate();


function updatePosition(position) {
    target.x = position.x;
    target.y = position.y;
    target.z = position.z;
}


function setupKeyControls() {
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 65:
                renderCamera.position.x -= 0.01
                break;
            case 68:
                renderCamera.position.x += 0.01
                break;
            case 87:
                //up
                renderCamera.position.z -= 0.03;
                break;
            case 83:
                //up
                renderCamera.position.z += 0.03;
                break;
            case 32:
                //up
                renderCamera.position.y += 0.03;
                break;

            case 16:
                //up
                renderCamera.position.y -= 0.03;
                break;
        }
    };
}
