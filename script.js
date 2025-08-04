// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Проверяем наличие Telegram WebApp API
    if (!window.Telegram || !window.Telegram.WebApp) {
        console.error('Telegram WebApp API not found!');
        showError('Telegram API не загружен');
        return;
    }
    
    const tg = window.Telegram.WebApp;
    const sendBtn = document.getElementById('send-btn');
    const greeting = document.getElementById('greeting');
    const responseDiv = document.getElementById('response') || document.createElement('div');
    if (!document.getElementById('response')) {
        document.body.appendChild(responseDiv);
        responseDiv.id = 'response';
    }
    
    if (!sendBtn || !greeting) {
        console.error('Essential elements not found!');
        return;
    }
    
    console.log('Telegram WebApp initialized:', tg);
    
    // Включаем полноэкранный режим
    tg.expand();
    
    // Устанавливаем приветствие с аватаркой
    const user = tg.initDataUnsafe?.user || {};
    if (user.first_name) {
        greeting.innerHTML = `Привет, ${user.first_name}! 👋`;
        if (user.photo_url) {
            greeting.innerHTML += `<br><img src="${user.photo_url}" 
                style="width: 50px; height: 50px; border-radius: 50%; margin-top: 10px; object-fit: cover;">`;
        }
    } else {
        greeting.textContent = "Привет, аноним! 👋";
    }
    
    // Настройка главной кнопки Telegram
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
    
    // Обработчик кнопки отправки
    sendBtn.addEventListener('click', function() {
        console.log('Send button clicked');
        
        // Анимация нажатия
        sendBtn.style.transform = 'scale(0.95)';
        sendBtn.style.opacity = '0.8';
        setTimeout(() => {
            sendBtn.style.transform = '';
            sendBtn.style.opacity = '';
        }, 200);
        
        // Блокируем кнопку на время обработки
        sendBtn.disabled = true;
        sendBtn.textContent = 'Отправка...';
        
        // Собираем данные
        const data = {
            action: 'button_click',
            user_id: user.id || 'anonymous',
            first_name: user.first_name || 'unknown',
            timestamp: new Date().toISOString(),
            platform: tg.platform
        };
        
        console.log('Prepared data:', data);
        
        // Показываем уведомление о начале отправки
        responseDiv.innerHTML = `
            <div class="notification">
                <p>Отправляем данные...</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
        
        try {
            // Отправляем данные
            tg.sendData(JSON.stringify(data));
            console.log('Data sent successfully');
            
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
            setTimeout(() => tg.close(), 2000);
            
        } catch (error) {
            console.error('Error sending data:', error);
            
            // Показываем ошибку
            showAlert(`❌ Ошибка: ${error.message}`, 'error');
            
            // Восстанавливаем кнопку
            sendBtn.disabled = false;
            sendBtn.textContent = 'Попробовать снова';
        }
    });
    
    // Функция показа уведомлений
    function showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = 'telegram-alert';
        
        const styles = {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: '25px',
            zIndex: '1000',
            animation: 'fadeIn 0.3s',
            backgroundColor: type === 'error' ? '#ff4444' : 
                          type === 'success' ? '#00C851' : '#33b5e5',
            color: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        };
        
        Object.assign(alert.style, styles);
        alert.textContent = message;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'fadeOut 0.3s';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }
    
    // Функция показа ошибки
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'telegram-error';
        errorDiv.style = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff4444;
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 1000;
        `;
        errorDiv.textContent = message;
        document.body.prepend(errorDiv);
    }
    
    // Добавляем стили
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
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        #send-btn:active {
            transform: scale(0.95);
        }
        .telegram-alert {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
});
