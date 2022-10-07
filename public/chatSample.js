var ws;
var messageLog = "",
	userName;
const renderdomain = "onrender.com";
const herokudomain = "herokuapp.com";
onload = function () {
	const output = document.getElementById("output");
	output.innerHTML = "Wait for connection...";
	if (location.host.indexOf(herokudomain) > 0 || location.host.indexOf(renderdomain) > 0 ) {
		wssHostURL.value = "wss://" + location.host + "/room1";
	} else {
	}
	messageInput.addEventListener("keypress", checkEnter);
};

function connectHost() {
	var wssUrl = wssHostURL.value.trim();
	userName = userNameInput.value.trim();
	if (!userName) {
		userName = "user" + Math.floor(Math.random() * 10);
		userNameInput.value = userName;
	}
	console.log(wssUrl);
	try {
		ws = new WebSocket(wssUrl);
		ws.onopen = function () {
			output.innerHTML = "Connected to the server";
			connectBtn.disabled = true;
			userNameInput.disabled = true;
			wssHostURL.disabled = true;

			if (wssUrl.indexOf(herokudomain) > 0 || wssUrl.indexOf(renderdomain) > 0) {
				// Deterring disconnections with Heroku timeout rules.
				setTimeout(ping, 45 * 1000);
			}

			ws.onmessage = function (event) {
				console.log(event.data);
				const msg = JSON.parse(event.data);
				output.innerHTML = `Answer from server: ${event.data}`;
				if (msg.message) {
					messageLog += `\n${msg.user}: ${new Date(msg.time).toLocaleTimeString()}: ${msg.message}`;
					messageBox.value = messageLog;
				}
			};
		};
	} catch (e) {
		console.error(e);
		output.innerHTML = "Failed to connect";
	}
}

function ping() {
	console.log("ping");
	ws.send("");
	setTimeout(ping, 45 * 1000);
}

function checkEnter(e) {
	if (e.keyCode === 13) {
		sendMsg();
	}
}

function sendMsg() {
	var sendMsgTxt = messageInput.value.trim();
	messageInput.value = "";
	ws.send(
		JSON.stringify({
			message: sendMsgTxt,
			time: new Date().getTime(),
			user: userName,
		})
	);
}
