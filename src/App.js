import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './App.css';

const topics = [
    "gratitude", "forgiveness", "healing", "strength", "protection",
    "guidance", "peace", "love", "compassion", "courage",
    "wisdom", "patience", "faith", "hope", "charity", "kindness",
    "understanding", "reconciliation", "unity", "humility",
    "mercy", "justice", "truth", "joy", "grace", "devotion",
    "reverence", "redemption", "salvation", "praise", "thanksgiving",
    "intercession", "confession", "consecration", "dedication",
    "adoration", "benediction", "petition", "supplication",
    "lamentation", "meditation", "reflection", "renewal",
    "revival", "restoration", "sanctification", "deliverance",
    "enlightenment", "faithfulness", "fidelity", "sincerity",
    "sobriety", "chastity", "simplicity", "stewardship", "evangelism",
    "discipleship", "servanthood", "mission", "vocation", "ministry",
    "fellowship", "community", "family", "marriage", "parenting",
    "friendship", "work", "school", "learning", "teaching", "growth",
    "maturity", "perseverance", "endurance", "provision", "safety",
    "peacekeeping", "defense", "healing of nations", "environment",
    "creation", "animal welfare", "agriculture", "science",
    "technology", "arts", "literature", "music", "sports", "leisure",
    "health", "mental health", "well-being", "prosperity", "wealth",
    "poverty", "equality", "freedom", "human rights", "democracy",
    "government", "leadership"
];

const writers = [
    "William Shakespeare", "Jane Austen", "Charles Dickens", "Leo Tolstoy", "Mark Twain",
    "Homer", "Edgar Allan Poe", "J.K. Rowling", "George Orwell", "Ernest Hemingway",
    "Fyodor Dostoevsky", "Emily Dickinson", "Virginia Woolf", "James Joyce", "Gabriel Garcia Marquez",
    "Franz Kafka", "F. Scott Fitzgerald", "Herman Melville", "T.S. Eliot", "John Steinbeck",
    "Oscar Wilde", "Mary Shelley", "H.G. Wells", "George Eliot", "Thomas Hardy",
    "Ralph Waldo Emerson", "Henry David Thoreau", "Walt Whitman", "Robert Frost", "Maya Angelou",
    "Sylvia Plath", "Toni Morrison", "Harper Lee", "Kurt Vonnegut", "Ray Bradbury",
    "J.R.R. Tolkien", "C.S. Lewis", "Isaac Asimov", "Arthur C. Clarke", "Philip K. Dick",
    "Margaret Atwood", "Ursula K. Le Guin", "Aldous Huxley", "H.P. Lovecraft", "Agatha Christie",
    "Arthur Conan Doyle", "J.D. Salinger", "Jack Kerouac", "Ernest J. Gaines", "Octavia E. Butler",
    "Vladimir Nabokov", "E. E. Cummings", "D.H. Lawrence", "William Faulkner", "Tennessee Williams",
    "L. Frank Baum", "Louisa May Alcott", "Jules Verne", "Robert Louis Stevenson", "Nathaniel Hawthorne",
    "Charles Baudelaire", "Marcel Proust", "Albert Camus", "Jean-Paul Sartre", "Simone de Beauvoir",
    "Gabriel Garcia Marquez", "Isabel Allende", "Pablo Neruda", "Jorge Luis Borges", "Carlos Fuentes",
    "Mario Vargas Llosa", "Miguel de Cervantes", "Edith Wharton", "Thomas Mann", "Herman Hesse"
];

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

    useEffect(() => {
        fetchPrayers();
    }, []);

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

    const downloadPDF = (text, filename) => {
        const doc = new jsPDF();
        doc.text(text, 10, 10);
        doc.save(`${filename}.pdf`);
    };

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
                            <p className="mb-4">{prayer}</p>
                            <div className="mb-4">
                                <button
                                    onClick={() => downloadPDF(prayer, `prayer-${topic}`)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                                >
                                    Download Prayer as PDF
                                </button>
                            </div>
                            <div className="mb-4">
                                <a
                                    href={textUrl}
                                    className="block mb-4 text-blue-500 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download Prayer Text
                                </a>
                            </div>
                            <div className="mb-4">
                                <audio controls className="w-full">
                                    <source src={audioUrl} type="audio/mp3" />
                                </audio>
                            </div>
                        </div>
                    )}
                    <div className="mt-6">
                        <h2 className="text-lg font-bold mb-2">All Prayers:</h2>
                        {prayers.map((prayer, index) => (
                            <div key={index} className="mb-4 p-4 border rounded-md">
                                <a
                                    href={prayer.textUrl}
                                    className="block mb-2 text-blue-500 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {`Prayer ${index + 1}`}
                                </a>
                                <audio controls className="w-full">
                                    <source src={prayer.audioUrl} type="audio/mp3" />
                                </audio>
                                <button
                                    onClick={() => downloadPDF(prayer.textUrl, `prayer-${index + 1}`)}
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
