let body = document.querySelector('body');

let btnQurious = document.createElement('button');
btnQurious.setAttribute('id', 'btnQurious');

btnQurious.addEventListener('click', function () {
  doSomething();
});

body.appendChild(btnQurious);

let speechRecognition = new webkitSpeechRecognition();
speechRecognition.continuous = true;
speechRecognition.interimResults = true;
speechRecognition.lang = 'en-us';

let transcript = '';

speechRecognition.onresult = function (event) {
  transcript = '';
  for (let i = 0; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript;
  }
};

document.addEventListener('keypress', function (event) {
   if(event.shiftKey && event.ctrlKey && event.code ==='KeyQ'){
      btnQurious.click();
   }
});

function doSomething() {
  if (!btnQurious.hasAttribute('listening')) {
    btnQurious.setAttribute('listening', true);
    speechRecognition.start();
  } else {
    btnQurious.removeAttribute('listening');
    speechRecognition.stop();
    debugger;
    const myPopup = new Popup({
      id: 'my-popup',
      title: 'Her is what you said',
      content: transcript,
    });
    myPopup.show();
  }
}
