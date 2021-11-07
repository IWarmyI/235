// 1
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
// 2
let displayTerm = "";

// 3
function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    
    //1
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    //2
    let GIPHY_KEY = "ZD5MrAtUfTFX4OXPoqzu5Gl6wp9N009f";

    //3
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    //4
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //5
    term = term.trim();

    //6
    term = encodeURIComponent(term);

    //7
    if(term.length < 1) return;

    //8
    url += "&q=" + term;

    //9
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    //10
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b> <img src=\"images/spinner.gif\">";

    //11
    console.log(url);

    // 12 Request data!
    getData(url);

}

function getData(url){
    //1
    let xhr = new XMLHttpRequest();

    //2
    xhr.onload = dataLoaded;

    //3
    xhr.onerror = dataError;

    //4
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e){
    //5
    let xhr = e.target;

    //6
    console.log(xhr.responseText);

    //7
    let obj = JSON.parse(xhr.responseText);

    //8
    if(!obj.data || obj.data.length == 0){
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return;
    }

    //9
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "";

    //10
    for (let i = 0; i < results.length; i++){
        let result = results[i];

        //11
        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) smallURL = "images/no-image-found.png";

        //12
        let url = result.url;

        //13
        let line = `<div class='result'><img src='${smallURL}' title='${result.id}' />`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a>`;

        //add rating
        let rating = (result.rating ? result.rating : "NA").toUpperCase(); 
        line += `<p>Rating: ${rating}</p></span></div>`;

        //14
        bigString += line;
    }

    //16
    document.querySelector("#content").innerHTML = bigString;

    //17
    document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e){
    console.log("An error occurred");
}