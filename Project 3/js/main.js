window.onload = () => {
    initBoard();
}

// level 1 card amount
let numCards = 12;

// full deck
let fullDeck = [];
let deck = [];
let maxCol = 13;
let maxRow = 4;

// track level
let currentLevel = 1;
let cardsLeft = numCards;

// track score
let score = 0;

// protect player from losing points at first
let safeMoves = 3;

//keep high score locally
const prefix = "dm1250-";
const scoreKey = prefix + "score";
let highScore;

// track enemy health
let health;
let damage;
let defeated;

//sounds
//source: https://orangefreesounds.com/card-flip-sound-effect/
let cardFlip;
//source: https://www.youtube.com/watch?v=_NM0Auysb1M
let heal;
//source: https://www.youtube.com/watch?v=Oa1mfoOInbA
let attack;

// start first level and check for high score
function initBoard() {
    // randomize deck every game
    allCards();
    RandomDeck();
    DealCards();
    PlayerSetup();
    document.querySelector("#score").innerHTML = `<p>Score: ${score}</p>`;
    //store highscore
    const storedScore = localStorage.getItem(scoreKey);

    if (storedScore)
    {
        highScore = storedScore;
    }
    else
    {
        highScore = 0;
    }

    //preload audio
    cardFlip = new Howl({
        src: ['audio/cardflip.mp3'],
        volume: 0.2
    })

    heal = new Howl({
        src: ['audio/heal.mp3'],
        volume: 0.2
    })

    attack = new Howl({
        src: ['audio/sword.mp3'],
        volume: 0.2
    })
}

// add all possible cards to deck
let allCards = () => {
    //go through each card and add to deck
    for (let i = 1; i <= maxRow; ++i)
    {
        for (let j = 1; j <= maxCol; ++j)
        {
            if (j < 10)
            {
                fullDeck.push(`cardR0${i}C0${j}`)
            }
            else
            {
                fullDeck.push(`cardR0${i}C${j}`)
            }
        }
    }
}

//randomizes playable cards
let RandomDeck = () => {
    //create temp deck copy
    let tempDeck = [...fullDeck];
    //use shuffle method to mix it up
    shuffleArray(tempDeck);
    //take off top cards to add until half of total playing cards in level
    //my ES6 class (does a for loop count?)
    for (let i = 0; i < numCards / 2; ++i)
    {
        let current = tempDeck.pop();
        deck.push(current);
        deck.push(current);
    }
}

// source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
//take an array and shuffle the order
let shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// add card flip class and check if two cards are flipped
function cardClicked() {
    cardFlip.play();
    // we do nothing if there are already two cards flipped.
    if (document.querySelectorAll(".card-flipped").length > 1) return;
    
    // inside of an event handling function, 'this' is the element that called the function
    this.classList.add("card-flipped");

    // check the pattern of both flipped card 0.7s later.    
    if (document.querySelectorAll(".card-flipped").length == 2) {
        // setTimeout() is used to schedule the execution a piece of code *once*
        setTimeout(checkPattern, 700);
    }
}

// checks if cards clicked by player match and apply points/damage as necessary
function checkPattern() {
    if (isSamePattern()) {
        // here we are using array.forEach(), rather than for...of, for no particular reason :-)
        document.querySelectorAll(".card-flipped").forEach((element)=>{
            element.classList.remove("card-flipped");
            element.classList.add("card-removed");
            element.addEventListener("transitionend",removeMatchedCards);
        });
        //deal damage to enemy
        attack.play();
        health -= damage;
        document.querySelector("#enemy").innerHTML = `<img src="images/enemy${currentLevel}.png" alt="Level ${currentLevel} Enemy"><p>Health: ${health}</p><br>`
        //check if enemy is defeated
        if (health == 0)
        {
            defeated = true;
        }
        //go to next level if so
        //check if final level
        if (defeated && currentLevel == 3)
        {
            score += 5;
            document.querySelector("#score").innerHTML = `<p>Score: ${score}</p>`;
            EndScreen();
        }
        else if (defeated)
        {
            score += 5;
            document.querySelector("#score").innerHTML = `<p>Score: ${score}</p>`;
            NextLevel();
        }
        else
        {
            score++;
            document.querySelector("#score").innerHTML = `<p>Score: ${score}</p>`;
        }
        // check if all cards are gone
        cardsLeft -= 2;
        if (cardsLeft == 0 && currentLevel != 3)
        {
            NextLevel();
        }
        if (cardsLeft == 0 && currentLevel == 3)
        {
            setTimeout(EndScreen, 700);
        }
    }
    else {
        // I prefer array.forEach() over for...of when I can write it as a "one-liner"
        document.querySelectorAll(".card-flipped").forEach((element)=>{element.classList.remove("card-flipped")});
        // prevent point loss at first
        if (safeMoves != 0)
        {
            safeMoves--;
            document.querySelector("#hero").innerHTML = `<img src="images/hero.png" alt="hero"><p>Sword Damage: ${damage}</p><p>Safe Moves Left: ${safeMoves}</p>`
        }
        // lose point for wrong match
        else
        {
            heal.play();
            score--;
            health += damage;
            document.querySelector("#enemy").innerHTML = `<img src="images/enemy${currentLevel}.png" alt="Level ${currentLevel} Enemy"><p>Health: ${health}</p><br>`
        }
        document.querySelector("#score").innerHTML = `<p>Score: ${score}</p>`;
    }
}

