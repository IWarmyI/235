"use strict";
window.onload = init;

function init(){
    document.querySelector("#search").onclick = getData;

    //get input fields
    const character = document.querySelector("#character");
    const game = document.querySelector("#game");
    const amiibo = document.querySelector("#amiibo");
    //const limit = document.querySelector("#limit");

    //set prefix
    const prefix = "dm1250-";

    //create keys
    const characterKey = prefix + "character";
    const gameKey = prefix + "game";
    const amiiboKey = prefix + "amiibo";
    //const limitKey = prefix + "limit";

    //get data
    const storedCharacter = localStorage.getItem(characterKey);
    const storedGame = localStorage.getItem(gameKey);
    const storedAmiibo = localStorage.getItem(amiiboKey);
    //const storedLimit = localStorage.getItem(limitKey);

    //display if found
    if (storedCharacter)
    {
        character.value = storedCharacter;
    }
    if (storedGame)
    {
        game.value = storedGame;
    }
    if (storedAmiibo)
    {
        amiibo.value = storedAmiibo;
    }
    /*if (storedLimit)
    {
        limit.querySelector(`option[value='${storedLimit}']`).selected = true;
    }*/

    //set new key-value pairs if user changes text/radio button
    character.onchange = e => { localStorage.setItem(characterKey, e.target.value) };
    game.onchange = e => { localStorage.setItem(gameKey, e.target.value) };
    amiibo.onchange = e => { localStorage.setItem(amiiboKey, e.target.value) };
    //limit.onchange = e => { localStorage.setItem(limitKey, e.target.value) };
}

function getData(){
    // 1 - main entry point to web service
    const SERVICE_URL = "https://www.amiiboapi.com/api/amiibo/?";
    
    // No API Key required!
    
    // 2 - build up our URL string
    // not necessary for this service endpoint
    let url = SERVICE_URL;
    
    // 3 - parse the user entered terms we wish to search

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
    
    // 4 - update the UI (delete when finished)
    //document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;
    
    // 5 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 6 - set the onload handler
    xhr.onload = dataLoaded;

    // 7 - set the onerror handler
    xhr.onerror = dataError;

    // 8 - open connection and send the request
    xhr.open("GET",url);
    xhr.send();
}

function dataError(e){
    console.log("An error occurred");
}

function dataLoaded(e){
    // 1 - e.target is the xhr object
    let xhr = e.target;

    // 2 - xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);

    // 3 - turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);
    
    // 4 - if there is an array of results, loop through them
    let results = obj.amiibo;
    let bigString = "";

    //get amount of results requested by user
    //let length = document.querySelector("#limit").value

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

    // 5 - display final results to user
    document.querySelector("#content").innerHTML = bigString;
}