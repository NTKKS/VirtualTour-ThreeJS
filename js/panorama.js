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

init();

function createCamera() {
    // Create a Camera
    width = window.innerWidth;
    height = window.innerHeight;
    aspect = width / height;
    const fov = 75; // Field of View
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

function createObjects() {
    geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    var texture = new THREE.TextureLoader().load('img/koleje.jpg');
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

    container.style.touchAction = 'none';
    container.addEventListener('pointerdown', onPointerDown, false);

    document.addEventListener('wheel', onDocumentMouseWheel, false);
}

function init() {

    scene = new THREE.Scene();
    createCamera();
    //createLights();
    createObjects();
    createRenderer();
    animate();
}

/*
Change the background image
*/
function changePanoImg(room){
    //console.log("room: "+room)
    switch (room) {
        case 33:
            mesh.material.map.image.src = ('img/1np/relax.jpg')
            break;
        case 34:
            mesh.material.map.image.src = ('img/1np/vstupniHala.jpg')
            break;
        case 0:
            mesh.material.map.image.src = ('img/1np/vchod.jpg')
            break;
        
        default:
            alert(room + " clicked")
            if(room<=15){
                mesh.material.map.image.src = ('img/2np/J'+room+'.jpg');
            }else if(room>15&&room<=25){
                mesh.material.map.image.src = ('img/3np/J'+room+'.jpg');
            }else{
                mesh.material.map.image.src = ('img/4np/J'+room+'.jpg');
            }
            break;
    }
    mesh.material.map.needsUpdate = true;
    $("#exampleModal").modal("hide");
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

    lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;

}

function onPointerUp() {

    if (event.isPrimary === false) return;

    isUserInteracting = false;

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

}

function onDocumentMouseWheel(event) {

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