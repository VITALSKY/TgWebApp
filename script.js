// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded'); // Отладочное сообщение
    
    // Проверяем наличие Telegram WebApp API
    if (!window.Telegram || !window.Telegram.WebApp) {
        console.error('Telegram WebApp API not found!');
        showError('Telegram API не загружен');
        return;
    }

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
    
    const tg = window.Telegram.WebApp;
    const sendBtn = document.getElementById('send-btn');
    
    if (!sendBtn) {
        console.error('Send button not found!');
        return;
    }
    
    console.log('Telegram WebApp initialized:', tg); // Отладочная информация
    
    // Включаем полноэкранный режим
    tg.expand();
    
    // Обработчик кнопки
    sendBtn.addEventListener('click', function() {
        console.log('Send button clicked'); // Отладочное сообщение
        
        // Блокируем кнопку на время обработки
        sendBtn.disabled = true;
        sendBtn.textContent = 'Отправка...';
        
        // Собираем данные
        const user = tg.initDataUnsafe?.user || {};
        const data = {
            action: 'button_click',
            user_id: user.id || 'anonymous',
            first_name: user.first_name || 'unknown',
            time: new Date().toISOString()
        };
        
        console.log('Prepared data:', data); // Отладочная информация
        
        try {
            // Показываем уведомление
            showAlert('⌛ Отправляем данные...', 'info');
            
            // Отправляем данные
            tg.sendData(JSON.stringify(data));
            
            console.log('Data sent successfully'); // Отладочное сообщение
            
            // Показываем подтверждение
            showAlert('✅ Данные успешно отправлены!', 'success');
            
            // Восстанавливаем кнопку
            setTimeout(() => {
                sendBtn.disabled = false;
                sendBtn.textContent = 'Отправить данные боту';
            }, 2000);
            
        } catch (error) {
            console.error('Error sending data:', error); // Отладочное сообщение
            
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
        
        // Стили в зависимости от типа
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
        
        // Применяем стили
        Object.assign(alert.style, styles);
        
        alert.textContent = message;
        document.body.appendChild(alert);
        
        // Автоматическое скрытие
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
        .telegram-alert {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
});
