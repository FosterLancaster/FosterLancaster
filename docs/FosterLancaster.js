// NameSayer

document.addEventListener("DOMContentLoaded", () => {

  const FLNameAudio  = document.getElementById("FLNameAudio");
  const FLName = document.getElementById("FLName");

let flickerTimeout = null;

FLName.addEventListener("click", () => {

  // --- Audio restart (mobile-safe) ---
  try { FLNameAudio.pause(); } catch {}
  try { FLNameAudio.currentTime = 0; } catch {}
  try { FLNameAudio.load(); } catch {}

  const p = FLNameAudio.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
});

});


function ScreenResize() {
  const navigationElement = document.getElementById('Navigation');
  const menuIcon = document.querySelector('.LancasterMenu');
  const currentOrientation = window.matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait';

  if (currentOrientation === 'portrait') {
    navigationElement.style.width = '0vw';
    if (menuIcon) menuIcon.classList.remove('active');
  }
  // Optional: Adjust menu for wide screens in landscape
  if (currentOrientation === 'landscape') {
    navigationElement.style.width = '34vw';
    if (menuIcon) menuIcon.classList.add('active');
  }
}

function MenuToggle() {
  const navigationElement = document.getElementById('Navigation');
  const menuIcon = document.querySelector('.LancasterMenu');
  const isOpen = navigationElement.style.width !== '0px' && navigationElement.style.width !== '';

  if (isOpen) {
    navigationElement.style.width = '0px';
    menuIcon.classList.remove('active');
  } else {
    navigationElement.style.width = '100vw';
    menuIcon.classList.add('active');
  }
}


document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0;

  const images = document.querySelectorAll(".carousel img");
  const totalImages = images.length;
  const carousel = document.querySelector(".carousel");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  // Show next image
  nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalImages;
      updateCarousel();
  });

  // Show previous image
  prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      updateCarousel();
  });

  function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
});

