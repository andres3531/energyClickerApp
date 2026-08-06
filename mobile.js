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

// -------------------------------------------------
// DRINK POWER UPGRADE STATE
// -------------------------------------------------

let mobileDrinkUpgradeIndex = 0;

/*
    Later, an equipped skin will override
    the normal can-level image.
*/
let equippedSkinImage = null;

const MAXED_OUT_IMAGE = "imgs/maxedOut.png";

/*
    Level 0 is the can the player starts with.

    Each purchase moves to the next image.
*/
const CAN_LEVEL_IMAGES = [
    "imgs/firstCan.png",  // Can 0
    "imgs/secondCan.png", // Can 1
    "imgs/thirdCan.png",  // Can 2
    "imgs/fourthCan.png", // Can 3
    "imgs/fifthCan.png",  // Can 4
    "imgs/sixthCan.png"   // Can 5
];

const mobileCanImage =
    document.getElementById("mobileCanImage");

const shopBalanceImage =
    document.getElementById("shopBalanceImage");

// -------------------------------------------------
// FACTORY AND AUTOMATIC PRODUCTION STATE
// -------------------------------------------------

let mobileEnergyPerSecond = 0;
let mobileFactoryUpgradeIndex = 0;

const mobilePerSecondRow =
    document.getElementById("mobilePerSecondRow");

const mobilePerSecondDisplay =
    document.getElementById("mobilePerSecond");

// -------------------------------------------------
// DELIVERY TRUCK UPGRADE STATE
// -------------------------------------------------

let mobileDeliveryUpgradeIndex = 0;


// -------------------------------------------------
// PRE-WORKOUT UPGRADE STATE
// -------------------------------------------------

let mobilePreWorkoutUpgradeIndex = 0;

// -------------------------------------------------
// LUCKY SHOT STATE
// -------------------------------------------------

let mobileLuckyShotUpgradeIndex = 0;
let mobileLuckyShotChance = 0;

const LUCKY_SHOT_BONUS_MULTIPLIER = 0.20;

const mobileGameMessage =
    document.getElementById("mobileGameMessage");

let luckyShotMessageTimer = null;

// -------------------------------------------------
// KINETIC OVERFLOW STATE
// -------------------------------------------------

