const overlaybox = document.querySelector('.overlay')
// const overlay = document.querySelector('.overlay-link')
const ham = document.querySelector('.ham')


// overlay.addEventListener('click', toggleOpen);
overlaybox.addEventListener('click', toggleOpen);
ham.addEventListener('click', toggleOpen);

function toggleOpen() {
    overlaybox.classList.toggle('open')
}