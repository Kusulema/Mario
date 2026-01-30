import { ChatModel, ChatMessage } from '../src/models/chatMessage';

describe('ChatModel', () => {
  let chatModel: ChatModel;

  beforeEach(() => {
    chatModel = new ChatModel();
  });

  it('should return an empty array initially', () => {
    expect(chatModel.getAll()).toEqual([]);
  });

  it('should add a message and return it', () => {
    const message = chatModel.add('testAuthor', 'testText');
    expect(message).toHaveProperty('id');
    expect(message.author).toBe('testAuthor');
    expect(message.text).toBe('testText');
    expect(message).toHaveProperty('timestamp');
    expect(chatModel.getAll()).toEqual([message]);
  });

  it('should not add an empty message', () => {
    expect(() => chatModel.add('testAuthor', '')).toThrow('Текст сообщения пуст');
    expect(chatModel.getAll()).toEqual([]);
  });

  it('should trim author and text', () => {
    const message = chatModel.add('  testAuthor  ', '  testText  ');
    expect(message.author).toBe('testAuthor');
    expect(message.text).toBe('testText');
  });

  it('should use "Anonymous" if author is empty', () => {
    const message = chatModel.add('   ', 'testText');
    expect(message.author).toBe('Anonymous');
  });

  it('should limit the number of stored messages', () => {
    // Assuming maxMessages is 100 as per the code
    for (let i = 0; i < 105; i++) {
      chatModel.add(`author${i}`, `text${i}`);
    }
    expect(chatModel.getAll().length).toBe(100);
    expect(chatModel.getAll()[0].author).toBe('author5'); // The first 5 messages should be shifted out
  });
});