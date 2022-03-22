const slider = document.querySelector(".subHero");
let holding = false;
let firstClickX;
let alreadyLeftScrolled;

slider.addEventListener("mousedown",e=>{
    holding = true;
    firstClickX = e.pageX - slider.offsetLeft; // dans ce cas precis : slider.offsetLeft=0
    alreadyLeftScrolled = slider.scrollLeft;
})


slider.addEventListener("mouseup",e=>{
    holding=false;
})
slider.addEventListener("mouseleave",e=>{
    holding=false;
})

slider.addEventListener("mousemove",e=>{
    if(!holding) return;
    
    const x = e.pageX - slider.offsetLeft;
    const scrolled = (x - firstClickX);
    slider.scrollLeft = alreadyLeftScrolled - scrolled;
})