// NameSayer

document.addEventListener("DOMContentLoaded", () => {

  const FLNameAudio = document.getElementById("FLNameAudio");
  const FLName = document.getElementById("FLName");
  const FLNameSay = document.querySelector(".FLHeaderButton");

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

      const p = FLNameAudio.play();

      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }

    });

  }

});

// Foster Chat From RSS
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
                      <div class="love">
                      <table>
                      <td class="postbutton">
                      <a href="mailto:foster@fostmp3s.com" target="_blank">
                      <div class="postreact"></div>
                      </a>
                      </td>
                      <td class="postbutton">
                      <a href="https://fostmp3s.com/pw" target="_blank">
                      <div class="hearteffect2">
                        <span class="heart h1"></span>
                        <span class="heart h2"></span>
                        <span class="heart h3"></span>
                        <span class="heart h4"></span>
                      </div>
                      </a>
                      </td>
                      <td class="postbutton">
                      <a href="https://fostmp3s.com" target="_blank">
                      <div class="postprice">Written by Foster Lancaster<img style="width: 12px; height: 12px; margin: 0px 0px -4px 4px;" src="fmp3simages/Verified.png"></div>
                      </a>
                      </td>
                      </table>
                      </div>
                      `;

    if (feedList) {
      feedList.appendChild(li);
    }

  });

})
.catch(err => console.error("Error loading RSS feed:", err));
  