let mobileKineticUpgradeIndex = 0;

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
        getProgress: () => mobileEnergyPerSecond
    },

    {
        id: "production50",
        icon: "🚚",
        name: "PRODUCTION LINE",
        description: "Reach 50 energy produced per second.",
        target: 50,
        getProgress: () => mobileEnergyPerSecond
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

    if (mobileEnergyPerSecond > 0) {
        mobilePerSecondRow.classList.remove(
            "hidden"
        );

        mobilePerSecondDisplay.textContent =
            formatGameNumber(
                mobileEnergyPerSecond
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

    /*
        Check achievements after every meaningful
        score or progression update.
    */
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

        cost:
            document.getElementById("drinkUpgradeCost"),

        buyButton:
            document.getElementById("drinkUpgradeBuyButton")
    };
}


// -------------------------------------------------
// DETERMINE THE CURRENT CAN IMAGE
// -------------------------------------------------

// -------------------------------------------------
// GET THE NORMAL CAN-LEVEL IMAGE
// -------------------------------------------------

function getCurrentBaseCanImage() {
    const currentCanImage =
        CAN_LEVEL_IMAGES[mobileDrinkUpgradeIndex];

    if (!currentCanImage) {
        return CAN_LEVEL_IMAGES[
        CAN_LEVEL_IMAGES.length - 1
            ];
    }

    return currentCanImage;
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
        The upgrade card does not exist while
        Skins, Colors, or Stats is open.
    */
    if (!elements.card) {
        return;
    }

    if (
        mobileDrinkUpgradeIndex <
        DRINK_UPGRADES.length
    ) {
        const nextUpgrade =
            DRINK_UPGRADES[mobileDrinkUpgradeIndex];

        /*
            The player is purchasing the next can level.

            At level 0, the card previews Can 1.
            At level 1, the card previews Can 2.
        */
        const nextCanLevel =
            mobileDrinkUpgradeIndex + 1;

        const nextCanImage =
            CAN_LEVEL_IMAGES[nextCanLevel];

        elements.image.src =
            nextCanImage || nextUpgrade.img;

        elements.name.textContent =
            `CAN ${nextCanLevel}`;

        elements.level.textContent =
            `CURRENT CAN: ${mobileDrinkUpgradeIndex}`;

        elements.description.textContent =
            nextUpgrade.description.replace(
                "click",
                "tap"
            );

        elements.cost.textContent =
            Math.floor(nextUpgrade.cost)
                .toLocaleString("en-US");

        elements.buyButton.textContent =
            "BUY";

        elements.buyButton.disabled =
            false;

        return;
    }

    elements.image.src =
        MAXED_OUT_IMAGE;

    elements.name.textContent =
        `CAN ${mobileDrinkUpgradeIndex}`;

    elements.level.textContent =
        "MAX LEVEL";

    elements.description.textContent =
        "All can power upgrades have been purchased.";

    elements.cost.textContent =
        "MAX";

    elements.buyButton.textContent =
        "MAXED";

    elements.buyButton.disabled =
        true;
}

// -------------------------------------------------
// GET THE FACTORY CARD ELEMENTS
// -------------------------------------------------

function getFactoryUpgradeElements() {
    return {
        card:
            document.getElementById("factoryUpgradeCard"),

        image:
            document.getElementById("factoryUpgradeImage"),

        name:
            document.getElementById("factoryUpgradeName"),

        level:
            document.getElementById("factoryUpgradeLevel"),

        description:
            document.getElementById("factoryUpgradeDescription"),

        cost:
            document.getElementById("factoryUpgradeCost"),

        buyButton:
            document.getElementById("factoryUpgradeBuyButton")
    };
}


// -------------------------------------------------
// UPDATE THE FACTORY CARD
// -------------------------------------------------

function updateFactoryUpgradeCard() {
    const elements =
        getFactoryUpgradeElements();

    /*
        The Factory card does not exist while
        Skins, Colors, or Stats is open.
    */
    if (!elements.card) {
        return;
    }

    if (
        mobileFactoryUpgradeIndex <
        FACTORY_UPGRADES.length
    ) {
        const nextFactory =
            FACTORY_UPGRADES[mobileFactoryUpgradeIndex];

        elements.image.src =
            nextFactory.img;

        elements.name.textContent =
            nextFactory.name || "FACTORY";

        elements.level.textContent =
            `LEVEL ${mobileFactoryUpgradeIndex}`;

        elements.description.textContent =
            nextFactory.description;

        elements.cost.textContent =
            Math.floor(nextFactory.cost)
                .toLocaleString("en-US");

        elements.buyButton.textContent =
            "BUY";

        elements.buyButton.disabled =
            false;

        return;
    }

    elements.image.src =
        MAXED_OUT_IMAGE;

    elements.name.textContent =
        "FACTORY";

    elements.level.textContent =
        `LEVEL ${FACTORY_UPGRADES.length}`;

    elements.description.textContent =
        "All Factory upgrades have been purchased.";

    elements.cost.textContent =
        "MAX";

    elements.buyButton.textContent =
        "MAXED";

    elements.buyButton.disabled =
        true;
}


// -------------------------------------------------
// BUY A FACTORY UPGRADE
// -------------------------------------------------

function buyFactoryUpgrade() {
    if (
        mobileFactoryUpgradeIndex >=
        FACTORY_UPGRADES.length
    ) {
        return;
    }

    const currentFactory =
        FACTORY_UPGRADES[mobileFactoryUpgradeIndex];

    const elements =
        getFactoryUpgradeElements();

    if (
        mobileEnergy <
        currentFactory.cost
    ) {
        showPurchaseFailure(elements.card);
        return;
    }

    mobileEnergy -=
        currentFactory.cost;

    mobileEnergyPerSecond +=
        currentFactory.multiplier;

    mobileFactoryUpgradeIndex++;

    updateShopBalance();

    /*
        Briefly flash the card green after
        a successful Factory purchase.
    */
    elements.card.classList.remove(
        "purchaseSuccess"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess"
        );
    }, 500);
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
// UPDATE THE DELIVERY TRUCK CARD
// -------------------------------------------------

