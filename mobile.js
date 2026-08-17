// BALANCED BUILD: ECONOMY V1 + ACHIEVEMENTS V3 + LIFE CHALLENGES
// -------------------------------------------------
// MOBILE MENU ELEMENTS
// -------------------------------------------------
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
const mobileLifeBadgeDisplay = document.getElementById("mobileLifeBadge");
const homeTapHint = document.getElementById("homeTapHint");
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
// FINAL ECONOMY V1 — CENTRAL BALANCE SETTINGS
// -------------------------------------------------

/*
    Economy target:
    - First Rebirth: roughly 15–30 minutes of casual active play.
    - Early Rebirths: roughly 20–40 minutes, depending on tapping,
      upgrades, challenge rewards, Lucky Shot, Kinetic, and perks.
    - Later Lives gradually become longer without turning into a wall.

    All main upgrade prices and gains are generated from these bands.
    That makes the full 1–1000 progression smooth instead of relying on
    giant hand-written jumps between the first few levels.
*/
const GAME_BALANCE_VERSION = 3;

const MAIN_COST_GROWTH_BANDS = [
    { untilLevel: 10, growth: 1.50 },
    { untilLevel: 50, growth: 1.22 },
    { untilLevel: 200, growth: 1.17 },
    { untilLevel: 1000, growth: 1.13 }
];

const TAP_GAIN_GROWTH_BANDS = [
    { untilLevel: 10, growth: 1.30 },
    { untilLevel: 50, growth: 1.20 },
    { untilLevel: 200, growth: 1.16 },
    { untilLevel: 1000, growth: 1.125 }
];

const PASSIVE_GAIN_GROWTH_BANDS = [
    { untilLevel: 10, growth: 1.32 },
    { untilLevel: 50, growth: 1.21 },
    { untilLevel: 200, growth: 1.165 },
    { untilLevel: 1000, growth: 1.128 }
];

const SPECIAL_COST_GROWTH_BANDS = [
    { untilLevel: 10, growth: 1.55 },
    { untilLevel: 50, growth: 1.24 },
    { untilLevel: 200, growth: 1.18 },
    { untilLevel: 1000, growth: 1.135 }
];

function calculateBandedProgressionValue(
    baseValue,
    currentLevel,
    growthBands
) {
    const safeLevel = Math.max(
        0,
        Math.floor(currentLevel)
    );

    let value = Math.max(0, baseValue);
    let levelsRemaining = safeLevel;
    let previousEnd = 0;

    for (const band of growthBands) {
        const bandLength = Math.max(
            0,
            band.untilLevel - previousEnd
        );

        const levelsInBand = Math.min(
            levelsRemaining,
            bandLength
        );

        if (levelsInBand > 0) {
            value *= Math.pow(
                band.growth,
                levelsInBand
            );

            levelsRemaining -= levelsInBand;
        }

        previousEnd = band.untilLevel;

        if (levelsRemaining <= 0) {
            break;
        }
    }

    if (levelsRemaining > 0) {
        const finalGrowth =
            growthBands[growthBands.length - 1]
                ?.growth || 1;

        value *= Math.pow(
            finalGrowth,
            levelsRemaining
        );
    }

    if (!Number.isFinite(value)) {
        return Number.MAX_VALUE;
    }

    return value;
}

const DRINK_POWER_BASE_COST = 12;
const DRINK_POWER_BASE_GAIN = 1;

const FACTORY_BASE_COST = 120;
const FACTORY_BASE_GAIN = 2;

const DELIVERY_BASE_COST = 650;
const DELIVERY_BASE_GAIN = 8;

const PREWORKOUT_BASE_COST = 3_500;
const PREWORKOUT_BASE_GAIN = 45;

const LUCKY_SHOT_BASE_COST = 1_500;
const LUCKY_SHOT_BASE_CHANCE = 0.01;
const LUCKY_SHOT_CHANCE_PER_LEVEL = 0.0001;
const LUCKY_SHOT_MAX_CHANCE = 0.025;
const LUCKY_SHOT_BASE_BONUS = 0.03;
const LUCKY_SHOT_BONUS_PER_LEVEL = 0.0001;
const LUCKY_SHOT_MAX_BONUS = 0.08;

const KINETIC_BASE_COST = 4_000;
const KINETIC_BASE_CHANCE = 0.005;
const KINETIC_CHANCE_PER_LEVEL = 0.00001;
const KINETIC_MAX_CHANCE = 0.015;
const KINETIC_BASE_MULTIPLIER = 2;
const KINETIC_MULTIPLIER_PER_LEVEL = 0.006;
const KINETIC_MAX_MULTIPLIER = 8;
const KINETIC_BASE_DURATION = 3;
const KINETIC_DURATION_PER_LEVEL = 0.005;
const KINETIC_MAX_DURATION = 8;

const OFFLINE_PRODUCTION_EFFICIENCY = 0.50;

// -------------------------------------------------
// DRINK POWER UPGRADE STATE
// -------------------------------------------------

/*
    Drink Power is formula-driven from Level 1 through 1000.
*/
let mobileDrinkUpgradeIndex = 0;

const DRINK_POWER_MAX_LEVEL = 1000;

/*
    Major can artwork changes happen only at these
    Drink Power milestones.
*/
const CAN_LEVEL_IMAGES = [
    "assets/upgrades/drink-power/tier-1.png",
    "assets/upgrades/drink-power/tier-2.png",
    "assets/upgrades/drink-power/tier-3.png",
    "assets/upgrades/drink-power/tier-4.png",
    "assets/upgrades/drink-power/tier-5.png",
    "assets/upgrades/drink-power/tier-6.png",
    "assets/upgrades/drink-power/tier-7.png",
    "assets/upgrades/drink-power/tier-8.png",
    "assets/upgrades/drink-power/tier-9.png",
    "assets/upgrades/drink-power/tier-10.png"
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
    },
    {
        level: 350,
        tier: 7,
        image: CAN_LEVEL_IMAGES[6]
    },
    {
        level: 500,
        tier: 8,
        image: CAN_LEVEL_IMAGES[7]
    },
    {
        level: 700,
        tier: 9,
        image: CAN_LEVEL_IMAGES[8]
    },
    {
        level: 900,
        tier: 10,
        image: CAN_LEVEL_IMAGES[9]
    }
];

/*
    An equipped cosmetic skin overrides the normal
    Drink Power can artwork.
*/
let equippedSkinImage = null;

const MAXED_OUT_IMAGE = "assets/ui/maxedOut.png";

const mobileCanImage =
    document.getElementById("mobileCanImage");

const shopBalanceImage =
    document.getElementById("shopBalanceImage");

// -------------------------------------------------
// FACTORY AND AUTOMATIC PRODUCTION STATE
// -------------------------------------------------

let mobileEnergyPerSecond = 0;

/*
    Factory is formula-driven from Level 1 through 1000.
*/
let mobileFactoryUpgradeIndex = 0;

const FACTORY_MAX_LEVEL = 1000;

/*
    Factory artwork changes at major level milestones.
    Every milestone points directly to the new asset folder.
*/
const FACTORY_TIER_MILESTONES = [
    { level: 0, tier: 1, image: "assets/upgrades/factory/tier-1.png" },
    { level: 10, tier: 2, image: "assets/upgrades/factory/tier-2.png" },
    { level: 25, tier: 3, image: "assets/upgrades/factory/tier-3.png" },
    { level: 50, tier: 4, image: "assets/upgrades/factory/tier-4.png" },
    { level: 100, tier: 5, image: "assets/upgrades/factory/tier-5.png" },
    { level: 200, tier: 6, image: "assets/upgrades/factory/tier-6.png" },
    { level: 350, tier: 7, image: "assets/upgrades/factory/tier-7.png" },
    { level: 500, tier: 8, image: "assets/upgrades/factory/tier-8.png" },
    { level: 700, tier: 9, image: "assets/upgrades/factory/tier-9.png" },
    { level: 900, tier: 10, image: "assets/upgrades/factory/tier-10.png" }
];

const mobilePerSecondRow =
    document.getElementById("mobilePerSecondRow");

const mobilePerSecondDisplay =
    document.getElementById("mobilePerSecond");

// -------------------------------------------------
// DELIVERY TRUCK UPGRADE STATE
// -------------------------------------------------

/*
    Delivery Truck is formula-driven from Level 1 through 1000.
*/
let mobileDeliveryUpgradeIndex = 0;

const DELIVERY_MAX_LEVEL = 1000;

const DELIVERY_TIER_MILESTONES = [
    { level: 0, tier: 1, image: "assets/upgrades/delivery-truck/tier-1.png" },
    { level: 10, tier: 2, image: "assets/upgrades/delivery-truck/tier-2.png" },
    { level: 25, tier: 3, image: "assets/upgrades/delivery-truck/tier-3.png" },
    { level: 50, tier: 4, image: "assets/upgrades/delivery-truck/tier-4.png" },
    { level: 100, tier: 5, image: "assets/upgrades/delivery-truck/tier-5.png" },
    { level: 200, tier: 6, image: "assets/upgrades/delivery-truck/tier-6.png" },
    { level: 350, tier: 7, image: "assets/upgrades/delivery-truck/tier-7.png" },
    { level: 500, tier: 8, image: "assets/upgrades/delivery-truck/tier-8.png" },
    { level: 700, tier: 9, image: "assets/upgrades/delivery-truck/tier-9.png" },
    { level: 900, tier: 10, image: "assets/upgrades/delivery-truck/tier-10.png" }
];


// -------------------------------------------------
// PRE-WORKOUT UPGRADE STATE
// -------------------------------------------------

/*
    Pre-Workout is formula-driven from Level 1 through 1000.
*/
let mobilePreWorkoutUpgradeIndex = 0;

const PREWORKOUT_MAX_LEVEL = 1000;

const PREWORKOUT_TIER_MILESTONES = [
    { level: 0, tier: 1, image: "assets/upgrades/preworkout/tier-1.png" },
    { level: 10, tier: 2, image: "assets/upgrades/preworkout/tier-2.png" },
    { level: 25, tier: 3, image: "assets/upgrades/preworkout/tier-3.png" },
    { level: 50, tier: 4, image: "assets/upgrades/preworkout/tier-4.png" },
    { level: 100, tier: 5, image: "assets/upgrades/preworkout/tier-5.png" },
    { level: 200, tier: 6, image: "assets/upgrades/preworkout/tier-6.png" },
    { level: 350, tier: 7, image: "assets/upgrades/preworkout/tier-7.png" },
    { level: 500, tier: 8, image: "assets/upgrades/preworkout/tier-8.png" },
    { level: 700, tier: 9, image: "assets/upgrades/preworkout/tier-9.png" },
    { level: 900, tier: 10, image: "assets/upgrades/preworkout/tier-10.png" }
];

// -------------------------------------------------
// LUCKY SHOT STATE
// -------------------------------------------------

let mobileLuckyShotUpgradeIndex = 0;
let mobileLuckyShotChance = 0;
let mobileLuckyShotBonusMultiplier = LUCKY_SHOT_BASE_BONUS;

const LUCKY_SHOT_MAX_LEVEL = 1000;

const LUCKY_SHOT_TIER_MILESTONES = [
    { level: 0, tier: 1, image: "assets/upgrades/luckyshot/tier-1.png" },
    { level: 10, tier: 2, image: "assets/upgrades/luckyshot/tier-2.png" },
    { level: 25, tier: 3, image: "assets/upgrades/luckyshot/tier-3.png" },
    { level: 50, tier: 4, image: "assets/upgrades/luckyshot/tier-4.png" },
    { level: 100, tier: 5, image: "assets/upgrades/luckyshot/tier-5.png" },
    { level: 200, tier: 6, image: "assets/upgrades/luckyshot/tier-6.png" },
    { level: 350, tier: 7, image: "assets/upgrades/luckyshot/tier-7.png" },
    { level: 500, tier: 8, image: "assets/upgrades/luckyshot/tier-8.png" },
    { level: 700, tier: 9, image: "assets/upgrades/luckyshot/tier-9.png" },
    { level: 900, tier: 10, image: "assets/upgrades/luckyshot/tier-10.png" }
];

const mobileGameMessage =
    document.getElementById("mobileGameMessage");

let luckyShotMessageTimer = null;

// -------------------------------------------------
// KINETIC OVERFLOW STATE
// -------------------------------------------------

let mobileKineticUpgradeIndex = 0;

const KINETIC_MAX_LEVEL = 1000;

const KINETIC_TIER_MILESTONES = [
    { level: 0, tier: 1, image: "assets/upgrades/kinetic-overflow/tier-1.png" },
    { level: 10, tier: 2, image: "assets/upgrades/kinetic-overflow/tier-2.png" },
    { level: 25, tier: 3, image: "assets/upgrades/kinetic-overflow/tier-3.png" },
    { level: 50, tier: 4, image: "assets/upgrades/kinetic-overflow/tier-4.png" },
    { level: 100, tier: 5, image: "assets/upgrades/kinetic-overflow/tier-5.png" },
    { level: 200, tier: 6, image: "assets/upgrades/kinetic-overflow/tier-6.png" },
    { level: 350, tier: 7, image: "assets/upgrades/kinetic-overflow/tier-7.png" },
    { level: 500, tier: 8, image: "assets/upgrades/kinetic-overflow/tier-8.png" },
    { level: 700, tier: 9, image: "assets/upgrades/kinetic-overflow/tier-9.png" },
    { level: 900, tier: 10, image: "assets/upgrades/kinetic-overflow/tier-10.png" }
];

let mobileKineticChance = 0;
let mobileKineticMultiplier = 1;
let mobileKineticDuration = 0;

let mobileKineticActive = false;
let mobileKineticTimeLeft = 0;

let kineticCountdownInterval = null;
let kineticOverflowEndTime = 0;

const kineticStatus =
    document.getElementById("kineticStatus");

const mobilePerTapRow =
    mobilePerTapDisplay.closest(".productionText");


// -------------------------------------------------
// SUPPLY DROP UPGRADE + EVENT STATE
// -------------------------------------------------

/*
    Supply Drop is a real resettable gameplay upgrade.

    Level 0 = locked, so no drops can appear.
    Buying Level 1 unlocks the falling-crate event.
    Higher levels make drops appear more consistently
    and increase the reward without letting the system
    overpower normal tapping.
*/
const SUPPLY_DROP_BASE_COST = 12_000;
const SUPPLY_DROP_MAX_LEVEL = 1000;

const SUPPLY_DROP_TIER_MILESTONES = [
    { level: 0, tier: 1, image: "assets/upgrades/supply-drop/tier-1.png" },
    { level: 10, tier: 2, image: "assets/upgrades/supply-drop/tier-2.png" },
    { level: 25, tier: 3, image: "assets/upgrades/supply-drop/tier-3.png" },
    { level: 50, tier: 4, image: "assets/upgrades/supply-drop/tier-4.png" },
    { level: 100, tier: 5, image: "assets/upgrades/supply-drop/tier-5.png" },
    { level: 200, tier: 6, image: "assets/upgrades/supply-drop/tier-6.png" },
    { level: 350, tier: 7, image: "assets/upgrades/supply-drop/tier-7.png" },
    { level: 500, tier: 8, image: "assets/upgrades/supply-drop/tier-8.png" },
    { level: 700, tier: 9, image: "assets/upgrades/supply-drop/tier-9.png" },
    { level: 900, tier: 10, image: "assets/upgrades/supply-drop/tier-10.png" }
];

const SUPPLY_DROP_FIRST_MIN_DELAY_MS = 20_000;
const SUPPLY_DROP_FIRST_MAX_DELAY_MS = 35_000;
const SUPPLY_DROP_FALL_DURATION_MS = 6_200;
const SUPPLY_DROP_RETRY_DELAY_MS = 8_000;
const SUPPLY_DROP_MIN_REWARD = 100;

const SUPPLY_DROP_TAP_EQUIVALENT = 6;
const SUPPLY_DROP_PASSIVE_SECONDS = 5;

let mobileSupplyDropUpgradeIndex = 0;

let supplyDropSpawnTimer = null;
let supplyDropExpireTimer = null;
let supplyDropActive = false;

const supplyDropButton =
    document.getElementById("supplyDropButton");

const supplyDropEventImage =
    document.getElementById("supplyDropEventImage");

const supplyDropRewardPopup =
    document.getElementById("supplyDropRewardPopup");


// -------------------------------------------------
// BULK UPGRADE PURCHASE STATE
// -------------------------------------------------

/*
    Because every upgrade tree can now reach 1,000
    levels, players should not have to press BUY one
    thousand separate times. This selector applies to
    all seven gameplay upgrade cards.
*/
const VALID_UPGRADE_BUY_MODES = [
    "1",
    "10",
    "25",
    "max"
];

let mobileUpgradeBuyMode = "1";


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
    Players earn 50% of normal passive production
    for a maximum of seven days while away. Permanent
    offline perks can improve that efficiency.
