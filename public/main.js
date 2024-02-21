var target_mili_sec = new Date("Feb 29, 2024 14:30:0").getTime();

function timer() {
  var now_mili_sec = new Date().getTime();
  var remaining_sec = Math.floor( (target_mili_sec - now_mili_sec) / 1000 );

  var day = Math.floor(remaining_sec / (3600 * 24));
  var hour = Math.floor((remaining_sec % (3600 * 24)) / 3600);
  var min = Math.floor((remaining_sec % 3600) / 60);
  var sec = Math.floor(remaining_sec % 60);

  document.querySelector("#day").innerHTML = day;
  document.querySelector("#hour").innerHTML = hour;
  document.querySelector("#min").innerHTML = min;
  document.querySelector("#sec").innerHTML = sec;
}

setInterval(timer, 1000);


var countdownWindow = document.getElementById('countdownWindow');
var btn = document.getElementById("countdownRef");

// Obtiene el elemento que cierra el countdownWindow
var span = document.getElementsByClassName("close")[0];

// Cuando el usuario hace clic en el botón, abre el countdownWindow 
btn.onclick = function(event) {
    event.preventDefault(); // Previene que el enlace navegue a un URL (previene el comportamiento por defecto)
    countdownWindow.style.display = "block";
}

// Cuando el usuario hace clic en <span> (x), cierra el countdownWindow
span.onclick = function() {
  countdownWindow.style.display = "none";
}

// Cuando el usuario hace clic en cualquier lugar fuera del countdownWindow, lo cierra
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

