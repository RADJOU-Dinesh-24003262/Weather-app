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


async function GetLocationManuel(userdata,Country1){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(            
            (position) => showPosition(position, userdata), 
            (error) => showError(error, userdata, Country1));
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

async function showPosition(position, userdata) {
    userdata = position;
    latitude = position.coords.latitude
    longitude =  position.coords.longitude;
    weather();
    userdata = [position,await GetLocInfo(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)];
    console.log(userdata);
    let Country1 = "name/" + userdata[1].address.country; 
    MoreCountryInfo(`https://restcountries.com/v3.1/${Country1}`);

    let cityInfo = userdata[1].address;
    if (cityInfo.city != undefined){
        city.innerHTML = cityInfo.city;
    }else if (cityInfo.town != undefined){
        city.innerHTML = cityInfo.town;
    }
    
    region.innerHTML = cityInfo.country;
    
}

function showError(error, userdata, Country1) {
    MoreCountryInfo(`https://restcountries.com/v3.1/alpha?codes=FR`);
    if (userdata && Country1){
        console.log(latitude,longitude);
        weather();
        MoreCountryInfo(`https://restcountries.com/v3.1/${Country1}`);
        
    }else{
        document.getElementsByTagName("section")[0].lastElementChild.style.display = "none";
    }
    msg = document.createElement("h1");
    msg.textContent = "Veuillez nous autorisez à acceder à la localisation !!!";
    msg.style.color = "red";
    msg.style.margin = "40% 10%";

    document.getElementsByTagName("section")[0].insertBefore(msg, document.getElementsByTagName("article")[1]);

    console.log("Error occurred: " + error.message);
}

async function GetLocInfo(IpURL){
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

async function MoreCountryInfo(CountryURL){
    try {
        const response = await fetch(CountryURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch IP: ${response.statusText}`);
        }
        data = await response.json();
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

async function weather(){
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    try {
        const response = await fetch(weatherURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch the Weather: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);


        let timeNow = new Date(Date.now());

        temperature.innerHTML = data.hourly.temperature_2m[timeNow.getHours()] + " " + data.hourly_units.temperature_2m;
        probaRain.innerHTML = Math.max(...data.hourly.precipitation_probability.slice(timeNow.getHours(), timeNow.getHours()+2)) + " " + data.hourly_units.precipitation_probability;
        rain.innerHTML = Math.max(...data.hourly.precipitation.slice(timeNow.getHours(), timeNow.getHours()+2)) + " " + data.hourly_units.precipitation;

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
                    
                    if (item.admin1 && item.admin2){
                        var region = `${item.admin1}, ${item.admin2}, ${item.country}`;
                    }else if(item.admin1){
                        var region = `${item.admin1}, ${item.country}`;
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

//faire en fonction du gmt, a faire 

async function CityInfo(form){
   
    console.log(dataCity);
    var SearchValue = await form.Search.value;
    if(dataCity  && !isNaN(Number(SearchValue[0]))){
        i = parseInt(SearchValue[0])-1;
        form.Search.value = SearchValue.slice(3,SearchValue.length) ;

        
        longitude = dataCity[i].longitude ;
        latitude = dataCity[i].latitude;
        weather();

        city.innerHTML = dataCity[i].name;
        region.innerHTML = dataCity[i].admin1;
        MoreCountryInfo(`https://restcountries.com/v3.1/alpha?codes=${dataCity[i].country_code}`);
        
        document.getElementsByTagName("section")[0].lastElementChild.style.display = "block";
    }else{
        while ( !isNaN(Number(SearchValue[0])) || SearchValue[0] === '.' || SearchValue[0] === ' ' ){
            SearchValue = SearchValue.slice(1 , SearchValue.length);
            form.Search.value = SearchValue;
            console.log(SearchValue);
        }
        
        SearchCity();
    }

}

window.onload = async (event) => {
    let Country1;
    let userdata;
    try{
        data = await GetLocInfo("https://ipinfo.io/json");
        if (data != undefined){
            console.log(data.loc);
            let VirgI = data.loc.indexOf(',');
            console.log(typeof data.loc);
            console.log(VirgI);
            if (VirgI !== -1) {
                latitude = data.loc.substring(0, VirgI); 
                longitude = data.loc.substring(VirgI + 1);
            }
            console.log(latitude,longitude);
            city.innerHTML = data.city;
            region.innerHTML = data.region;
            Country1 = "alpha/" + data.country;
            userdata = data;
        }else {
            data = await GetLocInfo("http://www.geoplugin.net/json.gp");
            if (data != undefined){
                latitude = data.geoplugin_latitude; 
                longitude = data.geoplugin_longitude;
                city.innerHTML = data.geoplugin_city;
                region.innerHTML = data.geoplugin_region;
                Country1 = "name/" + data.geoplugin_countryName;
                userdata = data;
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
    await GetLocationManuel(userdata, Country1);
};