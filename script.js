let videoWidth, videoHeight;

// whether streaming video from the camera.
let streaming = false;

let video = document.getElementById('video');
let canvasOutput = document.getElementById('canvasOutput');
let canvasOutputCtx = canvasOutput.getContext('2d');
let stream = null;

let detectFace = document.getElementById('face');

function startCamera() {
    if (streaming) return;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (s) {
            stream = s;
            video.srcObject = s;
            video.play();
        })
        .catch(function (err) {
            console.log("An error occured! " + err);
        });

    video.addEventListener("canplay", function (ev) {
        if (!streaming) {
            videoWidth = video.videoWidth;
            videoHeight = video.videoHeight;
            video.setAttribute("width", videoWidth);
            video.setAttribute("height", videoHeight);
            canvasOutput.width = videoWidth;
            canvasOutput.height = videoHeight;
            streaming = true;
        }
        startVideoProcessing();
    }, false);
}

let faceClassifier = null;

let src = null;
let dstC1 = null;
let dstC3 = null;
let dstC4 = null;

let canvasInput = null;
let canvasInputCtx = null;

let canvasBuffer = null;
let canvasBufferCtx = null;

function startVideoProcessing() {
    if (!streaming) { console.warn("Please startup your webcam"); return; }
    stopVideoProcessing();
    canvasInput = document.createElement('canvas');
    canvasInput.width = videoWidth;
    canvasInput.height = videoHeight;
    canvasInputCtx = canvasInput.getContext('2d');

    canvasBuffer = document.createElement('canvas');
    canvasBuffer.width = videoWidth;
    canvasBuffer.height = videoHeight;
    canvasBufferCtx = canvasBuffer.getContext('2d');

    srcMat = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
    grayMat = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC1);

    faceClassifier = new cv.CascadeClassifier();

    faceClassifier.load('haarcascade_frontalface_default.xml');

    requestAnimationFrame(processVideo);
}

function processVideo() {
    canvasInputCtx.drawImage(video, 0, 0, videoWidth, videoHeight);
    let imageData = canvasInputCtx.getImageData(0, 0, videoWidth, videoHeight);
    srcMat.data.set(imageData.data);
    cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);
    let faces = [];
    let eyes = [];
    let size;
    let faceVect = new cv.RectVector();
    let faceMat = new cv.Mat();
    cv.pyrDown(grayMat, faceMat);
    cv.pyrDown(faceMat, faceMat);
    size = faceMat.size();
    faceClassifier.detectMultiScale(faceMat, faceVect);
    for (let i = 0; i < faceVect.size(); i++) {
        let face = faceVect.get(i);
        faces.push(new cv.Rect(face.x, face.y, face.width, face.height));
    }
    faceMat.delete();
    faceVect.delete();
    canvasOutputCtx.drawImage(canvasInput, 0, 0, videoWidth, videoHeight);

    if (faces.length > 0) {
        let xRatio = videoWidth / size.width;
        let yRatio = videoHeight / size.height;
        let face = faces[0];

        x = face.x + face.width / 2.0;
        y = face.y + face.height / 2.0;

        x *= xRatio;
        y *= yRatio;

        x -= videoWidth / 2;
        y -= videoHeight / 2;


        x /= videoWidth;
        y /= videoHeight;


        x = -x;
        y = -y;
        z = 1 / face.width * 60
        x /= z;
        y /= z;


        factor = 1;
        x *= factor;
        y *= factor;

        //60cm, 50pixels
        //30cm, 75 pixel width
        //24cm, 100 pixels

        //console.log({width: face.width, z})
        updatePosition({ x, y, z });


    }


    drawResults(canvasOutputCtx, faces, 'red', size);
    drawResults(canvasOutputCtx, eyes, 'yellow', size);
    requestAnimationFrame(processVideo);

}

function drawResults(ctx, results, color, size) {
    for (let i = 0; i < results.length; ++i) {
        let rect = results[i];
        let xRatio = videoWidth / size.width;
        let yRatio = videoHeight / size.height;
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.strokeRect(rect.x * xRatio, rect.y * yRatio, rect.width * xRatio, rect.height * yRatio);
    }
}

function stopVideoProcessing() {
    if (src != null && !src.isDeleted()) src.delete();
    if (dstC1 != null && !dstC1.isDeleted()) dstC1.delete();
    if (dstC3 != null && !dstC3.isDeleted()) dstC3.delete();
    if (dstC4 != null && !dstC4.isDeleted()) dstC4.delete();
}

function stopCamera() {
    if (!streaming) return;
    stopVideoProcessing();
    document.getElementById("canvasOutput").getContext("2d").clearRect(0, 0, width, height);
    video.pause();
    video.srcObject = null;
    stream.getVideoTracks()[0].stop();
    streaming = false;
}

function initUI() {
}

function opencvIsReady() {
    console.log('OpenCV.js is ready');
    initUI();
    startCamera();
}