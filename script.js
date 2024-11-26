document.addEventListener("DOMContentLoaded", () => {
  // Define the holes for each column
  const holes1_6 = [1, 4, 7, 10, 13, 16];
  const holes7_12 = [2, 5, 8, 11, 14, 17];
  const holes13_18 = [3, 6, 9, 12, 15, 18];

  // Generate hole inputs dynamically
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
        <p id="error-${i}" class="error-message"></p>
      `;
      container.appendChild(div);
    });
  }

  // Populate columns with hole inputs
  createHoleInputs(holes1_6, "holes-1-6");
  createHoleInputs(holes7_12, "holes-7-12");
  createHoleInputs(holes13_18, "holes-13-18");

  // Function to calculate stableford points after input
  function calculateStablefordPoints(i) {
    const handicap = parseInt(document.getElementById("handicap").value, 10);
    if (isNaN(handicap)) {
      return; // Prevent calculations if handicap is not valid
    }

    const par = parseInt(document.getElementById(`par-${i}`).value, 10);
    const strokeIndex = parseInt(document.getElementById(`strokeIndex-${i}`).value, 10);
    const grossScore = parseInt(document.getElementById(`gross-${i}`).value, 10);

    // If gross score is not valid, clear the error and don't calculate
    if (isNaN(grossScore)) {
      document.getElementById(`error-${i}`).textContent = "Please enter a valid gross score.";
      document.getElementById(`points-${i}`).textContent = "Stableford Points: 0";
      return;
    }

    // Clear any error message when the input is valid
    document.getElementById(`error-${i}`).textContent = "";

    // Calculate strokes received based on handicap and stroke index
    const strokesReceived =
      Math.floor(handicap / 18) + (handicap % 18 >= strokeIndex ? 1 : 0);

    // Calculate net score
    const netScore = grossScore - strokesReceived;

    // Determine Stableford points
    let stablefordPoints = 0;
    const netDifference = par - netScore;

    if (netDifference >= 3) {
      stablefordPoints = 5; // Albatross or better
    } else if (netDifference === 2) {
      stablefordPoints = 4; // Eagle
    } else if (netDifference === 1) {
      stablefordPoints = 3; // Birdie
    } else if (netDifference === 0) {
      stablefordPoints = 2; // Par
    } else if (netDifference === -1) {
      stablefordPoints = 1; // Bogey
    } else {
      stablefordPoints = 0; // Worse than Bogey
    }

    // Display Stableford points and update total
    document.getElementById(`points-${i}`).textContent = `Stableford Points: ${stablefordPoints}`;

    // Update total stableford points after each input
    updateTotalPoints();
  }

  // Function to update the total points
  function updateTotalPoints() {
    let totalStablefordPoints = 0;
    for (let i = 1; i <= 18; i++) {
      const pointsText = document.getElementById(`points-${i}`).textContent;
      const pointsMatch = pointsText.match(/Stableford Points: (\d+)/);
      if (pointsMatch) {
        totalStablefordPoints += parseInt(pointsMatch[1], 10);
      }
    }

    // Display total points
    const totalPointsDisplay = document.getElementById("total-points");
    if (totalPointsDisplay) {
      totalPointsDisplay.textContent = `Total Stableford Points: ${totalStablefordPoints}`;
    } else {
      const totalPointsDiv = document.createElement("div");
      totalPointsDiv.id = "total-points";
      totalPointsDiv.textContent = `Total Stableford Points: ${totalStablefordPoints}`;
      document.body.appendChild(totalPointsDiv);
    }
  }

  // Add event listeners to gross score inputs to trigger stableford points calculation
  for (let i = 1; i <= 18; i++) {
    const grossInput = document.getElementById(`gross-${i}`);
    if (grossInput) {
      grossInput.addEventListener("input", () => calculateStablefordPoints(i));
    }
  }
});
