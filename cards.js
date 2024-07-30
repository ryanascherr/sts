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
    performEffect(target, index) {
        if (!index) {
            index == 0;
        }

        heroAttack();

        setTimeout( () => {
            target.takeDamage(6+hero.strength, index);
        }, 100);
    }
}
class Defend_Ironclad extends Card {
    performEffect(target) {
        hero.gainBlock(5+hero.dexterity);
    }
}
class Bash extends Card {
    performEffect(target, index) {
        if (!index) {
            index == 0;
        }

        heroAttack();

        setTimeout( () => {
            let damage = 8 + hero.strength;
            target.takeDamage(damage, index);
            if (target.currentHealth == 0) return;
            target.applyVulnerable(2, index);
        }, 100);
    }
}

class Slimed extends Card {
    performEffect(target, index, cardClicked) {
        $(cardClicked).remove();
    }
}

let strike_ironclad = new Strike_Ironclad(1, "Strike", "Ironclad", "Attack", "Common", 1, "Deal 6 damage.", "strike_ironclad.png");
let defend_ironclad = new Defend_Ironclad(2, "Defend", "Ironclad", "Skill", "Common", 1, "Gain 5 block.", "defend_ironclad.png");
let bash = new Bash(3, "Bash", "Ironclad", "Attack", "Common", 2, "Deal 8 damage. Apply 2 Vulnerable.", "bash.png");
let slimed = new Slimed(4, "Slimed", "Neutral", "Status", "Common", 1, "Exhaust", "slimed.png");

let newCardArray = [strike_ironclad, defend_ironclad, bash, slimed];