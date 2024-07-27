class Enemy {
    constructor(name, healthMin, healthMax) {
        this.name = name;
        this.maxHealth = getRandomNumber(healthMax, healthMin);
        this.currentHealth = this.maxHealth;
        this.block = 0;
        this.strength = 0;
        this.dexterity = 0;
        this.vulnerable = 0;
        this.weak = 0;
        this.declaredAction = "";
        this.intentIcon = "";
    }
    takeDamage(damage) {
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
            if (damage < 0) {
                damage = 0;
            }
        }
        this.currentHealth -= damage;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        enemyHealthBar.attr("value", this.currentHealth);
        $(".enemy-health .current-health").html(this.currentHealth);
        $(".enemy-health .max-health").html(this.maxHealth);
        console.log(this.name + " takes " + damage + " damage. " + this.name + "'s health is now " + this.currentHealth + "/" + this.maxHealth + ".");
    }
    gainBlock(block) {
        this.block += block;
        console.log(this.name + " gains " + block + " block. They have " + this.block + " block.")
    }
    applyVulnerable(number) {
        this.vulnerable += number;
        console.log(this.name + " has " + this.vulnerable + " vulnerable.")
    }
    applyWeak(number) {
        this.weak += number;
        console.log(this.name + "has " + this.weak + " weak.")
    }
    preTurn() {
        $(".enemy-health .current-health").html(this.currentHealth);
        $(".enemy-health .max-health").html(this.maxHealth);
        $(".enemies .intent-icon").attr("src", ``);
        $(".enemies .damage-number").text("");
        this.decideAction();
        this.showIntent();
    }
    startTurn() {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
        this.performAction();
    }
    endRoundGeneral() {
        if (this.vulnerable != 0) {
            this.vulnerable -= 1;
            console.log(this.name + " has " + this.vulnerable + " vulnerable.");
        }
        if (this.weak != 0) {
            this.weak -= 1;
            console.log(this.name + " has " + this.weak + " weak.");
        }
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
        hero.takeDamage(damage);
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
                enemy.decideAction();
                return;
            }
            this.declaredAction = "Chomp";
            this.chompCounter++;
            this.thrashCounter = 0;
            this.bellowCounter = 0;
        } else if (randomNumber <= 55) {
            if (this.thrashCounter == 2) {
                console.log("redoing...");
                enemy.decideAction();
                return;
            }
            this.declaredAction = "Thrash";
            this.thrashCounter++;
            this.chompCounter = 0;
            this.bellowCounter = 0;
        } else {
            if (this.bellowCounter == 1) {
                console.log("redoing...");
                enemy.decideAction();
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
        let damage = 11;
        console.log(this.name + " attacks " + hero.name + ".");
        hero.takeDamage(damage);
    }
    thrash() {
        let damage = 7;
        let block = 5;
        console.log(this.name + " attacks " + hero.name + ".");
        hero.takeDamage(damage);
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
    startTurn() {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
        if (this.isCurlUpActive) {
            $(".enemy-img").attr("src", `./img/enemies/${enemy.src}.png`);
        }
        this.performAction();
    }
    decideAction() {
        let randomNumber = getRandomNumber(4, 1);
        if (randomNumber != 1) {
            if (this.biteCounter == 2) {
                enemy.decideAction();
                return;
            }
            this.declaredAction = "Bite";
            this.biteCounter++;
            this.growCounter = 0;
        }
        if (randomNumber == 1) {
            if (this.growCounter == 2) {
                enemy.decideAction();
                return;
            }
            this.declaredAction = "Grow";
            this.growCounter++;
            this.biteCounter = 0;
        }
    }
    showIntent() {
        if (this.declaredAction == "Bite") {
            let attackDamage = this.biteDamage + this.strength;
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_attack.png`);
            $(".enemies .damage-number").text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
        }
        if (this.declaredAction == "Grow") {
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_buff.png`);
            console.log(this.name + " intends to buff themselves.");
        }
    }
    performAction() {
        if (this.declaredAction == "Bite") {
            this.bite()
        }
        if (this.declaredAction == "Grow") {
            this.grow();
        }
    }
    bite() {
        let damage = this.biteDamage + this.strength;
        console.log(this.name + " attacks " + hero.name + ".");
        hero.takeDamage(damage);
    }
    grow() {
        this.stength += 3;
        console.log(this.name + " gains 3 strength. Strength is " + this.strength + ".");
    }
    takeDamage(damage) {
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
            if (damage < 0) {
                damage = 0;
            }
        }
        this.currentHealth -= damage;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        enemyHealthBar.attr("value", this.currentHealth);
        $(".enemy-health .current-health").html(this.currentHealth);
        $(".enemy-health .max-health").html(this.maxHealth);
        console.log(this.name + " takes " + damage + " damage. " + this.name + "'s health is now " + this.currentHealth + "/" + this.maxHealth + ".");
        if (!this.hasUsedCurlUp) {
            this.curlUp();
        }
    }
    curlUp() {
        $(".enemy-img").attr("src", `./img/enemies/louse-curl-up.png`);
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
    startTurn() {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
        if (this.isCurlUpActive) {
            $(".enemy-img").attr("src", `./img/enemies/${enemy.src}.png`);
        }
        this.performAction();
    }
    decideAction() {
        let randomNumber = getRandomNumber(4, 1);
        if (randomNumber != 1) {
            if (this.biteCounter == 2) {
                enemy.decideAction();
                return;
            }
            this.declaredAction = "Bite";
            this.biteCounter++;
            this.spitWebCounter = 0;
        }
        if (randomNumber == 1) {
            if (this.spitWebCounter == 2) {
                enemy.decideAction();
                return;
            }
            this.declaredAction = "Spit Web";
            this.spitWebCounter++;
            this.biteCounter = 0;
        }
    }
    showIntent() {
        if (this.declaredAction == "Bite") {
            let attackDamage = this.biteDamage + this.strength;
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_attack.png`);
            $(".enemies .damage-number").text(attackDamage);
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
        }
        if (this.declaredAction == "Spit Web") {
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_debuff.png`);
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
    }
    performAction() {
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
        hero.takeDamage(damage);
    }
    spitWeb() {
        hero.applyWeak(2);
    }
    takeDamage(damage) {
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
            if (damage < 0) {
                damage = 0;
            }
        }
        this.currentHealth -= damage;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        enemyHealthBar.attr("value", this.currentHealth);
        $(".enemy-health .current-health").html(this.currentHealth);
        $(".enemy-health .max-health").html(this.maxHealth);
        console.log(this.name + " takes " + damage + " damage. " + this.name + "'s health is now " + this.currentHealth + "/" + this.maxHealth + ".");
        if (!this.hasUsedCurlUp) {
            this.curlUp();
        }
    }
    curlUp() {
        $(".enemy-img").attr("src", `./img/enemies/louse-curl-up.png`);
        let randomNumber = getRandomNumber(7, 3);
        this.block += randomNumber;
        this.hasUsedCurlUp = true;
        this.isCurlUpActive = true;
        console.log(this.name + " curled up and gained " + randomNumber + " block.");
    }
}

let cultist = new Cultist("Cultist", 48, 54);
let jawWorm = new JawWorm("Jaw Worm", 40, 44);
let redLouse = new RedLouse("Red Louse", 10, 15);
let greenLouse = new GreenLouse("Green Louse", 17, 11);

console.log(redLouse);

// let actOneEarlyEncounters = [cultist, jawWorm, redLouse];
let actOneEarlyEncounters = [greenLouse];