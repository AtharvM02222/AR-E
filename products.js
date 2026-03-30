/* ─── PRODUCTS CONFIG ─────────────────────────────────────────────────────
   ─────────────────────────────────────────────────────────────────────────
   HOW TO UPDATE:
   • Change price  → just change the number after "price:"
   • Change name   → change the text after "name:"
   • Add product   → copy one { ... } block, paste before the last ],
                     change the values, save.
   • Remove product→ delete the whole { ... } block (including the comma)
   • Add a photo   → paste an image URL between the "" after "image:"
                     (leave "" to use the emoji icon instead)
   ─────────────────────────────────────────────────────────────────────────
   BADGE options: "BESTSELLER" | "NEW" | "PRO" | "LIMITED" | ""
──────────────────────────────────────────────────────────────────────── */

var PRODUCTS = [
  {
    name: "RoboSoccer Pro",
    tag: "Soccer Bot",
    desc: "Bluetooth-controlled soccer robot. 360° spin, rubber grip wheels, LED headlights. Built for competition.",
    price: 2499,
    icon: "⚽",
    image: "",
    badge: "BESTSELLER"
  },
  {
    name: "SkyDrone X1",
    tag: "Drone",
    desc: "Foldable mini drone. Altitude hold, 720p camera, 20-min flight time. Perfect for beginners.",
    price: 4999,
    icon: "🚁",
    image: "",
    model: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb",
    badge: "NEW"
  },
  {
    name: "LineTracer Bot",
    tag: "Starter Kit",
    desc: "IR sensor line-following robot. Learn robotics basics. Fully programmable via Arduino.",
    price: 899,
    icon: "🤖",
    image: "",
    badge: ""
  },
  {
    name: "ArmBot 6-Axis",
    tag: "Robotic Arm",
    desc: "6-DOF robotic arm with servo motors and joystick controller. Precision pick-and-place.",
    price: 6499,
    icon: "🦾",
    image: "",
    model: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Cube/glTF-Binary/Cube.glb",
    badge: "PRO"
  },
  {
    name: "RacerBot Turbo",
    tag: "RC Car",
    desc: "High-speed RC car. 2.4GHz remote, shock absorbers, 30km/h top speed. Built for rough terrain.",
    price: 1799,
    icon: "🏎️",
    image: "",
    badge: ""
  },
  {
    name: "SwarmBot Kit",
    tag: "Advanced",
    desc: "Build a swarm of 3 mini bots that communicate via IR. Explore swarm intelligence.",
    price: 3299,
    icon: "🔬",
    image: "",
    badge: "LIMITED"
  }
];
