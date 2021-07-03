import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  Effect,
  ShaderMaterial,
  SceneLoader,
} from "babylonjs"
import vertex from "./custom.vert"
import fragment from "./custom.frag"
import capsule from "./glb/capsule.glb"
import "babylonjs-loaders"

// Get the canvas DOM element
var canvas = document.getElementById("canvas") as HTMLCanvasElement
// Load the 3D engine
var engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})

let sphere: Mesh | null = null
let mat: ShaderMaterial | null = null
// CreateScene function that creates and return the scene
var createScene = function(){
    // Create a basic BJS Scene object
    var scene = new Scene(engine)
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene)
    // Target the camera to scene origin
    camera.setTarget(Vector3.Zero())
    // Attach the camera to the canvas
    camera.attachControl(canvas, false)
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene)
    // Create a built-in "sphere" shape its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    sphere = Mesh.CreateSphere("sphere1", 32, 2, scene, false, BABYLON.Mesh.FRONTSIDE)
    // Return the created scene
    Effect.ShadersStore["customVertexShader"] = vertex 
    Effect.ShadersStore["customFragmentShader"] = fragment
    mat = new ShaderMaterial("custom", scene, {
      vertex: "custom",
      fragment: "custom",
    }, {
      attributes: ["position", "normanl", "uv"],
      uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time"]
    })
    sphere.material = mat
    const sphere2 = Mesh.CreateSphere("sphere1", 32, 2, scene, false, BABYLON.Mesh.FRONTSIDE)
    const cube = Mesh.CreateBox("cube", 0.5, scene, false, BABYLON.Mesh.FRONTSIDE)
    cube.position.y = 1.5
    cube.rotation.set(0, 1, 1)
    loadGlb(scene)
    return scene
}
// call the createScene function
var scene = createScene()
// run the render loop
let t = 0
engine.runRenderLoop(function(){
    scene.render()
    sphere?.position.set(Math.sin(t), 0 , 0)
    mat?.setFloat("time", t)
    t += 0.01
})

async function loadGlb(scene: Scene) {
  const res = await SceneLoader.ImportMeshAsync(null, "", capsule, scene)
  res.meshes[0].scaling.set(0.5, 0.5, 0.5)
  res.meshes[0].position.set(-0.5, -0.5, 0.5)
}
// the canvas/window resize event handler
window.addEventListener("resize", function(){
    engine.resize()
})