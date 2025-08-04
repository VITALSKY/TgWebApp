// Инициализация WebApp
const tg = window.Telegram.WebApp;
const sendBtn = document.getElementById('send-btn');

// Проверяем, загрузился ли Telegram WebApp API
if (!tg || !tg.sendData) {
    console.error("Telegram WebApp API не загружен!");
    sendBtn.textContent = "Ошибка загрузки Telegram API";
    sendBtn.style.backgroundColor = "red";
} else {
    tg.expand(); // Развернуть на весь экран
    
    // Обработчик кнопки (с проверкой на существование)
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const user = tg.initDataUnsafe?.user || {};
            
            // Создаём объект данных
            const data = {
                action: "button_click",
                user_id: user.id || "anonymous",
                time: new Date().toLocaleTimeString()
            };

            // Визуальный feedback
            sendBtn.disabled = true;
            sendBtn.textContent = "Отправка...";
            
            try {
                tg.sendData(JSON.stringify(data));
                showAlert("✅ Данные отправлены!");
                
                // Автозакрытие через 1.5 сек
                setTimeout(() => tg.close(), 1500);
            } catch (e) {
                showAlert("❌ Ошибка отправки: " + e.message);
                sendBtn.disabled = false;
                sendBtn.textContent = "Попробовать снова";
            }
        });
    } else {
        console.error("Элемент send-btn не найден!");
    }
}

// Функция показа уведомлений
function showAlert(message) {
    const alert = document.createElement('div');
    alert.style = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: var(--tg-theme-button-color);
        color: var(--tg-theme-button-text-color);
        border-radius: 25px;
        z-index: 1000;
        animation: fadeIn 0.3s;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = "fadeOut 0.3s";
        setTimeout(() => alert.remove(), 300);
    }, 2000);
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    #send-btn:active {
        transform: scale(0.95);
    }
`;
document.head.appendChild(style);