*/
const MAXIMUM_OFFLINE_SECONDS =
    7 * 24 * 60 * 60;

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

const offlineRewardMessage =
    document.getElementById(
        "offlineRewardMessage"
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

/*
    Achievement System Version 3 balances the long-term
    short testing achievements with long-term chains.

    Rewards add CURRENT ENERGY only. They intentionally
    do not increase lifetime energy, so achievement
    rewards cannot trigger other energy achievements.
*/
const ACHIEVEMENT_SYSTEM_VERSION = 3;

const ACHIEVEMENT_ROMAN_NUMERALS = [
    "I", "II", "III", "IV", "V", "VI", "VII"
];


function createAchievementChain({
    idPrefix,
    category,
    icon,
    baseName,
    targets,
    rewards,
    getProgress,
    descriptionBuilder
}) {
    return targets.map((target, index) => ({
        id: `${idPrefix}${index + 1}`,
        category,
        icon,
        name:
            `${baseName} ${ACHIEVEMENT_ROMAN_NUMERALS[index] || index + 1}`,
        description:
            descriptionBuilder(target),
        target,
        rewardEnergy:
            rewards[index] || 0,
        getProgress
    }));
}


const PLAYER_ACHIEVEMENTS = [
    ...createAchievementChain({
        idPrefix: "tapMachine",
        category: "TAPPING",
        icon: "👆",
        baseName: "TAP MACHINE",
        targets: [
            1_000,
            10_000,
            100_000,
            1_000_000,
            10_000_000,
            100_000_000,
            1_000_000_000
        ],
        rewards: [
            50_000,
            300_000,
            2_000_000,
            15_000_000,
            120_000_000,
            1_000_000_000,
            10_000_000_000
        ],
        getProgress: () => mobileTotalTaps,
        descriptionBuilder: (target) =>
            `Tap the can ${formatGameNumber(target)} times.`
    }),

    ...createAchievementChain({
        idPrefix: "energyEmpire",
        category: "LIFETIME ENERGY",
        icon: "⚡",
        baseName: "ENERGY EMPIRE",
        targets: [
            1_000_000,
            1_000_000_000,
            1_000_000_000_000,
            1_000_000_000_000_000,
            1e18,
            1e21,
            1e24
        ],
        rewards: [
            25_000,
            25_000_000,
            25_000_000_000,
            25_000_000_000_000,
            2.5e16,
            2.5e19,
            2.5e22
        ],
        getProgress: () => mobileLifetimeEnergy,
        descriptionBuilder: (target) =>
            `Produce ${formatGameNumber(target)} lifetime energy.`
    }),

    ...createAchievementChain({
        idPrefix: "drinkMaster",
        category: "DRINK POWER",
        icon: "🥤",
        baseName: "CAN MASTER",
        targets: [25, 100, 500, 1_000],
        rewards: [
            100_000,
            1_000_000_000,
            5e31,
            1e58
        ],
        getProgress: () => mobileDrinkUpgradeIndex,
        descriptionBuilder: (target) =>
            `Reach Drink Power Level ${target}.`
    }),

    ...createAchievementChain({
        idPrefix: "factoryMaster",
        category: "FACTORY",
        icon: "🏭",
        baseName: "FACTORY TYCOON",
        targets: [25, 100, 500, 1_000],
        rewards: [
            100_000,
            10_000_000_000,
            5e32,
            1e59
        ],
        getProgress: () => mobileFactoryUpgradeIndex,
        descriptionBuilder: (target) =>
            `Reach Factory Level ${target}.`
    }),

    ...createAchievementChain({
        idPrefix: "deliveryMaster",
        category: "DELIVERY",
        icon: "🚚",
        baseName: "ROAD KING",
        targets: [25, 100, 500, 1_000],
        rewards: [
            250_000,
            50_000_000_000,
            2.5e33,
            5e59
        ],
        getProgress: () => mobileDeliveryUpgradeIndex,
        descriptionBuilder: (target) =>
            `Reach Delivery Truck Level ${target}.`
    }),

    ...createAchievementChain({
        idPrefix: "preWorkoutMaster",
        category: "PRE-WORKOUT",
        icon: "💪",
        baseName: "FULLY LOADED",
        targets: [25, 100, 500, 1_000],
        rewards: [
            1_000_000,
            250_000_000_000,
            1.5e34,
            2.5e60
        ],
        getProgress: () => mobilePreWorkoutUpgradeIndex,
        descriptionBuilder: (target) =>
            `Reach Pre-Workout Level ${target}.`
    }),

    ...createAchievementChain({
        idPrefix: "luckyLevel",
        category: "LUCKY SHOT",
        icon: "🍀",
        baseName: "LUCKY STREAK",
        targets: [25, 100, 500, 1_000],
        rewards: [
            750_000,
            500_000_000_000,
            2e35,
            5e62
        ],
        getProgress: () => mobileLuckyShotUpgradeIndex,
        descriptionBuilder: (target) =>
            `Reach Lucky Shot Level ${target}.`
    }),

    ...createAchievementChain({
        idPrefix: "kineticLevel",
        category: "KINETIC OVERFLOW",
        icon: "🌩️",
        baseName: "OVERFLOW ENGINE",
        targets: [25, 100, 500, 1_000],
        rewards: [
            2_000_000,
            1_500_000_000_000,
            5e35,
            1e63
        ],
        getProgress: () => mobileKineticUpgradeIndex,
        descriptionBuilder: (target) =>
            `Reach Kinetic Overflow Level ${target}.`
    }),

    ...createAchievementChain({
        idPrefix: "luckyActivations",
        category: "LUCKY SHOT",
        icon: "🎯",
        baseName: "LUCK NEVER ENDS",
        targets: [25, 250, 2_500],
        rewards: [
            500_000,
            25_000_000,
            1_000_000_000
        ],
        getProgress: () => mobileLuckyShotsActivated,
        descriptionBuilder: (target) =>
            `Activate Lucky Shot ${formatGameNumber(target)} times.`
    }),

    ...createAchievementChain({
        idPrefix: "kineticActivations",
        category: "KINETIC OVERFLOW",
        icon: "🔥",
        baseName: "UNSTABLE POWER",
        targets: [25, 250, 2_500],
        rewards: [
            750_000,
            35_000_000,
            1_500_000_000
        ],
        getProgress: () => mobileKineticActivations,
        descriptionBuilder: (target) =>
            `Activate Kinetic Overflow ${formatGameNumber(target)} times.`
    }),

    ...createAchievementChain({
        idPrefix: "lifeVeteran",
        category: "REBIRTH",
        icon: "♻️",
        baseName: "ANOTHER LIFE",
        targets: [1, 5, 10, 25, 50],
        rewards: [
            1_875_000,
            73_000_000,
            7_150_000_000,
            2_630_000_000_000_000,
            9.57e23
        ],
        getProgress: () => mobileLifeLevel,
        descriptionBuilder: (target) =>
            `Reach Life ${target}.`
    }),

    {
        id: "perkRanks1",
        category: "PERMANENT PERKS",
        icon: "💎",
        name: "FIRST BLESSING",
        description: "Earn your first permanent perk rank.",
        target: 1,
        rewardEnergy: 1_000_000,
        getProgress: () =>
            getTotalPermanentPerkRanks()
    },
    {
        id: "perkRanks25",
        category: "PERMANENT PERKS",
        icon: "💎",
        name: "STACKED",
        description: "Own 25 total permanent perk ranks.",
        target: 25,
        rewardEnergy: 250_000_000,
        getProgress: () =>
            getTotalPermanentPerkRanks()
    },
    {
        id: "perkUnique10",
        category: "PERMANENT PERKS",
        icon: "🧬",
        name: "PERK COLLECTOR",
        description: "Discover 10 different permanent perks.",
        target: 10,
        rewardEnergy: 5_000_000_000,
        getProgress: () =>
            getUnlockedPermanentPerkCount()
    },
    {
        id: "perkLegendary1",
        category: "PERMANENT PERKS",
        icon: "👑",
        name: "JACKPOT",
        description: "Obtain your first Legendary permanent perk.",
        target: 1,
        rewardEnergy: 10_000_000_000,
        getProgress: () =>
            PERMANENT_PERK_DEFINITIONS.filter(
                (perk) =>
                    perk.rarity === "legendary" &&
                    getPermanentPerkRank(perk.id) > 0
            ).length
    },

    {
        id: "skinsOwned1",
        category: "COLLECTION",
        icon: "🎭",
        name: "FIRST STYLE",
        description: "Purchase your first can skin.",
        target: 1,
        rewardEnergy: 50_000,
        getProgress: () =>
            mobileOwnedSkins.filter(Boolean).length
    },
    {
        id: "skinsOwnedAll",
        category: "COLLECTION",
        icon: "🎭",
        name: "SKIN VAULT",
        description: "Own every available can skin.",
        target: Math.max(1, COSMETIC_UPGRADES.length),
        rewardEnergy: 10_000_000,
        getProgress: () =>
            mobileOwnedSkins.filter(Boolean).length
    },
    {
        id: "colorsOwned1",
        category: "COLLECTION",
        icon: "🎨",
        name: "FIRST COLOR",
        description: "Purchase your first score color.",
        target: 1,
        rewardEnergy: 50_000,
        getProgress: () =>
            mobileOwnedColors.filter(Boolean).length
    },
    {
        id: "colorsOwnedAll",
        category: "COLLECTION",
        icon: "🌈",
        name: "FULL SPECTRUM",
        description: "Own every available score color.",
        target: Math.max(1, CHANGECOLOR_UPGRADES.length),
        rewardEnergy: 50_000_000,
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

const achievementToastReward =
    document.getElementById(
        "achievementToastReward"
    );


// -------------------------------------------------
// CURRENT LIFE / LIFE CHALLENGE STATE
// -------------------------------------------------

let mobileCurrentLifeEnergyProduced = 0;
let mobileCurrentLifeTaps = 0;
let mobileCurrentLifeLuckyActivations = 0;
let mobileCurrentLifeKineticActivations = 0;
let mobileCurrentLifeSecondsPlayed = 0;

/*
    Snapshot of the most recently completed Life.
    This is saved permanently in the slot so the
    player can review the run after Rebirthing.
*/
let mobileLastLifeSummary = null;

let mobileCompletedLifeChallengeIds = [];

let lifeChallengeNotificationQueue = [];
let lifeChallengeNotificationActive = false;
let lifeChallengeNotificationTimer = null;

const lifeChallengeToast =
    document.getElementById(
        "lifeChallengeToast"
    );

const lifeChallengeToastTitle =
    document.getElementById(
        "lifeChallengeToastTitle"
    );

const lifeChallengeToastDescription =
    document.getElementById(
        "lifeChallengeToastDescription"
    );

const lifeChallengeToastReward =
    document.getElementById(
        "lifeChallengeToastReward"
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
const REBIRTH_BASE_REQUIREMENT = 25_000_000;

const REBIRTH_REQUIREMENT_GROWTH_BANDS = [
    { untilLife: 10, growth: 2.50 },
    { untilLife: 25, growth: 2.35 },
    { untilLife: 50, growth: 2.20 },
    { untilLife: 1000, growth: 2.00 }
];

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
            { type: "allProductionPercent", value: 0.015 }
        ]
    },
    {
        id: "strongGrip",
        name: "STRONG GRIP",
        icon: "👊",
        rarity: "common",
        maxRank: null,
        effects: [
            { type: "tapProductionPercent", value: 0.03 }
        ]
    },
    {
        id: "assemblyLine",
        name: "ASSEMBLY LINE",
        icon: "⚙️",
        rarity: "common",
        maxRank: null,
        effects: [
            { type: "autoProductionPercent", value: 0.03 }
        ]
    },
    {
        id: "nightShift",
        name: "NIGHT SHIFT",
        icon: "🌙",
        rarity: "common",
        maxRank: 20,
        effects: [
            { type: "offlineProductionPercent", value: 0.04 }
        ]
    },
    {
        id: "luckySip",
        name: "LUCKY SIP",
        icon: "🍀",
        rarity: "common",
        maxRank: 20,
        effects: [
            { type: "luckyBonus", value: 0.0015 }
        ]
    },

    {
        id: "headStart",
        name: "HEAD START",
        icon: "🥤",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "startingDrinkLevels", value: 4 }
        ]
    },
    {
        id: "factoryConnections",
        name: "FACTORY CONNECTIONS",
        icon: "🏭",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "startingFactoryLevels", value: 3 }
        ]
    },
    {
        id: "expressRoute",
        name: "EXPRESS ROUTE",
        icon: "🚚",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "startingDeliveryLevels", value: 3 }
        ]
    },
    {
        id: "preLoaded",
        name: "PRE-LOADED",
        icon: "💪",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "startingPreWorkoutLevels", value: 3 }
        ]
    },
    {
        id: "luckyGenes",
        name: "LUCKY GENES",
        icon: "🎯",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "luckyChance", value: 0.0005 }
        ]
    },
    {
        id: "kineticSpark",
        name: "KINETIC SPARK",
        icon: "🌩️",
        rarity: "rare",
        maxRank: 10,
        effects: [
            { type: "kineticChance", value: 0.0003 }
        ]
    },

    {
        id: "fullShelf",
        name: "FULL SHELF",
        icon: "💰",
        rarity: "epic",
        maxRank: 5,
        effects: [
            { type: "startingEnergyFraction", value: 0.005 }
        ]
    },
    {
        id: "overclocked",
        name: "OVERCLOCKED",
        icon: "🔥",
        rarity: "epic",
        maxRank: 10,
        effects: [
            { type: "kineticMultiplier", value: 0.15 }
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
            { type: "luckyChance", value: 0.00035 },
            { type: "luckyBonus", value: 0.002 }
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
            { type: "tapProductionPercent", value: 0.08 }
        ]
    },
    {
        id: "industrialEmpire",
        name: "INDUSTRIAL EMPIRE",
        icon: "🏙️",
        rarity: "legendary",
        maxRank: 5,
        effects: [
            { type: "autoProductionPercent", value: 0.08 }
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
            { type: "luckyChance", value: 0.0015 },
            { type: "kineticChance", value: 0.001 }
        ]
    },
    {
        id: "eternalNight",
        name: "ETERNAL NIGHT",
        icon: "🌌",
        rarity: "legendary",
        maxRank: 5,
        effects: [
            { type: "offlineProductionPercent", value: 0.10 }
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
        0.04,
        mobileLuckyShotChance +
        getPermanentPerkEffectTotal(
            "luckyChance"
        )
    );
}


function getCurrentLuckyShotBonusMultiplier() {
    return Math.min(
        0.12,
        mobileLuckyShotBonusMultiplier +
        getPermanentPerkEffectTotal(
            "luckyBonus"
        )
    );
}


