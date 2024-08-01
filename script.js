//TODO 
//Death for player
//cards array thing
//consolidate status applications into 1 function
//slimed removed when fight ends
//incantation
//enemy new status hangs for too long
//update top health

let act = 1;
let floor = 5;
let turn;
let canClickCard = true;
let heroHealthBar = $(".hero progress");
let enemyHealthBar = $(".enemies progress");

function fillNav() {
    $(".nav_class").text("the " + hero.name);
    $(".nav_current-health").text(hero.currentHealth);
    $(".nav_max-health").text(hero.maxHealth);
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
    turn = 1;
    startFight();
});

function decideEnemy() {

    // let newEnemy = new TestEnemy("TEST", 50, 100);
    // enemyArray.push(newEnemy);

    // $(".enemies").empty();
    // $(enemyArray).each(function(index) {
    //     placeEnemy(this, index);
    // });

    // return;

    if (act == 1) {
        // let testEnemy = new TestEnemy("TEST", 50, 100);
        // enemyArray.push(testEnemy);
        // return;
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
            } else if (enemy == "slimes") {
                let randomNumberOne = getRandomNumber(2, 1);
                let randomNumberTwo = getRandomNumber(2, 1);

                if (randomNumberOne == 1) {
                    let newAcidSlimeM = new AcidSlimeM("Acid Slime M 1", 28, 32);
                    enemyArray.push(newAcidSlimeM);
                } else {
                    let newSpikeSlimeM = new SpikeSlimeM("Spike Slime M 1", 28, 32);
                    enemyArray.push(newSpikeSlimeM);
                }
                if (randomNumberTwo == 1) {
                    let newAcidSlimeS = new AcidSlimeS("Acid Slime S 2", 8, 12);
                    enemyArray.push(newAcidSlimeS);
                } else {
                    let newSpikeSlimeM = new SpikeSlimeS("Spike Slime S 2", 10, 14);
                    enemyArray.push(newSpikeSlimeM);
                }
            }
        } else {
            let numberOfEncounters = actOneOtherEncounters.length;
            let randomNumber = getRandomNumber(numberOfEncounters, 1);
            enemy = actOneOtherEncounters[randomNumber-1];
            
            if (enemy == "blueSlaver") {
                let newEnemy = new BlueSlaver("Blue Slaver", 46, 50);
                enemyArray.push(newEnemy);
            } else if (enemy == "fungiBeasts") {
                let newEnemyOne = new FungiBeast("Fungi Beast 1", 22, 28);
                enemyArray.push(newEnemyOne);
                let newEnemyTwo = new FungiBeast("Fungi Beast 2", 22, 28);
                enemyArray.push(newEnemyTwo);
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
                <img src="" alt="" class="intent-icon sway-anim">
                <span class="damage-number"></span>
            </div>
            <div class="enemy-shield-container">
                <div class="block-parent">
                    <div class="block-container d-none">
                        <img class="block-icon" src="./img/icons/icon_block.png" alt="">
                        <span class="block-number"></span>
                    </div>
                </div>
                <img class="enemy-img sway-anim" data-index="${index}" src="./img/enemies/${currentEnemy.src}.png" alt="">
            </div>
            <div class="enemy-health">
                <progress value="100" max="100"></progress>
                <div><span class="current-health"></span>/<span class="max-health"></span></div>
            </div>
            <div class="enemy-statuses"></div>   
        </div> 
    `)
}

function startFight() {
    hero.startFight();
    hero.startFightSpecific();
    $(enemyArray).each(function(index){
        this.startFight(index);
        this.startFightSpecific(index);
    });
    startPlayerTurn();
}

function initialize() {
    fillNav();
}

function startPlayerTurn() {
    console.log("-- Turn " + turn + " --");
    
    hero.startTurn();
    hero.startTurnSpecific();

    $(enemyArray).each(function(index){
        this.preTurn(index);
    })
}

$(".js_end-turn").click(function() {
    endPlayerTurn();
    startEnemyTurn();
});

function endPlayerTurn() {
    hero.endTurn();
    hero.endTurnSpecific();
}

function startEnemyTurn() {
    console.log("-- " + hero.name + "'s turn is over. Enemies' turn. --");
    $(enemyArray).each(function(index) {
        this.startTurn(index);
        this.startTurnSpecific(index);
    })
    endRound();
    if (!hero.isAlive) {
        gameOver();
    }
}

function endRound() {
    hero.endRound();
    hero.endRoundSpecific();

    $(enemyArray).each(function(index) {
        this.endRound(index);
        this.endRoundSpecific(index);
    })
    turn ++;
    startPlayerTurn();
}

$(document).on('click','.card',function(){
    if (!canClickCard) return;
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
            chosenCard.performEffect(target, hero, 0);
            hero.energy -= cost;
            $(".hero-energy").html(hero.energy);
        } else {
            highlightEnemies(cardId);
        }
    } else {
        chosenCard.performEffect(target);
        hero.energy -= cost;
        $(".hero-energy").html(hero.energy);
    }

    hero.discardPile.push(cardId);
    $(cardClicked).remove();
});

function highlightEnemies(cardId) {
    $(".enemy-img").addClass("highlight");
    $(".enemy-img").attr("data-id", cardId);
    canClickCard = false;
    $(".card").addClass("disabled");
}

$(document).on('click','.enemy-img.highlight',function(){
    let cardId = $(this).attr("data-id");
    let enemyIndex = $(this).attr("data-index");
    let targetedEnemy = enemyArray[enemyIndex];
    $(newCardArray).each(function() {
        if (this.id == cardId) {
            this.performEffect(targetedEnemy, hero, enemyIndex);
            hero.energy -= this.cost;
            $(".hero-energy").html(hero.energy);
            unhighlightEnemies();
        }
    })
})

function unhighlightEnemies() {
    $(".enemy-img").removeClass("highlight");
    $(".enemy-img").attr("data-id", "");
    canClickCard = true;
    $(".card").removeClass("disabled");
}

function winFight() {
    hero.discardCards();
    hero.drawPile.forEach((cardId, index)=>{
        hero.deck.push(cardId);
    })
    hero.discardPile.forEach((cardId, index)=>{
        hero.deck.push(cardId);
    })
    $(".hero-statuses").empty();
}

// function updateHealth() {
//     $(".nav_currentHealth").text(hero.currentHealth);
//     $(".nav_maxHealth").text(hero.maxHealth);
// }

function heroAttack() {
    $(".hero-img").addClass("hero-attack-anim");
    setTimeout( () => {
        $(".hero-img").removeClass("hero-attack-anim"); 
    }, 250);
}

function heroBuff() {
    $(".hero-img").addClass("buff-anim");
    setTimeout( () => {
        $(".hero-img").removeClass("buff-anim"); 
    }, 250);
}

function enemyAttack(index) {
    let currentEnemyImg = $(".enemy-img")[index];
    $(currentEnemyImg).addClass("enemy-attack-anim");
    setTimeout( () => {
        $(currentEnemyImg).removeClass("enemy-attack-anim"); 
    }, 250);
}

function enemyBuff(index) {
    let currentEnemyImg = $(".enemy-img")[index];
    $(currentEnemyImg).addClass("buff-anim");
    setTimeout( () => {
        $(currentEnemyImg).removeClass("buff-anim"); 
    }, 250);
}  

function gameOver() {
    console.log("GAME OVER");
}
  

  