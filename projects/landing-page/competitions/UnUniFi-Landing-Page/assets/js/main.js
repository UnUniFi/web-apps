// Mobile Navbar Expanded
document.querySelector('.menu-button').addEventListener('click', function () {
    document.querySelector('.navbar-wrapper').classList.toggle("expanded");
})

// Navbar Scrolled
window.onscroll = function () {
    if (window.pageYOffset) {
        document.querySelector('.navbar').classList.add("scrolled");
    } else {
        document.querySelector('.navbar').classList.remove("scrolled");
    }
}