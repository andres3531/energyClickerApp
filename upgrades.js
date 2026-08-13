// -------------------------------------------------
// ENERGY CLICKER — MOBILE SUPPORT DATA
// -------------------------------------------------
//
// The six gameplay upgrade trees are now fully formula-driven
// inside mobile.js, including their Tier I–VI artwork paths.
// This file only stores data that is still genuinely list-based:
// cosmetic skins and purchasable score colors.


// -------------------------------------------------
// CAN SKINS
// -------------------------------------------------
//
// To add a new skin later, copy one object and change:
// name, cost, img, and description.
//
// These last two entries are temporary placeholders using existing
// can-tier art. Replace them when your next silly skins are ready.
const COSMETIC_UPGRADES = [
    {
        name: "Banana",
        cost: 50_000,
        img: "assets/skins/firstCosmetic.png",
        description: "OMG a Banana!!!"
    },
    {
        name: "Hot Dawg",
        cost: 500_000,
        img: "assets/skins/secondCosmetic.png",
        description: "Hot Dawg"
    },
    {
        name: "UFO",
        cost: 5_000_000,
        img: "assets/skins/thirdCosmetic.png",
        description: "A flying saucer"
    },
    {
        name: "Pink Fuzzy Dice",
        cost: 50_000_000,
        img: "assets/skins/fourthCosmetic.png",
        description: "This one is for Dr.Sias"
    },
    {
        name: "Rottenberry",
        cost: 100_000_000,
        img: "assets/skins/fifthCosmetic.png",
        description: "A berry that is rotten."
    },
    {
        name: "Luci Goosey",
        cost: 1_000_000_000,
        img: "assets/skins/sixthCosmetic.png",
        description: "A 30 something year old man"
    }
];


// -------------------------------------------------
// SCORE COLORS
// -------------------------------------------------
//
// The Colors Shop draws its own swatches with CSS, so these entries
// no longer need image paths.
const CHANGECOLOR_UPGRADES = [
    {
        name: "Electric Blue",
        cost: 25_000,
        cssClass: "scoreColor2",
        description: "Changes the main score to Electric Blue."
    },
    {
        name: "Purple Punch",
        cost: 125_000,
        cssClass: "scoreColor3",
        description: "Changes the main score to Purple Punch."
    },
    {
        name: "Gold Rush",
        cost: 750_000,
        cssClass: "scoreColor4",
        description: "Changes the main score to Gold Rush."
    },
    {
        name: "Toxic Green",
        cost: 3_000_000,
        cssClass: "scoreColor5",
        description: "Changes the main score to Toxic Green."
    },
    {
        name: "Hot Pink",
        cost: 12_000_000,
        cssClass: "scoreColor6",
        description: "Changes the main score to Hot Pink."
    },
    {
        name: "Rose Gold",
        cost: 50_000_000,
        cssClass: "scoreColor7",
        description: "Changes the main score to Rose Gold."
    },
    {
        name: "Royal Purple",
        cost: 250_000_000,
        cssClass: "scoreColor8",
        description: "Changes the main score to Royal Purple."
    }
];
