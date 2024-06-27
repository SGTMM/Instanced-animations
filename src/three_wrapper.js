import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import Stats from 'three/examples/jsm/libs/stats.module'

window.THREE = THREE
window.OrbitControls = OrbitControls
window.PointerLockControls = PointerLockControls
window.GLTFLoader = GLTFLoader
window.ConvexGeometry = ConvexGeometry
window.Stats = Stats

import { BloomEffect, GodRaysEffect, EffectComposer, EffectPass, RenderPass, ShaderPass } from "postprocessing";

window.BloomEffect = BloomEffect
window.EffectComposer = EffectComposer
window.EffectPass = EffectPass
window.RenderPass = RenderPass
window.GodRaysEffect = GodRaysEffect
window.ShaderPass = ShaderPass

import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'

window.vertexShader = vertexShader
window.fragmentShader = fragmentShader

