async function GetCountry(){
    //const IpURL = "https://api.ipify.org/?format=json";
    const IpURL = "https://api.country.is/";
    try {
        const response = await fetch(IpURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch IP: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        CountryInfo(data.country)
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function CountryInfo(country){
    const CountryURL = `https://restcountries.com/v3.1/alpha/${country}`;
    try {
        const response = await fetch(CountryURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch IP: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


/*
function Location(){
    const LocationURL = "http://ip-api.com/json/${ip}";
    fetch(file)
    .then(x => x.text())
    .then(y => myDisplay(y));
}

*/

function GetLocationManuel(){

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


async function wheather(latitude, longitude){
    const wheatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1`;
    try {
        const response = await fetch(wheatherURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch the Wheather: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
    

}



window.onload = (event) => {
    GetCountry();
    GetLocationManuel();
};