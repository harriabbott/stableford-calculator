document.addEventListener("DOMContentLoaded", () => {
  const leaderboardList = document.getElementById("leaderboard-list");
  const stickyTotalPoints = document.getElementById("sticky-total-points");

  const holes1_6 = [1, 4, 7, 10, 13, 16];
  const holes7_12 = [2, 5, 8, 11, 14, 17];
  const holes13_18 = [3, 6, 9, 12, 15, 18];

  function createHoleInputs(holeNumbers, containerId) {
    const container = document.getElementById(containerId);
    holeNumbers.forEach(i => {
      const div = document.createElement("div");
      div.classList.add("hole");
      div.innerHTML = `
        <h3>Hole ${i}</h3>
        <label for="par-${i}">Par:</label>
        <input type="number" id="par-${i}" value="4" required>
        <label for="strokeIndex-${i}">Stroke Index:</label>
        <input type="number" id="strokeIndex-${i}" value="${i}" required>
        <label for="gross-${i}">Gross Score:</label>
        <input type="number" id="gross-${i}" required>
        <p id="points-${i}" class="hole-points">Stableford Points: 0</p>
      `;
      container.appendChild(div);
    });
  }

  createHoleInputs(holes1_6, "holes-1-6");
  createHoleInputs(holes7_12, "holes-7-12");
  createHoleInputs(holes13_18, "holes-13-18");

  function calculateStablefordPoints(i) {
    const handicap = parseInt(document.getElementById("handicap").value, 10);

    if (isNaN(handicap) || handicap === 0) {
      alert("Please enter a valid handicap before entering the gross score.");
      document.getElementById(`gross-${i}`).value = "";
      return;
    }

    const par = parseInt(document.getElementById(`par-${i}`).value, 10);
    const strokeIndex = parseInt(document.getElementById(`strokeIndex-${i}`).value, 10);
    const grossScore = parseInt(document.getElementById(`gross-${i}`).value, 10);

    if (isNaN(grossScore)) {
      document.getElementById(`points-${i}`).textContent = "Stableford Points: 0";
      return;
    }

    const strokesReceived =
      Math.floor(handicap / 18) + (handicap % 18 >= strokeIndex ? 1 : 0);

    const netScore = grossScore - strokesReceived;

    let stablefordPoints = 0;
    const netDifference = par - netScore;

    if (netDifference >= 3) stablefordPoints = 5;
    else if (netDifference === 2) stablefordPoints = 4;
    else if (netDifference === 1) stablefordPoints = 3;
    else if (netDifference === 0) stablefordPoints = 2;
    else if (netDifference === -1) stablefordPoints = 1;

    document.getElementById(`points-${i}`).textContent = `Stableford Points: ${stablefordPoints}`;
    updateTotalPoints();
  }

  function updateTotalPoints() {
    let totalStablefordPoints = 0;
    for (let i = 1; i <= 18; i++) {
      const pointsText = document.getElementById(`points-${i}`).textContent;
      const pointsMatch = pointsText.match(/Stableford Points: (\d+)/);
      if (pointsMatch) {
        totalStablefordPoints += parseInt(pointsMatch[1], 10);
      }
    }

    stickyTotalPoints.textContent = `Total Stableford Points: ${totalStablefordPoints}`;
  }

  for (let i = 1; i <= 18; i++) {
    const grossInput = document.getElementById(`gross-${i}`);
    if (grossInput) {
      grossInput.addEventListener("input", () => calculateStablefordPoints(i));
    }
  }

  document.getElementById("submit-scores").addEventListener("click", () => {
    const handicap = parseInt(document.getElementById("handicap").value, 10);

    if (isNaN(handicap) || handicap === 0) {
      alert("Please enter a valid handicap before submitting scores.");
      return;
    }

    const playerName = prompt("Enter your name:");
    if (!playerName) return;

    let totalStablefordPoints = 0;
    for (let i = 1; i <= 18; i++) {
      const pointsText = document.getElementById(`points-${i}`).textContent;
      const pointsMatch = pointsText.match(/Stableford Points: (\d+)/);
      if (pointsMatch) {
        totalStablefordPoints += parseInt(pointsMatch[1], 10);
      }
    }

    const listItem = document.createElement("li");
    listItem.textContent = `${playerName}: ${totalStablefordPoints} points`;
    leaderboardList.appendChild(listItem);

    for (let i = 1; i <= 18; i++) {
      document.getElementById(`gross-${i}`).value = "";
      document.getElementById(`points-${i}`).textContent = "Stableford Points: 0";
    }

    stickyTotalPoints.textContent = "Total Stableford Points: 0";
  });
});
