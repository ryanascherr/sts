class Enemy extends Character {
    constructor(name, healthMin, healthMax) {
        super();
        this.name = name;
        this.maxHealth = getRandomNumber(healthMax, healthMin);
        this.currentHealth = this.maxHealth;
        this.declaredAction = "";
        this.intentIcon = "";
    }
    decideAction() {

    }
    showIntent() {

    }
    performAction(index) {

    }
    updateBlock(block, index) {
        if (block == 0) {
            let correctShieldContainer = $(".enemy-shield-container .block-container")[index];
            $(correctShieldContainer).addClass("d-none");
        }
        if (block != 0) {
            let correctShieldContainer = $(".enemy-shield-container .block-container")[index];
            $(correctShieldContainer).removeClass("d-none");
        }

        let correctShieldNumber = $(".enemy-shield-container .block-container .block-number")[index];
        $(correctShieldNumber).text(this.block);
    }
    updateHealth(index) {
        let enemyHealthBars = $(".enemy-health progress");
        let currentEnemyHealthBar = enemyHealthBars[index];
        $(currentEnemyHealthBar).attr("value", this.currentHealth);

        let enemyCurrentHealths = $(".enemy-health .current-health");
        let currentCurrentHealth = enemyCurrentHealths[index];
        $(currentCurrentHealth).text(this.currentHealth);
    }
    addNewStatus(statusNumber, statusName, index) {
        let correctStatus = $(".enemy-statuses")[index];
        $(correctStatus).append(`
            <div data-index=${index} class="single-status-container ${statusName}">
                <img class="status-img status-anim" src="./img/icons/icon_${statusName}.png">
                <span class="status-number" data-index=${index}>${statusNumber}</span>
            </div>
        `);
        let correctSpecificStatus = $(`.single-status-container[data-index="${index}"].${statusName} .status-img`);
        setTimeout( () => {
            $(correctSpecificStatus).removeClass("status-anim"); 
        }, 1000);
    }
    updateStatus(statusNumber, statusName, index) {
        if (statusNumber == 0) {
            $(`.enemies .single-status-container.${statusName}`).remove();
            return;
        }

        let correctStatusNumber = $(`.enemies .single-status-container.${statusName} .status-number`)[index];
        $(correctStatusNumber).text(statusNumber);

        let correctSpecificStatus = $(`.single-status-container[data-index="${index}"].${statusName} .status-img`);
        $(correctSpecificStatus).addClass("status-anim");
        setTimeout( () => {
            $(correctSpecificStatus).removeClass("status-anim"); 
        }, 1000);
    }
    preTurn(index) {
        let currentEnemy = enemyArray[index];

        let enemyCurrentHealths = $(".enemy-health .current-health");
        $(enemyCurrentHealths[index]).text(currentEnemy.currentHealth);

        let enemyMaxHealths = $(".enemy-health .max-health");
        $(enemyMaxHealths[index]).text(currentEnemy.maxHealth);

        let enemyIntents = $(".enemies .intent-icon");
        $(enemyIntents[index]).attr("src", " ");
        
        let enemyDamageNumbers = $(".enemies .damage-number");
        $(enemyDamageNumbers[index]).text("");
        
        currentEnemy.decideAction();
        currentEnemy.showIntent(index);
    }
    startTurnSpecific(index) {
        this.performAction(index);
    }
    die(index) {
        let perishedEnemy = $(".one-enemy")[index];
        $(perishedEnemy).remove();
        enemyArray.splice(index, 1);
        if (enemyArray.length == 0) {
            winFight();
        };
    }
    dieSpecific() {
    }
}

class Cultist extends Enemy {
    src = "cultist";
    hasIncanted = false;
    decideAction() {
        if (turn == 1) {
            this.declaredAction = "Incantation";
        }
        if (turn !== 1) {
            this.declaredAction = "Dark Strike";
        }

    }
    showIntent() {
        if (this.declaredAction == "Incantation") {
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_buff.png`);
            console.log(this.name + " intends to apply a buff to themselves.")
        }
        if (this.declaredAction == "Dark Strike") {
            let attackDamage = 6 + this.strength;
            if (hero.vulnerable != 0) {
                attackDamage = Math.floor(attackDamage*1.5);
            }
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_attack.png`);
            $(".enemies .damage-number").text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Incantation") {
            this.incantation(index);
        }
        if (this.declaredAction == "Dark Strike") {
            this.darkStrike(index);
        }
    }
    incantation(index) {
        this.hasIncanted = true;
        console.log(this.name + " used Incanation. CAW!");
        enemyBuff(index);
    }
    darkStrike(index) {
        let damage = 6 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
    endRoundSpecific() {
        if (this.hasIncanted && turn != 1) {
            this.strength += 3;
            console.log(this.name + " has gained 3 strength. Strength is " + this.strength + ".");
        }
    }
}