function getCurrentKineticChance() {
    return Math.min(
        0.025,
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

        if (effect.type === "startingEnergyFraction") {
            return `START EACH LIFE WITH ${formatPerkPercent(total)} OF THE NEXT REBIRTH REQUIREMENT`;
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
            return `START ALL 7 UPGRADES AT LEVEL ${Math.floor(total)}`;
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

    let requirement =
        REBIRTH_BASE_REQUIREMENT;

    let livesRemaining =
        safeLifeLevel;

    let previousEnd = 0;

    for (
        const band of
        REBIRTH_REQUIREMENT_GROWTH_BANDS
    ) {
        const bandLength = Math.max(
            0,
            band.untilLife - previousEnd
        );

        const livesInBand = Math.min(
            livesRemaining,
            bandLength
        );

        if (livesInBand > 0) {
            requirement *= Math.pow(
                band.growth,
                livesInBand
            );

            livesRemaining -= livesInBand;
        }

        previousEnd = band.untilLife;

        if (livesRemaining <= 0) {
            break;
        }
    }

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
        ),

        supplyDrop: Math.min(
            SUPPLY_DROP_MAX_LEVEL,
            Math.floor(
                allLevels
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

    mobileSupplyDropUpgradeIndex =
        startingLevels.supplyDrop;

    const fixedStartingEnergy =
        getPermanentPerkEffectTotal(
            "startingEnergy"
        );

    const percentageStartingEnergy =
        getRebirthRequirement() *
        getPermanentPerkEffectTotal(
            "startingEnergyFraction"
        );

    mobileEnergy =
        fixedStartingEnergy +
        percentageStartingEnergy;

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
    stats: "MORE"
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
// FORMAT PRECISE PRODUCTION VALUES
// -------------------------------------------------

/*
    Production bonuses from permanent perks can create
    useful decimals at low levels. The main Energy
    total stays whole-number styled, but /tap, /sec,
    and floating tap rewards show those small bonuses.
*/
function formatProductionNumber(value) {
    if (!Number.isFinite(value)) {
        return "0";
    }

    const absoluteValue = Math.abs(value);

    if (absoluteValue >= 1000) {
        return formatGameNumber(value);
    }

    let decimalPlaces = 0;

    if (
        Math.abs(value - Math.round(value)) >
        0.000001
    ) {
        decimalPlaces =
            absoluteValue < 100
                ? 2
                : 1;
    }

    return Number(
        value.toFixed(decimalPlaces)
    ).toLocaleString(
        "en-US",
        {
            maximumFractionDigits:
                decimalPlaces
        }
    );
}


// -------------------------------------------------
// BULK UPGRADE PURCHASE CONFIGURATION
// -------------------------------------------------

function getBulkUpgradeConfig(upgradeKey) {
    const configurations = {
        drink: {
            getLevel: () =>
                mobileDrinkUpgradeIndex,

            setLevel: (level) => {
                mobileDrinkUpgradeIndex = level;

                mobileEnergyPerTap =
                    calculateDrinkPowerFromLevel(
                        level
                    );
            },

            maxLevel:
                DRINK_POWER_MAX_LEVEL,

            getUpgradeData:
                getDrinkPowerUpgradeData,

            getElements:
                getDrinkUpgradeElements,

            getTier: (level) =>
                getCurrentCanMilestone(
                    level
                ).tier,

            tierClass:
                "canTierUnlocked"
        },

        factory: {
            getLevel: () =>
                mobileFactoryUpgradeIndex,

            setLevel: (level) => {
                mobileFactoryUpgradeIndex = level;
                recalculateAutomaticProduction();
            },

            maxLevel:
                FACTORY_MAX_LEVEL,

            getUpgradeData:
                getFactoryUpgradeData,

            getElements:
                getFactoryUpgradeElements,

            getTier: (level) =>
                getCurrentFactoryMilestone(
                    level
                ).tier,

            tierClass:
                "factoryTierUnlocked"
        },

        delivery: {
            getLevel: () =>
                mobileDeliveryUpgradeIndex,

            setLevel: (level) => {
                mobileDeliveryUpgradeIndex = level;
                recalculateAutomaticProduction();
            },

            maxLevel:
                DELIVERY_MAX_LEVEL,

            getUpgradeData:
                getDeliveryUpgradeData,

            getElements:
                getDeliveryTruckElements,

            getTier: (level) =>
                getCurrentUpgradeMilestone(
                    level,
                    DELIVERY_TIER_MILESTONES
                ).tier,

            tierClass:
                "scalableTierUnlocked"
        },

        preWorkout: {
            getLevel: () =>
                mobilePreWorkoutUpgradeIndex,

            setLevel: (level) => {
                mobilePreWorkoutUpgradeIndex = level;
                recalculateAutomaticProduction();
            },

            maxLevel:
                PREWORKOUT_MAX_LEVEL,

            getUpgradeData:
                getPreWorkoutUpgradeData,

            getElements:
                getPreWorkoutElements,

            getTier: (level) =>
                getCurrentUpgradeMilestone(
                    level,
                    PREWORKOUT_TIER_MILESTONES
                ).tier,

            tierClass:
                "scalableTierUnlocked"
        },

        luckyShot: {
            getLevel: () =>
                mobileLuckyShotUpgradeIndex,

            setLevel: (level) => {
                mobileLuckyShotUpgradeIndex = level;

                const luckyValues =
                    calculateLuckyShotValuesFromLevel(
                        level
                    );

                mobileLuckyShotChance =
                    luckyValues.chance;

                mobileLuckyShotBonusMultiplier =
                    luckyValues.bonusMultiplier;
            },

            maxLevel:
                LUCKY_SHOT_MAX_LEVEL,

            getUpgradeData:
                getLuckyShotUpgradeData,

            getElements:
                getLuckyShotElements,

            getTier: (level) =>
                getCurrentUpgradeMilestone(
                    level,
                    LUCKY_SHOT_TIER_MILESTONES
                ).tier,

            tierClass:
                "scalableTierUnlocked"
        },

        kinetic: {
            getLevel: () =>
                mobileKineticUpgradeIndex,

            setLevel: (level) => {
                mobileKineticUpgradeIndex = level;

                const kineticValues =
                    calculateKineticValuesFromLevel(
                        level
                    );

                mobileKineticChance =
                    kineticValues.chance;

                mobileKineticMultiplier =
                    kineticValues.multiplier;

                mobileKineticDuration =
                    kineticValues.duration;
            },

            maxLevel:
                KINETIC_MAX_LEVEL,

            getUpgradeData:
                getKineticUpgradeData,

            getElements:
                getKineticOverflowElements,

            getTier: (level) =>
                getCurrentUpgradeMilestone(
                    level,
                    KINETIC_TIER_MILESTONES
                ).tier,

            tierClass:
                "scalableTierUnlocked"
        },

        supplyDrop: {
            getLevel: () =>
                mobileSupplyDropUpgradeIndex,

            setLevel: (level) => {
                const wasLocked =
                    mobileSupplyDropUpgradeIndex <= 0;

                mobileSupplyDropUpgradeIndex = level;

                refreshSupplyDropScheduleAfterUpgrade(
                    wasLocked
                );
            },

            maxLevel:
                SUPPLY_DROP_MAX_LEVEL,

            getUpgradeData:
                getSupplyDropUpgradeData,

            getElements:
                getSupplyDropUpgradeElements,

            getTier: (level) =>
                getCurrentUpgradeMilestone(
                    level,
                    SUPPLY_DROP_TIER_MILESTONES
                ).tier,

            tierClass:
                "scalableTierUnlocked"
        }
    };

    return configurations[upgradeKey] || null;
}


// -------------------------------------------------
// RECALCULATE BASE AUTOMATIC PRODUCTION
// -------------------------------------------------

function recalculateAutomaticProduction() {
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
}


// -------------------------------------------------
// CALCULATE A BULK PURCHASE PLAN
// -------------------------------------------------

function getBulkUpgradePurchasePlan(
    configuration,
    calculateMaximumAffordable = false
) {
    if (!configuration) {
        return {
            count: 0,
            totalCost: 0,
            affordable: false
        };
    }

    const currentLevel =
        configuration.getLevel();

    const levelsRemaining =
        Math.max(
            0,
            configuration.maxLevel -
            currentLevel
        );

    if (levelsRemaining <= 0) {
        return {
            count: 0,
            totalCost: 0,
            affordable: false
        };
    }

    const usingMaxMode =
        mobileUpgradeBuyMode === "max";

    let requestedCount;

    if (usingMaxMode) {
        requestedCount = levelsRemaining;
    } else {
        requestedCount = Math.min(
            Number(mobileUpgradeBuyMode) || 1,
            levelsRemaining
        );
    }

    let totalCost = 0;
    let count = 0;

    for (
        let offset = 0;
        offset < requestedCount;
        offset++
    ) {
        const upgradeData =
            configuration.getUpgradeData(
                currentLevel + offset
            );

        if (!upgradeData) {
            break;
        }

        const nextTotalCost =
            totalCost + upgradeData.cost;

        if (
            usingMaxMode &&
            calculateMaximumAffordable &&
            nextTotalCost > mobileEnergy
        ) {
            break;
        }

        totalCost = nextTotalCost;
        count++;
    }

    if (
        usingMaxMode &&
        !calculateMaximumAffordable
    ) {
        return {
            count: levelsRemaining,
            totalCost: 0,
            affordable: true
        };
    }

    return {
        count,
        totalCost,
        affordable:
            count > 0 &&
            mobileEnergy >= totalCost
    };
}


// -------------------------------------------------
// UPDATE THE BULK PURCHASE SELECTOR
// -------------------------------------------------

function updateUpgradeBuyModeButtons() {
    const modeButtons =
        document.querySelectorAll(
            ".upgradeBuyModeButton"
        );

    modeButtons.forEach((button) => {
        const buttonMode =
            button.dataset.buyMode;

        const selected =
            buttonMode ===
            mobileUpgradeBuyMode;

        button.classList.toggle(
            "active",
            selected
        );

        button.setAttribute(
            "aria-pressed",
            String(selected)
        );
    });
}


// -------------------------------------------------
// CONNECT BULK PURCHASE SELECTOR BUTTONS
// -------------------------------------------------

function attachUpgradeBuyModeButtons() {
    const modeButtons =
        document.querySelectorAll(
            ".upgradeBuyModeButton"
        );

    modeButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const selectedMode =
                    button.dataset.buyMode;

                if (
                    !VALID_UPGRADE_BUY_MODES.includes(
                        selectedMode
                    )
                ) {
                    return;
                }

                mobileUpgradeBuyMode =
                    selectedMode;

                updateUpgradeBuyModeButtons();
                updateAllBulkPurchaseCardControls();
            }
        );
    });

    updateUpgradeBuyModeButtons();
}


// -------------------------------------------------
// UPDATE ONE CARD FOR THE SELECTED BUY AMOUNT
// -------------------------------------------------

function updateBulkPurchaseCardControls(
    upgradeKey
) {
    const configuration =
        getBulkUpgradeConfig(
            upgradeKey
        );

    if (!configuration) {
        return;
    }

    const elements =
        configuration.getElements();

    if (
        !elements ||
        !elements.card ||
        !elements.buyButton ||
        !elements.cost
    ) {
        return;
    }

    const currentLevel =
        configuration.getLevel();

    if (
        currentLevel >=
        configuration.maxLevel
    ) {
        elements.card.classList.remove(
            "cannotAfford"
        );

        return;
    }

    if (mobileUpgradeBuyMode === "max") {
        const maxPlan =
            getBulkUpgradePurchasePlan(
                configuration,
                true
            );

        elements.cost.textContent =
            "AS MANY AS POSSIBLE";

        elements.buyButton.textContent =
            "BUY MAX";

        elements.card.classList.toggle(
            "cannotAfford",
            !maxPlan.affordable ||
            maxPlan.count <= 0
        );

        return;
    }

    const plan =
        getBulkUpgradePurchasePlan(
            configuration
        );

    if (plan.count <= 0) {
        elements.card.classList.remove(
            "cannotAfford"
        );

        return;
    }

    elements.card.classList.toggle(
        "cannotAfford",
        !plan.affordable
    );

    if (plan.count === 1) {
        elements.cost.textContent =
            formatGameNumber(
                plan.totalCost
            );

        elements.buyButton.textContent =
            upgradeKey === "supplyDrop" &&
            currentLevel === 0
                ? "UNLOCK"
                : "BUY";

        return;
    }

    elements.cost.textContent =
        `${plan.count} LVLS • ${formatGameNumber(
            plan.totalCost
        )}`;

    elements.buyButton.textContent =
        `BUY ×${plan.count}`;
}

// -------------------------------------------------
// UPDATE ALL VISIBLE BULK PURCHASE CONTROLS
// -------------------------------------------------

function updateAllBulkPurchaseCardControls() {
    [
        "drink",
        "factory",
        "delivery",
        "preWorkout",
        "luckyShot",
        "kinetic",
        "supplyDrop"
    ].forEach(
        updateBulkPurchaseCardControls
    );
}


// -------------------------------------------------
// PERFORM A BULK UPGRADE PURCHASE
// -------------------------------------------------

function performBulkUpgradePurchase(
    upgradeKey
) {
    const configuration =
        getBulkUpgradeConfig(
            upgradeKey
        );

    if (!configuration) {
        return;
    }

    const currentLevel =
        configuration.getLevel();

    if (
        currentLevel >=
        configuration.maxLevel
    ) {
        return;
    }

    const elements =
        configuration.getElements();

    if (!elements || !elements.card) {
        return;
    }

    const calculateMaximumAffordable =
        mobileUpgradeBuyMode === "max";

    const plan =
        getBulkUpgradePurchasePlan(
            configuration,
            calculateMaximumAffordable
        );

    if (
        plan.count <= 0 ||
        !plan.affordable
    ) {
        showPurchaseFailure(
            elements.card
        );

        return;
    }

    const previousTier =
        configuration.getTier(
            currentLevel
        );

    mobileEnergy -=
        plan.totalCost;

    const newLevel =
        currentLevel + plan.count;

    configuration.setLevel(
        newLevel
    );

    playUISound("purchase");

    const newTier =
        configuration.getTier(
            newLevel
        );

    updateShopBalance();
    saveGame();

    elements.card.classList.remove(
        "purchaseSuccess",
        "canTierUnlocked",
        "factoryTierUnlocked",
        "scalableTierUnlocked",
        "bulkPurchaseSuccess"
    );

    delete elements.card.dataset.bulkBought;

    void elements.card.offsetWidth;

    if (newTier > previousTier) {
        elements.card.classList.add(
            configuration.tierClass
        );
    } else {
        elements.card.classList.add(
            "purchaseSuccess"
        );
    }

    if (plan.count > 1) {
        elements.card.dataset.bulkBought =
            String(plan.count);

        elements.card.classList.add(
            "bulkPurchaseSuccess"
        );
    }

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess",
            "canTierUnlocked",
            "factoryTierUnlocked",
            "scalableTierUnlocked",
            "bulkPurchaseSuccess"
        );

        delete elements.card.dataset.bulkBought;
    }, 800);
}


// -------------------------------------------------
// LIVE SHOP AFFORDABILITY
// -------------------------------------------------

/*
    Expensive cards are visually dimmed while still
    remaining clickable. Clicking one still shows the
    normal NOT ENOUGH ENERGY feedback.
*/
function updateCosmeticAffordabilityStates() {
    document
        .querySelectorAll(
            ".skinActionButton[data-skin-index]"
        )
        .forEach((button) => {
            const rawIndex =
                button.dataset.skinIndex;

            if (rawIndex === "default") {
                return;
            }

            const index = Number(rawIndex);
            const skin =
                COSMETIC_UPGRADES[index];

            const card =
                document.getElementById(
                    `skinCard-${index}`
                );

            if (!skin || !card) {
                return;
            }

            const owned =
                Boolean(
                    mobileOwnedSkins[index]
                );

            card.classList.toggle(
                "cannotAfford",
                !owned &&
                mobileEnergy < skin.cost
            );
        });

    document
        .querySelectorAll(
            ".colorActionButton[data-color-index]"
        )
        .forEach((button) => {
            const rawIndex =
                button.dataset.colorIndex;

            if (rawIndex === "default") {
                return;
            }

            const index = Number(rawIndex);
            const color =
                CHANGECOLOR_UPGRADES[index];

            const card =
                document.getElementById(
                    `colorCard-${index}`
                );

            if (!color || !card) {
                return;
            }

            const owned =
                Boolean(
                    mobileOwnedColors[index]
                );

            card.classList.toggle(
                "cannotAfford",
                !owned &&
                mobileEnergy < color.cost
            );
        });
}


// -------------------------------------------------
// CARTOON HOME SCORE RENDERING
// -------------------------------------------------

/*
    The main score is split into individual characters so the
    rainbow can move like a cartoon wave instead of simply
    sliding left and right across one flat line of text.

    When the formatted score stays the same length, the existing
    spans are reused so rapid tapping does not constantly restart
    the animation.
*/
function renderHomeScore(formattedEnergy) {
    if (!mobileScoreDisplay) {
        return;
    }

    const characters =
        Array.from(String(formattedEnergy));

    const existingCharacters =
        Array.from(
            mobileScoreDisplay.querySelectorAll(
                ".scoreWaveChar"
            )
        );

    if (existingCharacters.length !== characters.length) {
        mobileScoreDisplay.replaceChildren();

        characters.forEach((character, index) => {
            const characterSpan =
                document.createElement("span");

            characterSpan.className =
                "scoreWaveChar";

            characterSpan.textContent = character;

            characterSpan.style.setProperty(
                "--score-wave-index",
                String(index)
            );

            mobileScoreDisplay.appendChild(
                characterSpan
            );
        });
    } else {
        existingCharacters.forEach(
            (characterSpan, index) => {
                characterSpan.textContent =
                    characters[index];
            }
        );
    }

    mobileScoreDisplay.setAttribute(
        "aria-label",
        formattedEnergy
    );
}


// -------------------------------------------------
// BEGINNER TAP HINT / HOME STATUS SLOT
// -------------------------------------------------

/*
    The tutorial hint disappears permanently for the save after
    the player's first 10 taps. Kinetic Overflow temporarily uses
    the same small status area at the bottom of the tapping zone.
*/
function updateHomeStatusSlot() {
    if (!homeTapHint) {
        return;
    }

    const showBeginnerHint =
        mobileTotalTaps < 10 &&
        !mobileKineticActive;

    homeTapHint.classList.toggle(
        "hiddenAfterIntro",
        !showBeginnerHint
    );
}