function updateDeliveryTruckCard() {
    const elements =
        getDeliveryTruckElements();

    /*
        The card will not exist while Skins,
        Colors, or Stats is open.
    */
    if (!elements.card) {
        return;
    }

    if (
        mobileDeliveryUpgradeIndex <
        DELIVERY_UPGRADES.length
    ) {
        const nextDeliveryUpgrade =
            DELIVERY_UPGRADES[
                mobileDeliveryUpgradeIndex
                ];

        elements.image.src =
            nextDeliveryUpgrade.img;

        elements.name.textContent =
            nextDeliveryUpgrade.name ||
            "DELIVERY TRUCK";

        elements.level.textContent =
            `LEVEL ${mobileDeliveryUpgradeIndex}`;

        elements.description.textContent =
            nextDeliveryUpgrade.description;

        elements.cost.textContent =
            formatGameNumber(
                nextDeliveryUpgrade.cost
            );

        elements.buyButton.textContent =
            "BUY";

        elements.buyButton.disabled =
            false;

        return;
    }

    /*
        Display the maxed-out state after the
        player purchases every Delivery upgrade.
    */
    elements.image.src =
        MAXED_OUT_IMAGE;

    elements.name.textContent =
        "DELIVERY TRUCK";

    elements.level.textContent =
        `LEVEL ${DELIVERY_UPGRADES.length}`;

    elements.description.textContent =
        "All Delivery Truck upgrades have been purchased.";

    elements.cost.textContent =
        "MAX";

    elements.buyButton.textContent =
        "MAXED";

    elements.buyButton.disabled =
        true;
}


// -------------------------------------------------
// BUY A DELIVERY TRUCK UPGRADE
// -------------------------------------------------

function buyDeliveryTruckUpgrade() {
    if (
        mobileDeliveryUpgradeIndex >=
        DELIVERY_UPGRADES.length
    ) {
        return;
    }

    const currentDeliveryUpgrade =
        DELIVERY_UPGRADES[
            mobileDeliveryUpgradeIndex
            ];

    const elements =
        getDeliveryTruckElements();

    /*
        Reject the purchase when the player
        cannot afford the current upgrade.
    */
    if (
        mobileEnergy <
        currentDeliveryUpgrade.cost
    ) {
        showPurchaseFailure(elements.card);
        return;
    }

    /*
        Complete the purchase.
    */
    mobileEnergy -=
        currentDeliveryUpgrade.cost;

    mobileEnergyPerSecond +=
        currentDeliveryUpgrade.multiplier;

    mobileDeliveryUpgradeIndex++;

    /*
        Update the home score, shop balance,
        production line, and Delivery card.
    */
    updateShopBalance();

    /*
        Flash the card green after success.
    */
    elements.card.classList.remove(
        "purchaseSuccess"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess"
        );
    }, 500);
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
// UPDATE THE PRE-WORKOUT CARD
// -------------------------------------------------

function updatePreWorkoutCard() {
    const elements =
        getPreWorkoutElements();

    /*
        The card does not exist while Skins,
        Colors, or Stats is open.
    */
    if (!elements.card) {
        return;
    }

    if (
        mobilePreWorkoutUpgradeIndex <
        PREWORKOUT_UPGRADES.length
    ) {
        const nextPreWorkout =
            PREWORKOUT_UPGRADES[
                mobilePreWorkoutUpgradeIndex
                ];

        elements.image.src =
            nextPreWorkout.img;

        elements.name.textContent =
            nextPreWorkout.name ||
            "PRE-WORKOUT";

        elements.level.textContent =
            `LEVEL ${mobilePreWorkoutUpgradeIndex}`;

        elements.description.textContent =
            nextPreWorkout.description;

        elements.cost.textContent =
            formatGameNumber(
                nextPreWorkout.cost
            );

        elements.buyButton.textContent =
            "BUY";

        elements.buyButton.disabled =
            false;

        return;
    }

    /*
        Show the maxed-out state after every
        Pre-Workout tier has been purchased.
    */
    elements.image.src =
        MAXED_OUT_IMAGE;

    elements.name.textContent =
        "PRE-WORKOUT";

    elements.level.textContent =
        `LEVEL ${PREWORKOUT_UPGRADES.length}`;

    elements.description.textContent =
        "All Pre-Workout upgrades have been purchased.";

    elements.cost.textContent =
        "MAX";

    elements.buyButton.textContent =
        "MAXED";

    elements.buyButton.disabled =
        true;
}


