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

