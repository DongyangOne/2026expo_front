/// <reference types="jest" />

import { createFeedbackDetection } from '@/services';

import { issueClassificationClientId } from './issueClassificationClientId';

jest.mock('@/services', () => ({
  createFeedbackDetection: jest.fn(),
}));

describe('issueClassificationClientId', (): void => {
  it('재시도용 clientId를 새로 발급한다', async (): Promise<void> => {
    jest.mocked(createFeedbackDetection).mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '',
      data: { clientId: 'new-client-id' },
    });

    await expect(issueClassificationClientId()).resolves.toBe('new-client-id');
  });
});
