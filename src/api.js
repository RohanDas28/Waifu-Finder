// api.js
import axios from 'axios';

const fetchRandomImages = async (options = {}) => {
  try {
    // Example API URL for getting random images
    const apiUrl = 'https://api.nekosapi.com/v3/images/random';

    // Constructing query parameters based on options
    const queryParams = new URLSearchParams(options);
    const fullApiUrl = `${apiUrl}?${queryParams.toString()}`;

    const response = await axios.get(fullApiUrl);
    return response.data; // Assuming the response contains the list of random images
  } catch (error) {
    console.error('Error fetching random images:', error);
    throw error;
  }
};

export { fetchRandomImages };
