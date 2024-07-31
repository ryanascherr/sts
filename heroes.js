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
        this.frail = 0;
        this.newFrail = false;
        this.energy = 3;
        this.isAlive = true;
        this.handSize = 5;
        this.drawPile = [];
        this.discardPile = [];
    }
    takeDamage(damage, attacker) {
        if (attacker.weak != 0) {
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

        updateHealth();

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

        updateHealth();
    }
    gainBlock(block) {
        if (this.frail != 0) {
            block = Math.floor(block*.75);
        }
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
        console.log(this.name + " has " + this.vulnerable + " vulnerable.");

        let noVulnerableCurrently = $(".hero .single-status-container.vulnerable").length == 0;
        if (this.newVulnerable && noVulnerableCurrently) {
            this.addNewStatus(this.vulnerable, "vulnerable");
        } else {
            this.updateStatus(this.vulnerable, "vulnerable");
        }
    }
    applyWeak(number) {
        if (this.weak == 0) {
            this.newWeak = true;
        }

        this.weak += number;
        console.log(this.name + " has " + this.weak + " weak.");

        let noWeakCurrently = $(".hero .single-status-container.weak").length == 0;
        if (this.newWeak && noWeakCurrently) {
            this.addNewStatus(this.weak, "weak");
        } else {
            this.updateStatus(this.weak, "weak");
        }
    }
    applyFrail(number) {
        if (this.frail == 0) {
            this.newFrail = true;
        } 

        this.frail += number;
        console.log(this.name + " has " + this.frail + " frail.");

        let noFrailCurrently = $(".hero .single-status-container.frail").length == 0;
        if (this.newFrail && noFrailCurrently) {
            this.addNewStatus(this.frail, "frail");
        } else {
            this.updateStatus(this.frail, "frail");
        }
    }
    addNewStatus(statusNumber, statusName) {
        $(".hero-statuses").append(`
            <div class="single-status-container ${statusName}">
                <img class="status-img" src="./img/icons/icon_${statusName}.png">
                <span class="status-number">${statusNumber}</span>
            </div>
        `);
        
    }
    updateStatus(statusNumber, statusName) {
        $(`.hero .single-status-container.${statusName} .status-number`).html(statusNumber);
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
    startFight() {

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

            if (this.vulnerable == 0) {
                $(`.hero .single-status-container.vulnerable`).remove();
            } else {
                $(`.hero .single-status-container.vulnerable .status-number`).html(this.vulnerable);
            }
        }
        if (this.weak != 0) {
            if (this.newWeak) {
                this.newWeak = false;
                return;
            }
            this.weak -= 1;
            console.log(this.name + " has " + this.weak + " weak.");

            if (this.weak == 0) {
                $(`.single-status-container.weak`).remove();
            } else {
                $(`.single-status-container.weak .status-number`).html(this.weak);
            }
        }
        if (this.frail != 0) {
            if (this.newFrail) {
                this.newFrail = false;
                return;
            }
            this.frail -= 1;
            console.log(this.name + " has " + this.frail + " frail.");

            if (this.frail == 0) {
                $(`.single-status-container.frail`).remove();
            } else {
                $(`.single-status-container.frail .status-number`).html(this.frail);
            }
        }
    }
}

class Ironclad extends Hero {
    // constructor(name, maxHealth) {
    //     super(name, maxHealth);
    // }
    maxHealth = 70;
    currentHealth = 70;
    deck = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3];
}

let ironclad = new Ironclad("Ironclad", 70);

let hero = ironclad;