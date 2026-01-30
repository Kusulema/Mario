import request from 'supertest';
import { Application } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { SocketService } from '../src/services/socketService';
import http from 'http';

// Mock Socket.io, SocketService, and chatRoutes at the top level
// This ensures that when src/server is imported, these modules are already mocked.
jest.mock('socket.io', () => ({
  Server: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    engine: { clientsCount: 0 },
  })),
}));
jest.mock('../src/services/socketService', () => ({
    SocketService: jest.fn().mockImplementation(() => ({
        initialize: jest.fn(),
    }))
}));
jest.mock('../src/routes/chatRoutes');

// Declare a variable to hold the createApp function
let createAppFn: typeof import('../src/server')['createApp'];

describe('server.ts - Express App Configuration', () => {
  let app: Application;
  let server: http.Server;
  let io: SocketIOServer;
  let socketService: SocketService;

  beforeAll(async () => {
    // Dynamically import createApp *after* all mocks have been set up
    const serverModule = await import('../src/server');
    createAppFn = serverModule.createApp;
  });

  beforeEach(() => {
    // Reset mocks before creating new app instances for each test
    jest.clearAllMocks();

    // Create fresh instances for each test
    const appInstances = createAppFn();
    app = appInstances.app;
    server = appInstances.server;
    io = appInstances.io;
    socketService = appInstances.socketService;
  });

  afterEach(async () => {
    // Ensure the server is closed after each test
    // This is important for preventing open handles and timeouts
    await server.close();
  });

  it('should serve static files from the public directory', async () => {
    const response = await request(app).get('/index.html');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  it('should have a /health endpoint that returns status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('should create and initialize SocketService', () => {
    // Expect SocketIOServer to have been called when createApp was called
    expect(SocketIOServer).toHaveBeenCalledTimes(1);
    // Expect SocketService constructor to have been called with the mocked io instance
    expect(SocketService).toHaveBeenCalledWith(io);
    // Expect initialize to have been called on the socketService instance
    expect(socketService.initialize).toHaveBeenCalledTimes(1);
  });
});