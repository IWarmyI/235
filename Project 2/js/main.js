"use strict";
window.onload = init;

//main entry point to web service
const SERVICE_URL = "https://www.amiiboapi.com/api/";

//set prefix
const prefix = "dm1250-";

function init(){
    gameStart();
    amiiboStart();
    document.querySelector("#search").onclick = getData;

    //get saved search input

    //get input fields
    const character = document.querySelector("#character");
    //create keys
    const characterKey = prefix + "character";
    //get data
    const storedCharacter = localStorage.getItem(characterKey);
    //display if found
    if (storedCharacter)
    {
        character.value = storedCharacter;
    }
    //set new key-value pairs if user changes text/options
    character.onchange = e => { localStorage.setItem(characterKey, e.target.value) };
}

function getData(){
    //indicate search
    document.querySelector("#content").innerHTML = `<p>Please wait. Searching. . .</p>`

    // No API Key required!
    
    //build up our URL string
    //not necessary for this service endpoint
    let url = SERVICE_URL + "amiibo/?";
    
    //parse the user entered terms we wish to search

    //chracter name
    let character = document.querySelector("#character").value.trim();
    character = encodeURIComponent(character);
    //check if character is empty
    if (character != "")
    {
        url += `name=${character}`;
    }

    //game series
    let game = document.querySelector("#game").value.trim();
    game = encodeURIComponent(game);
    //check if a character was inputted and if game series is empty
    if (character == "" && game != "")
    {
        url += `gameseries=${game}`;
    }
    else if (game != "")
    {
        url += `&gameseries=${game}`;
    }

    let amiibo = document.querySelector("#amiibo").value.trim();
    amiibo = encodeURIComponent(amiibo);
    //check if either a chracter or game series was inputted and if amiibo series is empty
    if (character == "" && game == "" && amiibo != "")
    {
        url += `amiiboSeries=${amiibo}`;
    }
    else if (amiibo != "")
    {
        url += `&amiiboSeries=${amiibo}`;
    }

    console.log(url);

    //create a new XHR object
    let xhr = new XMLHttpRequest();

    //set the onload handler
    xhr.onload = dataLoaded;

    //set the onerror handler
    xhr.onerror = dataError;

    //open connection and send the request
    xhr.open("GET",url);
    xhr.send();
}

function dataError(e){
    console.log("An error occurred");
}

function dataLoaded(e){
    //e.target is the xhr object
    let xhr = e.target;

    //turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);
    console.log(obj.amiibo);
    //if there is an array of results, loop through them
    let results = obj.amiibo;
    let bigString = "";

    //check length of results
    if (results == null)
    {
        //let user know nothing was found    
        bigString += `<p>Nothing was found. Please Try again.</p>`
    }
    else
    {
        //loop outputting all results
        for (let i = 0; i < results.length; ++i)
        {
            //amiibo name
            bigString += `<div><u><h1>${results[i].name}</h1></u>`
            //image
            bigString += `<img src="${results[i].image}" title="${results[i].character}" /><br>`;
            //character name
            bigString += `<p>Character: ${results[i].character}<br>`
            //game series
            bigString += `Game Series: ${results[i].gameSeries}<br>`
            //amiibo series
            bigString += `Amiibo Series: ${results[i].amiiboSeries}<br>`
            //us release date
            bigString += `Release Date: ${results[i].release.na}<br>`
            //type of amiibo
            bigString += `Type: ${results[i].type}</p></div>`
        }
    }

    //display final results to user
    document.querySelector("#content").innerHTML = bigString;
}

function gameStart()
{
    //create a new XHR object
    let xhr = new XMLHttpRequest();

    //url to get all amiibo game series
    let setup = SERVICE_URL + "gameseries/";

    //set the onload handler
    xhr.onload = setGameOptions;

    //set the onerror handler
    xhr.onerror = dataError;

    //open request
    xhr.open("GET", setup);
    xhr.send();
}

function setGameOptions(e)
{
    //e.target is the xhr object
    let xhr = e.target;

    //turn the text into a parsable JavaScript object
    
    let obj = JSON.parse(xhr.responseText);
    let results = obj.amiibo;
    //sort options in decending order
    results.sort((a, b) => {
        let nameA = a.name;
        let nameB = b.name;

        if (nameA < nameB)
        {
            return -1;
        }
        if (nameA > nameB)
        {
            return 1;
        }

        return 0;
    });
    let bigString = "";

    //loop through all options and add only unique series
    for (let i = 0; i < results.length; i++)
    {
        if (i != 0 && results[i - 1].name == results[i].name)
        {
            continue;
        }
        else
        {
            bigString += `<option value="${results[i].name}">${results[i].name}</option>`
        }
    }
    //load game series
    const game = document.querySelector("#game");
    game.innerHTML += bigString;

    //load last search
    const gameKey = prefix + "game";
    const storedGame = localStorage.getItem(gameKey);
    if (storedGame)
    {
        game.querySelector(`option[value="${storedGame}"]`).selected = true;
    }
    game.onchange = e => { localStorage.setItem(gameKey, e.target.value) };
}

function amiiboStart()
{
    //create a new XHR object
    let xhr = new XMLHttpRequest();

    //url to get all amiibo game series
    let setup = SERVICE_URL + "amiiboseries/";

    //set the onload handler
    xhr.onload = setAmiiboOptions;

    //set the onerror handler
    xhr.onerror = dataError;

    //open request
    xhr.open("GET", setup);
    xhr.send();
}

function setAmiiboOptions(e)
{
    //e.target is the xhr object
    let xhr = e.target;

    //turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);
    let results = obj.amiibo;
    //sort options in decending order
    results.sort((a, b) => {
        let nameA = a.name;
        let nameB = b.name;

        if (nameA < nameB)
        {
            return -1;
        }
        if (nameA > nameB)
        {
            return 1;
        }

        return 0;
    });
    let bigString = "";
    //loop through all options and add only unique series
    for (let i = 0; i < results.length; i++)
    {
        if (i != 0 && results[i - 1].name == results[i].name)
        {
            continue;
        }
        else
        {
            bigString += `<option value="${results[i].name}">${results[i].name}</option>`
        }
    }
    //load amiibo series
    const amiibo = document.querySelector("#amiiboseries #amiibo");
    amiibo.innerHTML += bigString;
    //load last search
    const amiiboKey = prefix + "amiibo";
    const storedAmiibo = localStorage.getItem(amiiboKey);
    if (storedAmiibo)
    {
        amiibo.querySelector(`option[value="${storedAmiibo}"]`).selected = true;
    }

    amiibo.onchange = e => { localStorage.setItem(amiiboKey, e.target.value) };
}