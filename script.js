//TODO 
//Death
//Enemy turn order with block
//Negative number with block
//Max health being surpassed

let turn = 1;

class Character {
    constructor(name, maxHealth) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.block = 0;
        this.isVulnerable = false;
        this.isWeak = false;
        this.energy = 3;
    }
    takeDamage(damage) {
        if (this.isVulnerable) {
            damage = damage*1.5;
        }
        if (this.block != 0) {
            damage = damage - this.block;
        }
        this.currentHealth -= damage;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        console.log(this.name + " takes " + damage + " damage. " + this.name + "'s health is now " + this.currentHealth + "/" + this.maxHealth + ".");
    }
    gainHealth(health) {
        this.currentHealth += health;
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        return this.name + " gained " + health + " health. " + this.name + "'s current health is " + this.currentHealth + "/" + this.maxHealth + ".";
    }
    gainBlock(block) {
        this.block += block;
        console.log(this.name + " gains " + block + " block. They have " + this.block + " block.")
    }
    becomeVulnerable() {
        this.isVulnerable = true;
    }
    recoverVulnerable() {
        this.isVulnerable = false;
    }
    becomeWeak() {
        this.isWeak = true;
    }
    recoverWeak() {
        this.isWeak = false;
    }
    endTurn() {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
        this.energy = 3;
    }
}

class Enemy {
    constructor(name, healthMin, healthMax) {
        this.name = name;
        this.maxHealth = Math.floor(Math.random() * (healthMax - healthMin + 1) + healthMin);
        this.currentHealth = this.maxHealth;
        this.block = 0;
        this.strength = 0;
        this.dexterity = 0;
        this.declaredAction = "";
    }
    takeDamamge(damage) {
        if (this.isVulnerable) {
            damage = damage*1.5;
        }
        this.currentHealth -= damage;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        console.log(this.name + " takes " + damage + " damage. " + this.name + "'s health is now " + this.currentHealth + "/" + this.maxHealth + ".");
    }
    gainBlock(block) {
        this.block += block;
        console.log(this.name + " gains " + block + " block. They have " + this.block + " block.")
    }
    endTurn() {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
    }
}

class Ironclad extends Character {
    constructor(name, maxHealth) {
        super(name, maxHealth);
    }
    deck = ['strike', 'strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend'];
}

class Cultist extends Enemy {
    constructor(name, healthMin, healthMax) {
        super(name, healthMin, healthMax);
    }
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
            console.log(this.name + " intends to apply a buff to themselves.")
        }
        if (this.declaredAction == "Dark Strike") {
            let attackDamage = 6 + this.strength;
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
    endOfTurn() {
        if (this.hasIncanted && turn != 1) {
            this.strength += 3;
            console.log(this.name + " has gained +3 strength. Strength is " + this.strength + ".");
        }
    }
}

class JawWorm extends Enemy {
    constructor(name, healthMin, healthMax) {
        super(name, healthMin, healthMax);
    }
    decideAction() {
        let randomNumber = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        if (randomNumber == 1) {
            this.declaredAction = "Chomp";
        }
        if (randomNumber == 2) {
            this.declaredAction = "Thrash";
        }
        if (randomNumber == 3) {
            this.declaredAction = "Bellow";
        }
    }
    showIntent() {
        if (this.declaredAction == "Chomp") {
            let attackDamage = 11 + this.strength;
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
        }
        if (this.declaredAction == "Thrash") {
            let attackDamage = 7 + this.strength;
            console.log(this.name + " intends to attack for " + attackDamage + " damage.");
            console.log(this.name + " intends to gain block.");
        }
        if (this.declaredAction == "Bellow") {
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
        console.log(this.name + " gains + 3 strength. Strength is " + this.strength + ".");
        this.gainBlock(block);
    }
    endOfTurn() {
        
    }
}

function startTurn() {
    console.log("-- Turn " + turn + " --");
    // dealCards();
    enemy.decideAction();
    enemy.showIntent();
}

function endTurn() {
    enemy.performAction();
    enemy.endOfTurn();
    hero.endTurn();
    turn ++;
}

let ironclad = new Ironclad("Ironclad", 70);

let cultist = new Cultist("Cultist", 48, 54);
let jawWorm = new JawWorm("Jaw Worm", 40, 44);

let hero = ironclad;
let enemy = jawWorm;

console.log(hero);

$(".damage").click(function() {
    let energyNumber = parseInt($(this).attr("data-energy"));
    if (hero.energy < energyNumber) return;
    let damageNumber = parseInt($(this).attr("data-number"));
    enemy.takeDamamge(damageNumber);
    hero.energy -= energyNumber;
});

$(".block").click(function() {
    let energyNumber = parseInt($(this).attr("data-energy"));
    if (hero.energy < energyNumber) return;
    let blockNumber = parseInt($(this).attr("data-number"));
    hero.gainBlock(blockNumber);
    hero.energy -= energyNumber;
});

$(".end-turn").click(function() {
    endTurn();
    startTurn();
});

startTurn();

// startTurn();
// endTurn();
// startTurn();
// endTurn();
// startTurn();
// endTurn();


// console.log(hero.currentHealth);
// console.log(cultist.strength);
// cultist.incantation();
// console.log(cultist.strength);
// cultist.darkStrike();
// console.log(hero.currentHealth);

// cultist.decideAction();
// cultist.endOfTurn();
// cultist.decideAction();
// cultist.endOfTurn();
// cultist.decideAction();
// cultist.endOfTurn();

  
  

  