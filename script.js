class Character {
    constructor(name, maxHealth) {
        this.name = name;
        this.baseHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.block = 0;
        this.isVulnerable = false;
        this.isWeak = false;
    }
    takeDamage(attacker, damage) {
        if (this.isVulnerable) {
            damage = damage*1.5;
        }
        this.currentHealth -= damage;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        return attacker + " attacked " + this.name + " for " + damage + " damage. " + this.name + "'s health is now " + this.currentHealth + "/" + this.baseHealth + ".";
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
}

class Enemy {
    constructor(name, healthMin, healthMax) {
        this.name = name;
        this.maxHealth = Math.floor(Math.random() * (healthMax - healthMin + 1) + healthMin);
        this.currentHealth = this.maxHealth;
        this.block = 0;
        this.strength = 0;
        this.dexterity = 0;
    }
}

class Ironclad extends Character {
    constructor(name, maxHealth) {
        super(name, maxHealth);
    }
}

class Cultist extends Enemy {
    constructor(name, healthMin, healthMax) {
        super(name, healthMin, healthMax);
    }
    hasIncanted = false;
    incantation() {
        this.hasIncanted = true;
    }
    darkStrike() {
        let damage = 6 + this.strength;
        hero.takeDamage(this.name, damage);
    }
    endOfTurn() {
        if (this.hasIncanted) {
            this.strength += 3;
        }
    }

}

let ironclad = new Ironclad("Ironclad", 70);

let cultist = new Cultist("Cultist", 48, 54);

let hero = ironclad;

console.log(cultist);

console.log(hero.currentHealth);
console.log(cultist.strength);
cultist.incantation();
console.log(cultist.strength);
cultist.darkStrike();
console.log(hero.currentHealth);

  
  

  