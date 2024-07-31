class Hero extends Character {
    energy = 3;
    handSize = 5;
    drawPile = [];
    discardPile = [];
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
    addNewStatus(statusNumber, statusName) {
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
    die(index) {
        console.log(this.name + " has died. GAME OVER.");
    }
}

class Ironclad extends Hero {
    maxHealth = 70;
    currentHealth = 70;
    deck = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3];
}

let ironclad = new Ironclad("Ironclad", 70);

let hero = ironclad;