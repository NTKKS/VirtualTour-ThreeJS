var camera, renderer, scene, cube, geometry,mesh, plane, container, material, panoImg, width, height, aspect;

var isUserInteracting = false,
    onPointerDownMouseX = 0,
    onPointerDownMouseY = 0,
    lon = 0,
    onPointerDownLon = 0,
    lat = 0,
    onPointerDownLat = 0,
    phi = 0,
    theta = 0;
    zoomFactor = 1;
    currentRoom = 0;
    src ='';

var panoImg = ('img/1NP/vchod.jpg');
var spinner = document.getElementById('spinner');
var map = document.getElementById('map');
var zoom = true;
var zoomMap = false;
var freeze = false;

if(document.getElementById("btnCZ").classList.contains("active")){
    var rooms = ["Vchod budovy J", "J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8", "J9", "J10", "J11", "J12", "J13", "J14", "J15", "J16", "J17", "J18", "J19", "J20", "J21", "J22", "J23", "J24", "J25", "J26", "J27", "J28", "J29", "J30", "J31", "J32", "Relax zóna", "Recepce budovy J", "Šatní skříňky 1.NP", "Studijní oddělení", "Tiskové služby a IDV", "Hala v 2.NP", "Chodba v 2.NP", "Šatní skříňky 2.NP","Levé schodiště v 2.NP","Pravé schodiště v 2.NP","Vstup do budoby A", "Vstup do budovy S","Levé schodiště v 3.NP","Pravé schodiště v 3.NP","Plošina v 3.NP","Levé schodiště v 4.NP","Pravé schodiště v 4.NP","Zasedací místnost","Pánské toalety","Dámské toalety","Výtahy"];
}else if (document.getElementById("btnEN").classList.contains("active")){
    var rooms = ["Entrance to building J", "J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8", "J9", "J10", "J11", "J12", "J13", "J14", "J15", "J16", "J17", "J18", "J19", "J20", "J21", "J22", "J23", "J24", "J25", "J26", "J27", "J28", "J29", "J30", "J31", "J32", "Relax zone", "Reception - Building J", "Locker room - 1.NP", "Study departement", "Printing services and IDV", "Hall - 2.NP", "Corridor - 2.NP", "Locker room - 2.NP", "Left staircase - 2.NP", "Right staircase - 2.NP", "Entrance to building A", "Entrance to building S", "Left staircase - 3.NP", "Right staircase - 3.NP", "Platform - 3.NP", "Left staircase - 4.NP", "Right staircase - 4.NP", "Boardroom", "Men's toilets", "Women's toilets", "Elevator"];
}

init(panoImg);

function createCamera() {
    // Create a Camera
    width = window.innerWidth;
    height = window.innerHeight;
    aspect = width / height;
    var fov; // Field of View
    fov = 110-aspect*15;
    
    const near = 1; // the near clipping plane
    const far = 1100; // the far clipping plane

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.target = new THREE.Vector3(0, 0, 0);
}

