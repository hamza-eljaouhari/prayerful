import React from 'react';

const TopicSelector = ({ topics, topic, setTopic }) => {
  return (
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
  );
};

export default TopicSelector;
    