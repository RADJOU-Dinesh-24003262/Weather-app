var country = document.getElementById("Pays");
var countryImg = document.getElementById("PaysImg");
var people = document.getElementById("Population");
var city = document.getElementById("Ville");
var region = document.getElementById("Region");
var temperature = document.getElementById("Temperature");
var maxTemperature = document.getElementById("MaxTemp");
var minTemperature = document.getElementById("MinTemp");
var probaRain = document.getElementById("Pluie");
var rain = document.getElementById("Precipitation");


/*function GetLocationManuel(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        document.getElementById("error").innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    console.log(position);
    wheather(position.coords.latitude, position.coords.longitude);
}
*/
async function GetLocInfo(){
    const IpURL = "http://www.geoplugin.net/json.gp";
    try {
        const response = await fetch(IpURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch IP: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Fetch error:', error);
    }
    
}

async function MoreCountryInfo(countryloc){
    const CountryURL = `https://restcountries.com/v3.1/name/${countryloc}`;
    try {
        const response = await fetch(CountryURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch IP: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);

        country.innerHTML = data[0].name.nativeName.fra.official;
        countryImg.href = data[0].maps.googleMaps;
        countryImg.src =  data[0].flags.svg;
        countryImg.alt = data[0].flags.alt;
        people.innerHTML = data[0].population;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function wheather(latitude, longitude){
    const wheatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1`;
    try {
        const response = await fetch(wheatherURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch the Wheather: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);


        let timeNow = new Date(Date.now()).toISOString().slice(0,14) + "00"
        for (const time of data.hourly.time) {
            if(time == timeNow){
                temperature.innerHTML = data.hourly.temperature_2m[parseInt(timeNow.slice(11,13))+1] + " " + data.hourly_units.temperature_2m;
                probaRain.innerHTML = data.hourly.precipitation_probability[parseInt(timeNow.slice(11,13))+1] + " " + data.hourly_units.precipitation_probability;
                rain.innerHTML = data.hourly.precipitation[parseInt(timeNow.slice(11,13))+1] + " " + data.hourly_units.precipitation;
            }
          }

        maxTemperature.innerHTML = data.daily.temperature_2m_max + data.daily_units.temperature_2m_max;
        minTemperature.innerHTML = data.daily.temperature_2m_min + data.daily_units.temperature_2m_min;



    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function SearchCity(){
    let text = document.getElementById("Search").value;
    const IpURL = `https://geocoding-api.open-meteo.com/v1/search?name=${text}&count=10&format=json&language=fr`;
    let Option = document.getElementById("search-options");
    if(text.length > 3){ 
        try {
            const response = await fetch(IpURL);
            if (!response.ok) {
                throw new Error(`Failed to fetch IP: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data.results);
            
            if(data.results != undefined){
                var textOption = "";
                for (let i in data.results) {
                    if(data.results[i].admin1 != undefined && data.results[i].admin2 != undefined){
                        var region = data.results[i].admin1 + ", " + data.results[i].admin2 + ", " + data.results[i].country;
                    }else if(data.results[i].admin1){
                        var region = data.results[i].admin1 + ", " + data.results[i].country;
                    }else{
                        var region = data.results[i].country;
                    }
                    textOption += `<option value="${data.results[i].name}">${region}</option> `;
                 }
            }
            
            Option.innerHTML = textOption;

        } catch (error) {
            console.error('Fetch error:', error);
        }
    }else{
        Option.innerHTML = "";
        text.autocomplete = "off";
    }    
}


window.onload = async (event) => {
    data = await GetLocInfo();
    console.log(data);
    city.innerHTML = data.geoplugin_city;
    region.innerHTML = data.geoplugin_region;
    

    MoreCountryInfo(data.geoplugin_countryName);
    wheather(data.geoplugin_latitude,data.geoplugin_longitude);
};