// checks for which cards are flipped and compares their patterns
function isSamePattern() {
    let cards = document.querySelectorAll(".card-flipped");
    // the dataset object holds the .data-pattern property we created for each card in initBoard()
    let pattern1 = cards[0].dataset.pattern;
    let pattern2 = cards[1].dataset.pattern;
    return pattern1 == pattern2;
}

//removes cards that have card remove class applied from player view
function removeMatchedCards() {
    // another .forEach() "one-liner"
    document.querySelectorAll(".card-removed").forEach((element)=>{element.parentNode.removeChild(element);});
}

//setup next level/endscreen
let NextLevel = () => {
    document.querySelector("#cards").innerHTML = `<div class="card">
    <div class="face front"></div>
    <div class="face back"></div></div>`;
    currentLevel++;
    numCards += 4;
    cardsLeft = numCards;
    switch(currentLevel)
    {
        case 2:
            document.querySelector("footer").style.top = "750px";
            safeMoves = 4;
            break;
        case 3:
            document.querySelector("footer").style.top = "900px";
            safeMoves = 5; 
            break;
        default:
            break;
    }
    RandomDeck();
    DealCards();
    PlayerSetup();
}

//display endscreen with player score and previous high score if still unbeaten
let EndScreen = () => {
    if (score > highScore)
    {
        localStorage.setItem(scoreKey, score);
        document.querySelector("#game").innerHTML = "";
        document.querySelector("#game").innerHTML = `You've saved the Princess!<br><br>Score: ${score}<br><br>New High Score!`;
    }
    else
    {
        document.querySelector("#game").innerHTML = "";
        document.querySelector("#game").innerHTML = `You've saved the Princess!<br><br>Score: ${score}<br><br>High Score: ${highScore}`;
    }
}

//randomize played cards and displays them for player to click
let DealCards = () => {
    // randomize the deck
    shuffleArray(deck);

    // in this loop we clone the existing card
    for(let i=0; i<numCards - 1; i++){
        let newCard = document.querySelector(".card").cloneNode(true);
        document.querySelector("#cards").appendChild(newCard);
    }

    // Now position the cards on the table, and assign a face:
    let cards = document.querySelectorAll("#cards > .card");
    let index = 0; // we need this for positioning

    // loop through all of the card elements and assign a face to each card
    for (let element of cards){
        let x = (element.offsetWidth  + 20) * (index % 4);
        let y = (element.offsetHeight + 20) * Math.floor(index / 4);
        element.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";

        // get a pattern from the shuffled deck
        let pattern = deck.pop();

        // visually apply the pattern on the card's back side.
        element.querySelector(".back").classList.add(pattern);

        // embed the pattern data into the DOM element.
        // this is an example of HTML5 Custom Data attributes
        element.setAttribute("data-pattern",pattern);

        // listen for the click event on each card <div> element.
        element.onclick = cardClicked;
        index ++;
    }
}

// set up hero and enemy images/hp based on current level
let PlayerSetup = () => {
    switch (currentLevel)
    {
        case 1:
            health = 200;
            damage = 50;
            defeated = false;
            document.querySelector("#hero").innerHTML = `<img src="images/hero.png" alt="hero"><p>Sword Damage: ${damage}</p><p>Safe Moves Left: ${safeMoves}</p>`
            document.querySelector("#enemy").innerHTML = `<img src="images/enemy1.png" alt="Level 1 Enemy"><p>Health: ${health}</p><br>`
            break;
        case 2:
            health = 600;
            damage = 100;
            defeated = false;
            document.querySelector("#hero").innerHTML = `<img src="images/hero.png" alt="hero"><p>Sword Damage: ${damage}</p><p>Safe Moves Left: ${safeMoves}</p>`
            document.querySelector("#enemy").innerHTML = `<img src="images/enemy2.png" alt="Level 2 Enemy"><p>Health: ${health}</p><br>`
            break;
        case 3:
            health = 1200;
            damage = 150;
            defeated = false;
            document.querySelector("#hero").innerHTML = `<img src="images/hero.png" alt="hero"><p>Sword Damage: ${damage}</p><p>Safe Moves Left: ${safeMoves}</p>`
            document.querySelector("#enemy").innerHTML = `<img src="images/enemy3.png" alt="Level 3 Enemy"><p>Health: ${health}</p><br>`
            break;
        default:
            break;
    }
}