// -------------------------------------------------
// SHOP BALANCE
// -------------------------------------------------
function updateShopBalance() {
    /*
        Achievement and Life Challenge rewards can add
        current energy. Check them before drawing the
        score so the new balance appears immediately.
    */
    checkForNewAchievements();
    checkForCompletedLifeChallenges();

    const formattedEnergy =
        formatGameNumber(mobileEnergy);

    renderHomeScore(
        formattedEnergy
    );

    if (mobileLifeBadgeDisplay) {
        mobileLifeBadgeDisplay.textContent =
            `LIFE ${mobileLifeLevel}`;
    }

    updateHomeStatusSlot();

    shopBalanceAmount.textContent =
        formattedEnergy;

    updateScoreColor();

    mobilePerTapDisplay.textContent =
        formatProductionNumber(
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
            formatProductionNumber(
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
    updateSupplyDropUpgradeCard();

    updateAllBulkPurchaseCardControls();
    updateCosmeticAffordabilityStates();

    updateStatsDisplay();
    updateRebirthDynamicDisplays();
    updateLifeChallengeDisplays();
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

    const cost = Math.max(
        1,
        Math.floor(
            calculateBandedProgressionValue(
                DRINK_POWER_BASE_COST,
                currentLevel,
                MAIN_COST_GROWTH_BANDS
            )
        )
    );

    const gain = Math.max(
        1,
        Math.round(
            calculateBandedProgressionValue(
                DRINK_POWER_BASE_GAIN,
                currentLevel,
                TAP_GAIN_GROWTH_BANDS
            )
        )
    );

    return {
        level: currentLevel + 1,
        cost,
        gain
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

    return {
        level: currentLevel + 1,
        cost: Math.max(
            1,
            Math.floor(
                calculateBandedProgressionValue(
                    FACTORY_BASE_COST,
                    currentLevel,
                    MAIN_COST_GROWTH_BANDS
                )
            )
        ),
        gain: Math.max(
            1,
            Math.round(
                calculateBandedProgressionValue(
                    FACTORY_BASE_GAIN,
                    currentLevel,
                    PASSIVE_GAIN_GROWTH_BANDS
                )
            )
        )
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
    return (
        milestone?.image ||
        "assets/upgrades/factory/tier-1.png"
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
    performBulkUpgradePurchase(
        "factory"
    );
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
    fallbackImage
) {
    return (
        milestone?.image ||
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

    return {
        level: currentLevel + 1,
        cost: Math.max(
            1,
            Math.floor(
                calculateBandedProgressionValue(
                    DELIVERY_BASE_COST,
                    currentLevel,
                    MAIN_COST_GROWTH_BANDS
                )
            )
        ),
        gain: Math.max(
            1,
            Math.round(
                calculateBandedProgressionValue(
                    DELIVERY_BASE_GAIN,
                    currentLevel,
                    PASSIVE_GAIN_GROWTH_BANDS
                )
            )
        )
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
            "assets/upgrades/delivery-truck/tier-1.png"
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
    performBulkUpgradePurchase(
        "delivery"
    );
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

    return {
        level: currentLevel + 1,
        cost: Math.max(
            1,
            Math.floor(
                calculateBandedProgressionValue(
                    PREWORKOUT_BASE_COST,
                    currentLevel,
                    MAIN_COST_GROWTH_BANDS
                )
            )
        ),
        gain: Math.max(
            1,
            Math.round(
                calculateBandedProgressionValue(
                    PREWORKOUT_BASE_GAIN,
                    currentLevel,
                    PASSIVE_GAIN_GROWTH_BANDS
                )
            )
        )
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
            "assets/upgrades/preworkout/tier-1.png"
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
    performBulkUpgradePurchase(
        "preWorkout"
    );
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

        currentChance:
            document.getElementById(
                "luckyShotCurrentChance"
            ),

        currentReward:
            document.getElementById(
                "luckyShotCurrentReward"
            ),

        nextSummary:
            document.getElementById(
                "luckyShotNextLevelSummary"
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

    const currentValues =
        calculateLuckyShotValuesFromLevel(
            currentLevel
        );

    const nextValues =
        calculateLuckyShotValuesFromLevel(
            currentLevel + 1
        );

    return {
        level: currentLevel + 1,
        cost: Math.max(
            1,
            Math.floor(
                calculateBandedProgressionValue(
                    LUCKY_SHOT_BASE_COST,
                    currentLevel,
                    SPECIAL_COST_GROWTH_BANDS
                )
            )
        ),
        chanceIncrease: Math.max(
            0,
            nextValues.chance -
            currentValues.chance
        ),
        bonusIncrease: Math.max(
            0,
            nextValues.bonusMultiplier -
            currentValues.bonusMultiplier
        )
    };
}



// -------------------------------------------------
// CALCULATE LUCKY SHOT VALUES FROM ITS LEVEL
// -------------------------------------------------

function calculateLuckyShotValuesFromLevel(
    level
) {
    const safeLevel = Math.min(
        Math.max(
            Math.floor(level),
            0
        ),
        LUCKY_SHOT_MAX_LEVEL
    );

    if (safeLevel <= 0) {
        return {
            chance: 0,
            bonusMultiplier:
                LUCKY_SHOT_BASE_BONUS
        };
    }

    return {
        chance: Math.min(
            LUCKY_SHOT_MAX_CHANCE,
            LUCKY_SHOT_BASE_CHANCE +
            LUCKY_SHOT_CHANCE_PER_LEVEL *
            (safeLevel - 1)
        ),
        bonusMultiplier: Math.min(
            LUCKY_SHOT_MAX_BONUS,
            LUCKY_SHOT_BASE_BONUS +
            LUCKY_SHOT_BONUS_PER_LEVEL *
            (safeLevel - 1)
        )
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
        currentMilestone.image ||
        "assets/upgrades/luckyshot/tier-1.png";

    elements.name.textContent =
        "LUCKY SHOT";

    elements.level.textContent =
        `LEVEL ${mobileLuckyShotUpgradeIndex} • LUCK TIER ${currentMilestone.tier}`;

    elements.description.textContent =
        "Chance to trigger bonus Energy when you tap. The payout scales with your current Energy.";

    const currentChance =
        getCurrentLuckyShotChance();

    const currentReward =
        getCurrentLuckyShotBonusMultiplier();

    if (elements.currentChance) {
        elements.currentChance.textContent =
            formatSpecialUpgradePercent(
                currentChance
            );
    }

    if (elements.currentReward) {
        elements.currentReward.textContent =
            formatSpecialUpgradePercent(
                currentReward
            );
    }

    if (
        mobileLuckyShotUpgradeIndex >=
        LUCKY_SHOT_MAX_LEVEL
    ) {
        if (elements.nextSummary) {
            elements.nextSummary.textContent =
                `MAXED • ${formatSpecialUpgradePercent(
                    currentChance
                )} chance • ${formatSpecialUpgradePercent(
                    currentReward
                )} reward`;
        }

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

    const nextValues =
        calculateLuckyShotValuesFromLevel(
            mobileLuckyShotUpgradeIndex + 1
        );

    if (elements.nextSummary) {
        const prefix =
            mobileLuckyShotUpgradeIndex === 0
                ? "FIRST LEVEL"
                : "NEXT LEVEL";

        elements.nextSummary.textContent =
            `${prefix} → ${formatSpecialUpgradePercent(
                nextValues.chance
            )} chance • ${formatSpecialUpgradePercent(
                nextValues.bonusMultiplier
            )} reward`;
    }

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
    performBulkUpgradePurchase(
        "luckyShot"
    );
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

    mobileCurrentLifeEnergyProduced +=
        luckyShotBonus;

    mobileLuckyShotsActivated++;
    mobileCurrentLifeLuckyActivations++;

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

        currentChance:
            document.getElementById(
                "kineticCurrentChance"
            ),

        currentPower:
            document.getElementById(
                "kineticCurrentPower"
            ),

        currentDuration:
            document.getElementById(
                "kineticCurrentDuration"
            ),

        nextSummary:
            document.getElementById(
                "kineticNextLevelSummary"
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

    const nextLevel = currentLevel + 1;

    return {
        level: nextLevel,
        cost: Math.max(
            1,
            Math.floor(
                calculateBandedProgressionValue(
                    KINETIC_BASE_COST,
                    currentLevel,
                    SPECIAL_COST_GROWTH_BANDS
                )
            )
        ),
        chance: Math.min(
            KINETIC_MAX_CHANCE,
            KINETIC_BASE_CHANCE +
            KINETIC_CHANCE_PER_LEVEL *
            (nextLevel - 1)
        ),
        multiplier: Number(
            Math.min(
                KINETIC_MAX_MULTIPLIER,
                KINETIC_BASE_MULTIPLIER +
                KINETIC_MULTIPLIER_PER_LEVEL *
                (nextLevel - 1)
            ).toFixed(3)
        ),
        duration: Number(
            Math.min(
                KINETIC_MAX_DURATION,
                KINETIC_BASE_DURATION +
                KINETIC_DURATION_PER_LEVEL *
                (nextLevel - 1)
            ).toFixed(3)
        )
    };
}



// -------------------------------------------------
// CALCULATE KINETIC VALUES FROM ITS LEVEL
// -------------------------------------------------

function calculateKineticValuesFromLevel(level) {
    const safeLevel = Math.min(
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
            duration:
                currentUpgrade.duration
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
            "assets/upgrades/kinetic-overflow/tier-1.png"
        );

    elements.name.textContent =
        "KINETIC OVERFLOW";

    elements.level.textContent =
        `LEVEL ${mobileKineticUpgradeIndex} • OVERFLOW TIER ${currentMilestone.tier}`;

    elements.description.textContent =
        "Chance to trigger a short boost that multiplies every tap for a few seconds.";

    const currentChance =
        getCurrentKineticChance();

    const currentPower =
        getCurrentKineticMultiplier();

    const currentDuration =
        mobileKineticDuration;

    if (elements.currentChance) {
        elements.currentChance.textContent =
            formatSpecialUpgradePercent(
                currentChance
            );
    }

    if (elements.currentPower) {
        elements.currentPower.textContent =
            `×${formatSpecialUpgradeNumber(
                currentPower,
                2
            )}`;
    }

    if (elements.currentDuration) {
        elements.currentDuration.textContent =
            `${formatSpecialUpgradeNumber(
                currentDuration,
                2
            )}s`;
    }

    if (
        mobileKineticUpgradeIndex >=
        KINETIC_MAX_LEVEL
    ) {
        if (elements.nextSummary) {
            elements.nextSummary.textContent =
                `MAXED • ${formatSpecialUpgradePercent(
                    currentChance
                )} chance • ×${formatSpecialUpgradeNumber(
                    currentPower,
                    2
                )} power • ${formatSpecialUpgradeNumber(
                    currentDuration,
                    2
                )}s`;
        }

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

    if (elements.nextSummary) {
        const prefix =
            mobileKineticUpgradeIndex === 0
                ? "FIRST LEVEL"
                : "NEXT LEVEL";

        elements.nextSummary.textContent =
            `${prefix} → ${formatSpecialUpgradePercent(
                nextUpgrade.chance
            )} chance • ×${formatSpecialUpgradeNumber(
                nextUpgrade.multiplier,
                2
            )} power • ${formatSpecialUpgradeNumber(
                nextUpgrade.duration,
                2
            )}s`;
    }

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
    performBulkUpgradePurchase(
        "kinetic"
    );
}

// -------------------------------------------------
// SUPPLY DROP UPGRADE CARD
// -------------------------------------------------

function getSupplyDropUpgradeElements() {
    return {
        card:
            document.getElementById(
                "supplyDropUpgradeCard"
            ),

        image:
            document.getElementById(
                "supplyDropUpgradeImage"
            ),

        name:
            document.getElementById(
                "supplyDropUpgradeName"
            ),

        level:
            document.getElementById(
                "supplyDropUpgradeLevel"
            ),

        description:
            document.getElementById(
                "supplyDropUpgradeDescription"
            ),

        frequency:
            document.getElementById(
                "supplyDropCurrentFrequency"
            ),

        reward:
            document.getElementById(
                "supplyDropCurrentReward"
            ),

        progressText:
            document.getElementById(
                "supplyDropTierProgressText"
            ),

        progressFill:
            document.getElementById(
                "supplyDropTierProgressFill"
            ),

        cost:
            document.getElementById(
                "supplyDropUpgradeCost"
            ),

        buyButton:
            document.getElementById(
                "supplyDropUpgradeBuyButton"
            )
    };
}


function getSupplyDropUpgradeData(currentLevel) {
    if (
        !Number.isInteger(currentLevel) ||
        currentLevel < 0 ||
        currentLevel >= SUPPLY_DROP_MAX_LEVEL
    ) {
        return null;
    }

    return {
        level: currentLevel + 1,
        cost: Math.max(
            1,
            Math.floor(
                calculateBandedProgressionValue(
                    SUPPLY_DROP_BASE_COST,
                    currentLevel,
                    SPECIAL_COST_GROWTH_BANDS
                )
            )
        )
    };
}


function calculateSupplyDropValuesFromLevel(level) {
    const safeLevel = Math.min(
        Math.max(
            Math.floor(level),
            0
        ),
        SUPPLY_DROP_MAX_LEVEL
    );

    if (safeLevel <= 0) {
        return {
            unlocked: false,
            minimumDelaySeconds: 0,
            maximumDelaySeconds: 0,
            rewardMultiplier: 0
        };
    }

    const progressionLevel =
        safeLevel - 1;

    /*
        Frequency improves gradually, but has a floor
        so Supply Drops never turn into nonstop spam.
    */
    const minimumDelaySeconds = Math.max(
        30,
        78 * Math.pow(0.985, progressionLevel)
    );

    const maximumDelaySeconds = Math.max(
        48,
        118 * Math.pow(0.985, progressionLevel)
    );

    /*
        Rewards grow slowly and cap at 3×. The base
        reward itself is tied to production power, not
        the player's bank balance.
    */
    const rewardMultiplier = Math.min(
        3,
        1 + progressionLevel * 0.015
    );

    return {
        unlocked: true,
        minimumDelaySeconds,
        maximumDelaySeconds,
        rewardMultiplier
    };
}


function formatSupplyDropFrequency(values) {
    if (!values?.unlocked) {
        return "LOCKED";
    }

    return `${Math.round(
        values.minimumDelaySeconds
    )}–${Math.round(
        values.maximumDelaySeconds
    )}s`;
}


function updateSupplyDropUpgradeCard() {
    const elements =
        getSupplyDropUpgradeElements();

    if (!elements.card) {
        return;
    }

    const currentMilestone =
        getCurrentUpgradeMilestone(
            mobileSupplyDropUpgradeIndex,
            SUPPLY_DROP_TIER_MILESTONES
        );

    const nextMilestone =
        getNextUpgradeMilestone(
            mobileSupplyDropUpgradeIndex,
            SUPPLY_DROP_TIER_MILESTONES
        );

    const currentValues =
        calculateSupplyDropValuesFromLevel(
            mobileSupplyDropUpgradeIndex
        );

    elements.image.src =
        getUpgradeMilestoneImage(
            currentMilestone,
            "assets/upgrades/supply-drop/tier-1.png"
        );

    elements.name.textContent =
        "SUPPLY DROP";

    elements.level.textContent =
        `LEVEL ${mobileSupplyDropUpgradeIndex} • DROP TIER ${currentMilestone.tier}`;

    if (!currentValues.unlocked) {
        elements.description.textContent =
            "Buy Level 1 to unlock falling Supply Drops. Tap them before they leave the screen for bonus Energy.";

        elements.frequency.textContent =
            "UNLOCK L1";

        elements.reward.textContent =
            "UNLOCK L1";
    } else {
        elements.description.textContent =
            "Supply Drops fall during active play. Higher levels make them appear more often and increase the reward.";

        elements.frequency.textContent =
            formatSupplyDropFrequency(
                currentValues
            );

        elements.reward.textContent =
            `×${formatSpecialUpgradeNumber(
                currentValues.rewardMultiplier,
                2
            )}`;
    }

    if (elements.progressText) {
        elements.progressText.textContent =
            nextMilestone
                ? `NEXT DROP TIER AT LEVEL ${nextMilestone.level}`
                : "HIGHEST CURRENT DROP TIER";
    }

    if (elements.progressFill) {
        elements.progressFill.style.width =
            `${getUpgradeMilestoneProgress(
                mobileSupplyDropUpgradeIndex,
                SUPPLY_DROP_TIER_MILESTONES
            )}%`;
    }

    if (
        mobileSupplyDropUpgradeIndex >=
        SUPPLY_DROP_MAX_LEVEL
    ) {
        elements.cost.textContent = "MAX";
        elements.buyButton.textContent = "MAXED";
        elements.buyButton.disabled = true;
        return;
    }

    const nextUpgrade =
        getSupplyDropUpgradeData(
            mobileSupplyDropUpgradeIndex
        );

    if (!nextUpgrade) {
        elements.buyButton.disabled = true;
        return;
    }

    elements.cost.textContent =
        formatGameNumber(
            nextUpgrade.cost
        );

    elements.buyButton.textContent =
        mobileSupplyDropUpgradeIndex === 0
            ? "UNLOCK"
            : "BUY";

    elements.buyButton.disabled = false;
}


function buySupplyDropUpgrade() {
    performBulkUpgradePurchase(
        "supplyDrop"
    );
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

    /*
        Use a real end timestamp instead of repeatedly
        subtracting 1 from a decimal duration. Repeated
        floating-point subtraction was what caused tiny
        values such as 0.000000000000001s to briefly show.
    */
    kineticOverflowEndTime =
        performance.now() +
        mobileKineticDuration * 1000;

    mobileKineticTimeLeft =
        mobileKineticDuration;

    mobileKineticActivations++;
    mobileCurrentLifeKineticActivations++;

    updateKineticStatus();
    updateShopBalance();

    if (kineticCountdownInterval) {
        clearInterval(
            kineticCountdownInterval
        );
    }

    /*
        Refresh often enough that short fractional
        durations still look smooth on a phone.
    */
    kineticCountdownInterval =
        setInterval(() => {
            updateKineticStatus();
        }, 100);
}


// -------------------------------------------------
// UPDATE KINETIC COUNTDOWN MESSAGE
// -------------------------------------------------

function updateKineticStatus() {
    if (!mobileKineticActive) {
        return;
    }

    const remainingMilliseconds =
        kineticOverflowEndTime -
        performance.now();

    if (remainingMilliseconds <= 0) {
        stopKineticOverflow();
        return;
    }

    mobileKineticTimeLeft =
        remainingMilliseconds / 1000;

    /*
        One decimal place is enough feedback for the
        player and completely avoids floating-point
        garbage at the end of the countdown.
    */
    const displayedSeconds =
        Math.max(
            0.1,
            Math.ceil(
                mobileKineticTimeLeft * 10
            ) / 10
        );

    kineticStatus.textContent =
        `⚡ KINETIC ×${Number(
            getCurrentKineticMultiplier()
                .toFixed(2)
        )} • ${displayedSeconds.toFixed(1)}s`;

    kineticStatus.classList.add(
        "active"
    );

    updateHomeStatusSlot();
}


// -------------------------------------------------
// STOP KINETIC OVERFLOW
// -------------------------------------------------

function stopKineticOverflow() {
    mobileKineticActive = false;
    mobileKineticTimeLeft = 0;
    kineticOverflowEndTime = 0;

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
                        src="${skin.img}"
                        alt="Can skin ${index + 1}"
                    >

                    <div class="upgradeCardInformation">

                        <h3 class="upgradeCardName">
                            ${skin.name}
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
                playUISound("equip");

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

            const skinWasOwned =
                Boolean(mobileOwnedSkins[skinIndex]);

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
                skin.img;

            playUISound(
                skinWasOwned ? "equip" : "purchase"
            );

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

    const defaultColorCard = `
        <article
            class="upgradeCard colorCard colorOptionCard"
            id="defaultColorCard"
        >
            <div class="colorShopSwatch colorShopSwatchRainbow">
                <span>RGB</span>
            </div>

            <div class="colorShopInformation">
                <h3>ORIGINAL RAINBOW</h3>
                <p>Animated candy-rainbow main score.</p>
            </div>

            <div class="colorShopAction">
                <span class="colorShopState">
                    ${defaultColorEquipped ? "ACTIVE" : "OWNED"}
                </span>

                <button
                    class="buyButton colorActionButton"
                    type="button"
                    data-color-index="default"
                    ${defaultColorEquipped ? "disabled" : ""}
                >
                    ${defaultColorEquipped ? "ACTIVE" : "EQUIP"}
                </button>
            </div>
        </article>
    `;

    const purchasedColorCards =
        CHANGECOLOR_UPGRADES.map(
            (color, index) => {
                const colorOwned =
                    mobileOwnedColors[index];

                const colorEquipped =
                    mobileEquippedColorIndex === index;

                const colorName =
                    color.name
                        ? color.name.toUpperCase()
                        : `COLOR ${index + 1}`;

                let buttonText = "BUY";

                if (colorEquipped) {
                    buttonText = "ACTIVE";
                } else if (colorOwned) {
                    buttonText = "EQUIP";
                }

                const stateText =
                    colorEquipped
                        ? "ACTIVE"
                        : colorOwned
                            ? "OWNED"
                            : formatGameNumber(color.cost);

                return `
                    <article
                        class="upgradeCard colorCard colorOptionCard"
                        id="colorCard-${index}"
                    >
                        <div class="colorShopSwatch colorShopSwatch${index}"></div>

                        <div class="colorShopInformation">
                            <h3>${colorName}</h3>
                            <p>${color.description || "Changes your main Energy score effect."}</p>
                        </div>

                        <div class="colorShopAction">
                            <span class="colorShopState ${(!colorEquipped && !colorOwned) ? "colorShopPrice" : ""}">
                                ${stateText}
                            </span>

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
                    </article>
                `;
            }
        ).join("");

    return defaultColorCard + purchasedColorCards;
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
                playUISound("equip");

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

            const colorWasOwned =
                Boolean(mobileOwnedColors[colorIndex]);

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

            playUISound(
                colorWasOwned ? "equip" : "purchase"
            );

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


/*
    Special-upgrade cards sometimes change by less than
    0.01%. Keep enough precision to show real progress
    without filling the card with trailing zeroes.
*/
function formatSpecialUpgradePercent(decimalValue) {
    const percentage = decimalValue * 100;

    const decimalPlaces =
        Math.abs(percentage) < 0.1
            ? 3
            : 2;

    return `${Number(
        percentage.toFixed(decimalPlaces)
    )}%`;
}


function formatSpecialUpgradeNumber(value, decimals = 3) {
    return Number(
        Number(value).toFixed(decimals)
    );
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
                    PERMANENT BONUSES
                </h3>

                <div class="statsGrid">

                    <article class="statCard">
                        <span class="statIcon">💎</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                ALL PRODUCTION
                            </span>

                            <strong
                                class="statValue"
                                id="statAllProductionBonus"
                            >
                                +0%
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">👊</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                TAP BONUS
                            </span>

                            <strong
                                class="statValue"
                                id="statTapBonus"
                            >
                                +0%
                            </strong>
                        </div>
                    </article>

                    <article class="statCard">
                        <span class="statIcon">⚙️</span>

                        <div class="statInformation">
                            <span class="statLabel">
                                AUTO BONUS
                            </span>

                            <strong
                                class="statValue"
                                id="statAutoBonus"
                            >
                                +0%
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

function createMoreMenuContent() {
    const completedAchievements =
        getCompletedAchievementCount();

    const challenges =
        getLifeChallengeDefinitions();

    const completedChallenges =
        getCompletedLifeChallengeCount();

    const lastLifeText =
        mobileLastLifeSummary
            ? `Life ${mobileLastLifeSummary.lifeLevel} • ${formatGameTime(mobileLastLifeSummary.secondsPlayed)}`
            : "No completed Life yet";

    return `
        <section class="moreMenuScreen">

            <p class="moreMenuIntro">
                Progress, challenges, stats, and game settings.
            </p>

            <div class="moreMenuList">

                ${createMoreMenuButton(
                    "moreRebirthButton",
                    "♻️",
                    "REBIRTH",
                    `Life ${mobileLifeLevel} → Life ${mobileLifeLevel + 1}`
                )}

                ${createMoreMenuButton(
                    "morePermanentPerksButton",
                    "⭐",
                    "PERMANENT PERKS",
                    `${getUnlockedPermanentPerkCount()} unlocked • ${getTotalPermanentPerkRanks()} total ranks`
                )}

                ${createMoreMenuButton(
                    "moreLifeChallengesButton",
                    "🎯",
                    "LIFE CHALLENGES",
                    `${completedChallenges}/${challenges.length} complete this Life`
                )}

                ${createMoreMenuButton(
                    "moreAchievementsButton",
                    "🏆",
                    "ACHIEVEMENTS",
                    `${completedAchievements}/${PLAYER_ACHIEVEMENTS.length} completed`
                )}

                ${createMoreMenuButton(
                    "moreStatisticsButton",
                    "📊",
                    "STATISTICS",
                    "View your gameplay stats"
                )}

                ${createMoreMenuButton(
                    "moreLastLifeButton",
                    "📋",
                    "LAST LIFE",
                    lastLifeText
                )}

                ${createMoreMenuButton(
                    "moreSettingsButton",
                    "⚙️",
                    "SETTINGS",
                    "Sound, haptics, visuals & more"
                )}

                ${createMoreMenuButton(
                    "moreSaveManagementButton",
                    "💾",
                    "SAVE MANAGEMENT",
                    `Current save: Slot ${activeSaveSlot}`
                )}

            </div>
        </section>
    `;
}


function createMoreMenuButton(
    id,
    icon,
    title,
    description
) {
    return `
        <button
            class="moreMenuButton"
            id="${id}"
            type="button"
        >
            <span class="moreMenuIcon">${icon}</span>

            <span class="moreMenuButtonText">
                <strong>${title}</strong>
                <small>${description}</small>
            </span>

            <span class="moreMenuArrow">›</span>
        </button>
    `;
}


function renderStatsShop() {
    shopTitle.textContent = "MORE";
    shopList.innerHTML =
        createMoreMenuContent();

    attachMoreMenuButtons();
}


function attachMoreMenuButtons() {
    const connect = (id, handler) => {
        const button = document.getElementById(id);

        if (button) {
            button.addEventListener("click", handler);
        }
    };

    connect("moreRebirthButton", renderRebirthMenu);
    connect("morePermanentPerksButton", renderPermanentPerksMenu);
    connect("moreLifeChallengesButton", renderLifeChallengesMenu);
    connect("moreAchievementsButton", renderAchievementsMenu);
    connect("moreStatisticsButton", renderStatisticsMenu);
    connect("moreSettingsButton", renderSettingsMenu);
    connect("moreSaveManagementButton", renderSaveManagementMenu);

    connect(
        "moreLastLifeButton",
        () => {
            if (mobileLastLifeSummary) {
                renderLastLifeSummaryMenu();
            } else {
                renderEmptyLastLifeMenu();
            }
        }
    );
}


function createBackToMoreButton(id) {
    return `
        <button
            class="backToMoreButton"
            id="${id}"
            type="button"
        >
            ‹ BACK TO MORE
        </button>
    `;
}


function renderStatisticsMenu() {
    shopTitle.textContent = "STATISTICS";
    shopList.innerHTML =
        createStatsShopContent() +
        createBackToMoreButton("backFromStatisticsButton");

    updateStatsDisplay();

    document
        .getElementById("backFromStatisticsButton")
        ?.addEventListener("click", renderStatsShop);
}


function renderSaveManagementMenu() {
    shopTitle.textContent = "SAVE MANAGEMENT";
    shopList.innerHTML =
        createSaveManagementContent() +
        createBackToMoreButton("backFromSaveManagementButton");

    attachSaveManagementButtons();

    document
        .getElementById("backFromSaveManagementButton")
        ?.addEventListener("click", renderStatsShop);
}


function renderEmptyLastLifeMenu() {
    shopTitle.textContent = "LAST LIFE";
    shopList.innerHTML = `
        <section class="moreEmptyScreen">
            <span>📋</span>
            <h3>NO COMPLETED LIFE YET</h3>
            <p>
                Finish your first Rebirth and the completed
                run summary will appear here automatically.
            </p>
        </section>

        ${createBackToMoreButton("backFromEmptyLastLifeButton")}
    `;

    document
        .getElementById("backFromEmptyLastLifeButton")
        ?.addEventListener("click", renderStatsShop);
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
        formatProductionNumber(
            getCurrentTapPower()
        )
    );

    setStatValue(
        "statPerSecond",
        formatProductionNumber(
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
        "statAllProductionBonus",
        `+${formatPerkPercent(
            getPermanentPerkEffectTotal(
                "allProductionPercent"
            )
        )}`
    );

    setStatValue(
        "statTapBonus",
        `+${formatPerkPercent(
            getPermanentPerkEffectTotal(
                "tapProductionPercent"
            )
        )}`
    );

    setStatValue(
        "statAutoBonus",
        `+${formatPerkPercent(
            getPermanentPerkEffectTotal(
                "autoProductionPercent"
            )
        )}`
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
                    START NEW GAME
                </button>

            </article>
        `;
    }

    const savedEnergy =
        Number.isFinite(savedData.energy)
            ? savedData.energy
            : 0;

    const savedLifeLevel =
        Number.isFinite(
            savedData.lifeLevel
        )
            ? Math.max(
                0,
                Math.floor(
                    savedData.lifeLevel
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
                        LIFE LEVEL
                    </span>

                    <strong>
                        LIFE ${savedLifeLevel}
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
    cancelSupplyDrop();

    mobileEnergy = 0;
    mobileEnergyPerTap = 1;
    mobileEnergyPerSecond = 0;

    mobileDrinkUpgradeIndex = 0;
    mobileFactoryUpgradeIndex = 0;
    mobileDeliveryUpgradeIndex = 0;
    mobilePreWorkoutUpgradeIndex = 0;
    mobileLuckyShotUpgradeIndex = 0;
    mobileKineticUpgradeIndex = 0;
    mobileSupplyDropUpgradeIndex = 0;

    mobileLuckyShotChance = 0;
    mobileLuckyShotBonusMultiplier = LUCKY_SHOT_BASE_BONUS;

    mobileKineticChance = 0;
    mobileKineticMultiplier = 1;
    mobileKineticDuration = 0;

    mobileKineticActive = false;
    mobileKineticTimeLeft = 0;
    kineticOverflowEndTime = 0;

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
    mobileLastLifeSummary = null;

    resetCurrentLifeChallengeState();

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

    if (
        mobilePendingRebirthChoices.length === 0 &&
        mobileSupplyDropUpgradeIndex > 0
    ) {
        scheduleNextSupplyDrop(true);
    }

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
    if (!Array.isArray(savedAchievementIds)) {
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

    return {
        currentProgress,
        target,
        completed:
            currentProgress >= target,
        percentage:
            Math.min(
                100,
                (
                    currentProgress /
                    target
                ) * 100
            )
    };
}


// -------------------------------------------------
// TOTAL ACHIEVEMENT REWARD EARNED
// -------------------------------------------------

function getTotalAchievementRewardEarned() {
    return PLAYER_ACHIEVEMENTS.reduce(
        (total, achievement) => {
            if (
                !isAchievementUnlocked(
                    achievement.id
                )
            ) {
                return total;
            }

            return (
                total +
                Math.max(
                    0,
                    achievement.rewardEnergy || 0
                )
            );
        },
        0
    );
}


// -------------------------------------------------
// MIGRATE OLDER ACHIEVEMENT SAVES
// -------------------------------------------------

function migrateAchievementsToCurrentSystem(awardRewards = true) {
    mobileUnlockedAchievementIds = [];

    let migrationReward = 0;

    PLAYER_ACHIEVEMENTS.forEach(
        (achievement) => {
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

            migrationReward +=
                Math.max(
                    0,
                    achievement.rewardEnergy || 0
                );
        }
    );

    /*
        Older saves receive any newly-qualified
        rewards once, silently, when they migrate.
    */
    if (awardRewards) {
        mobileEnergy += migrationReward;
    }

    return awardRewards
        ? migrationReward
        : 0;
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

            /*
                Achievement rewards add current
                energy only. They intentionally do
                not increase lifetime energy.
            */
            mobileEnergy +=
                Math.max(
                    0,
                    achievement.rewardEnergy || 0
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

    saveGame();

    newlyUnlockedAchievements.forEach(
        (achievement) => {
            achievementNotificationQueue.push(
                achievement
            );
        }
    );

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

    playUISound("achievement");

    achievementToastTitle.textContent =
        achievement.name;

    achievementToastDescription.textContent =
        achievement.description;

    if (achievementToastReward) {
        achievementToastReward.textContent =
            `REWARD +${formatGameNumber(
                achievement.rewardEnergy || 0
            )} ENERGY`;
    }

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
        }, 2800);
}


// -------------------------------------------------
// COUNT COMPLETED ACHIEVEMENTS
// -------------------------------------------------

function getCompletedAchievementCount() {
    return PLAYER_ACHIEVEMENTS.filter(
        (achievement) =>
            isAchievementUnlocked(
                achievement.id
            )
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
                            completed •
                            ${formatGameNumber(
                                getTotalAchievementRewardEarned()
                            )}
                            reward energy earned
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
// CREATE ONE ACHIEVEMENT CARD
// -------------------------------------------------

function createAchievementCard(
    achievement
) {
    const progress =
        getAchievementProgress(
            achievement
        );

    const achievementUnlocked =
        isAchievementUnlocked(
            achievement.id
        );

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

                <div class="achievementRewardRow">
                    <span>REWARD</span>

                    <strong>
                        +${formatGameNumber(
                            achievement.rewardEnergy || 0
                        )}
                        ENERGY
                    </strong>
                </div>

            </div>

        </article>
    `;
}


// -------------------------------------------------
// CREATE THE ACHIEVEMENTS SCREEN
// -------------------------------------------------

function createAchievementsContent() {
    const completedCount =
        getCompletedAchievementCount();

    const categories = [
        ...new Set(
            PLAYER_ACHIEVEMENTS.map(
                (achievement) =>
                    achievement.category
            )
        )
    ];

    const categorySections =
        categories.map((category) => {
            const categoryAchievements =
                PLAYER_ACHIEVEMENTS.filter(
                    (achievement) =>
                        achievement.category ===
                        category
                );

            const completedInCategory =
                categoryAchievements.filter(
                    (achievement) =>
                        isAchievementUnlocked(
                            achievement.id
                        )
                ).length;

            const cards =
                categoryAchievements
                    .map(createAchievementCard)
                    .join("");

            return `
                <section class="achievementCategorySection">

                    <div class="achievementCategoryHeader">
                        <h3>${category}</h3>

                        <span>
                            ${completedInCategory}
                            /
                            ${categoryAchievements.length}
                        </span>
                    </div>

                    <div class="achievementsList">
                        ${cards}
                    </div>

                </section>
            `;
        }).join("");

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

                <div class="achievementRewardSummary">
                    <span>
                        REWARDS EARNED
                    </span>

                    <strong>
                        ${formatGameNumber(
                            getTotalAchievementRewardEarned()
                        )}
                    </strong>
                </div>

            </article>

            ${categorySections}

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
// PLAYER HUB: LAST LIFE SUMMARY
// -------------------------------------------------

function createLastLifeSummaryAccessContent() {
    if (!mobileLastLifeSummary) {
        return `
            <div class="statsSection lastLifeAccessSection">

                <h3 class="statsSectionTitle">
                    LAST LIFE
                </h3>

                <article class="lastLifeAccessCard empty">
                    <span class="lastLifeAccessIcon">📋</span>

                    <div>
                        <strong>NO COMPLETED LIFE YET</strong>
                        <p>
                            Your next Rebirth will automatically
                            save the completed Life's stats here.
                        </p>
                    </div>
                </article>

            </div>
        `;
    }

    return `
        <div class="statsSection lastLifeAccessSection">

            <h3 class="statsSectionTitle">
                LAST LIFE
            </h3>

            <article class="lastLifeAccessCard">

                <div class="lastLifeAccessHeader">
                    <span class="lastLifeAccessIcon">📋</span>

                    <div>
                        <strong>
                            LIFE ${mobileLastLifeSummary.lifeLevel}
                            COMPLETE
                        </strong>

                        <p>
                            ${formatGameTime(
                                mobileLastLifeSummary.secondsPlayed
                            )}
                            •
                            ${formatGameNumber(
                                mobileLastLifeSummary.energyProduced
                            )}
                            energy produced
                        </p>
                    </div>
                </div>

                <button
                    class="viewLastLifeButton"
                    id="viewLastLifeButton"
                    type="button"
                >
                    VIEW LAST LIFE STATS
                </button>

            </article>

        </div>
    `;
}


function attachLastLifeSummaryAccessButton() {
    const button =
        document.getElementById(
            "viewLastLifeButton"
        );

    if (button) {
        button.addEventListener(
            "click",
            renderLastLifeSummaryMenu
        );
    }
}


function renderLastLifeSummaryMenu() {
    if (!mobileLastLifeSummary) {
        return;
    }

    const summary =
        mobileLastLifeSummary;

    shopTitle.textContent =
        "LAST LIFE";

    shopList.innerHTML = `
        <section class="lastLifeSummaryScreen">

            <article class="lastLifeHeroCard">
                <span>🏁</span>

                <div>
                    <small>COMPLETED RUN</small>
                    <h3>
                        LIFE ${summary.lifeLevel}
                    </h3>
                    <p>
                        Rebirth reached in
                        ${formatGameTime(
                            summary.secondsPlayed
                        )}
                    </p>
                </div>
            </article>

            <div class="lastLifeSummaryGrid">

                ${createLastLifeSummaryStat(
                    "⚡",
                    "ENERGY PRODUCED",
                    formatGameNumber(
                        summary.energyProduced
                    )
                )}

                ${createLastLifeSummaryStat(
                    "👆",
                    "TAPS",
                    formatGameNumber(
                        summary.taps
                    )
                )}

                ${createLastLifeSummaryStat(
                    "💥",
                    "FINAL / TAP",
                    formatProductionNumber(
                        summary.finalPerTap
                    )
                )}

                ${createLastLifeSummaryStat(
                    "🏭",
                    "FINAL / SEC",
                    formatProductionNumber(
                        summary.finalPerSecond
                    )
                )}

                ${createLastLifeSummaryStat(
                    "🥤",
                    "DRINK POWER",
                    `LV ${summary.drinkLevel}`
                )}

                ${createLastLifeSummaryStat(
                    "🏗️",
                    "FACTORY",
                    `LV ${summary.factoryLevel}`
                )}

                ${createLastLifeSummaryStat(
                    "🚚",
                    "DELIVERY",
                    `LV ${summary.deliveryLevel}`
                )}

                ${createLastLifeSummaryStat(
                    "💪",
                    "PRE-WORKOUT",
                    `LV ${summary.preWorkoutLevel}`
                )}

                ${createLastLifeSummaryStat(
                    "🍀",
                    "LUCKY SHOT",
                    `LV ${summary.luckyShotLevel}`
                )}

                ${createLastLifeSummaryStat(
                    "🌩️",
                    "KINETIC",
                    `LV ${summary.kineticLevel}`
                )}

                ${createLastLifeSummaryStat(
                    "📦",
                    "SUPPLY DROP",
                    `LV ${summary.supplyDropLevel}`
                )}

                ${createLastLifeSummaryStat(
                    "🎯",
                    "LUCKY ACTIVATIONS",
                    formatGameNumber(
                        summary.luckyActivations
                    )
                )}

                ${createLastLifeSummaryStat(
                    "🔥",
                    "KINETIC ACTIVATIONS",
                    formatGameNumber(
                        summary.kineticActivations
                    )
                )}

            </div>

            <button
                class="backToHubButton"
                id="backFromLastLifeButton"
                type="button"
            >
                BACK TO PLAYER HUB
            </button>

        </section>
    `;

    document
        .getElementById(
            "backFromLastLifeButton"
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


function createLastLifeSummaryStat(
    icon,
    label,
    value
) {
    return `
        <article class="lastLifeSummaryStat">
            <span class="lastLifeSummaryStatIcon">
                ${icon}
            </span>

            <div>
                <span>${label}</span>
                <strong>${value}</strong>
            </div>
        </article>
    `;
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
                Your current energy and all seven gameplay
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
// CAPTURE THE COMPLETED LIFE
// -------------------------------------------------

function captureLastLifeSummary() {
    mobileLastLifeSummary = {
        lifeLevel:
            mobileLifeLevel,

        secondsPlayed:
            mobileCurrentLifeSecondsPlayed,

        energyProduced:
            mobileCurrentLifeEnergyProduced,

        taps:
            mobileCurrentLifeTaps,

        finalPerTap:
            getCurrentTapPower(),

        finalPerSecond:
            getCurrentEnergyPerSecond(),

        drinkLevel:
            mobileDrinkUpgradeIndex,

        factoryLevel:
            mobileFactoryUpgradeIndex,

        deliveryLevel:
            mobileDeliveryUpgradeIndex,

        preWorkoutLevel:
            mobilePreWorkoutUpgradeIndex,

        luckyShotLevel:
            mobileLuckyShotUpgradeIndex,

        kineticLevel:
            mobileKineticUpgradeIndex,

        supplyDropLevel:
            mobileSupplyDropUpgradeIndex,

        luckyActivations:
            mobileCurrentLifeLuckyActivations,

        kineticActivations:
            mobileCurrentLifeKineticActivations
    };
}


function getValidLastLifeSummary(savedSummary) {
    if (
        !savedSummary ||
        typeof savedSummary !== "object" ||
        Array.isArray(savedSummary)
    ) {
        return null;
    }

    const safeNumber = (
        value,
        fallback = 0
    ) =>
        Number.isFinite(value)
            ? Math.max(0, value)
            : fallback;

    return {
        lifeLevel:
            Math.floor(
                safeNumber(
                    savedSummary.lifeLevel
                )
            ),

        secondsPlayed:
            Math.floor(
                safeNumber(
                    savedSummary.secondsPlayed
                )
            ),

        energyProduced:
            safeNumber(
                savedSummary.energyProduced
            ),

        taps:
            Math.floor(
                safeNumber(
                    savedSummary.taps
                )
            ),

        finalPerTap:
            safeNumber(
                savedSummary.finalPerTap,
                1
            ),

        finalPerSecond:
            safeNumber(
                savedSummary.finalPerSecond
            ),

        drinkLevel:
            Math.floor(
                safeNumber(
                    savedSummary.drinkLevel
                )
            ),

        factoryLevel:
            Math.floor(
                safeNumber(
                    savedSummary.factoryLevel
                )
            ),

        deliveryLevel:
            Math.floor(
                safeNumber(
                    savedSummary.deliveryLevel
                )
            ),

        preWorkoutLevel:
            Math.floor(
                safeNumber(
                    savedSummary.preWorkoutLevel
                )
            ),

        luckyShotLevel:
            Math.floor(
                safeNumber(
                    savedSummary.luckyShotLevel
                )
            ),

        kineticLevel:
            Math.floor(
                safeNumber(
                    savedSummary.kineticLevel
                )
            ),

        supplyDropLevel:
            Math.floor(
                safeNumber(
                    savedSummary.supplyDropLevel
                )
            ),

        luckyActivations:
            Math.floor(
                safeNumber(
                    savedSummary.luckyActivations
                )
            ),

        kineticActivations:
            Math.floor(
                safeNumber(
                    savedSummary.kineticActivations
                )
            )
    };
}


// -------------------------------------------------
// RESET ONLY THE CURRENT LIFE
// -------------------------------------------------

function resetProgressForRebirth() {
    cancelSupplyDrop();

    mobileEnergy = 0;

    resetCurrentLifeChallengeState();

    mobileDrinkUpgradeIndex = 0;
    mobileFactoryUpgradeIndex = 0;
    mobileDeliveryUpgradeIndex = 0;
    mobilePreWorkoutUpgradeIndex = 0;
    mobileLuckyShotUpgradeIndex = 0;
    mobileKineticUpgradeIndex = 0;
    mobileSupplyDropUpgradeIndex = 0;

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
    kineticOverflowEndTime = 0;
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

    /*
        Save the completed run BEFORE incrementing Life
        or clearing any current-Life statistics.
    */
    captureLastLifeSummary();

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

    if (mobileSupplyDropUpgradeIndex > 0) {
        scheduleNextSupplyDrop(true);
    }

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

            ${
                mobileLastLifeSummary
                    ? `
                        <article class="rebirthLastLifeMini">
                            <span>LAST LIFE COMPLETE</span>

                            <strong>
                                LIFE ${mobileLastLifeSummary.lifeLevel}
                                •
                                ${formatGameTime(
                                    mobileLastLifeSummary.secondsPlayed
                                )}
                            </strong>

                            <p>
                                ${formatGameNumber(
                                    mobileLastLifeSummary.energyProduced
                                )}
                                energy •
                                ${formatGameNumber(
                                    mobileLastLifeSummary.taps
                                )}
                                taps •
                                ${formatProductionNumber(
                                    mobileLastLifeSummary.finalPerTap
                                )}
                                / tap •
                                ${formatProductionNumber(
                                    mobileLastLifeSummary.finalPerSecond
                                )}
                                / sec
                            </p>
                        </article>
                    `
                    : ""
            }

            <div class="newLifeEnergySummary">
                <span>NEW LIFE ENERGY</span>
                <strong>${formatGameNumber(mobileEnergy)}</strong>
                <p>
                    Rebirth reset your old Energy first. Permanent starting bonuses
                    and any achievements unlocked by this Rebirth are applied afterward.
                </p>
            </div>

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
// LIFE CHALLENGE DEFINITIONS
// -------------------------------------------------

function getLifeChallengeDefinitions() {
    const requirement =
        Math.max(
            1,
            getRebirthRequirement()
        );

    const lifeNumber =
        mobileLifeLevel + 1;

    const startingLevels =
        getRebirthStartingLevels();

    const rewardFor =
        (fraction) =>
            Math.max(
                100,
                Math.floor(
                    requirement * fraction
                )
            );

    const tapTargetOne =
        Math.floor(
            300 +
            mobileLifeLevel * 40
        );

    const tapTargetTwo =
        tapTargetOne * 3;

    const drinkTarget =
        Math.min(
            DRINK_POWER_MAX_LEVEL,
            Math.max(
                startingLevels.drink + 15,
                35 + mobileLifeLevel * 5
            )
        );

    const factoryTarget =
        Math.min(
            FACTORY_MAX_LEVEL,
            Math.max(
                startingLevels.factory + 12,
                25 + mobileLifeLevel * 5
            )
        );

    const deliveryTarget =
        Math.min(
            DELIVERY_MAX_LEVEL,
            Math.max(
                startingLevels.delivery + 12,
                20 + Math.floor(mobileLifeLevel * 4.5)
            )
        );

    const preWorkoutTarget =
        Math.min(
            PREWORKOUT_MAX_LEVEL,
            Math.max(
                startingLevels.preWorkout + 10,
                15 + mobileLifeLevel * 4
            )
        );

    const luckyTarget =
        Math.min(
            LUCKY_SHOT_MAX_LEVEL,
            Math.max(
                startingLevels.luckyShot + 8,
                12 + mobileLifeLevel * 3
            )
        );

    const kineticTarget =
        Math.min(
            KINETIC_MAX_LEVEL,
            Math.max(
                startingLevels.kinetic + 8,
                12 + mobileLifeLevel * 3
            )
        );

    const passiveBalanceTarget =
        Math.min(
            FACTORY_MAX_LEVEL,
            15 + mobileLifeLevel * 4
        );

    const specialBalanceTarget =
        Math.min(
            LUCKY_SHOT_MAX_LEVEL,
            10 + Math.floor(mobileLifeLevel * 2.5)
        );

    const soloTapTarget =
        Math.min(
            DRINK_POWER_MAX_LEVEL,
            Math.max(
                startingLevels.drink + 20,
                45 + Math.floor(mobileLifeLevel * 4.5)
            )
        );

    return [
        {
            id: "lifeEnergy1",
            icon: "⚡",
            name: "ENERGY RUN I",
            description:
                `Produce ${formatGameNumber(
                    requirement * 0.10
                )} energy during this Life.`,
            target:
                requirement * 0.10,
            rewardEnergy:
                rewardFor(0.003),
            getProgress: () =>
                mobileCurrentLifeEnergyProduced
        },
        {
            id: "lifeEnergy2",
            icon: "⚡",
            name: "ENERGY RUN II",
            description:
                `Produce ${formatGameNumber(
                    requirement * 0.40
                )} energy during this Life.`,
            target:
                requirement * 0.40,
            rewardEnergy:
                rewardFor(0.008),
            getProgress: () =>
                mobileCurrentLifeEnergyProduced
        },
        {
            id: "lifeEnergy3",
            icon: "🔥",
            name: "ENERGY RUN III",
            description:
                `Produce ${formatGameNumber(
                    requirement * 0.80
                )} energy during this Life.`,
            target:
                requirement * 0.80,
            rewardEnergy:
                rewardFor(0.015),
            getProgress: () =>
                mobileCurrentLifeEnergyProduced
        },
        {
            id: "lifeTaps1",
            icon: "👆",
            name: "HANDS ON",
            description:
                `Tap ${formatGameNumber(
                    tapTargetOne
                )} times during this Life.`,
            target:
                tapTargetOne,
            rewardEnergy:
                rewardFor(0.003),
            getProgress: () =>
                mobileCurrentLifeTaps
        },
        {
            id: "lifeTaps2",
            icon: "🥊",
            name: "NO BREAKS",
            description:
                `Tap ${formatGameNumber(
                    tapTargetTwo
                )} times during this Life.`,
            target:
                tapTargetTwo,
            rewardEnergy:
                rewardFor(0.006),
            getProgress: () =>
                mobileCurrentLifeTaps
        },
        {
            id: "lifeDrink",
            icon: "🥤",
            name: "POWER CLIMB",
            description:
                `Reach Drink Power Level ${drinkTarget} this Life.`,
            target:
                drinkTarget,
            rewardEnergy:
                rewardFor(0.004),
            getProgress: () =>
                mobileDrinkUpgradeIndex
        },
        {
            id: "lifeFactory",
            icon: "🏭",
            name: "FACTORY SHIFT",
            description:
                `Reach Factory Level ${factoryTarget} this Life.`,
            target:
                factoryTarget,
            rewardEnergy:
                rewardFor(0.004),
            getProgress: () =>
                mobileFactoryUpgradeIndex
        },
        {
            id: "lifeDelivery",
            icon: "🚚",
            name: "DELIVERY ROUTE",
            description:
                `Reach Delivery Level ${deliveryTarget} this Life.`,
            target:
                deliveryTarget,
            rewardEnergy:
                rewardFor(0.004),
            getProgress: () =>
                mobileDeliveryUpgradeIndex
        },
        {
            id: "lifePreWorkout",
            icon: "💪",
            name: "FULL SCOOP",
            description:
                `Reach Pre-Workout Level ${preWorkoutTarget} this Life.`,
            target:
                preWorkoutTarget,
            rewardEnergy:
                rewardFor(0.004),
            getProgress: () =>
                mobilePreWorkoutUpgradeIndex
        },
        {
            id: "lifeLuckyLevel",
            icon: "🍀",
            name: "PUSH YOUR LUCK",
            description:
                `Reach Lucky Shot Level ${luckyTarget} this Life.`,
            target:
                luckyTarget,
            rewardEnergy:
                rewardFor(0.004),
            getProgress: () =>
                mobileLuckyShotUpgradeIndex
        },
        {
            id: "lifeKineticLevel",
            icon: "🌩️",
            name: "CONTROL THE OVERFLOW",
            description:
                `Reach Kinetic Overflow Level ${kineticTarget} this Life.`,
            target:
                kineticTarget,
            rewardEnergy:
                rewardFor(0.004),
            getProgress: () =>
                mobileKineticUpgradeIndex
        },
        {
            id: "lifeLuckyActivations",
            icon: "🎯",
            name: "LUCKY LIFE",
            description:
                `Activate Lucky Shot ${5 + mobileLifeLevel} times this Life.`,
            target:
                5 + mobileLifeLevel,
            rewardEnergy:
                rewardFor(0.004),
            getProgress: () =>
                mobileCurrentLifeLuckyActivations
        },
        {
            id: "lifeKineticActivations",
            icon: "💥",
            name: "OVERFLOW LIFE",
            description:
                `Activate Kinetic Overflow ${3 + Math.floor(mobileLifeLevel / 2)} times this Life.`,
            target:
                3 + Math.floor(mobileLifeLevel / 2),
            rewardEnergy:
                rewardFor(0.004),
            getProgress: () =>
                mobileCurrentLifeKineticActivations
        },
        {
            id: "lifePassiveBalance",
            icon: "🏗️",
            name: "BALANCED BUSINESS",
            description:
                `Reach Level ${passiveBalanceTarget} in Factory, Delivery, and Pre-Workout.`,
            target:
                passiveBalanceTarget,
            rewardEnergy:
                rewardFor(0.006),
            getProgress: () =>
                Math.min(
                    mobileFactoryUpgradeIndex,
                    mobileDeliveryUpgradeIndex,
                    mobilePreWorkoutUpgradeIndex
                )
        },
        {
            id: "lifeSpecialBalance",
            icon: "🧪",
            name: "SPECIALIST",
            description:
                `Reach Level ${specialBalanceTarget} in both Lucky Shot and Kinetic Overflow.`,
            target:
                specialBalanceTarget,
            rewardEnergy:
                rewardFor(0.006),
            getProgress: () =>
                Math.min(
                    mobileLuckyShotUpgradeIndex,
                    mobileKineticUpgradeIndex
                )
        },
        {
            id: "lifePureTap",
            icon: "👊",
            name: "PURE TAP RUN",
            description:
                `Reach Drink Power Level ${soloTapTarget} without buying Factory, Delivery, or Pre-Workout this Life.`,
            target:
                soloTapTarget,
            rewardEnergy:
                rewardFor(0.010),
            getProgress: () =>
                mobileDrinkUpgradeIndex,
            isFailed: () => {
                const currentStart =
                    getRebirthStartingLevels();

                return (
                    mobileFactoryUpgradeIndex >
                        currentStart.factory ||
                    mobileDeliveryUpgradeIndex >
                        currentStart.delivery ||
                    mobilePreWorkoutUpgradeIndex >
                        currentStart.preWorkout
                );
            }
        }
    ];
}


// -------------------------------------------------
// RESET CURRENT-LIFE CHALLENGE PROGRESS
// -------------------------------------------------

function resetCurrentLifeChallengeState() {
    mobileCurrentLifeEnergyProduced = 0;
    mobileCurrentLifeTaps = 0;
    mobileCurrentLifeLuckyActivations = 0;
    mobileCurrentLifeKineticActivations = 0;
    mobileCurrentLifeSecondsPlayed = 0;

    mobileCompletedLifeChallengeIds = [];

    lifeChallengeNotificationQueue = [];
    lifeChallengeNotificationActive = false;

    if (lifeChallengeNotificationTimer) {
        clearTimeout(
            lifeChallengeNotificationTimer
        );

        lifeChallengeNotificationTimer = null;
    }

    if (lifeChallengeToast) {
        lifeChallengeToast.classList.remove(
            "visible"
        );
    }
}


// -------------------------------------------------
// VALIDATE SAVED LIFE CHALLENGES
// -------------------------------------------------

function getValidLifeChallengeIds(
    savedIds
) {
    if (!Array.isArray(savedIds)) {
        return [];
    }

    const validIds =
        new Set(
            getLifeChallengeDefinitions()
                .map(
                    (challenge) =>
                        challenge.id
                )
        );

    return [
        ...new Set(
            savedIds.filter(
                (challengeId) =>
                    validIds.has(
                        challengeId
                    )
            )
        )
    ];
}


// -------------------------------------------------
// GET ONE LIFE CHALLENGE'S PROGRESS
// -------------------------------------------------

function getLifeChallengeProgress(
    challenge
) {
    const completed =
        mobileCompletedLifeChallengeIds.includes(
            challenge.id
        );

    const failed =
        !completed &&
        typeof challenge.isFailed ===
            "function" &&
        challenge.isFailed();

    const currentProgress =
        Math.max(
            0,
            Number(
                challenge.getProgress()
            ) || 0
        );

    const target =
        Math.max(
            1,
            challenge.target
        );

    return {
        completed,
        failed,
        currentProgress,
        target,
        percentage:
            completed
                ? 100
                : Math.min(
                    100,
                    (
                        currentProgress /
                        target
                    ) * 100
                )
    };
}


// -------------------------------------------------
// COUNT COMPLETED LIFE CHALLENGES
// -------------------------------------------------

function getCompletedLifeChallengeCount() {
    return getLifeChallengeDefinitions()
        .filter(
            (challenge) =>
                mobileCompletedLifeChallengeIds
                    .includes(
                        challenge.id
                    )
        )
        .length;
}


// -------------------------------------------------
// CHECK FOR COMPLETED LIFE CHALLENGES
// -------------------------------------------------

function checkForCompletedLifeChallenges() {
    if (
        !hasSelectedSaveSlot ||
        mobilePendingRebirthChoices.length > 0
    ) {
        return;
    }

    const completedNow = [];

    getLifeChallengeDefinitions()
        .forEach((challenge) => {
            if (
                mobileCompletedLifeChallengeIds
                    .includes(
                        challenge.id
                    )
            ) {
                return;
            }

            const progress =
                getLifeChallengeProgress(
                    challenge
                );

            if (
                progress.failed ||
                progress.currentProgress <
                    progress.target
            ) {
                return;
            }

            mobileCompletedLifeChallengeIds.push(
                challenge.id
            );

            /*
                Challenge rewards add current energy
                only. They do not count as produced
                or lifetime energy.
            */
            mobileEnergy +=
                challenge.rewardEnergy;

            completedNow.push(
                challenge
            );
        });

    if (completedNow.length === 0) {
        return;
    }

    saveGame();

    completedNow.forEach(
        (challenge) => {
            lifeChallengeNotificationQueue.push(
                challenge
            );
        }
    );

    showNextLifeChallengeNotification();
}


// -------------------------------------------------
// SHOW LIFE CHALLENGE COMPLETION POPUPS
// -------------------------------------------------

function showNextLifeChallengeNotification() {
    if (
        lifeChallengeNotificationActive ||
        lifeChallengeNotificationQueue.length === 0 ||
        !lifeChallengeToast
    ) {
        return;
    }

    const challenge =
        lifeChallengeNotificationQueue.shift();

    lifeChallengeNotificationActive =
        true;

    lifeChallengeToastTitle.textContent =
        challenge.name;

    lifeChallengeToastDescription.textContent =
        challenge.description;

    lifeChallengeToastReward.textContent =
        `REWARD +${formatGameNumber(
            challenge.rewardEnergy
        )} ENERGY`;

    lifeChallengeToast.classList.remove(
        "visible"
    );

    void lifeChallengeToast.offsetWidth;

    lifeChallengeToast.classList.add(
        "visible"
    );

    lifeChallengeNotificationTimer =
        setTimeout(() => {
            lifeChallengeToast.classList.remove(
                "visible"
            );

            lifeChallengeNotificationTimer =
                setTimeout(() => {
                    lifeChallengeNotificationActive =
                        false;

                    showNextLifeChallengeNotification();
                }, 350);
        }, 2800);
}


// -------------------------------------------------
// PLAYER HUB: LIFE CHALLENGES ACCESS
// -------------------------------------------------

function createLifeChallengesAccessContent() {
    const challenges =
        getLifeChallengeDefinitions();

    const completedCount =
        getCompletedLifeChallengeCount();

    return `
        <div class="statsSection lifeChallengesAccessSection">

            <h3 class="statsSectionTitle">
                LIFE CHALLENGES
            </h3>

            <article class="lifeChallengesAccessCard">

                <div class="lifeChallengesAccessHeader">
                    <span class="lifeChallengesAccessIcon">
                        🎯
                    </span>

                    <div>
                        <strong>
                            LIFE ${mobileLifeLevel} CHALLENGES
                        </strong>

                        <p id="hubLifeChallengeStatus">
                            ${completedCount}
                            /
                            ${challenges.length}
                            complete • resets on Rebirth
                        </p>
                    </div>
                </div>

                <button
                    class="viewLifeChallengesButton"
                    id="viewLifeChallengesButton"
                    type="button"
                >
                    VIEW LIFE CHALLENGES
                </button>

            </article>

        </div>
    `;
}


function attachLifeChallengesAccessButton() {
    const button =
        document.getElementById(
            "viewLifeChallengesButton"
        );

    if (button) {
        button.addEventListener(
            "click",
            renderLifeChallengesMenu
        );
    }
}


// -------------------------------------------------
// CREATE LIFE CHALLENGES SCREEN
// -------------------------------------------------

function createLifeChallengesMenuContent() {
    const challenges =
        getLifeChallengeDefinitions();

    const cards =
        challenges.map((challenge) => {
            const progress =
                getLifeChallengeProgress(
                    challenge
                );

            const statusText =
                progress.completed
                    ? "COMPLETED"
                    : progress.failed
                        ? "MISSED THIS LIFE"
                        : "IN PROGRESS";

            return `
                <article
                    class="lifeChallengeCard
                    ${
                        progress.completed
                            ? "completed"
                            : progress.failed
                                ? "failed"
                                : ""
                    }"
                    id="lifeChallengeCard-${challenge.id}"
                >
                    <div class="lifeChallengeIcon">
                        ${
                            progress.completed
                                ? "✅"
                                : progress.failed
                                    ? "❌"
                                    : challenge.icon
                        }
                    </div>

                    <div class="lifeChallengeInfo">
                        <div class="lifeChallengeHeader">
                            <h3>${challenge.name}</h3>

                            <span
                                class="lifeChallengeStatus"
                                id="lifeChallengeStatus-${challenge.id}"
                            >
                                ${statusText}
                            </span>
                        </div>

                        <p>${challenge.description}</p>

                        <div class="lifeChallengeProgressText">
                            <span>PROGRESS</span>

                            <strong
                                id="lifeChallengeProgressText-${challenge.id}"
                            >
                                ${formatGameNumber(
                                    Math.min(
                                        progress.currentProgress,
                                        progress.target
                                    )
                                )}
                                /
                                ${formatGameNumber(
                                    progress.target
                                )}
                            </strong>
                        </div>

                        <div class="lifeChallengeProgressBar">
                            <div
                                class="lifeChallengeProgressFill"
                                id="lifeChallengeProgressFill-${challenge.id}"
                                style="width: ${progress.percentage}%"
                            ></div>
                        </div>

                        <div class="lifeChallengeReward">
                            <span>REWARD</span>
                            <strong>
                                +${formatGameNumber(
                                    challenge.rewardEnergy
                                )}
                                ENERGY
                            </strong>
                        </div>
                    </div>
                </article>
            `;
        }).join("");

    return `
        <section class="lifeChallengesScreen">

            <article class="lifeChallengesSummary">
                <span class="lifeChallengesSummaryIcon">🎯</span>

                <div>
                    <small>CURRENT LIFE</small>
                    <strong>
                        LIFE ${mobileLifeLevel}
                    </strong>
                </div>

                <div>
                    <small>COMPLETED</small>
                    <strong
                        id="lifeChallengesCompletedSummary"
                    >
                        ${getCompletedLifeChallengeCount()}
                        /
                        ${challenges.length}
                    </strong>
                </div>
            </article>

            <article class="lifeChallengeRuleCard">
                <strong>
                    THESE RESET EVERY REBIRTH
                </strong>

                <p>
                    Challenge rewards add current energy,
                    but never increase lifetime energy.
                </p>
            </article>

            <div class="lifeChallengesList">
                ${cards}
            </div>

            <button
                class="backToHubButton"
                id="backFromLifeChallengesButton"
                type="button"
            >
                BACK TO PLAYER HUB
            </button>

        </section>
    `;
}


function renderLifeChallengesMenu() {
    shopTitle.textContent =
        "LIFE CHALLENGES";

    shopList.innerHTML =
        createLifeChallengesMenuContent();

    const backButton =
        document.getElementById(
            "backFromLifeChallengesButton"
        );

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
}


// -------------------------------------------------
// LIVE LIFE CHALLENGE DISPLAY UPDATES
// -------------------------------------------------

function updateLifeChallengeDisplays() {
    const challenges =
        getLifeChallengeDefinitions();

    const hubStatus =
        document.getElementById(
            "hubLifeChallengeStatus"
        );

    if (hubStatus) {
        hubStatus.textContent =
            `${getCompletedLifeChallengeCount()}/${challenges.length} complete • resets on Rebirth`;
    }

    const summary =
        document.getElementById(
            "lifeChallengesCompletedSummary"
        );

    if (summary) {
        summary.textContent =
            `${getCompletedLifeChallengeCount()}/${challenges.length}`;
    }

    challenges.forEach((challenge) => {
        const card =
            document.getElementById(
                `lifeChallengeCard-${challenge.id}`
            );

        if (!card) {
            return;
        }

        const status =
            document.getElementById(
                `lifeChallengeStatus-${challenge.id}`
            );

        const text =
            document.getElementById(
                `lifeChallengeProgressText-${challenge.id}`
            );

        const fill =
            document.getElementById(
                `lifeChallengeProgressFill-${challenge.id}`
            );

        const progress =
            getLifeChallengeProgress(
                challenge
            );

        card.classList.toggle(
            "completed",
            progress.completed
        );

        card.classList.toggle(
            "failed",
            progress.failed
        );

        if (status) {
            status.textContent =
                progress.completed
                    ? "COMPLETED"
                    : progress.failed
                        ? "MISSED THIS LIFE"
                        : "IN PROGRESS";
        }

        if (text) {
            text.textContent =
                `${formatGameNumber(
                    Math.min(
                        progress.currentProgress,
                        progress.target
                    )
                )}/${formatGameNumber(
                    progress.target
                )}`;
        }

        if (fill) {
            fill.style.width =
                `${progress.percentage}%`;
        }
    });
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
// PLAY SHORT UI SOUND EFFECTS
// -------------------------------------------------

/*
    These lightweight sounds are generated with the Web Audio API,
    so the prototype does not need separate audio files yet.
    Later, these can be replaced with final .wav/.mp3 assets without
    changing the rest of the game logic.
*/
function playUISound(soundType = "menu") {
    const audioContext =
        getGameAudioContext();

    if (!audioContext) {
        return;
    }

    const now = audioContext.currentTime;

    function playTone({
        frequency,
        endFrequency = frequency,
        startOffset = 0,
        duration = 0.08,
        volume = 0.035,
        type = "sine"
    }) {
        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        const startTime =
            now + startOffset;

        const endTime =
            startTime + duration;

        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
            Math.max(1, frequency),
            startTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            Math.max(1, endFrequency),
            endTime
        );

        gain.gain.setValueAtTime(
            volume,
            startTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            endTime
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(endTime + 0.01);
    }

    if (soundType === "purchase") {
        playTone({
            frequency: 430,
            endFrequency: 540,
            duration: 0.07,
            volume: 0.032,
            type: "triangle"
        });

        playTone({
            frequency: 650,
            endFrequency: 760,
            startOffset: 0.065,
            duration: 0.09,
            volume: 0.035,
            type: "triangle"
        });

        return;
    }

    if (soundType === "equip") {
        playTone({
            frequency: 510,
            endFrequency: 690,
            duration: 0.085,
            volume: 0.028,
            type: "sine"
        });

        return;
    }

    if (soundType === "achievement") {
        [
            [523.25, 0],
            [659.25, 0.075],
            [783.99, 0.15]
        ].forEach(([frequency, startOffset]) => {
            playTone({
                frequency,
                endFrequency: frequency * 1.02,
                startOffset,
                duration: 0.16,
                volume: 0.032,
                type: "triangle"
            });
        });

        return;
    }

    if (soundType === "supplyDrop") {
        [
            [659.25, 0],
            [783.99, 0.055],
            [1046.5, 0.12]
        ].forEach(([frequency, startOffset]) => {
            playTone({
                frequency,
                endFrequency: frequency * 1.04,
                startOffset,
                duration: 0.12,
                volume: 0.032,
                type: "triangle"
            });
        });

        return;
    }

    if (soundType === "challenge") {
        playTone({
            frequency: 392,
            endFrequency: 523.25,
            duration: 0.11,
            volume: 0.03,
            type: "triangle"
        });

        playTone({
            frequency: 659.25,
            endFrequency: 783.99,
            startOffset: 0.09,
            duration: 0.13,
            volume: 0.032,
            type: "triangle"
        });

        return;
    }

    if (soundType === "error") {
        playTone({
            frequency: 175,
            endFrequency: 105,
            duration: 0.16,
            volume: 0.025,
            type: "square"
        });

        return;
    }

    /* Default menu/open sound. */
    playTone({
        frequency: 300,
        endFrequency: 410,
        duration: 0.065,
        volume: 0.022,
        type: "sine"
    });
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

    playUISound("error");

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
    performBulkUpgradePurchase(
        "drink"
    );
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
        `+${formatProductionNumber(energyAmount)}`;

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
    mobileCurrentLifeTaps++;

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

    mobileCurrentLifeEnergyProduced +=
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
// SUPPLY DROP HELPERS
// -------------------------------------------------

function getRandomSupplyDropDelay(
    minimumDelay,
    maximumDelay
) {
    return Math.floor(
        minimumDelay +
        Math.random() *
        (maximumDelay - minimumDelay)
    );
}


function getSupplyDropReward() {
    /*
        Reward earning power, not bank size. Even at high
        Supply Drop levels this stays a bonus to active
        play rather than replacing normal tapping.
    */
    const supplyValues =
        calculateSupplyDropValuesFromLevel(
            mobileSupplyDropUpgradeIndex
        );

    if (!supplyValues.unlocked) {
        return 0;
    }

    const tapContribution =
        getCurrentTapPower() *
        SUPPLY_DROP_TAP_EQUIVALENT;

    const passiveContribution =
        getCurrentEnergyPerSecond() *
        SUPPLY_DROP_PASSIVE_SECONDS;

    const baseReward =
        tapContribution +
        passiveContribution;

    return Math.max(
        SUPPLY_DROP_MIN_REWARD,
        Math.floor(
            baseReward *
            supplyValues.rewardMultiplier
        )
    );
}


function clearSupplyDropTimers() {
    if (supplyDropSpawnTimer) {
        clearTimeout(supplyDropSpawnTimer);
        supplyDropSpawnTimer = null;
    }

    if (supplyDropExpireTimer) {
        clearTimeout(supplyDropExpireTimer);
        supplyDropExpireTimer = null;
    }
}


function hideSupplyDrop() {
    supplyDropActive = false;

    if (!supplyDropButton) {
        return;
    }

    supplyDropButton.classList.remove(
        "active",
        "collected"
    );

    supplyDropButton.disabled = true;
}


function cancelSupplyDrop() {
    clearSupplyDropTimers();
    hideSupplyDrop();
}


function canSupplyDropAppear() {
    return (
        hasSelectedSaveSlot &&
        Number.isInteger(activeSaveSlot) &&
        mobileSupplyDropUpgradeIndex > 0 &&
        mobilePendingRebirthChoices.length === 0 &&
        !document.hidden &&
        !menuOverlay.classList.contains("open") &&
        !saveSlotOverlay.classList.contains("open") &&
        !offlineRewardOverlay.classList.contains("open") &&
        !supplyDropActive
    );
}


function scheduleNextSupplyDrop(isFirstDrop = false) {
    if (supplyDropSpawnTimer) {
        clearTimeout(supplyDropSpawnTimer);
        supplyDropSpawnTimer = null;
    }

    if (
        !hasSelectedSaveSlot ||
        !Number.isInteger(activeSaveSlot) ||
        mobileSupplyDropUpgradeIndex <= 0
    ) {
        return;
    }

    const supplyValues =
        calculateSupplyDropValuesFromLevel(
            mobileSupplyDropUpgradeIndex
        );

    if (!supplyValues.unlocked) {
        return;
    }

    const minimumDelay = isFirstDrop
        ? SUPPLY_DROP_FIRST_MIN_DELAY_MS
        : Math.round(
            supplyValues.minimumDelaySeconds *
            1000
        );

    const maximumDelay = isFirstDrop
        ? SUPPLY_DROP_FIRST_MAX_DELAY_MS
        : Math.round(
            supplyValues.maximumDelaySeconds *
            1000
        );

    supplyDropSpawnTimer = setTimeout(
        trySpawnSupplyDrop,
        getRandomSupplyDropDelay(
            minimumDelay,
            maximumDelay
        )
    );
}


function refreshSupplyDropScheduleAfterUpgrade(
    wasLocked = false
) {
    if (
        mobileSupplyDropUpgradeIndex <= 0 ||
        supplyDropActive
    ) {
        return;
    }

    if (supplyDropSpawnTimer) {
        clearTimeout(supplyDropSpawnTimer);
        supplyDropSpawnTimer = null;
    }

    scheduleNextSupplyDrop(
        wasLocked
    );
}


function trySpawnSupplyDrop() {
    supplyDropSpawnTimer = null;

    if (!canSupplyDropAppear()) {
        if (
            hasSelectedSaveSlot &&
            Number.isInteger(activeSaveSlot)
        ) {
            supplyDropSpawnTimer = setTimeout(
                trySpawnSupplyDrop,
                SUPPLY_DROP_RETRY_DELAY_MS
            );
        }

        return;
    }

    spawnSupplyDrop();
}


function spawnSupplyDrop() {
    if (!supplyDropButton) {
        return;
    }

    const currentMilestone =
        getCurrentUpgradeMilestone(
            mobileSupplyDropUpgradeIndex,
            SUPPLY_DROP_TIER_MILESTONES
        );

    if (supplyDropEventImage) {
        supplyDropEventImage.src =
            getUpgradeMilestoneImage(
                currentMilestone,
                "assets/upgrades/supply-drop/tier-1.png"
            );
    }

    supplyDropActive = true;

    const horizontalPosition =
        16 + Math.random() * 68;

    supplyDropButton.style.setProperty(
        "--supply-drop-left",
        `${horizontalPosition}%`
    );

    supplyDropButton.style.setProperty(
        "--supply-drop-fall-duration",
        `${SUPPLY_DROP_FALL_DURATION_MS}ms`
    );

    supplyDropButton.classList.remove(
        "active",
        "collected"
    );

    void supplyDropButton.offsetWidth;

    supplyDropButton.disabled = false;
    supplyDropButton.classList.add("active");

    supplyDropExpireTimer = setTimeout(
        () => {
            supplyDropExpireTimer = null;
            hideSupplyDrop();
            scheduleNextSupplyDrop();
        },
        SUPPLY_DROP_FALL_DURATION_MS
    );
}


function showSupplyDropReward(rewardAmount) {
    if (!supplyDropRewardPopup) {
        return;
    }

    supplyDropRewardPopup.textContent =
        `SUPPLY DROP! +${formatGameNumber(
            rewardAmount
        )}`;

    supplyDropRewardPopup.classList.remove(
        "visible"
    );

    void supplyDropRewardPopup.offsetWidth;

    supplyDropRewardPopup.classList.add(
        "visible"
    );

    setTimeout(() => {
        supplyDropRewardPopup.classList.remove(
            "visible"
        );
    }, 1100);
}


function collectSupplyDrop(event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    if (!supplyDropActive) {
        return;
    }

    if (supplyDropExpireTimer) {
        clearTimeout(supplyDropExpireTimer);
        supplyDropExpireTimer = null;
    }

    const rewardAmount =
        getSupplyDropReward();

    mobileEnergy += rewardAmount;
    mobileLifetimeEnergy += rewardAmount;
    mobileCurrentLifeEnergyProduced += rewardAmount;

    supplyDropActive = false;

    supplyDropButton.classList.add(
        "collected"
    );

    supplyDropButton.disabled = true;

    playUISound("supplyDrop");
    triggerTapHaptic();
    showSupplyDropReward(rewardAmount);

    updateShopBalance();
    saveGame();

    setTimeout(() => {
        hideSupplyDrop();
        scheduleNextSupplyDrop();
    }, 220);
}


if (supplyDropButton) {
    supplyDropButton.addEventListener(
        "click",
        collectSupplyDrop
    );
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
    playUISound("menu");

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
    /*
        Reconnect the ×1 / ×10 / ×25 / MAX selector
        whenever the Upgrades shop is rebuilt.
    */
    attachUpgradeBuyModeButtons();

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

    const supplyDropUpgradeBuyButton =
        document.getElementById(
            "supplyDropUpgradeBuyButton"
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

    if (supplyDropUpgradeBuyButton) {
        supplyDropUpgradeBuyButton.addEventListener(
            "click",
            buySupplyDropUpgrade
        );
    }

    /*
        Any cards not connected yet will continue
        using the temporary red failure effect.
    */
    const temporaryBuyButtons =
        shopList.querySelectorAll(
            ".buyButton:not(#drinkUpgradeBuyButton):not(#factoryUpgradeBuyButton):not(#deliveryUpgradeBuyButton):not(#preWorkoutUpgradeBuyButton):not(#luckyShotUpgradeBuyButton):not(#kineticUpgradeBuyButton):not(#supplyDropUpgradeBuyButton)"
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
            energyEarned: 0,
            wasCapped: false
        };
    }

    if (!Number.isFinite(savedAt)) {
        return {
            secondsAway: 0,
            energyEarned: 0,
            wasCapped: false
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
            energyEarned: 0,
            wasCapped: false
        };
    }

    const energyEarned =
        currentEnergyPerSecond *
        OFFLINE_PRODUCTION_EFFICIENCY *
        getOfflineProductionMultiplier() *
        countedSecondsAway;

    return {
        secondsAway:
            countedSecondsAway,

        energyEarned:
            energyEarned,

        wasCapped:
            rawSecondsAway >
            MAXIMUM_OFFLINE_SECONDS
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

    mobileCurrentLifeEnergyProduced +=
        offlineResult.energyEarned;

    showOfflineReward(
        offlineResult.secondsAway,
        offlineResult.energyEarned,
        offlineResult.wasCapped
    );
}


// -------------------------------------------------
// SHOW THE OFFLINE REWARD PANEL
// -------------------------------------------------

function showOfflineReward(
    secondsAway,
    energyEarned,
    wasCapped = false
) {
    offlineTimeAwayDisplay.textContent =
        formatGameTime(secondsAway);

    offlineEnergyEarnedDisplay.textContent =
        `+${formatGameNumber(energyEarned)}`;

    if (offlineRewardMessage) {
        offlineRewardMessage.textContent =
            wasCapped
                ? "Offline production is capped at 7 days. You earned the maximum offline reward."
                : "Your production kept running while you were away.";
    }

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
    if (
        !hasSelectedSaveSlot ||
        mobilePendingRebirthChoices.length > 0
    ) {
        return;
    }

    mobileSecondsPlayed++;
    mobileCurrentLifeSecondsPlayed++;

    const currentEnergyPerSecond =
        getCurrentEnergyPerSecond();

    if (currentEnergyPerSecond > 0) {
        mobileEnergy +=
            currentEnergyPerSecond;

        mobileLifetimeEnergy +=
            currentEnergyPerSecond;

        mobileCurrentLifeEnergyProduced +=
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
    mobileEnergy += 1_000_000_000_000_000_000;

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

const SAVE_VERSION = 9;

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
        economyVersion: GAME_BALANCE_VERSION,
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

        supplyDropUpgradeIndex:
            mobileSupplyDropUpgradeIndex,

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

        achievementSystemVersion:
            ACHIEVEMENT_SYSTEM_VERSION,

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
        ],

        currentLifeEnergyProduced:
            mobileCurrentLifeEnergyProduced,

        currentLifeTaps:
            mobileCurrentLifeTaps,

        currentLifeLuckyActivations:
            mobileCurrentLifeLuckyActivations,

        currentLifeKineticActivations:
            mobileCurrentLifeKineticActivations,

        currentLifeSecondsPlayed:
            mobileCurrentLifeSecondsPlayed,

        lastLifeSummary:
            mobileLastLifeSummary
                ? {
                    ...mobileLastLifeSummary
                }
                : null,

        completedLifeChallengeIds: [
            ...mobileCompletedLifeChallengeIds
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
    kineticOverflowEndTime = 0;

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

        mobileSupplyDropUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.supplyDropUpgradeIndex,
                SUPPLY_DROP_MAX_LEVEL
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

        /*
            Restore current-Life Challenge progress.
            Saves created before this system can only
            be reconstructed perfectly if they have
            never Rebirth'd. For Life 0, lifetime
            values are also the current-Life values.
        */
        const saveHasCurrentLifeData =
            Number.isFinite(
                savedData.currentLifeEnergyProduced
            ) &&
            Number.isFinite(
                savedData.currentLifeTaps
            );

        if (saveHasCurrentLifeData) {
            mobileCurrentLifeEnergyProduced =
                getSafeSavedNumber(
                    savedData.currentLifeEnergyProduced
                );

            mobileCurrentLifeTaps =
                Math.floor(
                    getSafeSavedNumber(
                        savedData.currentLifeTaps
                    )
                );

            mobileCurrentLifeLuckyActivations =
                Math.floor(
                    getSafeSavedNumber(
                        savedData.currentLifeLuckyActivations
                    )
                );

            mobileCurrentLifeKineticActivations =
                Math.floor(
                    getSafeSavedNumber(
                        savedData.currentLifeKineticActivations
                    )
                );
        } else if (mobileLifeLevel === 0) {
            mobileCurrentLifeEnergyProduced =
                mobileLifetimeEnergy;

            mobileCurrentLifeTaps =
                mobileTotalTaps;

            mobileCurrentLifeLuckyActivations =
                mobileLuckyShotsActivated;

            mobileCurrentLifeKineticActivations =
                mobileKineticActivations;
        } else {
            mobileCurrentLifeEnergyProduced = 0;
            mobileCurrentLifeTaps = 0;
            mobileCurrentLifeLuckyActivations = 0;
            mobileCurrentLifeKineticActivations = 0;
        }

        mobileCurrentLifeSecondsPlayed =
            Math.floor(
                getSafeSavedNumber(
                    savedData.currentLifeSecondsPlayed
                )
            );

        mobileLastLifeSummary =
            getValidLastLifeSummary(
                savedData.lastLifeSummary
            );

        mobileCompletedLifeChallengeIds =
            getValidLifeChallengeIds(
                savedData.completedLifeChallengeIds
            );

        rebuildDerivedGameValues();

        /*
            Achievement V3 rebalances targets and rewards for the final
            economy. V2 saves are re-evaluated without paying the same
            achievement rewards a second time. Very old saves can still
            receive one migration reward for achievements they qualify for.
        */
        if (
            savedData.achievementSystemVersion ===
            ACHIEVEMENT_SYSTEM_VERSION
        ) {
            mobileUnlockedAchievementIds =
                getValidAchievementIds(
                    savedData.unlockedAchievementIds
                );
        } else if (
            savedData.achievementSystemVersion === 2
        ) {
            migrateAchievementsToCurrentSystem(
                false
            );
        } else {
            migrateAchievementsToCurrentSystem(
                true
            );
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
            cancelSupplyDrop();
            return;
        }

        if (
            hasSelectedSaveSlot &&
            mobileSupplyDropUpgradeIndex > 0 &&
            !supplyDropActive &&
            !supplyDropSpawnTimer
        ) {
            scheduleNextSupplyDrop(true);
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