let w;
let h;
let stars = [];

let origin;
let spawnpoint;
let mouseVec;
let followVec;
let turnrate = Math.pow(20 / 100.0, 2);;
let turboSpeed = 5; // default: 8
let tracking = 2; // 0 = set angle, 1 = mouse tracking, 2 = perlin noise tracking
let mouseVecAngle = 225;
let offsetX = Math.random() * 1000;
let offsetY = Math.random() * 1000;

// global audio array, computated by wallpaperAudioListener()
let nrofBands = 32; // currently not in use
let normTop = 0.1;
let noiseGate = 0.1;
let bandCount = 0;

let audArr = new Array(nrofBands); // currently not in use
let bass = 0;
