//RETRIEVE EXISTING WEATHER DATA IF PRESENT
var allWeather = JSON.parse(localStorage.getItem('weatherData'))||[];

//DAYJS
document.querySelector("#currentDay").textContent = "Today, " + dayjs().format('dddd, MMMM D, YYYY')
document.querySelector("#currentTime").textContent =dayjs().format('h:mm A')
var key = "69d4e3163b70b25ade9ac546dae8169a";
var apiAdd = "&appid=" + key;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
var idx = days.indexOf(dayjs().format('dddd'));
var in2 = days[idx+2] || days[idx-5];
var in3 = days[idx+3] || days[idx-4];
var in4 = days[idx+4] || days[idx-3];
var hr = dayjs().format('h');

//DEPENDENCIES
var subButton = document.getElementById("subButt");
var searchContent = document.querySelector("#locSearch");
var cityCollection = document.querySelector('.list-group');
var mainEl = document.querySelector("#main");
var city1El = document.querySelector("#city1");
var city2El = document.querySelector("#city2");
var city3El = document.querySelector("#city3");
var city4El = document.querySelector("#city4");
var city5El = document.querySelector("#city5");
var in2dsEl = document.querySelector("#in2ds");
var in3dsEl = document.querySelector("#in3ds");
var in4dsEl = document.querySelector("#in4ds");
var cityNameEl = document.querySelector(".cityName");
var locationEl = document.querySelector("#location");
var mainWeathEl = document.querySelectorAll(".mainWeath");
var descWeathEl = document.querySelectorAll(".descWeath");
var tempEl = document.querySelectorAll(".temp");
var windEl = document.querySelectorAll(".wind");
var weatherIconEl = document.querySelectorAll(".weathIcon");
var humidEl = document.querySelectorAll(".humid");
var tdForEl = document.querySelector("#tdFor");
var tmForEl = document.querySelector("#tmFor");
var in2ForEl = document.querySelector("#in2ds");
var in3ForEl = document.querySelector("#in3ds");
var in4ForEl = document.querySelector("#in4ds");
var cardTitleEls = [in2ForEl, in3ForEl, in4ForEl];
var cardTitle = [in2, in3, in4];
var weatherIconElMain = document.getElementById("weathIcon");
var pic = "./assets/images/default.png"
weatherIconEl.src=pic //assigning default picture if not assigned in function
for (let index = 0; index < cardTitleEls.length; index++) { //assigning the days of the week to the forecast cards
  cardTitleEls[index].textContent=cardTitle[index];
}

//INITIALIZATIONS
var lat;
var lon;
var longlatAdd;
var allInfo;
var dayTime;
var mainWeath;
var descWeath;
var temp ;
var wind ;
var humid;
var days = [];
var cityWeather;
var cityName;
var city;

//FUNCTIONS
function showWeather(){//show cards when initial search is made
  mainEl.classList.remove("hide");
  for (let index = 0; index < forecastsec.children.length; index++) {
    const currentFor = forecastsec.children[index];
    currentFor.classList.remove("hide");
  }
};
function getCoor(){//getting coordinates of city entered in search bar using api
    var baseUrl="https://api.openweathermap.org/geo/1.0/direct?q=";
    city = searchContent.value.replace(/ /g, '');
    var limitAdd = "&limit=" + 5;
    var requestUrl = baseUrl + city + limitAdd + apiAdd ;
    var x;
    var y;
    var meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";//fixing http/https api issue
    meta.content = "upgrade-insecure-requests";
    document.getElementsByTagName('head')[0].appendChild(meta);
    cityWeather=[];
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
       lat = data[0].lat;
       lon = data[0].lon;
        longlatAdd="lat=" + lat + "&lon=" + lon;
       getWeather(longlatAdd);//outputing coodinates into function to get weather conditions
    })
}

