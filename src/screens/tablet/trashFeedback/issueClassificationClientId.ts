import { createFeedbackDetection } from '@/services';

export const issueClassificationClientId = async (): Promise<string> => {
  const response = await createFeedbackDetection();

  if (!response.success || !response.data.clientId) {
    throw new Error(response.message);
  }

  return response.data.clientId;
};
