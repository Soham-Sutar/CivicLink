import { Department } from '../types';

/**
 * Mocks an AI call to suggest a category.
 * This is a stable, mock implementation that does not require an API key.
 *
 * @param _base64Image A base64 data URL string of the image.
 * @param _description The user's description of the issue.
 * @returns A promise that resolves to a mock suggested Department category.
 */
export const suggestCategory = async (_base64Image: string, _description: string): Promise<string> => {
  console.log("Using mock AI service for category suggestion...");
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // In a real scenario, this would involve a call to a generative AI model.
  // For this stable mock, we'll return a predictable category.
  return Department.POTHOLES;
};
