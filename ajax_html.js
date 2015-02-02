
window.onload = function() {
    var temp = [];
    //wipes any localStorage for pages and Gist_Names upon fresh load
    localStorage.setItem('tabs', JSON.stringify(temp));
    localStorage.setItem('Gist_Names', JSON.stringify(temp));
}

function getPages(number)
{
    //makes sure no gists are present upon load
    emptyElement('gistList', 'listing');
    var url;
    //opens a new XMLHttprequest
    var request_Data = RequestHttp();
    //this url is supplied and number come from the id of the clicked
    //tab on the page
    site = 'https://api.github.com/gists/public?page=' + number;
    //prepares the request and sends it
    if (request_Data) {
        request_Data.open('GET', site, true);
        request_Data.send('https://api.github.com/gists/public?page=1&per_page=30');
    }

    request_Data.onreadystatechange = function()
    {
        //checks the status of the request
        if (request_Data.readyState === 4) {
            if (request_Data.status === 200) {
                //stores the response in request_Data as text
                localStorage.setItem('request_Data', request_Data.responseText);
                //calls a function to populate the page with gists
                //parseTHIS(request_Data.responseText, 'listing');
            }
            else {
                //catch all error
                alert('There was a problem with the request!');
            }
        }
        else
        {
            alert('There was a problem with the request!')
        }
    };
}

var xmlHttp;

function RequestHttp() {
        if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
                xmlHttp = new XMLHttpRequest();
        }else { // IE 6 and older
                xmlHttp = new ActiveXOjbect("Microsoft.XMLHTTP");
        }
       
        return xmlHttp;
}

function parseTHIS()
{
    var JSON_object = xmlHttp.responseText;
    var JSON_array = JSON.parse(JSON_object);
        console.log(JSON_object);
        console.log(JSON_array[0].description);
        console.log(JSON_array[0].html_url);
        return JSON_array;
}

function getValue(obj, name) {
    var prop;
    var data;
    //loops through all the nested elements to find the key
    for (prop in obj) {
        for (data in obj[prop]) {
            if (data == name)
                //returns the desired field
                return String(obj[prop][data]);
        }
    }
}

document.getElementById("search_button").onclick == function() {
    var data = parseTHIS();
    var data_array = [];
    var list = document.getElementById('gist_list');
    for (var i = 0; i < data.length; i++)
    {
        data_array[i] = new formatting(data[i]);
        element = createListingElem(formatting[i], type);
        document.getElementById('gist_list').appendChild(element);
    }
    localStorage.setItem('list', JSON.stringify(data_array));
}

function formatting(obj) {
    this.language = getValue(obj['files'], 'language');
    if (this.language == 'null') {
        this.language = 'Not Specified';
    }
    if (obj['description'] != '') {
        this.description = obj['description'];
    } else {
        this.description = 'No Description';
    }
    this.url = obj['html_url'];
    this.id = obj['id'];
}

function createListingElem(data, type) {
    var format = document.createElement('div');
    format.setAttribute('class', type);
    format.setAttribute('id', data.id);

    var description = document.createElement('div');
    description.setAttribute('class', 'description');
    var url = '<a href="' + data.url + '">' + data.description + '</a>';
    description.innerHTML = url;
    format.appendChild(description);

    var language = document.createElement('div');
    language.setAttribute('class', 'language');
    language.textContent = data.language;
    format.appendChild(language);

    return format;
}
