// class Cultist extends Enemy {
//     src = "cultist";
//     hasIncanted = false;
//     decideAction() {
//         if (turn == 1) {
//             this.declaredAction = "Incantation";
//         }
//         if (turn !== 1) {
//             this.declaredAction = "Dark Strike";
//         }

//     }
//     showIntent() {
//         if (this.declaredAction == "Incantation") {
//             $(".enemies .intent-icon").attr("src", `./img/intents/intent_buff.png`);
//             console.log(this.name + " intends to apply a buff to themselves.")
//         }
//         if (this.declaredAction == "Dark Strike") {
//             let attackDamage = 6 + this.strength;
//             if (hero.vulnerable != 0) {
//                 attackDamage = Math.floor(attackDamage*1.5);
//             }
//             $(".enemies .intent-icon").attr("src", `./img/intents/intent_attack.png`);
//             $(".enemies .damage-number").text(attackDamage);
//             console.log(this.name + " intends to attack for " + attackDamage + " damage.");
//         }
//     }
//     performAction(index) {
//         if (this.declaredAction == "Incantation") {
//             this.incantation(index);
//         }
//         if (this.declaredAction == "Dark Strike") {
//             this.darkStrike(index);
//         }
//     }
//     incantation(index) {
//         this.applyRitual(3, index);
//         console.log(this.name + " used Incanation. CAW!");
//         enemyBuff(index);
//     }
//     darkStrike(index) {
//         let damage = 6 + this.strength;
//         console.log(this.name + " attacks " + hero.name + ".");
//         enemyAttack(index);
//         hero.takeDamage(damage, this);
//     }
// }