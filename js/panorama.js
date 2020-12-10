var camera, renderer, scene, cube, geometry, plane, container, material, panoImg, width, height, aspect;

var isUserInteracting = false,
    onPointerDownMouseX = 0,
    onPointerDownMouseY = 0,
    lon = 0,
    onPointerDownLon = 0,
    lat = 0,
    onPointerDownLat = 0,
    phi = 0,
    theta = 0;

var panoImg = ('img/1NP/vchod.jpg');
var spinner = document.getElementById('spinner');

init(panoImg);

function createCamera() {
    // Create a Camera
    width = window.innerWidth;
    height = window.innerHeight;
    aspect = width / height;
    const fov = 90; // Field of View
    const near = 1; // the near clipping plane
    const far = 1100; // the far clipping plane

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //camera.position.z = 5;
    camera.target = new THREE.Vector3(0, 0, 0);
}

/* function createLights() {
    // Create a point light
    const light = new THREE.PointLight(0xff0000, 1, 30);
    light.position.set(5, 5, 5);
    scene.add(light);
} */

function createObjects(panoImg) {

    const loadingManager = new THREE.LoadingManager(() => {

        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');

        lon = 0;
        isUserInteracting = false;
        camera.fov = 85;
        camera.updateProjectionMatrix();

        // optional: remove loader from DOM via event listener
        loadingScreen.addEventListener('transitionend', onTransitionEnd);

    });

    geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);
    
    var texture = new THREE.TextureLoader(loadingManager).load(panoImg);
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
}

function createRenderer() {
    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    //document.body.appendChild(renderer.domElement);
    container.appendChild(renderer.domElement);

    //container.style.touchAction = 'none';
    container.addEventListener('pointerdown', onPointerDown, false);

    document.addEventListener('wheel', onDocumentMouseWheel, false);
}

function init(panoImg) {

    scene = new THREE.Scene();
    createCamera();
    //createLights();
    createObjects(panoImg);
    createRenderer();
    animate();

}

function onTransitionEnd(event) {
    event.target.remove();
}

/*
Change the background image
*/
function changePanoImg(room) {
    //console.log("room: "+room)
    spinner.innerHTML = '<section id="loading-screen"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></section>';
    const loadingScreen = document.getElementById('loading-screen');
    
    switch (room) {
        case 0:
            mesh.material.map.image.src = ('img/1np/vchod.jpg')
            break;
        case 33:
            mesh.material.map.image.src = ('img/1np/relax.jpg')
            break;
        case 34:
            mesh.material.map.image.src = ('img/1np/vstupniHala.jpg')
            break;
        case 35:
            mesh.material.map.image.src = ('img/1np/Satna1NP.jpg')
            break;
        case 36:
            mesh.material.map.image.src = ('img/1np/StudijniOddeleni.jpg')
            break;
        case 37:
            mesh.material.map.image.src = ('img/2np/CopyIDV.jpg')
            break;
        case 38:
            mesh.material.map.image.src = ('img/2np/hala2NP.jpg')
            break;
        case 39:
            mesh.material.map.image.src = ('img/2np/chodba2NP.jpg')
            break;
        case 40:
            mesh.material.map.image.src = ('img/2np/RelaxJ4.jpg')
            break;
        case 41:
            mesh.material.map.image.src = ('img/2np/RelaxJ7.jpg')
            break;
        case 42:
            mesh.material.map.image.src = ('img/2np/RelaxJ10.jpg')
            break;
        case 43:
            mesh.material.map.image.src = ('img/2np/RelaxJ14.jpg')
            break;
        case 44:
            mesh.material.map.image.src = ('img/2np/Satna2NP.jpg')
            break;
        case 45:
            mesh.material.map.image.src = ('img/2np/SchodisteL2NP.jpg')
            break;
        case 46:
            mesh.material.map.image.src = ('img/2np/SchodisteP2NP.jpg')
            break;
        case 47:
            mesh.material.map.image.src = ('img/2np/vstupA.jpg')
            break;
        case 48:
            mesh.material.map.image.src = ('img/2np/vstupS.jpg')
            break;
        case 49:
            mesh.material.map.image.src = ('img/3np/RelaxJ20.jpg')
            break;
        case 50:
            mesh.material.map.image.src = ('img/3np/RelaxJ24.jpg')
            break;
        case 51:
            mesh.material.map.image.src = ('img/3np/SchodisteL3NP.jpg')
            break;
        case 52:
            mesh.material.map.image.src = ('img/3np/SchodisteP3NP.jpg')
            break;
        case 53:
            mesh.material.map.image.src = ('img/3np/plosina.jpg')
            break;
        case 54:
            mesh.material.map.image.src = ('img/4np/RelaxJ30.jpg')
            break;
        case 55:
            mesh.material.map.image.src = ('img/4np/RelaxJ31.jpg')
            break;
        case 56:
            mesh.material.map.image.src = ('img/4np/SchodisteL4NP.jpg')
            break;
        case 57:
            mesh.material.map.image.src = ('img/4np/SchodisteP4NP.jpg')
            break;


        default:
            //alert(room + " clicked")
            if (room <= 15) {
                mesh.material.map.image.src = ('img/2np/J' + room + '.jpg');
            } else if (room > 15 && room <= 25) {
                mesh.material.map.image.src = ('img/3np/J' + room + '.jpg');
            } else {
                mesh.material.map.image.src = ('img/4np/J' + room + '.jpg');
            }
            break;
    }
    //console.log(mesh.material.map.image.src)
    mesh.material.map.needsUpdate = true;
    $("#exampleModal").modal("hide");
    loadingScreen.classList.add('fade-out');
    loadingScreen.addEventListener('transitionend', onTransitionEnd);
    lon = 0;
    isUserInteracting = false;
    camera.fov = 85;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onPointerDown(event) {

    if (event.isPrimary === false) return;

    isUserInteracting = true;

    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

    document.addEventListener('pointermove', onPointerMove, false);
    document.addEventListener('pointerup', onPointerUp, false);

}

function onPointerMove(event) {

    if (event.isPrimary === false) return;

    lon = (onPointerDownMouseX - event.clientX) * 0.2 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseY) * 0.2 + onPointerDownLat;

}

function onPointerUp() {

    if (event.isPrimary === false) return;

    // stop rotation after interaction
    isUserInteracting = true;

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

}

function onDocumentMouseWheel(event) {

    // stop rotation after interaction
    isUserInteracting = true;

    var fov = camera.fov + event.deltaY * 0.05;

    camera.fov = THREE.MathUtils.clamp(fov, 10, 120);

    camera.updateProjectionMatrix();

}

function animate() {
    requestAnimationFrame(animate);
    update()
};

function update() {

    if (isUserInteracting === false) {

        lon += 0.1;

    }

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);

    renderer.render(scene, camera);

}