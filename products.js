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
    name: "FPV Racing Drone",
    tag: "FPV Racer",
    desc: "High-speed FPV racing build on a carbon fiber frame. Betaflight-tuned for maximum agility. 10km radio range. Hand-soldered FC + ESC stack.",
    price: 12999,
    icon: "⚡",
    image: "",
    badge: "BESTSELLER"
  },
  {
    name: "3.5\" Freestyle Mini",
    tag: "Freestyle",
    desc: "Compact 3.5-inch freestyle drone. Nimble, punchy and built for tricks. Carbon fiber frame, tuned on Betaflight for precise stick response.",
    price: 8499,
    icon: "🛸",
    image: "",
    badge: "NEW"
  },
  {
    name: "Dead-Cat Aerial Rig",
    tag: "Videography",
    desc: "Dead-cat frame layout for clean prop-free footage. Stable flight characteristics tuned on INAV. Built for cinematic aerial videography.",
    price: 14999,
    icon: "🎥",
    image: "",
    badge: "PRO"
  },
  {
    name: "Beginner FPV Kit",
    tag: "Starter",
    desc: "Everything you need to start FPV — pre-built, pre-tuned and ready to fly. Includes goggles and controller recommendation guide.",
    price: 5999,
    icon: "🚀",
    image: "",
    badge: ""
  },
  {
    name: "Custom Build — Commission",
    tag: "Custom Order",
    desc: "Spec your own drone. Choose frame size, motors, camera system and firmware. Aryaman builds it, tunes it and ships it tested.",
    price: 18999,
    icon: "🔧",
    image: "",
    badge: "LIMITED"
  },
  {
    name: "Spare Parts Bundle",
    tag: "Parts & Repair",
    desc: "Props, motors, ESC replacements and connectors. Competition-grade components sourced and tested. Get back in the air fast.",
    price: 1299,
    icon: "🛠️",
    image: "",
    badge: ""
  }
];
