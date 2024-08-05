class BlueSlaver extends Enemy {
    src = "blue_slaver";
    stabCounter = 0;
    rakeCounter = 0;
    decideAction() {
        let randomNumber = getRandomNumber(10, 1);

        if (randomNumber <= 6) {
            if (this.stabCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Stab";
            this.stabCounter++;
            this.rakeCounter = 0;
        } else {
            if (this.rakeCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Rake";
            this.rakeCounter++;
            this.stabCounter = 0;
        }
    }
    showIntent(index) {
        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        if (this.declaredAction == "Stab") {
            let attackDamage = 12 + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_big-attack.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + ".");
        }
        if (this.declaredAction == "Rake") {
            let attackDamage = 7 + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_attack-debuff.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Stab") {
            this.stab(index);
        }
        if (this.declaredAction == "Rake") {
            this.rake(index);
        }
    }
    stab(index) {
        let damage = 12 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
    rake(index) {
        let damage = 7 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
        hero.applyWeak(1, index);
    }
}

class RedSlaver extends Enemy {
    src = "red_slaver";
    stabCounter = 0;
    scrapeCounter = 0;
    patternOneNumber = 1;
    hasEntangled = false;
    decideAction() {
        if (turn == 1) {
            console.log("turn 1");
            this.declaredAction = "Stab";
        } else {
            console.log("not turn 1");
            if (this.hasEntangled == false) {
                console.log("not entangled");
                let randomNumber = getRandomNumber(4, 1);

                if (randomNumber == 1) {
                    console.log("rand num 1");
                    this.declaredAction = "Entangle";
                    this.hasEntangled = true;
                    this.stabCounter = 0;
                    this.scrapeCounter = 0;
                } else {
                    console.log("rand num not 1");
                    if (this.patternOneNumber <= 2) {
                        console.log("pattern num 1 or 2");
                        this.declaredAction = "Scrape";
                        this.patternOneNumber++;
                    } else {
                        console.log("pattern num 3");
                        this.declaredAction = "Stab";
                        this.patternOneNumber == 1;
                    }
                }
            } else {
                let randomNumber = getRandomNumber(100, 1);

                if (randomNumber <= 55) {
                    if (this.scrapeCounter == 2) {
                        this.decideAction();
                        return;
                    }
                    this.declaredAction = "Scrape";
                    this.scrapeCounter++;
                    this.stabCounter = 0;
                } else {
                    if (this.stabCounter == 2) {
                        this.decideAction();
                        return;
                    }
                    this.declaredAction = "Stab";
                    this.stabCounter++;
                    this.scrapeCounter = 0;
                }
            }
        }
    }
    showIntent(index) {
        console.log("umm");
        console.log(this.declaredAction);
        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        if (this.declaredAction == "Stab") {
            console.log("heelo?")
            let attackDamage = 13 + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_big-attack.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + ".");
        }
        if (this.declaredAction == "Scrape") {
            let attackDamage = 8 + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_attack-debuff.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
        if (this.declaredAction == "Entangle") {
            $(currentIntentTarget).attr("src", `./img/intents/intent_debuff-2.png`);
        }
    }
    performAction(index) {
        if (this.declaredAction == "Stab") {
            this.stab(index);
        }
        if (this.declaredAction == "Scrape") {
            this.scrape(index);
        }
        if (this.declaredAction == "Entangle") {
            this.entangle(index);
        }
    }
    stab(index) {
        let damage = 13 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
    scrape(index) {
        console.log("scraping!")
        let damage = 8 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
        hero.applyVulnerable(1, index);
    }
    entangle(index) {
        enemyAttack(index);
        hero.applyEntangled(1, index);
    }
}

class FungiBeast extends Enemy {
    src = "fungi_beast";
    sporeCloud = 0;
    biteCounter = 0;
    growCounter = 0;
    startFightSpecific(index) {
        this.applySporeCloud(2, index);
    }
    applySporeCloud(number, index) {
        this.sporeCloud = number;
        console.log(this.name + " has " + this.sporeCloud + " spore cloud.");

        this.addNewStatus(this.sporeCloud, "spore-cloud", index);
    }
    decideAction() {
        let randomNumber = getRandomNumber(10, 1);

        if (randomNumber <= 6) {
            if (this.biteCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Bite";
            this.biteCounter++;
            this.growCounter = 0;
        } else {
            if (this.growCounter == 1) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Grow";
            this.growCounter++;
            this.biteCounter = 0;
        }
    }
    showIntent(index) {
        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        if (this.declaredAction == "Bite") {
            let attackDamage = 6 + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_attack.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + ".");
        }
        if (this.declaredAction == "Grow") {
            $(currentIntentTarget).attr("src", `./img/intents/intent_buff.png`);
            console.log(this.name + " intends to buff themselves.");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Bite") {
            this.bite(index);
        }
        if (this.declaredAction == "Grow") {
            this.grow(index);
        }
    }
    bite(index) {
        let damage = 6 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
    grow(index) {
        this.strength += 3;
        enemyBuff(index);
        console.log(this.name + " gains 3 strength. Strength is " + this.strength + ".");
    }
    dieSpecific(index) {
        hero.applyVulnerable(2);
    }
}