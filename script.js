// Проверка инициализации Telegram WebApp
if (!window.Telegram || !window.Telegram.WebApp) {
    document.body.innerHTML = '<p style="color:red;padding:20px;text-align:center">Ошибка инициализации Telegram WebApp</p>';
    throw new Error('Telegram WebApp API не доступен');
}

const tg = window.Telegram.WebApp;
tg.expand();

// Элементы интерфейса
const greeting = document.getElementById('greeting');
const sendBtn = document.getElementById('send-btn');
const responseDiv = document.getElementById('response') || document.createElement('div');
responseDiv.id = 'response';
document.body.appendChild(responseDiv);

// Приветствие пользователя
if (tg.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    greeting.innerHTML = `Привет, ${user.first_name || 'пользователь'}! 👋`;
    if (user.photo_url) {
        greeting.innerHTML += `<br><img src="${user.photo_url}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;margin-top:10px;">`;
    }
} else {
    greeting.textContent = "Привет! 👋";
}

// Обработчик кнопки отправки
sendBtn.addEventListener('click', async () => {
    try {
        // Подготовка данных
        const data = {
            action: "button_click",
            user_id: tg.initDataUnsafe?.user?.id || "anonymous",
            timestamp: new Date().toISOString(),
            platform: tg.platform
        };

        // UI feedback
        sendBtn.disabled = true;
        sendBtn.textContent = "Отправка...";
        responseDiv.innerHTML = `
            <div class="notification">
                <p>⌛ Отправляем данные...</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;

        // Отправка данных
        tg.sendData(JSON.stringify(data));
        
        // Успешная отправка
        setTimeout(() => {
            responseDiv.innerHTML = `
                <div class="confirmation">
                    <p>✅ Данные успешно отправлены!</p>
                    <p>Вы можете продолжить или закрыть приложение</p>
                </div>
            `;
            sendBtn.disabled = false;
            sendBtn.textContent = "Отправить снова";
        }, 500);

    } catch (error) {
        console.error("Ошибка отправки:", error);
        responseDiv.innerHTML = `
            <div class="error">
                <p>❌ Ошибка отправки данных</p>
                <p>${error.message}</p>
            </div>
        `;
        sendBtn.disabled = false;
        sendBtn.textContent = "Попробовать снова";
    }
});

// Кнопка закрытия
tg.MainButton.setText("Закрыть").show();
tg.MainButton.onClick(() => {
    tg.showPopup({
        title: "Подтверждение",
        message: "Закрыть приложение?",
        buttons: [
            {id: "close", type: "destructive", text: "Да"},
            {type: "default", text: "Нет"}
        ]
    }, (buttonId) => buttonId === "close" && tg.close());
});

// Стили
const style = document.createElement('style');
style.textContent = `
    .notification, .confirmation, .error {
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        animation: fadeIn 0.3s;
    }
    .notification { background: var(--tg-theme-secondary-bg-color); }
    .confirmation { background: #e8f5e9; color: #2e7d32; }
    .error { background: #ffebee; color: #c62828; }
    pre {
        background: var(--tg-theme-bg-color);
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
        font-size: 14px;
    }
    #send-btn {
        transition: all 0.2s;
    }
    #send-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    #send-btn:active {
        transform: scale(0.98);
    }
`;
document.head.appendChild(style);
