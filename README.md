# 💬 Simple TypeScript Chat (Express + Socket.io + MVC)

A minimalist real-time chat application built using Node.js, Express, Socket.io for real-time communication, and structured following the Model-View-Controller (MVC) pattern with TypeScript. Messages are stored temporarily in memory (RAM).

## 🚀 Features

* Real-time messaging using WebSockets (Socket.io).
* Message history loaded via REST API on connection.
* Client-side message formatting and connection status display.
* Message sending via click or Ctrl/Cmd + Enter.
* In-memory storage for simplicity (messages are not persisted across restarts).

## ⚙️ Technologies and Libraries

This project relies on the following key technologies:

* **Node.js & TypeScript:** Core environment and language.
* **Express:** Minimalist web framework for the REST endpoint (`/api/messages`).
* **Socket.io:** Library for real-time, bidirectional, event-based communication.
* **ngrok:** Used for tunneling the local server to the public internet.
* **nodemon & ts-node:** Development utilities for live-reloading TypeScript.

## 📦 Getting Started

### Prerequisites

* Node.js (LTS recommended)
* npm (or yarn)
* An ngrok account and authentication token (for external tunneling)

### Installation

1.  Clone the repository:
    ```bash
    git clone [YOUR_REPO_URL]
    cd [PROJECT_FOLDER]
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration (ngrok Tunneling)

1.  Get your ngrok auth token from the [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken).
2.  **Add your token to the local ngrok configuration:**
    ```bash
    npx ngrok config add-authtoken YOUR_NGROK_TOKEN
    ```
    *Note: If you choose step 6 below (hiding the token), skip adding it to `package.json`.*

### Running the Project

| Command | Usage | Description |
| :--- | :--- | :--- |
| `npm run dev` | **Development Mode** | Runs the server using `ts-node` and `nodemon` for file watch and auto-restart. |
| `npm run build` | **Compilation** | Compiles TypeScript files (`src/`) into JavaScript (`dist/`). |
| `npm start` | **Production Mode** | Runs the compiled JavaScript from the `dist` folder. |
| `npm run tunnel` | **External Tunnel** | Runs the ngrok tunnel command to expose the local server (Port 3000) to the public internet. |

---

### 3. & 4. Вставка ключа `ngrok` и авторизация

**Сначала выполните авторизацию (пункт 4), так как это более безопасный метод для постоянного использования.**

#### A. Авторизация (рекомендуемый способ)

Выполните эту команду в консоли, заменив `ТОКЕН` на ваш ключ:

```bash
npx ngrok config add-authtoken ТОКЕН







# 💬 Простой TypeScript Чат (Express + Socket.io)

Минималистичное веб-приложение для чата в реальном времени, созданное с использованием Node.js, Express и Socket.io для двунаправленной связи. Архитектура проекта соответствует шаблону Модель-Представление-Контроллер (MVC) и написана на TypeScript.

## ✨ Основные Возможности

* **Обмен сообщениями в реальном времени** с использованием WebSockets (Socket.io).
* **Индикатор набора текста:** Пользователи видят, когда кто-то печатает.
* **Счетчик онлайн-пользователей:** Отображает количество активных подключений.
* История сообщений загружается при подключении через REST API.
* Сообщения временно хранятся в памяти сервера (RAM).

## ⚙️ Используемые Технологии

| Технология | Назначение |
| :--- | :--- |
| **Node.js & TypeScript** | Основная среда выполнения и язык. |
| **Express** | Веб-фреймворк для обработки статических файлов и REST API. |
| **Socket.io** | Библиотека для двустороннего обмена данными в реальном времени. |
| **ngrok** | Используется для создания публичного туннеля к локальному серверу. |
| **nodemon & ts-node** | Инструменты разработки для горячей перезагрузки TypeScript. |

## 🚀 Запуск Проекта

### Предварительные Требования

* Node.js (рекомендуется LTS)
* npm (или yarn)
* Аккаунт `ngrok` и авторизационный токен (для внешнего туннелирования)

### Установка

1.  Клонируйте репозиторий:
    ```bash
    git clone [АДРЕС_ВАШЕГО_РЕПОЗИТОРИЯ]
    cd [ПАПКА_ПРОЕКТА]
    ```
2.  Установите все зависимости:
    ```bash
    npm install
    ```
3.  **Авторизуйте ngrok (Обязательный шаг):**
    Используйте ваш токен, полученный на сайте `ngrok`, чтобы сохранить его локально.
    ```bash
    npx ngrok config add-authtoken ВАШ_ТОКЕН_ЗДЕСЬ
    ```

### Запуск в Режиме Разработки

Для одновременной работы сервера и туннеля вам понадобится два окна терминала.

#### 1. Запуск Сервера (Терминал 1)

Сервер запустится на порту `3000` и будет автоматически перезагружаться при изменении файлов в `src/`.

```bash
npm run dev