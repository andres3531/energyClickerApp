// -------------------------------------------------
// MOBILE MENU ELEMENTS
// -------------------------------------------------

const navigationButtons = document.querySelectorAll(".navigationButton");

const menuOverlay = document.getElementById("menuOverlay");
const overlayBackground = document.getElementById("overlayBackground");

const shopPanel = document.querySelector(".shopPanel");
const shopTitle = document.getElementById("shopTitle");
const shopList = document.getElementById("shopList");

const closeShopButton = document.getElementById("closeShopButton");


// Save the original upgrade cards so we can restore them later.
const upgradesShopContent = shopList.innerHTML;


const mobileScoreDisplay = document.getElementById("mobileScore");
const shopBalanceAmount = document.getElementById("shopBalanceAmount");

// -------------------------------------------------
// BASIC MOBILE GAME STATE
// -------------------------------------------------

let mobileEnergy = 0;
let mobileEnergyPerTap = 1;

const mobilePerTapDisplay =
    document.getElementById("mobilePerTap");

const mobileTapSection =
    document.getElementById("mobileTapSection");

const mobileCanButton =
    document.getElementById("mobileCanButton");

/*
    Used only to give each floating tap number
    a unique identifier while several are visible.
*/
let tapEnergyFloatCounter = 0;

// -------------------------------------------------
// DRINK POWER UPGRADE STATE
// -------------------------------------------------

/*
    mobileDrinkUpgradeIndex now represents the
    player's full Drink Power level.

    Levels 1-6 preserve the original hand-written
    upgrade costs and gains from upgrades.js.

    Levels 7-1000 are generated automatically.
*/
let mobileDrinkUpgradeIndex = 0;

const DRINK_POWER_MAX_LEVEL = 1000;
const DRINK_POWER_COST_GROWTH = 1.28;
const DRINK_POWER_GAIN_GROWTH = 1.12;

/*
    Major can artwork changes happen only at these
    Drink Power milestones.
*/
const CAN_LEVEL_IMAGES = [
    "imgs/firstCan.png",
    "imgs/secondCan.png",
    "imgs/thirdCan.png",
    "imgs/fourthCan.png",
    "imgs/fifthCan.png",
    "imgs/sixthCan.png"
];

const DRINK_CAN_MILESTONES = [
    {
        level: 0,
        tier: 1,
        image: CAN_LEVEL_IMAGES[0]
    },
    {
        level: 10,
        tier: 2,
        image: CAN_LEVEL_IMAGES[1]
    },
    {
        level: 25,
        tier: 3,
        image: CAN_LEVEL_IMAGES[2]
    },
    {
        level: 50,
        tier: 4,
        image: CAN_LEVEL_IMAGES[3]
    },
    {
        level: 100,
        tier: 5,
        image: CAN_LEVEL_IMAGES[4]
    },
    {
        level: 200,
        tier: 6,
        image: CAN_LEVEL_IMAGES[5]
    }
];

/*
    An equipped cosmetic skin overrides the normal
    Drink Power can artwork.
*/
let equippedSkinImage = null;

const MAXED_OUT_IMAGE = "imgs/maxedOut.png";

const mobileCanImage =
    document.getElementById("mobileCanImage");

const shopBalanceImage =
    document.getElementById("shopBalanceImage");

// -------------------------------------------------
// FACTORY AND AUTOMATIC PRODUCTION STATE
// -------------------------------------------------

let mobileEnergyPerSecond = 0;

/*
    mobileFactoryUpgradeIndex now represents the
    player's full Factory level.

    The original Factory upgrades remain unchanged.
    Every level after them is generated automatically.
*/
let mobileFactoryUpgradeIndex = 0;

const FACTORY_MAX_LEVEL = 1000;
const FACTORY_COST_GROWTH = 1.30;
const FACTORY_GAIN_GROWTH = 1.10;

/*
    Factory artwork changes at major level milestones.

    sourceIndex selects artwork from the existing
    FACTORY_UPGRADES array. If fewer images exist,
    the final available image is reused safely.
*/
const FACTORY_TIER_MILESTONES = [
    {
        level: 0,
        tier: 1,
        sourceIndex: 0
    },
    {
        level: 10,
        tier: 2,
        sourceIndex: 1
    },
    {
        level: 25,
        tier: 3,
        sourceIndex: 2
    },
    {
        level: 50,
        tier: 4,
        sourceIndex: 3
    },
    {
        level: 100,
        tier: 5,
        sourceIndex: 4
    },
    {
        level: 200,
        tier: 6,
        sourceIndex: 5
    }
];

const mobilePerSecondRow =
    document.getElementById("mobilePerSecondRow");

const mobilePerSecondDisplay =
    document.getElementById("mobilePerSecond");

// -------------------------------------------------
// DELIVERY TRUCK UPGRADE STATE
// -------------------------------------------------

/*
    The first four Delivery levels preserve the
    original upgrades.js values. Later levels are
    generated automatically.
*/
let mobileDeliveryUpgradeIndex = 0;

const DELIVERY_MAX_LEVEL = 1000;
const DELIVERY_COST_GROWTH = 1.31;
const DELIVERY_GAIN_GROWTH = 1.11;

const DELIVERY_TIER_MILESTONES = [
    { level: 0, tier: 1, sourceIndex: 0 },
    { level: 10, tier: 2, sourceIndex: 1 },
    { level: 25, tier: 3, sourceIndex: 2 },
    { level: 50, tier: 4, sourceIndex: 3 },
    { level: 100, tier: 5, sourceIndex: 4 },
    { level: 200, tier: 6, sourceIndex: 5 }
];


// -------------------------------------------------
// PRE-WORKOUT UPGRADE STATE
// -------------------------------------------------

/*
    The first three Pre-Workout levels preserve the
    original upgrades.js values. Later levels are
    generated automatically.
*/
let mobilePreWorkoutUpgradeIndex = 0;

const PREWORKOUT_MAX_LEVEL = 1000;
const PREWORKOUT_COST_GROWTH = 1.34;
const PREWORKOUT_GAIN_GROWTH = 1.13;

const PREWORKOUT_TIER_MILESTONES = [
    { level: 0, tier: 1, sourceIndex: 0 },
    { level: 10, tier: 2, sourceIndex: 1 },
    { level: 25, tier: 3, sourceIndex: 2 },
    { level: 50, tier: 4, sourceIndex: 2 },
    { level: 100, tier: 5, sourceIndex: 2 },
    { level: 200, tier: 6, sourceIndex: 2 }
];

// -------------------------------------------------
// LUCKY SHOT STATE
// -------------------------------------------------

let mobileLuckyShotUpgradeIndex = 0;
let mobileLuckyShotChance = 0;
let mobileLuckyShotBonusMultiplier = 0.20;

const LUCKY_SHOT_MAX_LEVEL = 1000;
const LUCKY_SHOT_COST_GROWTH = 1.35;
const LUCKY_SHOT_MAX_CHANCE = 0.25;
const LUCKY_SHOT_GENERATED_CHANCE_GAIN = 0.0005;
const LUCKY_SHOT_GENERATED_BONUS_GAIN = 0.0025;

const LUCKY_SHOT_TIER_MILESTONES = [
    { level: 0, tier: 1 },
    { level: 10, tier: 2 },
    { level: 25, tier: 3 },
    { level: 50, tier: 4 },
    { level: 100, tier: 5 },
    { level: 200, tier: 6 }
];

const mobileGameMessage =
    document.getElementById("mobileGameMessage");

let luckyShotMessageTimer = null;

// -------------------------------------------------
// KINETIC OVERFLOW STATE
// -------------------------------------------------

let mobileKineticUpgradeIndex = 0;

const KINETIC_MAX_LEVEL = 1000;
const KINETIC_COST_GROWTH = 1.38;
const KINETIC_MAX_CHANCE = 0.20;
const KINETIC_GENERATED_CHANCE_GAIN = 0.00025;
const KINETIC_GENERATED_MULTIPLIER_GAIN = 0.35;
const KINETIC_GENERATED_DURATION_GAIN = 0.05;
const KINETIC_MAX_DURATION = 60;

const KINETIC_TIER_MILESTONES = [
    { level: 0, tier: 1, sourceIndex: 0 },
    { level: 10, tier: 2, sourceIndex: 1 },
    { level: 25, tier: 3, sourceIndex: 2 },
    { level: 50, tier: 4, sourceIndex: 2 },
    { level: 100, tier: 5, sourceIndex: 2 },
    { level: 200, tier: 6, sourceIndex: 2 }
];

let mobileKineticChance = 0;
let mobileKineticMultiplier = 1;
let mobileKineticDuration = 0;

let mobileKineticActive = false;
let mobileKineticTimeLeft = 0;

let kineticCountdownInterval = null;

const kineticStatus =
    document.getElementById("kineticStatus");

const mobilePerTapRow =
    mobilePerTapDisplay.closest(".productionText");


// -------------------------------------------------
// SKINS STATE
// -------------------------------------------------

/*
    Each position matches an item inside
    COSMETIC_UPGRADES.

    false = not owned
    true = owned
*/
const mobileOwnedSkins =
    COSMETIC_UPGRADES.map(() => false);

/*
    null means the player is using their normal
    Drink Power can.

    A number means that cosmetic skin is equipped.
*/
let mobileEquippedSkinIndex = null;

// -------------------------------------------------
// SCORE COLOR STATE
// -------------------------------------------------

const SCORE_COLOR_NAMES = [
    "ELECTRIC BLUE",
    "PURPLE PUNCH",
    "GOLD RUSH",
    "TOXIC GREEN",
    "HOT PINK",
    "ROSE GOLD",
    "ROYAL PURPLE"
];

/*
    false = the color has not been purchased
    true = the player owns the color
*/
const mobileOwnedColors =
    CHANGECOLOR_UPGRADES.map(() => false);

/*
    null means the original rainbow score is equipped.

    A number represents an equipped color from
    CHANGECOLOR_UPGRADES.
*/
let mobileEquippedColorIndex = null;

// -------------------------------------------------
// PLAYER STATISTICS STATE
// -------------------------------------------------

let mobileTotalTaps = 0;
let mobileLifetimeEnergy = 0;

let mobileLuckyShotsActivated = 0;
let mobileKineticActivations = 0;

let mobileSecondsPlayed = 0;

// -------------------------------------------------
// OFFLINE PRODUCTION STATE
// -------------------------------------------------

const MINIMUM_OFFLINE_SECONDS = 10;

/*
    Players can currently earn a maximum of
    eight hours of offline production.

    We can rebalance this later.
*/
const MAXIMUM_OFFLINE_SECONDS =
    8 * 60 * 60;

const offlineRewardOverlay =
    document.getElementById(
        "offlineRewardOverlay"
    );

const offlineTimeAwayDisplay =
    document.getElementById(
        "offlineTimeAway"
    );

const offlineEnergyEarnedDisplay =
    document.getElementById(
        "offlineEnergyEarned"
    );

const offlineContinueButton =
    document.getElementById(
        "offlineContinueButton"
    );

// -------------------------------------------------
// SAVE MANAGEMENT STATE
// -------------------------------------------------

let isResettingGame = false;
let manualSaveMessageTimer = null;

// -------------------------------------------------
// GLOBAL GAME SETTINGS
// -------------------------------------------------

const GAME_SETTINGS_KEY =
    "energyClickerSettings";

const DEFAULT_GAME_SETTINGS = {
    soundEffects: true,
    haptics: true,
    reducedMotion: false
};

/*
    Settings are global.

    They apply to every save slot instead of being
    stored separately inside each player's save.
*/
let gameSettings = {
    ...DEFAULT_GAME_SETTINGS
};

let gameAudioContext = null;


// -------------------------------------------------
// ACHIEVEMENT DEFINITIONS
// -------------------------------------------------

const PLAYER_ACHIEVEMENTS = [
    {
        id: "firstTap",
        icon: "👆",
        name: "FIRST CRACK",
        description: "Tap the energy can for the first time.",
        target: 1,
        getProgress: () => mobileTotalTaps
    },

    {
        id: "tap100",
        icon: "⚡",
        name: "GETTING STARTED",
        description: "Tap the energy can 100 times.",
        target: 100,
        getProgress: () => mobileTotalTaps
    },

    {
        id: "tap1000",
        icon: "🔥",
        name: "TAP MACHINE",
        description: "Tap the energy can 1,000 times.",
        target: 1000,
        getProgress: () => mobileTotalTaps
    },

    {
        id: "energy10000",
        icon: "🥤",
        name: "ENERGY STOCKPILE",
        description: "Produce 10,000 lifetime energy.",
        target: 10000,
        getProgress: () => mobileLifetimeEnergy
    },

    {
        id: "energyMillion",
        icon: "💰",
        name: "ENERGY EMPIRE",
        description: "Produce 1,000,000 lifetime energy.",
        target: 1000000,
        getProgress: () => mobileLifetimeEnergy
    },

    {
        id: "canLevel3",
        icon: "📈",
        name: "CAN COLLECTOR",
        description: "Reach Drink Power can level 3.",
        target: 3,
        getProgress: () => mobileDrinkUpgradeIndex
    },

    {
        id: "automaticProduction",
        icon: "🏭",
        name: "AUTOMATION BEGINS",
        description: "Unlock automatic energy production.",
        target: 1,
        getProgress: () => getCurrentEnergyPerSecond()
    },

    {
        id: "production50",
        icon: "🚚",
        name: "PRODUCTION LINE",
        description: "Reach 50 energy produced per second.",
        target: 50,
        getProgress: () => getCurrentEnergyPerSecond()
    },

    {
        id: "firstLuckyShot",
        icon: "🍀",
        name: "LUCKY BREAK",
        description: "Activate Lucky Shot for the first time.",
        target: 1,
        getProgress: () => mobileLuckyShotsActivated
    },

    {
        id: "firstKinetic",
        icon: "🌩️",
        name: "OVERFLOWING",
        description: "Activate Kinetic Overflow for the first time.",
        target: 1,
        getProgress: () => mobileKineticActivations
    },

    {
        id: "firstSkin",
        icon: "🎭",
        name: "FRESH LOOK",
        description: "Purchase your first can skin.",
        target: 1,
        getProgress: () =>
            mobileOwnedSkins.filter(Boolean).length
    },

    {
        id: "firstColor",
        icon: "🎨",
        name: "SHOW YOUR COLORS",
        description: "Purchase your first score color.",
        target: 1,
        getProgress: () =>
            mobileOwnedColors.filter(Boolean).length
    }
];

// -------------------------------------------------
// PERMANENT ACHIEVEMENT STATE
// -------------------------------------------------

/*
    These IDs are saved separately for each slot.

    Once an achievement ID enters this array,
    it remains unlocked even if a future Rebirth
    resets the stat that originally unlocked it.
*/
let mobileUnlockedAchievementIds = [];

let achievementNotificationQueue = [];
let achievementNotificationActive = false;
let achievementNotificationTimer = null;

const achievementToast =
    document.getElementById(
        "achievementToast"
    );

const achievementToastTitle =
    document.getElementById(
        "achievementToastTitle"
    );

const achievementToastDescription =
    document.getElementById(
        "achievementToastDescription"
    );


// -------------------------------------------------
// LIFE / REBIRTH AND PERMANENT PERK STATE
// -------------------------------------------------

/*
    These numbers are intentionally easy to rebalance.
    The game only treats the requirement as a gate:
    once the player has enough current energy, Rebirth
    resets that energy to zero anyway.
*/
const REBIRTH_BASE_REQUIREMENT = 1_000_000;
const REBIRTH_REQUIREMENT_GROWTH = 10;

const REBIRTH_RARITY_CHANCES = [
    { rarity: "common", chance: 0.65 },
    { rarity: "rare", chance: 0.25 },
    { rarity: "epic", chance: 0.08 },
    { rarity: "legendary", chance: 0.02 }
];

const REBIRTH_RARITY_LABELS = {
    common: "COMMON",
    rare: "RARE",
    epic: "EPIC",
    legendary: "LEGENDARY"
};

/*
    Three Common perks are intentionally unlimited.
    That guarantees the player can always receive three
    unique choices even hundreds of Lives into a save.
*/
const PERMANENT_PERK_DEFINITIONS = [
    {
        id: "energyKick",
        name: "ENERGY KICK",
        icon: "⚡",
        rarity: "common",
        maxRank: null,
        effects: [
            { type: "allProductionPercent", value: 0.01 }
        ]
    },
    {
        id: "strongGrip",
        name: "STRONG GRIP",
        icon: "👊",
        rarity: "common",
        maxRank: null,
        effects: [
            { type: "tapProductionPercent", value: 0.02 }
        ]
    },
    {
        id: "assemblyLine",
        name: "ASSEMBLY LINE",
        icon: "⚙️",
        rarity: "common",
        maxRank: null,
        effects: [
            { type: "autoProductionPercent", value: 0.02 }
        ]
    },
    {
        id: "nightShift",
        name: "NIGHT SHIFT",
        icon: "🌙",
        rarity: "common",
        maxRank: 25,
        effects: [
            { type: "offlineProductionPercent", value: 0.03 }
        ]
    },
    {
        id: "luckySip",
        name: "LUCKY SIP",
        icon: "🍀",
        rarity: "common",
        maxRank: 40,
        effects: [
            { type: "luckyBonus", value: 0.005 }
        ]
    },

    {
        id: "headStart",
        name: "HEAD START",
        icon: "🥤",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "startingDrinkLevels", value: 3 }
        ]
    },
    {
        id: "factoryConnections",
        name: "FACTORY CONNECTIONS",
        icon: "🏭",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "startingFactoryLevels", value: 2 }
        ]
    },
    {
        id: "expressRoute",
        name: "EXPRESS ROUTE",
        icon: "🚚",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "startingDeliveryLevels", value: 2 }
        ]
    },
    {
        id: "preLoaded",
        name: "PRE-LOADED",
        icon: "💪",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "startingPreWorkoutLevels", value: 2 }
        ]
    },
    {
        id: "luckyGenes",
        name: "LUCKY GENES",
        icon: "🎯",
        rarity: "rare",
        maxRank: 15,
        effects: [
            { type: "luckyChance", value: 0.001 }
        ]
    },
    {
        id: "kineticSpark",
        name: "KINETIC SPARK",
        icon: "🌩️",
        rarity: "rare",
        maxRank: 15,
        effects: [
            { type: "kineticChance", value: 0.001 }
        ]
    },

    {
        id: "fullShelf",
        name: "FULL SHELF",
        icon: "💰",
        rarity: "epic",
        maxRank: 10,
        effects: [
            { type: "startingEnergy", value: 100_000 }
        ]
    },
    {
        id: "overclocked",
        name: "OVERCLOCKED",
        icon: "🔥",
        rarity: "epic",
        maxRank: 10,
        effects: [
            { type: "kineticMultiplier", value: 0.20 }
        ]
    },
    {
        id: "productionLegacy",
        name: "PRODUCTION LEGACY",
        icon: "🏗️",
        rarity: "epic",
        maxRank: 10,
        effects: [
            { type: "startingPassiveLevels", value: 2 }
        ]
    },
    {
        id: "chargedStart",
        name: "CHARGED START",
        icon: "🔋",
        rarity: "epic",
        maxRank: 10,
        effects: [
            { type: "startingSpecialLevels", value: 2 }
        ]
    },
    {
        id: "luckyBreak",
        name: "LUCKY BREAK",
        icon: "🎰",
        rarity: "epic",
        maxRank: 10,
        effects: [
            { type: "luckyChance", value: 0.001 },
            { type: "luckyBonus", value: 0.01 }
        ]
    },

    {
        id: "secretFormula",
        name: "SECRET FORMULA",
        icon: "🧪",
        rarity: "legendary",
        maxRank: 5,
        effects: [
            { type: "allProductionPercent", value: 0.05 }
        ]
    },
    {
        id: "goldenHands",
        name: "GOLDEN HANDS",
        icon: "✨",
        rarity: "legendary",
        maxRank: 5,
        effects: [
            { type: "tapProductionPercent", value: 0.10 }
        ]
    },
    {
        id: "industrialEmpire",
        name: "INDUSTRIAL EMPIRE",
        icon: "🏙️",
        rarity: "legendary",
        maxRank: 5,
        effects: [
            { type: "autoProductionPercent", value: 0.10 }
        ]
    },
    {
        id: "bornReady",
        name: "BORN READY",
        icon: "👑",
        rarity: "legendary",
        maxRank: 5,
        effects: [
            { type: "startingAllLevels", value: 3 }
        ]
    },
    {
        id: "loadedDice",
        name: "LOADED DICE",
        icon: "🎲",
        rarity: "legendary",
        maxRank: 5,
        effects: [
            { type: "luckyChance", value: 0.0035 },
            { type: "kineticChance", value: 0.0035 }
        ]
    },
    {
        id: "eternalNight",
        name: "ETERNAL NIGHT",
        icon: "🌌",
        rarity: "legendary",
        maxRank: 5,
        effects: [
            { type: "offlineProductionPercent", value: 0.15 }
        ]
    }
];

let mobileLifeLevel = 0;
let mobilePermanentPerks = {};

/*
    These exact three perk IDs are saved immediately
    after a Rebirth. This prevents closing the app to
    reroll the choices.
*/
let mobilePendingRebirthChoices = [];


// -------------------------------------------------
// PERMANENT PERK HELPERS
// -------------------------------------------------

function getPermanentPerkDefinition(perkId) {
    return PERMANENT_PERK_DEFINITIONS.find(
        (perk) => perk.id === perkId
    ) || null;
}


function getPermanentPerkRank(perkId) {
    const rank = mobilePermanentPerks[perkId];

    if (!Number.isFinite(rank)) {
        return 0;
    }

    return Math.max(0, Math.floor(rank));
}


function isPermanentPerkMaxed(perk) {
    if (!perk || perk.maxRank === null) {
        return false;
    }

    return (
        getPermanentPerkRank(perk.id) >=
        perk.maxRank
    );
}


function getPermanentPerkEffectTotal(effectType) {
    let total = 0;

    PERMANENT_PERK_DEFINITIONS.forEach(
        (perk) => {
            const rank =
                getPermanentPerkRank(perk.id);

            if (rank <= 0) {
                return;
            }

            perk.effects.forEach((effect) => {
                if (effect.type === effectType) {
                    total += effect.value * rank;
                }
            });
        }
    );

    return total;
}


function getAllProductionMultiplier() {
    return (
        1 +
        getPermanentPerkEffectTotal(
            "allProductionPercent"
        )
    );
}


function getTapProductionMultiplier() {
    return (
        getAllProductionMultiplier() *
        (
            1 +
            getPermanentPerkEffectTotal(
                "tapProductionPercent"
            )
        )
    );
}


