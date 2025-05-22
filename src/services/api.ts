import axios from 'axios';

const API_URL = 'https://your-api-url.com';

export const fetchProducts = async (search: string) => {
  const response = await axios.get(`${API_URL}/products`, {
    params: {search},
  });
  return response.data;
};
