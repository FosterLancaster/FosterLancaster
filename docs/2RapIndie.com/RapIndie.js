function setColumns(n) {
    const blog = document.getElementById('Blog1');
    if (blog) {
      blog.style.columnCount = n;
    }
  }

const images = [
  "https://dl.dropbox.com/scl/fi/70v2yrohcc1dm4rq9yypn/RapIndieAds1.png?rlkey=ghwyvh5ax2ix04d4pcyibw4iw",
  "https://dl.dropbox.com/scl/fi/pvhwt58z5wb70vuov8cqx/RapIndieAds2.png?rlkey=65l6tejzmxm55daizwxndu78g",
  "https://dl.dropbox.com/scl/fi/ph9nzdvsmhgyhtmsmc02j/RapIndieAds3.png?rlkey=otirg3ei7xly6j3vtw5k77db9",
  "https://dl.dropbox.com/scl/fi/qc8pgxk2uyktjdd76u0c4/RapIndieAds4.png?rlkey=fgvp0jkan3q92od86kp43v78a"
];

// Pick a random image
const randomIndex = Math.floor(Math.random() * images.length);

// Apply it to the image tag
document.getElementById("adImage").src = images[randomIndex];

function riMenu() {
  document.getElementById("riMenu").style.width = "100%";
}

function closeriMenu() {
  document.getElementById("riMenu").style.width = "0%";
}