function getAutomaticProductionMultiplier() {
    return (
        getAllProductionMultiplier() *
        (
            1 +
            getPermanentPerkEffectTotal(
                "autoProductionPercent"
            )
        )
    );
}


function getOfflineProductionMultiplier() {
    return (
        1 +
        getPermanentPerkEffectTotal(
            "offlineProductionPercent"
        )
    );
}


function getCurrentEnergyPerSecond() {
    return (
        mobileEnergyPerSecond *
        getAutomaticProductionMultiplier()
    );
}


function getCurrentLuckyShotChance() {
    return Math.min(
        0.50,
        mobileLuckyShotChance +
        getPermanentPerkEffectTotal(
            "luckyChance"
        )
    );
}


function getCurrentLuckyShotBonusMultiplier() {
    return (
        mobileLuckyShotBonusMultiplier +
        getPermanentPerkEffectTotal(
            "luckyBonus"
        )
    );
}


function getCurrentKineticChance() {
    return Math.min(
        0.40,
        mobileKineticChance +
        getPermanentPerkEffectTotal(
            "kineticChance"
        )
    );
}


function getCurrentKineticMultiplier() {
    return (
        mobileKineticMultiplier +
        getPermanentPerkEffectTotal(
            "kineticMultiplier"
        )
    );
}


function getTotalPermanentPerkRanks() {
    return Object.keys(mobilePermanentPerks)
        .reduce(
            (total, perkId) =>
                total +
                getPermanentPerkRank(perkId),
            0
        );
}


function getUnlockedPermanentPerkCount() {
    return PERMANENT_PERK_DEFINITIONS.filter(
        (perk) =>
            getPermanentPerkRank(perk.id) > 0
    ).length;
}


function formatPerkPercent(decimalValue) {
    return `${Number(
        (decimalValue * 100).toFixed(2)
    )}%`;
}


function getPerkEffectLines(perk, rankAmount = 1) {
    if (!perk) {
        return [];
    }

    return perk.effects.map((effect) => {
        const total = effect.value * rankAmount;

        if (effect.type === "allProductionPercent") {
            return `+${formatPerkPercent(total)} ALL PRODUCTION`;
        }

        if (effect.type === "tapProductionPercent") {
            return `+${formatPerkPercent(total)} TAP POWER`;
        }

        if (effect.type === "autoProductionPercent") {
            return `+${formatPerkPercent(total)} AUTOMATIC PRODUCTION`;
        }

        if (effect.type === "offlineProductionPercent") {
            return `+${formatPerkPercent(total)} OFFLINE PRODUCTION`;
        }

        if (effect.type === "luckyChance") {
            return `+${formatPerkPercent(total)} LUCKY SHOT CHANCE`;
        }

        if (effect.type === "luckyBonus") {
            return `+${formatPerkPercent(total)} LUCKY SHOT REWARD`;
        }

        if (effect.type === "kineticChance") {
            return `+${formatPerkPercent(total)} KINETIC CHANCE`;
        }

        if (effect.type === "kineticMultiplier") {
            return `+${Number(total.toFixed(2))} KINETIC MULTIPLIER`;
        }

        if (effect.type === "startingEnergy") {
            return `START EACH LIFE WITH ${formatGameNumber(total)} ENERGY`;
        }

        if (effect.type === "startingDrinkLevels") {
            return `START EACH LIFE WITH DRINK POWER LEVEL ${Math.floor(total)}`;
        }

        if (effect.type === "startingFactoryLevels") {
            return `START EACH LIFE WITH FACTORY LEVEL ${Math.floor(total)}`;
        }

        if (effect.type === "startingDeliveryLevels") {
            return `START EACH LIFE WITH DELIVERY LEVEL ${Math.floor(total)}`;
        }

        if (effect.type === "startingPreWorkoutLevels") {
            return `START EACH LIFE WITH PRE-WORKOUT LEVEL ${Math.floor(total)}`;
        }

        if (effect.type === "startingPassiveLevels") {
            return `START FACTORY, DELIVERY & PRE-WORKOUT AT LEVEL ${Math.floor(total)}`;
        }

        if (effect.type === "startingSpecialLevels") {
            return `START LUCKY SHOT & KINETIC AT LEVEL ${Math.floor(total)}`;
        }

        if (effect.type === "startingAllLevels") {
            return `START ALL 6 UPGRADES AT LEVEL ${Math.floor(total)}`;
        }

        return "PERMANENT BONUS";
    });
}


// -------------------------------------------------
// REBIRTH REQUIREMENT
// -------------------------------------------------

function getRebirthRequirement(
    lifeLevel = mobileLifeLevel
) {
    const safeLifeLevel = Math.max(
        0,
        Math.floor(lifeLevel)
    );

    const requirement =
        REBIRTH_BASE_REQUIREMENT *
        Math.pow(
            REBIRTH_REQUIREMENT_GROWTH,
            safeLifeLevel
        );

    if (!Number.isFinite(requirement)) {
        return Number.MAX_VALUE;
    }

    return Math.floor(requirement);
}


function canPlayerRebirth() {
    return (
        mobileEnergy >=
        getRebirthRequirement()
    );
}


// -------------------------------------------------
// RANDOM REBIRTH PERK ROLLS
// -------------------------------------------------

function rollRebirthRarity() {
    const roll = Math.random();
    let runningChance = 0;

    for (
        const rarityData of
        REBIRTH_RARITY_CHANCES
    ) {
        runningChance += rarityData.chance;

        if (roll < runningChance) {
            return rarityData.rarity;
        }
    }

    return "common";
}


function getAvailablePermanentPerks(
    rarity = null,
    excludedIds = []
) {
    return PERMANENT_PERK_DEFINITIONS.filter(
        (perk) => {
            if (
                rarity &&
                perk.rarity !== rarity
            ) {
                return false;
            }

            if (excludedIds.includes(perk.id)) {
                return false;
            }

            return !isPermanentPerkMaxed(perk);
        }
    );
}


function getRandomArrayItem(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];
}


function generateRebirthPerkChoices() {
    const choices = [];

    while (choices.length < 3) {
        const rolledRarity =
            rollRebirthRarity();

        let candidates =
            getAvailablePermanentPerks(
                rolledRarity,
                choices
            );

        /*
            If every perk of the rolled rarity is
            maxed, fall back to any available perk.
        */
        if (candidates.length === 0) {
            candidates =
                getAvailablePermanentPerks(
                    null,
                    choices
                );
        }

        const selectedPerk =
            getRandomArrayItem(candidates);

        if (!selectedPerk) {
            break;
        }

        choices.push(selectedPerk.id);
    }

    return choices;
}


function getValidPendingRebirthChoices(savedChoices) {
    if (!Array.isArray(savedChoices)) {
        return [];
    }

    const validChoices = [];

    savedChoices.forEach((perkId) => {
        const perk =
            getPermanentPerkDefinition(perkId);

        if (
            perk &&
            !validChoices.includes(perkId)
        ) {
            validChoices.push(perkId);
        }
    });

    return validChoices.slice(0, 3);
}


function restorePermanentPerks(savedPerks) {
    mobilePermanentPerks = {};

    if (
        !savedPerks ||
        typeof savedPerks !== "object" ||
        Array.isArray(savedPerks)
    ) {
        return;
    }

    PERMANENT_PERK_DEFINITIONS.forEach(
        (perk) => {
            const savedRank =
                savedPerks[perk.id];

            if (!Number.isFinite(savedRank)) {
                return;
            }

            let safeRank = Math.max(
                0,
                Math.floor(savedRank)
            );

            if (perk.maxRank !== null) {
                safeRank = Math.min(
                    safeRank,
                    perk.maxRank
                );
            }

            if (safeRank > 0) {
                mobilePermanentPerks[perk.id] =
                    safeRank;
            }
        }
    );
}


// -------------------------------------------------
// STARTING BONUSES FOR A NEW LIFE
// -------------------------------------------------

function getRebirthStartingLevels() {
    const allLevels =
        getPermanentPerkEffectTotal(
            "startingAllLevels"
        );

    const passiveLevels =
        getPermanentPerkEffectTotal(
            "startingPassiveLevels"
        );

    const specialLevels =
        getPermanentPerkEffectTotal(
            "startingSpecialLevels"
        );

    return {
        drink: Math.min(
            DRINK_POWER_MAX_LEVEL,
            Math.floor(
                allLevels +
                getPermanentPerkEffectTotal(
                    "startingDrinkLevels"
                )
            )
        ),

        factory: Math.min(
            FACTORY_MAX_LEVEL,
            Math.floor(
                allLevels +
                passiveLevels +
                getPermanentPerkEffectTotal(
                    "startingFactoryLevels"
                )
            )
        ),

        delivery: Math.min(
            DELIVERY_MAX_LEVEL,
            Math.floor(
                allLevels +
                passiveLevels +
                getPermanentPerkEffectTotal(
                    "startingDeliveryLevels"
                )
            )
        ),

        preWorkout: Math.min(
            PREWORKOUT_MAX_LEVEL,
            Math.floor(
                allLevels +
                passiveLevels +
                getPermanentPerkEffectTotal(
                    "startingPreWorkoutLevels"
                )
            )
        ),

        luckyShot: Math.min(
            LUCKY_SHOT_MAX_LEVEL,
            Math.floor(
                allLevels +
                specialLevels
            )
        ),

        kinetic: Math.min(
            KINETIC_MAX_LEVEL,
            Math.floor(
                allLevels +
                specialLevels
            )
        )
    };
}


function applyRebirthStartingBonuses() {
    const startingLevels =
        getRebirthStartingLevels();

    mobileDrinkUpgradeIndex =
        startingLevels.drink;

    mobileFactoryUpgradeIndex =
        startingLevels.factory;

    mobileDeliveryUpgradeIndex =
        startingLevels.delivery;

    mobilePreWorkoutUpgradeIndex =
        startingLevels.preWorkout;

    mobileLuckyShotUpgradeIndex =
        startingLevels.luckyShot;

    mobileKineticUpgradeIndex =
        startingLevels.kinetic;

    mobileEnergy =
        getPermanentPerkEffectTotal(
            "startingEnergy"
        );

    rebuildDerivedGameValues();
    updateShopBalance();
}

// -------------------------------------------------
// MENU TITLES
// -------------------------------------------------

const menuTitles = {
    upgrades: "UPGRADES SHOP",
    skins: "SKINS SHOP",
    colors: "COLORS SHOP",
    stats: "PLAYER HUB"
};



// -------------------------------------------------
// FORMAT LARGE GAME NUMBERS
// -------------------------------------------------

function formatGameNumber(value) {
    const number = Math.floor(value);
    const absoluteNumber = Math.abs(number);

    if (absoluteNumber < 1000) {
        return number.toLocaleString("en-US");
    }

    const units = [
        "K",
        "M",
        "B",
        "T",
        "Qa",
        "Qi",
        "Sx",
        "Sp",
        "Oc",
        "No",
        "Dc"
    ];

    let shortenedNumber = absoluteNumber;
    let unitIndex = -1;

    while (
        shortenedNumber >= 1000 &&
        unitIndex < units.length - 1
        ) {
        shortenedNumber /= 1000;
        unitIndex++;
    }

    let decimalPlaces;

    if (shortenedNumber >= 100) {
        decimalPlaces = 0;
    } else if (shortenedNumber >= 10) {
        decimalPlaces = 1;
    } else {
        decimalPlaces = 2;
    }

    let roundedNumber = Number(
        shortenedNumber.toFixed(decimalPlaces)
    );

    /*
        Prevents something like 999,999 from
        displaying as 1000K instead of 1M.
    */
    if (
        roundedNumber >= 1000 &&
        unitIndex < units.length - 1
    ) {
        roundedNumber /= 1000;
        unitIndex++;
    }

    const negativeSign =
        number < 0 ? "-" : "";

    /*
        Extremely large scalable-upgrade values can
        outgrow the current suffix list. Scientific
        notation stays readable instead of producing
        a giant number followed by the final suffix.
    */
    if (
        unitIndex === units.length - 1 &&
        roundedNumber >= 1000
    ) {
        return number
            .toExponential(2)
            .replace("+", "");
    }

    return (
        negativeSign +
        roundedNumber +
        units[unitIndex]
    );
}


// -------------------------------------------------
// SHOP BALANCE
// -------------------------------------------------
function updateShopBalance() {
    const formattedEnergy =
        formatGameNumber(mobileEnergy);

    mobileScoreDisplay.textContent =
        formattedEnergy;

    shopBalanceAmount.textContent =
        formattedEnergy;

    updateScoreColor();

    mobilePerTapDisplay.textContent =
        formatGameNumber(
            getCurrentTapPower()
        );

    if (mobileKineticActive) {
        mobilePerTapRow.classList.add(
            "kineticBoosted"
        );
    } else {
        mobilePerTapRow.classList.remove(
            "kineticBoosted"
        );
    }

    const currentEnergyPerSecond =
        getCurrentEnergyPerSecond();

    if (currentEnergyPerSecond > 0) {
        mobilePerSecondRow.classList.remove(
            "hidden"
        );

        mobilePerSecondDisplay.textContent =
            formatGameNumber(
                currentEnergyPerSecond
            );
    } else {
        mobilePerSecondRow.classList.add(
            "hidden"
        );
    }

    updateCurrentCanImages();

    updateDrinkUpgradeCard();
    updateFactoryUpgradeCard();
    updateDeliveryTruckCard();
    updatePreWorkoutCard();
    updateLuckyShotCard();
    updateKineticOverflowCard();

    updateStatsDisplay();
    updateRebirthDynamicDisplays();

    checkForNewAchievements();
}

// -------------------------------------------------
// GET THE DRINK UPGRADE CARD ELEMENTS
// -------------------------------------------------

function getDrinkUpgradeElements() {
    return {
        card:
            document.getElementById("drinkUpgradeCard"),

        image:
            document.getElementById("drinkUpgradeImage"),

        name:
            document.getElementById("drinkUpgradeName"),

        level:
            document.getElementById("drinkUpgradeLevel"),

        description:
            document.getElementById("drinkUpgradeDescription"),

        progressText:
            document.getElementById("drinkCanProgressText"),

        progressFill:
            document.getElementById("drinkCanProgressFill"),

        cost:
            document.getElementById("drinkUpgradeCost"),

        buyButton:
            document.getElementById("drinkUpgradeBuyButton")
    };
}




// -------------------------------------------------
// GET ONE DRINK POWER LEVEL'S COST AND GAIN
// -------------------------------------------------

function getDrinkPowerUpgradeData(currentLevel) {
    if (
        !Number.isInteger(currentLevel) ||
        currentLevel < 0 ||
        currentLevel >= DRINK_POWER_MAX_LEVEL
    ) {
        return null;
    }

    /*
        Preserve the six original upgrades exactly.
    */
    if (currentLevel < DRINK_UPGRADES.length) {
        const originalUpgrade =
            DRINK_UPGRADES[currentLevel];

        return {
            level: currentLevel + 1,
            cost: originalUpgrade.cost,
            gain: originalUpgrade.multiplier
        };
    }

    /*
        Level 7 and beyond are generated from the
        final original upgrade.
    */
    const lastOriginalUpgrade =
        DRINK_UPGRADES[
            DRINK_UPGRADES.length - 1
        ];

    const generatedStep =
        currentLevel -
        DRINK_UPGRADES.length +
        1;

    const generatedCost =
        Math.floor(
            lastOriginalUpgrade.cost *
            Math.pow(
                DRINK_POWER_COST_GROWTH,
                generatedStep
            )
        );

    const generatedGain =
        Math.max(
            1,
            Math.floor(
                lastOriginalUpgrade.multiplier *
                Math.pow(
                    DRINK_POWER_GAIN_GROWTH,
                    generatedStep
                )
            )
        );

    return {
        level: currentLevel + 1,
        cost: generatedCost,
        gain: generatedGain
    };
}


// -------------------------------------------------
// CALCULATE TAP POWER FROM A DRINK POWER LEVEL
// -------------------------------------------------

function calculateDrinkPowerFromLevel(level) {
    const safeLevel =
        Math.min(
            Math.max(
                Math.floor(level),
                0
            ),
            DRINK_POWER_MAX_LEVEL
        );

    let calculatedTapPower = 1;

    for (
        let currentLevel = 0;
        currentLevel < safeLevel;
        currentLevel++
    ) {
        const upgradeData =
            getDrinkPowerUpgradeData(
                currentLevel
            );

        if (!upgradeData) {
            break;
        }

        calculatedTapPower +=
            upgradeData.gain;
    }

    return calculatedTapPower;
}


// -------------------------------------------------
// GET THE CURRENT CAN MILESTONE
// -------------------------------------------------

function getCurrentCanMilestone(level) {
    let currentMilestone =
        DRINK_CAN_MILESTONES[0];

    for (
        const milestone of
        DRINK_CAN_MILESTONES
    ) {
        if (level < milestone.level) {
            break;
        }

        currentMilestone = milestone;
    }

    return currentMilestone;
}


// -------------------------------------------------
// GET THE NEXT CAN MILESTONE
// -------------------------------------------------

function getNextCanMilestone(level) {
    return (
        DRINK_CAN_MILESTONES.find(
            (milestone) =>
                milestone.level > level
        ) || null
    );
}


// -------------------------------------------------
// GET CAN-MILESTONE PROGRESS
// -------------------------------------------------

function getCanMilestoneProgress(level) {
    const currentMilestone =
        getCurrentCanMilestone(level);

    const nextMilestone =
        getNextCanMilestone(level);

    if (!nextMilestone) {
        return 100;
    }

    const milestoneDistance =
        nextMilestone.level -
        currentMilestone.level;

    const completedDistance =
        level -
        currentMilestone.level;

    return Math.min(
        100,
        Math.max(
            0,
            (
                completedDistance /
                milestoneDistance
            ) * 100
        )
    );
}

// -------------------------------------------------
// DETERMINE THE CURRENT CAN IMAGE
// -------------------------------------------------

// -------------------------------------------------
// GET THE NORMAL CAN-LEVEL IMAGE
// -------------------------------------------------

function getCurrentBaseCanImage() {
    return getCurrentCanMilestone(
        mobileDrinkUpgradeIndex
    ).image;
}


// -------------------------------------------------
// DETERMINE THE CURRENT DISPLAYED CAN IMAGE
// -------------------------------------------------

function getCurrentCanImage() {
    /*
        An equipped cosmetic skin overrides the
        player's normal Drink Power can.
    */
    if (equippedSkinImage) {
        return equippedSkinImage;
    }

    /*
        Without an equipped skin, display the can
        earned from Drink Power upgrades.
    */
    return getCurrentBaseCanImage();
}


// -------------------------------------------------
// UPDATE ALL CURRENT-CAN IMAGES
// -------------------------------------------------

function updateCurrentCanImages() {
    const currentCanImage =
        getCurrentCanImage();

    mobileCanImage.src =
        currentCanImage;

    shopBalanceImage.src =
        currentCanImage;
}


// -------------------------------------------------
// UPDATE THE DRINK POWER CARD
// -------------------------------------------------

function updateDrinkUpgradeCard() {
    const elements =
        getDrinkUpgradeElements();

    /*
        The card is not present while another
        Player Hub or shop screen is open.
    */
    if (!elements.card) {
        return;
    }

    const currentMilestone =
        getCurrentCanMilestone(
            mobileDrinkUpgradeIndex
        );

    const nextMilestone =
        getNextCanMilestone(
            mobileDrinkUpgradeIndex
        );

    const nextUpgrade =
        getDrinkPowerUpgradeData(
            mobileDrinkUpgradeIndex
        );

    elements.image.src =
        currentMilestone.image;

    elements.name.textContent =
        "DRINK POWER";

    elements.level.textContent =
        `LEVEL ${mobileDrinkUpgradeIndex} • CAN TIER ${currentMilestone.tier}`;

    elements.progressFill.style.width =
        `${getCanMilestoneProgress(
            mobileDrinkUpgradeIndex
        )}%`;

    if (!nextUpgrade) {
        elements.description.textContent =
            "Drink Power has reached the temporary level cap.";

        elements.progressText.textContent =
            "HIGHEST CURRENT CAN TIER";

        elements.cost.textContent =
            "MAX";

        elements.buyButton.textContent =
            "MAXED";

        elements.buyButton.disabled =
            true;

        return;
    }

    elements.description.textContent =
        `Next level adds +${formatGameNumber(
            nextUpgrade.gain
        )} energy per tap.`;

    if (nextMilestone) {
        elements.progressText.textContent =
            `NEXT CAN AT LEVEL ${nextMilestone.level}`;
    } else {
        elements.progressText.textContent =
            "HIGHEST CURRENT CAN TIER";
    }

    elements.cost.textContent =
        formatGameNumber(
            nextUpgrade.cost
        );

    elements.buyButton.textContent =
        "BUY";

    elements.buyButton.disabled =
        false;
}

// -------------------------------------------------
// GET THE FACTORY CARD ELEMENTS
// -------------------------------------------------

function getFactoryUpgradeElements() {
    return {
        card:
            document.getElementById(
                "factoryUpgradeCard"
            ),

        image:
            document.getElementById(
                "factoryUpgradeImage"
            ),

        name:
            document.getElementById(
                "factoryUpgradeName"
            ),

        level:
            document.getElementById(
                "factoryUpgradeLevel"
            ),

        description:
            document.getElementById(
                "factoryUpgradeDescription"
            ),

        progressText:
            document.getElementById(
                "factoryTierProgressText"
            ),

        progressFill:
            document.getElementById(
                "factoryTierProgressFill"
            ),

        cost:
            document.getElementById(
                "factoryUpgradeCost"
            ),

        buyButton:
            document.getElementById(
                "factoryUpgradeBuyButton"
            )
    };
}


// -------------------------------------------------
// GET ONE FACTORY LEVEL'S COST AND GAIN
// -------------------------------------------------

