const session = [];


var highlighted = false;
var textInput = document.getElementById("textInput");

// 현재 시간을 알려주는 함수
function getCurrentTime() {
  const currentDate = new Date();
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedTime = currentDate.toLocaleString('en-US', options);
  
  const timeString = formattedTime + ', Today';
  return timeString;
}

// 유저가 클릭한 세션을 강조하는 함수
function highlight(element) {
  if (!highlighted) {
    element.classList.toggle('active');
    highlighted = true;
  } else {
    var sessions = document.getElementById('session');
    for (var i = 0; i < sessions.length; i++) {
      if (sessions[i].classList.contains('active')) {
        sessions[i].classList.toggle('active');
      }
    }
    element.classList.toggle('active');
  }
}

// 유저의 질문을 UI 에 띄워주는 함수
function userMessageDisplay(enteredText) {
  var newList = document.createElement("li");
  newList.className = 'clearfix';

  var dataDiv = document.createElement("div");
  dataDiv.classList.add("message-data", "text-right");

  var messageSpan = document.createElement("span");
  messageSpan.classList.add("message-data-time");
  messageSpan.textContent = getCurrentTime();

  var imgAvatar = document.createElement("img");
  imgAvatar.src = "https://bootdey.com/img/Content/avatar/avatar7.png";
  imgAvatar.alt = "avatar";

  dataDiv.appendChild(messageSpan);
  dataDiv.appendChild(imgAvatar);

  var divMessage = document.createElement("div");
  divMessage.classList.add("message", "other-message", "float-right");
  divMessage.textContent = enteredText;

  newList.appendChild(dataDiv);
  newList.appendChild(divMessage);

  var parentElement = document.querySelector(".chat-history .m-b-0");
  parentElement.appendChild(newList);
}

// 유저 질문을 서버에 보내고 답을 받아오는 함수
function userInput(enteredText) {
  var requestData = {
    user_input: enteredText
  };

  fetch('https://n162yzcjn5xpa1-5000.proxy.runpod.net/api/userinput', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })
  .then(function(response) {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Request failed with status ' + response.status);
    }
  })
  .then(function(data) {
    var responseArray = data.split('\n');
    var filteredArray = responseArray.filter(function(obj) {
      return obj.includes('"text"');
    });
    var textArray = filteredArray.map(function(obj) {
      var json = JSON.parse(obj);
      return json.text;
    });
    var concatenatedText = textArray.join('');
    botOutputDisplay(concatenatedText);
  })
  .catch(function(error) {
    console.error('Error:', error);
  })
}

//받아온 답을 UI 에 띄워주는 함수
function botOutputDisplay(response) {
  const li = document.createElement('li');
  li.classList.add('clearfix');

  const responseDataDiv = document.createElement('div');
  responseDataDiv.classList.add('message-data');

  const responseDataTimeSpan = document.createElement('span');
  responseDataTimeSpan.classList.add('message-data-time');
  responseDataTimeSpan.textContent = getCurrentTime();

  responseDataDiv.appendChild(responseDataTimeSpan);

  const responseDiv = document.createElement('div');
  responseDiv.classList.add('message', 'my-message');
  responseDiv.textContent = response;

  li.appendChild(responseDataDiv);
  li.appendChild(responseDiv);

  const parentContainer = document.querySelector(".chat-history .m-b-0"); 
  parentContainer.appendChild(li);

  scrollToBottom();
}

function scrollToBottom() {
  var chatContainer = document.querySelector('.scrollable-container');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

textInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    var enteredText = textInput.value;
    userMessageDisplay(enteredText);
    userInput(enteredText);
    textInput.value = "";
    scrollToBottom();
  }
});
