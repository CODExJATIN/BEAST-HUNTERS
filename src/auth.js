import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    updateProfile,
    signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const googleBtn = document.getElementById("googleBtn");
const logoutBtn = document.getElementById("logout");
const displayUsername = document.getElementById("displayUsername");
const userAvatar = document.getElementById("userAvatar");
const userInfo = document.getElementById("userInfo");
const authModal = document.getElementById("authModal");
const editUsernameBtn = document.getElementById("editUsernameBtn");


// Event: Login
loginBtn?.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        updateUI(userCredential.user);
    } catch (error) {
        alert(error.message);
    }
});

// Event: Register
registerBtn?.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
        updateUI(userCredential.user);
    } catch (error) {
        alert(error.message);
    }
});

// Event: Google Login
googleBtn?.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Google login successful:", result.user);
        updateUI(result.user);
    } catch (error) {
        alert(error.message);
    }
});

// Event: Logout
logoutBtn?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
        resetUI();
    } catch (error) {
        alert(error.message);
    }
});

editUsernameBtn?.addEventListener("click", async () => {
    const newUsername = prompt("Enter a new username:");

    if (newUsername && newUsername.trim() !== "") {
        try {
            const user = auth.currentUser;
            if (user) {
                await updateProfile(user, {
                    displayName: newUsername.trim(),
                });
                console.log("Username updated to:", newUsername);
                updateUI(user); // Update the UI with the new username
            }
        } catch (error) {
            alert("Error updating username: " + error.message);
        }
    } else {
        alert("Username cannot be empty.");
    }
});

// Observe Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);
        updateUI(user);
    } else {
        console.log("No user is logged in");
        resetUI();
    }
});

// Update UI
function updateUI(user) {
    if (user) {
        authModal?.classList.add("hide");
        userInfo?.classList.remove("hide");

        // Update user profile details
        displayUsername.textContent = user.displayName || user.email;
        userAvatar.src = user.photoURL || "/assets/images/beast-hunter-user.jpg";
    }
}

// Reset UI on logout
function resetUI() {
    displayUsername.textContent = "";
    userAvatar.src = "/assets/images/beast-hunter-user.jpg";
    userInfo?.classList.add("hide");
    authModal?.classList.remove("hide");
}



