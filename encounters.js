function makeCultistEncounter() {
    let newCultist = new Cultist("Cultist", 48, 54);
    enemyArray.push(newCultist);
}

function makeJawWormEncounter() {
    let newJawWorm = new JawWorm("Jaw Worm", 40, 44);
    enemyArray.push(newJawWorm);
}

function makeLousesEncounter() {
    let randomNumberOne = getRandomNumber(2, 1);
    let randomNumberTwo = getRandomNumber(2, 1);

    if (randomNumberOne == 1) {
        let newRedLouse = new RedLouse("Red Louse 1", 10, 15);
        enemyArray.push(newRedLouse);
    } else {
        let newGreenLouse = new GreenLouse("Green Louse 1", 17, 11);
        enemyArray.push(newGreenLouse);
    }

    if (randomNumberTwo == 1) {
        let newRedLouse = new RedLouse("Red Louse 2", 10, 15);
        enemyArray.push(newRedLouse);
    } else {
        let newGreenLouse = new GreenLouse("Green Louse 2", 17, 11);
        enemyArray.push(newGreenLouse);
    }
}

function makeSlimesEncounter() {
    let randomNumberOne = getRandomNumber(2, 1);
    let randomNumberTwo = getRandomNumber(2, 1);

    if (randomNumberOne == 1) {
        let newAcidSlimeM = new AcidSlimeM("Acid Slime M 1", 28, 32);
        enemyArray.push(newAcidSlimeM);
    } else {
        let newSpikeSlimeM = new SpikeSlimeM("Spike Slime M 1", 28, 32);
        enemyArray.push(newSpikeSlimeM);
    }

    if (randomNumberTwo == 1) {
        let newAcidSlimeS = new AcidSlimeS("Acid Slime S 2", 8, 12);
        enemyArray.push(newAcidSlimeS);
    } else {
        let newSpikeSlimeM = new SpikeSlimeS("Spike Slime S 2", 10, 14);
        enemyArray.push(newSpikeSlimeM);
    }
}

function makeBlueSlaverEncounter() {
    let newEnemy = new BlueSlaver("Blue Slaver", 46, 50);
    enemyArray.push(newEnemy);
}

function makeRedSlaverEncounter() {
    let newEnemy = new RedSlaver("Red Slaver", 46, 50);
    enemyArray.push(newEnemy);
}

function makeFungiBeastsEncounter() {
    let newEnemyOne = new FungiBeast("Fungi Beast 1", 22, 28);
    enemyArray.push(newEnemyOne);
    let newEnemyTwo = new FungiBeast("Fungi Beast 2", 22, 28);
    enemyArray.push(newEnemyTwo);
}

function makeThreeLousesEncounter() {
    let randomNumberOne = getRandomNumber(2, 1);
    let randomNumberTwo = getRandomNumber(2, 1);
    let randomNumberThree = getRandomNumber(2, 1);

    if (randomNumberOne == 1) {
        let newRedLouse = new RedLouse("Red Louse 1", 10, 15);
        enemyArray.push(newRedLouse);
    } else {
        let newGreenLouse = new GreenLouse("Green Louse 1", 17, 11);
        enemyArray.push(newGreenLouse);
    }

    if (randomNumberTwo == 1) {
        let newRedLouse = new RedLouse("Red Louse 2", 10, 15);
        enemyArray.push(newRedLouse);
    } else {
        let newGreenLouse = new GreenLouse("Green Louse 2", 17, 11);
        enemyArray.push(newGreenLouse);
    }

    if (randomNumberThree == 1) {
        let newRedLouse = new RedLouse("Red Louse 2", 10, 15);
        enemyArray.push(newRedLouse);
    } else {
        let newGreenLouse = new GreenLouse("Green Louse 2", 17, 11);
        enemyArray.push(newGreenLouse);
    }
}

function makeExordiumWildlifeEncounter() {
    let randomNumberOne = getRandomNumber(2, 1);
    let randomNumberTwo = getRandomNumber(2, 1);

    if (randomNumberOne == 1) {
        let newEnemyOne = new FungiBeast("Fungi Beast 1", 22, 28);
        enemyArray.push(newEnemyOne);
    } else {
        let newJawWorm = new JawWorm("Jaw Worm", 40, 44);
    enemyArray.push(newJawWorm);
    }

    if (randomNumberTwo == 1) {
        let randomNumberThree = getRandomNumber(2, 1);

        if (randomNumberThree == 1) {
            let newRedLouse = new RedLouse("Red Louse 2", 10, 15);
            enemyArray.push(newRedLouse);
        } else {
            let newGreenLouse = new GreenLouse("Green Louse 1", 17, 11);
            enemyArray.push(newGreenLouse);
        }
    } else {
        let randomNumberFour = getRandomNumber(2, 1);

        if (randomNumberFour == 1) {
            let newAcidSlimeM = new AcidSlimeM("Acid Slime M 1", 28, 32);
            enemyArray.push(newAcidSlimeM);
        } else {
            let newSpikeSlimeM = new SpikeSlimeS("Spike Slime S 2", 10, 14);
            enemyArray.push(newSpikeSlimeM);
        }
    }
}

function makeLotsOfSlimesEncounter() {
    let newEnemyOne = new SpikeSlimeS("Spike Slime S 2", 10, 14);
    enemyArray.push(newEnemyOne);
    enemyArray.push(newEnemyOne);
    enemyArray.push(newEnemyOne);

    let newEnemyTwo = new AcidSlimeS("Acid Slime S 2", 8, 12);
    enemyArray.push(newEnemyTwo);
    enemyArray.push(newEnemyTwo);
}