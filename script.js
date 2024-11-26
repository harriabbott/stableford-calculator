document.addEventListener("DOMContentLoaded", () => {
  const leaderboard = [];

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

  createHoleInputs([1, 4, 7, 10, 13, 16], "holes-1-6");
  createHoleInputs([2, 5, 8, 11, 14, 17], "holes-7-12");
  createHoleInputs([3, 6, 9, 12, 15, 18], "holes-13-18");

  function calculateStablefordPoints(i) {
    const handicap = parseInt(document.getElementById("handicap").value, 10) || 0;
    const par = parseInt(document.getElementById(`par-${i}`).value, 10);
    const strokeIndex = parseInt(document.getElementById(`strokeIndex-${i}`).value, 10);
    const grossScore = parseInt(document.getElementById(`gross-${i}`).value, 10);

    const strokesReceived = Math.floor(handicap / 18) + (handicap % 18 >= strokeIndex ? 1 : 0);
    const netScore = grossScore - strokesReceived;
    const netDifference = par - netScore;

    let stablefordPoints = 0;
    if (netDifference >= 3) stablefordPoints = 5;
    else if (netDifference === 2) stablefordPoints = 4;
    else if (netDifference === 1) stablefordPoints = 3;
    else if (netDifference === 0) stablefordPoints = 2;
    else if (netDifference === -1) stablefordPoints = 1;

    document.getElementById(`points-${i}`).textContent = `Stableford Points: ${stablefordPoints}`;
    updateTotalPoints();
  }

  function updateTotalPoints() {
    let totalPoints = 0;
    for (let i = 1; i <= 18; i++) {
      const pointsText = document.getElementById(`points-${i}`).textContent;
      const pointsMatch = pointsText.match(/Stableford Points: (\d+)/);
      if (pointsMatch) totalPoints += parseInt(pointsMatch[1], 10);
    }
    document.getElementById("sticky-total-points").textContent = `Total Stableford Points: ${totalPoints}`;
    return totalPoints;
  }

  for (let i = 1; i <= 18; i++) {
    document.getElementById(`gross-${i}`).addEventListener("input", () => calculateStablefordPoints(i));
  }

  document.getElementById("submit-scores").addEventListener("click", () => {
    const name = prompt("Enter Player Name:");
    const totalPoints = updateTotalPoints();
    leaderboard.push({ name, points: totalPoints });

    leaderboard.sort((a, b) => b.points - a.points);
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = leaderboard
      .map(player => `<li>${player.name}: <span>${player.points}</span> points</li>`)
      .join("");

    document.getElementById("handicap").value = "";
    for (let i = 1; i <= 18; i++) {
      document.getElementById(`gross-${i}`).value = "";
      document.getElementById(`points-${i}`).textContent = "Stableford Points: 0";
    }
    document.getElementById("sticky-total-points").textContent = "Total Stableford Points: 0";
  });
});
