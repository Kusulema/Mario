import { chatController } from '../src/controllers/chatController';
import { chatModel } from '../src/models/chatMessage';
import { Request, Response } from 'express';

// Mock the chatModel to control its behavior during tests
jest.mock('../src/models/chatMessage', () => ({
  chatModel: {
    getAll: jest.fn(),
  },
}));

describe('chatController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonSpy: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    jsonSpy = jest.fn();
    mockResponse = {
      json: jsonSpy,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all messages when getMessages is called', () => {
    const mockMessages = [{ id: 1, author: 'test', text: 'hello', timestamp: Date.now() }];
    (chatModel.getAll as jest.Mock).mockReturnValue(mockMessages);

    chatController.getMessages(mockRequest as Request, mockResponse as Response);

    expect(chatModel.getAll).toHaveBeenCalledTimes(1);
    expect(jsonSpy).toHaveBeenCalledWith({ messages: mockMessages });
  });
});