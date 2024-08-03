class Enemy extends Character {
    constructor(name, healthMin, healthMax) {
        super();
        this.name = name;
        this.maxHealth = getRandomNumber(healthMax, healthMin);
        this.currentHealth = this.maxHealth;
        this.declaredAction = "";
        this.intentIcon = "";
    }
    decideAction() {

    }
    showIntent() {

    }
    performAction(index) {

    }
    updateBlock(block, index) {
        if (block == 0) {
            let correctShieldContainer = $(".enemy-shield-container .block-container")[index];
            $(correctShieldContainer).addClass("d-none");
        }
        if (block != 0) {
            let correctShieldContainer = $(".enemy-shield-container .block-container")[index];
            $(correctShieldContainer).removeClass("d-none");
        }

        let correctShieldNumber = $(".enemy-shield-container .block-container .block-number")[index];
        $(correctShieldNumber).text(this.block);
    }
    updateHealth(index) {
        let enemyHealthBars = $(".enemy-health progress");
        let currentEnemyHealthBar = enemyHealthBars[index];
        $(currentEnemyHealthBar).attr("value", this.currentHealth);

        let enemyCurrentHealths = $(".enemy-health .current-health");
        let currentCurrentHealth = enemyCurrentHealths[index];
        $(currentCurrentHealth).text(this.currentHealth);
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
        if (statusNumber == 0) {
            $(`.enemies .single-status-container.${statusName}`).remove();
            return;
        }

        let correctStatusNumber = $(`.enemies .single-status-container.${statusName} .status-number`)[index];
        $(correctStatusNumber).text(statusNumber);

        let correctSpecificStatus = $(`.single-status-container[data-index="${index}"].${statusName} .status-img`);
        $(correctSpecificStatus).addClass("status-anim");
        setTimeout( () => {
            $(correctSpecificStatus).removeClass("status-anim"); 
        }, 1000);
    }
    preTurn(index) {
        let currentEnemy = enemyArray[index];

        let enemyCurrentHealths = $(".enemy-health .current-health");
        $(enemyCurrentHealths[index]).text(currentEnemy.currentHealth);

        let enemyMaxHealths = $(".enemy-health .max-health");
        $(enemyMaxHealths[index]).text(currentEnemy.maxHealth);

        let enemyIntents = $(".enemies .intent-icon");
        $(enemyIntents[index]).attr("src", " ");
        
        let enemyDamageNumbers = $(".enemies .damage-number");
        $(enemyDamageNumbers[index]).text("");
        
        currentEnemy.decideAction();
        currentEnemy.showIntent(index);
    }
    startTurnSpecific(index) {
        this.performAction(index);
    }
    endRound(index) {
        if (this.vulnerable != 0) {
            this.vulnerable--;
            this.updateStatus(this.vulnerable, "vulnerable", index);
            this.newVulnerable = false;
        }
        if (this.weak != 0) {
            this.weak--;
            this.updateStatus(this.weak, "weak", index);
            this.newWeak = false;
        }
        if (this.frail != 0) {
            this.frail--;
            this.updateStatus(this.frail, "frail", index);
            this.newFrail = false;
        }
        if (this.ritual != 0) {
            if (!this.newRitual) {
                this.strength += this.ritual;
                console.log(this.name + " gained " + this.ritual + " strength. Strength is now " + this.strength);
            }
            this.newRitual = false;
        }
    }
    die(index) {
        let perishedEnemy = $(".one-enemy")[index];
        $(perishedEnemy).remove();
        enemyArray.splice(index, 1);
        if (enemyArray.length == 0) {
            winFight();
        };
    }
    dieSpecific() {
    }
}