class JawWorm extends Enemy {
    src = "jaw_worm";
    chompCounter = 0;
    thrashCounter = 0;
    bellowCounter = 0;
    decideAction() {
        if (turn == 1) {
            this.declaredAction = "Chomp";
            this.chompCounter++;
            return;
        }

        let randomNumber = getRandomNumber(100, 1);

        if (randomNumber <= 25) {
            if (this.chompCounter == 1) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Chomp";
            this.chompCounter++;
            this.thrashCounter = 0;
            this.bellowCounter = 0;
        } else if (randomNumber <= 55) {
            if (this.thrashCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Thrash";
            this.thrashCounter++;
            this.chompCounter = 0;
            this.bellowCounter = 0;
        } else {
            if (this.bellowCounter == 1) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Bellow";
            this.bellowCounter++;
            this.thrashCounter = 0;
            this.chompCounter = 0;
        }
    }
    showIntent() {
        if (this.declaredAction == "Chomp") {
            let attackDamage = 11 + this.strength;
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_big-attack.png`);
            $(".enemies .damage-number").text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
        }
        if (this.declaredAction == "Thrash") {
            let attackDamage = 7 + this.strength;
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_attack-defend.png`);
            $(".enemies .damage-number").text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
            console.log(this.name + " intends to gain block.");
        }
        if (this.declaredAction == "Bellow") {
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_buff-defend.png`);
            console.log(this.name + " intends to buff themselves.")
            console.log(this.name + " intends to gain block.");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Chomp") {
            this.chomp(index);
        }
        if (this.declaredAction == "Thrash") {
            this.thrash(index);
        }
        if (this.declaredAction == "Bellow") {
            this.bellow(index);
        }
    }
    chomp(index) {
        let damage = 11 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
    thrash(index) {
        let damage = 7 + this.strength;
        let block = 5 + this.dexterity;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
        this.gainBlock(block, index);
    }
    bellow(index) {
        this.strength += 3;
        let block = 6;
        console.log(this.name + " gains 3 strength. Strength is " + this.strength + ".");
        enemyBuff(index);
        this.gainBlock(block, index);
    }
    endTurnSpecific() {
        
    }
}

class RedLouse extends Enemy {
    src = "red_louse";
    biteCounter = 0;
    growCounter = 0;
    curlUp = getRandomNumber(3, 7);
    biteDamage = getRandomNumber(7, 5);
    hasUsedCurlUp = false;
    isCurlUpActive = false;
    startFight(index) {
        this.applyCurlUp(index, this.curlUp);
    }
    applyCurlUp(index) {
        this.addNewStatus(this.curlUp, "curl-up", index);
    }
    decideAction() {
        let randomNumber = getRandomNumber(4, 1);
        if (randomNumber != 1) {
            if (this.biteCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Bite";
            this.biteCounter++;
            this.growCounter = 0;
        }
        if (randomNumber == 1) {
            if (this.growCounter == 2) {
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
            let attackDamage = this.biteDamage + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_attack.png`);

            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
        }
        if (this.declaredAction == "Grow") {
            $(currentIntentTarget).attr("src", `./img/intents/intent_buff.png`);
            console.log(this.name + " intends to buff themselves.");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Bite") {
            this.bite(index)
        }
        if (this.declaredAction == "Grow") {
            this.grow(index);
        }
    }
    bite(index) {
        let damage = this.biteDamage + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
    grow(index) {
        this.strength += 3;
        console.log(this.name + " gains 3 strength. Strength is " + this.strength + ".");
        enemyBuff(index);
    }
    takeDamageSpecific(index) {
        if (!this.hasUsedCurlUp) {
            this.curl(index);
        }
    }
    curl(index) {
        this.gainBlock(this.curlUp, index);
        this.hasUsedCurlUp = true;
        this.isCurlUpActive = true;

        let currentCurlIcon = $(`.enemy-statuses .curl-up[data-index=${index}]`);
        $(currentCurlIcon).remove();
    }
}