function createObjects(panoImg) {

    const loadingManager = new THREE.LoadingManager(() => {});

    loadingManager.onStart = function (){
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.remove('fade-out');
    }

    loadingManager.onLoad = function ( ) {
        
        lon = 0;
        lat = 0;
        isUserInteracting = false;
        camera.fov = 110-camera.aspect*15;
        camera.updateProjectionMatrix();

        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        // optional: remove loader from DOM via event listener
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
    
    };

    loadingManager.onError = function ( url ) {
        console.log( 'There was an error loading ' + url );
        alert( 'There was an error loading ' + url );

    };

    if(geometry==undefined){
        geometry = new THREE.SphereBufferGeometry(500, 60, 40);
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale(-1, 1, 1);
    }

    var texture = new THREE.TextureLoader(loadingManager).load(panoImg);
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    //material.wireframe = true
    if(mesh==undefined){
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }else{
        mesh.geometry = geometry;
        mesh.material = material;
    }
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

function init(panoImg) {
    scene = new THREE.Scene();
    createCamera();
    createObjects(panoImg);
    createRenderer();
    animate();

}

function onTransitionEnd(event) {
    event.target.remove();
}

function arrows(room){
    if(room<0){
        room=58;
    }else if(room>58){
        room = 0;
    }
    changePanoImg(room)
}

/*
Change the background image
*/
function changePanoImg(room) {
    //console.log("room: "+room)
    
    currentRoom = room;
    spinner.innerHTML = '<section id="loading-screen"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></section>';
    const loadingScreen = document.getElementById('loading-screen');
    const roomName = document.getElementById('roomName');

    switch (room) {
        case 0:
            src = ('img/1np/vchod.jpg');
            roomName.innerHTML = rooms[0] + ' - 1.NP';
            break;
        case 33:
            src = ('img/1np/relax.jpg');
            roomName.innerHTML = rooms[33] + ' - 1.NP';
            break;
        case 34:
            src = ('img/1np/vstupniHala.jpg');
            roomName.innerHTML = rooms[34] + ' - 1.NP';
            break;
        case 35:
            src = ('img/1np/Satna1NP.jpg');
            roomName.innerHTML = rooms[35];
            break;
        case 36:
            src = ('img/1np/StudijniOddeleni.jpg');
            roomName.innerHTML = rooms[36] + ' - 1.NP';
            break;
        case 37:
            src = ('img/2np/CopyIDV.jpg');
            roomName.innerHTML = rooms[37] + ' - 2.NP';
            break;
        case 38:
            src = ('img/2np/hala2NP.jpg');
            roomName.innerHTML = rooms[38];
            break;
        case 39:
            src = ('img/2np/chodba2NP.jpg');
            roomName.innerHTML = rooms[39];
            break;
        case 40:
            src = ('img/2np/RelaxJ4.jpg');
            roomName.innerHTML = rooms[33] + ' - 2.NP';
            break;
        case 41:
            src = ('img/2np/RelaxJ7.jpg');
            roomName.innerHTML = rooms[33] + ' - 2.NP';
            break;
        case 42:
            src = ('img/2np/RelaxJ10.jpg');
            roomName.innerHTML = rooms[33] + ' - 2.NP';
            break;
        case 43:
            src = ('img/2np/RelaxJ14.jpg');
            roomName.innerHTML = rooms[33] + ' - 2.NP';
            break;
        case 44:
            src = ('img/2np/Satna2NP.jpg');
            roomName.innerHTML = rooms[40];
            break;
        case 45:
            src = ('img/2np/SchodisteL2NP.jpg');
            roomName.innerHTML = rooms[41];
            break;
        case 46:
            src = ('img/2np/SchodisteP2NP.jpg');
            roomName.innerHTML = rooms[42];
            break;
        case 47:
            src = ('img/2np/vstupA.jpg');
            roomName.innerHTML = rooms[43] + ' - 2.NP';
            break;
        case 48:
            src = ('img/2np/vstupS.jpg');
            roomName.innerHTML = rooms[44] + ' - 2.NP';
            break;
        case 49:
            src = ('img/3np/RelaxJ20.jpg');
            roomName.innerHTML = rooms[33] + ' - 3.NP';
            break;
        case 50:
            src = ('img/3np/RelaxJ24.jpg');
            roomName.innerHTML = rooms[33] + ' - 3.NP';
            break;
        case 51:
            src = ('img/3np/SchodisteL3NP.jpg');
            roomName.innerHTML = rooms[45];
            break;
        case 52:
            src = ('img/3np/SchodisteP3NP.jpg');
            roomName.innerHTML = rooms[46];
            break;
        case 53:
            src = ('img/3np/plosina.jpg');
            roomName.innerHTML = rooms[47];
            break;
        case 54:
            src = ('img/4np/RelaxJ30.jpg');
            roomName.innerHTML = rooms[33] + ' - 4.NP';
            break;
        case 55:
            src = ('img/4np/RelaxJ31.jpg');
            roomName.innerHTML = rooms[33] + ' - 4.NP';
            break;
        case 56:
            src = ('img/4np/SchodisteL4NP.jpg');
            roomName.innerHTML = rooms[48];
            break;
        case 57:
            src = ('img/4np/SchodisteP4NP.jpg');
            roomName.innerHTML = rooms[49];
            break;
        case 58:
            src = ('img/1np/zasedaciMistnost.jpg');
            roomName.innerHTML = rooms[50] + ' - 1.NP';
            break;
        case 59:
            src = ('img/1np/zachodyPanske1NP.jpg');
            roomName.innerHTML = rooms[51] + ' - 1.NP';
            break;
        case 60:
            src = ('img/1np/zachodyDamske1NP.jpg');
            roomName.innerHTML = rooms[52] + ' - 1.NP';
            break;
        case 61:
            src = ('img/1np/vytah.jpg');
            roomName.innerHTML = rooms[53];
            break;
        case 62:
            src = ('img/2np/zachodyPanske2NP.jpg');
            roomName.innerHTML = rooms[51] + ' - 2.NP';
            break;
        case 63:
            src = ('img/2np/zachodyDamske2NP.jpg');
            roomName.innerHTML = rooms[52] + ' - 2.NP';
            break;
        case 64:
            src = ('img/3np/zachodyPanske3NP.jpg');
            roomName.innerHTML = rooms[51] + ' - 3.NP';
            break;
        case 65:
            src = ('img/3np/zachodyDamske3NP.jpg');
            roomName.innerHTML = rooms[52] + ' - 3.NP';
           break;
           case 66:
            src = ('img/3np/zachodyPanske3NP.jpg');
            roomName.innerHTML = rooms[51] + ' - 4.NP';
            break;
        case 67:
            src = ('img/3np/zachodyDamske3NP.jpg');
            roomName.innerHTML = rooms[52] + ' - 4.NP';
            break;


        default:
            //alert(room + " clicked")
            if (room <= 15) {
                src = ('img/2np/J' + room + '.jpg');
                roomName.innerHTML = rooms[room] + ' - 2.NP';
            } else if (room > 15 && room <= 25) {
                src = ('img/3np/J' + room + '.jpg');
                roomName.innerHTML = rooms[room] + ' - 3.NP';
            } else {
                src = ('img/4np/J' + room + '.jpg');
                roomName.innerHTML = rooms[room] + ' - 4.NP';
            }
            break;
    }
    createObjects(src);
    $("#exampleModal").modal("hide");
    lon = 0;
    lat = 0;
    isUserInteracting = false;
    camera.fov = 110-camera.aspect*15;
    camera.updateProjectionMatrix();
}

function freezePano() {
    freeze = !freeze;
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = 110-camera.aspect*15;
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

    if (!freeze) {
        if (event.isPrimary === false) return;

        lon = (onPointerDownMouseX - event.clientX) * (0.0025 * camera.fov) + onPointerDownLon;
        lat = (event.clientY - onPointerDownMouseY) * (0.0025 * camera.fov) + onPointerDownLat;
    }
}

function onPointerUp() {

    if (event.isPrimary === false) return;

    // stop rotation after interaction
    isUserInteracting = true;

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

}

function onDocumentMouseWheel(event) {

    if (!freeze) {
        // stop rotation after interaction
        isUserInteracting = true;

        var fov = camera.fov + event.deltaY * 0.05;

        camera.fov = THREE.MathUtils.clamp(fov, 10, 120);

        camera.updateProjectionMatrix();
    } else {
        if (zoomFactor > 1) {
            zoomMap = true;
        } else {
            zoomMap = false;
        }
        zoomFactor += (-event.deltaY) * 0.001;
        zoomFactor = THREE.MathUtils.clamp(zoomFactor, 1, 5);
        map.style.transformOrigin = '0% 0%';
        map.style.transform = 'scale(' + zoomFactor + ')';
        $('#exampleModal').modal('handleUpdate');
    }

}

document.addEventListener('dblclick', onDblClick);

function onDblClick(event) {

    if (!freeze) {
        // stop rotation after interaction
        isUserInteracting = true;

        if (zoom) {
            camera.fov = camera.fov/2;
        } else {
            camera.fov = camera.fov*2;;
        }

        zoom = !zoom;

        camera.updateProjectionMatrix();
    } else {

        if (!zoomMap) {
            map.classList.add('zoom');
            zoomFactor = 2;
            map.style.transformOrigin = '0 0';
            map.style.transform = 'scale(' + zoomFactor + ')';
        } else {
            map.classList.remove('zoom');
            zoomFactor = 1;
            map.style.transformOrigin = '0 0';
            map.style.transform = 'scale(' + zoomFactor + ')';
        }

        zoomMap = !zoomMap;
    }
}

function animate() {
    requestAnimationFrame(animate);
    update()
};

function update() {

    if (isUserInteracting === false) {

        lon += 0.15;
        if(lon>=360.0){
            currentRoom+=1;
            if(currentRoom>58){
                currentRoom = 0;
            }
            changePanoImg(currentRoom);
        }

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