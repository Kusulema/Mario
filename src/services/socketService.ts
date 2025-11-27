import { Server as SocketServer, Socket } from "socket.io";
import { ChatMessage, chatModel } from "../models/chatMessage";

// Сервис для настройки Socket.io и обработки событий клиентов
export class SocketService {
    constructor(private readonly io: SocketServer) { }

    /**
     * Рассылает всем подключенным клиентам текущее количество пользователей.
     * Использует io.engine.clientsCount для получения числа сокетов.
     */
    private broadcastUsersCount(): void {
        // io.engine.clientsCount возвращает количество подключенных сокетов
        this.io.emit("users:count", this.io.engine.clientsCount);
    }

    // Подписываемся на события подключения и настраиваем слушатели
    public initialize(): void {
        this.io.on("connection", (socket: Socket) => {
            // Сообщаем в логи, кто подключился (по id сокета)
            console.log(`Игрок подключился: ${socket.id}`);

            // Отдаем пользователю текущую историю сообщений
            socket.emit("chat:init", chatModel.getAll());

            // --- НОВАЯ ФИЧА: Обновляем счетчик при подключении ---
            this.broadcastUsersCount();
            // -----------------------------------------------------

            // Навешиваем обработчик отправки сообщений
            this.handleSendMessage(socket);

            // --- НОВАЯ ФИЧА: Индикатор набора текста ---
            socket.on("chat:typing", (author: string) => {
                // Рассылаем всем, КРОМЕ отправителя (используем broadcast)
                socket.broadcast.emit("chat:typing_broadcast", author);
            });
            // -------------------------------------------

            // При отключении
            socket.on("disconnect", () => {
                console.log(`Игрок отключился: ${socket.id}`);

                // --- НОВАЯ ФИЧА: Обновляем счетчик при отключении ---
                this.broadcastUsersCount();
                // -----------------------------------------------------
            });
        });
    }

    // Обработка пользовательского события отправки нового сообщения
    private handleSendMessage(socket: Socket): void {
        socket.on("chat:send", 
            (payload: { author: string; text: string }, callback?: (err?: string) => void) => {
            try {
                // Сохраняем сообщение через модель; она же валидирует текст
                const message: ChatMessage = chatModel.add(payload.author, payload.text);

                // Рассылаем всем подключенным клиентам
                this.io.emit("chat:new", message);

                // Подтверждаем отправителю успех (можно обновить UI)
                if (callback) {
                    callback();
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : "Не удалось отправить сообщение";
                
                // Отдаем ошибку отправителю, чтобы показать подсказку на клиенте
                if (callback) {
                    callback(message);
                } else {
                    socket.emit("chat:error", message);
                }
            }
        });
    }
}