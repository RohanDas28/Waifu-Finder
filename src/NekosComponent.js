// NekosComponent.js
import React, { useState } from 'react';
import { fetchRandomImages } from './api';

function NekosComponent() {
  // State variables
  const [currentRating, setCurrentRating] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generateMultiple, setGenerateMultiple] = useState(false);
  const [numberOfImages, setNumberOfImages] = useState(1);

  // Ratings array
  const lowercaseRatings = ['Safe', 'Suggestive', 'Borderline', 'Explicit'].map((rating) => rating.toLowerCase());

  // Fetch new images based on rating and number
  const fetchNewImages = async (rating, number) => {
    setLoading(true);

    try {
      const response = await fetchRandomImages({ rating, limit: number });
      setCurrentImages(response.items);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle rating button click
  const handleRatingButtonClick = (rating) => {
    setCurrentRating(rating);
    if (generateMultiple) {
      fetchNewImages(rating, numberOfImages);
    } else {
      fetchNewImages(rating, 1);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setGenerateMultiple(!generateMultiple);
  };

  // Handle number of images change
  const handleNumberOfImagesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfImages(value);
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white min-h-screen flex flex-col items-center py-12 overflow-hidden">
      {/* Header */}
      <h1 className="text-3xl md:text-5xl mb-4 md:mb-8 font-bold tracking-wide">Waifu Images Generator</h1>
      <p className="text-lg md:text-xl mb-6 text-gray-300">
        Unleash the power to create enchanting and unique waifu images with just a click. Explore a world of infinite possibilities in every pixel.
      </p>

      {/* Rating buttons */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:space-x-4">
        {/* Checkbox for generating multiple images */}
        <label className="flex items-center space-x-2 mb-2 md:mb-0">
          <input
            type="checkbox"
            checked={generateMultiple}
            onChange={handleCheckboxChange}
            className="form-checkbox text-yellow-500"
          />
          <span className="text-gray-300">Multiple Images</span>
        </label>

        {/* Select for number of images */}
        {generateMultiple && (
          <select
            value={numberOfImages}
            onChange={handleNumberOfImagesChange}
            className="mb-2 md:mb-0 px-2 py-1 border rounded text-black"
          >
            {[...Array(10).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
        )}

        {lowercaseRatings.map((rating) => (
          <button
            key={rating}
            className={`px-6 py-3 rounded-full transition-all duration-300 transform m-1 ${rating === 'explicit'
              ? 'bg-red-500 shadow-lg hover:bg-red-700 hover:scale-105'
              : rating === currentRating
                ? 'bg-yellow-500 shadow-lg scale-105'
                : 'bg-gray-600 hover:bg-gray-700 hover:scale-105'
              }`}
            onClick={() => handleRatingButtonClick(rating)}
          >
            {rating}
          </button>
        ))}
      </div>

      {/* Image display */}
      <div className="bg-white bg-opacity-20 p-4 md:p-8 rounded-xl shadow-xl w-full md:w-[90%] flex flex-wrap justify-center">
        {loading && (
          <div className="flex items-center">
            <div className="mr-4 animate-spin">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 6V6m0 6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <p className="text-gray-400">Loading image...</p>
          </div>
        )}

        {!loading && currentImages.length === 0 && (
          <p className="text-gray-400 text-center md:text-left">
            Click on the buttons to generate an amazing image.
          </p>
        )}

        {!loading &&
          currentImages.map((img, index) => (
            <div key={index} className="mb-2 md:mb-4 mx-1 md:mx-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
              <img
                className="max-w-full max-h-full object-cover rounded-lg"
                src={img.sample_url}
                alt={`Random ${index + 1}`}
              />
            </div>
          ))}
      </div>
      <footer className="mt-auto py-4 text-2xl text-center text-gray-400">
        Coded with <span role="img" aria-label="Heart">❤️</span> by <a href="https://rohandas28.github.io" target="_blank" rel="noopener noreferrer" className="text-yellow-500 font-semibold">&lt;Rohan Das/&gt;</a>
      </footer>
    </div>
  );
}

export default NekosComponent;
