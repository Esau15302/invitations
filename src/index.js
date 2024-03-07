import './main.css';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, get, child} from "firebase/database";


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

let uidGuestG = localStorage.getItem('uid');

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);

function registerGuestDefault() {
    const uidGuest = uuidv4();
    set(ref(db, 'invitados/' + uidGuest), {
      name:'',
      confirm: '',
      total: ''
    })
    .then(() => {
      localStorage.setItem('uid', uidGuest);
      uidGuestG = uidGuest;
    })
    .catch((error) => {
      console.error(error);
    }); 
}

function updateGuestData(uidGuest, name, confirm, totalGuests) {
  const newDataGuest = {
    name: name,
    confirm: confirm,
    total: totalGuests
  };
  const updates = {};
  updates['invitados/' + uidGuest] = newDataGuest;
  return update(dbRef, updates);
}

async function getDataGuest(uidGuest) {
  const getData = await get(child(dbRef, `invitados/${uidGuest}`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return getData;
}



const alertConfirm = document.getElementById('showConfirmation');
const showConfirm = localStorage.getItem('showConfirm');

if(!uidGuestG) {
  registerGuestDefault();
}

if(showConfirm) {
  alertConfirm.style.display = 'none';
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
const target_mili_sec = new Date('2024-04-07').getTime();
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
const nameGuest = document.getElementById("nameGuest");

const totalGuest = document.getElementById("totalGuest");
// const closeX = document.getElementsByClassName("closeX");
const  closeX = document.querySelectorAll('.closeX');
console.log(closeX)

countdownRef.onclick = function(event) {
    event.preventDefault(); 
    countdownWindow.style.display = "block";
}

confirmationRef.onclick = async function(event) {
  event.preventDefault();
  console.log('uid: ',uidGuestG);
  const dataGuest = await getDataGuest(uidGuestG);
  console.log(dataGuest);
  nameGuest.value = dataGuest.name;
  if( dataGuest.confirm.toString() != '') {
    document.querySelector(`input[type="radio"][value=${dataGuest.confirm.toString()}]`).checked = true;
  }
  
  totalGuest.value = dataGuest.total;
  confirmationWindow.style.display = "block";
}


closeX.forEach(function(element) {
  element.onclick = function() {
    console.log("cerrar")
    countdownWindow.style.display = 'none';
    confirmationWindow.style.display = 'none';
  }
});



saveConfirm.onclick = function() {
  const confirm = document.querySelector('input[name="confirm"]:checked');
  console.log(confirm.value);
  updateGuestData(uidGuestG, nameGuest.value, (confirm.value === 'true'), parseInt(totalGuest.value));
  confirmationWindow.style.display = 'none';
  localStorage.setItem('showConfirm', true);
  alertConfirm.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == countdownWindow || event.target == confirmationWindow) {
    countdownWindow.style.display = "none";
  }
}
//Para IOS
window.addEventListener('touchend', function(event) {
  if (event.target == countdownWindow || event.target == confirmationWindow) {
    countdownWindow.style.display = "none";
  }
});

