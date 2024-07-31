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
        if (hero.weak != 0) {
            damage = Math.floor(damage*.75);
        }
        if (this.vulnerable != 0) {
            damage = Math.floor(damage*1.5);
        }
        if (this.block != 0) {
            let currentBlock = this.block;
            this.block -= damage;
            if (this.block < 0) {
                this.block = 0;
            }
            if (this.block == 0) {
                let correctShieldContainer = $(".enemy-shield-container .block-container")[index];
                $(correctShieldContainer).addClass("d-none");
            }
            let correctShieldNumber = $(".enemy-shield-container .block-container .block-number")[index];
            $(correctShieldNumber).html(this.block);
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
    gainBlock(block, index) {
        if (this.frail != 0) {
            block = Math.floor(block*.75);
        }
        this.block += block;
        if (this.block != 0) {
            let correctShieldContainer = $(".enemy-shield-container .block-container")[index];
            let correctShieldNumber = $(".enemy-shield-container .block-container .block-number")[index];
            $(correctShieldContainer).removeClass("d-none");
            $(correctShieldNumber).html(this.block);
        }
        console.log(this.name + " gains " + block + " block. They have " + this.block + " block.");
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
        let correctStatusNumber = $(`.enemies .single-status-container.${statusName} .status-number`)[index];
        $(correctStatusNumber).html(statusNumber);

        let correctSpecificStatus = $(`.single-status-container[data-index="${index}"].${statusName} .status-img`);
        $(correctSpecificStatus).addClass("status-anim");
        setTimeout( () => {
            $(correctSpecificStatus).removeClass("status-anim"); 
        }, 1000);
    }
    die(index) {
        let perishedEnemy = $(".one-enemy")[index];
        $(perishedEnemy).remove();
        enemyArray.splice(index, 1);
        if (enemyArray.length == 0) {
            winFight();
            return;
        };

        this.dieSpecific(index);
    }
    startFight() {

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
            
            let correctShieldContainer = $(".enemy-shield-container .block-container")[index];
            $(correctShieldContainer).addClass("d-none");
            
            let correctShieldNumber = $(".enemy-shield-container .block-container .block-number")[index];
            $(correctShieldNumber).html(this.block);
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
    dieSpecific() {
    }
}

class Cultist extends Enemy2 {
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

class JawWorm extends Enemy2 {
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

class RedLouse extends Enemy2 {
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

class GreenLouse extends Enemy2 {
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

class AcidSlimeM extends Enemy2 {
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

class AcidSlimeS extends Enemy2 {
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

class SpikeSlimeM extends Enemy2 {
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

class SpikeSlimeS extends Enemy2 {
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

class TestEnemy extends Enemy2 {
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

class BlueSlaver extends Enemy2 {
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

class FungiBeast extends Enemy2 {
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
