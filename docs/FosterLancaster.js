//Sup Embed

document.addEventListener("DOMContentLoaded", loadSup);

async function loadSup() {

  const feedList = document.getElementById("feed");

  if (!feedList) {
    console.error("Sup feed #feed not found.");
    return;
  }

  try {

    const response = await fetch(
      "https://fostsup.fostmp3s.workers.dev/",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Sup request failed: ${response.status}`);
    }

    const rssText = await response.text();

    const parser = new DOMParser();

    const xml = parser.parseFromString(
      rssText,
      "application/xml"
    );

    if (xml.querySelector("parsererror")) {
      throw new Error("Invalid RSS response");
    }

    const items = xml.querySelectorAll("item");

    feedList.innerHTML = "";

    items.forEach(item => {

      // --------------------------------
      // TITLE
      // --------------------------------

      const title =
        item.querySelector("title")
          ?.textContent
          ?.trim() || "";


      // --------------------------------
      // RSS CONTENT
      // --------------------------------

      const contentEncoded =
        item.getElementsByTagName(
          "content:encoded"
        )[0]?.textContent || "";

      const rawDescription =
        item.querySelector("description")
          ?.textContent || "";

      const rawContent =
        contentEncoded || rawDescription;


      // --------------------------------
      // PARSE POST HTML
      // --------------------------------

      const contentDiv =
        document.createElement("div");

      contentDiv.innerHTML =
        contentEncoded;


      const descriptionDiv =
        document.createElement("div");

      descriptionDiv.innerHTML =
        rawDescription;


      // --------------------------------
      // ACTUAL POST IMAGE
      // --------------------------------

      const contentImage =
        contentDiv.querySelector("img");

      const descriptionImage =
        descriptionDiv.querySelector("img");

      const image =
        contentImage?.getAttribute("src") ||
        descriptionImage?.getAttribute("src") ||
        "";


      // --------------------------------
      // YOUTUBE
      // --------------------------------

      let youtubeID = "";


      // Embedded iframe
      const youtubeIframe =
        contentDiv.querySelector(
          'iframe[src*="youtube.com"], iframe[src*="youtu.be"]'
        ) ||
        descriptionDiv.querySelector(
          'iframe[src*="youtube.com"], iframe[src*="youtu.be"]'
        );


      if (youtubeIframe) {

        const src =
          youtubeIframe.getAttribute("src") || "";

        const match =
          src.match(
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
          );

        if (match) {
          youtubeID = match[1];
        }

      }


      // Normal YouTube link
      if (!youtubeID) {

        const match =
          rawContent.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
          );

        if (match) {
          youtubeID = match[1];
        }

      }


      // --------------------------------
      // TIKTOK
      // --------------------------------

      let tiktokID = "";


      const tiktokMatch =
        rawContent.match(
          /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^\/\s"'<>]+\/video\/(\d+)/i
        );


      if (tiktokMatch) {
        tiktokID = tiktokMatch[1];
      }


      // TikTok blockquote embed
      if (!tiktokID) {

        const tiktokBlockquote =
          contentDiv.querySelector(
            "blockquote.tiktok-embed"
          ) ||
          descriptionDiv.querySelector(
            "blockquote.tiktok-embed"
          );


        if (tiktokBlockquote) {

          tiktokID =
            tiktokBlockquote.getAttribute(
              "data-video-id"
            ) || "";

        }

      }


      // --------------------------------
      // CLEAN DESCRIPTION
      // --------------------------------

// DESCRIPTION
if (cleanDescription) {

  const description =
    document.createElement("div");

  description.className =
    "feedDescription";

  // Preserve the HTML from the RSS
  description.innerHTML = cleanDescription;

  // Find text nodes that are NOT already links
  const walker = document.createTreeWalker(
    description,
    NodeFilter.SHOW_TEXT
  );

  const textNodes = [];

  while (walker.nextNode()) {

    const node = walker.currentNode;

    // Leave existing <a> tags completely alone
    if (!node.parentElement.closest("a")) {
      textNodes.push(node);
    }
  }

  // Turn plain URLs into links
  textNodes.forEach(node => {

    const text = node.nodeValue;

    const urlPattern =
      /(?:https?:\/\/|www\.)[^\s<]+/gi;

    if (!urlPattern.test(text)) return;

    urlPattern.lastIndex = 0;

    const span =
      document.createElement("span");

    span.innerHTML = text.replace(
      urlPattern,
      url => {

        const href =
          url.startsWith("www.")
            ? `https://${url}`
            : url;

        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      }
    );

    node.replaceWith(...span.childNodes);
  });

  // Configure existing AND newly-created anchors
  description.querySelectorAll("a").forEach(link => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.pointerEvents = "auto";
    link.style.cursor = "pointer";
  });

  li.appendChild(description);
}

      // --------------------------------
      // CREATE POST
      // --------------------------------

      const li =
        document.createElement("li");


      // IMAGE
      if (image) {

        const img =
          document.createElement("img");

        img.src = image;
        img.alt = "";
        img.loading = "lazy";

        img.style.width = "100%";
        img.style.height = "auto";
        img.style.display = "block";

        li.appendChild(img);

      }


      // YOUTUBE
      if (youtubeID) {

        const youtube =
          document.createElement("div");

        youtube.className =
          "youtubeEmbed";

        youtube.innerHTML = `
          <iframe
            src="https://www.youtube.com/embed/${youtubeID}?rel=0"
            title="YouTube video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        `;

        li.appendChild(youtube);

      }


      // TIKTOK
      if (tiktokID) {

        const tiktok =
          document.createElement("div");

        tiktok.className =
          "tiktokEmbed";

        tiktok.innerHTML = `
          <iframe
            src="https://www.tiktok.com/player/v1/${tiktokID}"
            title="TikTok video"
            allow="fullscreen"
            allowfullscreen>
          </iframe>
        `;

        li.appendChild(tiktok);

      }


      // TITLE
      const titleDiv =
        document.createElement("div");

      titleDiv.className =
        "feedTitle";

      titleDiv.textContent =
        title;

      li.appendChild(titleDiv);


      // --------------------------------
      // BUTTONS
      // --------------------------------

      const love =
        document.createElement("div");

      love.className = "love";

      love.innerHTML = `
        <table>
          <tr>

            <td>
              <a
                href="mailto:foster@fostmp3s.com"
                target="_blank">

                <div
                  class="postbutton postreact"
                  title="Send Message">
                </div>

              </a>
            </td>

            <td>
              <a
                href="https://fostmp3s.com/pw"
                target="_blank">

                <div
                  class="postbutton postbuy"
                  title="Buy Password">
                </div>

              </a>
            </td>

          </tr>
        </table>
      `;

      li.appendChild(love);


      // --------------------------------
      // ADD POST
      // --------------------------------

      feedList.appendChild(li);

    });

  }

  catch (err) {

    console.error(
      "Error loading Sup:",
      err
    );

  }

}


// ------------------------------------
// CLICKABLE NORMAL LINKS
// ------------------------------------

function makeLinksClickable(text) {

  const escaped =
    escapeHTML(text);


  const urlPattern =
    /(?:https?:\/\/|www\.)[^\s<]+/gi;


  return escaped.replace(
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
          ? url.slice(
              0,
              -punctuation.length
            )
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

}


// ------------------------------------
// ESCAPE HTML
// ------------------------------------

function escapeHTML(text) {

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}