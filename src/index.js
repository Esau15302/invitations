import './main.css';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, get, child} from "firebase/database";


//Initialize firebase
const firebaseConfig = {
  apiKey: "AIzaSyD58_CuPxsPsPF3C7ivUYKsjz__DxEUj2k",
  authDomain: "invitacion-xv-demo-eeff8.firebaseapp.com",
  projectId: "invitacion-xv-demo-eeff8",
  storageBucket: "invitacion-xv-demo-eeff8.appspot.com",
  messagingSenderId: "928152016075",
  appId: "1:928152016075:web:69b325ba5b3681eb07374e",
  databaseURL: "https://invitacion-xv-demo-eeff8-default-rtdb.firebaseio.com"
};

let uidGuestG = localStorage.getItem('uid');

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);
let dataGuest = null;

function getTimestampInSeconds () {
  return Date.now().toString();
}

function registerGuestDefault() {
    const uidGuest = uuidv4();
    set(ref(db, 'invitados/' + uidGuest), {
      name:'',
      confirm: '',
      total: 0,
      seen: getTimestampInSeconds(),
      fConfirm: '',
      lConfirm: ''
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
  const dateConfirm = getTimestampInSeconds();
  const newDataGuest = {
    name: name,
    confirm: confirm,
    total: totalGuests,
    seen: dataGuest.seen,
    fConfirm: dataGuest.fConfirm,
    lConfirm: dataGuest.lConfirm
  };
  if (!dataGuest.fConfirm) {
    newDataGuest.fConfirm = dateConfirm;
  } else {
    newDataGuest.lConfirm = dateConfirm;
  }
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
      localStorage.removeItem('showConfirm');
      localStorage.removeItem('uid');
      location.reload();
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
const confirmInput = document.querySelectorAll('input[name="confirm"]');
const totalGuest = document.getElementById("totalGuest");
// const closeX = document.getElementsByClassName("closeX");
const  closeX = document.querySelectorAll('.closeX');

countdownRef.onclick = function(event) {
    event.preventDefault(); 
    countdownWindow.style.display = "block";
}

confirmationRef.onclick = async function(event) {
  event.preventDefault();
  dataGuest = await getDataGuest(uidGuestG);
  nameGuest.value = dataGuest.name;
  if( dataGuest.confirm.toString() != '') {
    document.querySelector(`input[type="radio"][value=${dataGuest.confirm.toString()}]`).checked = true;
  }
  
  totalGuest.value = dataGuest.total;
  confirmationWindow.style.display = "block";
}

closeX.forEach(function(element) {
  element.onclick = function() {
    countdownWindow.style.display = 'none';
    confirmationWindow.style.display = 'none';
  }
});

confirmInput.forEach(function(element) {
  element.onclick = function(event) {
    const confirm = document.querySelector('input[name="confirm"]:checked');
    if (confirm.value === 'true') {
      totalGuest.disabled = false;
    } else {
      totalGuest.disabled = true;
      totalGuest.value = 0;
    }
  }
});

saveConfirm.onclick = function() {
  const confirm = document.querySelector('input[name="confirm"]:checked');
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