class GreenLouse extends Enemy {
    src = "green_louse";
    biteCounter = 0;
    spitWebCounter = 0;
    curlUp = getRandomNumber(3, 7);
    biteDamage = getRandomNumber(7, 5);
    hasUsedCurlUp = false;
    isCurlUpActive = false;
    startFight(index) {
        this.applyCurlUp(index, this.curlUp);
    }
    applyCurlUp(index) {
        this.addNewStatus(this.curlUp, "curl-up", index);
    }
    decideAction() {
        let randomNumber = getRandomNumber(4, 1);
        if (randomNumber != 1) {
            if (this.biteCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Bite";
            this.biteCounter++;
            this.spitWebCounter = 0;
        }
        if (randomNumber == 1) {
            if (this.spitWebCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Spit Web";
            this.spitWebCounter++;
            this.biteCounter = 0;
        }
    }
    showIntent(index) {

        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        if (this.declaredAction == "Bite") {
            let attackDamage = this.biteDamage + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_attack.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
        }
        if (this.declaredAction == "Spit Web") {
            $(currentIntentTarget).attr("src", `./img/intents/intent_debuff.png`);
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Bite") {
            this.bite(index)
        }
        if (this.declaredAction == "Spit Web") {
            this.spitWeb(index);
        }
    }
    bite(index) {
        let damage = this.biteDamage + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
    spitWeb(index) {
        enemyAttack(index);
        hero.applyWeak(2, index);
    }
    takeDamageSpecific(index) {
        if (!this.hasUsedCurlUp) {
            this.curl(index);
        }
    }
    curl(index) {
        this.gainBlock(this.curlUp, index);
        this.hasUsedCurlUp = true;
        this.isCurlUpActive = true;

        let currentCurlIcon = $(`.enemy-statuses .curl-up[data-index=${index}]`);
        $(currentCurlIcon).remove();
    }
}

class AcidSlimeM extends Enemy {
    src = "acid_slime-m";
    corrosiveSpitCounter = 0;
    lickCounter = 0;
    tackleCounter = 0;
    decideAction() {
        let randomNumber = getRandomNumber(100, 1);

        if (randomNumber <= 30) {
            if (this.corrosiveSpitCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Corrosive Spit";
            this.corrosiveSpitCounter++;
            this.lickCounter = 0;
            this.tackleCounter = 0;
        } else if (randomNumber <= 70) {
            if (this.lickCounter == 1) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Lick";
            this.lickCounter++;
            this.corrosiveSpitCounter = 0;
            this.tackleCounter = 0;
        } else {
            if (this.tackleCounter == 1) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Tackle";
            this.tackleCounter++;
            this.corrosiveSpitCounter = 0;
            this.lickCounter = 0;
        }
    }
    showIntent(index) {
        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        if (this.declaredAction == "Corrosive Spit") {
            let attackDamage = 7 + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_attack-debuff.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
        if (this.declaredAction == "Lick") {
            $(currentIntentTarget).attr("src", `./img/intents/intent_debuff.png`);
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
        if (this.declaredAction == "Tackle") {
            let attackDamage = 10 + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_big-attack.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Corrosive Spit") {
            this.corrosiveSpit(index)
        }
        if (this.declaredAction == "Lick") {
            this.lick(index);
        }
        if (this.declaredAction == "Tackle") {
            this.tackle(index);
        }
    }
    corrosiveSpit(index) {
        let damage = 7 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        console.log(this.name + " added a Slime to " + hero.name + "'s discard pile.");
        enemyAttack(index);
        hero.takeDamage(damage, this);
        hero.discardPile.push(4);
    }
    lick(index) {
        enemyAttack(index);
        hero.applyWeak(1, index);
    }
    tackle(index) {
        let damage = 10 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
}

class AcidSlimeS extends Enemy {
    src = "acid_slime-s";
    lickCounter = 0;
    tackleCounter = 0;
    decideAction() {
        if (turn == 1) {
            let randomNumber = getRandomNumber(2, 1);
            if (randomNumber == 1) {
                this.declaredAction = "Lick";
                this.lickCounter++;
                this.tackleCounter = 0;
            }
            if (randomNumber == 2) {
                this.declaredAction = "Tackle";
                this.tackleCounter++;
                this.lickCounter = 0;
            }
        } else {
            if (this.tackleCounter == 1) {
                this.declaredAction = "Lick";
                this.lickCounter++;
                this.tackleCounter = 0;
            } else if (this.lickCounter == 1) {
                this.declaredAction = "Tackle";
                this.tackleCounter++;
                this.lickCounter = 0;
            }
        }
    }
    showIntent(index) {
        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        if (this.declaredAction == "Lick") {
            $(currentIntentTarget).attr("src", `./img/intents/intent_debuff.png`);
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
        if (this.declaredAction == "Tackle") {
            let attackDamage = 3 + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_small-attack.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Lick") {
            this.lick(index);
        }
        if (this.declaredAction == "Tackle") {
            this.tackle(index);
        }
    }
    lick(index) {
        enemyAttack(index);
        hero.applyWeak(1, index);
    }
    tackle(index) {
        let damage = 3 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
}

class SpikeSlimeM extends Enemy {
    src = "spike_slime-m";
    lickCounter = 0;
    flameTackleCounter = 0;
    decideAction() {
        let randomNumber = getRandomNumber(100, 1);

        if (randomNumber <= 70) {
            if (this.lickCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Lick";
            this.lickCounter++;
            this.flameTackleCounter = 0;
        } else {
            if (this.flameTackleCounter == 2) {
                this.decideAction();
                return;
            }
            this.declaredAction = "Flame Tackle";
            this.flameTackleCounter++;
            this.lickCounter = 0;
        }
    }
    showIntent(index) {
        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        if (this.declaredAction == "Lick") {
            $(currentIntentTarget).attr("src", `./img/intents/intent_debuff.png`);
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
        if (this.declaredAction == "Flame Tackle") {
            let attackDamage = 8 + this.strength;
            $(currentIntentTarget).attr("src", `./img/intents/intent_attack-debuff.png`);
            $(currentDamageNumberTarget).text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Lick") {
            this.lick(index);
        }
        if (this.declaredAction == "Flame Tackle") {
            this.flameTackle(index);
        }
    }
    lick(index) {
        enemyAttack(index);
        hero.applyFrail(1, index);
    }
    flameTackle(index) {
        let damage = 8 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        console.log(this.name + " added a Slime to " + hero.name + "'s discard pile.");
        hero.discardPile.push(4);
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
}

class SpikeSlimeS extends Enemy {
    src = "spike_slime-s";
    decideAction() {
        this.declaredAction = "Tackle";
    }
    showIntent(index) {
        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        let attackDamage = 5 + this.strength;
        $(currentIntentTarget).attr("src", `./img/intents/intent_attack.png`);
        $(currentDamageNumberTarget).text(attackDamage);
        console.log(this.name + " intends to attack for " + attackDamage + " damage.");
    }
    performAction(index) {
        this.tackle(index);
    }
    tackle(index) {
        let damage = 5 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        enemyAttack(index);
        hero.takeDamage(damage, this);
    }
}

class TestEnemy extends Enemy {
    src = "acid_slime-s";
    decideAction() {
        if (Math.abs(turn % 2) == 1) {
            this.declaredAction = "Lick";
        } else {
            this.declaredAction = "Do Nothing";
        }
    }
    showIntent(index) {
        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        if (this.declaredAction == "Lick") {
            $(currentIntentTarget).attr("src", `./img/intents/intent_debuff.png`);
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
        if (this.declaredAction == "Do Nothing") {
            $(currentIntentTarget).attr("src", ``);
            console.log(this.name + " intends to do nothing.");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Lick") {
            this.lick();
        }
        if (this.declaredAction == "Do Nothing") {
            this.doNothing();
        }
    }
    lick() {
        hero.applyWeak(2);
    }
    doNothing() {
        hero.applyVulnerable(2);
        hero.applyFrail(4);
    }
}

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

class FungiBeast extends Enemy {
    src = "fungi_beast";
    biteCounter = 0;
    growCounter = 0;
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
}

// let actOneEarlyEncounters = ["blueSlaver"];
let actOneEarlyEncounters = ["cultist", "jawWorm", "louses", "slimes"];
let actOneOtherEncounters = ["blueSlaver", "fungiBeasts"];
let enemy;
let enemyArray = [];