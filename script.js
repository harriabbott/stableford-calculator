document.addEventListener("DOMContentLoaded", () => {
  // Generate hole inputs dynamically
  function createHoleInputs(start, end, containerId) {
    const container = document.getElementById(containerId);
    for (let i = start; i <= end; i++) {
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
      `;
      container.appendChild(div);
    }
  }

  // Populate columns with hole inputs
  createHoleInputs(1, 6, "holes-1-6");
  createHoleInputs(7, 12, "holes-7-12");
  createHoleInputs(13, 18, "holes-13-18");

  // Calculate Stableford points
  document.getElementById("calculate").addEventListener("click", () => {
    const handicap = parseInt(document.getElementById("handicap").value, 10);
    if (isNaN(handicap)) {
      alert("Please enter a valid handicap.");
      return;
    }

    let totalStablefordPoints = 0;
    let holeResults = "";

    for (let i = 1; i <= 18; i++) {
      const par = parseInt(document.getElementById(`par-${i}`).value, 10);
      const strokeIndex = parseInt(document.getElementById(`strokeIndex-${i}`).value, 10);
      const grossScore = parseInt(document.getElementById(`gross-${i}`).value, 10);

      if (isNaN(par) || isNaN(strokeIndex) || isNaN(grossScore)) {
        alert(`Please fill in all fields for Hole ${i}.`);
        return;
      }

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

      // Add to total and store hole result
      totalStablefordPoints += stablefordPoints;
      holeResults += `<p>Hole ${i}: ${stablefordPoints} points (Net: ${netScore}, Par: ${par})</p>`;
    }

    // Display the results
    document.getElementById("results").innerHTML = `
      <h3>Individual Hole Results</h3>
      ${holeResults}
      <h3>Total Stableford Points: ${totalStablefordPoints}</h3>
    `;
  });
});
