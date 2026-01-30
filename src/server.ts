import express, { Application } from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import chatRoutes from "./routes/chatRoutes";
import { SocketService } from "./services/socketService";

// Порт приложения; можно переопределить через переменную
const PORT = Number(process.env.PORT) || 3000;

export function createApp(
    httpServerInstance?: http.Server,
    socketIoServerInstance?: SocketIOServer
) {
    const app: Application = express();

    // Обработка CORS - если фронтенд будет открыт на другом домене
    app.use(cors());

    // Позволяем читать JSON из тела запросов (например, если захотим добавить POST API)
    app.use(express.json());

    // Восстанавливаем путь до статической папки; используем process.cwd()
    // чтобы путь был корректен и в dev (ts-node), и в прод-сборке (node dist/...).
    const publicDir = path.resolve(process.cwd(), "public");
    app.use(express.static(publicDir));

    // Подключаем REST-маршруты
    app.use(chatRoutes);

    // Простейший healthcheck для тестов
    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    const server = httpServerInstance || http.createServer(app);
    const io = socketIoServerInstance || new SocketIOServer(server, {
        cors: {
            origin: "*", // Разрешаем подключение с любого домена для теста
        },
    });

    const socketService = new SocketService(io);
    socketService.initialize();

    return { app, server, io, socketService };
}

export async function startServer(port: number = PORT) {
    const { app, server, io, socketService } = createApp(); // Create app instance
    return new Promise<void>((resolve) => {
        server.listen(port, () => {
            console.log(`Mario chat is running on http://localhost:${port}`);
            resolve();
        });
    });
}

// Запускаем сервер, только если этот файл не импортируется (т.е. запускается напрямую)
if (require.main === module) {
    startServer();
}
