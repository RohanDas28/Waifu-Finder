import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [waifuData, setWaifuData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWaifu = (apiUrl) => {
    setLoading(true);

    axios.get(apiUrl)
      .then(response => {
        setWaifuData(response.data);
      })
      .catch(error => {
        console.error('Error fetching waifu:', error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-8">Show Me My Waifu</h1>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => fetchWaifu('https://api.waifu.pics/sfw/waifu')}
      >
        Fetch SFW Waifu
      </button>
      {loading && <p>Loading image...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {waifuData && !loading && (
        <img
          className="mt-4 max-w-xl max-h-96"
          src={waifuData.url}
          alt="Waifu"
        />
      )}

      <button
        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => fetchWaifu('https://api.waifu.pics/nsfw/waifu')}
      >
        Fetch NSFW Waifu
      </button>
    </div>
  );
}

export default App;
