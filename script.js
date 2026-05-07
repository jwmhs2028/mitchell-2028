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
