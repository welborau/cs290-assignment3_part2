function getPages() {
    // if the user selects 6 pages, result in error
    if (document.getElementById('pages').value == 6) {
        alert('You cannot search for 6 pages of gists on this site!');
    }
    else {
        var request_Array = [];
        var pagesVal = document.getElementById('pages').value;
        // loop through the values of pages
        for (var i = 1; i <= pagesVal; i++) {

            //opens a new XMLHttprequest
            var request_Data = RequestHttp();

            // creates the page of gists to be assigned to the request
            var site = 'https://api.github.com/gists/public?page=' + i;
            //prepares the request and sends it
            request_Data.onreadystatechange = function () {
                //checks the status of the request
                if (request_Data.readyState === 4) {
                    if (request_Data.status == 200) {
                        alert('The request was successful!');
                        // parses the JSON object and returns an array
                        request_Data = parseTHIS(request_Data.responseText);
                        // concanates the array together after each loop
                        request_Array = request_Array.concat(request_Data);
                        // waits for the request to be done, then finds the correct page and assigns it to the gist list
                        if(i == pagesVal) {
                            var checkedList = checked();
                            gistList(request_Array, checkedList);
                            createList();
                        }
                    }
                    else {
                        //catch all error
                        alert('There was a problem with the request!');
                    }
                }
            };
            // synchronously gets the data from the site
            if (request_Data) {
                request_Data.open('GET', site, false);
                request_Data.send();
            }

        }
    }
}
// declaration of xmlHTTP
var xmlHttp = null;

/**
 * Requests for the data from the site, depending on what browser we are using
 * @returns {*}
 * @constructor
 */
function RequestHttp() {
        if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
                xmlHttp = new XMLHttpRequest();
        }else { // IE 6 and older
                xmlHttp = new ActiveXOjbect("Microsoft.XMLHTTP");
        }
       
        return xmlHttp;
}

/**
 * Parses the JSON object that is passed into this function
  * @returns (*)
 */
function parseTHIS(data)
{
    var JSON_object = data;
    var JSON_array = JSON.parse(JSON_object);
        return JSON_array;
}

/**
 * Checks for which language boxes are checked, then helps build the gist list according to what is checked
 * @returns {Array}
 */
function checked()
{
    var checkedList = [];
    if (document.getElementById('Javascript').checked)
    {
        checkedList.push('JavaScript');
    }
    if (document.getElementById('JSON').checked)
    {
        checkedList.push('JSON');
    }
    if (document.getElementById('SQL').checked)
    {
        checkedList.push('SQL');
    }
    if (document.getElementById('Python').checked) {
        checkedLIst.push('Python');
    }

    return checkedList;
}

gist_list = [];

/**
 * Builds the gist list using for in loops and objects
 * @param array
 * @param checked
 * @returns {Array|*}
 */
function gistList(array, checked) {
    for (var i = 0; i < array.length; i++) {
        var gist = array[i];
        // finds the object called files
        for(var prop1 in gist.files) {
            if(gist.files.hasOwnProperty(prop1)) {
                var file = gist['files'][prop1];
                // if no boxes are checked, then display everything on the gist list
                if (checked.length == 0) {
                    var Gist = {
                        filename: file['filename'],         // file name of gist
                        description: gist['description'],   // description of gist
                        url: gist['html_url'],               // url of gist
                        favorite: 'no'
                    };

                    gist_list.push(Gist);                   // pushes the gist into the list
                }
                else {
                    // if boxes are checked, create the list according to what is checked
                    for (var j = 0; j < checked.length; j++) {
                        if (file.language == checked[j]) {
                            var matchedGist = {
                                filename: file['filename'],         // file name of gist
                                description: gist['description'],   // description of gist
                                url: gist['html_url'],               // url of gist
                                favorite: 'no'
                            };
                            gist_list.push(matchedGist);     // pushes the matched gists into the list
                            console.log(matchedGist);
                        }
                    }
                }
            }
        }
    }
}

/**
 * When the search button is clicked, run the program
  */
document.getElementById("search_button").onclick = function() {
   fullq = document.getElementById('gist_list');
    if (fullq)
    {
        document.getElementById('gist_list').innerHTML = '';
        getPages();
    }
    else {
        getPages();
    }
};

/**
 * Inserts the table into the table element in html, using gist list and it's objects and keys
 * @param gist_list
 */
function createList() {
    var glist = document.getElementById('gist_list');
    var listItems = '';
    // loops through all gists in the gist list
    for (var i = 0; i < gist_list.length; i++) {
        if (!gist_list[i].description)
        {
            listItems += '<tr><td>' + gist_list[i].filename + '</td><td>' + '<a href="'+ gist_list[i].url+ '">' + 'No description' + '</a></td>' + '<td><button id="' + 'Fav' + i + '" onclick="createFav(' + i + ')">' + 'Add to Favorites' + '</button></td></tr>';
        }
        else
        {
            listItems += '<tr><td>' + gist_list[i].filename + '</td><td>' + '<a href="' + gist_list[i].url + '">' + gist_list[i].description + '</a></td>' + '<td><button id="' + 'Fav' + i + '" onclick="createFav(' + i + ')">' + 'Add to Favorites' + '</button></td></tr>';
        }
    }
    // pushes the table into the html
    glist.innerHTML = listItems;
}

/**
 * Changes the favorite from no to yes
 */
function createFav(i)
{
    gist_list[i].favorite = "yes";
    console.log("This button has been clicked! ",  i, gist_list[i]);
    console.log(i);
    createFavList();
}

/**
 * Creates the list of Favorites
 */
function createFavList() {
    var favlist = document.getElementById('favorites');
    var favlistItems = '';
    // loop through all gists in the gist list and find the ones with yes
    for (var i = 0; i <gist_list.length; i++) {
        if (gist_list[i].favorite == "yes")
        {
            favlistItems += '<tr><td>' + gist_list[i].filename + '</td><td><button id="' + 'UnFav' + i + '" onclick="unFav(' + i + ')">' + 'Remove from Favorite' + '</button></td></tr>';
        }
    }
    favlist.innerHTML = favlistItems;
}

/**
 * Changes the favorite from yes to no and recreates the list of Favorites
 */
function unFav(i)
{
    gist_list[i].favorite = "no";
    console.log("This button has been clicked! ",  i, gist_list[i]);
    console.log(i);
    createFavList();
}