// -------------------------------------------------
// BUY A PRE-WORKOUT UPGRADE
// -------------------------------------------------

function buyPreWorkoutUpgrade() {
    if (
        mobilePreWorkoutUpgradeIndex >=
        PREWORKOUT_UPGRADES.length
    ) {
        return;
    }

    const currentPreWorkout =
        PREWORKOUT_UPGRADES[
            mobilePreWorkoutUpgradeIndex
            ];

    const elements =
        getPreWorkoutElements();

    /*
        Reject the purchase when the player
        cannot afford the current upgrade.
    */
    if (
        mobileEnergy <
        currentPreWorkout.cost
    ) {
        showPurchaseFailure(elements.card);
        return;
    }

    /*
        Complete the purchase.
    */
    mobileEnergy -=
        currentPreWorkout.cost;

    mobileEnergyPerSecond +=
        currentPreWorkout.multiplier;

    mobilePreWorkoutUpgradeIndex++;

    /*
        Update the score, menu balance,
        production line, and upgrade cards.
    */
    updateShopBalance();

    /*
        Flash the card green after success.
    */
    elements.card.classList.remove(
        "purchaseSuccess"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess"
        );
    }, 500);
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
// UPDATE THE LUCKY SHOT CARD
// -------------------------------------------------

function updateLuckyShotCard() {
    const elements =
        getLuckyShotElements();

    /*
        The card does not exist while Skins,
        Colors, or Stats is open.
    */
    if (!elements.card) {
        return;
    }

    if (
        mobileLuckyShotUpgradeIndex <
        LUCKYSHOT_UPGRADES.length
    ) {
        const nextLuckyShot =
            LUCKYSHOT_UPGRADES[
                mobileLuckyShotUpgradeIndex
                ];

        elements.image.src =
            nextLuckyShot.img;

        elements.name.textContent =
            nextLuckyShot.name ||
            "LUCKY SHOT";

        elements.level.textContent =
            `LEVEL ${mobileLuckyShotUpgradeIndex}`;

        elements.description.textContent =
            nextLuckyShot.description.replace(
                "clicking",
                "tapping"
            );

        elements.cost.textContent =
            formatGameNumber(
                nextLuckyShot.cost
            );

        elements.buyButton.textContent =
            "BUY";

        elements.buyButton.disabled =
            false;

        return;
    }

    elements.image.src =
        MAXED_OUT_IMAGE;

    elements.name.textContent =
        "LUCKY SHOT";

    elements.level.textContent =
        `LEVEL ${LUCKYSHOT_UPGRADES.length}`;

    elements.description.textContent =
        "Lucky Shot is fully upgraded.";

    elements.cost.textContent =
        "MAX";

    elements.buyButton.textContent =
        "MAXED";

    elements.buyButton.disabled =
        true;
}


// -------------------------------------------------
// BUY A LUCKY SHOT UPGRADE
// -------------------------------------------------

