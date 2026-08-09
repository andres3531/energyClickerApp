// -------------------------------------------------
// ENERGY CLICKER — ECONOMY V1 SUPPORT DATA
// -------------------------------------------------
//
// The mobile game now generates the full Level 1–1000 gameplay
// economy inside mobile.js. These first entries remain here for
// artwork/legacy desktop compatibility and mirror the opening levels.

// DRINK UPGRADES
const DRINK_UPGRADES = [
    { name: "", cost: 12, multiplier: 1, img: "imgs/firstCan.png", description: "Increases energy per tap by +1" },
    { name: "", cost: 18, multiplier: 1, img: "imgs/secondCan.png", description: "Increases energy per tap by +1" },
    { name: "", cost: 27, multiplier: 2, img: "imgs/thirdCan.png", description: "Increases energy per tap by +2" },
    { name: "", cost: 40, multiplier: 2, img: "imgs/fourthCan.png", description: "Increases energy per tap by +2" },
    { name: "", cost: 60, multiplier: 3, img: "imgs/fifthCan.png", description: "Increases energy per tap by +3" },
    { name: "", cost: 91, multiplier: 4, img: "imgs/sixthCan.png", description: "Increases energy per tap by +4" }
];

// FACTORY UPGRADES
const FACTORY_UPGRADES = [
    { name: "Factory", cost: 120, multiplier: 1, img: "imgs/firstFactory.png", description: "Produces +1 energy per second automatically" },
    { name: "Factory", cost: 180, multiplier: 1, img: "imgs/redbullFactory.png", description: "Produces +1 energy per second automatically" },
    { name: "Factory", cost: 270, multiplier: 2, img: "imgs/redbullFactory.png", description: "Produces +2 energy per second automatically" },
    { name: "Factory", cost: 405, multiplier: 2, img: "imgs/redbullFactory.png", description: "Produces +2 energy per second automatically" }
];

// LUCKY SHOT UPGRADES
const LUCKYSHOT_UPGRADES = [
    { name: "Lucky Shot", cost: 1500, chanceIncrease: 0.005, img: "imgs/luckyUpgrade.png", description: "0.5% chance to gain 3% of current energy when tapping" },
    { name: "Lucky Shot", cost: 2325, chanceIncrease: 0.00002, img: "imgs/luckyUpgrade.png", description: "Slightly improves Lucky Shot chance and reward" },
    { name: "Lucky Shot", cost: 3603, chanceIncrease: 0.00002, img: "imgs/luckyUpgrade.png", description: "Slightly improves Lucky Shot chance and reward" }
];

// KINETIC OVERFLOW
const KINETIC_OVERFLOW_UPGRADES = [
    { name: "Kinetic Overflow", cost: 4000, chance: 0.005, multiplier: 2, duration: 3, img: "imgs/firstCan.png", description: "0.5% chance for 2x tap power for 3 seconds" },
    { name: "Kinetic Overflow", cost: 6200, chance: 0.00501, multiplier: 2.006, duration: 3.005, img: "imgs/secondCan.png", description: "Slightly improves Overflow chance, power, and duration" },
    { name: "Kinetic Overflow", cost: 9610, chance: 0.00502, multiplier: 2.012, duration: 3.01, img: "imgs/thirdCan.png", description: "Slightly improves Overflow chance, power, and duration" }
];

// CAN SKINS — permanent purchases, so prices are intentionally spread
// across several Lives instead of being trivial in the first few minutes.
const COSMETIC_UPGRADES = [
    { name: "Can Skin", cost: 50000, buttonImg: "imgs/firstCosmetic.png", img: "imgs/firstCosmetic.png", description: "Changes the can appearance (cosmetic only)" },
    { name: "Can Skin", cost: 500000, buttonImg: "imgs/secondCan.png", img: "imgs/secondCan.png", description: "Fancy premium can skin" },
    { name: "Can Skin", cost: 5000000, buttonImg: "imgs/thirdCan.png", img: "imgs/thirdCan.png", description: "Shiny gold can skin" },
    { name: "Can Skin", cost: 50000000, buttonImg: "imgs/fourthCan.png", img: "imgs/fourthCan.png", description: "Ultimate diamond can skin" }
];

// DELIVERY UPGRADES
const DELIVERY_UPGRADES = [
    { name: "Delivery Truck", cost: 650, multiplier: 5, img: "imgs/firstCan.png", description: "Delivers +5 energy per second" },
    { name: "Delivery Truck", cost: 975, multiplier: 7, img: "imgs/redbullFactory.png", description: "Delivers +7 energy per second" },
    { name: "Delivery Truck", cost: 1462, multiplier: 9, img: "imgs/redbullFactory.png", description: "Delivers +9 energy per second" },
    { name: "Delivery Truck", cost: 2193, multiplier: 11, img: "imgs/redbullFactory.png", description: "Delivers +11 energy per second" }
];

// PRE-WORKOUT UPGRADES
const PREWORKOUT_UPGRADES = [
    { name: "Pre-Workout", cost: 3500, multiplier: 28, img: "imgs/firstCan.png", description: "Generates +28 energy per second" },
    { name: "Pre-Workout", cost: 5250, multiplier: 37, img: "imgs/redbullFactory.png", description: "Generates +37 energy per second" },
    { name: "Pre-Workout", cost: 7875, multiplier: 49, img: "imgs/redbullFactory.png", description: "Generates +49 energy per second" }
];

// SCORE COLORS — permanent purchases, priced as optional collection goals.
const CHANGECOLOR_UPGRADES = [
    { name: "", cost: 25000, cssClass: "scoreColor2", img: "imgs/firstCan.png", description: "Changes score color to <span class='scoreColor2 wavy-text'>ELECTRIC BLUE</span>" },
    { name: "", cost: 125000, cssClass: "scoreColor3", img: "imgs/secondCan.png", description: "Changes score color to <span class='scoreColor3 wavy-text'>PURPLE PUNCH</span>" },
    { name: "", cost: 750000, cssClass: "scoreColor4", img: "imgs/thirdCan.png", description: "Changes score color to <span class='scoreColor4 wavy-text'>GOLD</span>" },
    { name: "", cost: 3000000, cssClass: "scoreColor5", img: "imgs/fourthCan.png", description: "Changes score color to <span class='scoreColor5 wavy-text'>TOXIC GREEN</span>" },
    { name: "", cost: 12000000, cssClass: "scoreColor6", img: "imgs/fourthCan.png", description: "Changes score color to <span class='scoreColor6 wavy-text'>HOT PINK</span>" },
    { name: "", cost: 50000000, cssClass: "scoreColor7", img: "imgs/fourthCan.png", description: "Changes score color to <span class='scoreColor7 wavy-text'>ROSE GOLD</span>" },
    { name: "", cost: 250000000, cssClass: "scoreColor8", img: "imgs/fourthCan.png", description: "Changes score color to <span class='scoreColor8 wavy-text'>ROYALE PURPLE</span>" }
];
