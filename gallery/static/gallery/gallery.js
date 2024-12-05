document.addEventListener('DOMContentLoaded',() => {

    const box = document.querySelector("#edit_box");

    edit(box);

    document.querySelector("#save").addEventListener('click', () => {
        const content = document.querySelector("#location")
        change_location(content.value).then(() => {
            const weather_tag = document.querySelector("#weather");
            
            document.querySelector("#curr_loc").innerHTML = content.value

            get_weather(content.value, weather_tag.dataset.key).then((weather) => {
                weather_tag.dataset.weather = weather["weather"][0]["main"];
                weather_tag.innerHTML = weather["weather"][0]["description"];
                document.querySelector("#pic").src = `https://openweathermap.org/img/wn/${weather["weather"][0]["icon"]}@2x.png`
            }).catch(error => {
                error.message;
            });    
        });
        edit(box);
    })

    document.querySelector("#change").addEventListener('click', () => {
        edit(box)
    })


    try {
        const weather_tag = document.querySelector("#weather")
        get_weather(weather_tag.dataset.location, weather_tag.dataset.key).then((weather) => {
            weather_tag.dataset.weather = weather["weather"][0]["main"];
            weather_tag.innerHTML = weather["weather"][0]["description"]
            document.querySelector("#pic").src = `https://openweathermap.org/img/wn/${weather["weather"][0]["icon"]}@2x.png`
        }).catch(error => {
            error.message;
        });
    }
    catch {

    }

    document.querySelector("#get_fit").addEventListener('click', () => {
        var weather = document.querySelector("#weather").dataset.weather;
        get_fit(weather);
    })
    
});


async function get_weather(location,key){
    location = location.replaceAll(" ", "+")
    console.log(location)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`);
    if (!response.ok) {
        const message = `An error has occured: ${response.message}`;
        throw new Error(message);
    }
    const weather = await response.json();
    return weather
}

async function change_location(location){
    const csrftoken = getCookie('csrftoken');
    const response = await fetch('/change_location', {
        method: "POST",
        headers: {
            'X-CSRFToken': csrftoken
        },
        body : JSON.stringify({
            location: location
        })
    })
    return true;
}

function edit(box){
    if (box.dataset.display == "false"){
        box.dataset.display = "true";
        box.style.display = "block";
        document.querySelector("#change").innerHTML = "Cancel"
    }
    else {
        document.querySelector("#change").innerHTML = "Change location"
        box.dataset.display = "false";
        box.style.display = "none";
    }
}

async function get_fit(weather){
    const csrftoken = getCookie('csrftoken');
    const response = await fetch("/get_fit",{
        method: "POST",
        headers: {
            'X-CSRFToken': csrftoken
        },
        body : JSON.stringify({
            weather: weather
        })
    })
    if (!response.ok) {
        const message = `An error has occured: ${response.message}`;
        throw new Error(message);
    }
    const fit = await response.json();
    
    if (!fit["error"]){
        const div = document.createElement("div");
        div.className = "fade-in-left fit";

        div.innerHTML =`
            <div class="d-flex flex-column justify-content-center align-items-center h-75" >
                <img id="head" src="${fit["head_img"]}">
                <img id="upper" src="${fit["upper_img"]}">
                <img id="lower" src="${fit["lower_img"]}" >
                <img id="feet" src="${fit["feet_img"]}">
            </div>
        `;
        
        const fits = document.querySelector("#fit_view");
        if (fits.childElementCount > 0){
            fits.lastElementChild.className = "fade-out-right fit";
            await sleep(300);
            fits.removeChild(fits.lastElementChild);
        }
        else if (fits.innerHTML != ""){
            fits.innerHTML = "";
        }
        fits.append(div);
    }
    else{
        document.querySelector("#fit_view").innerHTML = `${fit["error"]}`
    }
} 

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}