var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
var width = window.innerWidth;
var height = window.innerHeight;

const ratio = width / height;

const offset = 1;
const cwidth = 1 * ratio * offset;
const cheight = 1 * offset;
let screenHeightM = 0.14;//0.165;


var screenCamera = new THREE.OrthographicCamera(cwidth / - 2, cwidth / 2, cheight / 2, cheight / - 2, 1, 1000);
screenCamera.position.z = 2;
screenCamera.position.x = 0;
screenCamera.position.y = 0;
screenCamera.lookAt(0, 0, 0);

var renderCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
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
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
cube.position.x = 0;
cube.position.z = -0.26;
cube.position.y = 0.05;
scene.add(cube);



var redmaterial = new THREE.MeshBasicMaterial({ color: 0x0f00f0 });

var cube = new THREE.Mesh(geometry, redmaterial);
cube.position.x = 0.1;
cube.position.z = -0.3;
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
rectangle.position.y = screenHeightM / 2;

//scene.add(rectangle);

var blackmaterial = new THREE.MeshBasicMaterial({ color: 0x00000 });

var tablegeometry = new THREE.BoxGeometry(3, 0.001, 1.2);
var table = new THREE.Mesh(tablegeometry, blackmaterial);
scene.add(table);




camera.position.z = -1;
camera.position.x = 0;
camera.position.y = 0.2;


let target = new THREE.Vector3();
let speed = 0.5;


let finalCamera;

