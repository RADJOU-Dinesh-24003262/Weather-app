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
        MoreCountryInfo(data.geoplugin_countryName)
        wheather(data.geoplugin_latitude,data.geoplugin_longitude);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function MoreCountryInfo(country){
    const CountryURL = `https://restcountries.com/v3.1/name/${country}`;
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
    GetLocInfo();
};