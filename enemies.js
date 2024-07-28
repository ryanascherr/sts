class Enemy {
    constructor(name, healthMin, healthMax) {
        this.name = name;
        this.maxHealth = getRandomNumber(healthMax, healthMin);
        this.currentHealth = this.maxHealth;
        this.block = 0;
        this.strength = 0;
        this.dexterity = 0;
        this.vulnerable = 0;
        this.newVulnerable = false;
        this.weak = 0;
        this.frail = 0;
        this.declaredAction = "";
        this.intentIcon = "";
    }
    takeDamage(damage, index) {
        if (this.vulnerable != 0) {
            damage = Math.floor(damage*1.5);
        }
        if (hero.weak != 0) {
            damage = Math.floor(damage*.75);
        }
        if (this.block != 0) {
            let currentBlock = this.block;
            this.block -= damage;
            if (this.block < 0) {
                this.block = 0;
            }
            damage = damage - currentBlock;
            if (damage <= 0) {
                damage = 0;
            }
        }
        this.currentHealth -= damage;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }

        let enemyHealthBars = $(".enemy-health progress");
        let currentEnemyHealthBar = enemyHealthBars[index];
        $(currentEnemyHealthBar).attr("value", this.currentHealth);

        let enemyCurrentHealths = $(".enemy-health .current-health");
        let currentCurrentHealth = enemyCurrentHealths[index];
        $(currentCurrentHealth).html(this.currentHealth);

        let enemyMaxHealths = $(".enemy-health .max-health");
        let currentMaxtHealth = enemyMaxHealths[index];
        $(currentMaxtHealth).html(this.maxHealth);

        console.log(this.name + " takes " + damage + " damage. " + this.name + "'s health is now " + this.currentHealth + "/" + this.maxHealth + ".");

        if (this.currentHealth <= 0) {
            this.die(index);
        }

        this.takeDamageSpecific(index);
    }
    gainBlock(block) {
        this.block += block;
        console.log(this.name + " gains " + block + " block. They have " + this.block + " block.")
    }
    applyVulnerable(number, index) {
        if (this.vulnerable == 0) {
            this.newVulnerable = true;
        }

        this.vulnerable += number;
        console.log(this.name + " has " + this.vulnerable + " vulnerable.");

        if (this.newVulnerable) {
            this.addNewStatus(this.vulnerable, "vulnerable", index);
        } else {
            this.updateStatus(this.vulnerable, "vulnerable", index);
        }
    }
    applyWeak(number) {
        this.weak += number;
        console.log(this.name + "has " + this.weak + " weak.")
    }
    applyFrail(number) {
        if (this.frail == 0) {
            this.newFrail = true;
        }
        this.frail += number;
        console.log(this.name + " has " + this.frail + " frail.")
    }
    addNewStatus(statusNumber, statusName, index) {
        let correctStatus = $(".enemy-statuses")[index];
        $(correctStatus).append(`
            <div data-index=${index} class="single-status-container ${statusName}">
                <img class="status-img" src="./img/icons/icon_${statusName}.png">
                <span class="status-number" data-index=${index}>${statusNumber}</span>
            </div>
        `);
    }
    updateStatus(statusNumber, statusName, index) {
        let correctStatusNumber = $(`.enemies .single-status-container.${statusName} .status-number`)[index];
        $(correctStatusNumber).html(statusNumber);
    }
    die(index) {
        let perishedEnemy = $(".one-enemy")[index];
        $(perishedEnemy).remove();
        enemyArray.splice(index, 1);
        console.log(enemyArray);
        if (enemyArray.length == 0) {
            winFight();
        }
    }
    preTurn(index) {
        let currentEnemy = enemyArray[index];

        let enemyCurrentHealths = $(".enemy-health .current-health");
        $(enemyCurrentHealths[index]).html(currentEnemy.currentHealth);

        let enemyMaxHealths = $(".enemy-health .max-health");
        $(enemyMaxHealths[index]).html(currentEnemy.maxHealth);

        let enemyIntents = $(".enemies .intent-icon");
        $(enemyIntents[index]).attr("src", " ");
        
        let enemyDamageNumbers = $(".enemies .damage-number");
        $(enemyDamageNumbers[index]).html("");
        
        currentEnemy.decideAction();
        currentEnemy.showIntent(index);
    }
    startTurn(index) {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
        this.performAction(index);
    }
    endRoundGeneral(index) {
        if (this.vulnerable != 0) {
            this.newVulnerable = false;
            this.vulnerable -= 1;
            console.log(this.name + " has " + this.vulnerable + " vulnerable.");

            let statusBox = ($(`.enemies .single-status-container.vulnerable[data-index="${index}"]`));
            let numberBox = $(`.enemies .single-status-container.vulnerable .status-number[data-index="${index}"]`)
            if (this.vulnerable == 0) {
                $(statusBox).remove();
            } else {
                $(numberBox).html(this.vulnerable);
            }
        }
        //TODO work on these
        if (this.weak != 0) {
            this.weak -= 1;
            console.log(this.name + " has " + this.weak + " weak.");
        }
        if (this.frail != 0) {
            this.frail -= 1;
            console.log(this.name + " has " + this.frail + " frail.");
        }
    }
    endRoundSpecific() {
    }
    takeDamageSpecific() {
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
    performAction() {
        if (this.declaredAction == "Incantation") {
            this.incantation();
        }
        if (this.declaredAction == "Dark Strike") {
            this.darkStrike();
        }
    }
    incantation() {
        this.hasIncanted = true;
        console.log(this.name + " used Incanation. CAW!");
    }
    darkStrike() {
        let damage = 6 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
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
    performAction() {
        if (this.declaredAction == "Chomp") {
            this.chomp();
        }
        if (this.declaredAction == "Thrash") {
            this.thrash();
        }
        if (this.declaredAction == "Bellow") {
            this.bellow();
        }
    }
    chomp() {
        let damage = 11 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        hero.takeDamage(damage, this);
    }
    thrash() {
        let damage = 7 + this.strength;
        let block = 5 + this.dexterity;
        console.log(this.name + " attacks " + hero.name + ".");
        hero.takeDamage(damage, this);
        this.gainBlock(block);
    }
    bellow() {
        this.strength += 3;
        let block = 6;
        console.log(this.name + " gains 3 strength. Strength is " + this.strength + ".");
        this.gainBlock(block);
    }
    endTurnSpecific() {
        
    }
}

class RedLouse extends Enemy {
    src = "red_louse";
    biteCounter = 0;
    growCounter = 0;
    biteDamage = getRandomNumber(7, 5);
    hasUsedCurlUp = false;
    isCurlUpActive = false;
    startTurn(index) {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
        if (this.isCurlUpActive) {
            let enemyImages = $(".enemy-img");
            let currentEnemyImage = enemyImages[index];
            $(currentEnemyImage).attr("src", `./img/enemies/${this.src}.png`);
        }
        this.performAction(index);
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
    bite() {
        let damage = this.biteDamage + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        hero.takeDamage(damage, this);
    }
    grow() {
        this.strength += 3;
        console.log(this.name + " gains 3 strength. Strength is " + this.strength + ".");
    }
    takeDamageSpecific(index) {
        if (!this.hasUsedCurlUp) {
            this.curlUp(index);
        }
    }
    curlUp(index) {
        let enemyImages = $(".enemy-img");
        let currentEnemyImage = enemyImages[index];
        $(currentEnemyImage).attr("src", `./img/enemies/louse-curl-up.png`);
        let randomNumber = getRandomNumber(7, 3);
        this.block += randomNumber;
        this.hasUsedCurlUp = true;
        this.isCurlUpActive = true;
        console.log(this.name + " curled up and gained " + randomNumber + " block.");
    }
}

class GreenLouse extends Enemy {
    src = "green_louse";
    biteCounter = 0;
    spitWebCounter = 0;
    biteDamage = getRandomNumber(7, 5);
    hasUsedCurlUp = false;
    isCurlUpActive = false;
    startTurn(index) {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
        if (this.isCurlUpActive) {
            let enemyImages = $(".enemy-img");
            let currentEnemyImage = enemyImages[index];
            $(currentEnemyImage).attr("src", `./img/enemies/${this.src}.png`);
        }
        this.performAction();
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
            this.bite()
        }
        if (this.declaredAction == "Spit Web") {
            this.spitWeb();
        }
    }
    bite() {
        let damage = this.biteDamage + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        hero.takeDamage(damage, this);
    }
    spitWeb() {
        hero.applyWeak(2);
    }
    takeDamageSpecific(index) {
        if (!this.hasUsedCurlUp) {
            this.curlUp(index);
        }
    }
    curlUp(index) {
        let enemyImages = $(".enemy-img");
        let currentEnemyImage = enemyImages[index];
        $(currentEnemyImage).attr("src", `./img/enemies/louse-curl-up.png`);
        let randomNumber = getRandomNumber(7, 3);
        this.block += randomNumber;
        this.hasUsedCurlUp = true;
        this.isCurlUpActive = true;
        console.log(this.name + " curled up and gained " + randomNumber + " block.");
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
            //add card to discard
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
            this.corrosiveSpit()
        }
        if (this.declaredAction == "Lick") {
            this.lick();
        }
        if (this.declaredAction == "Tackle") {
            this.tackle();
        }
    }
    corrosiveSpit() {
        let damage = 7 + this.strength;
        //add slimed
        console.log(this.name + " attacks " + hero.name + ".");
        hero.takeDamage(damage, this);
    }
    lick() {
        hero.applyWeak(1);
    }
    tackle() {
        let damage = 10 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
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
            this.lick();
        }
        if (this.declaredAction == "Tackle") {
            this.tackle();
        }
    }
    lick() {
        hero.applyWeak(1);
    }
    tackle() {
        let damage = 3 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
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
            this.lick();
        }
        if (this.declaredAction == "Flame Tackle") {
            this.flameTackle();
        }
    }
    lick() {
        hero.applyFrail(1);
    }
    flameTackle() {
        let damage = 8 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        //slimed
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
        this.tackle();
    }
    tackle() {
        let damage = 5 + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
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
        hero.applyWeak(3);
    }
    doNothing() {
        hero.applyVulnerable(2);
        hero.applyFrail(4);
    }
}

let actOneEarlyEncounters = ["cultist", "jawWorm", "louses", "slimes"];
// let actOneEarlyEncounters = ["slimes"];
let enemy;
let enemyArray = [];
