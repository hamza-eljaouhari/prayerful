import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './App.css';

const languages = {
    "english": "English",
    "french": "French",
    "arabic": "Arabic"
};

const backgrounds = [
    "background1.jpg",
    "background2.jpg",
    "background3.jpg"
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
    const [posterUrl, setPosterUrl] = useState("");
    const [gifUrl, setGifUrl] = useState("");
    const [background, setBackground] = useState(backgrounds[0]);
    const [loading, setLoading] = useState(false);
    const [prayers, setPrayers] = useState([]);
    const [filterLanguage, setFilterLanguage] = useState("");
    const [expandedPrayers, setExpandedPrayers] = useState({});

    useEffect(() => {
        fetchTopics();
        fetchWriters();
        fetchPrayers();
    }, [language]);

    const fetchTopics = async () => {
        try {
            const response = await axios.get('http://localhost:5000/topics', { params: { language } });
            setTopics(response.data);
            setTopic(response.data[0]);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const fetchWriters = async () => {
        try {
            const response = await axios.get('http://localhost:5000/writers', { params: { language } });
            setWriters(response.data);
            setWriter(response.data[0]);
        } catch (error) {
            console.error('Error fetching writers:', error);
        }
    };

    const fetchPrayers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/list-prayers');
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
        setPosterUrl("");
        setGifUrl("");

        try {
            const response = await axios.post('http://localhost:5000/generate-prayer', { topic, writer, language });
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

    const generatePoster = async (format) => {
        if (!prayer) return;

        try {
            const response = await axios.post('http://localhost:5000/generate-poster', { text: prayer, format, background });
            setPosterUrl(response.data.fileUrl);
        } catch (error) {
            console.error('Error generating poster:', error);
        }
    };

    const generateGif = async () => {
        if (!prayer) return;

        try {
            const response = await axios.post('http://localhost:5000/generate-gif', { text: prayer, background });
            setGifUrl(response.data.fileUrl);
        } catch (error) {
            console.error('Error generating GIF:', error);
        }
    };

    const downloadPDF = (text, filename) => {
        const doc = new jsPDF();
        doc.text(text, 10, 10);
        doc.save(`${filename}.pdf`);
    };

    const getPrayerExcerpt = (text) => {
        if (!text) return ""; // Handle undefined or empty text
        const lines = text.split('\n');
        return lines.slice(0, 3).join('\n');
    };

    const toggleFullText = (index) => {
        setExpandedPrayers(prevState => ({
            ...prevState,
            [index]: !prevState[index]
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
                    <div className="mb-4">
                        <label className="block text-gray-700">Select Language:</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="block w-full mt-1 p-2 border rounded-md"
                        >
                            {Object.keys(languages).map((lang) => (
                                <option key={lang} value={lang}>{languages[lang]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Select Topic:</label>
                        <select
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="block w-full mt-1 p-2 border rounded-md"
                        >
                            {topics.map((topic) => (
                                <option key={topic} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Select Writer:</label>
                        <select
                            value={writer}
                            onChange={(e) => setWriter(e.target.value)}
                            className="block w-full mt-1 p-2 border rounded-md"
                        >
                            {writers.map((writer) => (
                                <option key={writer} value={writer}>{writer}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Select Background:</label>
                        <select
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="block w-full mt-1 p-2 border rounded-md"
                        >
                            {backgrounds.map((bg) => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={generatePrayer}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Prayer'}
                    </button>
                    {prayer && (
                        <div className="mt-6">
                            <h2 className="text-lg font-bold mb-2">Prayer:</h2>
                            <p className="mb-4">{prayer}</p>
                            <div className="mb-4">
                                <button
                                    onClick={() => downloadPDF(prayer, `prayer-${topic}-${language}`)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                                >
                                    Download Prayer as PDF
                                </button>
                                <button
                                    onClick={() => generatePoster('png')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 ml-2"
                                >
                                    Generate Poster (PNG)
                                </button>
                                <button
                                    onClick={() => generatePoster('jpg')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 ml-2"
                                >
                                    Generate Poster (JPG)
                                </button>
                                <button
                                    onClick={generateGif}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 ml-2"
                                >
                                    Generate GIF
                                </button>
                            </div>
                            {posterUrl && (
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold mb-2">Poster:</h2>
                                    <img src={posterUrl} alt="Generated Poster" className="w-full" />
                                </div>
                            )}
                            {gifUrl && (
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold mb-2">GIF:</h2>
                                    <img src={gifUrl} alt="Generated GIF" className="w-full" />
                                </div>
                            )}
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
                        <select
                            value={filterLanguage}
                            onChange={(e) => setFilterLanguage(e.target.value)}
                            className="block w-full mt-1 p-2 border rounded-md"
                        >
                            <option value="">All</option>
                            {Object.keys(languages).map((lang) => (
                                <option key={lang} value={lang}>{languages[lang]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-lg font-bold mb-2">All Prayers:</h2>
                        {filteredPrayers.map((prayer, index) => (
                            <div key={index} className="mb-4 p-4 border rounded-md">
                                <p className="block mb-2">
                                    {expandedPrayers[index] ? prayer.text : getPrayerExcerpt(prayer.text)}
                                </p>
                                <button
                                    onClick={() => toggleFullText(index)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                                >
                                    {expandedPrayers[index] ? 'Show Less' : 'Show More'}
                                </button>
                                <audio controls className="w-full mt-2">
                                    <source src={prayer.audioUrl} type="audio/mp3" />
                                </audio>
                                <button
                                    onClick={() => downloadPDF(prayer.text, `prayer-${index + 1}-${language}`)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 mt-2"
                                >
                                    Download as PDF
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
