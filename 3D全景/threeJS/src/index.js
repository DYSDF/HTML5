/**
 * Created by 断崖 on 2016/11/4.
 */

window.onload = function () {
    (function () {

        var camera, scene, renderer, texture_placeholder;

        var isUserInteracting = false,
            lastRadian = null,
            onMouseDownMouseX = 0,
            onMouseDownMouseY = 0,
            lon = 90, onMouseDownLon = 0,
            lat = 0, onMouseDownLat = 0,
            phi = 0, theta = 0,
            target = new THREE.Vector3();

        function init() {
            var container, mesh;

            container = document.getElementById('container');
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
            scene = new THREE.Scene();

            texture_placeholder = document.createElement('canvas');
//            texture_placeholder.width = 128;
//            texture_placeholder.height = 128;

            var context = texture_placeholder.getContext('2d');
            context.fillStyle = 'rgb( 255, 255, 255 )';
            context.fillRect(0, 0, texture_placeholder.width, texture_placeholder.height);

            var materials = [
                loadTexture('img/px.jpg'), // right
                loadTexture('img/nx.jpg'), // left
                loadTexture('img/py.jpg'), // top
                loadTexture('img/ny.jpg'), // bottom
                loadTexture('img/pz.jpg'), // back
                loadTexture('img/nz.jpg')  // front
            ];

            mesh = new THREE.Mesh(new THREE.BoxGeometry(300, 300, 300, 7, 7, 7), new THREE.MultiMaterial(materials));
            mesh.scale.x = -1;
            scene.add(mesh);

            renderer = new THREE.CanvasRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);

            document.addEventListener('mousedown', onDocumentMouseDown, false);
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('mouseup', onDocumentMouseUp, false);
//        document.addEventListener('wheel', onDocumentMouseWheel, false);

            document.addEventListener('touchstart', onDocumentTouchStart, false);
            document.addEventListener('touchmove', onDocumentTouchMove, false);
            document.addEventListener('touchend', onDocumentTouchEnd, false);

            window.addEventListener('resize', onWindowResize, false);

            window.addEventListener("deviceorientation", function (event) {
                if (isUserInteracting) {
                    lastRadian = event.beta;
                } else {
                    if (lastRadian == null) lastRadian = event.beta;
                    lon = (event.beta - lastRadian) + onMouseDownLon;
                }
            }, true);

        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function loadTexture(path) {
            var texture = new THREE.Texture(texture_placeholder);
            var material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});

            var image = new Image();
            image.onload = function () {
                texture.image = this;
                texture.needsUpdate = true;
            };
            image.src = path;
            return material;
        }

        function onDocumentMouseDown(event) {
            event.preventDefault();
            isUserInteracting = true;
            onMouseDownMouseX = event.clientX;
//            onMouseDownMouseY = event.clientY;
            onMouseDownLon = lon;
//            onMouseDownLat = lat;
        }

        function onDocumentMouseMove(event) {
            if (isUserInteracting === true) {
                lon = ( onMouseDownMouseX - event.clientX ) * 0.1 + onMouseDownLon;
//                lat = ( event.clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
            }
        }

        function onDocumentMouseUp(event) {
            isUserInteracting = false;
            onMouseDownLon = lon;
        }

        function onDocumentMouseWheel(event) {
            camera.fov += event.deltaY * 0.05;
            camera.updateProjectionMatrix();
        }

        function onDocumentTouchStart(event) {
            if (event.touches.length == 1) {
                event.preventDefault();
                isUserInteracting = true;
                onMouseDownMouseX = event.touches[0].pageX;
//                onMouseDownMouseY = event.touches[0].pageY;
                onMouseDownLon = lon;
//                onMouseDownLat = lat;
            }
        }

        function onDocumentTouchMove(event) {
            if (event.touches.length == 1) {
                event.preventDefault();
                lon = ( onMouseDownMouseX - event.touches[0].pageX ) * 0.1 + onMouseDownLon;
//                lat = ( event.touches[0].pageY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
            }
        }

        function onDocumentTouchEnd() {
            isUserInteracting = false;
            onMouseDownLon = lon;
        }

        function animate() {
            requestAnimationFrame(animate);
            update();
        }

        function update() {
//            if (isUserInteracting === false) {
//                lon += 0.1;
//            }
            lat = Math.max(-85, Math.min(85, lat));
            phi = THREE.Math.degToRad(90 - lat);
            theta = THREE.Math.degToRad(lon);

            target.x = 500 * Math.sin(phi) * Math.cos(theta);
            target.y = 500 * Math.cos(phi);
            target.z = 500 * Math.sin(phi) * Math.sin(theta);
            camera.lookAt(target);
            renderer.render(scene, camera);
        }

        init();
        animate();
    })();
};
