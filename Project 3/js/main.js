window.onload = () =>{
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

//track score
let score = 0;

function initBoard(){
    // randomize deck every game
    allCards();
    RandomDeck();
    DealCards();
    document.querySelector("#score").innerHTML = `<p>Score: ${score}</p>`;
}

// add all possible cards to deck
function allCards() {
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
function RandomDeck() {
    //create temp deck copy
    let tempDeck = [...fullDeck];
    //use shuffle method to mix it up
    shuffleArray(tempDeck);
    //take off top cards to add until half of total playing cards in level
    for (let i = 0; i < numCards / 2; ++i)
    {
        let current = tempDeck.pop();
        deck.push(current);
        deck.push(current);
    }
}

// source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
//take an array and shuffle the order
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function cardClicked() {
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

function checkPattern() {
    if (isSamePattern()) {
        // here we are using array.forEach(), rather than for...of, for no particular reason :-)
        document.querySelectorAll(".card-flipped").forEach((element)=>{
            element.classList.remove("card-flipped");
            element.classList.add("card-removed");
            element.addEventListener("transitionend",removeMatchedCards);
        });
        // gain point for correct match
        score++;
        document.querySelector("#score").innerHTML = `<p>Score: ${score}</p>`;
        // check if all cards are gone
        cardsLeft -= 2;
        if (cardsLeft == 0 && currentLevel < 3)
        {
            NextLevel();
        }
    }
    else {
        // I prefer array.forEach() over for...of when I can write it as a "one-liner"
        document.querySelectorAll(".card-flipped").forEach((element)=>{element.classList.remove("card-flipped")});
        // lose point for wrong match
        score--;
        document.querySelector("#score").innerHTML = `<p>Score: ${score}</p>`;
    }
}

function isSamePattern() {
    let cards = document.querySelectorAll(".card-flipped");
    // the dataset object holds the .data-pattern property we created for each card in initBoard()
    let pattern1 = cards[0].dataset.pattern;
    let pattern2 = cards[1].dataset.pattern;
    return pattern1 == pattern2;
}

function removeMatchedCards(){
    // another .forEach() "one-liner"
    document.querySelectorAll(".card-removed").forEach((element)=>{element.parentNode.removeChild(element);});
}

function NextLevel()
{
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
            break;
        case 3:
            document.querySelector("footer").style.top = "900px";  
            break;
        default:
            document.querySelector("footer").style.top = "600px";
            document.querySelector("#player").classList.add("cardR03C04");

            break;
    }
    RandomDeck();
    DealCards();
}

function DealCards()
{
    
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