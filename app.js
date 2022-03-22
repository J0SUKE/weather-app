import {createTimePrevisionSection,celcius, createHTMLelement} from "./HTMLfunctions.js";

let myKey = "bfa938c767bd3c8880ee6716a28d78d2";
let days = 7;
let dataDaily;
let dataToday;
let time = new Date();
let WeekDays = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi",]
let latitude;
let longitude;

function setBodyBackground(sunset,sunrise,status) {

    let now = Math.floor(Date.now()/1000);
    
    if (now>sunset || now<sunrise) {
        document.body.style.background = "var(--bg-night)";
    }
    else
    {
        if(status=="Rain")
        {
            document.body.style.background = "var(--rainy-day)";       
        }
        else
        {
            document.body.style.background = "var(--bg-day)";       
        }
    }
}

//=====================================================================

function setHourlyWeather(data) {    
    let t = new Date();
    
    createTimePrevisionSection("Maint.", `./icons/${data.hourly[0].weather[0].icon}.png`,celcius(data.hourly[0].temp),(data.hourly[0].pop*100==0 ? "" : `${Math.floor(data.hourly[0].pop*100)}%`));
    t.setTime(Date.now());
    
    for (let i = 1; i <= 24; i++) 
    {   
        t.setHours(t.getHours()+i);
        createTimePrevisionSection(`${t.getHours()} h` , `./icons/${data.hourly[i].weather[0].icon}.png`,celcius(data.hourly[i].temp),(data.hourly[i].pop*100==0 ? "" : `${Math.floor(data.hourly[i].pop*100)}%`));
        t.setTime(Date.now());
    }    
}

function setDailWeather(data) 
{
    let daysElem = document.querySelectorAll(".daily-weather li");
    for (let i = 0; i < daysElem.length; i++) 
    {
        time.setHours(time.getHours()+(i+1)*24);
        daysElem[i].querySelector(".week-day").textContent = WeekDays[time.getDay()];
        time.setTime(Date.now());
        
        if(data.daily[i+1].pop*100>=40)
        {
            daysElem[i].querySelector(".daily-icon").innerHTML = `<img src=\"\./icons/${data.daily[i+1].weather[0].icon}.png"><span>${Math.floor(data.daily[i+1].pop*100)}%</span>`;
        }
        else
        {
            daysElem[i].querySelector(".daily-icon").innerHTML = `<img src=\"\./icons/${data.daily[i+1].weather[0].icon}.png">`;
        }

        
        daysElem[i].querySelector(".day").textContent = celcius(data.daily[i+1].temp.day);
        daysElem[i].querySelector(".night").textContent = celcius(data.daily[i+1].temp.eve);

    }    
}

function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    getWeather(latitude,longitude); 
}

function showError(error) {
    document.querySelector(".hero").innerHTML = `<h1 style=\"color:rgb(98, 0, 0);white-space:wrap\">${error.message}</h1>`;

}

function getWeather(latitude,longitude)
{

    let WeatherDaily = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&lang=fr&appid=${myKey}`;

    let wToday=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=fr&appid=${myKey}`;;

    fetch(WeatherDaily).then(function(response)
    {    
        dataDaily = response.json(); 
        return dataDaily;
    
    }).then(function(dataDaily){
        console.log(dataDaily);
        setHourlyWeather(dataDaily);
        setDailWeather(dataDaily)


        document.getElementById("risque-de-pluie").textContent = `${dataDaily.daily[0].pop*100}%`;
        document.getElementById("precipitations").textContent = `${(dataDaily.daily[0].rain==undefined? "-":dataDaily.daily[0].rain)} cm`;
        document.getElementById("uv").textContent = `${dataDaily.current.uvi}`;
    })


    fetch(wToday).then(function(response) {
        dataToday = response.json();
        return dataToday;
    }).then(function(dataToday){
    
        console.log(dataToday);
        setBodyBackground(dataToday.sys.sunset,dataToday.sys.sunrise,dataToday.weather[0].main);
        setTodaysDetails(dataToday)
    
    
        document.querySelector(".temperature").textContent = `${celcius(dataToday.main.temp)}°`;
        document.querySelector(".city").textContent = `${dataToday.name}`;
        document.querySelector(".description").textContent = `${dataToday.weather[0].description}`;
        document.querySelector(".details").textContent = `Max. ${celcius(dataToday.main.temp_max)}° Min. ${celcius(dataToday.main.temp_min)}°`;  
    })
}

function setTodaysDetails(data)
{
    let coucherHeure = new Date(data.sys.sunset*1000).getHours();
    let coucherMinute = new Date(data.sys.sunset*1000).getMinutes();
    
    let leverHeure = new Date(data.sys.sunrise*1000).getHours();
    let leverMinutes = new Date(data.sys.sunrise*1000).getMinutes();
    
    //----lever et coucher--------------
    document.getElementById("lever").textContent = `${leverHeure}:${leverMinutes}`;
    document.getElementById("coucher").textContent = `${coucherHeure}:${coucherMinute}`;
    
    //----pluie et humidité------------
    //daily
    document.getElementById("humidite").textContent = `${data.main.humidity}%`;

    //------vent et ressenti--------------
    document.getElementById("vent").textContent = `${Math.floor(data.wind.speed*3.6)} km/h`;
    document.getElementById("ressenti").textContent = `${celcius(data.main.feels_like)}°`;
    
    //------precipitation et pression--------------
    //document.getElementById("precipitations").textContent = `${} km/h`; dans la partie Daily
    document.getElementById("pression").textContent = `${data.main.pressure} hPa`;


    //----visibilité et indice uv----------------

    document.getElementById("visibilite").textContent = `${Math.floor(data.visibility/1000)} km/h`;
    // uv est dans Daily

}

function askPermission() {
    const cookies = document.cookie.split("; ");
    if(cookies.find(row => row=="permission=yes"))
    {
        return true;
    }
    else
    {
        document.body.append(createHTMLelement("div","ask-authorization"));
        document.querySelector(".ask-authorization").innerHTML = "<div class=\"ask-modal\"><p>In order to work correctly Weather needs to have access to your geolocation data</p><div class=\"buttons\"><div class=\"btn\" data-btn=\"allow\">Allow</div><div class=\"btn\" data-btn=\"deny\">Deny</div></div></div>";

        
        let btns = document.querySelectorAll(".btn");
        btns.forEach(element => {
            element.addEventListener("click",(e)=>{
                if(e.target.dataset.btn=="allow")
                {
                    let date = new Date();
                    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
                    const expires = "expires=" + date.toUTCString();
                    
                    document.cookie = `permission=yes; ${expires}; secure`;
                    document.querySelector(".ask-authorization").remove();   
                    return true;
                }
                else
                {
                    document.querySelector(".ask-authorization").remove();   
                    return false;
                }
            })
        })

    }
}


if(navigator.geolocation != undefined)
{
    if(askPermission())
    {
        navigator.geolocation.getCurrentPosition(setPosition,showError);
    
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(setPosition,showError);
        }, 5*60*1000);
    }
    
}
else
{
    document.querySelector(".hero").innerHTML = "<h1 style=\"color:red\">la geolocalisation n'est pas supportée par le navigateur</h1>";
}