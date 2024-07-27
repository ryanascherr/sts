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
    $(enemyArray).each(function(index) {
        this.startTurn(index);
    })
    endRound();
    if (!hero.isAlive) {
        gameOver();
    }
}
function endRound() {
    hero.endRoundGeneral();

    $(enemyArray).each(function(index) {
        this.endRoundGeneral(index);
        this.endRoundSpecific(index);
    })
    turn ++;
    startPlayerTurn();
}

$(document).on('click','.card',function(){
    let cardClicked = this;
    let cardId = parseInt($(this).attr("data-id"));
    let chosenCard;
    $(cardsArray).each(function() {
        if (this.id == cardId) {
            chosenCard = this;
        }
    });
    let cost = chosenCard.cost;
    if (hero.energy < cost) return;

    let target;
    if (chosenCard.type == "Attack") {
        if (enemyArray.length == 1) {
            target = enemyArray[0];
            chosenCard.performEffect(target, 0);
            hero.discardPile.push(cardId);
            hero.energy -= cost;
            $(".hero-energy").html(hero.energy);
        } else {
            highlightEnemies(cardId);
        }
    } else {
        chosenCard.performEffect(target);
        hero.discardPile.push(cardId);
        hero.energy -= cost;
        $(".hero-energy").html(hero.energy);
    }

    $(cardClicked).remove();
});

$(document).on('click','.enemy-img.highlight',function(){
    let cardId = $(this).attr("data-id");
    let enemyIndex = $(this).attr("data-index");
    let targetedEnemy = enemyArray[enemyIndex];
    $(newCardArray).each(function() {
        if (this.id == cardId) {
            this.performEffect(targetedEnemy, enemyIndex);
            hero.energy -= this.cost;
            $(".hero-energy").html(hero.energy);
            unhighlightEnemies();
        }
    })
})

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
                    let newRedLouse = new RedLouse("Red Louse 1", 10, 15);
                    enemyArray.push(newRedLouse);
                } else {
                    let newGreenLouse = new GreenLouse("Green Louse 1", 17, 11);
                    enemyArray.push(newGreenLouse);
                }
                if (randomNumberTwo == 1) {
                    let newRedLouse = new RedLouse("Red Louse 2", 10, 15);
                    enemyArray.push(newRedLouse);
                } else {
                    let newGreenLouse = new GreenLouse("Green Louse 2", 17, 11);
                    enemyArray.push(newGreenLouse);
                }
            } else if (enemy == "cultist") {
                let newCultist = new Cultist("Cultist", 48, 54);
                enemyArray.push(newCultist);
            } else if (enemy == "jawWorm") {
                let newJawWorm = new JawWorm("Jaw Worm", 40, 44);
                enemyArray.push(newJawWorm);
            }
        }
    }
    $(".enemies").empty();
    $(enemyArray).each(function(index) {
        placeEnemy(this, index);
    });
}

function placeEnemy(currentEnemy, index) {
    $(".enemies").append(`
        <div class="one-enemy" data-index=${index}>
            <div class="intent">
                <img src="" alt="" class="intent-icon">
                <span class="damage-number"></span>
            </div>
            <img class="enemy-img" data-index="${index}" src="./img/enemies/${currentEnemy.src}.png" alt="">
            <div class="enemy-health">
                <progress value="100" max="100"></progress>
                <div><span class="current-health"></span>/<span class="max-health"></span></div>
            </div>
            <div class="enemy-statuses"></div>   
        </div> 
    `)
}

function highlightEnemies(cardId) {
    $(".enemy-img").addClass("highlight");
    $(".enemy-img").attr("data-id", cardId);
}

function unhighlightEnemies() {
    $(".enemy-img").removeClass("highlight");
    $(".enemy-img").attr("data-id", "");
}

  
  

  