function getFactoryUpgradeData(currentLevel) {
    if (
        !Number.isInteger(currentLevel) ||
        currentLevel < 0 ||
        currentLevel >= FACTORY_MAX_LEVEL
    ) {
        return null;
    }

    /*
        Preserve every original Factory upgrade
        exactly as it was written in upgrades.js.
    */
    if (
        currentLevel <
        FACTORY_UPGRADES.length
    ) {
        const originalUpgrade =
            FACTORY_UPGRADES[currentLevel];

        return {
            level: currentLevel + 1,
            cost: originalUpgrade.cost,
            gain: originalUpgrade.multiplier,
            image:
                originalUpgrade.img ||
                "imgs/firstFactory.png"
        };
    }

    /*
        Levels after the original list are generated
        from the final original Factory upgrade.
    */
    const lastOriginalUpgrade =
        FACTORY_UPGRADES[
            FACTORY_UPGRADES.length - 1
        ];

    if (!lastOriginalUpgrade) {
        return null;
    }

    const generatedStep =
        currentLevel -
        FACTORY_UPGRADES.length +
        1;

    const generatedCost =
        Math.floor(
            lastOriginalUpgrade.cost *
            Math.pow(
                FACTORY_COST_GROWTH,
                generatedStep
            )
        );

    const generatedGain =
        Math.max(
            1,
            Math.floor(
                lastOriginalUpgrade.multiplier *
                Math.pow(
                    FACTORY_GAIN_GROWTH,
                    generatedStep
                )
            )
        );

    return {
        level: currentLevel + 1,
        cost: generatedCost,
        gain: generatedGain,
        image:
            lastOriginalUpgrade.img ||
            "imgs/firstFactory.png"
    };
}


// -------------------------------------------------
// CALCULATE FACTORY PRODUCTION FROM ITS LEVEL
// -------------------------------------------------

function calculateFactoryProductionFromLevel(
    level
) {
    const safeLevel =
        Math.min(
            Math.max(
                Math.floor(level),
                0
            ),
            FACTORY_MAX_LEVEL
        );

    let calculatedProduction = 0;

    for (
        let currentLevel = 0;
        currentLevel < safeLevel;
        currentLevel++
    ) {
        const upgradeData =
            getFactoryUpgradeData(
                currentLevel
            );

        if (!upgradeData) {
            break;
        }

        calculatedProduction +=
            upgradeData.gain;
    }

    return calculatedProduction;
}


// -------------------------------------------------
// GET THE CURRENT FACTORY MILESTONE
// -------------------------------------------------

function getCurrentFactoryMilestone(level) {
    let currentMilestone =
        FACTORY_TIER_MILESTONES[0];

    for (
        const milestone of
        FACTORY_TIER_MILESTONES
    ) {
        if (level < milestone.level) {
            break;
        }

        currentMilestone = milestone;
    }

    return currentMilestone;
}


// -------------------------------------------------
// GET THE NEXT FACTORY MILESTONE
// -------------------------------------------------

function getNextFactoryMilestone(level) {
    return (
        FACTORY_TIER_MILESTONES.find(
            (milestone) =>
                milestone.level > level
        ) || null
    );
}


// -------------------------------------------------
// GET FACTORY-MILESTONE PROGRESS
// -------------------------------------------------

function getFactoryMilestoneProgress(level) {
    const currentMilestone =
        getCurrentFactoryMilestone(
            level
        );

    const nextMilestone =
        getNextFactoryMilestone(
            level
        );

    if (!nextMilestone) {
        return 100;
    }

    const milestoneDistance =
        nextMilestone.level -
        currentMilestone.level;

    const completedDistance =
        level -
        currentMilestone.level;

    return Math.min(
        100,
        Math.max(
            0,
            (
                completedDistance /
                milestoneDistance
            ) * 100
        )
    );
}


// -------------------------------------------------
// GET FACTORY ARTWORK FOR A MILESTONE
// -------------------------------------------------

function getFactoryMilestoneImage(
    milestone
) {
    const finalUpgradeIndex =
        Math.max(
            0,
            FACTORY_UPGRADES.length - 1
        );

    const safeSourceIndex =
        Math.min(
            Math.max(
                milestone.sourceIndex,
                0
            ),
            finalUpgradeIndex
        );

    const artworkUpgrade =
        FACTORY_UPGRADES[
            safeSourceIndex
        ];

    return (
        artworkUpgrade?.img ||
        "imgs/firstFactory.png"
    );
}


// -------------------------------------------------
// UPDATE THE FACTORY CARD
// -------------------------------------------------

function updateFactoryUpgradeCard() {
    const elements =
        getFactoryUpgradeElements();

    /*
        The Factory card does not exist while
        another shop or Player Hub is open.
    */
    if (!elements.card) {
        return;
    }

    const currentMilestone =
        getCurrentFactoryMilestone(
            mobileFactoryUpgradeIndex
        );

    const nextMilestone =
        getNextFactoryMilestone(
            mobileFactoryUpgradeIndex
        );

    elements.image.src =
        getFactoryMilestoneImage(
            currentMilestone
        );

    elements.name.textContent =
        "FACTORY";

    elements.level.textContent =
        `LEVEL ${mobileFactoryUpgradeIndex} • FACTORY TIER ${currentMilestone.tier}`;

    if (
        mobileFactoryUpgradeIndex >=
        FACTORY_MAX_LEVEL
    ) {
        elements.description.textContent =
            "Factory has reached its current maximum level.";

        if (elements.progressText) {
            elements.progressText.textContent =
                "HIGHEST CURRENT FACTORY TIER";
        }

        if (elements.progressFill) {
            elements.progressFill.style.width =
                "100%";
        }

        elements.cost.textContent =
            "MAX";

        elements.buyButton.textContent =
            "MAXED";

        elements.buyButton.disabled =
            true;

        return;
    }

    const nextUpgrade =
        getFactoryUpgradeData(
            mobileFactoryUpgradeIndex
        );

    if (!nextUpgrade) {
        elements.buyButton.disabled =
            true;

        return;
    }

    elements.description.textContent =
        `Next level adds +${formatGameNumber(
            nextUpgrade.gain
        )} energy per second.`;

    if (elements.progressText) {
        elements.progressText.textContent =
            nextMilestone
                ? `NEXT FACTORY AT LEVEL ${nextMilestone.level}`
                : "HIGHEST CURRENT FACTORY TIER";
    }

    if (elements.progressFill) {
        elements.progressFill.style.width =
            `${getFactoryMilestoneProgress(
                mobileFactoryUpgradeIndex
            )}%`;
    }

    elements.cost.textContent =
        formatGameNumber(
            nextUpgrade.cost
        );

    elements.buyButton.textContent =
        "BUY";

    elements.buyButton.disabled =
        false;
}


// -------------------------------------------------
// BUY A FACTORY UPGRADE
// -------------------------------------------------

function buyFactoryUpgrade() {
    if (
        mobileFactoryUpgradeIndex >=
        FACTORY_MAX_LEVEL
    ) {
        return;
    }

    const currentFactory =
        getFactoryUpgradeData(
            mobileFactoryUpgradeIndex
        );

    const elements =
        getFactoryUpgradeElements();

    if (!currentFactory) {
        return;
    }

    if (
        mobileEnergy <
        currentFactory.cost
    ) {
        showPurchaseFailure(
            elements.card
        );

        return;
    }

    const previousTier =
        getCurrentFactoryMilestone(
            mobileFactoryUpgradeIndex
        ).tier;

    mobileEnergy -=
        currentFactory.cost;

    mobileEnergyPerSecond +=
        currentFactory.gain;

    mobileFactoryUpgradeIndex++;

    const newTier =
        getCurrentFactoryMilestone(
            mobileFactoryUpgradeIndex
        ).tier;

    updateShopBalance();

    elements.card.classList.remove(
        "purchaseSuccess",
        "factoryTierUnlocked"
    );

    void elements.card.offsetWidth;

    if (newTier > previousTier) {
        elements.card.classList.add(
            "factoryTierUnlocked"
        );
    } else {
        elements.card.classList.add(
            "purchaseSuccess"
        );
    }

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess",
            "factoryTierUnlocked"
        );
    }, 700);
}


// -------------------------------------------------
// GENERIC SCALABLE-UPGRADE MILESTONE HELPERS
// -------------------------------------------------

function getCurrentUpgradeMilestone(
    level,
    milestones
) {
    let currentMilestone =
        milestones[0];

    for (const milestone of milestones) {
        if (level < milestone.level) {
            break;
        }

        currentMilestone = milestone;
    }

    return currentMilestone;
}


function getNextUpgradeMilestone(
    level,
    milestones
) {
    return (
        milestones.find(
            (milestone) =>
                milestone.level > level
        ) || null
    );
}


function getUpgradeMilestoneProgress(
    level,
    milestones
) {
    const currentMilestone =
        getCurrentUpgradeMilestone(
            level,
            milestones
        );

    const nextMilestone =
        getNextUpgradeMilestone(
            level,
            milestones
        );

    if (!nextMilestone) {
        return 100;
    }

    const milestoneDistance =
        nextMilestone.level -
        currentMilestone.level;

    const completedDistance =
        level -
        currentMilestone.level;

    return Math.min(
        100,
        Math.max(
            0,
            (
                completedDistance /
                milestoneDistance
            ) * 100
        )
    );
}


function getUpgradeMilestoneImage(
    milestone,
    upgradeArray,
    fallbackImage
) {
    if (!upgradeArray.length) {
        return fallbackImage;
    }

    const finalUpgradeIndex =
        upgradeArray.length - 1;

    const safeSourceIndex =
        Math.min(
            Math.max(
                milestone.sourceIndex || 0,
                0
            ),
            finalUpgradeIndex
        );

    return (
        upgradeArray[safeSourceIndex]?.img ||
        fallbackImage
    );
}


// -------------------------------------------------
// GET THE DELIVERY TRUCK CARD ELEMENTS
// -------------------------------------------------

function getDeliveryTruckElements() {
    return {
        card:
            document.getElementById(
                "deliveryUpgradeCard"
            ),

        image:
            document.getElementById(
                "deliveryUpgradeImage"
            ),

        name:
            document.getElementById(
                "deliveryUpgradeName"
            ),

        level:
            document.getElementById(
                "deliveryUpgradeLevel"
            ),

        description:
            document.getElementById(
                "deliveryUpgradeDescription"
            ),

        progressText:
            document.getElementById(
                "deliveryTierProgressText"
            ),

        progressFill:
            document.getElementById(
                "deliveryTierProgressFill"
            ),

        cost:
            document.getElementById(
                "deliveryUpgradeCost"
            ),

        buyButton:
            document.getElementById(
                "deliveryUpgradeBuyButton"
            )
    };
}


// -------------------------------------------------
// GET ONE DELIVERY LEVEL'S COST AND GAIN
// -------------------------------------------------

function getDeliveryUpgradeData(currentLevel) {
    if (
        !Number.isInteger(currentLevel) ||
        currentLevel < 0 ||
        currentLevel >= DELIVERY_MAX_LEVEL
    ) {
        return null;
    }

    if (currentLevel < DELIVERY_UPGRADES.length) {
        const originalUpgrade =
            DELIVERY_UPGRADES[currentLevel];

        return {
            level: currentLevel + 1,
            cost: originalUpgrade.cost,
            gain: originalUpgrade.multiplier,
            image: originalUpgrade.img
        };
    }

    const lastOriginalUpgrade =
        DELIVERY_UPGRADES[
            DELIVERY_UPGRADES.length - 1
        ];

    if (!lastOriginalUpgrade) {
        return null;
    }

    const generatedStep =
        currentLevel -
        DELIVERY_UPGRADES.length +
        1;

    return {
        level: currentLevel + 1,
        cost: Math.floor(
            lastOriginalUpgrade.cost *
            Math.pow(
                DELIVERY_COST_GROWTH,
                generatedStep
            )
        ),
        gain: Math.max(
            1,
            Math.floor(
                lastOriginalUpgrade.multiplier *
                Math.pow(
                    DELIVERY_GAIN_GROWTH,
                    generatedStep
                )
            )
        ),
        image: lastOriginalUpgrade.img
    };
}


// -------------------------------------------------
// CALCULATE DELIVERY PRODUCTION FROM ITS LEVEL
// -------------------------------------------------

function calculateDeliveryProductionFromLevel(
    level
) {
    const safeLevel =
        Math.min(
            Math.max(
                Math.floor(level),
                0
            ),
            DELIVERY_MAX_LEVEL
        );

    let calculatedProduction = 0;

    for (
        let currentLevel = 0;
        currentLevel < safeLevel;
        currentLevel++
    ) {
        const upgradeData =
            getDeliveryUpgradeData(
                currentLevel
            );

        if (!upgradeData) {
            break;
        }

        calculatedProduction +=
            upgradeData.gain;
    }

    return calculatedProduction;
}


// -------------------------------------------------
// UPDATE THE DELIVERY TRUCK CARD
// -------------------------------------------------

function updateDeliveryTruckCard() {
    const elements =
        getDeliveryTruckElements();

    if (!elements.card) {
        return;
    }

    const currentMilestone =
        getCurrentUpgradeMilestone(
            mobileDeliveryUpgradeIndex,
            DELIVERY_TIER_MILESTONES
        );

    const nextMilestone =
        getNextUpgradeMilestone(
            mobileDeliveryUpgradeIndex,
            DELIVERY_TIER_MILESTONES
        );

    elements.image.src =
        getUpgradeMilestoneImage(
            currentMilestone,
            DELIVERY_UPGRADES,
            "imgs/firstCan.png"
        );

    elements.name.textContent =
        "DELIVERY TRUCK";

    elements.level.textContent =
        `LEVEL ${mobileDeliveryUpgradeIndex} • DELIVERY TIER ${currentMilestone.tier}`;

    if (
        mobileDeliveryUpgradeIndex >=
        DELIVERY_MAX_LEVEL
    ) {
        elements.description.textContent =
            "Delivery has reached its current maximum level.";

        elements.progressText.textContent =
            "HIGHEST CURRENT DELIVERY TIER";

        elements.progressFill.style.width =
            "100%";

        elements.cost.textContent = "MAX";
        elements.buyButton.textContent = "MAXED";
        elements.buyButton.disabled = true;
        return;
    }

    const nextUpgrade =
        getDeliveryUpgradeData(
            mobileDeliveryUpgradeIndex
        );

    if (!nextUpgrade) {
        elements.buyButton.disabled = true;
        return;
    }

    elements.description.textContent =
        `Next level adds +${formatGameNumber(
            nextUpgrade.gain
        )} energy per second.`;

    elements.progressText.textContent =
        nextMilestone
            ? `NEXT DELIVERY TIER AT LEVEL ${nextMilestone.level}`
            : "HIGHEST CURRENT DELIVERY TIER";

    elements.progressFill.style.width =
        `${getUpgradeMilestoneProgress(
            mobileDeliveryUpgradeIndex,
            DELIVERY_TIER_MILESTONES
        )}%`;

    elements.cost.textContent =
        formatGameNumber(
            nextUpgrade.cost
        );

    elements.buyButton.textContent = "BUY";
    elements.buyButton.disabled = false;
}


// -------------------------------------------------
// BUY A DELIVERY TRUCK UPGRADE
// -------------------------------------------------

function buyDeliveryTruckUpgrade() {
    if (
        mobileDeliveryUpgradeIndex >=
        DELIVERY_MAX_LEVEL
    ) {
        return;
    }

    const currentUpgrade =
        getDeliveryUpgradeData(
            mobileDeliveryUpgradeIndex
        );

    const elements =
        getDeliveryTruckElements();

    if (!currentUpgrade) {
        return;
    }

    if (mobileEnergy < currentUpgrade.cost) {
        showPurchaseFailure(elements.card);
        return;
    }

    const previousTier =
        getCurrentUpgradeMilestone(
            mobileDeliveryUpgradeIndex,
            DELIVERY_TIER_MILESTONES
        ).tier;

    mobileEnergy -= currentUpgrade.cost;
    mobileEnergyPerSecond += currentUpgrade.gain;
    mobileDeliveryUpgradeIndex++;

    const newTier =
        getCurrentUpgradeMilestone(
            mobileDeliveryUpgradeIndex,
            DELIVERY_TIER_MILESTONES
        ).tier;

    updateShopBalance();

    elements.card.classList.remove(
        "purchaseSuccess",
        "scalableTierUnlocked"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        newTier > previousTier
            ? "scalableTierUnlocked"
            : "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess",
            "scalableTierUnlocked"
        );
    }, 700);
}

// -------------------------------------------------
// GET THE PRE-WORKOUT CARD ELEMENTS
// -------------------------------------------------

function getPreWorkoutElements() {
    return {
        card:
            document.getElementById(
                "preWorkoutUpgradeCard"
            ),

        image:
            document.getElementById(
                "preWorkoutUpgradeImage"
            ),

        name:
            document.getElementById(
                "preWorkoutUpgradeName"
            ),

        level:
            document.getElementById(
                "preWorkoutUpgradeLevel"
            ),

        description:
            document.getElementById(
                "preWorkoutUpgradeDescription"
            ),

        progressText:
            document.getElementById(
                "preWorkoutTierProgressText"
            ),

        progressFill:
            document.getElementById(
                "preWorkoutTierProgressFill"
            ),

        cost:
            document.getElementById(
                "preWorkoutUpgradeCost"
            ),

        buyButton:
            document.getElementById(
                "preWorkoutUpgradeBuyButton"
            )
    };
}


// -------------------------------------------------
// GET ONE PRE-WORKOUT LEVEL'S COST AND GAIN
// -------------------------------------------------

function getPreWorkoutUpgradeData(currentLevel) {
    if (
        !Number.isInteger(currentLevel) ||
        currentLevel < 0 ||
        currentLevel >= PREWORKOUT_MAX_LEVEL
    ) {
        return null;
    }

    if (currentLevel < PREWORKOUT_UPGRADES.length) {
        const originalUpgrade =
            PREWORKOUT_UPGRADES[currentLevel];

        return {
            level: currentLevel + 1,
            cost: originalUpgrade.cost,
            gain: originalUpgrade.multiplier,
            image: originalUpgrade.img
        };
    }

    const lastOriginalUpgrade =
        PREWORKOUT_UPGRADES[
            PREWORKOUT_UPGRADES.length - 1
        ];

    if (!lastOriginalUpgrade) {
        return null;
    }

    const generatedStep =
        currentLevel -
        PREWORKOUT_UPGRADES.length +
        1;

    return {
        level: currentLevel + 1,
        cost: Math.floor(
            lastOriginalUpgrade.cost *
            Math.pow(
                PREWORKOUT_COST_GROWTH,
                generatedStep
            )
        ),
        gain: Math.max(
            1,
            Math.floor(
                lastOriginalUpgrade.multiplier *
                Math.pow(
                    PREWORKOUT_GAIN_GROWTH,
                    generatedStep
                )
            )
        ),
        image: lastOriginalUpgrade.img
    };
}


// -------------------------------------------------
// CALCULATE PRE-WORKOUT PRODUCTION FROM ITS LEVEL
// -------------------------------------------------

function calculatePreWorkoutProductionFromLevel(
    level
) {
    const safeLevel =
        Math.min(
            Math.max(
                Math.floor(level),
                0
            ),
            PREWORKOUT_MAX_LEVEL
        );

    let calculatedProduction = 0;

    for (
        let currentLevel = 0;
        currentLevel < safeLevel;
        currentLevel++
    ) {
        const upgradeData =
            getPreWorkoutUpgradeData(
                currentLevel
            );

        if (!upgradeData) {
            break;
        }

        calculatedProduction +=
            upgradeData.gain;
    }

    return calculatedProduction;
}


// -------------------------------------------------
// UPDATE THE PRE-WORKOUT CARD
// -------------------------------------------------

function updatePreWorkoutCard() {
    const elements =
        getPreWorkoutElements();

    if (!elements.card) {
        return;
    }

    const currentMilestone =
        getCurrentUpgradeMilestone(
            mobilePreWorkoutUpgradeIndex,
            PREWORKOUT_TIER_MILESTONES
        );

    const nextMilestone =
        getNextUpgradeMilestone(
            mobilePreWorkoutUpgradeIndex,
            PREWORKOUT_TIER_MILESTONES
        );

    elements.image.src =
        getUpgradeMilestoneImage(
            currentMilestone,
            PREWORKOUT_UPGRADES,
            "imgs/firstCan.png"
        );

    elements.name.textContent =
        "PRE-WORKOUT";

    elements.level.textContent =
        `LEVEL ${mobilePreWorkoutUpgradeIndex} • FORMULA TIER ${currentMilestone.tier}`;

    if (
        mobilePreWorkoutUpgradeIndex >=
        PREWORKOUT_MAX_LEVEL
    ) {
        elements.description.textContent =
            "Pre-Workout has reached its current maximum level.";

        elements.progressText.textContent =
            "HIGHEST CURRENT FORMULA TIER";

        elements.progressFill.style.width =
            "100%";

        elements.cost.textContent = "MAX";
        elements.buyButton.textContent = "MAXED";
        elements.buyButton.disabled = true;
        return;
    }

    const nextUpgrade =
        getPreWorkoutUpgradeData(
            mobilePreWorkoutUpgradeIndex
        );

    if (!nextUpgrade) {
        elements.buyButton.disabled = true;
        return;
    }

    elements.description.textContent =
        `Next level adds +${formatGameNumber(
            nextUpgrade.gain
        )} energy per second.`;

    elements.progressText.textContent =
        nextMilestone
            ? `NEXT FORMULA TIER AT LEVEL ${nextMilestone.level}`
            : "HIGHEST CURRENT FORMULA TIER";

    elements.progressFill.style.width =
        `${getUpgradeMilestoneProgress(
            mobilePreWorkoutUpgradeIndex,
            PREWORKOUT_TIER_MILESTONES
        )}%`;

    elements.cost.textContent =
        formatGameNumber(
            nextUpgrade.cost
        );

    elements.buyButton.textContent = "BUY";
    elements.buyButton.disabled = false;
}


// -------------------------------------------------
// BUY A PRE-WORKOUT UPGRADE
// -------------------------------------------------

function buyPreWorkoutUpgrade() {
    if (
        mobilePreWorkoutUpgradeIndex >=
        PREWORKOUT_MAX_LEVEL
    ) {
        return;
    }

    const currentUpgrade =
        getPreWorkoutUpgradeData(
            mobilePreWorkoutUpgradeIndex
        );

    const elements =
        getPreWorkoutElements();

    if (!currentUpgrade) {
        return;
    }

    if (mobileEnergy < currentUpgrade.cost) {
        showPurchaseFailure(elements.card);
        return;
    }

    const previousTier =
        getCurrentUpgradeMilestone(
            mobilePreWorkoutUpgradeIndex,
            PREWORKOUT_TIER_MILESTONES
        ).tier;

    mobileEnergy -= currentUpgrade.cost;
    mobileEnergyPerSecond += currentUpgrade.gain;
    mobilePreWorkoutUpgradeIndex++;

    const newTier =
        getCurrentUpgradeMilestone(
            mobilePreWorkoutUpgradeIndex,
            PREWORKOUT_TIER_MILESTONES
        ).tier;

    updateShopBalance();

    elements.card.classList.remove(
        "purchaseSuccess",
        "scalableTierUnlocked"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        newTier > previousTier
            ? "scalableTierUnlocked"
            : "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess",
            "scalableTierUnlocked"
        );
    }, 700);
}

