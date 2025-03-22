const API_BASE_URL = 'https://your-backend.vercel.app/api';

export const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/endpoint`);
  return response.json();
};