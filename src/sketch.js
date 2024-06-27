var camera, clock, scene, renderer, composer, stats;
wait()

var loader, model, anim, mixer, mesh;

var z = 0
var x = 0

function wait() {
    if (typeof THREE === "undefined") { requestAnimationFrame(wait) } else { start() }
}

function start() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xdddddd)

    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.01, 100000);
    camera.updateProjectionMatrix()
    camera.position.z = 400
    camera.position.y = 400

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace


    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock()

    setupEventHandlers()

    ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xffffff, 5)
    dirLight.position.set(0, 2, 5)
    scene.add(dirLight)

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    stats = new Stats()
    document.body.appendChild(stats.dom)

    loader = new GLTFLoader()
    loader.load("shapekeytest.glb", (e) => {
        model = e.scene.children[0]
        mesh = new THREE.InstancedMesh(model.geometry, model.material, 54)
        var matrix = new THREE.Matrix4();
        for (var i = 0; i < 54; i++) {
            model.position.set(150 * x, 0, z);
            model.updateMatrix();
            x++
            if (x == 9) {
                z += 150
                x = 0
            }
            mesh.setMatrixAt(i, model.matrix);
        }
        scene.add(mesh)
        //scene.add(model)
        mixer = new THREE.AnimationMixer(model)
        action = mixer.clipAction(e.animations[1])
        action.play()
        update()
    })


}


function update() {
    requestAnimationFrame(update)
    stats.update()
    try {
        for (var i = 0; i < 54; i++) {
            mixer.setTime(clock.getElapsedTime())
            mesh.setMorphAt(i, model)
        }
    } catch (e) {
    }
    mesh.morphTexture.needsUpdate = true;
    renderer.render(scene, camera);
    composer.render();
}


function handleKeyDown(event) {

    let keyCode = event.keyCode;

    //console.log(keyCode)


    switch (keyCode) {
        case 87: //W: FORWARD
            break;

        case 83: //S: BACK
            break;

        case 65: //A: LEFT
            break;

        case 68: //D: RIGHT
            break;

        case 66: //D: RIGHT
            break;
    }
}

function handleKeyUp(event) {

    let keyCode = event.keyCode;

    switch (keyCode) {
        case 87: //FORWARD
            break;

        case 83: //BACK
            break;

        case 65: //LEFT
            break;

        case 68: //RIGHT
            break;

        case 66: //D: RIGHT
            break;

    }

}

function setupEventHandlers() {
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
}



