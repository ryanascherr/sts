//TODO 
//Death
//cards array thing

let act = 1;
let floor = 1;
let turn;

let hero = ironclad;
let enemy;

let cardsArray = [strike_ironclad, defend_ironclad, bash];

let heroHealthBar = $(".hero progress");
let enemyHealthBar = $(".enemies progress");

function startPlayerTurn() {
    console.log("-- Turn " + turn + " --");
    hero.startTurn();
    enemy.preTurn();
}

function endPlayerTurn() {
    hero.endTurn();
}
function startEnemyTurn() {
    enemy.startTurn();
    endRound();
    if (!hero.isAlive) {
        gameOver();
    }
}
function endRound() {
    hero.endRoundGeneral();
    enemy.endRoundGeneral();
    turn ++;
    startPlayerTurn();
}

function gameOver() {
    console.log("GAME OVER");
}

$(".js_start-fight").click(function() {
    $(".arena").removeClass("d-none");
    $(".hand").removeClass("d-none");
    $(".end-turn-container").removeClass("d-none");
    $(".js_start-fight").addClass("d-none");
    decideEnemy();
    $(heroHealthBar).attr("value", hero.currentHealth);
    $(heroHealthBar).attr("max", hero.maxHealth);
    $(enemyHealthBar).attr("value", enemy.currentHealth);
    $(enemyHealthBar).attr("max", enemy.maxHealth);
    turn = 1;
    startPlayerTurn();
});

$(document).on('click','.card',function(){
    let cardId = parseInt($(this).attr("data-id"));
    let chosenCard;
    $(cardsArray).each(function() {
        if (this.id == cardId) {
            chosenCard = this;
        }
    });
    let cost = chosenCard.cost;
    if (hero.energy < cost) return;
    hero.energy -= cost;
    $(".hero-energy").html(hero.energy);
    chosenCard.performEffect();
    hero.discardPile.push(cardId);
    $(this).remove();
});

$(".js_end-turn").click(function() {
    endPlayerTurn();
    startEnemyTurn();
});

function decideEnemy() {
    if (act == 1) {
        if (floor <= 3) {
            let randomNumber = Math.floor(Math.random() * (2 - 1 + 1) + 1);
            enemy = actOneEarlyEncounters[randomNumber-1];
        }
    }
    placeEnemy();
}

function placeEnemy() {
    $(".enemy-img").attr("src", `./img/enemies/${enemy.src}.png`);
}

  
  

  