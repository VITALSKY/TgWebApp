// Инициализация WebApp
const tg = window.Telegram.WebApp;

// Развернуть приложение на весь экран
tg.expand();

// Получаем данные пользователя
const user = tg.initDataUnsafe.user;
const greeting = document.getElementById('greeting');
const sendBtn = document.getElementById('send-btn');
const responseDiv = document.getElementById('response');

// Устанавливаем приветствие
if (user) {
    greeting.textContent = `Привет, ${user.first_name}! 👋`;
    // Добавляем аватар, если есть
    if (user.photo_url) {
        greeting.innerHTML += `<br><img src="${user.photo_url}" style="width: 50px; border-radius: 50%; margin-top: 10px;">`;
    }
} else {
    greeting.textContent = "Привет, аноним! 👋";
}

// Обработка кнопки
sendBtn.addEventListener('click', () => {
    // Создаем данные для отправки
    const data = {
        action: "button_click",
        user_id: user?.id || "anonymous",
        timestamp: new Date().toISOString(),
        platform: tg.platform
    };

    // Анимация нажатия
    sendBtn.style.transform = 'scale(0.95)';
    sendBtn.style.opacity = '0.8';
    setTimeout(() => {
        sendBtn.style.transform = '';
        sendBtn.style.opacity = '';
    }, 200);

    // Показываем уведомление
    responseDiv.innerHTML = `
        <div class="notification">
            <p>Отправляем данные...</p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;

    // Отправляем данные боту
    tg.sendData(JSON.stringify(data));
    
    // Показываем подтверждение
    setTimeout(() => {
        responseDiv.innerHTML += `
            <div class="confirmation">
                <p>✅ Данные успешно отправлены!</p>
                <small>Приложение закроется через 2 секунды...</small>
            </div>
        `;
    }, 500);

    // Закрываем Mini App через 2 секунды
    setTimeout(() => tg.close(), 30000);
});

// Показываем кнопку "Готово" в интерфейсе Telegram
tg.MainButton.setText("Закрыть").show();
tg.MainButton.onClick(() => {
    tg.showPopup({
        title: "Подтверждение",
        message: "Вы уверены, что хотите закрыть приложение?",
        buttons: [
            {id: "close", type: "destructive", text: "Да, закрыть"},
            {type: "default", text: "Отмена"}
        ]
    }, (buttonId) => {
        if (buttonId === "close") tg.close();
    });
});

// Добавляем стили для уведомлений
const style = document.createElement('style');
style.textContent = `
    .notification {
        background: var(--tg-theme-secondary-bg-color);
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        animation: fadeIn 0.3s ease;
    }
    .confirmation {
        background: var(--tg-theme-bg-color);
        border: 1px solid var(--tg-theme-button-color);
        padding: 10px;
        border-radius: 10px;
        margin-top: 10px;
        text-align: center;
    }
    pre {
        background: var(--tg-theme-bg-color);
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
