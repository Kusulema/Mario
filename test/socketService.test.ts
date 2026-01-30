import { Server as SocketIOServer } from 'socket.io';
import { SocketService } from '../src/services/socketService';
import { chatModel } from '../src/models/chatMessage';
import type { Socket } from 'socket.io-client';

// Mock chatModel
jest.mock('../src/models/chatMessage', () => ({
  chatModel: {
    getAll: jest.fn(),
    add: jest.fn(),
  },
}));

describe('SocketService', () => {
  let io: SocketIOServer;
  let socketService: SocketService;
interface MockSocket {
    id: string;
    emit: jest.Mock;
    on: jest.Mock;
    broadcast: {
        emit: jest.Mock;
    };
}
  let mockSocket: MockSocket;
  const MOCK_TIMESTAMP = 1678886400000; // A fixed timestamp

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.setSystemTime(MOCK_TIMESTAMP);
    const mockMessages = [{ id: 1, author: 'test', text: 'hello', timestamp: MOCK_TIMESTAMP }];
    (chatModel.getAll as jest.Mock).mockReturnValue(mockMessages);

    socketService = new SocketService(io);
    socketService.initialize(); // Call initialize to set up event listeners

    mockSocket = {
      id: 'someSocketId',
      emit: jest.fn(),
      on: jest.fn(),
      broadcast: {
        emit: jest.fn(),
      },
    };

    // Simulate a connection by calling the connection handler
    (io.on as jest.Mock).mock.calls[0][1](mockSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set up a connection listener', () => {
    expect(io.on).toHaveBeenCalledWith('connection', expect.any(Function));
  });

  it('should emit chat:init with all messages on connection', () => {
    const mockMessages = [{ id: 1, author: 'test', text: 'hello', timestamp: Date.now() }];
    (chatModel.getAll as jest.Mock).mockReturnValue(mockMessages);



    expect(chatModel.getAll).toHaveBeenCalledTimes(1);
    expect(mockSocket.emit).toHaveBeenCalledWith('chat:init', mockMessages);
  });

  it('should broadcast users:count on connection and disconnect', () => {
    // Connection is already simulated in beforeEach
    expect(io.emit).toHaveBeenCalledWith('users:count', io.engine.clientsCount);

    // Simulate disconnect
    const disconnectHandler = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === 'disconnect')[1];
    disconnectHandler();
    expect(io.emit).toHaveBeenCalledWith('users:count', io.engine.clientsCount);
  });

  it('should handle chat:send event and broadcast new message', () => {
    const messagePayload = { author: 'sender', text: 'new message' };
    const newMessage = { id: 2, ...messagePayload, timestamp: Date.now() };
    (chatModel.add as jest.Mock).mockReturnValue(newMessage);

    const sendHandler = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === 'chat:send')[1];
    const callback = jest.fn();
    sendHandler(messagePayload, callback);

    expect(chatModel.add).toHaveBeenCalledWith(messagePayload.author, messagePayload.text);
    expect(io.emit).toHaveBeenCalledWith('chat:new', newMessage);
    expect(callback).toHaveBeenCalledWith(); // Expect no error
  });

  it('should handle chat:send event errors', () => {
    const messagePayload = { author: 'sender', text: '' }; // Empty text will cause an error
    const errorMessage = 'Текст сообщения пуст';
    (chatModel.add as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const sendHandler = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === 'chat:send')[1];
    const callback = jest.fn();
    sendHandler(messagePayload, callback);

    expect(chatModel.add).toHaveBeenCalledWith(messagePayload.author, messagePayload.text);
    expect(callback).toHaveBeenCalledWith(errorMessage);
  });

  it('should broadcast chat:typing_broadcast when chat:typing is received', () => {
    const typingAuthor = 'TypingUser';
    const typingHandler = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === 'chat:typing')[1];
    typingHandler(typingAuthor);

    expect(mockSocket.broadcast.emit).toHaveBeenCalledWith('chat:typing_broadcast', typingAuthor);
  });
});