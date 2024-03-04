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


async function doSomething() {
  if (!btnQurious.hasAttribute('listening')) {
    btnQurious.setAttribute('listening', true);
    speechRecognition.start();
  } else {
    btnQurious.removeAttribute('listening');
    speechRecognition.stop();
    const myPopup = new Popup({
      id: 'my-popup',
      title: 'Here is what you said',
      content: transcript,
    });    
    
    myPopup.show();

  }
}

function collectElementDetails() {
  const elements = document.querySelectorAll('*'); // Select all elements in the DOM
  const elementsDetails = Array.from(elements).map((element) => ({
      tagName: element.tagName,
      classes: Array.from(element.classList), // Convert classList to an array
      id: element.id,
  }));
  return elementsDetails;
}



console.log("Sending message to background:", { action: "sendHTML", html: collectElementDetails(), prompt: "News and Events" });
chrome.runtime.sendMessage({
      action: "sendHTML",
      html: collectElementDetails(),
      prompt: "News and Events"
    }, function(response) {
      console.log("Response from background:", response);
    });