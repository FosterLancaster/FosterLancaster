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


// Songs
const songs = [
  "fmp3smusic/GoodForYou.mp3",
  "fmp3smusic/MoreThanJustAFan.mp3",
  "fmp3smusic/TheGoodLink/TGL1.mp3",
  "fmp3smusic/TheGoodLink/TGL2.mp3",
  "fmp3smusic/TheGoodLink/TGL3.mp3",
  "fmp3smusic/TheGoodLink/TGL4.mp3",
  "fmp3smusic/TheGoodLink/TGL5.mp3",
  "fmp3smusic/TheGoodLink/TGL6.mp3",
  "fmp3smusic/TheGoodLink/TGL7.mp3",
  "fmp3smusic/TheGoodLink/TGL8.mp3"
];


function getSongId(songPath) {
  return songPath.replace(/[^a-zA-Z0-9]/g, "_");
}


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


// Store Firebase data for every song
const songData = {};

let highestTotalDisplayed = 0;


// Calculate and display total
function updateTotalPlays() {

  let total = 0;

  songs.forEach(songPath => {

    const songId = getSongId(songPath);

    const data = songData[songId];

    if (!data) return;


    const basePlays =
      Number(data.plays) || 0;

    const lastUpdated =
      Number(data.lastUpdated) || Date.now();


    const elapsed =
      Date.now() - lastUpdated;


    const estimatedGrowth = Math.floor(
      Math.max(0, elapsed) * RATE_PER_MS
    );


    const dailyBoost =
      getDailyBoost(songId);


    const displayPlays =
      basePlays +
      estimatedGrowth +
      dailyBoost;


    total += displayPlays;

  });


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


// Load each song individually
songs.forEach(songPath => {

  const songId =
    getSongId(songPath);

  const songRef =
    ref(database, `songs/${songId}`);


  onValue(
    songRef,

    snapshot => {

      songData[songId] =
        snapshot.val() || {};

      updateTotalPlays();

    },

    error => {

      console.error(
        "Could not load plays:",
        songId,
        error
      );

    }
  );

});


// Update estimated growth every second
setInterval(
  updateTotalPlays,
  1000
);