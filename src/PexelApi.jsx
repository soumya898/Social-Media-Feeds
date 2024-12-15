const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export const PexelApi = {
  async searchPhotos(query, options = {}) {
    const { per_page = 10, page = 1 } = options;
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page}&page=${page}`, 
      {
        headers: {
          Authorization: API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching data from Pexels: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  },

  async getPhoto(id) {
    const response = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
      headers: {
        Authorization: API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching photo from Pexels: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  },
};
