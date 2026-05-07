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

/* =========================
   GOOGLE SHEETS UPDATES
========================= */

async function loadUpdates() {

    const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5RuaHWBn_YylV0jvB7U6SevGSk9ayuiT1VO0M3uZ3rv4RCqcZrm333buUutaXExySMm5yHBT2KRAy/pub?output=csv"
    );

    const data = await response.text();

    const rows = data.trim().split("\n").slice(1);

    const container =
    document.getElementById("events-container");

    container.innerHTML = "";

    rows.forEach((row) => {

        const columns = row.split(",");

        const title =
        columns[0]?.replace(/"/g, "").trim();

        const description =
        columns[1]?.replace(/"/g, "").trim();

        if(title && description){

            container.innerHTML += `

            <div class="event-card fade-up">

                <h3>${title}</h3>

                <p>${description}</p>

            </div>

            `;
        }

    });

}

loadUpdates();
loadEvents();
