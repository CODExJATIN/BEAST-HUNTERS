import {collection, getDocs, query, orderBy } from "firebase/firestore";
import {db} from '../auth'

// Function to fetch leaderboard data
async function getLeaderboardData() {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("monsterKills", "desc")); // Sort by monsterKills, you can change this to any other stat

  try {
    const querySnapshot = await getDocs(q);
    const leaderboardData = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      leaderboardData.push({
        id: doc.id,
        name: userData.name,
        monsterKills: userData.monsterKills,
        dragonKills: userData.dragonKills,
        deaths: userData.deaths,
        playerLevel: userData.playerLevel,
      });
    });

    // Populate leaderboard
    populateLeaderboard(leaderboardData);
  } catch (error) {
    console.error("Error getting leaderboard data: ", error);
  }
}

// Function to populate leaderboard
function populateLeaderboard(data) {
  const leaderboardBody = document.getElementById("leaderboardBody");
  leaderboardBody.innerHTML = ""; // Clear any existing content

  data.forEach((user, index) => {
    const row = document.createElement("tr");

    // Add the rank, name, and stats to the table row
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.monsterKills}</td>
      <td>${user.dragonKills}</td>
      <td>${user.deaths}</td>
      <td>${user.playerLevel}</td>
    `;

    // Append the row to the table body
    leaderboardBody.appendChild(row);
  });
}

// Call the function to fetch and display leaderboard data
getLeaderboardData();
