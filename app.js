var country = document.getElementById("Pays");
var countryImg = document.getElementById("PaysImg");
var countryImgLink = document.getElementById("PaysImgLink");
var people = document.getElementById("Population");
var city = document.getElementById("Ville");
var region = document.getElementById("Region");
var temperature = document.getElementById("Temperature");
var maxTemperature = document.getElementById("MaxTemp");
var minTemperature = document.getElementById("MinTemp");
var probaRain = document.getElementById("Pluie");
var rain = document.getElementById("Precipitation");
var latitude;
var longitude;
var dataCity;


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
        latitude = data.geoplugin_latitude; 
        longitude = data.geoplugin_longitude;
        return data;

    } catch (error) {
        console.error('Fetch error:', error);
    }
    
}

async function MoreCountryInfo(CountryURL){
    try {
        const response = await fetch(CountryURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch IP: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);

        country.innerHTML = data[0].translations.fra.official;
        countryImgLink.href = data[0].maps.googleMaps;
        countryImg.src =  data[0].flags.svg;
        countryImg.alt = data[0].flags.alt;
        people.innerHTML = data[0].population;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function wheather(){
    const wheatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    try {
        const response = await fetch(wheatherURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch the Wheather: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);


        let timeNow = new Date(Date.now());

        temperature.innerHTML = data.hourly.temperature_2m[timeNow.getHours()] + " " + data.hourly_units.temperature_2m;
        probaRain.innerHTML = data.hourly.precipitation_probability[timeNow.getHours()] + " " + data.hourly_units.precipitation_probability;
        rain.innerHTML = data.hourly.precipitation[timeNow.getHours()] + " " + data.hourly_units.precipitation;


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
    if(text.length > 1){ 
        try {
            const response = await fetch(IpURL);
            if (!response.ok) {
                throw new Error(`Failed to fetch IP: ${response.statusText}`);
            }
            const data = await response.json();
            
            var textOption = "";
            if(data.results != undefined){
                data.results.forEach((item, index) => {
                    
                    if(item.admin1 != undefined && item.admin2 != undefined){
                        var region = item.admin1 + ", " + item.admin2 + ", " + item.country;
                    }else if(item.admin1){
                        var region = item.admin1 + ", " + item.country;
                    }else{
                        var region = item.country;
                    }
                    textOption += `<option value="${index+1}. ${item.name}">${region}</option> `;
                  })
                dataCity = data.results;
                console.log(dataCity);

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

faire en fonction du gmt, a faire 

async function CityInfo(form){
   
    var SearchValue = await form.Search.value;

    console.log(dataCity)
    longitude = dataCity[parseInt(SearchValue[0])-1].longitude ;
    latitude = dataCity[parseInt(SearchValue[0])-1].latitude;

    city.innerHTML = dataCity[parseInt(SearchValue[0])-1].name;
    region.innerHTML = dataCity[parseInt(SearchValue[0])-1].admin1;
    MoreCountryInfo(`https://restcountries.com/v3.1/alpha?codes=${dataCity[parseInt(SearchValue[0])-1].country_code}`);
    wheather();

}

window.onload = async (event) => {
    data = await GetLocInfo();
    city.innerHTML = data.geoplugin_city;
    region.innerHTML = data.geoplugin_region;
    

    MoreCountryInfo(`https://restcountries.com/v3.1/name/${data.geoplugin_countryName}`);
    wheather();
};