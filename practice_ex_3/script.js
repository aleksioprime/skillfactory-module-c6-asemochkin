const btnSend = document.querySelector(".j-btn-send");
const btnGeo = document.querySelector(".j-btn-geo");
const messageField = document.querySelector(".message-hist");
const btnClear = document.querySelector(".j-clear");
const inputTxt = document.querySelector(".j-txt");

const wsUri = "wss://echo.websocket.org/";
let websocket = new WebSocket(wsUri);

// Открытие webSocket-соединения
websocket.onopen = function(evt) {
    console.log("CONNECTED");
    inputTxt.disabled = false;
    btnSend.disabled = false;
    btnGeo.disabled = false;
    inputTxt.focus();
    inputTxt.placeholder="Здесь вводится текст сообщения";
};

// Закрытие webSocket-соединения
websocket.onclose = function(evt) {
    console.log("DISCONNECTED");
    inputTxt.disabled = true;
    btnSend.disabled = true;
    btnGeo.disabled = true;
    inputTxt.placeholder="Нет подключения";
};

// Ошибка подключения к webSocket
websocket.onerror = function(evt) {
    console.log("CONNECTION ERROR! ");
};

// Приём сообщений с webSocket-сервера
websocket.onmessage = function(evt) {
    if (IsJsonString(evt.data) != true) {
        console.log(evt.data);
        writeToScreen(evt.data, false); 
    } else {
        console.log(evt.data);
    }
}

// Функция проверки возможности перевести строку в JSON-объект
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Функция вывода сообщений на экран
function writeToScreen(message, client) {
    let newDiv = document.createElement('div');
    newDiv.classList.add("message-wrap");
    newDiv.innerHTML = `
        <div class="message-txt">
            <p>${message}</p>
        </div>
    `;
    if (!client) {
        newDiv.style.justifyContent = 'flex-start';
    } else {
        newDiv.style.justifyContent = 'flex-end';
    }
    messageField.insertAdjacentElement("beforeend",newDiv);
    let topPos = newDiv.offsetTop;
    messageField.scrollTop = topPos;
}

// Обработчик события нажатия на кнопку "Отправить"
btnSend.addEventListener('click', () => {
    let text = inputTxt.value;
    if (text != false) {
        writeToScreen(text, true); 
        websocket.send(text);
        inputTxt.value = '';
        inputTxt.focus();
    }
});

// Функция, выводящая текст об ошибке получения геолокации
const error = () => {
    writeToScreen('Невозможно получить ваше местоположение', true);
}

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    let text = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" target="_blank">Геолокация</a>`
    writeToScreen(text, true); 
    let coordOnerver = {
        'latitude': latitude,
        'longitude': longitude,
    }
    websocket.send(JSON.stringify(coordOnerver));
}

// Обработчик события нажатия на кнопку "Геолокация"
btnGeo.addEventListener('click', () => {
    if (!navigator.geolocation) {
        text = 'Geolocation не поддерживается вашим браузером';
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
});

// Обработчик события нажатия на кнопку "Очистить"
btnClear.addEventListener('click', () => {
    messageField.innerHTML = '';
});