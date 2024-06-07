import React from 'react';

const LanguageSelector = ({ languages, language, setLanguage }) => {
  const languageAbbreviations = {
    "english": "en",
    "french": "fr",
    "arabic": "ar"
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Select Language:</label>
      <div className="flex space-x-2">
        {Object.keys(languages).map((lang) => (
          <button
            key={lang}
            className={`px-2 py-1 rounded-full text-white text-sm ${language === lang ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-400`}
            onClick={() => setLanguage(lang)}
          >
            {languageAbbreviations[lang]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
