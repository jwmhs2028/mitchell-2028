/* =========================
   SCROLL ANIMATIONS
========================= */

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.1
});

document.querySelectorAll(".fade-up")
.forEach((el) => observer.observe(el));


/* =========================
   ACTIVE NAV TABS
========================= */

const tabs =
document.querySelectorAll(".tab");

tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        tabs.forEach((t) =>
            t.classList.remove("active")
        );

        tab.classList.add("active");

    });

});


/* =========================
   GOOGLE SHEETS UPDATES
========================= */

async function loadUpdates(){

    const container =
    document.getElementById("events-container");

    try{

        const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5RuaHWBn_YylV0jvB7U6SevGSk9ayuiT1VO0M3uZ3rv4RCqcZrm333buUutaXExySMm5yHBT2KRAy/pub?output=csv"
        );

        const csv =
        await response.text();

        const rows =
        csv.split("\n").slice(1);

        container.innerHTML = "";

        rows.forEach((row) => {

            if(!row.trim()) return;

            const columns = row.split(",");

            const title =
            columns[0]
            ?.replace(/"/g, "")
            .trim();

            const description =
            columns
            .slice(1)
            .join(",")

            .replace(/"/g, "")
            .trim();

            if(title){

                const card = `

                <div class="event-card fade-up">

                    <h3>${title}</h3>

                    <p>${description}</p>

                </div>

                `;

                container.innerHTML += card;

            }

        });

        document.querySelectorAll(".fade-up")
        .forEach((el) => observer.observe(el));

    }

    catch(error){

        console.error(error);

        container.innerHTML = `

        <div class="event-card">

            <h3>Unable To Load Updates</h3>

            <p>
            Please try again later.
            </p>

        </div>

        `;

    }

}

loadUpdates();
