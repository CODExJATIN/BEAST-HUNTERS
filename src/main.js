import { auth } from "./auth";
import { onAuthStateChanged } from "firebase/auth";
import { addOrUpdateUserStats } from "./updateData";

let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const upperScreen = document.querySelector('#upperScreen');
const bg = document.querySelector('#bg');
const playBtn = document.querySelector('#play');

let userId = auth.currentUser ? auth.currentUser.uid : null;
let userName = auth.currentUser ? auth.currentUser.displayName : "Player";  // Fallback if the name is not set
let userEmail = auth.currentUser ? auth.currentUser.email : "";  // Get email from Firebase

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);
        userId = user.uid;
        userEmail=user.email;
        userName= user.displayName;

    } else {
        console.log("No user is logged in");
    }
});

//const xpStat = document.getElementById('xpStat');
//const healthStat = document.getElementById('healthStat');  //will think about it later
//const goldStat = document.getElementById('goldStat');


const stick = document.getElementById('stick');
const dagger = document.getElementById('dagger');
const hammer = document.getElementById('hammer');
const sword = document.getElementById('sword');

const screenMain = document.getElementsByClassName("mainScreen")[0];
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?"],
    "button functions": [restart],
    text: "You die. ☠️"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?"], 
    "button functions": [restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! 🎉" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";

  // Update button texts and functionalities
  button1.innerText = location["button text"][0];
  button1.onclick = location["button functions"][0];

  if (location["button text"][1]) {
    button2.style.display = "inline-block";
    button2.innerText = location["button text"][1];
    button2.onclick = location["button functions"][1];
  } else {
    button2.style.display = "none"; // Hide button if no text is provided
  }

  if (location["button text"][2]) {
    button3.style.display = "inline-block";
    button3.innerText = location["button text"][2];
    button3.onclick = location["button functions"][2];
  } else {
    button3.style.display = "none"; // Hide button if no text is provided
  }

  text.innerText = location.text;
}


function goTown() {
  update(locations[0]);
  screenMain.style.backgroundImage="url(/assets/scenes/Opening.jpg)"
  backgroundMusic.play();
}

function goStore() {
  update(locations[1]);
  screenMain.style.backgroundImage="url(/assets/scenes/Opening.jpg)"
  backgroundMusic.play();
}

function goCave() {
  update(locations[2]);
  screenMain.style.backgroundImage="url(/assets/scenes/cave.jpg)"
  backgroundMusic.play();
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    
    goldText.classList.add('popAnimation');
    healthText.classList.add('popAnimation');
    /*goldStat.innerText = gold;
    healthStat.innerText = health;*/

  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
      if(currentWeapon===1){
        dagger.classList.remove('black-and-white')
        dagger.classList.add('normal')
      }
      if(currentWeapon===2){
        hammer.classList.remove('black-and-white')
        hammer.classList.add('normal')
      }
      if(currentWeapon===3){
        sword.classList.remove('black-and-white')
        sword.classList.add('normal')
      }
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
    if(currentWeapon===1){
      dagger.classList.add('black-and-white');
      dagger.classList.remove('normal');
    }
    if(currentWeapon===2){
      hammer.classList.add('black-and-white');
      hammer.classList.remove('normal');
    }
    if(currentWeapon===3){
      sword.classList.add('black-and-white');
      sword.classList.remove('remove');
    }
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
  backgroundMusic.pause();
  screenMain.style.backgroundImage="url(/assets/scenes/slime.jpg)"
}

function fightBeast() {
  fighting = 1;
  goFight();
  backgroundMusic.pause();
  screenMain.style.backgroundImage="url(/assets/scenes/finged_beast.jpg)"
}

