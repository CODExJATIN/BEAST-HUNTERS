import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./auth";

export const addOrUpdateUserStats = async (userId, userDetails) => {
    const userRef = doc(db, "users", userId); // Reference to the user's document

    try {
        const userDoc = await getDoc(userRef); // Check if the document exists

        if (userDoc.exists()) {
            // If the document exists, update it
            await updateDoc(userRef, {
                name: userDetails.name, // Update name
                email: userDetails.email, // Update email
                monsterKills: increment(userDetails.monsterKills || 0), // Increment monsterKills
                dragonKills: increment(userDetails.dragonKills || 0), // Increment dragonKills
                deaths: increment(userDetails.deaths || 0), // Increment deaths
            });
            console.log("User stats updated!");
        } else {
            // If the document does not exist, create it
            const initialStats = {
                name: userDetails.name,
                email: userDetails.email,
                monsterKills: userDetails.monsterKills || 0,
                dragonKills: userDetails.dragonKills || 0,
                playerLevel: "Rookie", // Default level
                deaths: userDetails.deaths || 0,
            };
            await setDoc(userRef, initialStats);
            console.log("New user stats added!");
        }
    } catch (error) {
        console.error("Error adding or updating user stats:", error);
    }
};
