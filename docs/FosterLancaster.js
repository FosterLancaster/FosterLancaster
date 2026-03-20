//Google Ads
(function () {
  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=AW-841279565";
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', 'AW-841279565');
})();



// Attach resize event
window.addEventListener('resize', ScreenResize);

/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-3FVY8XXHWS'); */

// NameSayer

document.addEventListener("DOMContentLoaded", () => {

  const nameaudio  = document.getElementById("nameaudio");
  const namesayer = document.getElementById("namesayer");

let flickerTimeout = null;

namesayer.addEventListener("click", () => {

  // --- Audio restart (mobile-safe) ---
  try { nameaudio.pause(); } catch {}
  try { nameaudio.currentTime = 0; } catch {}
  try { nameaudio.load(); } catch {}

  const p = nameaudio.play();
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

