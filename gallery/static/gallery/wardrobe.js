document.addEventListener('DOMContentLoaded', () => {
    if ( window.history.replaceState ) {
        window.history.replaceState( null, null, window.location.href );
    }
    
    const box = document.querySelector("#add_box");

    add(box);
    
    document.querySelector("#add").addEventListener('click', ()=>{
        add(box);
    });

    document.querySelectorAll(".wardrobe").forEach(wardrobe =>{
        wardrobe.querySelector("#delete").addEventListener('click', ()=>{
            delete_wardrobe(wardrobe.dataset.ward_id)
        });
        const edit_box = wardrobe.querySelector("#edit_box");
        const wardrobe_box = wardrobe.querySelector("#wardrobe_box");
        edit(edit_box);
        edit(wardrobe_box);
        edit_box.querySelector("#name").value = wardrobe_box.querySelector("#name").innerHTML;
        wardrobe.querySelector("#edit").addEventListener("click", () => {
            edit(edit_box)
            edit(wardrobe_box);
        });
        edit_box.querySelector("#save").addEventListener("click", () => {
            edit_fit(wardrobe, edit_box);
            edit(edit_box);
            edit(wardrobe_box);
        });
    })
});

function add(box){
    if (box.dataset.display == "false"){
        box.dataset.display = "true";
        box.style.display = "block";
        document.querySelector("#add").innerHTML = "Cancel"
    }
    else {
        document.querySelector("#add").innerHTML = "Add a wardrobe"
        box.dataset.display = "false";
        box.style.display = "none";
    }
}

function edit(box){
    if (box.dataset.display == "false"){
        box.dataset.display = "true";
        box.style.display = "block";
    }
    else {
        box.dataset.display = "false";
        box.style.display = "none";
    }
}

async function delete_wardrobe(wardrobe_id){
    const csrftoken = getCookie('csrftoken');
    const response = await fetch("/delete_wardrobe",{
        method: "PUT",
        headers: {
            'X-CSRFToken': csrftoken
        },
        body : JSON.stringify({
            id: wardrobe_id
        })
    })
    if (!response.ok) {
        const message = `An error has occured: ${response.message}`;
        throw new Error(message);
    }
    document.querySelector(`#id_${wardrobe_id}`).remove()
    return true;
}

async function edit_fit(wardrobe, edit_box){
    const csrftoken = getCookie('csrftoken');
    const name = edit_box.querySelector("#name").value;
    const source = edit_box.querySelector("#weather");
    const weather = source.options[source.selectedIndex].value;
    const response = await fetch("/edit_wardrobe",{
        method: "PUT",
        headers: {
            'X-CSRFToken': csrftoken
        },
        body : JSON.stringify({
            id: wardrobe.dataset.ward_id,
            name: name,
            weather: weather,
        })
    })
    if (!response.ok) {
        const message = `An error has occured: ${response.message}`;
        throw new Error(message);
    }
    const wardrobe_box = wardrobe.querySelector(`#wardrobe_box`)
    wardrobe_box.querySelector("#name").innerHTML = name;
    wardrobe_box.querySelector("#weather").src = `../../static/assets/${weather}.svg`;
    wardrobe_box.querySelector("#weather").dataset.weather = weather;
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