function toScreenSpace(pos) {
    var widthHalf = width / 2;
    var heightHalf = height / 2;

    pos.project(camera);
    return pos;

    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;

    pos.x /= width;
    pos.y /= height;
    return pos;
}

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

   

    // let a = camera.position.x;
    // let b = camera.position.y;
    // let c = camera.position.z;

    // camera.projectionMatrix
    //     .set(1 - c, 0, 0, 0,
    //         0, 1 - c, 0, 0,
    //         a, b, 1, 1,
    //         -a, -b, -c, 1);


    // let pos = new THREE.Vector3(0, 0, 0);
    // pos = pos.project(camera);
    // pos = pos.clone();

    // let depth = pos.z;
    // if (depth < 10 && depth > -10) {
    //     pos = pos.clone();

    //     pos = pos.clone();

    //     pos = pos.clone();
    //     pos.unproject(camera);


    //     var l = 1;


    //     let tl = new THREE.Vector3(-l, l, depth);
    //     tl.unproject(camera);
    //     tl.z = 0;


    //     d = pos.z;
    //     let tr = new THREE.Vector3(l, l, d);
    //     tr.unproject(camera);


    //     console.log(tr.z)
    //     tr.z = 0;

    //     let bl = new THREE.Vector3(-l, -l, depth);
    //     bl.unproject(camera);
    //     bl.z = 0;

    //     let br = new THREE.Vector3(l, -l, depth);
    //     br.unproject(camera);
    //     br.z = 0;


    //     var verts = renderrectgeometry.vertices;

    //     verts[0].x = tl.x;
    //     verts[0].y = tl.y;

    //     verts[1].x = tr.x;
    //     verts[1].y = tr.y;

    //     verts[2].x = bl.x;
    //     verts[2].y = bl.y;

    //     verts[3].x = br.x;
    //     verts[3].y = br.y;


    //     console.log({ verts: renderrectgeometry.vertices });

    //     rectgeometry.verticesNeedUpdate = true;
    // }





    // var pos = rectangle.position.clone();
    // //console.log({ pos })
    // // pos.unproject(camera);
    // // console.log({ pos })

    // rectWidthHalf = screenHeightM / 2 * ratio;
    // rectHeightHalf = screenHeightM / 2;
    // // //rectWidthHalf *= 2;

    // var tl = pos.clone();
    // tl.x -= rectWidthHalf;
    // tl.y += rectHeightHalf;
    // tlS = toScreenSpace(tl);

    // var tr = pos.clone();
    // tr.x += rectWidthHalf;
    // tr.y += rectHeightHalf;
    // trS = toScreenSpace(tr);

    // var bl = pos.clone();
    // bl.x -= rectWidthHalf;
    // bl.y -= rectHeightHalf;
    // blS = toScreenSpace(bl);

    // var br = pos.clone();
    // br.x += rectWidthHalf;
    // br.y -= rectHeightHalf;
    // brS = toScreenSpace(br);




    // let finalDestCoords = cv.matFromArray(4, 1, cv.CV_32FC2,
    //     [-1, 1,
    //         1, 1,
    //         1, -1,
    //     -1, -1]);

    // let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);

    // let M = cv.getPerspectiveTransform(srcCoords, finalDestCoords);


    // let te = new cv.Mat();
    // M.convertTo(te, cv.CV_32FC1);


    // m = new THREE.Matrix4();

    // // m.set(
    // //     te.floatAt(0, 0), te.floatAt(0, 1), te.floatAt(0, 2), 0,
    // //     te.floatAt(1, 0), te.floatAt(1, 1), te.floatAt(1, 2), 0,
    // //     te.floatAt(2, 0), te.floatAt(2, 1), te.floatAt(2, 2), 0,
    // //     0, 0, 0, 1
    // // )

    // m.set(
    //     M.doubleAt(0, 0), M.doubleAt(0, 1), M.doubleAt(0, 2), 0,
    //     M.doubleAt(1, 0), M.doubleAt(1, 1), M.doubleAt(1, 2), 0,
    //     M.doubleAt(2, 0), M.doubleAt(2, 1), M.doubleAt(2, 2), 0,
    //     0, 0, 0, 1
    // )


    // finalCamera = camera.clone();

    // //finalCamera.projectionMatrix.multiply(m);
    // //finalCamera.projectionMatrix.multiply(new THREE.Matrix4().makeTranslation(0.3,0,0.1));
    // //finalCamera.projectionMatrix = new THREE.Matrix4().makeTranslation(0.3,0,0.1).multiply(finalCamera.projectionMatrix);
    // //finalCamera.projectionMatrix = m.multiply(finalCamera.projectionMatrix);


    // //finalCamera.projectionMatrix.multiply(m);
    // //finalCamera.updateMatrixWorld( true );

    // tl.applyMatrix4(m);
    // tr.applyMatrix4(m);
    // br.applyMatrix4(m);
    // bl.applyMatrix4(m);
    // //console.log({tl, tr, br, bl});

    // finalDestCoords.delete();
    // srcCoords.delete();
    // te.delete();
    // M.delete();
    // m.set( 11, 12, 13, 14,
    //     21, 22, 23, 24,
    //     31, 32, 33, 34,
    //     41, 42, 43, 44 );

    // var uvAttribute = renderrectgeometry.faceVertexUvs[0];

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

    // renderrectgeometry.uvsNeedUpdate = true;


    //camera.lookAt(0, 0, 0);
    //renderCamera.lookAt(0, 0, 0);


    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);

    // renderer.setRenderTarget(null);
    // renderer.render(renderScene, renderCamera);

    
    renderer.setRenderTarget(null);
    renderer.render(renderScene, screenCamera);


    // renderer.setRenderTarget(null);
    // renderer.render(renderScene, renderCamera);

    // renderer.setRenderTarget(null);
    // renderer.render(scene, finalCamera);

    requestAnimationFrame(animate);
};

setupKeyControls();
animate();


function updatePosition(position) {
    console.log(position.y)
    target.x = position.x;
    target.y = position.y;
    target.z = position.z;
}

function setFOV(fov) {
    //camera.fov = fov;
}

function setupKeyControls() {
    document.onkeydown = function (e) {
        console.log(e.keyCode)
        switch (e.keyCode) {
            case 65:
                renderCamera.position.x -= 0.01

                break;
            case 68:
                // camera.eyeSep = -0.03;
                // camera.update(camera.cameraL);
                renderCamera.position.x += 0.01
                break;
            case 87:
                //up
                renderCamera.position.z -= 0.03;
                //camera.cameraL.position.set(0, 0, camera.cameraL.position.z + 0.1)
                // camera.update(camera.cameraL);

                break;
            case 83:
                //up
                renderCamera.position.z += 0.03;
                //camera.cameraL.position.set(0, 0, camera.cameraL.position.z + 0.1)
                // camera.update(camera.cameraL);

                break;

            case 32:
                //up
                renderCamera.position.y += 0.03;
                //camera.cameraL.position.set(0, 0, camera.cameraL.position.z + 0.1)
                // camera.update(camera.cameraL);

                break;

            case 16:
                //up
                renderCamera.position.y -= 0.03;
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
