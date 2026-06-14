  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
  import {
    getDatabase,
    ref,
    update,
    increment,
    onValue
  } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCL3vdL5EUd4zYW7AcWlykym0MFIBe33y4",
    authDomain: "fostmp3s-3fc35.firebaseapp.com",
    databaseURL: "https://fostmp3s-3fc35-default-rtdb.firebaseio.com",
    projectId: "fostmp3s-3fc35",
    storageBucket: "fostmp3s-3fc35.firebasestorage.app",
    messagingSenderId: "792229622105",
    appId: "1:792229622105:web:a644d281c868293b131c48",
    measurementId: "G-RJWTKMEWV3"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const database = getDatabase(app);

  window.database = database;
  window.ref = ref;
  window.update = update;
  window.increment = increment;
  window.onValue = onValue;

  onValue(ref(database, 'songs/song1'), (snapshot) => {
    const data = snapshot.val();
    document.getElementById("playcount").textContent =
      data?.plays || 0;
  });

  function getSongId(songPath) {
    return songPath.replace(/[^a-zA-Z0-9]/g, "_");
  }

  document.querySelectorAll('.song-button').forEach(button => {

    const songId = getSongId(button.dataset.song);

    button.addEventListener('click', () => {
      update(
        ref(database, `songs/${songId}`),
        { plays: increment(1) }
      );
    });

    onValue(ref(database, `songs/${songId}`), snapshot => {
      const plays = snapshot.val()?.plays || 0;
      const el = button.querySelector('.playcount');

      if (el) {
        el.textContent = `(${plays.toLocaleString()} plays)`;
      }
    });

  });

  // -------------------------------
  // AUTO RANDOM PLAY INCREMENTER
  // -------------------------------

  const songs = ["song1", "song2", "song3", "song4", "song5"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(() => {

  songs.forEach(songId => {

    update(
      ref(database, `songs/${songId}`),
      { plays: increment(randomInt(1, 5)) }
    );

  });

}, 6000);