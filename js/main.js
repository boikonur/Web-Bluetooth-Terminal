// UI elements.
const deviceNameLabel = document.getElementById('device-name');
const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const volumeSlider = document.getElementById('volume-slider');
const powerButton = document.getElementById('turn-on');
const terminalContainer = document.getElementById('terminal');
const sendForm = document.getElementById('send-form');
const inputField = document.getElementById('input');

const btnGroup= document.getElementById('btnGroup');

var connected;

var cmdSugestions = ["battery_voltage","get_on","id","on","off","Anguilla","beep","play",
"play_track","stop_track","get_track","volumes","buffered","cd","mkdir","pwd","next pre",
"prev pre","message","list_presets","get_preset","get_volume","set_volume","set_preset",
"list_tracks","help","ls","rm","format","dir","readalot","sdtest","cache","effects","df",
"high","low","booster","ton","tof","dumpwav","twiddle","twiddle2","malloc","top","version",
"reset","hm1Xpin","hm1Xname","send","make_default_console","make_default_console"];

// Helpers.
const defaultDeviceName = 'Terminal';
const terminalAutoScrollingLimit = terminalContainer.offsetHeight / 2;
let isTerminalAutoScrolling = true;

const scrollElement = (element) => {
  const scrollTop = element.scrollHeight - element.offsetHeight;

  if (scrollTop > 0) {
    element.scrollTop = scrollTop;
  }
};

const logToTerminal = (message, type = '') => {
  terminalContainer.insertAdjacentHTML('beforeend',
      `<div${type && ` class="${type}"`}>${message}</div>`);

  if (isTerminalAutoScrolling) {
    scrollElement(terminalContainer);
  }
};

// Obtain configured instance.
let terminal = new BluetoothTerminal();

// Override `receive` method to log incoming data to the terminal.
terminal.receive = function(data) {
  logToTerminal(data, 'in');
};

// Override default log method to output messages to the terminal and console.
terminal._log = function(...messages) {
  // We can't use `super._log()` here.
  messages.forEach((message) => {
    logToTerminal(message);
    console.log(message); // eslint-disable-line no-console
  });
};

// Implement own send function to log outcoming data to the terminal.
const send = (data) => {
  terminal.send(data).
      then(() => logToTerminal(data, 'out')).
      catch((error) => logToTerminal(error));
};

// Bind event listeners to the UI elements.
connectButton.addEventListener('click', () => {
  terminal.connect().
      then(() => {
        deviceNameLabel.textContent = terminal.getDeviceName() ?
            terminal.getDeviceName() : defaultDeviceName;
      });
});

disconnectButton.addEventListener('click', () => {
  terminal.disconnect();
  deviceNameLabel.textContent = defaultDeviceName;
});


volumeSlider.addEventListener('click', () => {
  send(volumeSlider.value);
  console.log(volumeSlider.value);
  deviceNameLabel.textContent = defaultDeviceName;
});

sendForm.addEventListener('submit', (event) => {
  event.preventDefault();

  send(inputField.value);

  inputField.value = '';
  inputField.focus();
});

function sendBtnEvnt(e) {
  if (e.target !== e.currentTarget) {
      var clickedItem = e.target.id;
      switch (clickedItem)
      {
        case 'onBtn':
        console.log("Turn ON");
       var prom= send("on");
       prom.then(function(value) {
          console.log(value);
          // expected output: Array [1, 2, 3]
        });
        break;
        case 'offBtn':
        console.log("Turn OFF");
        send("off");
        break;
        case 'clashBtn':
        console.log("Clash");
        send("clash");
        break;
        case 'blastBtn':
        console.log("Blast");
        send("blast");
        break;
        case 'forceBtn':
        console.log("Force");
        send("force");
        break;
        case 'lockupBtn':
        console.log("Lockup");
        send("lockup");
        break;
        case 'dragBtn':
        console.log("Drag");
        send("drag");
        break;
        case 'stopTrackBtn':
        console.log("Stop Track");
        send("stop_track");
        break;
        default:
        console.log("what is this button-> " + clickedItem);
      }
  }
  e.stopPropagation();
}

btnGroup.addEventListener('click', (event) => {

  sendBtnEvnt(event);
});



// Switch terminal auto scrolling if it scrolls out of bottom.
// terminalContainer.addEventListener('scroll', () => {
//   const scrollTopOffset = terminalContainer.scrollHeight -
//       terminalContainer.offsetHeight - terminalAutoScrollingLimit;

//   isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
// });
