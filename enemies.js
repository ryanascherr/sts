class TestEnemy extends Enemy {
    src = "acid_slime-s";
    decideAction() {
        if (Math.abs(turn % 2) == 1) {
            this.declaredAction = "Lick";
        } else {
            this.declaredAction = "Do Nothing";
        }
    }
    showIntent(index) {
        let enemyIntents = $(".enemies .intent-icon");
        let currentIntentTarget = enemyIntents[index];
        let enemyDamageNumbers = $(".enemies .damage-number");
        let currentDamageNumberTarget = enemyDamageNumbers[index];

        if (this.declaredAction == "Lick") {
            $(currentIntentTarget).attr("src", `./img/intents/intent_debuff.png`);
            console.log(this.name + " intends to debuff " + hero.name + ".");
        }
        if (this.declaredAction == "Do Nothing") {
            $(currentIntentTarget).attr("src", ``);
            console.log(this.name + " intends to do nothing.");
        }
    }
    performAction(index) {
        if (this.declaredAction == "Lick") {
            this.lick();
        }
        if (this.declaredAction == "Do Nothing") {
            this.doNothing();
        }
    }
    lick() {
        hero.applyWeak(2);
    }
    doNothing() {
        hero.applyVulnerable(2);
        hero.applyFrail(4);
    }
}

// let actOneEarlyEncounters = ["cultist"];
let actOneEarlyEncounters = ["cultist", "jawWorm", "louses", "slimes"];
// let actOneOtherEncounters = ["lotsOfSlimes"];
let actOneOtherEncounters = ["blueSlaver", "fungiBeasts", "threeLouses", "exordiumWildlife", "lotsOfSlimes"];
let enemy;
let enemyArray = [];