// Инициализация WebApp
const tg = window.Telegram.WebApp;

// Развернуть приложение на весь экран
tg.expand();

// Получаем данные пользователя
const user = tg.initDataUnsafe.user;
const greeting = document.getElementById('greeting');

if (user) {
    greeting.textContent = `Привет, ${user.first_name}! 👋`;
} else {
    greeting.textContent = "Привет, аноним! 👋";
}

// Обработка кнопки
document.getElementById('send-btn').addEventListener('click', () => {
    // Отправляем данные боту
    tg.sendData(JSON.stringify({
        action: "button_click",
        user_id: user?.id || "anonymous"
    }));
    // Закрываем Mini App
    tg.close();
});

// Показываем кнопку "Готово" в интерфейсе Telegram
tg.MainButton.setText("Закрыть").show();
tg.MainButton.onClick(() => tg.close());
