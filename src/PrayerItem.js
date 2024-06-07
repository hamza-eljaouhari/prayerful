import React, { useState } from 'react';

const PrayerItem = ({
  prayer,
  backgrounds,
  expanded,
  dropdownOpen,
  toggleFullText,
  toggleDropdown,
  handleBackgroundChange,
  downloadPoster
}) => {
  const [background, setBackground] = useState(backgrounds[0]);

  const handleChange = (e) => {
    setBackground(e.target.value);
    handleBackgroundChange(e.target.value);
  };

  const getPrayerExcerpt = (text) => {
    if (!text) return ""; // Handle undefined or empty text
    const lines = text.split('\n');
    return lines.slice(0, 3).join('\n');
  };

  return (
    <div className="mb-4 p-4 border rounded-md">
      <p className="block mb-2">
        {expanded ? prayer.text : getPrayerExcerpt(prayer.text)}
      </p>
      <button
        onClick={toggleFullText}
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
      >
        {expanded ? 'Show Less' : 'Show More'}
      </button>
      <audio key={prayer.audioUrl} controls className="w-full mt-2">
        <source src={prayer.audioUrl} type="audio/mp3" />
    </audio>

      <div className="mt-4">
        <label className="block text-gray-700">Select Background:</label>
        <select
          value={background}
          onChange={handleChange}
          className="block w-full mt-1 p-2 border rounded-md"
        >
          {backgrounds.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div>
      <div className="relative inline-block text-left mt-2">
        <div>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            id="options-menu"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={toggleDropdown}
          >
            Export
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v1m0 8v1m0 8v1m-7-9h1m8 0h1m-8 8h1m0-8h1m-8-4h1m8 0h1m-8 0h1m-8 4h1m8 0h1m0 8h1m-8 0h1"
              />
            </svg>
          </button>
        </div>
        {dropdownOpen && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              <button
                onClick={() => downloadPoster('png', background, prayer.text)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Download Poster (PNG)
              </button>
              <button
                onClick={() => downloadPoster('jpg', background, prayer.text)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Download Poster (JPG)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerItem;
