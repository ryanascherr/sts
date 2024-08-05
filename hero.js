class Hero extends Character {
    energy = 3;
    handSize = 5;
    drawPile = [];
    discardPile = [];
    entangled = 0;
    newEntangled = false;
    isEntangled = false;
    updateBlock(block, index) {
        if (block == 0) {
            $(".hero-shield-container .block-container").addClass("d-none");
        }
        if (block != 0) {
            $(".hero-shield-container .block-container").removeClass("d-none");
        }
        $(".hero-shield-container .block-container .block-number").text(this.block);
    }
    updateHealth(index) {
        heroHealthBar.attr("value", this.currentHealth);
        $(".hero-health .current-health").text(this.currentHealth);
        $(".nav_current-health").text(this.currentHealth);
        $(".hero-health .max-health").text(this.maxHealth);
        $(".nav_max-health").text(this.maxHealth);
    }
    applyEntangled(number, index) {
        this.newEntangled = this.entangled == 0 ? true : false;

        this.entangled += number;
        this.isEntangled = true;
        console.log(this.name + " has " + this.entangled + " engtangled.");
        console.log("adding entangled");
        console.log(this.newEntangled);
        if (this.newEntangled) this.addNewStatus(this.entangled, "entangled", index);
        if (!this.newTangled) this.updateStatus(this.entangled, "entangled", index);
    }
    addNewStatus(statusNumber, statusName) {
        console.log("adding sdffdedfe" + statusName);
        $(".hero-statuses").append(`
            <div class="single-status-container ${statusName}">
                <img class="status-img status-anim" src="./img/icons/icon_${statusName}.png">
                <span class="status-number">${statusNumber}</span>
            </div>
        `);
        setTimeout( () => {
            $(`.hero-statuses .single-status-container.${statusName}`).removeClass("status-anim");
        }, 1000);
    }
    updateStatus(statusNumber, statusName, index) {
        if (statusNumber == 0) {
            $(`.hero .single-status-container.${statusName}`).remove();
            return;
        }

        console.log("only here if still have status")
        $(`.hero .single-status-container.${statusName} .status-number`).text(statusNumber);

        $(`.hero .single-status-container.${statusName} .status-img`).addClass("status-anim");

        setTimeout( () => {
            $(`.hero .single-status-container.${statusName} .status-img`).removeClass("status-anim"); 
        }, 1000);
    }
    startFightSpecific() {
        this.drawPile = hero.deck;
    }
    startTurnSpecific() {
        this.updateEnergy();
        console.log(this.name + " has " + this.energy + " energy.");

        this.dealCards();
    }
    updateEnergy() {
        this.energy = 3;
        $(".hero-energy").html(this.energy);
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
                    if (hero.isEntangled && card.type == "Attack") {
                        $(".hand").append(`<img class="card disabled" data-id="${card.id}" src="./img/cards/${card.src}">`);
                    } else {
                        $(".hand").append(`<img class="card" data-id="${card.id}" src="./img/cards/${card.src}">`);
                    }
                }
            });
    
            this.drawPile.splice(randomIndex, 1);
        }
    }
    makeNewDrawPile() {
        this.drawPile = this.discardPile;
        this.discardPile = [];
    }
    endTurnSpecific() {
        this.discardCards();
    }
    discardCards() {
        let remainingCards = document.querySelectorAll(".card");
        remainingCards.forEach(card => {
            let cardId = parseInt($(card).attr("data-id"));
            this.discardPile.push(cardId);
            $(card).remove();
        })
    }
    endRound(index) {
        if (this.vulnerable != 0) {
            if (!this.newVulnerable) {
                this.vulnerable--;
                this.updateStatus(this.vulnerable, "vulnerable", index);
            }
            this.newVulnerable = false;
        }
        if (this.weak != 0) {
            if (!this.newWeak) {
                this.weak--;
                this.updateStatus(this.weak, "weak", index);
            }
            this.newWeak = false;
        }
        if (this.frail != 0) {
            if (!this.newFrail) {
                this.frail--;
                this.updateStatus(this.frail, "frail", index);
            }
            this.newFrail = false;
        }
        if (this.ritual != 0) {
            if (!this.newRitual) {
                this.strength += this.ritual;
                console.log(this.name + " gained " + this.ritual + " strength. Strength is now " + this.strength);
            }
            this.newRitual = false;
        }
        if (this.entangled != 0) {
            if (!this.newEntangled) {
                this.entangled--;
                this.updateStatus(this.entangled, "entangled", index);
                if (this.entangled <= 0) {
                    this.isEntangled = false;
                }
            }
            this.newEntangled = false;
        }
    }
    die(index) {
        console.log(this.name + " has died. GAME OVER.");
    }
}