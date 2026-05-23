// NameSayer

document.addEventListener("DOMContentLoaded", () => {

  const FLNameAudio = document.getElementById("FLNameAudio");
  const FLName = document.getElementById("FLName");
  const FLNameSay = document.querySelector(".FLNameSay");

  let flickerTimeout = null;

  if (FLName && FLNameAudio) {

    FLName.addEventListener("click", () => {

      // --- Audio restart (mobile-safe) ---
      try {
        FLNameAudio.pause();
      } catch (e) {}

      try {
        FLNameAudio.currentTime = 0;
      } catch (e) {}

      try {
        FLNameAudio.load();
      } catch (e) {}

      // Resize while audio plays
      if (FLNameSay) {
        FLNameSay.style.transform = "scale(1.1)";
      }

      const p = FLNameAudio.play();

      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }

    });

    // Return to normal size when audio ends
    FLNameAudio.addEventListener("ended", () => {

      if (FLNameSay) {
        FLNameSay.style.transform = "scale(1)";
      }

    });

  }

});

  // Videos

  const video = document.getElementById("musicVideo");
  const btn = document.getElementById("playPauseBtn");
  const icon = document.getElementById("playPauseIcon");

  let inactivityTimer;

  if (video && btn && icon) {

    /* Show button */
    function showButton() {
      btn.style.opacity = "1";
    }

    /* Hide button */
    function hideButton() {

      /* Stay visible while paused */
      if (!video.paused) {
        btn.style.opacity = "0";
      }

    }

    /* Reset inactivity timer */
    function resetInactivityTimer() {

      clearTimeout(inactivityTimer);

      showButton();

      inactivityTimer = setTimeout(() => {
        hideButton();
      }, 2000);

    }

    /* Button click */
    btn.addEventListener("click", () => {

      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }

      resetInactivityTimer();

    });

    /* Sync icon whenever video plays */
    video.addEventListener("play", () => {

      icon.src = "images/FostTVPause.png";

      resetInactivityTimer();

    });

    /* Sync icon whenever video pauses */
    video.addEventListener("pause", () => {

      icon.src = "images/FostTVPlay.png";

      showButton(); // Stay opaque while paused

    });

    /* Reset icon when video ends */
    video.addEventListener("ended", () => {

      icon.src = "images/FostTVPlay.png";

      showButton();

    });

    /* Detect activity */
    video.addEventListener("mousemove", resetInactivityTimer);
    video.addEventListener("touchstart", resetInactivityTimer);

  }

// Foster Chat From Tumblr

fetch("https://fostchat-rss.fostmp3s.workers.dev/")
  .then(response => response.text())
  .then(str => {

    const parser = new DOMParser();
    const xml = parser.parseFromString(str, "application/xml");
    const items = xml.querySelectorAll("item");
    const feedList = document.getElementById("feed");

    items.forEach(item => {

      const title =
        item.querySelector("title")?.textContent?.trim() || "";

      const link =
        item.querySelector("link")?.textContent?.trim() || "#";

      // content:encoded support
      const contentEncoded =
        item.getElementsByTagName("content:encoded")[0]?.textContent || "";

      // Raw description
      const rawDescription =
        item.querySelector("description")?.textContent || "";

      // Convert HTML to text
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = rawDescription;

      let cleanDescription =
        tempDiv.textContent || tempDiv.innerText || "";

      cleanDescription = cleanDescription
        .replace(/\s+/g, " ")
        .replace(/^undefined$/i, "")
        .trim();

      // FINAL protection against undefined/null
      if (
        !cleanDescription ||
        cleanDescription === "undefined" ||
        cleanDescription === "null"
      ) {
        cleanDescription = "";
      }

      // Try multiple image sources
      const image =
        item.querySelector("enclosure")?.getAttribute("url") ||
        item.querySelector("media\\:content")?.getAttribute("url") ||
        contentEncoded.match(/<img.*?src="(.*?)"/)?.[1] ||
        rawDescription.match(/<img.*?src="(.*?)"/)?.[1] ||
        "";

      const li = document.createElement("li");

      li.innerHTML = `
        <a href="${link}" target="_blank">

          ${
            image
              ? `<img src="${image}" style="max-width:100%; display:block;">`
              : ""
          }

          <div class="feedTitle">${title}</div>

          ${
            cleanDescription
              ? `<div class="feedDescription">${cleanDescription}</div>`
              : ""
          }

        </a>
      `;

      if (feedList) {
        feedList.appendChild(li);
      }

    });

  })
  .catch(err => console.error("Error loading RSS feed:", err));
  
