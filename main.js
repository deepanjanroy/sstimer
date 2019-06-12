Notification.requestPermission();
var button = document.querySelector("#startTimer");
var minutesInput = document.querySelector("#numMinutes");
var timerText = document.querySelector("#timerText");

var timerEndTime = null;
var notified = false;
var running = false;

let lastExecution = 0;
let timerId = null;
let rafScheduled = false;

function scheduleRaf(f) {
  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      f();
    })
  }
}

function stepTimer() {
  if (!running) {
    clearInterval(timerId);
    timerId = null;
    return;
  }
  var currTime = new Date();

  var timeLeft = timerEndTime - currTime;
  var secondsLeft = Math.abs((timeLeft / 1000) % 60);
  var floatingMinutes = timeLeft / 1000 / 60;
  var minutesLeft = timeLeft > 0
      ? Math.floor(floatingMinutes)
      : Math.ceil(floatingMinutes);
  var textColor = timeLeft > 0 ? 'blue' : 'red';
  var sign = timeLeft > 0 ? '' : '-';
  // zero pad and two decimal digits after.
  var displaySeconds = ('0' + secondsLeft.toFixed(2)).slice(-5);
  var titleSeconds = displaySeconds.slice(0, 2);

  timerText.innerText = `${sign}${Math.abs(minutesLeft)}:${displaySeconds}`;
  timerText.style.color = textColor;
  document.title = `${sign}${Math.abs(minutesLeft)}:${titleSeconds}`;

  if (!notified && timeLeft < 0) {
    notified = true;
    notifContent = document.querySelector('#notification-text').value;
    var notif = new Notification("Beep beep", {body: notifContent});
    notif.addEventListener('click', () => {
      console.log("Notification clicked");
      running = false;
      notified = false;
      notif.close();
      window.focus();
    });
  }

  scheduleRaf(stepTimer);

  if (timerId === null) {
    // Every second, force update even if in background, so that the tab title
    // gets updated.
    timerId = setInterval(stepTimer, 1000 /* ms */);
  }
}

function startTimer(timerMinutes) {
  const currTime = new Date();
  timerEndTime = currTime.getTime() + (timerMinutes * 60 * 1000);
  running = true;
  notified = false;
  stepTimer();
}


function startTimerFromParam() {
  const url = new URL(window.location.href);
  const minutes = parseInt(url.searchParams.get('minutes'));
  minutesInput.value = minutes;
  if (!isNaN(minutes)) {
    startTimer(minutes);
  }
}

let unloadHandler;
function installUnloadHandler() {
  unloadHandler = window.addEventListener("beforeunload", function (e) {
    e.returnValue = "No!";
  });
}

function startTimerFromInput() {
  // Install unload handler only when timer started from input box.
  // Otherwise it's fine to let the tab close quickly.
  installUnloadHandler();
  startTimer(parseFloat(minutesInput.value));
}

button.onclick = startTimerFromInput;

minutesInput.onkeydown = event => {
  // 13 is the keyCode of enter key
  if (event.keyCode === 13) startTimerFromInput();
};

// Handle tab in text area
document.querySelector("textarea").addEventListener('keydown',function(e) {
    if(e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var target = e.target;
        var value = target.value;

        // set textarea value to: text before caret + tab + text after caret
        target.value = value.substring(0, start)
            + "  "
            + value.substring(end);

        // put caret at right position again (add two spaces)
        this.selectionStart = this.selectionEnd = start + 2;

        // prevent the focus lose
        e.preventDefault();
    }
},false);

// TODO: Make the return key put add equal amounts of indent as previous line

startTimerFromParam();