function addCity(isInitBuild, cityAdd){
  var present = false;
  for (let index = 0; index < allWeather.length; index++) {
    const currentLog = allWeather[index];
    if (currentLog[0].cityName === cityAdd) {
      present=true;
    }}
  if (!present || isInitBuild){//if either apart of the initial load of site or searched and not already part of the list, add to city list
  var newCity = document.createElement('button');
  newCity.textContent= cityAdd
  cityCollection.appendChild(newCity)
  newCity.addEventListener('click', function (event){//if city is clicked, load data into forecast
    showWeather();
    event.preventDefault();
    var idx;
    for (let index = 0; index < allWeather.length; index++) {
      const currentLog = allWeather[index];
      if (currentLog[0].cityName === cityAdd){//find object within weatherdata array
        idx=index;
      }
    }
  cityWeather = allWeather[idx];
  cityNameEl.textContent=cityWeather[0].cityName;
  popMain(cityWeather[0]);
  popFor(cityWeather);
  })
}}

function createObj (x) {//structure of data to be input into each day for weather of city
  days[x] = {
    cityName,
    mainWeath,
    dayTime,
    mainWeath,
    descWeath,
    temp,
    wind,
    humid
  }
}
var cont = ["descWeath", "temp", "wind", "humid"]
var preFix = ["", "Temperature: ", "Wind: ", "Humidity: "]
var postFix = ["", "°F", " mph", "%"]
function popMain(obj){//populate main card showing todays forecast
  pic = `./assets/images/${obj.mainWeath.toLowerCase()}.png`
  weatherIconEl[0].src=pic
  var els0 = [descWeathEl[0],tempEl[0],windEl[0],humidEl[0]]
  for (let b = 0; b < els0.length; b++) {
    var popStr = `${preFix[b]}${obj[cont[b]]}${postFix[b]} `
    els0[b].textContent = popStr;
}}

function popFor(fullObj){//populating the five day forecast
  for (var s=0;s<fullObj.length;s++){
    var currentObj = fullObj[s];
    pic = `./assets/images/${fullObj[s].mainWeath.toLowerCase()}.png`
    weatherIconEl[s+1].src=pic //assigning image based on weather
    var currentEl = [descWeathEl[s+1],tempEl[s+1],windEl[s+1],humidEl[s+1]];
    for (let d = 0; d < currentEl.length; d++) {
      var popStr = `${preFix[d]}${currentObj[cont[d]]}${postFix[d]} `
      currentEl[d].textContent = popStr;
    }
  }
}

function getWeather(addCoor) {//using weather api to extract data for weather
    var baseUrl2 = "https://api.openweathermap.org/data/2.5/forecast?"
    var units = "&units=imperial";
    var requestUrl2 = baseUrl2 + addCoor + apiAdd + units ;
    fetch(requestUrl2)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
      cityName = `${data.city.name}, ${data.city.country}`;
      cityNameEl.textContent=cityName;
       allInfo=data.list;
       for (var i=0;i<40;i++){
        var x=0;
        dayTime = allInfo[i].dt_txt;
        var stamp1=dayTime[11];
        var stamp2=dayTime[12];
        mainWeath = allInfo[i].weather[0].main;
        descWeath = allInfo[i].weather[0].description;
        temp = allInfo[i].main.temp
        wind = allInfo[i].wind.speed
        humid = allInfo[i].main.humidity
        if (stamp1==1 && stamp2==5) {//getting forecast for 15hrs or 3pm of each day
         if (cityWeather.length<6)//making sure its a 5 day forecast
            createObj(i);
            cityWeather.push(days[i]);
        }
      }
      popMain(cityWeather[0]);
      popFor(cityWeather);
      addCity(false, cityName);
      allWeather.push(cityWeather);
      window.localStorage.setItem('weatherData',JSON.stringify(allWeather)); //placing updated array in local storage
})
}

subButton.addEventListener('click', function (event){//initial function to  trigger the coordinates and show card functions
  event.preventDefault();
  getCoor();
  showWeather()
 })

 var forecastsec = document.querySelector('.forecast-section')
 allWeather.forEach(weatherEl => {
  addCity(true, weatherEl[0].cityName)//set to true bc this is the initial build
});