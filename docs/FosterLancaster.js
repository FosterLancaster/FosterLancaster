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

    // Convert RSS description into plain text
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

    // Escape HTML
    function escapeHTML(text) {

      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    }

    // Convert YouTube URLs into embeds
    function makeYouTubeEmbeds(text) {

      const escapedText = escapeHTML(text);

      const youtubePattern =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/gi;

      return escapedText.replace(
        youtubePattern,
        function(match, videoID) {

return `<div class="youtubeEmbed"><iframe src="https://www.youtube.com/embed/${videoID}?rel=0" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;

        }
      );

    }

 function makeLinksClickable(text) {

  const youtubePattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/gi;

  // Replace YouTube URLs directly
  text = text.replace(
    youtubePattern,
    function(match, videoID) {

return `<div class="youtubeEmbed"><iframe src="https://www.youtube.com/embed/${videoID}?rel=0" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;

    }
  );

  // Escape/process only the remaining text
  const parts =
    text.split(/(<div class="youtubeEmbed">[\s\S]*?<\/div>)/gi);

  return parts.map(function(part) {

    if (
      part.toLowerCase().includes(
        '<div class="youtubeembed">'
      )
    ) {
      return part;
    }

    const escapedText =
      escapeHTML(part);

    const urlPattern =
      /(?:https?:\/\/|www\.)[^\s<]+/gi;

    return escapedText.replace(
      urlPattern,
      function(url) {

        const punctuationMatch =
          url.match(/[.,!?;:)\]]+$/);

        const punctuation =
          punctuationMatch
            ? punctuationMatch[0]
            : "";

        const cleanURL =
          punctuation
            ? url.slice(0, -punctuation.length)
            : url;

        const href =
          cleanURL.startsWith("www.")
            ? `https://${cleanURL}`
            : cleanURL;

        return `
          <a
            href="${href}"
            target="_blank"
            rel="noopener noreferrer"
          >${cleanURL}</a>${punctuation}
        `;

      }
    );

  }).join("");

}

const linkedDescription =
  makeLinksClickable(cleanDescription);

    const linkedTitle =
      makeLinksClickable(title);

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
        cleanDescription.length > 0
          ? `
<div class="feedDescription">${linkedDescription}</div>
          `
          : ""
      }

      <div class="feedTitle">
        ${linkedTitle}
      </div>

      <div class="love">

        <table>

          <td>

            <a
              href="mailto:foster@fostmp3s.com"
              target="_blank"
            >
              <div
                class="postbutton postreact"
                title="Send Message">
              </div>
            </a>

          </td>

          <td>

            <a
              href="https://fostmp3s.com/pw"
              target="_blank"
            >
              <div
                class="postbutton postbuy"
                title="Buy Password">
              </div>
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

.catch(err =>
  console.error("Error loading RSS feed:", err)
);
