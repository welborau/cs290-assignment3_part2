/**
 * Function for establishing the gists per pages as requested
 */
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
                            var gist_list = gistList(request_Array, checkedList);
                            createList(gist_list);
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
        checkedList.push('Javascript');
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
                        url: gist['html_url']               // url of gist
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
                                url: gist['html_url']               // url of gist
                            };
                            gist_list.push(matchedGist);     // pushes the matched gists into the list
                        }
                    }
                }
            }
        }
    }
    return gist_list;
}

/**
 * When the search button is clicked, run the program
  */
document.getElementById("search_button").onclick = function() {
    getPages();
};

/**
 * Inserts the table into the table element in html, using gist list and it's objects and keys
 * @param gist_list
 */
function createList(gist_list) {
    console.log('>>>>>>>>>>>', gist_list);
    var glist = document.getElementById('gist_list');
    var listItems = '';
    // loops through all gists in the gist list
    for (var i = 0; i < gist_list.length; i++) {
        listItems += '<tr><td>' + gist_list[i].filename + '</td><td>' + '<a href="'+ gist_list[i].url+ '">' + gist_list[i].description + '</a></td></tr>';
    }
    // pushes the table into the html
    glist.innerHTML = listItems;
}
