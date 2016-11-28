Notification.requestPermission().then(function(result) {
});

var button = document.querySelector("#startTimer");
var minutesInput = document.querySelector("#numMinutes");
var timerText = document.querySelector("#timerText");

console.log(minutesInput.value);

var timerEndTime = null;
var notified = false;
var running = false;

function stepTimer() {
  if (!running) return;
  var currTime = new Date();

  var timeLeft = timerEndTime - currTime;
  var secondsLeft = Math.abs((timeLeft / 1000) % 60);
  var floatingMinutes = timeLeft / 1000 / 60;
  var minutesLeft = timeLeft > 0
      ? Math.floor(floatingMinutes)
      : Math.ceil(floatingMinutes);
  var textColor = timeLeft > 0 ? 'blue' : 'red';
  var sign = timeLeft > 0 ? '' : '-';

  timerText.innerText = `${sign}${Math.abs(minutesLeft)}:${secondsLeft.toFixed(2)}`;
  timerText.style.color = textColor;

  if (!notified && timeLeft < 0) {
    notified = true;
    var notif = new Notification("Beep beep");
    notif.addEventListener('click', () => {
      console.log("Notification clicked");
      running = false;
      notified = false;
      notif.close();
      window.focus();
    });
  }

  setTimeout(stepTimer, 0.1);
}

function startTimer() {
  var currTime = new Date();
  var timerMinutes = parseFloat(minutesInput.value);
  timerEndTime = currTime.getTime() + (timerMinutes * 60 * 1000);
  running = true;
  setTimeout(stepTimer, 1000);
}

button.onclick = startTimer;

minutesInput.onkeydown = event => {
  if (event.code === 'Enter') startTimer();
};
