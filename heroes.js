class Character {
    constructor(name, maxHealth) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.block = 0;
        this.strength = 0;
        this.dexterity = 0;
        this.vulnerable = 0;
        this.newVulnerable = false;
        this.weak = 0;
        this.newWeak = false;
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
        if (enemy.weak != 0) {
            damage = Math.floor(damage*.75);
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
        if (this.vulnerable == 0) {
            this.newVulnerable = true;
        }
        this.vulnerable += number;
        console.log(this.name + "has " + this.vulnerable + " vulnerable.")
    }
    applyWeak(number) {
        if (this.vulnerable == 0) {
            this.newWeak = true;
        }
        this.weak += number;
        console.log(this.name + " has " + this.weak + " weak.")
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
    endRoundGeneral() {
        if (this.vulnerable != 0) {
            if (this.newVulnerable) {
                this.newVulnerable = false;
                return;
            }
            this.vulnerable -= 1;
            console.log(this.name + " has " + this.vulnerable + " vulnerable.");
        }
        if (this.weak != 0) {
            if (this.newWeak) {
                this.newWeak = false;
                return;
            }
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

let ironclad = new Ironclad("Ironclad", 70);