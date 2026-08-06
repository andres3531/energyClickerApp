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
// MENU TITLES
// -------------------------------------------------

const menuTitles = {
    upgrades: "UPGRADES SHOP",
    skins: "SKINS SHOP",
    colors: "COLORS SHOP",
    stats: "STATS"
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

    /*
        Keep the home score and shop balance
        synchronized at all times.
    */
    mobileScoreDisplay.textContent =
        formattedEnergy;

    shopBalanceAmount.textContent =
        formattedEnergy;

    /*
        Make sure the selected score color remains
        applied whenever the score is updated.
    */
    updateScoreColor();

    /*
        Display the temporarily multiplied tap power
        while Kinetic Overflow is active.
    */
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

    /*
        Hide automatic production until the player
        owns at least one automatic upgrade.
    */
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

    if (randomNumber >= mobileLuckyShotChance) {
        return;
    }

    /*
        The reward is 20% of the player's current
        energy, with a minimum reward of 1.
    */
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
    /*
        Roll Kinetic Overflow before calculating
        this tap. This means the activation tap
        also receives the multiplier.
    */
    tryKineticOverflow();

    mobileEnergy +=
        getCurrentTapPower();

    /*
        Lucky Shot is checked after the normal
        or multiplied tap has been added.
    */
    tryLuckyShot();

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
    } else {
        /*
            Stats is still a placeholder.
        */
        shopList.innerHTML =
            createPlaceholderContent(
                menuName
            );
    }

    /*
        Synchronize energy, production, can images,
        and the currently equipped score color.
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
// AUTOMATIC ENERGY PRODUCTION
// -------------------------------------------------

function produceAutomaticEnergy() {
    if (mobileEnergyPerSecond <= 0) {
        return;
    }

    mobileEnergy +=
        mobileEnergyPerSecond;

    /*
        This updates both:
        1. The home-screen score
        2. The shop balance while a menu is open
    */
    updateShopBalance();
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


// Connect the test buttons that already exist when the page loads.
attachTestBuyButtons();
updateShopBalance();