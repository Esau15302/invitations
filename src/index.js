import './main.css';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";


//Initialize firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTwgtxgobWdVtATK2hnnE8Ney6dnYogI8",
  authDomain: "invitaciones-1cb9e.firebaseapp.com",
  databaseURL: "https://invitaciones-1cb9e-default-rtdb.firebaseio.com",
  projectId: "invitaciones-1cb9e",
  storageBucket: "invitaciones-1cb9e.appspot.com",
  messagingSenderId: "28631399196",
  appId: "1:28631399196:web:92fe740523c62a07bf98d9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();


//Create Uid
const showConfirm = document.getElementById('showConfirmation');
const uuidOld = localStorage.getItem('uid');

if (uuidOld) {
  showConfirm.style.display = 'none';
} else {
  const uid = uuidv4();
  localStorage.setItem('uid', uid);
  set(ref(db, 'invitados/' + uid), {
    name:'',
    confirmation:'',
    total:''
  });
}

//Hide loader
let imagesLoaded = 0;
const images = document.querySelectorAll('img');
images.forEach(image => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded == images.length) {
            console.log('finish')
            var envelopeBackground = document.getElementById("uploadBackground");
            if (envelopeBackground.style.display === "none") {
                envelopeBackground.style.display = "block";
            } else {
                envelopeBackground.style.display = "none";
            }
            images.forEach(image => {
                image.removeAttribute('hidden');
                window.scrollTo(0, 0);
            }) 
        }
    }
});

//Countdown
const target_mili_sec = new Date("Feb 29, 2024 14:30:0").getTime();
function timer() {
  const now_mili_sec = new Date().getTime();
  const remaining_sec = Math.floor( (target_mili_sec - now_mili_sec) / 1000 );

  const day = Math.floor(remaining_sec / (3600 * 24));
  const hour = Math.floor((remaining_sec % (3600 * 24)) / 3600);
  const min = Math.floor((remaining_sec % 3600) / 60);
  const sec = Math.floor(remaining_sec % 60);

  document.querySelector("#day").innerHTML = day;
  document.querySelector("#hour").innerHTML = hour;
  document.querySelector("#min").innerHTML = min;
  document.querySelector("#sec").innerHTML = sec;
}
setInterval(timer, 1000);

//Show modal
const countdownWindow = document.getElementById('countdownWindow');
const confirmationWindow = document.getElementById('confirmationWindow');
const countdownRef = document.getElementById("countdownRef");
const confirmationRef = document.getElementById("confirmationRef");
const span = document.getElementsByClassName("close")[0];

countdownRef.onclick = function(event) {
    event.preventDefault(); 
    countdownWindow.style.display = "block";
}

confirmationRef.onclick = function(event) {
  event.preventDefault(); 
  confirmationWindow.style.display = "block";
}

span.onclick = function() {
  countdownWindow.style.display = "none";
  confirmationWindow.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == countdownWindow || event.target == confirmationWindow) {
    countdownWindow.style.display = "none";
    confirmationWindow.style.display = 'none';
  }
}
//Para IOS
window.addEventListener('touchend', function(event) {
  if (event.target == countdownWindow || event.target == confirmationWindow) {
    countdownWindow.style.display = "none";
    confirmationWindow.style.display = 'none';
  }
});

