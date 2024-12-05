document.addEventListener('DOMContentLoaded', () => {

    if ( window.history.replaceState ) {
        window.history.replaceState( null, null, window.location.href );
    }

    const box = document.querySelector("#add_box");
    add(box);
    
    document.querySelector("#add").addEventListener('click', ()=>{
        add(box);
    });

    document.querySelectorAll(".fit").forEach(fit =>{
        fit.querySelector("#delete").addEventListener('click', ()=>{
            delete_fit(fit.dataset.fit_id)
        });
        const edit_box = fit.querySelector("#edit_box");
        const fit_box = fit.querySelector("#fit_box");
        edit(edit_box);
        edit(fit_box);
        edit_box.querySelector("#upper").value = fit_box.querySelector("#upper").src;
        edit_box.querySelector("#head").value = fit_box.querySelector("#head").src;
        edit_box.querySelector("#lower").value = fit_box.querySelector("#lower").src;
        edit_box.querySelector("#feet").value = fit_box.querySelector("#feet").src;
        fit.querySelector("#edit").addEventListener("click", () => {
            edit(edit_box)
            edit(fit_box);
        });
        edit_box.querySelector("#save").addEventListener("click", () => {
            edit_fit(fit, edit_box);
            edit(edit_box);
            edit(fit_box);
        });
    })


    const track = document.querySelector("#fits");

    const handleOnDown = e => {
        track.dataset.mouseDownAt = e.clientX;
    }

    const handleOnMove = e => {
        if(track.dataset.mouseDownAt === "0") return;

        const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
        const maxDelta = window.innerWidth / 2;

        const percentage = (mouseDelta/maxDelta) * -100;
        var nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;
        if(nextPercentage > 0){
            nextPercentage = 0;
        }
        if(nextPercentage < -100){
            nextPercentage = -100;
        }

        track.dataset.percentage = nextPercentage;

        track.animate({
            transform: `translate(${nextPercentage}%, 0%)`
          }, { duration: 1200, fill: "forwards" });
    }

    const handleOnUp = e => {
        track.dataset.mouseDownAt = "0";
        track.dataset.prevPercentage = track.dataset.percentage;
    }


    window.onmousedown = e => handleOnDown(e);

    window.ontouchstart = e => handleOnDown(e.touches[0]);

    window.onmouseup = e => handleOnUp(e);

    window.ontouchend = e => handleOnUp(e.touches[0]);

    window.onmousemove = e => handleOnMove(e);

    window.ontouchmove = e => handleOnMove(e.touches[0]);
});


function add(box){
    if (box.dataset.display == "false"){
        box.dataset.display = "true";
        box.style.display = "block";
        document.querySelector("#add").innerHTML = "Cancel"
    }
    else {
        document.querySelector("#add").innerHTML = "Add a fit"
        box.dataset.display = "false";
        box.style.display = "none";
    }
}

function edit(box){
    if (box.dataset.display == "false"){
        box.dataset.display = "true";
        box.className = "d-flex flex-column justify-content-center align-items-center ps-2";
    }
    else {
        box.dataset.display = "false";
        box.className = "d-none";
    }
}


async function delete_fit(fit_id){
    const csrftoken = getCookie('csrftoken');
    const response = await fetch("/delete_fit",{
        method: "PUT",
        headers: {
            'X-CSRFToken': csrftoken
        },
        body : JSON.stringify({
            id:fit_id
        })
    })
    if (!response.ok) {
        const message = `An error has occured: ${response.message}`;
        throw new Error(message);
    }
    document.querySelector(`#id_${fit_id}`).remove()
    return true;
}

async function edit_fit(fit, edit_box){
    const csrftoken = getCookie('csrftoken');
    const upper = edit_box.querySelector("#upper").value;
    const head = edit_box.querySelector("#head").value;
    const lower = edit_box.querySelector("#lower").value;
    const feet = edit_box.querySelector("#feet").value;
    const response = await fetch("/edit_fit",{
        method: "PUT",
        headers: {
            'X-CSRFToken': csrftoken
        },
        body : JSON.stringify({
            id: fit.dataset.fit_id,
            head_img: head,
            upper_img: upper,
            lower_img: lower,
            feet_img: feet
        })
    })
    if (!response.ok) {
        const message = `An error has occured: ${response.message}`;
        throw new Error(message);
    }
    const fit_box = fit.querySelector(`#fit_box`)
    fit_box.querySelector("#head").src = head;
    fit_box.querySelector("#upper").src = upper;
    fit_box.querySelector("#lower").src = lower;
    fit_box.querySelector("#feet").src = feet;
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