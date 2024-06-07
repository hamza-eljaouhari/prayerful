import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './App.css';
import LanguageSelector from './LanguageSelector';
import TopicSelector from './TopicSelector';
import WriterSelector from './WriterSelector';
import PrayerList from './PrayerList';

const languages = {
  "english": "English",
  "french": "French",
  "arabic": "Arabic"
};

const backgrounds = [
  "sea.jpg",
  "wall.jpg",
  "fogs.jpg",
  "moutain.jpg",
  "sparkle.jpg"
];

function App() {
  const [language, setLanguage] = useState("english");
  const [topics, setTopics] = useState([]);
  const [writers, setWriters] = useState([]);
  const [topic, setTopic] = useState("");
  const [writer, setWriter] = useState("");
  const [prayer, setPrayer] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [textUrl, setTextUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [prayers, setPrayers] = useState([]);
  const [filterLanguage, setFilterLanguage] = useState("");
  const [expandedPrayers, setExpandedPrayers] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [backgroundsPerPrayer, setBackgroundsPerPrayer] = useState({});
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchTopics();
    fetchWriters();
    fetchPrayers();
  }, [language]);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('https://freepdflibrary.com/topics', { params: { language } });
      setTopics(response.data);
      setTopic(response.data[0]);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchWriters = async () => {
    try {
      const response = await axios.get('https://freepdflibrary.com/writers', { params: { language } });
      setWriters(response.data);
      setWriter(response.data[0]);
    } catch (error) {
      console.error('Error fetching writers:', error);
    }
  };

  const fetchPrayers = async () => {
    try {
      const response = await axios.get('https://freepdflibrary.com/list-prayers');
      setPrayers(response.data.prayers);
    } catch (error) {
      console.error('Error fetching prayers:', error);
    }
  };

  const generatePrayer = async () => {
    setLoading(true);
    setPrayer("");
    setAudioUrl("");
    setTextUrl("");

    try {
      const response = await axios.post('https://freepdflibrary.com/generate-prayer', { topic, writer, language });
      setPrayer(response.data.prayer);
      setAudioUrl(response.data.audioUrl);
      setTextUrl(response.data.textUrl);
      fetchPrayers(); // Refresh the list after generating a new prayer
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generatePoster = (selectedBackground, selectedPrayer) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = `${process.env.PUBLIC_URL}/backgrounds/${selectedBackground}`;

    img.onload = () => {
      console.log('Image loaded successfully');
      const { width: imgWidth, height: imgHeight } = img;
      canvas.width = imgWidth;
      canvas.height = imgHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

      // Add light black overlay with 5% opacity
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 4;

      // Calculate the font size based on image dimensions
      const fontSize = Math.min(canvas.width, canvas.height) * 0.05; // Adjust the factor as needed
      ctx.font = `${fontSize}px Ubuntu`;

      // Calculate max width for text
      const maxWidth = canvas.width * 0.6; // 40% of the canvas width is free

      // Split text into lines
      const lines = splitText(ctx, selectedPrayer, maxWidth);

      // Calculate the starting Y position to center the text vertically
      const lineHeight = fontSize * 1.2; // Adjust based on font size
      const textHeight = lines.length * lineHeight;
      let y = (canvas.height - textHeight) / 2;

      // Draw each line of text
      lines.forEach(line => {
        ctx.fillText(line, canvas.width / 2, y);
        y += lineHeight;
      });
    };

    img.onerror = () => {
      console.error('Error loading image');
    };
  };

  const splitText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const downloadPoster = (format, selectedBackground, selectedPrayer) => {
    generatePoster(selectedBackground, selectedPrayer);
    const canvas = canvasRef.current;
    setTimeout(() => {
      canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `poster.${format}`;
        link.click();
      }, `image/${format}`);
    }, 1000); // Delay to ensure the image is drawn
  };

  const downloadPDF = (text, filename) => {
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    doc.save(`${filename}.pdf`);
  };

  const toggleFullText = (index) => {
    setExpandedPrayers(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const handleBackgroundChange = (index, value) => {
    setBackgroundsPerPrayer(prevState => ({
      ...prevState,
      [index]: value
    }));
  };

  const filteredPrayers = filterLanguage
    ? prayers.filter(prayer => prayer.textUrl.toLowerCase().includes(filterLanguage.toLowerCase()))
    : prayers;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-20">
          <h1 className="text-2xl font-bold mb-4">Prayer Generator</h1>
          <LanguageSelector languages={languages} language={language} setLanguage={setLanguage} />
          <TopicSelector topics={topics} topic={topic} setTopic={setTopic} />
          <WriterSelector writers={writers} writer={writer} setWriter={setWriter} />
          <button
            onClick={generatePrayer}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Prayer'}
          </button>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          {prayer && (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2">Prayer:</h2>
              <p className="mb-4">{prayer}</p>
              <div className="mb-4 flex">
                <button
                  onClick={() => downloadPDF(prayer, `prayer-${topic}-${language}`)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                >
                  Download Prayer as PDF
                </button>
                <div className="relative inline-block text-left ml-2">
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                      id="options-menu"
                      aria-expanded="true"
                      aria-haspopup="true"
                      onClick={() => toggleDropdown(-1)}
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
                  {dropdownOpen[-1] && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <div className="py-1" role="none">
                        <button
                          onClick={() => downloadPoster('png', backgroundsPerPrayer[-1] || backgrounds[0], prayer)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                        >
                          Download Poster (PNG)
                        </button>
                        <button
                          onClick={() => downloadPoster('jpg', backgroundsPerPrayer[-1] || backgrounds[0], prayer)}
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
              <div className="mb-4">
                {audioUrl && (
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/mp3" />
                  </audio>
                )}
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Filter by Language:</label>
            <div className="flex space-x-2">
              {Object.keys(languages).map((lang) => (
                <button
                  key={lang}
                  className={`px-2 py-1 rounded-full text-white text-sm ${filterLanguage === lang ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-400`}
                  onClick={() => setFilterLanguage(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <PrayerList
            prayers={filteredPrayers}
            backgrounds={backgrounds}
            expandedPrayers={expandedPrayers}
            dropdownOpen={dropdownOpen}
            toggleFullText={toggleFullText}
            toggleDropdown={toggleDropdown}
            handleBackgroundChange={handleBackgroundChange}
            downloadPoster={downloadPoster}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
