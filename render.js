var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
var width = window.innerWidth;
var height = window.innerHeight;

const ratio = width/height;

const cwidth = 1 * ratio;
const cheight = 1;
var renderCamera = new THREE.OrthographicCamera(cwidth / - 2, cwidth / 2, cheight / 2, cheight / - 2, 1, 1000);
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

var geometry = new THREE.BoxGeometry(0.1,0.1,0.1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
cube.position.x = 0;
cube.position.z = -0.5;
scene.add(cube);

var redmaterial = new THREE.MeshBasicMaterial({ color: 0x0f00f0 });

var cube = new THREE.Mesh(geometry, redmaterial);
cube.position.x = 0.1;
cube.position.z = -0.3;
cube.position.y = 0.1;
scene.add(cube);


const renderMaterial = new THREE.MeshBasicMaterial({
    map: renderTarget.texture,
});


var rectgeometry = new THREE.PlaneGeometry();
var rectangle = new THREE.Mesh(rectgeometry, redmaterial);

//scene.add(rectangle);



var renderrectgeometry = new THREE.PlaneGeometry(ratio, 1);
const renderRect = new THREE.Mesh(renderrectgeometry, renderMaterial);
renderScene.add(renderRect);

camera.position.z = 1;
camera.position.x = 0;
camera.position.y = 0.1;

function toScreenSpace(pos) {
    var widthHalf = width / 2;
    var heightHalf = height / 2;

    pos.project(camera);
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;

    pos.x /= width;
    pos.y /= height;
    return pos;
}

var animate = function () {



    var pos = rectangle.position.clone();

    rectWidthHalf = 1 / 2;
    rectHeightHalf = 1 / 2;
    //rectWidthHalf *= 2;

    var tl = pos.clone();
    tl.x -= rectWidthHalf;
    tl.y += rectHeightHalf;
    tlS = toScreenSpace(tl);

    var tr = pos.clone();;
    tr.x += rectWidthHalf;
    tr.y += rectHeightHalf;
    trS = toScreenSpace(tr);

    var bl = pos.clone();;
    bl.x -= rectWidthHalf;
    bl.y -= rectHeightHalf;
    blS = toScreenSpace(bl);

    var br = pos.clone();;
    br.x += rectWidthHalf;
    br.y -= rectHeightHalf;
    brS = toScreenSpace(br);

   

    var uvAttribute = renderrectgeometry.faceVertexUvs[0];

    // var face1 = uvAttribute[0];
    // face1[0].x = blS.x;
    // face1[0].y = blS.y;

    // face1[1].x = tlS.x;
    // face1[1].y = tlS.y;

    // face1[2].x = brS.x;
    // face1[2].y = brS.y;


    // var face2 = uvAttribute[1];
    // face2[0].x = tlS.x;
    // face2[0].y = tlS.y;

    // face2[1].x = trS.x;
    // face2[1].y = trS.y;

    // face2[2].x = brS.x;
    // face2[2].y = brS.y;

    

    

    renderrectgeometry.uvsNeedUpdate = true;
 

    camera.lookAt(0, 0, 0);
    renderCamera.lookAt(0, 0, 0)

    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);

    renderer.setRenderTarget(null);
    renderer.render(renderScene, renderCamera);

    // renderer.setRenderTarget(null);
    // renderer.render(scene, camera);

    requestAnimationFrame(animate);
};

setupKeyControls();
animate();


function updatePosition(position) {
    //camera.position.x = position.x;
    //camera.position.y = position.y;
    //camera.position.z = position.z;
}

function setFOV(fov) {
    //camera.fov = fov;
}

function setupKeyControls() {
    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 37:
                camera.position.x -= 0.03
                console.log(e.keyCode)
                break;
            case 39:
                // camera.eyeSep = -0.03;
                // camera.update(camera.cameraL);
                camera.position.x += 0.03
                console.log(e.keyCode)
                break;
            case 38:
                
                //camera.cameraL.position.set(0, 0, camera.cameraL.position.z + 0.1)
                // camera.update(camera.cameraL);
                
                break;
            default:
             
                break;
            // case 40:
            // cube.rotation.z += 0.1;
            // break;
        }
    };
}
