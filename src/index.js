import './main.css';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, get, child} from "firebase/database";


const eventDate = new Date('2024-08-23 10:00:00').getTime();

//Initialize firebase
const firebaseConfig = {
  apiKey: "AIzaSyAR_Fx8cqp8ebtvjAaO5xLsPqOkUblvZ8o",
  authDomain: "invitacion-bautizo-demo.firebaseapp.com",
  databaseURL: "https://invitacion-bautizo-demo-default-rtdb.firebaseio.com",
  projectId: "invitacion-bautizo-demo",
  storageBucket: "invitacion-bautizo-demo.appspot.com",
  messagingSenderId: "959979877237",
  appId: "1:959979877237:web:68523f36bc3d68d402d93c"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);
let dataGuest = null;

let uidGuestG = localStorage.getItem('uid');

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
  if(confirm) {
    newDataGuest.total = totalGuests + 1;
  }
  if (!dataGuest.fConfirm) {
    newDataGuest.fConfirm = dateConfirm;    //Date of first confirmation
  } else {
    newDataGuest.lConfirm = dateConfirm;    //Date of last consfirmation
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
      localStorage.removeItem('showFocus');   //If uidGuest not exist generate a new
      localStorage.removeItem('uid');
      location.reload();
    }
  }).catch((error) => {
    console.error(error);
  });
  return getData;
}

function timer() {
  const nowDate = new Date().getTime();
  const remainingSec = Math.floor( (eventDate - nowDate) / 1000 );
  const day = Math.floor(remainingSec / (3600 * 24));
  const hour = Math.floor((remainingSec % (3600 * 24)) / 3600);
  const min = Math.floor((remainingSec % 3600) / 60);
  const month = Math.floor(day / 30.44);
  document.querySelector("#month").innerHTML = month;
  document.querySelector("#day").innerHTML = Math.floor(day % 30.44);
  document.querySelector("#hour").innerHTML = hour;
  document.querySelector("#min").innerHTML = min;
}

//Main
const confirmationWindow = document.getElementById('confirmationWindow');
const confirmInput = document.querySelectorAll('input[name="confirm"]');
const envelopeBackground = document.getElementById("uploadBackground");
const envelopeWrapper = document.getElementById('envelopeWrapper');
const countdownWindow = document.getElementById('countdownWindow');
const confirmationRef = document.getElementById("confirmationRef");
const countdownRef = document.getElementById("countdownRef");
const notification = document.getElementById("notification");
const musicBackground = document.getElementById("music");
const totalGuest = document.getElementById("totalGuest");
const nameGuest = document.getElementById("nameGuest");
const textCircle = document.getElementById("textCircle");
const closeX = document.querySelectorAll('.closeX');
const showFocus = localStorage.getItem('showFocus');
const musicOn = document.getElementById("musicOn");
const musicOff = document.getElementById("musicOff");
const pages = document.getElementsByClassName('page');
const controlls = document.getElementsByClassName('controlls');
const focus = document.getElementById('focus');
const textConfirm = document.getElementById("textConfirm");
const textName = document.getElementById("textName");
let imagesLoaded = 0;
let openEnvelope = false;


if(!uidGuestG) {
  registerGuestDefault();
}

if(showFocus) {
  focus.style.display = 'none';
}

//Wait for all the pages to load  
for (const page of pages ) {
    const img = new Image();
    img.src = page.src;
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded == pages.length) {
          for (const controll of controlls ) {
            if (controll.getAttribute('id') === 'musicOff') {    //Review
              controll.style.display = 'none';
              continue;
            }
            controll.style.visibility='visible';             
          };
          textCircle.style.visibility='visible';  
          window.scrollTo(0, 0);            
        }
    }
};

//Countdown
setInterval(timer, 1000);

//Show modal
countdownRef.onclick = function(event) {
  event.preventDefault(); 
  countdownWindow.style.display = "block";
}

confirmationRef.onclick = async function(event) {
  event.preventDefault();
  notification.innerHTML = '';
  dataGuest = await getDataGuest(uidGuestG);
  if(dataGuest.name){
    textName.innerHTML = 'Hola:';
  }
  nameGuest.value = dataGuest.name;
  if( dataGuest.confirm.toString() != '') {
    document.querySelector(`input[type="radio"][value=${dataGuest.confirm.toString()}]`).checked = true;
    if( dataGuest.confirm) {
      textConfirm.innerHTML = 'Cuantas personas vendrán contigo:'
      totalGuest.disabled = false;
    }else {
      textConfirm.innerHTML = 'No vendrás &#128546;'
      totalGuest.disabled = true;
    }
  }
  if (dataGuest.total> 0) {
    dataGuest.total --;    //No include principal guest 
  }
  totalGuest.value = dataGuest.total? dataGuest.total : '';
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
      textConfirm.innerHTML = 'Cuantas personas vendrán contigo:'
      totalGuest.disabled = false;
    } else {
      textConfirm.innerHTML = 'No vendrás &#128546;'
      totalGuest.disabled = true;
      totalGuest.value = '';
    }
  }
});

saveConfirm.onclick = function() {
  const confirm = document.querySelector('input[name="confirm"]:checked');
  if (!nameGuest.value) {
    notification.innerHTML = 'Por favor escribe tu nombre.';
    nameGuest.focus();
    return;
  }
  updateGuestData(uidGuestG, nameGuest.value, (confirm.value === 'true'), parseInt(totalGuest.value ? totalGuest.value : 0)); //Add principal guest
  confirmationWindow.style.display = 'none';
  localStorage.setItem('showFocus', true);
  focus.style.display = 'none';
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

envelopeWrapper.onclick = function(event) {
  musicBackground.play();
  envelopeBackground.style.display = "none";
  openEnvelope = true;
}

document.addEventListener('visibilitychange', (event) => {
  if(document.visibilityState === 'visible' && openEnvelope){
    musicBackground.play();
  } else {
    musicBackground.pause();
  }
})

musicOnOff.onclick = function(event) {
  if (musicBackground.paused) {
    musicOff.style.display = 'none';
    musicOff.style.visibility = 'hidden';
    musicOn.style.display = 'block';
    musicOn.style.visibility = 'visible';
    musicBackground.play();
  } else {
    musicOn.style.display = 'none';
    musicOn.style.visibility = 'hidden';
    musicOff.style.display = 'block';
    musicOff.style.visibility = 'visible';
    musicBackground.pause();
  }
}


