import React from 'react';

const WriterSelector = ({ writers, writer, setWriter }) => {
  return (
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
  );
};

export default WriterSelector;
