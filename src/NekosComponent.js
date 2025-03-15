import React, { useState } from "react";
import { fetchRandomImages } from "./api";

/**
 * NekosComponent - A React component that generates and displays anime-style images
 * with filtering by rating and options for multiple images
 */
function NekosComponent() {
  // State management
  const [currentRating, setCurrentRating] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generateMultiple, setGenerateMultiple] = useState(false);
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  // Available image rating categories
  const ratings = ["safe", "suggestive", "borderline", "explicit"];

  /**
   * Fetches new images from the API based on selected rating and quantity
   * @param {string} rating - The content rating to filter by
   * @param {number} number - Number of images to fetch
   */
  const fetchNewImages = async (rating, number) => {
    setLoading(true);
    setError(null);
    setCurrentRating(rating);

    try {
      const response = await fetchRandomImages({ rating, limit: number });
      setCurrentImages(response);
    } catch (err) {
      setError("Failed to fetch images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles rating button click and triggers image fetching
   * @param {string} rating - The selected rating category
   */
  const handleRatingButtonClick = (rating) => {
    fetchNewImages(rating, generateMultiple ? numberOfImages : 1);
  };

  /**
   * Formats RGB color array to CSS rgb format
   * @param {Array} colorArray - Array of RGB values [r, g, b]
   * @returns {string} - CSS rgb string
   */
  const formatRgb = (colorArray) => {
    if (!colorArray || colorArray.length !== 3) return "rgb(0, 0, 0)";
    return `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`;
  };

  /**
   * Opens the image in a new tab when clicked
   * @param {string} imageUrl - URL of the image to open
   */
  const handleImageClick = (imageUrl) => {
    if (!imageUrl) return;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.opener = null; // Security best practice
      newWindow.location.href = imageUrl;
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white min-h-screen flex flex-col items-center p-6 md:p-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 inline-block pb-2">
            Waifu Images Generator
          </span>
        </h1>
        <p className="text-lg text-gray-300">
          Generate and explore anime-style images with just a click.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Click on any image to view in full size
        </p>
      </div>

      {/* Controls Panel */}
      <div className="w-full max-w-3xl bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
        {/* Image Generation Options */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Multiple images toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={generateMultiple}
              onChange={() => setGenerateMultiple(!generateMultiple)}
              className="form-checkbox h-5 w-5 text-pink-500 rounded focus:ring-pink-500"
            />
            <span>Multiple Images</span>
          </label>

          {/* Image quantity selector (shown only when multiple images enabled) */}
          {generateMultiple && (
            <select
              value={numberOfImages}
              onChange={(e) => setNumberOfImages(Number(e.target.value))}
              className="px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
            >
              {[...Array(12).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1} image{num > 0 ? "s" : ""}
                </option>
              ))}
            </select>
          )}
          
          {/* Image details toggle */}
          <label className="flex items-center space-x-2 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={showDetails}
              onChange={() => setShowDetails(!showDetails)}
              className="form-checkbox h-5 w-5 text-pink-500 rounded focus:ring-pink-500"
            />
            <span>Show Image Details</span>
          </label>
        </div>

        {/* Rating selection buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ratings.map((rating) => (
            <button
              key={rating}
              className={`px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                rating === "explicit"
                  ? "bg-red-600 hover:bg-red-700"
                  : rating === currentRating
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transform scale-105"
                    : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => handleRatingButtonClick(rating)}
            >
              {rating.charAt(0).toUpperCase() + rating.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center space-x-3 my-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-pink-500"></div>
          <p className="text-pink-300">Generating images...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900 bg-opacity-50 text-white px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Image Gallery */}
      <div className="w-full max-w-6xl">
        {/* Empty state message */}
        {!loading && currentImages.length === 0 && !error && (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-10 text-center">
            <p className="text-gray-400">
              Select a rating to generate images
            </p>
          </div>
        )}

        {/* Image grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {currentImages.map((image, index) => (
            <div
              key={image.id || index}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105"
            >
              {/* Image container */}
              <div className="relative overflow-hidden group bg-gray-900 flex justify-center">
                <div 
                  className="cursor-pointer flex items-center justify-center w-full"
                  onClick={() => handleImageClick(image.url)}
                >
                  <img
                    src={image.url}
                    // Fixed ESLint warning: removed "image" from alt text
                    alt={`Anime #${index + 1}`}
                    className="max-w-full max-h-96 w-auto h-auto transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg text-sm">
                      Click to view full size
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image metadata */}
              <div className="p-4 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-purple-600 px-2 py-1 rounded text-xs uppercase font-bold">
                    {image.rating}
                  </span>
                </div>
                
                {/* Optional detailed information */}
                {showDetails && (
                  <>
                    {/* Tags display */}
                    {image.tags && image.tags.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {image.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex} 
                              className="bg-gray-700 px-2 py-1 rounded-md text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Color palette */}
                    {image.color_palette && (
                      <div className="mb-3">
                        <p className="text-gray-400 text-xs mb-1">Color Palette:</p>
                        <div className="flex overflow-x-auto gap-1 py-1">
                          {image.color_palette.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-6 h-6 rounded-full flex-shrink-0"
                              style={{ backgroundColor: formatRgb(color) }}
                              title={formatRgb(color)}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Source link */}
                    {image.source_url && (
                      <a 
                        href={image.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300 text-xs block mt-2"
                      >
                        Source Link
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center text-gray-400">
        <p>
          Coded with <span className="text-red-500">❤️</span> by{" "}
          <a
            href="https://rohandas28.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 font-medium"
          >
            &lt;Rohan Das/&gt;
          </a>
        </p>
      </footer>
    </div>
  );
}

export default NekosComponent;