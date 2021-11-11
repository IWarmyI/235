"use strict";
window.onload = init;

function init(){
    document.querySelector("#search").onclick = getData;
}

function getData(){
    // 1 - main entry point to web service
    const SERVICE_URL = "https://www.amiiboapi.com/api/amiibo/?gameseries=";
    
    // No API Key required!
    
    // 2 - build up our URL string
    // not necessary for this service endpoint
    let url = SERVICE_URL;
    
    // 3 - parse the user entered term we wish to search
    // not necessary for this service endpoint
    let term = document.querySelector("#searchterm").value.trim();
    term = encodeURIComponent(term);
    url+=term;
    
    // 4 - update the UI
    document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;
    
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
    //loop outputting all results
    for (let i = 0; i < results.length; ++i)
    {
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
        bigString += `Type: ${results[i].type}</p><br>`
    }

    // 5 - display final results to user
    document.querySelector("#content").innerHTML = bigString;
}