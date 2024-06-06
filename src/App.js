import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './App.css';

const topics = [/* topics array */];
const writers = [/* writers array */];
const languages = {
    "english": "English",
    "french": "French",
    "arabic": "Arabic"
};

function App() {
    const [topic, setTopic] = useState(topics[0]);
    const [writer, setWriter] = useState(writers[0]);
    const [language, setLanguage] = useState("english");
    const [prayer, setPrayer] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [textUrl, setTextUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [prayers, setPrayers] = useState([]);
    const [filterLanguage, setFilterLanguage] = useState("");

    useEffect(() => {
        fetchPrayers();
    }, []);

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

    const downloadPDF = (text, filename) => {
        const doc = new jsPDF();
        doc.text(text, 10, 10);
        doc.save(`${filename}.pdf`);
    };

    const getPrayerExcerpt = (text) => {
        const lines = text.split('\n');
        return lines.slice(0, 2).join('\n');
    };

    const filteredPrayers = filterLanguage
        ? prayers.filter(prayer => prayer.language === filterLanguage)
        : prayers;

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-20">
                    <h1 className="text-2xl font-bold mb-4">Prayer Generator</h1>
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
                            <p className="mb-4">{getPrayerExcerpt(prayer)}</p>
                            <button
                                onClick={() => alert(prayer)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                            >
                                Show Full Prayer
                            </button>
                            <div className="mb-4">
                                <button
                                    onClick={() => downloadPDF(prayer, `prayer-${topic}-${language}`)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                                >
                                    Download Prayer as PDF
                                </button>
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
                                <p className="block mb-2">{getPrayerExcerpt(prayer.text)}</p>
                                <button
                                    onClick={() => alert(prayer.text)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                                >
                                    Show Full Prayer
                                </button>
                                <audio controls className="w-full mt-2">
                                    <source src={prayer.audioUrl} type="audio/mp3" />
                                </audio>
                                <button
                                    onClick={() => downloadPDF(prayer.text, `prayer-${index + 1}-${prayer.language}`)}
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
