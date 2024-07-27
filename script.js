//TODO 
//Death
//cards array thing
//multiple enemies
//create enemies on floor selection

let act = 1;
let floor = 1;
let turn;

let cardsArray = [strike_ironclad, defend_ironclad, bash];

let heroHealthBar = $(".hero progress");
let enemyHealthBar = $(".enemies progress");

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

    let enemyHealthBars = $(".enemies progress");
    $(enemyHealthBars).each(function(index){
        let currentEnemy = enemyArray[index];
        $(this).attr("value", currentEnemy.currentHealth);
        $(this).attr("max", currentEnemy.maxHealth);
    })
    // $(enemyHealthBar).attr("value", enemy.currentHealth);
    // $(enemyHealthBar).attr("max", enemy.maxHealth);
    turn = 1;
    startPlayerTurn();
});

function startPlayerTurn() {
    console.log("-- Turn " + turn + " --");
    hero.startTurn();
    $(enemyArray).each(function(index){
        this.preTurn(index);
    })
    // enemy.preTurn();
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
            let numberOfEncounters = actOneEarlyEncounters.length;
            let randomNumber = getRandomNumber(numberOfEncounters, 1);
            enemy = actOneEarlyEncounters[randomNumber-1];

            if (enemy == "louses") {
                let randomNumberOne = getRandomNumber(2, 1);
                let randomNumberTwo = getRandomNumber(2, 1);

                if (randomNumberOne == 1) {
                    enemyArray.push(redLouse);
                } else {
                    enemyArray.push(greenLouse);
                }
                if (randomNumberTwo == 1) {
                    enemyArray.push(redLouse);
                } else {
                    enemyArray.push(greenLouse);
                }
            } else {
                enemyArray.push(enemy);
            }
        }
    }
    console.log(enemyArray);
    $(".enemies").empty();
    $(enemyArray).each(function() {
        placeEnemy(this);
    });
}

function placeEnemy(currentEnemy) {
    $(".enemies").append(`
        <div class="one-enemy">
            <div class="intent">
                <img src="" alt="" class="intent-icon">
                <span class="damage-number"></span>
            </div>
            <img class="enemy-img" src="./img/enemies/${currentEnemy.src}.png" alt="">
            <div class="enemy-health">
                <progress value="100" max="100"></progress>
                <div><span class="current-health"></span>/<span class="max-health"></span></div>
            </div>
            <div class="enemy-statuses"></div>   
        </div> 
    `)
}

  
  

  