import { ScoreListData } from '../../core/interfaces/score-list.interface';

export const fetchScoreList = async (): Promise<ScoreListData> => {
  try {
    const rawResponse = await fetch('http://localhost:3000/score', {
      method: 'GET',
    });

    const response = await rawResponse.json();
    if (!rawResponse.ok) {
      throw response;
    }
    return response;
  } catch (error) {
    return null;
  }
};
