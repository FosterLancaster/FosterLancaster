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

const textDiv =
  document.createElement("div");

textDiv.innerHTML =
  rawContent;

// Remove media because it is displayed separately
textDiv.querySelectorAll(
  "img, iframe, video, script, style, blockquote.tiktok-embed"
).forEach(el => el.remove());

let cleanDescription =
  textDiv.innerHTML || "";

cleanDescription =
  cleanDescription
    .replace(/\s+/g, " ")
    .replace(/^undefined$/i, "")
    .trim();

// Remove YouTube URLs
cleanDescription =
  cleanDescription.replace(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}[^\s]*/gi,
    ""
  );

// Remove TikTok URLs
cleanDescription =
  cleanDescription.replace(
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^\s\/]+\/video\/\d+[^\s]*/gi,
    ""
  );

cleanDescription =
  cleanDescription.trim();

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
// DESCRIPTION
// --------------------------------

if (cleanDescription) {

  const description =
    document.createElement("div");

  description.className =
    "feedDescription";

  // Keep HTML already supplied by the feed
  description.innerHTML = cleanDescription;

  // Find plain text that is not already inside a link
  const walker = document.createTreeWalker(
    description,
    NodeFilter.SHOW_TEXT
  );

  const textNodes = [];

  while (walker.nextNode()) {

    const node = walker.currentNode;

    if (!node.parentElement.closest("a")) {
      textNodes.push(node);
    }
  }

  // Turn plain URLs into clickable links
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

  // Make both original and generated links clickable
  description.querySelectorAll("a").forEach(link => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.pointerEvents = "auto";
    link.style.cursor = "pointer";
  });

  li.appendChild(description);
}