import request from 'supertest';
import express, { Application } from 'express';
import chatRoutes from '../src/routes/chatRoutes';
import { chatController } from '../src/controllers/chatController';

// Mock the chatController to control its behavior during tests
jest.mock('../src/controllers/chatController', () => ({
  chatController: {
    getMessages: jest.fn((req, res) => {
      res.json({ messages: [] });
    }),
  },
}));

describe('chatRoutes', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(chatRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/messages should call chatController.getMessages', async () => {
    const mockMessages = [{ id: 1, author: 'test', text: 'hello', timestamp: Date.now() }];
    (chatController.getMessages as jest.Mock).mockImplementationOnce((req, res) => {
      res.json({ messages: mockMessages });
    });

    const response = await request(app).get('/api/messages');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ messages: mockMessages });
    expect(chatController.getMessages).toHaveBeenCalledTimes(1);
  });
});