/* Michael & Natalia — vanilla JS
   1) Envelope open  2) Intro sequence  3) Scroll reveals
   4) Countdown to 30 Nov 2026, 18:00  5) Music toggle           */

(function () {
  "use strict";

  var envelope = document.getElementById("envelope");
  var seal = document.getElementById("sealBtn");
  var intro = document.getElementById("intro");
  var site = document.getElementById("site");
  var musicBtn = document.getElementById("musicBtn");

  /* ---------- 1 + 2. Opening sequence ---------- */
  var opened = false;

  function openInvitation() {
    if (opened) return;
    opened = true;

    envelope.classList.add("opening");

    setTimeout(function () {
      envelope.classList.add("gone");
      intro.classList.add("show");
      intro.setAttribute("aria-hidden", "false");
    }, 1100);

    setTimeout(function () {
      intro.classList.remove("show");
      intro.setAttribute("aria-hidden", "true");
      site.classList.add("show");
      document.body.classList.remove("locked");
      musicBtn.classList.add("visible");
      revealVisible();
    }, 4600);
  }

  seal.addEventListener("click", openInvitation);
  envelope.addEventListener("click", openInvitation);

  /* ---------- 3. Scroll reveals ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".rv"));

  function revealVisible() {
    items.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) {
        setTimeout(function () { el.classList.add("in"); }, Math.min(i, 6) * 90);
      }
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    window.addEventListener("scroll", revealVisible, { passive: true });
    revealVisible();
  }

  /* ---------- 4. Countdown ---------- */
  var target = new Date(2026, 10, 30, 18, 0, 0).getTime(); // 30 Nov 2026, 6pm
  var elDays = document.getElementById("cd-days");
  var elHours = document.getElementById("cd-hours");
  var elMins = document.getElementById("cd-mins");
  var elSecs = document.getElementById("cd-secs");

  function pad(n, size) {
    var s = String(n);
    while (s.length < size) s = "0" + s;
    return s;
  }

  function tick() {
    var diff = target - Date.now();
    if (diff < 0) diff = 0;
    var s = Math.floor(diff / 1000);
    elDays.textContent = String(Math.floor(s / 86400));
    elHours.textContent = pad(Math.floor(s / 3600) % 24, 2);
    elMins.textContent = pad(Math.floor(s / 60) % 60, 2);
    elSecs.textContent = pad(s % 60, 2);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- 5. Music toggle ---------- */
  /* Drop an mp3 at audio/song.mp3 to enable sound; the button still
     animates on its own if no file is present. */
  var audio = new Audio("audio/song.mp3");
  audio.loop = true;
  audio.volume = 0.5;

  musicBtn.addEventListener("click", function () {
    var playing = musicBtn.classList.toggle("playing");
    musicBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    if (playing) {
      var p = audio.play();
      if (p && p.catch) p.catch(function () { /* no audio file — visual only */ });
    } else {
      audio.pause();
    }
  });
})()