// -------------------------------------------------
// GET THE LUCKY SHOT CARD ELEMENTS
// -------------------------------------------------

function getLuckyShotElements() {
    return {
        card:
            document.getElementById(
                "luckyShotUpgradeCard"
            ),

        image:
            document.getElementById(
                "luckyShotUpgradeImage"
            ),

        name:
            document.getElementById(
                "luckyShotUpgradeName"
            ),

        level:
            document.getElementById(
                "luckyShotUpgradeLevel"
            ),

        description:
            document.getElementById(
                "luckyShotUpgradeDescription"
            ),

        progressText:
            document.getElementById(
                "luckyShotTierProgressText"
            ),

        progressFill:
            document.getElementById(
                "luckyShotTierProgressFill"
            ),

        cost:
            document.getElementById(
                "luckyShotUpgradeCost"
            ),

        buyButton:
            document.getElementById(
                "luckyShotUpgradeBuyButton"
            )
    };
}


// -------------------------------------------------
// GET ONE LUCKY SHOT LEVEL'S VALUES
// -------------------------------------------------

function getLuckyShotUpgradeData(currentLevel) {
    if (
        !Number.isInteger(currentLevel) ||
        currentLevel < 0 ||
        currentLevel >= LUCKY_SHOT_MAX_LEVEL
    ) {
        return null;
    }

    if (currentLevel < LUCKYSHOT_UPGRADES.length) {
        const originalUpgrade =
            LUCKYSHOT_UPGRADES[currentLevel];

        return {
            level: currentLevel + 1,
            cost: originalUpgrade.cost,
            chanceIncrease:
                originalUpgrade.chanceIncrease,
            bonusIncrease: 0,
            image: originalUpgrade.img
        };
    }

    const lastOriginalUpgrade =
        LUCKYSHOT_UPGRADES[
            LUCKYSHOT_UPGRADES.length - 1
        ];

    if (!lastOriginalUpgrade) {
        return null;
    }

    const generatedStep =
        currentLevel -
        LUCKYSHOT_UPGRADES.length +
        1;

    return {
        level: currentLevel + 1,
        cost: Math.floor(
            lastOriginalUpgrade.cost *
            Math.pow(
                LUCKY_SHOT_COST_GROWTH,
                generatedStep
            )
        ),
        chanceIncrease:
            LUCKY_SHOT_GENERATED_CHANCE_GAIN,
        bonusIncrease:
            LUCKY_SHOT_GENERATED_BONUS_GAIN,
        image: lastOriginalUpgrade.img
    };
}


// -------------------------------------------------
// CALCULATE LUCKY SHOT VALUES FROM ITS LEVEL
// -------------------------------------------------

function calculateLuckyShotValuesFromLevel(
    level
) {
    const safeLevel =
        Math.min(
            Math.max(
                Math.floor(level),
                0
            ),
            LUCKY_SHOT_MAX_LEVEL
        );

    let chance = 0;
    let bonusMultiplier = 0.20;

    for (
        let currentLevel = 0;
        currentLevel < safeLevel;
        currentLevel++
    ) {
        const upgradeData =
            getLuckyShotUpgradeData(
                currentLevel
            );

        if (!upgradeData) {
            break;
        }

        chance = Math.min(
            LUCKY_SHOT_MAX_CHANCE,
            chance +
            upgradeData.chanceIncrease
        );

        bonusMultiplier +=
            upgradeData.bonusIncrease;
    }

    return {
        chance,
        bonusMultiplier
    };
}


// -------------------------------------------------
// UPDATE THE LUCKY SHOT CARD
// -------------------------------------------------

function updateLuckyShotCard() {
    const elements =
        getLuckyShotElements();

    if (!elements.card) {
        return;
    }

    const currentMilestone =
        getCurrentUpgradeMilestone(
            mobileLuckyShotUpgradeIndex,
            LUCKY_SHOT_TIER_MILESTONES
        );

    const nextMilestone =
        getNextUpgradeMilestone(
            mobileLuckyShotUpgradeIndex,
            LUCKY_SHOT_TIER_MILESTONES
        );

    elements.image.src =
        LUCKYSHOT_UPGRADES[0]?.img ||
        "imgs/luckyUpgrade.png";

    elements.name.textContent =
        "LUCKY SHOT";

    elements.level.textContent =
        `LEVEL ${mobileLuckyShotUpgradeIndex} • LUCK TIER ${currentMilestone.tier}`;

    if (
        mobileLuckyShotUpgradeIndex >=
        LUCKY_SHOT_MAX_LEVEL
    ) {
        elements.description.textContent =
            `Maximum current level. ${formatChancePercent(
                mobileLuckyShotChance
            )} chance with a ${formatChancePercent(
                mobileLuckyShotBonusMultiplier
            )} reward.`;

        elements.progressText.textContent =
            "HIGHEST CURRENT LUCK TIER";

        elements.progressFill.style.width =
            "100%";

        elements.cost.textContent = "MAX";
        elements.buyButton.textContent = "MAXED";
        elements.buyButton.disabled = true;
        return;
    }

    const nextUpgrade =
        getLuckyShotUpgradeData(
            mobileLuckyShotUpgradeIndex
        );

    if (!nextUpgrade) {
        elements.buyButton.disabled = true;
        return;
    }

    const chanceText =
        mobileLuckyShotChance >=
        LUCKY_SHOT_MAX_CHANCE
            ? "Chance is capped; "
            : `+${formatChancePercent(
                nextUpgrade.chanceIncrease
            )} chance and `;

    elements.description.textContent =
        `${chanceText}+${formatChancePercent(
            nextUpgrade.bonusIncrease
        )} bonus reward. Current reward: ${formatChancePercent(
            mobileLuckyShotBonusMultiplier
        )}.`;

    elements.progressText.textContent =
        nextMilestone
            ? `NEXT LUCK TIER AT LEVEL ${nextMilestone.level}`
            : "HIGHEST CURRENT LUCK TIER";

    elements.progressFill.style.width =
        `${getUpgradeMilestoneProgress(
            mobileLuckyShotUpgradeIndex,
            LUCKY_SHOT_TIER_MILESTONES
        )}%`;

    elements.cost.textContent =
        formatGameNumber(
            nextUpgrade.cost
        );

    elements.buyButton.textContent = "BUY";
    elements.buyButton.disabled = false;
}


// -------------------------------------------------
// BUY A LUCKY SHOT UPGRADE
// -------------------------------------------------

function buyLuckyShotUpgrade() {
    if (
        mobileLuckyShotUpgradeIndex >=
        LUCKY_SHOT_MAX_LEVEL
    ) {
        return;
    }

    const currentUpgrade =
        getLuckyShotUpgradeData(
            mobileLuckyShotUpgradeIndex
        );

    const elements =
        getLuckyShotElements();

    if (!currentUpgrade) {
        return;
    }

    if (mobileEnergy < currentUpgrade.cost) {
        showPurchaseFailure(elements.card);
        return;
    }

    const previousTier =
        getCurrentUpgradeMilestone(
            mobileLuckyShotUpgradeIndex,
            LUCKY_SHOT_TIER_MILESTONES
        ).tier;

    mobileEnergy -= currentUpgrade.cost;

    mobileLuckyShotChance = Math.min(
        LUCKY_SHOT_MAX_CHANCE,
        mobileLuckyShotChance +
        currentUpgrade.chanceIncrease
    );

    mobileLuckyShotBonusMultiplier +=
        currentUpgrade.bonusIncrease;

    mobileLuckyShotUpgradeIndex++;

    const newTier =
        getCurrentUpgradeMilestone(
            mobileLuckyShotUpgradeIndex,
            LUCKY_SHOT_TIER_MILESTONES
        ).tier;

    updateShopBalance();

    elements.card.classList.remove(
        "purchaseSuccess",
        "scalableTierUnlocked"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        newTier > previousTier
            ? "scalableTierUnlocked"
            : "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess",
            "scalableTierUnlocked"
        );
    }, 700);
}

// -------------------------------------------------
// TRY TO ACTIVATE LUCKY SHOT
// -------------------------------------------------

function tryLuckyShot() {
    const currentLuckyChance =
        getCurrentLuckyShotChance();

    if (currentLuckyChance <= 0) {
        return;
    }

    if (Math.random() >= currentLuckyChance) {
        return;
    }

    const luckyShotBonus =
        Math.max(
            1,
            Math.floor(
                mobileEnergy *
                getCurrentLuckyShotBonusMultiplier()
            )
        );

    mobileEnergy +=
        luckyShotBonus;

    mobileLifetimeEnergy +=
        luckyShotBonus;

    mobileLuckyShotsActivated++;

    showLuckyShotMessage(
        luckyShotBonus
    );
}


// -------------------------------------------------
// SHOW THE LUCKY SHOT MESSAGE
// -------------------------------------------------

function showLuckyShotMessage(bonusAmount) {
    if (luckyShotMessageTimer) {
        clearTimeout(
            luckyShotMessageTimer
        );
    }

    mobileGameMessage.textContent =
        `LUCKY SHOT! +${formatGameNumber(bonusAmount)}`;

    mobileGameMessage.classList.remove(
        "luckyShotActive"
    );

    void mobileGameMessage.offsetWidth;

    mobileGameMessage.classList.add(
        "luckyShotActive"
    );

    luckyShotMessageTimer =
        setTimeout(() => {
            mobileGameMessage.classList.remove(
                "luckyShotActive"
            );

            mobileGameMessage.textContent =
                "";
        }, 1300);
}

// -------------------------------------------------
// GET KINETIC OVERFLOW CARD ELEMENTS
// -------------------------------------------------

function getKineticOverflowElements() {
    return {
        card:
            document.getElementById(
                "kineticUpgradeCard"
            ),

        image:
            document.getElementById(
                "kineticUpgradeImage"
            ),

        name:
            document.getElementById(
                "kineticUpgradeName"
            ),

        level:
            document.getElementById(
                "kineticUpgradeLevel"
            ),

        description:
            document.getElementById(
                "kineticUpgradeDescription"
            ),

        progressText:
            document.getElementById(
                "kineticTierProgressText"
            ),

        progressFill:
            document.getElementById(
                "kineticTierProgressFill"
            ),

        cost:
            document.getElementById(
                "kineticUpgradeCost"
            ),

        buyButton:
            document.getElementById(
                "kineticUpgradeBuyButton"
            )
    };
}


// -------------------------------------------------
// GET ONE KINETIC OVERFLOW LEVEL'S VALUES
// -------------------------------------------------

function getKineticUpgradeData(currentLevel) {
    if (
        !Number.isInteger(currentLevel) ||
        currentLevel < 0 ||
        currentLevel >= KINETIC_MAX_LEVEL
    ) {
        return null;
    }

    if (
        currentLevel <
        KINETIC_OVERFLOW_UPGRADES.length
    ) {
        const originalUpgrade =
            KINETIC_OVERFLOW_UPGRADES[
                currentLevel
            ];

        return {
            level: currentLevel + 1,
            cost: originalUpgrade.cost,
            chance: originalUpgrade.chance,
            multiplier: originalUpgrade.multiplier,
            duration: originalUpgrade.duration,
            image: originalUpgrade.img
        };
    }

    const lastOriginalUpgrade =
        KINETIC_OVERFLOW_UPGRADES[
            KINETIC_OVERFLOW_UPGRADES.length - 1
        ];

    if (!lastOriginalUpgrade) {
        return null;
    }

    const generatedStep =
        currentLevel -
        KINETIC_OVERFLOW_UPGRADES.length +
        1;

    return {
        level: currentLevel + 1,
        cost: Math.floor(
            lastOriginalUpgrade.cost *
            Math.pow(
                KINETIC_COST_GROWTH,
                generatedStep
            )
        ),
        chance: Math.min(
            KINETIC_MAX_CHANCE,
            lastOriginalUpgrade.chance +
            KINETIC_GENERATED_CHANCE_GAIN *
            generatedStep
        ),
        multiplier: Number(
            (
                lastOriginalUpgrade.multiplier +
                KINETIC_GENERATED_MULTIPLIER_GAIN *
                generatedStep
            ).toFixed(2)
        ),
        duration: Number(
            Math.min(
                KINETIC_MAX_DURATION,
                lastOriginalUpgrade.duration +
                KINETIC_GENERATED_DURATION_GAIN *
                generatedStep
            ).toFixed(2)
        ),
        image: lastOriginalUpgrade.img
    };
}


// -------------------------------------------------
// CALCULATE KINETIC VALUES FROM ITS LEVEL
// -------------------------------------------------

function calculateKineticValuesFromLevel(level) {
    const safeLevel =
        Math.min(
            Math.max(
                Math.floor(level),
                0
            ),
            KINETIC_MAX_LEVEL
        );

    if (safeLevel <= 0) {
        return {
            chance: 0,
            multiplier: 1,
            duration: 0
        };
    }

    const currentUpgrade =
        getKineticUpgradeData(
            safeLevel - 1
        );

    return currentUpgrade
        ? {
            chance: currentUpgrade.chance,
            multiplier:
                currentUpgrade.multiplier,
            duration: currentUpgrade.duration
        }
        : {
            chance: 0,
            multiplier: 1,
            duration: 0
        };
}


// -------------------------------------------------
// UPDATE KINETIC OVERFLOW CARD
// -------------------------------------------------

function updateKineticOverflowCard() {
    const elements =
        getKineticOverflowElements();

    if (!elements.card) {
        return;
    }

    const currentMilestone =
        getCurrentUpgradeMilestone(
            mobileKineticUpgradeIndex,
            KINETIC_TIER_MILESTONES
        );

    const nextMilestone =
        getNextUpgradeMilestone(
            mobileKineticUpgradeIndex,
            KINETIC_TIER_MILESTONES
        );

    elements.image.src =
        getUpgradeMilestoneImage(
            currentMilestone,
            KINETIC_OVERFLOW_UPGRADES,
            "imgs/firstCan.png"
        );

    elements.name.textContent =
        "KINETIC OVERFLOW";

    elements.level.textContent =
        `LEVEL ${mobileKineticUpgradeIndex} • OVERFLOW TIER ${currentMilestone.tier}`;

    if (
        mobileKineticUpgradeIndex >=
        KINETIC_MAX_LEVEL
    ) {
        elements.description.textContent =
            `Maximum current level: ${formatChancePercent(
                mobileKineticChance
            )} chance, ×${mobileKineticMultiplier}, ${mobileKineticDuration}s.`;

        elements.progressText.textContent =
            "HIGHEST CURRENT OVERFLOW TIER";

        elements.progressFill.style.width =
            "100%";

        elements.cost.textContent = "MAX";
        elements.buyButton.textContent = "MAXED";
        elements.buyButton.disabled = true;
        return;
    }

    const nextUpgrade =
        getKineticUpgradeData(
            mobileKineticUpgradeIndex
        );

    if (!nextUpgrade) {
        elements.buyButton.disabled = true;
        return;
    }

    elements.description.textContent =
        `Next level: ${formatChancePercent(
            nextUpgrade.chance
        )} chance, ×${nextUpgrade.multiplier} tap power for ${nextUpgrade.duration}s.`;

    elements.progressText.textContent =
        nextMilestone
            ? `NEXT OVERFLOW TIER AT LEVEL ${nextMilestone.level}`
            : "HIGHEST CURRENT OVERFLOW TIER";

    elements.progressFill.style.width =
        `${getUpgradeMilestoneProgress(
            mobileKineticUpgradeIndex,
            KINETIC_TIER_MILESTONES
        )}%`;

    elements.cost.textContent =
        formatGameNumber(
            nextUpgrade.cost
        );

    elements.buyButton.textContent = "BUY";
    elements.buyButton.disabled = false;
}


// -------------------------------------------------
// BUY KINETIC OVERFLOW UPGRADE
// -------------------------------------------------

function buyKineticOverflowUpgrade() {
    if (
        mobileKineticUpgradeIndex >=
        KINETIC_MAX_LEVEL
    ) {
        return;
    }

    const currentUpgrade =
        getKineticUpgradeData(
            mobileKineticUpgradeIndex
        );

    const elements =
        getKineticOverflowElements();

    if (!currentUpgrade) {
        return;
    }

    if (mobileEnergy < currentUpgrade.cost) {
        showPurchaseFailure(elements.card);
        return;
    }

    const previousTier =
        getCurrentUpgradeMilestone(
            mobileKineticUpgradeIndex,
            KINETIC_TIER_MILESTONES
        ).tier;

    mobileEnergy -= currentUpgrade.cost;

    mobileKineticChance =
        currentUpgrade.chance;

    mobileKineticMultiplier =
        currentUpgrade.multiplier;

    mobileKineticDuration =
        currentUpgrade.duration;

    mobileKineticUpgradeIndex++;

    const newTier =
        getCurrentUpgradeMilestone(
            mobileKineticUpgradeIndex,
            KINETIC_TIER_MILESTONES
        ).tier;

    updateShopBalance();

    elements.card.classList.remove(
        "purchaseSuccess",
        "scalableTierUnlocked"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        newTier > previousTier
            ? "scalableTierUnlocked"
            : "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess",
            "scalableTierUnlocked"
        );
    }, 700);
}

// -------------------------------------------------
// GET CURRENT TAP POWER
// -------------------------------------------------

function getCurrentTapPower() {
    let currentTapPower =
        mobileEnergyPerTap *
        getTapProductionMultiplier();

    if (mobileKineticActive) {
        currentTapPower *=
            getCurrentKineticMultiplier();
    }

    return currentTapPower;
}


// -------------------------------------------------
// TRY TO ACTIVATE KINETIC OVERFLOW
// -------------------------------------------------

function tryKineticOverflow() {
    if (
        mobileKineticActive ||
        getCurrentKineticChance() <= 0
    ) {
        return;
    }

    if (
        Math.random() >=
        getCurrentKineticChance()
    ) {
        return;
    }

    startKineticOverflow();
}


// -------------------------------------------------
// START KINETIC OVERFLOW
// -------------------------------------------------

function startKineticOverflow() {
    mobileKineticActive = true;

    mobileKineticTimeLeft =
        mobileKineticDuration;

    mobileKineticActivations++;

    updateKineticStatus();
    updateShopBalance();

    if (kineticCountdownInterval) {
        clearInterval(
            kineticCountdownInterval
        );
    }

    kineticCountdownInterval =
        setInterval(() => {
            mobileKineticTimeLeft--;

            if (
                mobileKineticTimeLeft <= 0
            ) {
                stopKineticOverflow();
                return;
            }

            updateKineticStatus();
        }, 1000);
}


// -------------------------------------------------
// UPDATE KINETIC COUNTDOWN MESSAGE
// -------------------------------------------------

function updateKineticStatus() {
    kineticStatus.textContent =
        `KINETIC OVERFLOW ×${Number(
            getCurrentKineticMultiplier()
                .toFixed(2)
        )} — ${mobileKineticTimeLeft}s`;

    kineticStatus.classList.add(
        "active"
    );
}


// -------------------------------------------------
// STOP KINETIC OVERFLOW
// -------------------------------------------------

function stopKineticOverflow() {
    mobileKineticActive = false;
    mobileKineticTimeLeft = 0;

    if (kineticCountdownInterval) {
        clearInterval(
            kineticCountdownInterval
        );

        kineticCountdownInterval = null;
    }

    kineticStatus.textContent =
        "";

    kineticStatus.classList.remove(
        "active"
    );

    /*
        Return the production display to its
        normal per-tap value.
    */
    updateShopBalance();
}

// -------------------------------------------------
// CREATE THE SKINS SHOP
// -------------------------------------------------

function createSkinsShopContent() {
    /*
        This first card allows the player to return
        to their normal Drink Power can.
    */
    const defaultCanEquipped =
        mobileEquippedSkinIndex === null;

    const defaultCanCard = `
        <article
            class="upgradeCard skinCard"
            id="defaultCanSkinCard"
        >

            <img
                class="upgradeCardImage"
                src="${getCurrentBaseCanImage()}"
                alt="Normal upgraded can"
            >

            <div class="upgradeCardInformation">

                <h3 class="upgradeCardName">
                    NORMAL CAN
                </h3>

                <p class="upgradeCardLevel">
                    CAN LEVEL ${mobileDrinkUpgradeIndex}
                </p>

                <p class="upgradeCardDescription">
                    Uses the normal can earned from
                    Drink Power upgrades.
                </p>

                <div class="upgradeCardBottom">

                    <p class="upgradeCardCost">
                        OWNED
                    </p>

                    <button
                        class="buyButton skinActionButton"
                        type="button"
                        data-skin-index="default"
                        ${defaultCanEquipped ? "disabled" : ""}
                    >
                        ${defaultCanEquipped ? "EQUIPPED" : "EQUIP"}
                    </button>

                </div>

            </div>

        </article>
    `;

    const cosmeticSkinCards =
        COSMETIC_UPGRADES.map((skin, index) => {
            const skinOwned =
                mobileOwnedSkins[index];

            const skinEquipped =
                mobileEquippedSkinIndex === index;

            let buttonText = "BUY";

            if (skinEquipped) {
                buttonText = "EQUIPPED";
            } else if (skinOwned) {
                buttonText = "EQUIP";
            }

            const costText =
                skinOwned
                    ? "OWNED"
                    : `COST: <span>${formatGameNumber(
                        skin.cost
                    )}</span>`;

            return `
                <article
                    class="upgradeCard skinCard"
                    id="skinCard-${index}"
                >

                    <img
                        class="upgradeCardImage"
                        src="${skin.buttonImg || skin.img}"
                        alt="Can skin ${index + 1}"
                    >

                    <div class="upgradeCardInformation">

                        <h3 class="upgradeCardName">
                            SKIN ${index + 1}
                        </h3>

                        <p class="upgradeCardLevel">
                            ${
                skinEquipped
                    ? "CURRENTLY EQUIPPED"
                    : skinOwned
                        ? "UNLOCKED"
                        : "LOCKED"
            }
                        </p>

                        <p class="upgradeCardDescription">
                            ${skin.description}
                        </p>

                        <div class="upgradeCardBottom">

                            <p class="upgradeCardCost">
                                ${costText}
                            </p>

                            <button
                                class="buyButton skinActionButton"
                                type="button"
                                data-skin-index="${index}"
                                ${skinEquipped ? "disabled" : ""}
                            >
                                ${buttonText}
                            </button>

                        </div>

                        <p class="purchaseError">
                            NOT ENOUGH ENERGY
                        </p>

                    </div>

                </article>
            `;
        }).join("");

    return defaultCanCard + cosmeticSkinCards;
}


