import './main.css';
import { v4 as uuidv4 } from 'uuid';

//Create Uid
const showConfirm = document.getElementById('showConfirmation');
const uuidOld = localStorage.getItem('uid');

if (uuidOld) {
  showConfirm.style.display = 'none';
} else {
  localStorage.setItem('uid', uuidv4());
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
const btn = document.getElementById("countdownRef");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function(event) {
    event.preventDefault(); 
    countdownWindow.style.display = "block";
}

span.onclick = function() {
  countdownWindow.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == countdownWindow) {
    countdownWindow.style.display = "none";
  }
}
//Para IOS
window.addEventListener('touchend', function(event) {
  if (event.target == countdownWindow) {
    countdownWindow.style.display = "none";
  }
});