function buyLuckyShotUpgrade() {
    if (
        mobileLuckyShotUpgradeIndex >=
        LUCKYSHOT_UPGRADES.length
    ) {
        return;
    }

    const currentLuckyShot =
        LUCKYSHOT_UPGRADES[
            mobileLuckyShotUpgradeIndex
            ];

    const elements =
        getLuckyShotElements();

    if (
        mobileEnergy <
        currentLuckyShot.cost
    ) {
        showPurchaseFailure(elements.card);
        return;
    }

    mobileEnergy -=
        currentLuckyShot.cost;

    mobileLuckyShotChance +=
        currentLuckyShot.chanceIncrease;

    mobileLuckyShotUpgradeIndex++;

    updateShopBalance();

    elements.card.classList.remove(
        "purchaseSuccess"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess"
        );
    }, 500);
}


// -------------------------------------------------
// TRY TO ACTIVATE LUCKY SHOT
// -------------------------------------------------

function tryLuckyShot() {
    if (mobileLuckyShotChance <= 0) {
        return;
    }

    const randomNumber =
        Math.random();

    if (
        randomNumber >=
        mobileLuckyShotChance
    ) {
        return;
    }

    const luckyShotBonus =
        Math.max(
            1,
            Math.floor(
                mobileEnergy *
                LUCKY_SHOT_BONUS_MULTIPLIER
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
// UPDATE KINETIC OVERFLOW CARD
// -------------------------------------------------

function updateKineticOverflowCard() {
    const elements =
        getKineticOverflowElements();

    /*
        The card does not exist while another
        menu such as Stats is open.
    */
    if (!elements.card) {
        return;
    }

    if (
        mobileKineticUpgradeIndex <
        KINETIC_OVERFLOW_UPGRADES.length
    ) {
        const nextUpgrade =
            KINETIC_OVERFLOW_UPGRADES[
                mobileKineticUpgradeIndex
                ];

        elements.image.src =
            nextUpgrade.img;

        elements.name.textContent =
            nextUpgrade.name ||
            "KINETIC OVERFLOW";

        elements.level.textContent =
            `LEVEL ${mobileKineticUpgradeIndex}`;

        elements.description.textContent =
            nextUpgrade.description.replace(
                "click power",
                "tap power"
            );

        elements.cost.textContent =
            formatGameNumber(
                nextUpgrade.cost
            );

        elements.buyButton.textContent =
            "BUY";

        elements.buyButton.disabled =
            false;

        return;
    }

    elements.image.src =
        MAXED_OUT_IMAGE;

    elements.name.textContent =
        "KINETIC OVERFLOW";

    elements.level.textContent =
        `LEVEL ${KINETIC_OVERFLOW_UPGRADES.length}`;

    elements.description.textContent =
        "Kinetic Overflow is fully upgraded.";

    elements.cost.textContent =
        "MAX";

    elements.buyButton.textContent =
        "MAXED";

    elements.buyButton.disabled =
        true;
}


// -------------------------------------------------
// BUY KINETIC OVERFLOW UPGRADE
// -------------------------------------------------

function buyKineticOverflowUpgrade() {
    if (
        mobileKineticUpgradeIndex >=
        KINETIC_OVERFLOW_UPGRADES.length
    ) {
        return;
    }

    const currentUpgrade =
        KINETIC_OVERFLOW_UPGRADES[
            mobileKineticUpgradeIndex
            ];

    const elements =
        getKineticOverflowElements();

    if (
        mobileEnergy <
        currentUpgrade.cost
    ) {
        showPurchaseFailure(
            elements.card
        );

        return;
    }

    mobileEnergy -=
        currentUpgrade.cost;

    /*
        Each tier replaces the previous tier's
        chance, multiplier, and duration.
    */
    mobileKineticChance =
        currentUpgrade.chance;

    mobileKineticMultiplier =
        currentUpgrade.multiplier;

    mobileKineticDuration =
        currentUpgrade.duration;

    mobileKineticUpgradeIndex++;

    updateShopBalance();

    elements.card.classList.remove(
        "purchaseSuccess"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess"
        );
    }, 500);
}


// -------------------------------------------------
// GET CURRENT TAP POWER
// -------------------------------------------------

function getCurrentTapPower() {
    if (mobileKineticActive) {
        return (
            mobileEnergyPerTap *
            mobileKineticMultiplier
        );
    }

    return mobileEnergyPerTap;
}


// -------------------------------------------------
// TRY TO ACTIVATE KINETIC OVERFLOW
// -------------------------------------------------

function tryKineticOverflow() {
    /*
        Do not activate it again while the
        current boost is still running.
    */
    if (
        mobileKineticActive ||
        mobileKineticChance <= 0
    ) {
        return;
    }

    if (
        Math.random() >=
        mobileKineticChance
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
        `KINETIC OVERFLOW ×${mobileKineticMultiplier} — ${mobileKineticTimeLeft}s`;

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
    /*
        Main player statistics.
    */
    shopList.innerHTML =
        createStatsShopContent();

    /*
        Achievement access.
    */
    shopList.insertAdjacentHTML(
        "beforeend",
        createAchievementsAccessContent()
    );

    /*
        Save and slot controls.
    */
    shopList.insertAdjacentHTML(
        "beforeend",
        createSaveManagementContent()
    );

    /*
        Global settings.
    */
    shopList.insertAdjacentHTML(
        "beforeend",
        createSettingsAccessContent()
    );

    updateStatsDisplay();

    attachAchievementsAccessButton();
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
            mobileEnergyPerSecond
        )
    );

    setStatValue(
        "statCanLevel",
        mobileDrinkUpgradeIndex
    );

    setStatValue(
        "statLuckyChance",
        formatChancePercent(
            mobileLuckyShotChance
        )
    );

    setStatValue(
        "statLuckyActivations",
        formatGameNumber(
            mobileLuckyShotsActivated
        )
    );

    setStatValue(
        "statKineticChance",
        formatChancePercent(
            mobileKineticChance
        )
    );

    setStatValue(
        "statKineticMultiplier",
        `×${mobileKineticMultiplier}`
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

    /*
        Achievement progress belongs to each slot.
    */
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

    /*
        Always start from a completely clean
        in-memory state before loading a slot.
    */
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

    /*
        Existing slots restore their data.

        Empty slots keep the clean starting values
        created above.
    */
    loadGame();

    /*
        Reconnect any upgrade cards currently
        present and draw the selected slot.
    */
    attachTestBuyButtons();
    updateShopBalance();

    /*
        Immediately create a save when the player
        selects an empty slot.
    */
    saveGame();
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
                BACK TO STATS
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
    if (
        mobileDrinkUpgradeIndex >=
        DRINK_UPGRADES.length
    ) {
        return;
    }

    const currentUpgrade =
        DRINK_UPGRADES[mobileDrinkUpgradeIndex];

    const elements =
        getDrinkUpgradeElements();

    if (
        mobileEnergy <
        currentUpgrade.cost
    ) {
        showPurchaseFailure(elements.card);
        return;
    }

    mobileEnergy -=
        currentUpgrade.cost;

    mobileEnergyPerTap +=
        currentUpgrade.multiplier;

    mobileDrinkUpgradeIndex++;

    updateShopBalance();

    elements.card.classList.remove(
        "purchaseSuccess"
    );

    void elements.card.offsetWidth;

    elements.card.classList.add(
        "purchaseSuccess"
    );

    setTimeout(() => {
        elements.card.classList.remove(
            "purchaseSuccess"
        );
    }, 500);
}
// -------------------------------------------------
// PRODUCE ENERGY BY TAPPING
// -------------------------------------------------
function produceEnergyFromTap() {
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
    /*
        A player needs automatic production before
        they can earn anything while away.
    */
    if (mobileEnergyPerSecond <= 0) {
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

    /*
        Prevent negative time if the device clock
        changed and limit the maximum reward.
    */
    const countedSecondsAway =
        Math.min(
            Math.max(rawSecondsAway, 0),
            MAXIMUM_OFFLINE_SECONDS
        );

    /*
        Do not display a reward popup for extremely
        short refreshes or quick tab changes.
    */
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
        mobileEnergyPerSecond *
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
    /*
        The game has not started until the player
        selects a save slot.
    */
    if (!hasSelectedSaveSlot) {
        return;
    }

    mobileSecondsPlayed++;

    if (mobileEnergyPerSecond > 0) {
        mobileEnergy +=
            mobileEnergyPerSecond;

        mobileLifetimeEnergy +=
            mobileEnergyPerSecond;

        updateShopBalance();

        return;
    }

    updateStatsDisplay();
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

const SAVE_VERSION = 1;

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

        /*
            Permanently completed achievements.
        */
        unlockedAchievementIds: [
            ...mobileUnlockedAchievementIds
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
        Recalculate tap power from purchased
        Drink Power levels.
    */
    mobileEnergyPerTap = 1;

    for (
        let index = 0;
        index < mobileDrinkUpgradeIndex;
        index++
    ) {
        mobileEnergyPerTap +=
            DRINK_UPGRADES[index].multiplier;
    }

    /*
        Recalculate all automatic production.
    */
    mobileEnergyPerSecond = 0;

    for (
        let index = 0;
        index < mobileFactoryUpgradeIndex;
        index++
    ) {
        mobileEnergyPerSecond +=
            FACTORY_UPGRADES[index].multiplier;
    }

    for (
        let index = 0;
        index < mobileDeliveryUpgradeIndex;
        index++
    ) {
        mobileEnergyPerSecond +=
            DELIVERY_UPGRADES[index].multiplier;
    }

    for (
        let index = 0;
        index < mobilePreWorkoutUpgradeIndex;
        index++
    ) {
        mobileEnergyPerSecond +=
            PREWORKOUT_UPGRADES[index].multiplier;
    }

    /*
        Recalculate Lucky Shot chance.
    */
    mobileLuckyShotChance = 0;

    for (
        let index = 0;
        index < mobileLuckyShotUpgradeIndex;
        index++
    ) {
        mobileLuckyShotChance +=
            LUCKYSHOT_UPGRADES[
                index
                ].chanceIncrease;
    }

    /*
        Restore the most recently purchased
        Kinetic Overflow tier.
    */
    if (mobileKineticUpgradeIndex > 0) {
        const currentKineticUpgrade =
            KINETIC_OVERFLOW_UPGRADES[
            mobileKineticUpgradeIndex - 1
                ];

        mobileKineticChance =
            currentKineticUpgrade.chance;

        mobileKineticMultiplier =
            currentKineticUpgrade.multiplier;

        mobileKineticDuration =
            currentKineticUpgrade.duration;
    } else {
        mobileKineticChance = 0;
        mobileKineticMultiplier = 1;
        mobileKineticDuration = 0;
    }

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

    /*
        Restore the equipped skin only when the
        player actually owns that skin.
    */
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

    /*
        Restore the equipped score color only when
        that color is owned.
    */
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
            getSafeUpgradeIndex(
                savedData.drinkUpgradeIndex,
                DRINK_UPGRADES.length
            );

        mobileFactoryUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.factoryUpgradeIndex,
                FACTORY_UPGRADES.length
            );

        mobileDeliveryUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.deliveryUpgradeIndex,
                DELIVERY_UPGRADES.length
            );

        mobilePreWorkoutUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.preWorkoutUpgradeIndex,
                PREWORKOUT_UPGRADES.length
            );

        mobileLuckyShotUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.luckyShotUpgradeIndex,
                LUCKYSHOT_UPGRADES.length
            );

        mobileKineticUpgradeIndex =
            getSafeUpgradeIndex(
                savedData.kineticUpgradeIndex,
                KINETIC_OVERFLOW_UPGRADES.length
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

        /*
            Restore permanently unlocked
            achievements from newer saves.
        */
        const saveHasAchievementData =
            Array.isArray(
                savedData.unlockedAchievementIds
            );

        mobileUnlockedAchievementIds =
            getValidAchievementIds(
                savedData.unlockedAchievementIds
            );

        rebuildDerivedGameValues();

        /*
            Older saves do not contain an achievement
            list. Mark everything they already earned
            without showing many popups at once.
        */
        if (!saveHasAchievementData) {
            unlockCurrentAchievementsSilently();
        }

        applyOfflineProduction(
            savedData.savedAt
        );

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