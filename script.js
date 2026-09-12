let username = "";
let nomor = "";

let score = 0;
let level = 1;

let speed = 3;

let playerX = 50;

let running = false;

let moveLeft = false;
let moveRight = false;

let knives = [];

let animation;
let spawner;


// ==========================
// MULAI GAME
// ==========================

function mulaiGame() {

  username =
    document.getElementById("username").value.trim();

  nomor =
    document.getElementById("nomor").value.trim();

  if (!username || !nomor) {

    alert("Username dan nomor wajib diisi!");

    return;
  }

  score = 0;
  level = 1;
  speed = 3;
  playerX = 50;

  knives = [];

  document
    .querySelectorAll(".knife")
    .forEach(k => k.remove());

  document.getElementById("score").textContent = 0;
  document.getElementById("level").textContent = 1;

  document.getElementById("menu")
    .classList.add("hidden");

  document.getElementById("gameOver")
    .classList.add("hidden");

  document.getElementById("game")
    .classList.remove("hidden");

  document.getElementById("player")
    .style.left = "50%";

  running = true;

  animation =
    requestAnimationFrame(updateGame);

  spawner =
    setInterval(spawnKnife, 850);
}


// ==========================
// PISAU
// ==========================

function spawnKnife() {

  if (!running) return;

  const knife =
    document.createElement("div");

  knife.className = "knife";

  knife.textContent = "🔪";

  knife.style.left =
    (Math.random() * 90 + 2) + "%";

  document
    .getElementById("arena")
    .appendChild(knife);

  knives.push({
    element: knife,
    y: -60
  });
}


// ==========================
// GAME LOOP
// ==========================

function updateGame() {

  if (!running) return;


  // GERAK PEMAIN

  if (moveLeft)
    playerX -= 1.5;

  if (moveRight)
    playerX += 1.5;

  if (playerX < 5)
    playerX = 5;

  if (playerX > 95)
    playerX = 95;

  document.getElementById("player")
    .style.left = playerX + "%";


  const player =
    document.getElementById("player");

  const playerRect =
    player.getBoundingClientRect();


  // GERAK PISAU

  for (let i = knives.length - 1; i >= 0; i--) {

    const knife = knives[i];

    knife.y += speed;

    knife.element.style.top =
      knife.y + "px";


    const knifeRect =
      knife.element.getBoundingClientRect();


    // TABRAKAN

    if (collision(playerRect, knifeRect)) {

      gameOver();

      return;
    }


    // PISAU BERHASIL DIHINDARI

    if (knife.y > 560) {

      knife.element.remove();

      knives.splice(i, 1);

      score++;

      document.getElementById("score")
        .textContent = score;


      // SEMAKIN LAMA SEMAKIN CEPAT

      if (score % 5 === 0) {

        speed += 0.6;

        level++;

        document.getElementById("level")
          .textContent = level;
      }
    }
  }


  animation =
    requestAnimationFrame(updateGame);
}


// ==========================
// TABRAKAN
// ==========================

function collision(a, b) {

  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}


// ==========================
// GAME OVER
// ==========================

function gameOver() {

  running = false;

  cancelAnimationFrame(animation);

  clearInterval(spawner);

  document.getElementById("game")
    .classList.add("hidden");

  document.getElementById("gameOver")
    .classList.remove("hidden");

  document.getElementById("finalScore")
    .textContent = score;


  // SIMPAN LEADERBOARD

  simpanSkor();
}


// ==========================
// SIMPAN SKOR
// ==========================

function simpanSkor() {

  let leaderboard =
    JSON.parse(
      localStorage.getItem("leaderboard")
    ) || [];leaderboard.push({

    name: username,

    score: score

  });


  // URUTKAN SKOR TERTINGGI

  leaderboard.sort(
    (a, b) => b.score - a.score
  );


  // HANYA SIMPAN 10 TERATAS

  leaderboard =
    leaderboard.slice(0, 10);


  localStorage.setItem(
    "leaderboard",
    JSON.stringify(leaderboard)
  );
}


// ==========================
// TAMPILKAN LEADERBOARD
// ==========================

function loadLeaderboard() {

  const board =
    document.getElementById("leaderboard");

  let leaderboard =
    JSON.parse(
      localStorage.getItem("leaderboard")
    ) || [];


  if (leaderboard.length === 0) {

    board.innerHTML =
      "Belum ada skor.";

    return;
  }


  board.innerHTML = "";


  leaderboard.forEach(
    (player, index) => {

      const row =
        document.createElement("div");

      row.className = "row";

      row.textContent =
        `${index + 1}. ${player.name} — ${player.score}`;

      board.appendChild(row);

    }
  );
}


// ==========================
// MAIN LAGI
// ==========================

function mainLagi() {

  document.getElementById("gameOver")
    .classList.add("hidden");

  mulaiGame();
}


// ==========================
// MENU
// ==========================

function keMenu() {

  running = false;

  cancelAnimationFrame(animation);

  clearInterval(spawner);

  knives.forEach(k =>
    k.element.remove()
  );

  knives = [];

  document.getElementById("game")
    .classList.add("hidden");

  document.getElementById("gameOver")
    .classList.add("hidden");

  document.getElementById("menu")
    .classList.remove("hidden");

  loadLeaderboard();
}


// ==========================
// TOMBOL HP
// ==========================

document.getElementById("left")
.addEventListener("touchstart", () => {
  moveLeft = true;
});

document.getElementById("left")
.addEventListener("touchend", () => {
  moveLeft = false;
});


document.getElementById("right")
.addEventListener("touchstart", () => {
  moveRight = true;
});

document.getElementById("right")
.addEventListener("touchend", () => {
  moveRight = false;
});


// ==========================
// KEYBOARD
// ==========================

document.addEventListener("keydown", e => {

  if (e.key === "ArrowLeft")
    moveLeft = true;

  if (e.k tvey === "ArrowRight")
    moveRight = true;
});


document.addEventListener("keyup", e => {

  if (e.key === "ArrowLeft")
    moveLeft = false;

  if (e.key === "ArrowRight")
    moveRight = false;
});


// ==========================
// JALANKAN LEADERBOARD
// ==========================

loadLeaderboard();
