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


// Draw directly from the main Firebase total
const totalRef = ref(database, "totalPlays");


onValue(
  totalRef,

  snapshot => {

    const total = Number(snapshot.val()) || 0;

    document
      .querySelectorAll(".totalPlayCount")
      .forEach(el => {

        el.textContent = formatPlays(total);

        el.title = total.toLocaleString();

      });

  },

  error => {
    console.error(
      "Could not load total plays:",
      error
    );
  }
);