// -------------------------------------------------
// DISPLAY THE SKINS SHOP
// -------------------------------------------------

function renderSkinsShop() {
    shopList.innerHTML =
        createSkinsShopContent();

    attachSkinButtons();
}


// -------------------------------------------------
// CONNECT SKIN BUTTONS
// -------------------------------------------------

function attachSkinButtons() {
    const skinButtons =
        shopList.querySelectorAll(
            ".skinActionButton"
        );

    skinButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedSkin =
                button.dataset.skinIndex;

            /*
                Return to the normal Drink Power can.
            */
            if (selectedSkin === "default") {
                mobileEquippedSkinIndex = null;
                equippedSkinImage = null;

                renderSkinsShop();
                updateShopBalance();

                return;
            }

            const skinIndex =
                Number(selectedSkin);

            const skin =
                COSMETIC_UPGRADES[skinIndex];

            const skinCard =
                document.getElementById(
                    `skinCard-${skinIndex}`
                );

            if (!skin) {
                return;
            }

            /*
                Purchase the skin when it has not
                already been unlocked.
            */
            if (!mobileOwnedSkins[skinIndex]) {
                if (mobileEnergy < skin.cost) {
                    showPurchaseFailure(
                        skinCard
                    );

                    return;
                }

                mobileEnergy -= skin.cost;

                mobileOwnedSkins[skinIndex] =
                    true;
            }

            /*
                Newly purchased skins are equipped
                immediately. Owned skins can also be
                equipped again for free.
            */
            mobileEquippedSkinIndex =
                skinIndex;

            equippedSkinImage =
                skin.buttonImg || skin.img;

            renderSkinsShop();
            updateShopBalance();
        });
    });
}

// -------------------------------------------------
// APPLY THE EQUIPPED SCORE COLOR
// -------------------------------------------------

function updateScoreColor() {
    /*
        Remove every possible purchased color class
        before applying the currently equipped one.
    */
    const colorClasses =
        CHANGECOLOR_UPGRADES.map(
            (color) => color.cssClass
        );

    mobileScoreDisplay.classList.remove(
        ...colorClasses
    );

    /*
        null means the original rainbow style
        should remain equipped.
    */
    if (mobileEquippedColorIndex === null) {
        return;
    }

    const equippedColor =
        CHANGECOLOR_UPGRADES[
            mobileEquippedColorIndex
            ];

    if (!equippedColor) {
        return;
    }

    mobileScoreDisplay.classList.add(
        equippedColor.cssClass
    );
}


// -------------------------------------------------
// CREATE THE COLORS SHOP
// -------------------------------------------------

function createColorsShopContent() {
    const defaultColorEquipped =
        mobileEquippedColorIndex === null;

    /*
        The first card represents the original
        rainbow score that the player starts with.
    */
    const defaultColorCard = `
        <article
            class="upgradeCard colorCard"
            id="defaultColorCard"
        >

            <div class="colorPreview">

                <span
                    class="colorPreviewNumber defaultScoreColor"
                >
                    123
                </span>

            </div>

            <div class="upgradeCardInformation">

                <h3 class="upgradeCardName">
                    ORIGINAL RAINBOW
                </h3>

                <p class="upgradeCardLevel">
                    ${
        defaultColorEquipped
            ? "CURRENTLY EQUIPPED"
            : "OWNED"
    }
                </p>

                <p class="upgradeCardDescription">
                    Uses the original animated rainbow
                    score color.
                </p>

                <div class="upgradeCardBottom">

                    <p class="upgradeCardCost">
                        OWNED
                    </p>

                    <button
                        class="buyButton colorActionButton"
                        type="button"
                        data-color-index="default"
                        ${defaultColorEquipped ? "disabled" : ""}
                    >
                        ${
        defaultColorEquipped
            ? "EQUIPPED"
            : "EQUIP"
    }
                    </button>

                </div>

            </div>

        </article>
    `;

    /*
        Create one card for every entry inside
        CHANGECOLOR_UPGRADES.
    */
    const purchasedColorCards =
        CHANGECOLOR_UPGRADES.map(
            (color, index) => {
                const colorOwned =
                    mobileOwnedColors[index];

                const colorEquipped =
                    mobileEquippedColorIndex === index;

                const colorName =
                    SCORE_COLOR_NAMES[index] ||
                    `COLOR ${index + 1}`;

                let buttonText = "BUY";

                if (colorEquipped) {
                    buttonText = "EQUIPPED";
                } else if (colorOwned) {
                    buttonText = "EQUIP";
                }

                const costText =
                    colorOwned
                        ? "OWNED"
                        : `
                            COST:
                            <span>
                                ${formatGameNumber(color.cost)}
                            </span>
                        `;

                return `
                    <article
                        class="upgradeCard colorCard"
                        id="colorCard-${index}"
                    >

                        <div class="colorPreview">

                            <span
                                class="colorPreviewNumber ${color.cssClass}"
                            >
                                123
                            </span>

                        </div>

                        <div class="upgradeCardInformation">

                            <h3 class="upgradeCardName">
                                ${colorName}
                            </h3>

                            <p class="upgradeCardLevel">
                                ${
                    colorEquipped
                        ? "CURRENTLY EQUIPPED"
                        : colorOwned
                            ? "UNLOCKED"
                            : "LOCKED"
                }
                            </p>

                            <p class="upgradeCardDescription">
                                Changes the main score to
                                ${colorName}.
                            </p>

                            <div class="upgradeCardBottom">

                                <p class="upgradeCardCost">
                                    ${costText}
                                </p>

                                <button
                                    class="buyButton colorActionButton"
                                    type="button"
                                    data-color-index="${index}"
                                    ${colorEquipped ? "disabled" : ""}
                                >
                                    ${buttonText}
                                </button>

                            </div>

                            <p class="purchaseError">
                                NOT ENOUGH ENERGY
                            </p>

                        </div>

                    </article>
                `;
            }
        ).join("");

    return (
        defaultColorCard +
        purchasedColorCards
    );
}


// -------------------------------------------------
// DISPLAY THE COLORS SHOP
// -------------------------------------------------

function renderColorsShop() {
    shopList.innerHTML =
        createColorsShopContent();

    attachColorButtons();
}


// -------------------------------------------------
// CONNECT THE COLOR BUTTONS
// -------------------------------------------------

function attachColorButtons() {
    const colorButtons =
        shopList.querySelectorAll(
            ".colorActionButton"
        );

    colorButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedColor =
                button.dataset.colorIndex;

            /*
                Return to the original rainbow score.
            */
            if (selectedColor === "default") {
                mobileEquippedColorIndex =
                    null;

                renderColorsShop();
                updateShopBalance();

                return;
            }

            const colorIndex =
                Number(selectedColor);

            const color =
                CHANGECOLOR_UPGRADES[
                    colorIndex
                    ];

            const colorCard =
                document.getElementById(
                    `colorCard-${colorIndex}`
                );

            if (!color) {
                return;
            }

            /*
                Purchase the color if the player
                does not already own it.
            */
            if (!mobileOwnedColors[colorIndex]) {
                if (mobileEnergy < color.cost) {
                    showPurchaseFailure(
                        colorCard
                    );

                    return;
                }

                mobileEnergy -=
                    color.cost;

                mobileOwnedColors[colorIndex] =
                    true;
            }

            /*
                Purchased colors are equipped
                immediately. Owned colors can be
                equipped again for free.
            */
            mobileEquippedColorIndex =
                colorIndex;

            renderColorsShop();
            updateShopBalance();
        });
    });
}

// -------------------------------------------------
// FORMAT PLAY TIME
// -------------------------------------------------

function formatGameTime(totalSeconds) {
    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
}


// -------------------------------------------------
// FORMAT CHANCE PERCENTAGES
// -------------------------------------------------

function formatChancePercent(chance) {
    const percentage =
        chance * 100;

    return `${Number(
        percentage.toFixed(2)
    )}%`;
}


// -------------------------------------------------
// CREATE THE STATS SCREEN
// -------------------------------------------------

function createStatsShopContent() {
    return `
        <section class="statsScreen">

            <div class="statsSection">

                <h3 class="statsSectionTitle">
                    PRODUCTION
                </h3>

                <div class="statsGrid">

                    <article class="statCard">
                        <span class="statIcon">🥤</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                CURRENT ENERGY
                            </span>

                            <strong
                                class="statValue"
                                id="statCurrentEnergy"
                            >
                                0
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">⚡</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                LIFETIME ENERGY
                            </span>

                            <strong
                                class="statValue"
                                id="statLifetimeEnergy"
                            >
                                0
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">👆</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                TOTAL TAPS
                            </span>

                            <strong
                                class="statValue"
                                id="statTotalTaps"
                            >
                                0
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">💥</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                ENERGY PER TAP
                            </span>

                            <strong
                                class="statValue"
                                id="statPerTap"
                            >
                                1
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">🏭</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                ENERGY PER SECOND
                            </span>

                            <strong
                                class="statValue"
                                id="statPerSecond"
                            >
                                0
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">📈</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                CAN LEVEL
                            </span>

                            <strong
                                class="statValue"
                                id="statCanLevel"
                            >
                                0
                            </strong>
                        </div>
                    </article>

                </div>

            </div>


            <div class="statsSection">

                <h3 class="statsSectionTitle">
                    SPECIAL EVENTS
                </h3>

                <div class="statsGrid">

                    <article class="statCard">
                        <span class="statIcon">🍀</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                LUCKY SHOT CHANCE
                            </span>

                            <strong
                                class="statValue"
                                id="statLuckyChance"
                            >
                                0%
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">🎯</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                LUCKY SHOTS
                            </span>

                            <strong
                                class="statValue"
                                id="statLuckyActivations"
                            >
                                0
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">💰</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                LUCKY SHOT BONUS
                            </span>

                            <strong
                                class="statValue"
                                id="statLuckyBonus"
                            >
                                20%
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">🌩️</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                KINETIC CHANCE
                            </span>

                            <strong
                                class="statValue"
                                id="statKineticChance"
                            >
                                0%
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">🔥</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                KINETIC POWER
                            </span>

                            <strong
                                class="statValue"
                                id="statKineticMultiplier"
                            >
                                ×1
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">💫</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                KINETIC ACTIVATIONS
                            </span>

                            <strong
                                class="statValue"
                                id="statKineticActivations"
                            >
                                0
                            </strong>
                        </div>
                    </article>

                </div>

            </div>


            <div class="statsSection">

                <h3 class="statsSectionTitle">
                    COLLECTION
                </h3>

                <div class="statsGrid">

                    <article class="statCard">
                        <span class="statIcon">🎭</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                SKINS OWNED
                            </span>

                            <strong
                                class="statValue"
                                id="statSkinsOwned"
                            >
                                0
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">🎨</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                COLORS OWNED
                            </span>

                            <strong
                                class="statValue"
                                id="statColorsOwned"
                            >
                                0
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">⏱️</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                TIME PLAYED
                            </span>

                            <strong
                                class="statValue"
                                id="statTimePlayed"
                            >
                                0s
                            </strong>
                        </div>
                    </article>

                </div>

            </div>

        </section>
    `;
}


// -------------------------------------------------
// DISPLAY THE STATS SCREEN
// -------------------------------------------------

function renderStatsShop() {
    shopList.innerHTML =
        createStatsShopContent();

    shopList.insertAdjacentHTML(
        "beforeend",
        createAchievementsAccessContent()
    );

    shopList.insertAdjacentHTML(
        "beforeend",
        createRebirthAccessContent()
    );

    shopList.insertAdjacentHTML(
        "beforeend",
        createPermanentPerksAccessContent()
    );

    shopList.insertAdjacentHTML(
        "beforeend",
        createSaveManagementContent()
    );

    shopList.insertAdjacentHTML(
        "beforeend",
        createSettingsAccessContent()
    );

    updateStatsDisplay();
    updateRebirthDynamicDisplays();

    attachAchievementsAccessButton();
    attachRebirthAccessButton();
    attachPermanentPerksAccessButton();
    attachSaveManagementButtons();
    attachSettingsAccessButton();
}


// -------------------------------------------------
// UPDATE ONE STAT ELEMENT
// -------------------------------------------------

function setStatValue(elementId, value) {
    const statElement =
        document.getElementById(elementId);

    if (!statElement) {
        return;
    }

    statElement.textContent =
        value;
}


// -------------------------------------------------
// UPDATE ALL VISIBLE STATISTICS
// -------------------------------------------------

function updateStatsDisplay() {
    const skinsOwned =
        mobileOwnedSkins.filter(Boolean).length;

    const colorsOwned =
        mobileOwnedColors.filter(Boolean).length;

    setStatValue(
        "statCurrentEnergy",
        formatGameNumber(mobileEnergy)
    );

    setStatValue(
        "statLifetimeEnergy",
        formatGameNumber(mobileLifetimeEnergy)
    );

    setStatValue(
        "statTotalTaps",
        formatGameNumber(mobileTotalTaps)
    );

    setStatValue(
        "statPerTap",
        formatGameNumber(
            getCurrentTapPower()
        )
    );

    setStatValue(
        "statPerSecond",
        formatGameNumber(
            getCurrentEnergyPerSecond()
        )
    );

    setStatValue(
        "statCanLevel",
        mobileDrinkUpgradeIndex
    );

    setStatValue(
        "statLuckyChance",
        formatChancePercent(
            getCurrentLuckyShotChance()
        )
    );

    setStatValue(
        "statLuckyActivations",
        formatGameNumber(
            mobileLuckyShotsActivated
        )
    );

    setStatValue(
        "statLuckyBonus",
        formatChancePercent(
            getCurrentLuckyShotBonusMultiplier()
        )
    );

    setStatValue(
        "statKineticChance",
        formatChancePercent(
            getCurrentKineticChance()
        )
    );

    setStatValue(
        "statKineticMultiplier",
        `×${Number(
            getCurrentKineticMultiplier()
                .toFixed(2)
        )}`
    );

    setStatValue(
        "statKineticActivations",
        formatGameNumber(
            mobileKineticActivations
        )
    );

    setStatValue(
        "statSkinsOwned",
        `${skinsOwned}/${COSMETIC_UPGRADES.length}`
    );

    setStatValue(
        "statColorsOwned",
        `${colorsOwned}/${CHANGECOLOR_UPGRADES.length}`
    );

    setStatValue(
        "statTimePlayed",
        formatGameTime(
            mobileSecondsPlayed
        )
    );
}

// -------------------------------------------------
// SAVE SLOT SCREEN ELEMENTS
// -------------------------------------------------

const saveSlotOverlay =
    document.getElementById(
        "saveSlotOverlay"
    );

const saveSlotList =
    document.getElementById(
        "saveSlotList"
    );


// -------------------------------------------------
// READ ONE SAVE SLOT
// -------------------------------------------------

function readSaveSlot(slotNumber) {
    const slotKey =
        `energyClickerSaveSlot${slotNumber}`;

    try {
        const savedText =
            localStorage.getItem(slotKey);

        if (!savedText) {
            return null;
        }

        const savedData =
            JSON.parse(savedText);

        if (
            !savedData ||
            typeof savedData !== "object"
        ) {
            return null;
        }

        return savedData;
    } catch (error) {
        console.error(
            `Could not read save slot ${slotNumber}:`,
            error
        );

        return null;
    }
}


// -------------------------------------------------
// CREATE ONE SAVE SLOT CARD
// -------------------------------------------------

function createSaveSlotCard(slotNumber) {
    const savedData =
        readSaveSlot(slotNumber);

    /*
        Empty slot.
    */
    if (!savedData) {
        return `
            <article class="saveSlotCard empty">

                <div class="saveSlotCardHeader">

                    <h2>
                        SLOT ${slotNumber}
                    </h2>

                    <span class="saveSlotBadge">
                        EMPTY
                    </span>

                </div>

                <p class="emptySlotMessage">
                    Start a brand-new energy empire.
                </p>

                <button
                    class="saveSlotButton"
                    type="button"
                    data-save-slot="${slotNumber}"
                >
                    NEW GAME
                </button>

            </article>
        `;
    }

    const savedEnergy =
        Number.isFinite(savedData.energy)
            ? savedData.energy
            : 0;

    const savedCanLevel =
        Number.isFinite(
            savedData.drinkUpgradeIndex
        )
            ? Math.max(
                0,
                Math.floor(
                    savedData.drinkUpgradeIndex
                )
            )
            : 0;

    const savedPlayTime =
        Number.isFinite(
            savedData.secondsPlayed
        )
            ? Math.max(
                0,
                Math.floor(
                    savedData.secondsPlayed
                )
            )
            : 0;

    return `
        <article class="saveSlotCard used">

            <div class="saveSlotCardHeader">

                <h2>
                    SLOT ${slotNumber}
                </h2>

                <span class="saveSlotBadge">
                    SAVED
                </span>

            </div>

            <div class="saveSlotSummary">

                <div class="saveSlotSummaryRow">

                    <span>
                        ENERGY
                    </span>

                    <strong>
                        ${formatGameNumber(savedEnergy)}
                    </strong>

                </div>

                <div class="saveSlotSummaryRow">

                    <span>
                        CAN LEVEL
                    </span>

                    <strong>
                        ${savedCanLevel}
                    </strong>

                </div>

                <div class="saveSlotSummaryRow">

                    <span>
                        PLAY TIME
                    </span>

                    <strong>
                        ${formatGameTime(savedPlayTime)}
                    </strong>

                </div>

            </div>

            <button
                class="saveSlotButton"
                type="button"
                data-save-slot="${slotNumber}"
            >
                CONTINUE
            </button>

        </article>
    `;
}


// -------------------------------------------------
// DISPLAY ALL SAVE SLOTS
// -------------------------------------------------

function renderSaveSlotScreen() {
    saveSlotList.innerHTML = [
        createSaveSlotCard(1),
        createSaveSlotCard(2),
        createSaveSlotCard(3)
    ].join("");

    attachSaveSlotButtons();

    saveSlotOverlay.classList.add(
        "open"
    );

    saveSlotOverlay.setAttribute(
        "aria-hidden",
        "false"
    );
}


// -------------------------------------------------
// CONNECT SAVE SLOT BUTTONS
// -------------------------------------------------

function attachSaveSlotButtons() {
    const slotButtons =
        saveSlotList.querySelectorAll(
            ".saveSlotButton"
        );

    slotButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const selectedSlot =
                    Number(
                        button.dataset.saveSlot
                    );

                selectSaveSlot(
                    selectedSlot
                );
            }
        );
    });
}

// -------------------------------------------------
// RESET THE IN-MEMORY GAME STATE
// -------------------------------------------------

function resetRuntimeStateToNewGame() {
    mobileEnergy = 0;
    mobileEnergyPerTap = 1;
    mobileEnergyPerSecond = 0;

    mobileDrinkUpgradeIndex = 0;
    mobileFactoryUpgradeIndex = 0;
    mobileDeliveryUpgradeIndex = 0;
    mobilePreWorkoutUpgradeIndex = 0;
    mobileLuckyShotUpgradeIndex = 0;
    mobileKineticUpgradeIndex = 0;

    mobileLuckyShotChance = 0;
    mobileLuckyShotBonusMultiplier = 0.20;

    mobileKineticChance = 0;
    mobileKineticMultiplier = 1;
    mobileKineticDuration = 0;

    mobileKineticActive = false;
    mobileKineticTimeLeft = 0;

    if (kineticCountdownInterval) {
        clearInterval(
            kineticCountdownInterval
        );

        kineticCountdownInterval = null;
    }

    kineticStatus.textContent = "";

    kineticStatus.classList.remove(
        "active"
    );

    mobilePerTapRow.classList.remove(
        "kineticBoosted"
    );

    if (luckyShotMessageTimer) {
        clearTimeout(
            luckyShotMessageTimer
        );

        luckyShotMessageTimer = null;
    }

    mobileGameMessage.textContent = "";

    mobileGameMessage.classList.remove(
        "luckyShotActive"
    );

    mobileOwnedSkins.fill(false);
    mobileOwnedColors.fill(false);

    mobileEquippedSkinIndex = null;
    mobileEquippedColorIndex = null;

    equippedSkinImage = null;

    mobileTotalTaps = 0;
    mobileLifetimeEnergy = 0;
    mobileLuckyShotsActivated = 0;
    mobileKineticActivations = 0;
    mobileSecondsPlayed = 0;

    mobileLifeLevel = 0;
    mobilePermanentPerks = {};
    mobilePendingRebirthChoices = [];

    mobileUnlockedAchievementIds = [];

    achievementNotificationQueue = [];
    achievementNotificationActive = false;

    if (achievementNotificationTimer) {
        clearTimeout(
            achievementNotificationTimer
        );

        achievementNotificationTimer = null;
    }

    achievementToast.classList.remove(
        "visible"
    );

    setRebirthChoiceMenuLock(false);

    if (manualSaveMessageTimer) {
        clearTimeout(
            manualSaveMessageTimer
        );

        manualSaveMessageTimer = null;
    }
}


// -------------------------------------------------
// RETURN TO THE SAVE SLOT SCREEN
// -------------------------------------------------

function returnToSaveSlots() {
    /*
        Preserve the current slot before leaving it.
    */
    saveGame();

    /*
        Close any open game panels.
    */
    closeMenu();
    closeOfflineReward();

    /*
        Stop gameplay and remove the active slot.
    */
    hasSelectedSaveSlot = false;
    activeSaveSlot = null;

    /*
        Clear the previous slot from memory so an
        empty slot cannot inherit its values.
    */
    resetRuntimeStateToNewGame();

    /*
        Rebuild the slot cards using the latest
        saved information.
    */
    renderSaveSlotScreen();
}

// -------------------------------------------------
// SELECT AND LOAD A SAVE SLOT
// -------------------------------------------------

function selectSaveSlot(slotNumber) {
    if (
        !Number.isInteger(slotNumber) ||
        slotNumber < 1 ||
        slotNumber > 3
    ) {
        return;
    }

    resetRuntimeStateToNewGame();

    activeSaveSlot =
        slotNumber;

    hasSelectedSaveSlot =
        true;

    saveSlotOverlay.classList.remove(
        "open"
    );

    saveSlotOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    loadGame();

    attachTestBuyButtons();
    updateShopBalance();

    saveGame();

    /*
        If the player closed the app after Rebirth
        but before choosing a perk, restore those
        exact same three choices instead of rerolling.
    */
    if (
        mobilePendingRebirthChoices.length > 0
    ) {
        openPendingRebirthChoiceScreen();
    }
}

