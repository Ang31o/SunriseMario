import { ScoreSaveData } from '../../core/interfaces/score-save.interface';

export const saveScore = async (
  name: string,
  score: number
): Promise<ScoreSaveData> => {
  try {
    const rawResponse = await fetch('http://localhost:3000/score', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        score,
      }),
    });

    const response = await rawResponse.json();
    if (!rawResponse.ok) {
      throw response.message;
    }
    return response;
  } catch (error) {
    return { success: false, message: error };
  }
};
