class TestChar {
    constructor(name) {
        this.name = name;
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
        this.isAlive = true;
    }
    takeDamage(damage, attacker, index) {
        damage = this.calcWeak(damage, attacker);
        damage = this.calcVulnerable(damage);

        if (this.block != 0) {
            damage = this.calcBlock(this.block, damage);
            this.updateBlock(this.block, index);damage = this.calcBlock(this.block, damage);
            this.updateBlock(this.block, index);
        }

        this.currentHealth -= damage;
        console.log(this.name + " takes " + damage + " damage.");

        this.takeDamageSpecific(index);

        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.isAlive = false;
        }

        this.updateHealth(index);

        if (!this.isAlive) {
            this.die(index);
            this.dieSpecific(index);
        }
    }
    takeDamageSpecific(index) {

    }
    calcWeak(damage, attacker) {
        return attacker.weak != 0 ? Math.floor(damage*.75) : damage;
    }
    calcVulnerable(damage) {
        return this.vulnerable != 0 ? Math.floor(damage*1.5) : damage;
    }
    calcBlock(block, damage) {
        if (this.block == 0) return damage;

        let currentBlock = this.block;

        this.block -= damage;
        if (this.block < 0) this.block = 0;

        damage -= currentBlock;
        if (damage < 0) damage = 0;
        
        return damage;
    }
    updateBlock(block, index) {

    }
    updateHealth(index) {

    }
    gainHealth(health, index) {
        this.currentHealth += health;

        if (this.currentHealth > this.maxHealth) this.currentHealth = this.maxHealth;

        this.updateHealth(index);
        
        console.log(this.name + " gained " + health + " health. " + this.name + "'s current health is " + this.currentHealth + "/" + this.maxHealth + ".");
    }
    gainBlock(block, index) {
        block = this.calcFrail(block, index);
        
        this.block += block;

        this.updateBlock(block, index);
        
        console.log(this.name + " gains " + block + " block. They have " + this.block + " block.");
    }
    calcFrail(block, index) {
        return this.frail != 0 ? Math.floor(block*.75) : block;
    }
    applyStatus(a, b, c) {

    }
    applyVulnerable(number, index) {
        this.newVulnerable = this.vulnerable == 0 ? true : false;

        this.vulnerable += number;
        console.log(this.name + " has " + this.vulnerable + " vulnerable.");

        if (this.newVulnerable) this.addNewStatus(this.vulnerable, "vulnerable", index);
        if (!this.newVulnerable) this.updateStatus(this.vulnerable, "vulnerable", index);
    }
    applyWeak(number, index) {
        this.newWeak = this.weak == 0 ? true : false;

        this.weak += number;
        console.log(this.name + " has " + this.weak + " weak.");

        if (this.newWeak) this.addNewStatus(this.weak, "weak", index);
        if (!this.newWeak) this.updateStatus(this.weak, "weak", index);
    }
    applyFrail(number, index) {
        this.newFrail = this.frail == 0 ? true : false;

        this.frail += number;
        console.log(this.name + " has " + this.frail + " frail.");

        if (this.newFrail) this.addNewStatus(this.frail, "frail", index);
        if (!this.newFrail) this.updateStatus(this.frail, "frail", index);
    }
    addNewStatus(statusNumber, statusName, index) {
    }
    updateStatus(statusNumber, statusName, index) {
    }
    startFight(index) {
        this.updateHealth(index);
    }
    startFightSpecific() {

    };
    startTurn(index) {
        this.removeBlock(index);
    }
    removeBlock(index) {
        this.block = 0;
        this.updateBlock(this.block, index);
        console.log(this.name + " loses all block.");
    }
    endTurn() {
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
    }
    endRoundSpecific() {

    }
    die(index) {
    }
    dieSpecific(index) {

    }
}