// -------------------------------------------------
// CREATE SAVE MANAGEMENT CONTENT
// -------------------------------------------------

function createSaveManagementContent() {
    const autoSaveSeconds =
        Math.floor(
            AUTO_SAVE_INTERVAL_MS / 1000
        );

    return `
        <div class="statsSection saveManagementSection">

            <h3 class="statsSectionTitle">
                SAVE MANAGEMENT
            </h3>

            <article class="saveManagementCard">

                <div class="saveInformationRow">

                    <span>
                        CURRENT SAVE
                    </span>

                    <strong>
                        SLOT ${activeSaveSlot}
                    </strong>

                </div>

                <div class="saveInformationRow">

                    <span>
                        AUTO SAVE
                    </span>

                    <strong>
                        EVERY ${autoSaveSeconds} SECONDS
                    </strong>

                </div>

                <p
                    class="manualSaveStatus"
                    id="manualSaveStatus"
                >
                    Your progress saves automatically.
                </p>

                <div class="saveManagementButtons">

                    <button
                        class="saveNowButton"
                        id="manualSaveButton"
                        type="button"
                    >
                        SAVE NOW
                    </button>

                    <button
                        class="changeSlotButton"
                        id="changeSlotButton"
                        type="button"
                    >
                        CHANGE SLOT
                    </button>

                    <button
                        class="resetGameButton fullWidthSaveButton"
                        id="resetGameButton"
                        type="button"
                    >
                        RESET GAME
                    </button>

                </div>

            </article>

        </div>
    `;
}


// -------------------------------------------------
// CONNECT SAVE MANAGEMENT BUTTONS
// -------------------------------------------------
function attachSaveManagementButtons() {
    const manualSaveButton =
        document.getElementById(
            "manualSaveButton"
        );

    const changeSlotButton =
        document.getElementById(
            "changeSlotButton"
        );

    const resetGameButton =
        document.getElementById(
            "resetGameButton"
        );

    if (manualSaveButton) {
        manualSaveButton.addEventListener(
            "click",
            manuallySaveGame
        );
    }

    if (changeSlotButton) {
        changeSlotButton.addEventListener(
            "click",
            returnToSaveSlots
        );
    }

    if (resetGameButton) {
        resetGameButton.addEventListener(
            "click",
            renderResetGameConfirmation
        );
    }
}


// -------------------------------------------------
// MANUALLY SAVE THE GAME
// -------------------------------------------------

function manuallySaveGame() {
    const manualSaveButton =
        document.getElementById(
            "manualSaveButton"
        );

    const manualSaveStatus =
        document.getElementById(
            "manualSaveStatus"
        );

    const saveSucceeded =
        saveGame();

    if (!manualSaveStatus) {
        return;
    }

    if (manualSaveMessageTimer) {
        clearTimeout(
            manualSaveMessageTimer
        );
    }

    manualSaveStatus.classList.remove(
        "saveSucceeded",
        "saveFailed"
    );

    if (saveSucceeded) {
        manualSaveStatus.textContent =
            "PROGRESS SAVED!";

        manualSaveStatus.classList.add(
            "saveSucceeded"
        );

        if (manualSaveButton) {
            manualSaveButton.textContent =
                "SAVED!";
        }
    } else {
        manualSaveStatus.textContent =
            "SAVE FAILED";

        manualSaveStatus.classList.add(
            "saveFailed"
        );
    }

    manualSaveMessageTimer =
        setTimeout(() => {
            manualSaveStatus.textContent =
                "Your progress saves automatically.";

            manualSaveStatus.classList.remove(
                "saveSucceeded",
                "saveFailed"
            );

            if (manualSaveButton) {
                manualSaveButton.textContent =
                    "SAVE NOW";
            }
        }, 1800);
}


// -------------------------------------------------
// DISPLAY RESET CONFIRMATION
// -------------------------------------------------

function renderResetGameConfirmation() {
    shopTitle.textContent =
        "RESET GAME";

    shopList.innerHTML = `
        <section class="resetGameConfirmation">

            <div class="resetWarningIcon">
                ⚠️
            </div>

            <h3>
                DELETE SLOT ${activeSaveSlot}?
            </h3>

            <p>
                This permanently deletes your energy,
                upgrades, skins, colors, statistics,
                and offline progress.
            </p>

            <strong class="resetCannotUndo">
                THIS CANNOT BE UNDONE
            </strong>

            <div class="resetConfirmationButtons">

                <button
                    class="cancelResetButton"
                    id="cancelResetButton"
                    type="button"
                >
                    CANCEL
                </button>

                <button
                    class="confirmResetButton"
                    id="confirmResetButton"
                    type="button"
                >
                    DELETE SAVE
                </button>

            </div>

        </section>
    `;

    const cancelResetButton =
        document.getElementById(
            "cancelResetButton"
        );

    const confirmResetButton =
        document.getElementById(
            "confirmResetButton"
        );

    cancelResetButton.addEventListener(
        "click",
        () => {
            shopTitle.textContent =
                menuTitles.stats;

            renderStatsShop();
        }
    );

    confirmResetButton.addEventListener(
        "click",
        resetCurrentSave
    );
}


// -------------------------------------------------
// DELETE THE CURRENT SAVE
// -------------------------------------------------

function resetCurrentSave() {
    /*
        Stops auto-save, visibilitychange, and
        pagehide from restoring the deleted save.
    */
    isResettingGame = true;

    try {
        localStorage.removeItem(
            getSaveKey()
        );
    } catch (error) {
        console.error(
            "Energy Clicker could not delete the save:",
            error
        );

        isResettingGame = false;
        return;
    }

    /*
        Reloading starts Slot 1 as a completely
        new game.
    */
    window.location.reload();
}

// -------------------------------------------------
// LOAD GLOBAL GAME SETTINGS
// -------------------------------------------------

function loadGameSettings() {
    let savedSettingsText;

    try {
        savedSettingsText =
            localStorage.getItem(
                GAME_SETTINGS_KEY
            );
    } catch (error) {
        console.error(
            "Could not access game settings:",
            error
        );

        applyGameSettings();
        return;
    }

    if (!savedSettingsText) {
        applyGameSettings();
        return;
    }

    try {
        const savedSettings =
            JSON.parse(
                savedSettingsText
            );

        if (
            !savedSettings ||
            typeof savedSettings !== "object"
        ) {
            applyGameSettings();
            return;
        }

        gameSettings.soundEffects =
            savedSettings.soundEffects !== false;

        gameSettings.haptics =
            savedSettings.haptics !== false;

        gameSettings.reducedMotion =
            savedSettings.reducedMotion === true;
    } catch (error) {
        console.error(
            "Saved settings were invalid:",
            error
        );
    }

    applyGameSettings();
}


// -------------------------------------------------
// SAVE GLOBAL GAME SETTINGS
// -------------------------------------------------

function saveGameSettings() {
    try {
        localStorage.setItem(
            GAME_SETTINGS_KEY,
            JSON.stringify(
                gameSettings
            )
        );

        return true;
    } catch (error) {
        console.error(
            "Could not save game settings:",
            error
        );

        return false;
    }
}


// -------------------------------------------------
// APPLY GLOBAL GAME SETTINGS
// -------------------------------------------------

function applyGameSettings() {
    document.body.classList.toggle(
        "reducedMotion",
        gameSettings.reducedMotion
    );
}

// -------------------------------------------------
// CHECK WHETHER AN ACHIEVEMENT IS UNLOCKED
// -------------------------------------------------

function isAchievementUnlocked(
    achievementId
) {
    return mobileUnlockedAchievementIds.includes(
        achievementId
    );
}


// -------------------------------------------------
// VALIDATE SAVED ACHIEVEMENT IDS
// -------------------------------------------------

function getValidAchievementIds(
    savedAchievementIds
) {
    if (
        !Array.isArray(
            savedAchievementIds
        )
    ) {
        return [];
    }

    const validIds =
        new Set(
            PLAYER_ACHIEVEMENTS.map(
                (achievement) =>
                    achievement.id
            )
        );

    return [
        ...new Set(
            savedAchievementIds.filter(
                (achievementId) =>
                    validIds.has(
                        achievementId
                    )
            )
        )
    ];
}


// -------------------------------------------------
// MIGRATE OLDER SAVES SILENTLY
// -------------------------------------------------

function unlockCurrentAchievementsSilently() {
    PLAYER_ACHIEVEMENTS.forEach(
        (achievement) => {
            const progress =
                getAchievementProgress(
                    achievement
                );

            if (
                progress.completed &&
                !isAchievementUnlocked(
                    achievement.id
                )
            ) {
                mobileUnlockedAchievementIds.push(
                    achievement.id
                );
            }
        }
    );
}


// -------------------------------------------------
// CHECK FOR NEW ACHIEVEMENTS
// -------------------------------------------------

function checkForNewAchievements() {
    if (!hasSelectedSaveSlot) {
        return;
    }

    const newlyUnlockedAchievements = [];

    PLAYER_ACHIEVEMENTS.forEach(
        (achievement) => {
            if (
                isAchievementUnlocked(
                    achievement.id
                )
            ) {
                return;
            }

            const progress =
                getAchievementProgress(
                    achievement
                );

            if (!progress.completed) {
                return;
            }

            mobileUnlockedAchievementIds.push(
                achievement.id
            );

            newlyUnlockedAchievements.push(
                achievement
            );
        }
    );

    if (
        newlyUnlockedAchievements.length === 0
    ) {
        return;
    }

    /*
        Save immediately so a newly unlocked
        achievement cannot be lost.
    */
    saveGame();

    newlyUnlockedAchievements.forEach(
        (achievement) => {
            achievementNotificationQueue.push(
                achievement
            );
        }
    );

    /*
        Refresh the achievement list if it is
        currently being viewed.
    */
    if (
        shopTitle.textContent ===
        "ACHIEVEMENTS"
    ) {
        renderAchievementsMenu();
    }

    showNextAchievementNotification();
}


// -------------------------------------------------
// SHOW THE NEXT ACHIEVEMENT POPUP
// -------------------------------------------------

function showNextAchievementNotification() {
    if (
        achievementNotificationActive ||
        achievementNotificationQueue.length === 0
    ) {
        return;
    }

    const achievement =
        achievementNotificationQueue.shift();

    achievementNotificationActive = true;

    achievementToastTitle.textContent =
        achievement.name;

    achievementToastDescription.textContent =
        achievement.description;

    achievementToast.classList.remove(
        "visible"
    );

    void achievementToast.offsetWidth;

    achievementToast.classList.add(
        "visible"
    );

    achievementNotificationTimer =
        setTimeout(() => {
            achievementToast.classList.remove(
                "visible"
            );

            achievementNotificationTimer =
                setTimeout(() => {
                    achievementNotificationActive =
                        false;

                    showNextAchievementNotification();
                }, 350);
        }, 2500);
}

// -------------------------------------------------
// GET ACHIEVEMENT PROGRESS
// -------------------------------------------------

function getAchievementProgress(
    achievement
) {
    const currentProgress =
        Math.max(
            0,
            Number(
                achievement.getProgress()
            ) || 0
        );

    const target =
        Math.max(
            1,
            achievement.target
        );

    const completed =
        currentProgress >= target;

    const percentage =
        Math.min(
            100,
            (currentProgress / target) * 100
        );

    return {
        currentProgress,
        target,
        completed,
        percentage
    };
}


// -------------------------------------------------
// COUNT COMPLETED ACHIEVEMENTS
// -------------------------------------------------

function getCompletedAchievementCount() {
    return PLAYER_ACHIEVEMENTS.filter(
        (achievement) => {
            return isAchievementUnlocked(
                achievement.id
            );
        }
    ).length;
}


// -------------------------------------------------
// CREATE ACHIEVEMENTS ACCESS CARD
// -------------------------------------------------

function createAchievementsAccessContent() {
    const completedCount =
        getCompletedAchievementCount();

    return `
        <div class="statsSection achievementsAccessSection">

            <h3 class="statsSectionTitle">
                ACHIEVEMENTS
            </h3>

            <article class="achievementsAccessCard">

                <div class="achievementsAccessInformation">

                    <span class="achievementsAccessIcon">
                        🏆
                    </span>

                    <div>

                        <strong>
                            ACHIEVEMENTS
                        </strong>

                        <p>
                            ${completedCount} of
                            ${PLAYER_ACHIEVEMENTS.length}
                            completed
                        </p>

                    </div>

                </div>

                <button
                    class="openAchievementsButton"
                    id="openAchievementsButton"
                    type="button"
                >
                    VIEW ACHIEVEMENTS
                </button>

            </article>

        </div>
    `;
}


// -------------------------------------------------
// CONNECT ACHIEVEMENTS ACCESS BUTTON
// -------------------------------------------------

function attachAchievementsAccessButton() {
    const openAchievementsButton =
        document.getElementById(
            "openAchievementsButton"
        );

    if (!openAchievementsButton) {
        return;
    }

    openAchievementsButton.addEventListener(
        "click",
        renderAchievementsMenu
    );
}


// -------------------------------------------------
// CREATE THE ACHIEVEMENTS SCREEN
// -------------------------------------------------

function createAchievementsContent() {
    const completedCount =
        getCompletedAchievementCount();

    const achievementCards =
        PLAYER_ACHIEVEMENTS.map(
            (achievement) => {
                const progress =
                    getAchievementProgress(
                        achievement
                    );

                const achievementUnlocked =
                    isAchievementUnlocked(
                        achievement.id
                    );

                /*
                    Permanently unlocked achievements
                    always display a completed bar.
                */
                const displayedProgress =
                    achievementUnlocked
                        ? progress.target
                        : Math.min(
                            progress.currentProgress,
                            progress.target
                        );

                const displayedPercentage =
                    achievementUnlocked
                        ? 100
                        : progress.percentage;

                return `
                    <article
                        class="achievementCard
                        ${
                    achievementUnlocked
                        ? "completed"
                        : "locked"
                }"
                    >

                        <div class="achievementIcon">
                            ${
                    achievementUnlocked
                        ? achievement.icon
                        : "🔒"
                }
                        </div>

                        <div class="achievementInformation">

                            <div class="achievementHeader">

                                <h3>
                                    ${achievement.name}
                                </h3>

                                <span class="achievementStatus">
                                    ${
                    achievementUnlocked
                        ? "UNLOCKED"
                        : "LOCKED"
                }
                                </span>

                            </div>

                            <p>
                                ${achievement.description}
                            </p>

                            <div class="achievementProgressText">

                                <span>
                                    PROGRESS
                                </span>

                                <strong>
                                    ${formatGameNumber(displayedProgress)}
                                    /
                                    ${formatGameNumber(progress.target)}
                                </strong>

                            </div>

                            <div class="achievementProgressBar">

                                <div
                                    class="achievementProgressFill"
                                    style="width: ${displayedPercentage}%"
                                ></div>

                            </div>

                        </div>

                    </article>
                `;
            }
        ).join("");

    return `
        <section class="achievementsScreen">

            <article class="achievementsSummary">

                <span class="achievementsSummaryIcon">
                    🏆
                </span>

                <div>

                    <span>
                        COMPLETED
                    </span>

                    <strong>
                        ${completedCount}
                        /
                        ${PLAYER_ACHIEVEMENTS.length}
                    </strong>

                </div>

            </article>

            <div class="achievementsList">
                ${achievementCards}
            </div>

            <button
                class="backToHubButton"
                id="backToHubButton"
                type="button"
            >
                BACK TO PLAYER HUB
            </button>

        </section>
    `;
}


// -------------------------------------------------
// DISPLAY THE ACHIEVEMENTS SCREEN
// -------------------------------------------------

function renderAchievementsMenu() {
    shopTitle.textContent =
        "ACHIEVEMENTS";

    shopList.innerHTML =
        createAchievementsContent();

    attachAchievementsButtons();
}


// -------------------------------------------------
// CONNECT ACHIEVEMENTS SCREEN BUTTONS
// -------------------------------------------------

function attachAchievementsButtons() {
    const backToHubButton =
        document.getElementById(
            "backToHubButton"
        );

    if (!backToHubButton) {
        return;
    }

    backToHubButton.addEventListener(
        "click",
        () => {
            shopTitle.textContent =
                menuTitles.stats;

            renderStatsShop();
        }
    );
}


// -------------------------------------------------
// PLAYER HUB: REBIRTH ACCESS
// -------------------------------------------------

function createRebirthAccessContent() {
    return `
        <div class="statsSection rebirthAccessSection">

            <h3 class="statsSectionTitle">
                REBIRTH
            </h3>

            <article class="rebirthAccessCard">

                <div class="rebirthAccessHeader">
                    <span class="rebirthAccessIcon">♻️</span>

                    <div>
                        <strong>
                            LIFE <span id="hubLifeLevel">${mobileLifeLevel}</span>
                        </strong>

                        <p>
                            Reset your current run, move to the next Life,
                            and choose one permanent perk.
                        </p>
                    </div>
                </div>

                <div class="rebirthAccessStats">
                    <div>
                        <span>NEXT LIFE</span>
                        <strong id="hubNextLife">
                            ${mobileLifeLevel + 1}
                        </strong>
                    </div>

                    <div>
                        <span>REQUIREMENT</span>
                        <strong id="hubRebirthRequirement">
                            ${formatGameNumber(getRebirthRequirement())}
                        </strong>
                    </div>
                </div>

                <div class="rebirthRequirementProgress">
                    <div
                        class="rebirthRequirementProgressFill"
                        id="hubRebirthProgressFill"
                    ></div>
                </div>

                <p
                    class="rebirthRequirementStatus"
                    id="hubRebirthStatus"
                ></p>

                <button
                    class="openRebirthButton"
                    id="openRebirthButton"
                    type="button"
                >
                    OPEN REBIRTH
                </button>

            </article>

        </div>
    `;
}


function attachRebirthAccessButton() {
    const button =
        document.getElementById(
            "openRebirthButton"
        );

    if (button) {
        button.addEventListener(
            "click",
            renderRebirthMenu
        );
    }
}


// -------------------------------------------------
// PLAYER HUB: PERMANENT PERKS ACCESS
// -------------------------------------------------

function createPermanentPerksAccessContent() {
    return `
        <div class="statsSection permanentPerksAccessSection">

            <h3 class="statsSectionTitle">
                PERMANENT PERKS
            </h3>

            <article class="permanentPerksAccessCard">

                <div class="permanentPerksAccessHeader">
                    <span class="permanentPerksAccessIcon">💎</span>

                    <div>
                        <strong>PERK COLLECTION</strong>
                        <p>
                            ${getUnlockedPermanentPerkCount()}
                            unique perks •
                            ${getTotalPermanentPerkRanks()}
                            total ranks
                        </p>
                    </div>
                </div>

                <button
                    class="viewPermanentPerksButton"
                    id="viewPermanentPerksButton"
                    type="button"
                >
                    VIEW PERMANENT PERKS
                </button>

            </article>

        </div>
    `;
}


function attachPermanentPerksAccessButton() {
    const button =
        document.getElementById(
            "viewPermanentPerksButton"
        );

    if (button) {
        button.addEventListener(
            "click",
            renderPermanentPerksMenu
        );
    }
}


// -------------------------------------------------
// LIVE REBIRTH DISPLAY UPDATES
// -------------------------------------------------

function updateRebirthDynamicDisplays() {
    const requirement =
        getRebirthRequirement();

    const progress =
        requirement > 0
            ? Math.min(
                100,
                (mobileEnergy / requirement) * 100
            )
            : 100;

    const progressFill =
        document.getElementById(
            "hubRebirthProgressFill"
        );

    if (progressFill) {
        progressFill.style.width =
            `${progress}%`;
    }

    const status =
        document.getElementById(
            "hubRebirthStatus"
        );

    if (status) {
        status.textContent =
            canPlayerRebirth()
                ? "REBIRTH READY"
                : `${formatGameNumber(
                    Math.max(
                        0,
                        requirement - mobileEnergy
                    )
                )} MORE ENERGY NEEDED`;

        status.classList.toggle(
            "ready",
            canPlayerRebirth()
        );
    }

    const rebirthCurrentEnergy =
        document.getElementById(
            "rebirthCurrentEnergy"
        );

    if (rebirthCurrentEnergy) {
        rebirthCurrentEnergy.textContent =
            formatGameNumber(mobileEnergy);
    }

    const rebirthButton =
        document.getElementById(
            "confirmRebirthStartButton"
        );

    if (rebirthButton) {
        rebirthButton.disabled =
            !canPlayerRebirth();

        rebirthButton.textContent =
            canPlayerRebirth()
                ? `REBIRTH INTO LIFE ${mobileLifeLevel + 1}`
                : `NEED ${formatGameNumber(requirement)}`;
    }

    const screenProgress =
        document.getElementById(
            "rebirthScreenProgressFill"
        );

    if (screenProgress) {
        screenProgress.style.width =
            `${progress}%`;
    }
}


// -------------------------------------------------
// MAIN REBIRTH SCREEN
// -------------------------------------------------

function createRebirthMenuContent() {
    const requirement =
        getRebirthRequirement();

    return `
        <section class="rebirthScreen">

            <article class="rebirthHeroCard">
                <span class="rebirthHeroIcon">♻️</span>

                <div>
                    <span class="rebirthEyebrow">
                        CURRENT LIFE
                    </span>

                    <h3>
                        LIFE ${mobileLifeLevel}
                        → LIFE ${mobileLifeLevel + 1}
                    </h3>

                    <p>
                        Reach the requirement, reset this run,
                        then choose 1 of 3 permanent perks.
                    </p>
                </div>
            </article>

            <article class="rebirthRequirementCard">
                <div class="rebirthRequirementRow">
                    <span>CURRENT ENERGY</span>
                    <strong id="rebirthCurrentEnergy">
                        ${formatGameNumber(mobileEnergy)}
                    </strong>
                </div>

                <div class="rebirthRequirementRow">
                    <span>REBIRTH REQUIREMENT</span>
                    <strong>
                        ${formatGameNumber(requirement)}
                    </strong>
                </div>

                <div class="rebirthRequirementProgress large">
                    <div
                        class="rebirthRequirementProgressFill"
                        id="rebirthScreenProgressFill"
                    ></div>
                </div>
            </article>

            <div class="rebirthRulesGrid">
                <article class="rebirthRuleCard resets">
                    <h4>RESETS</h4>
                    <p>Current Energy</p>
                    <p>Drink Power</p>
                    <p>Factory</p>
                    <p>Delivery</p>
                    <p>Pre-Workout</p>
                    <p>Lucky Shot</p>
                    <p>Kinetic Overflow</p>
                </article>

                <article class="rebirthRuleCard keeps">
                    <h4>YOU KEEP</h4>
                    <p>Life Level</p>
                    <p>Rebirth Perks</p>
                    <p>Skins</p>
                    <p>Colors</p>
                    <p>Achievements</p>
                    <p>Lifetime Stats</p>
                    <p>Settings</p>
                    <p>Save Slot</p>
                </article>
            </div>

            <article class="rarityOddsCard">
                <h4>EVERY CARD ROLLS ITS OWN RARITY</h4>

                <div class="rarityOddsGrid">
                    <span class="common">COMMON 65%</span>
                    <span class="rare">RARE 25%</span>
                    <span class="epic">EPIC 8%</span>
                    <span class="legendary">LEGENDARY 2%</span>
                </div>
            </article>

            <button
                class="confirmRebirthStartButton"
                id="confirmRebirthStartButton"
                type="button"
                ${canPlayerRebirth() ? "" : "disabled"}
            >
                ${
                    canPlayerRebirth()
                        ? `REBIRTH INTO LIFE ${mobileLifeLevel + 1}`
                        : `NEED ${formatGameNumber(requirement)}`
                }
            </button>

            <button
                class="backToHubButton"
                id="backFromRebirthButton"
                type="button"
            >
                BACK TO PLAYER HUB
            </button>

        </section>
    `;
}


