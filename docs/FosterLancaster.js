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


//Foster Chat From Wordpress
    
    fetch('https://fostchat-rss.fostmp3s.workers.dev/')
    .then(response => response.text())
    .then(str => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(str, "application/xml");
      const items = xml.querySelectorAll("item");
      const feedList = document.getElementById("feed");
  
      items.forEach(item => {
        const title = item.querySelector("title")?.textContent;
        const link = item.querySelector("link")?.textContent;
  
        // 🔑 NEW: content:encoded support
        const contentEncoded =
          item.getElementsByTagName("content:encoded")[0]?.textContent || "";
  
        // Try multiple image sources
        let image =
          item.querySelector("enclosure")?.getAttribute("url") ||
          item.querySelector("media\\:content")?.getAttribute("url") ||
          contentEncoded.match(/<img.*?src="(.*?)"/)?.[1] ||
          item.querySelector("description")?.textContent.match(/<img.*?src="(.*?)"/)?.[1];
  
        const li = document.createElement("li");
  
        li.innerHTML = `
          <a href="${link}" target="_blank">
            ${image ? `<img src="${image}" style="max-width:100%; display:block;">` : ""}
            ${title}
          </a>
        `;
  
        feedList.appendChild(li);
      });
    })
    .catch(err => console.error("Error loading RSS feed:", err));
