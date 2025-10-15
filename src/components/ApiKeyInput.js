// src/components/ApiKeyInput.js
import { useState, useEffect } from 'react';

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('huggingface_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key.');
      return;
    }
    localStorage.setItem('huggingface_api_key', apiKey);
    alert('API Key saved successfully!');
  };

  return (
    <div className="w-full">
      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
        Hugging Face API Key
      </label>
      <div className="flex">
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l-md"
          placeholder="Enter your Hugging Face API key"
        />
        <button
          onClick={handleSaveKey}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-md"
        >
          Save Key
        </button>
      </div>
    </div>
  );
}