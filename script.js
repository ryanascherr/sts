//TODO 
//Death

// let cards = [
//     {
//         id: 1,
//         name: "Strike",
//         class: "Ironclad",
//         type: "Attack",
//         rarity: "Basic",
//         cost: 1,
//         effect: "Deal 6 damage.",
//         damage: 6,
//         src: "strike_ironclad.png"
//     },
//     {
//         id: 2,
//         name: "Defend",
//         class: "Ironclad",
//         type: "Skill",
//         rarity: "Basic",
//         cost: 1,
//         effect: "Gain 5 block.",
//         block: 5,
//         src: "defend_ironclad.png"
//     },
//     {
//         id: 3,
//         name: "Defend",
//         class: "Ironclad",
//         type: "Skill",
//         rarity: "Basic",
//         cost: 1,
//         effect: "Gain 5 block.",
//         block: 5,
//         src: "bash.png"
//     },
// ];

class Character {
    constructor(name, maxHealth) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.block = 0;
        this.strength = 0;
        this.dexterity = 0;
        this.vulnerable = 0;
        this.weak = 0;
        this.energy = 3;
        this.isAlive = true;
        this.handSize = 5;
        this.drawPile = [];
        this.discardPile = [];
    }
    takeDamage(damage) {
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
                $(".hero-shield-container .block-container").addClass("d-none");
            }
            $(".hero-shield-container .block-container .block-number").html(this.block);
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
        $(".hero-health .current-health").html(this.currentHealth);
        $(".hero-health .max-health").html(this.maxHealth);
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
        $(".hero-health .current-health").html(this.currentHealth);
        $(".hero-health .max-health").html(this.maxHealth);
        console.log(this.name + " gained " + health + " health. " + this.name + "'s current health is " + this.currentHealth + "/" + this.maxHealth + ".");
    }
    gainBlock(block) {
        this.block += block;
        if (this.block != 0) {
            $(".hero-shield-container .block-container").removeClass("d-none");
            $(".hero-shield-container .block-container .block-number").html(this.block);
        }
        console.log(this.name + " gains " + block + " block. They have " + this.block + " block.")
    }
    applyVulnerable(number) {
        this.vulnerable += number;
        console.log(this.name + "has " + this.vulnerable + " vulnerable.")
    }
    applyWeak(number) {
        this.weak += number;
        console.log(this.name + "has " + this.weak + " weak.")
    }
    dies() {
        console.log(this.name + " has died. GAME OVER.");
    }
    dealCards() {
        for (let i = 0; i < this.handSize; i++) {
            if (this.drawPile.length == 0) {
                this.makeNewDrawPile();
            }
    
            let randomIndex = Math.floor(Math.random() * this.drawPile.length);
            let randomCardId = hero.drawPile[randomIndex];
    
            cardsArray.forEach(card => {
                if (randomCardId == card.id) {
                    $(".hand").append(`<img class="card" data-id="${card.id}" src="./img/cards/${card.src}">`);
                }
            });
    
            this.drawPile.splice(randomIndex, 1);
        }
    }
    makeNewDrawPile() {
        this.drawPile = this.discardPile;
        this.discardPile = [];
    }
    discardCards() {
        let remainingCards = document.querySelectorAll(".card");
        remainingCards.forEach(card => {
            let cardId = parseInt($(card).attr("data-id"));
            this.discardPile.push(cardId);
            $(card).remove();
        })
    }
    startTurn() {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
            $(".hero-shield-container .block-container").addClass("d-none");
            $(".hero-shield-container .block-container .block-number").html(this.block);
        }
        this.energy = 3;
        $(".hero-energy").html(this.energy);
        $(".hero-health .current-health").html(this.currentHealth);
        $(".hero-health .max-health").html(this.maxHealth);
        console.log(this.name + " has " + this.energy + " energy.");
        this.drawPile = hero.deck;
        this.dealCards();
    }
    endTurn() {
        this.discardCards();
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
        this.vulnerable = 0;
        this.weak = 0;
        this.declaredAction = "";
        this.intentIcon = "";
    }
    takeDamage(damage) {
        if (this.vulnerable != 0) {
            damage = Math.floor(damage*1.5);
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
    startTurn() {
        if (this.block != 0) {
            this.block = 0;
            console.log(this.name + " loses all block.");
        }
        $(".enemy-health .current-health").html(this.currentHealth);
        $(".enemy-health .max-health").html(this.maxHealth);
        this.decideAction();
        this.showIntent();
    }
    endTurnGeneral() {
        if (hero.vulnerable != 0) {
            hero.vulnerable -= 1;
            console.log(hero.name + " has " + hero.vulnerable + " vulnerable.");
        }
        if (hero.weak != 0) {
            hero.weak -= 1;
            console.log(hero.name + " has " + hero.weak + " weak.");
        }
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

class Ironclad extends Character {
    constructor(name, maxHealth) {
        super(name, maxHealth);
    }
    deck = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3];
}

class Cultist extends Enemy {
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
    endTurnSpecific() {
        if (this.hasIncanted && turn != 1) {
            this.strength += 3;
            console.log(this.name + " has gained +3 strength. Strength is " + this.strength + ".");
        }
    }
}

class JawWorm extends Enemy {
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
    endTurn() {
        
    }
}

let ironclad = new Ironclad("Ironclad", 70);
let cultist = new Cultist("Cultist", 48, 54);
let jawWorm = new JawWorm("Jaw Worm", 40, 44);

let hero = ironclad;
let enemy = cultist;

class Card {
    constructor(id, name, character, type, rarity, cost, effect, src) {
        this.id = id;
        this.name = name;
        this.character = character;
        this.type = type;
        this.rarity = rarity;
        this.cost = cost;
        this.effect = effect;
        this.src = src;
    }
}

class Strike_Ironclad extends Card {
    performEffect() {
        enemy.takeDamage(6+hero.strength);
    }
}
class Defend_Ironclad extends Card {
    performEffect() {
        hero.gainBlock(5+hero.dexterity);
    }
}
class Bash extends Card {
    performEffect() {
        let damage = 8 + hero.strength;
        enemy.takeDamage(damage);
        enemy.applyVulnerable(2);
    }
}

let strike_ironclad = new Strike_Ironclad(1, "Strike", "Ironclad", "Attack", "Common", 1, "Deal 6 damage.", "strike_ironclad.png");
let defend_ironclad = new Defend_Ironclad(2, "Defend", "Ironclad", "Skill", "Common", 1, "Gain 5 block.", "defend_ironclad.png");
let bash = new Bash(3, "Bash", "Ironclad", "Attack", "Common", 2, "Deal 8 damage. Apply 2 Vulnerable.", "bash.png");

let cardsArray = [strike_ironclad, defend_ironclad, bash];

let turn = 1;
let heroHealthBar = $(".hero progress");
let enemyHealthBar = $(".enemies progress");

function startPlayerTurn() {
    console.log("-- Turn " + turn + " --");
    hero.startTurn();
    enemy.startTurn();
}

function endPlayerTurn() {
    hero.endTurn();
}
function startEnemyTurn() {
    enemy.performAction();
    endEnemyTurn();
    if (!hero.isAlive) {
        gameOver();
    }
}
function endEnemyTurn() {
    enemy.endTurnSpecific();
    enemy.endTurnGeneral();
    turn ++;
    startPlayerTurn();
}

function gameOver() {
    console.log("GAME OVER");
}

$(document).on('click','.card',function(){
    let cardId = parseInt($(this).attr("data-id"));
    let chosenCard;
    $(cardsArray).each(function() {
        if (this.id == cardId) {
            chosenCard = this;
        }
    });
    let cost = chosenCard.cost;
    if (hero.energy < cost) return;
    hero.energy -= cost;
    $(".hero-energy").html(hero.energy);
    chosenCard.performEffect();
    hero.discardPile.push(cardId);
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

  
  

  