function renderRebirthMenu() {
    shopTitle.textContent =
        "REBIRTH";

    shopList.innerHTML =
        createRebirthMenuContent();

    const rebirthButton =
        document.getElementById(
            "confirmRebirthStartButton"
        );

    const backButton =
        document.getElementById(
            "backFromRebirthButton"
        );

    if (rebirthButton) {
        rebirthButton.addEventListener(
            "click",
            renderRebirthConfirmation
        );
    }

    if (backButton) {
        backButton.addEventListener(
            "click",
            () => {
                shopTitle.textContent =
                    menuTitles.stats;

                renderStatsShop();
            }
        );
    }

    updateRebirthDynamicDisplays();
}


// -------------------------------------------------
// REBIRTH CONFIRMATION
// -------------------------------------------------

function renderRebirthConfirmation() {
    if (!canPlayerRebirth()) {
        renderRebirthMenu();
        return;
    }

    shopTitle.textContent =
        "CONFIRM REBIRTH";

    shopList.innerHTML = `
        <section class="rebirthConfirmationScreen">

            <div class="rebirthConfirmationIcon">⚠️</div>

            <h3>
                ENTER LIFE ${mobileLifeLevel + 1}?
            </h3>

            <p>
                Your current energy and all six gameplay
                upgrade trees will reset.
            </p>

            <article class="rebirthConfirmationReward">
                <span>AFTER THE RESET</span>
                <strong>CHOOSE 1 OF 3 PERMANENT PERKS</strong>
                <p>
                    Each card independently rolls Common,
                    Rare, Epic, or Legendary.
                </p>
            </article>

            <strong class="rebirthPermanentWarning">
                THE RESET CANNOT BE UNDONE
            </strong>

            <div class="rebirthConfirmationButtons">
                <button
                    class="cancelRebirthButton"
                    id="cancelRebirthButton"
                    type="button"
                >
                    CANCEL
                </button>

                <button
                    class="doRebirthButton"
                    id="doRebirthButton"
                    type="button"
                >
                    REBIRTH
                </button>
            </div>

        </section>
    `;

    document
        .getElementById("cancelRebirthButton")
        .addEventListener(
            "click",
            renderRebirthMenu
        );

    document
        .getElementById("doRebirthButton")
        .addEventListener(
            "click",
            performRebirth
        );
}


// -------------------------------------------------
// RESET ONLY THE CURRENT LIFE
// -------------------------------------------------

function resetProgressForRebirth() {
    mobileEnergy = 0;

    mobileDrinkUpgradeIndex = 0;
    mobileFactoryUpgradeIndex = 0;
    mobileDeliveryUpgradeIndex = 0;
    mobilePreWorkoutUpgradeIndex = 0;
    mobileLuckyShotUpgradeIndex = 0;
    mobileKineticUpgradeIndex = 0;

    if (luckyShotMessageTimer) {
        clearTimeout(luckyShotMessageTimer);
        luckyShotMessageTimer = null;
    }

    mobileGameMessage.textContent = "";
    mobileGameMessage.classList.remove(
        "luckyShotActive"
    );

    if (kineticCountdownInterval) {
        clearInterval(kineticCountdownInterval);
        kineticCountdownInterval = null;
    }

    mobileKineticActive = false;
    mobileKineticTimeLeft = 0;
    kineticStatus.textContent = "";
    kineticStatus.classList.remove("active");
    mobilePerTapRow.classList.remove(
        "kineticBoosted"
    );

    rebuildDerivedGameValues();
}


function performRebirth() {
    if (!canPlayerRebirth()) {
        renderRebirthMenu();
        return;
    }

    mobileLifeLevel++;

    resetProgressForRebirth();

    mobilePendingRebirthChoices =
        generateRebirthPerkChoices();

    saveGame();

    openPendingRebirthChoiceScreen();
}


// -------------------------------------------------
// LOCK THE MENU UNTIL A PERK IS CHOSEN
// -------------------------------------------------

function setRebirthChoiceMenuLock(isLocked) {
    closeShopButton.classList.toggle(
        "rebirthChoiceLocked",
        isLocked
    );

    overlayBackground.disabled =
        isLocked;
}


function openPendingRebirthChoiceScreen() {
    if (
        mobilePendingRebirthChoices.length === 0
    ) {
        return;
    }

    setRebirthChoiceMenuLock(true);

    shopTitle.textContent =
        "CHOOSE A PERK";

    shopList.innerHTML =
        createRebirthPerkChoiceContent();

    attachRebirthPerkChoiceButtons();

    menuOverlay.classList.add("open");
    menuOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "menuIsOpen"
    );
}


// -------------------------------------------------
// CREATE THE 3 RANDOM PERK CARDS
// -------------------------------------------------

function createRebirthPerkChoiceContent() {
    const choiceCards =
        mobilePendingRebirthChoices
            .map((perkId) => {
                const perk =
                    getPermanentPerkDefinition(
                        perkId
                    );

                if (!perk) {
                    return "";
                }

                const currentRank =
                    getPermanentPerkRank(perk.id);

                const nextRank =
                    currentRank + 1;

                const maxRankText =
                    perk.maxRank === null
                        ? "∞"
                        : perk.maxRank;

                const effectLines =
                    getPerkEffectLines(perk, 1)
                        .map(
                            (line) =>
                                `<li>${line}</li>`
                        )
                        .join("");

                return `
                    <article
                        class="rebirthPerkChoiceCard ${perk.rarity}"
                    >
                        <div class="rebirthPerkChoiceTop">
                            <span class="rebirthPerkChoiceIcon">
                                ${perk.icon}
                            </span>

                            <div>
                                <span class="perkRarityBadge ${perk.rarity}">
                                    ${REBIRTH_RARITY_LABELS[perk.rarity]}
                                </span>

                                <h3>${perk.name}</h3>

                                <p>
                                    RANK ${currentRank}
                                    → ${nextRank}
                                    / ${maxRankText}
                                </p>
                            </div>
                        </div>

                        <div class="rebirthPerkChoiceEffect">
                            <span>THIS RANK GIVES</span>
                            <ul>${effectLines}</ul>
                        </div>

                        <button
                            class="selectRebirthPerkButton ${perk.rarity}"
                            type="button"
                            data-perk-id="${perk.id}"
                        >
                            SELECT ${perk.name}
                        </button>
                    </article>
                `;
            })
            .join("");

    return `
        <section class="rebirthPerkChoiceScreen">

            <article class="rebirthPerkChoiceIntro">
                <span>✨</span>
                <h3>LIFE ${mobileLifeLevel}</h3>
                <p>
                    Pick exactly one permanent perk.
                    The other two disappear.
                </p>
            </article>

            <div class="rebirthPerkChoices">
                ${choiceCards}
            </div>

            <p class="rebirthChoiceReminder">
                Your three choices are already saved.
                Closing the app will not reroll them.
            </p>

        </section>
    `;
}


function attachRebirthPerkChoiceButtons() {
    const buttons =
        shopList.querySelectorAll(
            ".selectRebirthPerkButton"
        );

    buttons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                selectRebirthPermanentPerk(
                    button.dataset.perkId
                );
            }
        );
    });
}


function selectRebirthPermanentPerk(perkId) {
    if (
        !mobilePendingRebirthChoices.includes(
            perkId
        )
    ) {
        return;
    }

    const perk =
        getPermanentPerkDefinition(perkId);

    if (
        !perk ||
        isPermanentPerkMaxed(perk)
    ) {
        return;
    }

    const newRank =
        getPermanentPerkRank(perkId) + 1;

    mobilePermanentPerks[perkId] =
        newRank;

    mobilePendingRebirthChoices = [];

    /*
        Apply all accumulated starting bonuses now.
        The newly selected perk affects this Life too.
    */
    applyRebirthStartingBonuses();

    setRebirthChoiceMenuLock(false);
    saveGame();

    renderRebirthPerkAwarded(perk);
}


function renderRebirthPerkAwarded(perk) {
    const rank =
        getPermanentPerkRank(perk.id);

    const totalEffectLines =
        getPerkEffectLines(perk, rank)
            .map(
                (line) => `<li>${line}</li>`
            )
            .join("");

    shopTitle.textContent =
        "PERK UNLOCKED";

    shopList.innerHTML = `
        <section class="rebirthPerkAwardedScreen">

            <div class="rebirthPerkAwardedIcon">
                ${perk.icon}
            </div>

            <span class="perkRarityBadge ${perk.rarity}">
                ${REBIRTH_RARITY_LABELS[perk.rarity]}
            </span>

            <h3>${perk.name}</h3>

            <p class="rebirthPerkAwardedRank">
                NOW RANK ${rank}
            </p>

            <article class="rebirthPerkAwardedEffect ${perk.rarity}">
                <span>TOTAL PERK EFFECT</span>
                <ul>${totalEffectLines}</ul>
            </article>

            <p class="rebirthNewLifeMessage">
                LIFE ${mobileLifeLevel} HAS BEGUN
            </p>

            <button
                class="returnAfterRebirthButton"
                id="returnAfterRebirthButton"
                type="button"
            >
                RETURN TO GAME
            </button>

        </section>
    `;

    document
        .getElementById(
            "returnAfterRebirthButton"
        )
        .addEventListener(
            "click",
            closeMenu
        );
}


// -------------------------------------------------
// PERMANENT PERK COLLECTION SCREEN
// -------------------------------------------------

function createPermanentPerksMenuContent() {
    const perkCards =
        PERMANENT_PERK_DEFINITIONS
            .map((perk) => {
                const rank =
                    getPermanentPerkRank(perk.id);

                const unlocked =
                    rank > 0;

                const maxRankText =
                    perk.maxRank === null
                        ? "∞"
                        : perk.maxRank;

                const totalEffectLines =
                    unlocked
                        ? getPerkEffectLines(
                            perk,
                            rank
                        )
                            .map(
                                (line) =>
                                    `<li>${line}</li>`
                            )
                            .join("")
                        : "";

                return `
                    <article
                        class="permanentPerkCollectionCard ${perk.rarity} ${unlocked ? "unlocked" : "locked"}"
                    >
                        <div class="permanentPerkCollectionIcon">
                            ${unlocked ? perk.icon : "?"}
                        </div>

                        <div class="permanentPerkCollectionInfo">
                            <span class="perkRarityBadge ${perk.rarity}">
                                ${REBIRTH_RARITY_LABELS[perk.rarity]}
                            </span>

                            <h3>
                                ${unlocked ? perk.name : "LOCKED PERK"}
                            </h3>

                            <p class="permanentPerkRank">
                                ${
                                    unlocked
                                        ? `RANK ${rank} / ${maxRankText}`
                                        : "FIND THIS DURING REBIRTH"
                                }
                            </p>

                            ${
                                unlocked
                                    ? `<ul class="permanentPerkEffectList">${totalEffectLines}</ul>`
                                    : ""
                            }
                        </div>
                    </article>
                `;
            })
            .join("");

    return `
        <section class="permanentPerksScreen">

            <article class="permanentPerksSummary">
                <span>💎</span>

                <div>
                    <small>UNIQUE PERKS</small>
                    <strong>
                        ${getUnlockedPermanentPerkCount()}
                        / ${PERMANENT_PERK_DEFINITIONS.length}
                    </strong>
                </div>

                <div>
                    <small>TOTAL RANKS</small>
                    <strong>
                        ${getTotalPermanentPerkRanks()}
                    </strong>
                </div>
            </article>

            <div class="permanentPerksCollection">
                ${perkCards}
            </div>

            <button
                class="backToHubButton"
                id="backFromPermanentPerksButton"
                type="button"
            >
                BACK TO PLAYER HUB
            </button>

        </section>
    `;
}


function renderPermanentPerksMenu() {
    shopTitle.textContent =
        "PERMANENT PERKS";

    shopList.innerHTML =
        createPermanentPerksMenuContent();

    document
        .getElementById(
            "backFromPermanentPerksButton"
        )
        .addEventListener(
            "click",
            () => {
                shopTitle.textContent =
                    menuTitles.stats;

                renderStatsShop();
            }
        );
}

// -------------------------------------------------
// GET OR CREATE THE AUDIO CONTEXT
// -------------------------------------------------

function getGameAudioContext() {
    if (!gameSettings.soundEffects) {
        return null;
    }

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {
        return null;
    }

    if (!gameAudioContext) {
        gameAudioContext =
            new AudioContextClass();
    }

    if (
        gameAudioContext.state ===
        "suspended"
    ) {
        gameAudioContext
            .resume()
            .catch(() => {
                /*
                    Some browsers prevent audio
                    until another user interaction.
                */
            });
    }

    return gameAudioContext;
}


// -------------------------------------------------
// PLAY THE TEMPORARY TAP SOUND
// -------------------------------------------------

function playTapSound() {
    const audioContext =
        getGameAudioContext();

    if (!audioContext) {
        return;
    }

    const currentTime =
        audioContext.currentTime;

    const oscillator =
        audioContext.createOscillator();

    const volume =
        audioContext.createGain();

    oscillator.type =
        "sine";

    oscillator.frequency.setValueAtTime(
        240,
        currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        470,
        currentTime + 0.055
    );

    volume.gain.setValueAtTime(
        0.045,
        currentTime
    );

    volume.gain.exponentialRampToValueAtTime(
        0.001,
        currentTime + 0.075
    );

    oscillator.connect(
        volume
    );

    volume.connect(
        audioContext.destination
    );

    oscillator.start(
        currentTime
    );

    oscillator.stop(
        currentTime + 0.08
    );
}


// -------------------------------------------------
// TRIGGER A LIGHT TAP VIBRATION
// -------------------------------------------------

function triggerTapHaptic() {
    if (!gameSettings.haptics) {
        return;
    }

    if (
        typeof navigator.vibrate !==
        "function"
    ) {
        return;
    }

    navigator.vibrate(12);
}


// -------------------------------------------------
// CREATE THE SETTINGS ACCESS SECTION
// -------------------------------------------------

function createSettingsAccessContent() {
    return `
        <div class="statsSection settingsAccessSection">

            <h3 class="statsSectionTitle">
                SETTINGS
            </h3>

            <article class="settingsAccessCard">

                <div class="settingsAccessInformation">

                    <span class="settingsAccessIcon">
                        ⚙️
                    </span>

                    <div>

                        <strong>
                            GAME SETTINGS
                        </strong>

                        <p>
                            Sound, haptics, animation,
                            and future visual options.
                        </p>

                    </div>

                </div>

                <button
                    class="openSettingsButton"
                    id="openSettingsButton"
                    type="button"
                >
                    OPEN SETTINGS
                </button>

            </article>

        </div>
    `;
}


// -------------------------------------------------
// CONNECT THE SETTINGS ACCESS BUTTON
// -------------------------------------------------

function attachSettingsAccessButton() {
    const openSettingsButton =
        document.getElementById(
            "openSettingsButton"
        );

    if (!openSettingsButton) {
        return;
    }

    openSettingsButton.addEventListener(
        "click",
        renderSettingsMenu
    );
}


// -------------------------------------------------
// CREATE ONE SETTINGS TOGGLE
// -------------------------------------------------

function createSettingsToggle(
    settingName,
    label,
    description,
    icon
) {
    const settingEnabled =
        gameSettings[settingName];

    return `
        <article class="settingRow">

            <span class="settingIcon">
                ${icon}
            </span>

            <div class="settingInformation">

                <strong>
                    ${label}
                </strong>

                <p>
                    ${description}
                </p>

            </div>

            <button
                class="settingsToggleButton
                ${settingEnabled ? "enabled" : ""}"
                type="button"
                data-setting="${settingName}"
                aria-pressed="${settingEnabled}"
            >
                ${settingEnabled ? "ON" : "OFF"}
            </button>

        </article>
    `;
}


// -------------------------------------------------
// CREATE THE SETTINGS SCREEN
// -------------------------------------------------

function createSettingsContent() {
    return `
        <section class="settingsScreen">

            <div class="settingsIntroduction">

                <span>
                    ⚙️
                </span>

                <h3>
                    GAME SETTINGS
                </h3>

                <p>
                    These preferences apply to all
                    three save slots.
                </p>

            </div>

            <div class="settingsList">

                ${createSettingsToggle(
        "soundEffects",
        "SOUND EFFECTS",
        "Plays a small sound when the energy can is tapped.",
        "🔊"
    )}

                ${createSettingsToggle(
        "haptics",
        "HAPTICS",
        "Uses a light vibration when supported by the device.",
        "📳"
    )}

                ${createSettingsToggle(
        "reducedMotion",
        "REDUCED MOTION",
        "Reduces flashing, pulsing, movement, and animated effects.",
        "🧘"
    )}

            </div>

            <article class="futureSettingsCard">

                <span class="futureSettingsIcon">
                    🎨
                </span>

                <div>

                    <strong>
                        THEMES & BACKGROUNDS
                    </strong>

                    <p>
                        Collectible UI themes and
                        animated backgrounds will be
                        added here later.
                    </p>

                </div>

                <span class="comingSoonBadge">
                    COMING LATER
                </span>

            </article>

            <button
                class="backToStatsButton"
                id="backToStatsButton"
                type="button"
            >
                BACK TO PLAYER HUB
            </button>

        </section>
    `;
}


// -------------------------------------------------
// DISPLAY THE SETTINGS SCREEN
// -------------------------------------------------

function renderSettingsMenu() {
    shopTitle.textContent =
        "SETTINGS";

    shopList.innerHTML =
        createSettingsContent();

    attachSettingsButtons();
}


// -------------------------------------------------
// CONNECT THE SETTINGS BUTTONS
// -------------------------------------------------

function attachSettingsButtons() {
    const settingButtons =
        shopList.querySelectorAll(
            ".settingsToggleButton"
        );

    const backToStatsButton =
        document.getElementById(
            "backToStatsButton"
        );

    settingButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const settingName =
                    button.dataset.setting;

                toggleGameSetting(
                    settingName
                );
            }
        );
    });

    if (backToStatsButton) {
        backToStatsButton.addEventListener(
            "click",
            () => {
                shopTitle.textContent =
                    menuTitles.stats;

                renderStatsShop();
            }
        );
    }
}


// -------------------------------------------------
// TOGGLE ONE GAME SETTING
// -------------------------------------------------

function toggleGameSetting(settingName) {
    const settingExists =
        Object.prototype.hasOwnProperty.call(
            gameSettings,
            settingName
        );

    if (!settingExists) {
        return;
    }

    gameSettings[settingName] =
        !gameSettings[settingName];

    applyGameSettings();
    saveGameSettings();

    /*
        Give immediate feedback when sound is
        switched on.
    */
    if (
        settingName === "soundEffects" &&
        gameSettings.soundEffects
    ) {
        playTapSound();
    }

    renderSettingsMenu();
}



// -------------------------------------------------
// SHOW A FAILED PURCHASE
// -------------------------------------------------

function showPurchaseFailure(upgradeCard) {
    if (!upgradeCard) {
        return;
    }

    upgradeCard.classList.remove(
        "purchaseFailed"
    );

    void upgradeCard.offsetWidth;

    upgradeCard.classList.add(
        "purchaseFailed"
    );

    setTimeout(() => {
        upgradeCard.classList.remove(
            "purchaseFailed"
        );
    }, 1100);
}


// -------------------------------------------------
// BUY A DRINK POWER UPGRADE
// -------------------------------------------------

function buyDrinkUpgrade() {
    const nextUpgrade =
        getDrinkPowerUpgradeData(
            mobileDrinkUpgradeIndex
        );

    if (!nextUpgrade) {
        return;
    }

    const elements =
        getDrinkUpgradeElements();

    if (
        mobileEnergy <
        nextUpgrade.cost
    ) {
        showPurchaseFailure(
            elements.card
        );

        return;
    }

    const previousCanTier =
        getCurrentCanMilestone(
            mobileDrinkUpgradeIndex
        ).tier;

    mobileEnergy -=
        nextUpgrade.cost;

    mobileEnergyPerTap +=
        nextUpgrade.gain;

    mobileDrinkUpgradeIndex++;

    const newCanTier =
        getCurrentCanMilestone(
            mobileDrinkUpgradeIndex
        ).tier;

    updateShopBalance();
    saveGame();

    elements.card.classList.remove(
        "purchaseSuccess",
        "canTierUnlocked"
    );

    void elements.card.offsetWidth;

    if (newCanTier > previousCanTier) {
        elements.card.classList.add(
            "canTierUnlocked"
        );
    } else {
        elements.card.classList.add(
            "purchaseSuccess"
        );
    }

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess",
            "canTierUnlocked"
        );
    }, 700);
}
// -------------------------------------------------
// SHOW THE ENERGY EARNED FROM ONE TAP
// -------------------------------------------------

