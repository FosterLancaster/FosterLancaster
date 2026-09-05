import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDwdEA58IKndfdO1SvfD4pGerAbW3bRgWw",
  authDomain: "fostmp3s-3fc35.firebaseapp.com",
  databaseURL: "https://fostmp3s-3fc35-default-rtdb.firebaseio.com",
  projectId: "fostmp3s-3fc35",
  storageBucket: "fostmp3s-3fc35.firebasestorage.app",
  messagingSenderId: "792229622105",
  appId: "1:792229622105:web:a644d281c868293b131c48"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// Same growth rate as FOSTMp3s
const PLAYS_PER_6H = 1000;

const RATE_PER_MS =
  PLAYS_PER_6H / (6 * 60 * 60 * 1000);


// Same boost calculation as the player
function getDailyBoost(songId) {

  const now = new Date();

  // Changes every 6 hours
  const block = Math.floor(now.getHours() / 6);

  let hash = 0;

  const key =
    songId +
    now.toISOString().split("T")[0] +
    block;

  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i);
  }

  return hash % 2 === 0 ? 555 : 0;
}


// Number formatting
function formatPlays(num) {

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B";
  }

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }

  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }

  return num.toLocaleString();
}


// Stores ALL songs currently in Firebase
let songData = {};

let highestTotalDisplayed = 0;


// Calculate and display total
function updateTotalPlays() {

  let total = 0;

  Object.entries(songData).forEach(
    ([songId, data]) => {

      if (!data) return;


      const basePlays =
        Number(data.plays) || 0;


      const lastUpdated =
        Number(data.lastUpdated) || Date.now();


      const elapsed =
        Date.now() - lastUpdated;


      const estimatedGrowth =
        Math.floor(
          Math.max(0, elapsed) * RATE_PER_MS
        );


      const dailyBoost =
        getDailyBoost(songId);


      const displayPlays =
        basePlays +
        estimatedGrowth +
        dailyBoost;


      total += displayPlays;

    }
  );


  // Don't let displayed total decrease
  total = Math.max(
    total,
    highestTotalDisplayed
  );


  highestTotalDisplayed = total;


  document
    .querySelectorAll(".totalPlayCount")
    .forEach(el => {

      el.textContent =
        formatPlays(total);

      el.title =
        total.toLocaleString();

    });

}


// Listen to the entire songs database
const songsRef =
  ref(database, "songs");


onValue(
  songsRef,

  snapshot => {

    // Automatically collects every current song
    songData =
      snapshot.val() || {};

    updateTotalPlays();

  },

  error => {

    console.error(
      "Could not load songs:",
      error
    );

  }
);


// Update estimated growth every second
setInterval(
  updateTotalPlays,
  1000
);