function fightDragon() {
  fighting = 2;
  goFight();
  backgroundMusic.pause();
  screenMain.style.backgroundImage="url(/assets/scenes/dragon.jpg)"
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {

    const punchSound = new Audio("/assets/sounds/punch.mp3");
    punchSound.currentTime = 0;
    punchSound.play();

    if(fighting===0){
        screenMain.style.backgroundImage="url(/assets/scenes/slime_attack.jpg)"
    }
    else if(fighting===1){
        screenMain.style.backgroundImage="url(/assets/scenes/finged_beast.jpg)"
    }
    else if(fighting===2){
        screenMain.style.backgroundImage="url(/assets/scenes/dragon_attack.jpg)"
    }
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);

  if (health < 0) {
    health = 0; // To ensure health does not drop below zero
  }

  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
      
    } else {
      defeatMonster();
      playWinSound();

    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    if(currentWeapon===1){
      dagger.classList.remove('normal');
      dagger.classList.add('black-and-white');
    }
    if(currentWeapon===2){
      hammer.classList.remove('normal');
      hammer.classList.add('black-and-white');
    }
    if(currentWeapon===3){
      sword.classList.remove('normal');
      sword.classList.add('black-and-white');
    }
    currentWeapon--;

  }

}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  const swooshSound = new Audio("/assets/sounds/swoosh.mp3");
  swooshSound.currentTime = 0;
  swooshSound.play();
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;

  if(fighting===2){
    screenMain.style.backgroundImage="url(/assets/scenes/dragon_dodge.jpg)"
  }
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);

  if(fighting===0){
    screenMain.style.backgroundImage="url(/assets/scenes/slime_dead.jpg)"
}
else if(fighting===1){
    screenMain.style.backgroundImage="url(/assets/scenes/beast_dead1.jpg)"
}

// Increment monster kills
if (userId) {
  addOrUpdateUserStats(userId, {
    name: userName,
    email: userEmail,
    monsterKills: 1,  // Increment monster kills by 1
  });
}

}

function lose() {
  update(locations[5]);
  screenMain.style.backgroundImage="url(/assets/scenes/death.jpg)"
  playLoserSound();

  // Increment deaths
  if (userId) {
    addOrUpdateUserStats(userId, {
      name: userName,
      email: userEmail,
      deaths: 1,  // Increment deaths by 1
    });
  }
}

function winGame() {
  update(locations[6]);
  screenMain.style.backgroundImage="url(/assets/scenes/dragon_dead1.jpg)"
  playWinSound();

  // Increment dragon kills
  if (userId) {
    addOrUpdateUserStats(userId, {
      name: userName,
      email: userEmail,
      dragonKills: 1,  // Increment dragon kills by 1
    });
  }
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
  backgroundMusic.play();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    if (health < 0) {
      health = 0; // To ensure health does not drop below zero
    }
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}


document.getElementById('play').addEventListener('click',async ()=>{
  bg.classList.remove('bgImage');
  upperScreen.classList.remove('hide');
  playBtn.classList.add('hide');
})

document.getElementById('play').addEventListener('mouseover',()=>{
  bg.classList.remove('basic');
  bg.classList.add('black-and-white');
})

document.getElementById('play').addEventListener('mouseout',()=>{
  bg.classList.add('basic');
  bg.classList.remove('black-and-white');
})


function togglePopup() {
  const popup = document.getElementById("popup");
  const mainContent = document.querySelector("#bg");
  const playBtn = document.getElementById("play");
  

  if (window.innerWidth <= 768) {
      popup.style.display = "flex";
      mainContent.classList.add("blur");
      playBtn.classList.add("blur");
  } else {
      popup.style.display = "none";
      mainContent.classList.remove("blur");
      playBtn.classList.remove("blur");
  }
}

window.onload = togglePopup;
window.addEventListener("resize", togglePopup);

// Button Sound Effect
const buttons = document.querySelectorAll("#controls button");

const clickSound = new Audio("/assets/sounds/click-sound.mp3");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
  });
});

const playButton = document.getElementById("play");
const playButtonSound = new Audio("/assets/sounds/click-sound.mp3");
const backgroundMusic = new Audio("/assets/sounds/background-music.mp3");
backgroundMusic.loop = true;

playButton.addEventListener("click", () => {
  playButtonSound.currentTime = 0;
  playButtonSound.play();
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
});


const group1Sound = new Audio("/assets/sounds/click-sound.mp3");
const group2Sound = new Audio("/assets/sounds/click-sound.mp3");
const group3Sound = new Audio("/assets/sounds/click-sound.mp3");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const groupId = button.getAttribute("data-group-id");
    let sound;
    switch (groupId) {
      case "group1":
        sound = group1Sound;
        break;
      case "group2":
        sound = group2Sound;
        break;
      case "group3":
        sound = group3Sound;
        break;
      default:
        sound = null;
    }
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  });
});

// Loser sound effect
const loserSound = new Audio("/assets/sounds/game-over.mp3");

function playLoserSound() {
  backgroundMusic.pause();
  loserSound.currentTime = 0;
  loserSound.play();
}

//Winner sound
const winSound = new Audio("/assets/sounds/victory.mp3");

function playWinSound() {
  console.log("Playing")
  backgroundMusic.pause();
  winSound.currentTime = 0;
  winSound.play();
}


