async function GetIp(){
    const IpURL = "https://api.ipify.org/?format=json";
    try {
        const response = await fetch(IpURL);
        if (!response.ok) {
            throw new Error(`Failed to fetch IP: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}





function Location(){
    const LocationURL = "http://ip-api.com/json/${ip}";
    fetch(file)
    .then(x => x.text())
    .then(y => myDisplay(y));
}

function wheather(){
    const wheatherURL = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1";

    

}



window.onload = (event) => {
    GetIp();
};