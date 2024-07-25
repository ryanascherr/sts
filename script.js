//TODO 
//Death
//Max health being surpassed

let cards = [
    {
        id: 1,
        name: "Strike",
        class: "Ironclad",
        type: "Attack",
        rarity: "Basic",
        cost: 1,
        effect: "Deal 6 damage.",
        damage: 6,
        src: "strike_ironclad.png"
    },
    {
        id: 2,
        name: "Defend",
        class: "Ironclad",
        type: "Skill",
        rarity: "Basic",
        cost: 1,
        effect: "Gain 5 block.",
        block: 5,
        src: "defend_ironclad.png"
    },
]

let turn = 1;
let heroHealthBar = $(".hero progress");
let enemyHealthBar = $(".enemies progress");

class Character {
    constructor(name, maxHealth) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.block = 0;
        this.isVulnerable = false;
        this.isWeak = false;
        this.energy = 3;
        this.isAlive = true;
        this.handSize = 5;
        this.drawPile = [];
        this.discardPile = [];
    }
    takeDamage(damage) {
        if (this.isVulnerable) {
            damage = damage*1.5;
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
            this.isAlive = false;
        }
        heroHealthBar.attr("value", this.currentHealth);
        console.log(this.name + " takes " + damage + " damage. " + this.name + "'s health is now " + this.currentHealth + "/" + this.maxHealth + ".");

        if (!this.isAlive) {
            this.dies();
        }
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
    dies() {
        console.log(this.name + " has died. GAME OVER.");
    }
    startTurn() {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
        this.energy = 3;
        console.log(this.name + " has " + this.energy + " energy.");
    }
    endTurn() {
        
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
        this.intentIcon = "";
    }
    takeDamamge(damage) {
        if (this.isVulnerable) {
            damage = damage*1.5;
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
        console.log(this.name + " takes " + damage + " damage. " + this.name + "'s health is now " + this.currentHealth + "/" + this.maxHealth + ".");
    }
    gainBlock(block) {
        this.block += block;
        console.log(this.name + " gains " + block + " block. They have " + this.block + " block.")
    }
    startTurn() {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
    }
    endTurn() {
        
    }
}

class Ironclad extends Character {
    constructor(name, maxHealth) {
        super(name, maxHealth);
    }
    deck = [1, 1, 1, 1, 1, 2, 2, 2, 2];
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
            $(".enemies .intent-icon").attr("src", `./img/intents/intent_buff.png`);
            console.log(this.name + " intends to apply a buff to themselves.")
        }
        if (this.declaredAction == "Dark Strike") {
            let attackDamage = 6 + this.strength;
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
    chompCounter = 0;
    thrashCounter = 0;
    bellowCounter = 0;
    decideAction() {
        if (turn == 1) {
            this.declaredAction = "Chomp";
            this.chompCounter++;
            return;
        }

        let randomNumber = Math.floor(Math.random() * (100 - 1 + 1) + 1);
        console.log(randomNumber);

        if (randomNumber <= 25) {
            if (this.chompCounter == 1) {
                console.log("redoing...");
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

function startPlayerTurn() {
    console.log("-- Turn " + turn + " --");
    hero.startTurn();
    enemy.decideAction();
    enemy.showIntent();
    hero.drawPile = hero.deck;
    dealCards();
}

function dealCards() {
    for (let i = 0; i < hero.handSize; i++) {
        if (hero.drawPile.length == 0) {
            makeNewDrawPile();
        }

        let randomIndex = Math.floor(Math.random() * hero.drawPile.length);
        let randomCardId = hero.drawPile[randomIndex];

        cards.forEach(card => {
            if (randomCardId == card.id) {
                $(".hand").append(`<img class="card" data-id="${card.id}" src="./img/cards/${card.src}">`);
            }
        });

        hero.drawPile.splice(randomIndex, 1);
    }
}
function discardCards() {
    let remainingCards = document.querySelectorAll(".card");
    remainingCards.forEach(card => {
        let cardId = parseInt($(card).attr("data-id"));
        hero.discardPile.push(cardId);
        $(card).remove();
    })
}
function makeNewDrawPile() {
    hero.drawPile = hero.discardPile;
    hero.discardPile = [];
}

function endPlayerTurn() {
    discardCards();
}
function startEnemyTurn() {
    enemy.performAction();
    endEnemyTurn();
    if (!hero.isAlive) {
        gameOver();
    }
}
function endEnemyTurn() {
    enemy.endOfTurn();
    turn ++;
    startPlayerTurn();
}

function gameOver() {
    console.log("GAME OVER");
}

let ironclad = new Ironclad("Ironclad", 70);

let cultist = new Cultist("Cultist", 48, 54);
let jawWorm = new JawWorm("Jaw Worm", 40, 44);

let hero = ironclad;
let enemy = cultist;

console.log(hero);

$(document).on('click','.card',function(){
    let cardId = parseInt($(this).attr("data-id")-1);
    let card = cards[cardId];
    let cost = card.cost;
    if (hero.energy < cost) return;
    if (card.type == "Attack") {
        let damageNumber = card.damage;
        enemy.takeDamamge(damageNumber);
    }
    if (card.type == "Skill") {
        if (card.block) {
            let blockNumber = card.block;
            hero.gainBlock(blockNumber);
        }
    }
    hero.energy -= cost;

    hero.discardPile.push(cardId+1);
    console.log(hero.discardPile);
    $(this).remove();
});

$(".end-turn").click(function() {
    endPlayerTurn();
    startEnemyTurn();

});

$(heroHealthBar).attr("value", hero.currentHealth);
$(heroHealthBar).attr("max", hero.maxHealth);
$(enemyHealthBar).attr("value", enemy.currentHealth);
$(enemyHealthBar).attr("max", enemy.maxHealth);
startPlayerTurn();

  
  

  