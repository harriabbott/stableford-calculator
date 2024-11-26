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

    // Check if the handicap is provided, if not, show an alert and reset the gross score input
    if (isNaN(handicap) || handicap === 0) {
      alert("Please enter a valid handicap before entering the gross score.");
      document.getElementById(`gross-${i}`).value = "";  // Clear the gross score input
      return; // Prevent further calculation
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

  // Function to update the total points (floating points display)
  function updateTotalPoints() {
    let totalStablefordPoints = 0;
    for (let i = 1; i <= 18; i++) {
      const pointsText = document.getElementById(`points-${i}`).textContent;
      const pointsMatch = pointsText.match(/Stableford Points: (\d+)/);
      if (pointsMatch) {
        totalStablefordPoints += parseInt(pointsMatch[1], 10);
      }
    }

    // Ensure the floating total points div exists
    let totalPointsDisplay = document.getElementById("total-points");
    
    if (!totalPointsDisplay) {
      // If the element doesn't exist, create it
      totalPointsDisplay = document.createElement("div");
      totalPointsDisplay.id = "total-points";
      totalPointsDisplay.style.position = "fixed";
      totalPointsDisplay.style.top = "20px";
      totalPointsDisplay.style.right = "20px";
      totalPointsDisplay.style.backgroundColor = "#0056b3";
      totalPointsDisplay.style.color = "white";
      totalPointsDisplay.style.padding = "10px 15px";
      totalPointsDisplay.style.fontSize = "16px";
      totalPointsDisplay.style.fontWeight = "bold";
      totalPointsDisplay.style.borderRadius = "5px";
      totalPointsDisplay.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
      document.body.appendChild(totalPointsDisplay);  // Append to body
    }

    // Update the text content of the total points display
    totalPointsDisplay.textContent = `Total Stableford Points: ${totalStablefordPoints}`;
  }

  // Add event listeners to gross score inputs to trigger stableford points calculation
  for (let i = 1; i <= 18; i++) {
    const grossInput = document.getElementById(`gross-${i}`);
    if (grossInput) {
      grossInput.addEventListener("input", () => calculateStablefordPoints(i));
    }
  }

  // Submit Button Functionality
  document.getElementById("submit-scores").addEventListener("click", () => {
    // Get the handicap value to check if it's valid
    const handicap = parseInt(document.getElementById("handicap").value, 10);

    // If no handicap, show an alert and don't proceed
    if (isNaN(handicap) || handicap === 0) {
      alert("Please enter a valid handicap before submitting scores.");
      return;
    }

    // Get player name
    const playerName = prompt("Enter your name:");

    if (!playerName) {
      alert("Name is required to submit scores.");
      return;
    }

    // Get total Stableford points for this player
    let totalPoints = 0;
    for (let i = 1; i <= 18; i++) {
      const pointsText = document.getElementById(`points-${i}`).textContent;
      const pointsMatch = pointsText.match(/Stableford Points: (\d+)/);
      if (pointsMatch) {
        totalPoints += parseInt(pointsMatch[1], 10);
      }
    }

    // Add player to leaderboard
    const leaderboardList = document.getElementById("leaderboard-list");
    const newLeaderboardEntry = document.createElement("li");
    newLeaderboardEntry.textContent = `${playerName}: ${totalPoints} points`;
    leaderboardList.appendChild(newLeaderboardEntry);

    // Sort leaderboard by points (descending order)
    const leaderboardEntries = Array.from(leaderboardList.children);
    leaderboardEntries.sort((a, b) => {
      const aPoints = parseInt(a.textContent.split(":")[1]);
      const bPoints = parseInt(b.textContent.split(":")[1]);
      return bPoints - aPoints; // Sort in descending order
    });

    // Clear leaderboard and append sorted entries
    leaderboardList.innerHTML = "";
    leaderboardEntries.forEach(entry => leaderboardList.appendChild(entry));

    // Clear inputs after submission
    for (let i = 1; i <= 18; i++) {
      document.getElementById(`gross-${i}`).value = ""; // Clear all gross score inputs
      document.getElementById(`points-${i}`).textContent = "Stableford Points: 0"; // Reset points
    }

    // Update total points display to 0 after reset
    updateTotalPoints();
  });
});