function showTapEnergyFloat(
    energyAmount,
    tapEvent
) {
    const tapSectionBounds =
        mobileTapSection.getBoundingClientRect();

    const canBounds =
        mobileCanButton.getBoundingClientRect();

    const eventHasPosition =
        tapEvent &&
        Number.isFinite(tapEvent.clientX) &&
        Number.isFinite(tapEvent.clientY) &&
        (tapEvent.clientX !== 0 ||
            tapEvent.clientY !== 0);

    /*
        Normal taps use the exact tap position.
        Keyboard activation falls back to the center
        of the energy can.
    */
    const positionX =
        eventHasPosition
            ? tapEvent.clientX -
              tapSectionBounds.left
            : canBounds.left +
              canBounds.width / 2 -
              tapSectionBounds.left;

    const positionY =
        eventHasPosition
            ? tapEvent.clientY -
              tapSectionBounds.top
            : canBounds.top +
              canBounds.height / 2 -
              tapSectionBounds.top;

    const floatingNumber =
        document.createElement("span");

    tapEnergyFloatCounter++;

    floatingNumber.className =
        "tapEnergyFloat";

    floatingNumber.id =
        `tapEnergyFloat-${tapEnergyFloatCounter}`;

    floatingNumber.setAttribute(
        "aria-hidden",
        "true"
    );

    floatingNumber.textContent =
        `+${formatGameNumber(energyAmount)}`;

    floatingNumber.style.left =
        `${positionX}px`;

    floatingNumber.style.top =
        `${positionY}px`;

    /*
        Use one of three normal CSS classes instead
        of a custom property inside calc(). This
        removes the editor warning while preserving
        a little sideways variety.
    */
    const driftRoll = Math.random();

    if (driftRoll < 0.33) {
        floatingNumber.classList.add(
            "tapFloatDriftLeft"
        );
    } else if (driftRoll > 0.66) {
        floatingNumber.classList.add(
            "tapFloatDriftRight"
        );
    } else {
        floatingNumber.classList.add(
            "tapFloatDriftCenter"
        );
    }

    mobileTapSection.appendChild(
        floatingNumber
    );

    floatingNumber.addEventListener(
        "animationend",
        () => {
            floatingNumber.remove();
        },
        { once: true }
    );

    /*
        Fallback cleanup in case a browser does not
        send the animationend event.
    */
    setTimeout(() => {
        floatingNumber.remove();
    }, 1000);
}


// -------------------------------------------------
// PRODUCE ENERGY BY TAPPING
// -------------------------------------------------

function produceEnergyFromTap(tapEvent) {
    mobileTotalTaps++;

    /*
        Kinetic Overflow may activate before the
        energy from this tap is calculated.
    */
    tryKineticOverflow();

    const energyEarnedFromTap =
        getCurrentTapPower();

    mobileEnergy +=
        energyEarnedFromTap;

    mobileLifetimeEnergy +=
        energyEarnedFromTap;

    /*
        Display the exact direct-tap reward. Lucky
        Shot still uses its separate large message.
    */
    showTapEnergyFloat(
        energyEarnedFromTap,
        tapEvent
    );

    /*
        Lucky Shot may add its separate bonus.
    */
    tryLuckyShot();

    /*
        Optional device feedback.
    */
    playTapSound();
    triggerTapHaptic();

    updateShopBalance();
    animateCanTap();
}


// -------------------------------------------------
// CAN TAP ANIMATION
// -------------------------------------------------

function animateCanTap() {
    mobileCanButton.classList.remove("tapped");

    /*
        This forces the browser to restart the
        animation even when the player taps quickly.
    */
    void mobileCanButton.offsetWidth;

    mobileCanButton.classList.add("tapped");

    setTimeout(() => {
        mobileCanButton.classList.remove("tapped");
    }, 160);
}

// -------------------------------------------------
// MAIN TAPPING EVENT
// -------------------------------------------------

mobileTapSection.addEventListener(
    "click",
    produceEnergyFromTap
);

// -------------------------------------------------
// PLACEHOLDER MENU CONTENT
// -------------------------------------------------

function createPlaceholderContent(menuName) {
    return `
        <section class="emptyMenuMessage">

            <div class="emptyMenuIcon">
                ${getMenuIcon(menuName)}
            </div>

            <h3>${menuTitles[menuName]}</h3>

            <p>
                This section will be built after the upgrades shop is connected.
            </p>

        </section>
    `;
}


function getMenuIcon(menuName) {
    if (menuName === "skins") {
        return "🥤";
    }

    if (menuName === "colors") {
        return "🎨";
    }

    if (menuName === "stats") {
        return "📊";
    }

    return "⚡";
}


// -------------------------------------------------
// OPEN MENU
// -------------------------------------------------

function openMenu(menuName) {
    shopTitle.textContent =
        menuTitles[menuName];

    if (menuName === "upgrades") {
        shopList.innerHTML =
            upgradesShopContent;

        attachTestBuyButtons();
    } else if (menuName === "skins") {
        renderSkinsShop();
    } else if (menuName === "colors") {
        renderColorsShop();
    } else if (menuName === "stats") {
        renderStatsShop();
    }

    /*
        Synchronize energy, production, can image,
        score color, and visible statistics.
    */
    updateShopBalance();

    menuOverlay.classList.add(
        "open"
    );

    menuOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "menuIsOpen"
    );
}

// -------------------------------------------------
// CLOSE MENU
// -------------------------------------------------

function closeMenu() {
    if (
        mobilePendingRebirthChoices.length > 0 &&
        shopTitle.textContent === "CHOOSE A PERK"
    ) {
        return;
    }

    menuOverlay.classList.remove("open");
    menuOverlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("menuIsOpen");
}


// -------------------------------------------------
// NAVIGATION BUTTON EVENTS
// -------------------------------------------------

navigationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedMenu = button.dataset.menu;

        openMenu(selectedMenu);
    });
});


// -------------------------------------------------
// CLOSE BUTTON EVENTS
// -------------------------------------------------

closeShopButton.addEventListener("click", closeMenu);

overlayBackground.addEventListener("click", closeMenu);


// Allow Escape to close the shop while testing on a computer.
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOverlay.classList.contains("open")) {
        closeMenu();
    }
});


// -------------------------------------------------
// TEMPORARY FAILED PURCHASE TEST
// -------------------------------------------------

function attachTestBuyButtons() {
    const drinkUpgradeBuyButton =
        document.getElementById(
            "drinkUpgradeBuyButton"
        );

    const factoryUpgradeBuyButton =
        document.getElementById(
            "factoryUpgradeBuyButton"
        );

    const deliveryUpgradeBuyButton =
        document.getElementById(
            "deliveryUpgradeBuyButton"
        );

    const preWorkoutUpgradeBuyButton =
        document.getElementById(
            "preWorkoutUpgradeBuyButton"
        );

    const luckyShotUpgradeBuyButton =
        document.getElementById(
            "luckyShotUpgradeBuyButton"
        );

    const kineticUpgradeBuyButton =
        document.getElementById(
            "kineticUpgradeBuyButton"
        );

    if (drinkUpgradeBuyButton) {
        drinkUpgradeBuyButton.addEventListener(
            "click",
            buyDrinkUpgrade
        );
    }

    if (factoryUpgradeBuyButton) {
        factoryUpgradeBuyButton.addEventListener(
            "click",
            buyFactoryUpgrade
        );
    }

    if (deliveryUpgradeBuyButton) {
        deliveryUpgradeBuyButton.addEventListener(
            "click",
            buyDeliveryTruckUpgrade
        );
    }

    if (preWorkoutUpgradeBuyButton) {
        preWorkoutUpgradeBuyButton.addEventListener(
            "click",
            buyPreWorkoutUpgrade
        );
    }

    if (luckyShotUpgradeBuyButton) {
        luckyShotUpgradeBuyButton.addEventListener(
            "click",
            buyLuckyShotUpgrade
        );
    }

    if (kineticUpgradeBuyButton) {
        kineticUpgradeBuyButton.addEventListener(
            "click",
            buyKineticOverflowUpgrade
        );
    }

    /*
        Any cards not connected yet will continue
        using the temporary red failure effect.
    */
    const temporaryBuyButtons =
        shopList.querySelectorAll(
            ".buyButton:not(#drinkUpgradeBuyButton):not(#factoryUpgradeBuyButton):not(#deliveryUpgradeBuyButton):not(#preWorkoutUpgradeBuyButton):not(#luckyShotUpgradeBuyButton):not(#kineticUpgradeBuyButton)"
        );

    temporaryBuyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const upgradeCard =
                button.closest(".upgradeCard");

            showPurchaseFailure(
                upgradeCard
            );
        });
    });
}

// -------------------------------------------------
// CALCULATE OFFLINE PRODUCTION
// -------------------------------------------------

function calculateOfflineProduction(savedAt) {
    const currentEnergyPerSecond =
        getCurrentEnergyPerSecond();

    if (currentEnergyPerSecond <= 0) {
        return {
            secondsAway: 0,
            energyEarned: 0
        };
    }

    if (!Number.isFinite(savedAt)) {
        return {
            secondsAway: 0,
            energyEarned: 0
        };
    }

    const currentTime =
        Date.now();

    const rawSecondsAway =
        Math.floor(
            (currentTime - savedAt) / 1000
        );

    const countedSecondsAway =
        Math.min(
            Math.max(rawSecondsAway, 0),
            MAXIMUM_OFFLINE_SECONDS
        );

    if (
        countedSecondsAway <
        MINIMUM_OFFLINE_SECONDS
    ) {
        return {
            secondsAway: 0,
            energyEarned: 0
        };
    }

    const energyEarned =
        currentEnergyPerSecond *
        getOfflineProductionMultiplier() *
        countedSecondsAway;

    return {
        secondsAway:
            countedSecondsAway,

        energyEarned:
            energyEarned
    };
}


// -------------------------------------------------
// APPLY OFFLINE PRODUCTION
// -------------------------------------------------

function applyOfflineProduction(savedAt) {
    const offlineResult =
        calculateOfflineProduction(
            savedAt
        );

    if (
        offlineResult.energyEarned <= 0
    ) {
        return;
    }

    /*
        Award the energy immediately so it cannot
        be lost if the player closes the app before
        pressing Continue.
    */
    mobileEnergy +=
        offlineResult.energyEarned;

    mobileLifetimeEnergy +=
        offlineResult.energyEarned;

    showOfflineReward(
        offlineResult.secondsAway,
        offlineResult.energyEarned
    );
}


// -------------------------------------------------
// SHOW THE OFFLINE REWARD PANEL
// -------------------------------------------------

function showOfflineReward(
    secondsAway,
    energyEarned
) {
    offlineTimeAwayDisplay.textContent =
        formatGameTime(secondsAway);

    offlineEnergyEarnedDisplay.textContent =
        `+${formatGameNumber(energyEarned)}`;

    offlineRewardOverlay.classList.add(
        "open"
    );

    offlineRewardOverlay.setAttribute(
        "aria-hidden",
        "false"
    );
}


// -------------------------------------------------
// CLOSE THE OFFLINE REWARD PANEL
// -------------------------------------------------

function closeOfflineReward() {
    offlineRewardOverlay.classList.remove(
        "open"
    );

    offlineRewardOverlay.setAttribute(
        "aria-hidden",
        "true"
    );
}


offlineContinueButton.addEventListener(
    "click",
    closeOfflineReward
);


// -------------------------------------------------
// AUTOMATIC ENERGY PRODUCTION
// -------------------------------------------------

function produceAutomaticEnergy() {
    if (!hasSelectedSaveSlot) {
        return;
    }

    mobileSecondsPlayed++;

    const currentEnergyPerSecond =
        getCurrentEnergyPerSecond();

    if (currentEnergyPerSecond > 0) {
        mobileEnergy +=
            currentEnergyPerSecond;

        mobileLifetimeEnergy +=
            currentEnergyPerSecond;

        updateShopBalance();
        return;
    }

    updateStatsDisplay();
    updateRebirthDynamicDisplays();
}


setInterval(
    produceAutomaticEnergy,
    1000
);

// -------------------------------------------------
// TEMPORARY DEVELOPER ENERGY BUTTON
// -------------------------------------------------

const devEnergyButton =
    document.getElementById("devEnergyButton");


function addDeveloperEnergy() {
    mobileEnergy += 1_000_000_000;

    /*
        Immediately updates both the home score
        and the shop balance if the shop is open.
    */
    updateShopBalance();
}


devEnergyButton.addEventListener(
    "click",
    addDeveloperEnergy
);

// -------------------------------------------------
// SAVE SYSTEM
// -------------------------------------------------

const SAVE_VERSION = 4;

/*
    No slot is active until the player selects one
    from the opening screen.
*/
let activeSaveSlot = null;
let hasSelectedSaveSlot = false;

const AUTO_SAVE_INTERVAL_MS = 5000;


// -------------------------------------------------
// GET THE CURRENT SAVE-SLOT KEY
// -------------------------------------------------

function getSaveKey() {
    if (!Number.isInteger(activeSaveSlot)) {
        return null;
    }

    return `energyClickerSaveSlot${activeSaveSlot}`;
}


// -------------------------------------------------
// SAVE THE CURRENT GAME
// -------------------------------------------------

function saveGame() {
    if (
        isResettingGame ||
        !hasSelectedSaveSlot ||
        !Number.isInteger(activeSaveSlot)
    ) {
        return false;
    }

    const saveKey =
        getSaveKey();

    if (!saveKey) {
        return false;
    }

    const saveData = {
        version: SAVE_VERSION,
        savedAt: Date.now(),

        energy:
            mobileEnergy,

        drinkUpgradeIndex:
            mobileDrinkUpgradeIndex,

        factoryUpgradeIndex:
            mobileFactoryUpgradeIndex,

        deliveryUpgradeIndex:
            mobileDeliveryUpgradeIndex,

        preWorkoutUpgradeIndex:
            mobilePreWorkoutUpgradeIndex,

        luckyShotUpgradeIndex:
            mobileLuckyShotUpgradeIndex,

        kineticUpgradeIndex:
            mobileKineticUpgradeIndex,

        ownedSkins: [
            ...mobileOwnedSkins
        ],

        equippedSkinIndex:
            mobileEquippedSkinIndex,

        ownedColors: [
            ...mobileOwnedColors
        ],

        equippedColorIndex:
            mobileEquippedColorIndex,

        totalTaps:
            mobileTotalTaps,

        lifetimeEnergy:
            mobileLifetimeEnergy,

        luckyShotsActivated:
            mobileLuckyShotsActivated,

        kineticActivations:
            mobileKineticActivations,

        secondsPlayed:
            mobileSecondsPlayed,

        unlockedAchievementIds: [
            ...mobileUnlockedAchievementIds
        ],

        lifeLevel:
            mobileLifeLevel,

        permanentPerks: {
            ...mobilePermanentPerks
        },

        pendingRebirthChoices: [
            ...mobilePendingRebirthChoices
        ]
    };

    try {
        localStorage.setItem(
            saveKey,
            JSON.stringify(saveData)
        );

        return true;
    } catch (error) {
        console.error(
            "Energy Clicker could not save:",
            error
        );

        return false;
    }
}


// -------------------------------------------------
// SAFE SAVED-NUMBER HELPERS
// -------------------------------------------------

function getSafeSavedNumber(
    value,
    fallbackValue = 0
) {
    if (!Number.isFinite(value)) {
        return fallbackValue;
    }

    return Math.max(
        0,
        value
    );
}


function getSafeUpgradeIndex(
    value,
    maximumIndex
) {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.min(
        Math.max(
            Math.trunc(value),
            0
        ),
        maximumIndex
    );
}


// -------------------------------------------------
// RESTORE A SCALABLE DRINK POWER LEVEL
// -------------------------------------------------

function getSafeDrinkPowerLevel(value) {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.min(
        Math.max(
            Math.trunc(value),
            0
        ),
        DRINK_POWER_MAX_LEVEL
    );
}


// -------------------------------------------------
// RESTORE AN OWNED-ITEM ARRAY
// -------------------------------------------------

function restoreOwnedItems(
    currentArray,
    savedArray
) {
    currentArray.forEach(
        (unusedItem, index) => {
            currentArray[index] =
                Boolean(
                    Array.isArray(savedArray) &&
                    savedArray[index]
                );
        }
    );
}


// -------------------------------------------------
// REBUILD CALCULATED GAME VALUES
// -------------------------------------------------

function rebuildDerivedGameValues() {
    /*
        Recalculate tap power from the scalable
        Drink Power level.
    */
    mobileEnergyPerTap =
        calculateDrinkPowerFromLevel(
            mobileDrinkUpgradeIndex
        );

    /*
        Recalculate every source of automatic
        production from scalable upgrade levels.
    */
    mobileEnergyPerSecond =
        calculateFactoryProductionFromLevel(
            mobileFactoryUpgradeIndex
        ) +
        calculateDeliveryProductionFromLevel(
            mobileDeliveryUpgradeIndex
        ) +
        calculatePreWorkoutProductionFromLevel(
            mobilePreWorkoutUpgradeIndex
        );

    const luckyShotValues =
        calculateLuckyShotValuesFromLevel(
            mobileLuckyShotUpgradeIndex
        );

    mobileLuckyShotChance =
        luckyShotValues.chance;

    mobileLuckyShotBonusMultiplier =
        luckyShotValues.bonusMultiplier;

    const kineticValues =
        calculateKineticValuesFromLevel(
            mobileKineticUpgradeIndex
        );

    mobileKineticChance =
        kineticValues.chance;

    mobileKineticMultiplier =
        kineticValues.multiplier;

    mobileKineticDuration =
        kineticValues.duration;

    /*
        Temporary boosts do not continue after
        closing or refreshing the game.
    */
    mobileKineticActive = false;
    mobileKineticTimeLeft = 0;

    if (kineticCountdownInterval) {
        clearInterval(
            kineticCountdownInterval
        );

        kineticCountdownInterval = null;
    }

    kineticStatus.textContent = "";

    kineticStatus.classList.remove(
        "active"
    );

    const equippedSkinIsValid =
        Number.isInteger(
            mobileEquippedSkinIndex
        ) &&
        mobileOwnedSkins[
            mobileEquippedSkinIndex
        ] &&
        COSMETIC_UPGRADES[
            mobileEquippedSkinIndex
        ];

    if (equippedSkinIsValid) {
        const equippedSkin =
            COSMETIC_UPGRADES[
                mobileEquippedSkinIndex
            ];

        equippedSkinImage =
            equippedSkin.buttonImg ||
            equippedSkin.img;
    } else {
        mobileEquippedSkinIndex = null;
        equippedSkinImage = null;
    }

    const equippedColorIsValid =
        Number.isInteger(
            mobileEquippedColorIndex
        ) &&
        mobileOwnedColors[
            mobileEquippedColorIndex
        ] &&
        CHANGECOLOR_UPGRADES[
            mobileEquippedColorIndex
        ];

    if (!equippedColorIsValid) {
        mobileEquippedColorIndex = null;
    }
}

// -------------------------------------------------
// LOAD THE CURRENT GAME
// -------------------------------------------------

function loadGame() {
    const saveKey =
        getSaveKey();

    if (!saveKey) {
        return false;
    }

    let savedText;

    try {
        savedText =
            localStorage.getItem(
                saveKey
            );
    } catch (error) {
        console.error(
            "Energy Clicker could not access its save:",
            error
        );

        return false;
    }

    if (!savedText) {
        return false;
    }

    try {
        const savedData =
            JSON.parse(savedText);

        if (
            !savedData ||
            typeof savedData !== "object"
        ) {
            return false;
        }

        mobileEnergy =
            getSafeSavedNumber(
                savedData.energy
            );

        mobileDrinkUpgradeIndex =
            getSafeDrinkPowerLevel(
                savedData.drinkUpgradeIndex
            );

        mobileFactoryUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.factoryUpgradeIndex,
                FACTORY_MAX_LEVEL
            );

        mobileDeliveryUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.deliveryUpgradeIndex,
                DELIVERY_MAX_LEVEL
            );

        mobilePreWorkoutUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.preWorkoutUpgradeIndex,
                PREWORKOUT_MAX_LEVEL
            );

        mobileLuckyShotUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.luckyShotUpgradeIndex,
                LUCKY_SHOT_MAX_LEVEL
            );

        mobileKineticUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.kineticUpgradeIndex,
                KINETIC_MAX_LEVEL
            );

        restoreOwnedItems(
            mobileOwnedSkins,
            savedData.ownedSkins
        );

        restoreOwnedItems(
            mobileOwnedColors,
            savedData.ownedColors
        );

        mobileEquippedSkinIndex =
            Number.isInteger(
                savedData.equippedSkinIndex
            )
                ? savedData.equippedSkinIndex
                : null;

        mobileEquippedColorIndex =
            Number.isInteger(
                savedData.equippedColorIndex
            )
                ? savedData.equippedColorIndex
                : null;

        mobileTotalTaps =
            Math.floor(
                getSafeSavedNumber(
                    savedData.totalTaps
                )
            );

        mobileLifetimeEnergy =
            getSafeSavedNumber(
                savedData.lifetimeEnergy
            );

        mobileLuckyShotsActivated =
            Math.floor(
                getSafeSavedNumber(
                    savedData.luckyShotsActivated
                )
            );

        mobileKineticActivations =
            Math.floor(
                getSafeSavedNumber(
                    savedData.kineticActivations
                )
            );

        mobileSecondsPlayed =
            Math.floor(
                getSafeSavedNumber(
                    savedData.secondsPlayed
                )
            );

        mobileLifeLevel =
            Math.floor(
                getSafeSavedNumber(
                    savedData.lifeLevel
                )
            );

        restorePermanentPerks(
            savedData.permanentPerks
        );

        mobilePendingRebirthChoices =
            getValidPendingRebirthChoices(
                savedData.pendingRebirthChoices
            );

        const saveHasAchievementData =
            Array.isArray(
                savedData.unlockedAchievementIds
            );

        mobileUnlockedAchievementIds =
            getValidAchievementIds(
                savedData.unlockedAchievementIds
            );

        rebuildDerivedGameValues();

        if (!saveHasAchievementData) {
            unlockCurrentAchievementsSilently();
        }

        /*
            Do not grant offline production while a
            Rebirth perk choice is still pending. The
            new Life has not officially started yet.
        */
        if (
            mobilePendingRebirthChoices.length === 0
        ) {
            applyOfflineProduction(
                savedData.savedAt
            );
        }

        return true;
    } catch (error) {
        console.error(
            "Energy Clicker save data was invalid:",
            error
        );

        return false;
    }
}


// -------------------------------------------------
// AUTOMATIC SAVING
// -------------------------------------------------

setInterval(
    saveGame,
    AUTO_SAVE_INTERVAL_MS
);


/*
    Save when the browser or future mobile app
    moves into the background.
*/
document.addEventListener(
    "visibilitychange",
    () => {
        if (document.hidden) {
            saveGame();
        }
    }
);


/*
    pagehide is especially helpful for mobile
    browsers and app web views.
*/
window.addEventListener(
    "pagehide",
    saveGame
);

// -------------------------------------------------
// INITIAL GAME SETUP
// -------------------------------------------------

/*
    Global settings load before the save-slot
    selection screen appears.
*/
loadGameSettings();

/*
    The player must then select a save slot.
*/
renderSaveSlotScreen();