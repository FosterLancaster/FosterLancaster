window.addEventListener('resize', ScreenResize);
window.addEventListener('orientationchange', ScreenResize);
window.addEventListener('load', ScreenResize);

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


function MenuToggle() {
  const navigationElement = document.getElementById('Navigation');
  const menuIcon = document.querySelector('.LancasterMenu');
  const isLandscape = window.matchMedia('(orientation: landscape)').matches;

  // 🚫 Do nothing in landscape — CSS controls it
  if (isLandscape) return;

  const isOpen =
    navigationElement.style.width !== '0px' &&
    navigationElement.style.width !== '' &&
    navigationElement.style.width !== '0vw';

  if (isOpen) {
    navigationElement.style.width = '0vw';
    menuIcon.classList.remove('active');
  } else {
    navigationElement.style.width = '100vw';
    menuIcon.classList.add('active');
  }
}

function ScreenResize() {
  const navigationElement = document.getElementById('Navigation');
  const menuIcon = document.querySelector('.LancasterMenu');
  const isLandscape = window.matchMedia('(orientation: landscape)').matches;

  if (isLandscape) {
    // 🔥 THIS is the critical fix
    navigationElement.style.removeProperty('width');

    if (menuIcon) menuIcon.classList.add('active');
  } else {
    navigationElement.style.width = '0vw';
    if (menuIcon) menuIcon.classList.remove('active');
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

