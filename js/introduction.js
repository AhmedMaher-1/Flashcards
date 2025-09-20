const getStarted = document.querySelector('.cta');
const image = document.querySelector('.image');
const text = document.querySelector('.text');
const showcase = document.querySelector('.hero');

getStarted.addEventListener('click', () => {
    // Hide button and text

    getStarted.classList.add('hide');
    text.classList.add('hide');

    // show the image
    image.style.display = 'block';

    showcase.classList.add('image-state');
    setTimeout(() => window.location.href = 'index.html', 3000);
});