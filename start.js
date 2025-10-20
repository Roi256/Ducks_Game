var active;
window.addEventListener("load", function() {
    document.getElementById("button1").addEventListener("click", nextPage);
})

function nextPage() {
    active = document.getElementsByClassName("active");
    sessionStorage.setItem("bg", active[0].firstChild.nextElementSibling.alt)
    sessionStorage.getItem("bg")
    // window.location.href = "game.html";
}