const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{

    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }

  });
});

const hiddenElements =
document.querySelectorAll(".fade-up");

hiddenElements.forEach((el)=>
observer.observe(el)
);

/* NAV ACTIVE TABS */

const tabs =
document.querySelectorAll(".tab");

tabs.forEach(tab => {

  tab.addEventListener("click", ()=>{

    tabs.forEach(t =>
      t.classList.remove("active")
    );

    tab.classList.add("active");

  });

});








function showMessage(event){

event.preventDefault();

const form = event.target;

fetch("/", {
method: "POST",
headers: {
"Content-Type":
"application/x-www-form-urlencoded"
},
body: new URLSearchParams(
new FormData(form)
).toString()
})
.then(() => {

document.getElementById(
"success-message"
).style.display = "block";

form.reset();

})
.catch((error) =>
alert("Submission failed.")
);

}

/* GOOGLE SHEETS EVENTS */

async function loadEvents(){

    const response = await fetch(
        "YOUR_CSV_URL"
    );

    const data = await response.text();

    const rows = data.split("\n").slice(1);

    const container =
    document.getElementById("events-container");

    container.innerHTML = "";

    rows.forEach(row => {

        const columns = row.split(",");

        const title = columns[0];
        const description = columns[1];

        if(title){

            container.innerHTML += `
            
            <div class="event-card">

                <h3>${title}</h3>

                <p>${description}</p>

            </div>

            `;
        }

    });

}

loadEvents();
