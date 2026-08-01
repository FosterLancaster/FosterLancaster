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

// Foster Sup From RSS
fetch("https://fostsup.fostmp3s.workers.dev/")
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
                
// Convert the RSS description into plain text
const tempDiv = document.createElement("div");
tempDiv.innerHTML = rawDescription;

let cleanDescription =
  tempDiv.textContent || tempDiv.innerText || "";

cleanDescription = cleanDescription
  .replace(/\s+/g, " ")
  .replace(/^undefined$/i, "")
  .trim();

if (
  !cleanDescription ||
  cleanDescription === "undefined" ||
  cleanDescription === "null"
) {
  cleanDescription = "";
}

// Escape HTML before adding clickable URLs
function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Convert only URLs written in the post text into links
function makeLinksClickable(text) {
  const escapedText = escapeHTML(text);

  const urlPattern =
    /(?:https?:\/\/|www\.)[^\s<]+/gi;

  return escapedText.replace(urlPattern, url => {
    // Keep punctuation outside the link
    const punctuationMatch = url.match(/[.,!?;:)\]]+$/);
    const punctuation = punctuationMatch ? punctuationMatch[0] : "";
    const cleanURL = punctuation
      ? url.slice(0, -punctuation.length)
      : url;

    const href = cleanURL.startsWith("www.")
      ? `https://${cleanURL}`
      : cleanURL;

    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${cleanURL}</a>${punctuation}`;
  });
}

const linkedDescription = makeLinksClickable(cleanDescription);
const linkedTitle = makeLinksClickable(title);
                
    // Try multiple image sources
    const image =
      item.querySelector("enclosure")?.getAttribute("url") ||
      item.querySelector("media\\:content")?.getAttribute("url") ||
      contentEncoded.match(/<img.*?src="(.*?)"/)?.[1] ||
      rawDescription.match(/<img.*?src="(.*?)"/)?.[1] ||
      "";
                
    const li = document.createElement("li");
                
    li.innerHTML = `
                
${
    image
    ? `<img src="${image}" style="max-width:100%; display:block; margin:0;">`
         : ""
 }
${
  linkedDescription
    ? `<div class="feedDescription">
         <span class="textHighlight">${linkedDescription}</span>
       </div>`
    : ""
}
                
<div class="feedTitle">
  <span class="textHighlight">${linkedTitle}</span>
</div>

                
<div class="love">
<table>
<td>
<a href="mailto:foster@fostmp3s.com" target="_blank">
<div class="postbutton postreact" title="Send Message"></div>
</a>
</td>
<td>
<a href="https://fostmp3s.com/pw" target="_blank">
<div class="postbutton postbuy" title="Buy Password"></div>
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
  
