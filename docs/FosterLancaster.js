// Show Sup

let supLoaded = false;
let supLoading = false;


// ------------------------------------
// LOAD SUP ON PAGE LOAD
// ------------------------------------

window.addEventListener("load", function() {

  if (!supLoaded && !supLoading) {
    loadSup();
  }

});

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


// ------------------------------------
// MAKE LINKS + YOUTUBE CLICKABLE
// ------------------------------------

function makeLinksClickable(text) {

  if (!text) return "";

  // YouTube URLs
  const youtubePattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/gi;


  // Convert YouTube URLs into embeds FIRST
  text = text.replace(
    youtubePattern,
    function(match, videoID) {

      return `
        <div class="youtubeEmbed">

          <iframe
            src="https://www.youtube.com/embed/${videoID}?rel=0"
            title="YouTube video"
            frameborder="0"
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
              web-share
            "
            allowfullscreen>
          </iframe>

        </div>
      `;

    }
  );


  // Separate YouTube embeds from normal text
  const parts = text.split(
    /(<div class="youtubeEmbed">[\s\S]*?<\/div>)/gi
  );


  return parts.map(function(part) {

    // Don't escape the YouTube embed HTML
    if (
      part.toLowerCase().includes(
        '<div class="youtubeembed">'
      )
    ) {

      return part;

    }


    // Escape normal text
    const escapedText = escapeHTML(part);


    // Detect normal URLs
    const urlPattern =
      /(?:https?:\/\/|www\.)[^\s<]+/gi;


    return escapedText.replace(
      urlPattern,
      function(url) {

        // Remove punctuation from end of URL
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

  }).join("");

}


// ------------------------------------
// LOAD SUP
// ------------------------------------

async function loadSup() {

  // Prevent two requests at the same time
  if (supLoading) return;


  supLoading = true;


  const feedList =
    document.getElementById("feed");


  if (!feedList) {

    console.error(
      "Sup feed element #feed was not found."
    );

    supLoading = false;

    return;

  }


  try {

    // --------------------------------
    // FETCH RSS
    // --------------------------------

    const response = await fetch(
      "https://fostsup.fostmp3s.workers.dev/",
      {
        cache: "no-store"
      }
    );


    if (!response.ok) {

      throw new Error(
        `Sup request failed: ${response.status}`
      );

    }


    // --------------------------------
    // GET RSS TEXT
    // --------------------------------

    const str =
      await response.text();


    // --------------------------------
    // PARSE RSS XML
    // --------------------------------

    const parser =
      new DOMParser();


    const xml =
      parser.parseFromString(
        str,
        "application/xml"
      );


    // Make sure XML parsed correctly
    const parserError =
      xml.querySelector("parsererror");


    if (parserError) {

      throw new Error(
        "Invalid Sup RSS response"
      );

    }


    // --------------------------------
    // GET POSTS
    // --------------------------------

    const items =
      xml.querySelectorAll("item");


    if (!items.length) {

      throw new Error(
        "Sup feed contained no posts"
      );

    }


    // Remove old posts before rebuilding
    feedList.innerHTML = "";


    // --------------------------------
    // BUILD EACH POST
    // --------------------------------

    items.forEach(item => {

  const title =
    item.querySelector("title")?.textContent?.trim() || "";

  const contentEncoded =
    item.getElementsByTagName("content:encoded")[0]?.textContent || "";

  const rawDescription =
    item.querySelector("description")?.textContent || "";


  // ------------------------------------
  // USE CONTENT:ENCODED WHEN AVAILABLE
  // ------------------------------------

  const rawContent =
    contentEncoded || rawDescription;


  const tempDiv =
    document.createElement("div");

  tempDiv.innerHTML = rawContent;


  // ------------------------------------
  // FIND IMAGE
  // ------------------------------------

  const enclosure =
    item.querySelector("enclosure");


  const mediaContent =
    item.getElementsByTagName(
      "media:content"
    )[0];


  const htmlImage =
    tempDiv.querySelector("img");


const image =
  htmlImage?.getAttribute("src") ||
  "";


  // ------------------------------------
  // FIND YOUTUBE VIDEO
  // ------------------------------------

// ------------------------------------
// FIND YOUTUBE VIDEO
// ------------------------------------

let youtubeID = "";


// Check iframe first
const youtubeIframe =
  tempDiv.querySelector(
    'iframe[src*="youtube.com"], iframe[src*="youtu.be"]'
  );

if (youtubeIframe) {

  const youtubeSrc =
    youtubeIframe.getAttribute("src") || "";

  const embedMatch =
    youtubeSrc.match(
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    );

  if (embedMatch) {
    youtubeID = embedMatch[1];
  }

}


// Check normal YouTube URL
if (!youtubeID) {

  const youtubeMatch =
    rawContent.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
    );

  if (youtubeMatch) {
    youtubeID = youtubeMatch[1];
  }

}


// ------------------------------------
// FIND TIKTOK VIDEO
// ------------------------------------

let tiktokID = "";


// Look for a normal TikTok video URL
const tiktokMatch =
  rawContent.match(
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^\/\s"'<>]+\/video\/(\d+)/i
  );

if (tiktokMatch) {
  tiktokID = tiktokMatch[1];
}


// Also check TikTok blockquote embeds
if (!tiktokID) {

  const tiktokBlockquote =
    tempDiv.querySelector(
      'blockquote.tiktok-embed'
    );

  if (tiktokBlockquote) {

    const videoID =
      tiktokBlockquote.getAttribute(
        "data-video-id"
      );

    if (videoID) {
      tiktokID = videoID;
    }

  }

}

  // ------------------------------------
  // ALSO LOOK FOR YOUTUBE URL
  // ------------------------------------

  if (!youtubeID) {

    const youtubeMatch =
      rawContent.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
      );


    if (youtubeMatch) {
      youtubeID = youtubeMatch[1];
    }

  }


  // ------------------------------------
  // CLEAN DESCRIPTION
  // ------------------------------------

  // Remove media because we're displaying it separately
  tempDiv
    .querySelectorAll(
      "img, iframe, video, script, style"
    )
    .forEach(el => el.remove());


  let cleanDescription =
    tempDiv.textContent ||
    tempDiv.innerText ||
    "";


  cleanDescription =
    cleanDescription
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


  // ------------------------------------
  // REMOVE YOUTUBE URL FROM TEXT
  // ------------------------------------

  cleanDescription =
    cleanDescription.replace(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}[^\s]*/gi,
      ""
    ).trim();


  // ------------------------------------
  // CLICKABLE LINKS
  // ------------------------------------

  const linkedDescription =
    makeLinksClickable(cleanDescription);


  const linkedTitle =
    makeLinksClickable(title);


  // ------------------------------------
  // CREATE POST
  // ------------------------------------

  const li =
    document.createElement("li");


  li.innerHTML = `

    ${
      image
        ? `
          <img
            src="${image}"
            style="
              width: 100%;
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0;
            "
            alt=""
          >
        `
        : ""
    }


    ${
      youtubeID
        ? `
          <div class="youtubeEmbed">

            <iframe
              src="https://www.youtube.com/embed/${youtubeID}?rel=0"
              title="YouTube video"
              frameborder="0"
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
                web-share
              "
              allowfullscreen>
            </iframe>

          </div>
        `
        : ""
    }


    ${
      cleanDescription.length > 0
        ? `
          <div class="feedDescription">
            ${linkedDescription}
          </div>
        `
        : ""
    }


    <div class="feedTitle">
      ${linkedTitle}
    </div>


    <div class="love">

      <table>
        <tr>

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

        </tr>
      </table>

    </div>

  `;

  feedList.appendChild(li);

});


    // --------------------------------
    // SUCCESS
    // --------------------------------

    supLoaded = true;


  } catch (err) {


    // --------------------------------
    // ERROR
    // --------------------------------

    console.error(
      "Error loading Sup:",
      err
    );


    supLoaded = false;


  } finally {


    // --------------------------------
    // ALLOW ANOTHER ATTEMPT
    // --------------------------------

    supLoading = false;


  }


}