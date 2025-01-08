
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCUaF5qpwu_CnJkrSysjUNRvoCYHsS9LM",
    authDomain: "test-35534.firebaseapp.com",
    projectId: "test-35534",
    storageBucket: "test-35534.appspot.com",
    messagingSenderId: "133085605006",
    appId: "1:133085605006:web:44a54546aee6089947addf",
    measurementId: "G-B0KWBCD93C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
        userAvatar.src = user.photoURL || "path/to/default-avatar.png";
    }
}

// Reset UI on logout
function resetUI() {
    displayUsername.textContent = "";
    userAvatar.src = "path/to/default-avatar.png";
    userInfo?.classList.add("hide");
    authModal?.classList.remove("hide");
}