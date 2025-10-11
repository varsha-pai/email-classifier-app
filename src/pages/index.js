// src/pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import ApiKeyInput from '../components/ApiKeyInput';
import EmailCard from '../components/EmailCard';
import EmailDetail from '../components/EmailDetail';

export default function Home() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailCount, setEmailCount] = useState(15);
  const [isClassified, setIsClassified] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const fetchEmails = async () => {
    setIsLoading(true);
    setError(null);
    setEmails([]);
    setSelectedEmail(null);
    setIsClassified(false);
    try {
      const fetchRes = await fetch(`/api/gmail/fetch?count=${emailCount}`);
      if (!fetchRes.ok) throw new Error('Failed to fetch emails from Gmail.');
      const fetchedEmails = await fetchRes.json();
      setEmails(fetchedEmails);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const classifyEmails = async () => {
    if (emails.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) throw new Error('OpenAI API Key not found. Please save it first.');
      const classifyRes = await fetch('/api/openai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails, apiKey }),
      });
      if (!classifyRes.ok) throw new Error('Failed to classify emails.');
      const classifiedEmails = await classifyRes.json();
      setEmails(classifiedEmails);
      setIsClassified(true);
      if (selectedEmail) {
        const newlyClassifiedSelectedEmail = classifiedEmails.find(e => e.id === selectedEmail.id);
        setSelectedEmail(newlyClassifiedSelectedEmail || null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const categories = ["Important", "Promotional", "Social", "Marketing", "Spam", "General"];
  const groupedEmails = emails.reduce((acc, email) => {
    const category = email.category || "Unclassified";
    if (!acc[category]) acc[category] = [];
    acc[category].push(email);
    return acc;
  }, {});

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
            {/* FIX: Added text-gray-900 for dark text */}
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Welcome to the Email Classifier</h1>
            <button onClick={() => signIn("google")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md">
              Sign in with Google
            </button>
        </div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
       <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            {/* FIX: Added text-gray-900 for dark text */}
            <h1 className="text-2xl font-bold text-gray-900">Set Your API Key</h1>
            <p className="text-gray-500 mt-2">Enter your OpenAI API key to continue. The field will be pre-filled if you have saved one before.</p>
          </div>
          <ApiKeyInput />
          <div className="flex justify-end">
            <button 
              onClick={() => setHasApiKey(true)} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-full shadow-md flex items-center justify-center"
              aria-label="Continue to next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col font-sans">
      <header className="flex-shrink-0 bg-white p-3 border-b flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={session.user.image} alt="User" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-gray-800">{session.user.name}</p>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
        </div>
        <button onClick={() => signOut()} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
          Logout
        </button>
      </header>

      <main className="flex-grow flex overflow-hidden">
        <div className={`transition-all duration-300 border-r overflow-y-auto p-4 space-y-4 bg-gray-50 ${selectedEmail ? 'w-full md:w-1/3' : 'w-full'}`}>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={emailCount}
              onChange={(e) => setEmailCount(Number(e.target.value))}
              disabled={isLoading}
              className="p-3 border rounded-md bg-white shadow-sm w-24 text-center text-gray-900"
              min="1"
              max="50"
            />
            <button
              onClick={fetchEmails}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-md shadow-lg disabled:bg-blue-300 transition-all"
            >
              Fetch Emails
            </button>
          </div>
          <button
            onClick={classifyEmails}
            disabled={isLoading || emails.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-md shadow-lg disabled:bg-indigo-300 transition-all"
          >
            Classify Emails
          </button>
          
          {error && <p className="text-red-500 text-center font-semibold mt-2">{error}</p>}

          <div className="space-y-4 pt-4">
            {isClassified ? (
              categories.map(category => 
                groupedEmails[category] && (
                  <div key={category}>
                    <h3 className="font-bold text-gray-500 uppercase text-sm px-1">{category}</h3>
                    <div className="space-y-2 mt-1">
                      {groupedEmails[category].map(email => (
                        <EmailCard
                          key={email.id}
                          email={email}
                          onSelect={() => setSelectedEmail(prev => prev?.id === email.id ? null : email)}
                          isSelected={selectedEmail?.id === email.id}
                        />
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="space-y-2">
                {emails.map(email => (
                  <EmailCard
                    key={email.id}
                    email={email}
                    onSelect={() => setSelectedEmail(prev => prev?.id === email.id ? null : email)}
                    isSelected={selectedEmail?.id === email.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {selectedEmail && (
          <div className="hidden md:flex w-2/3 h-full">
            <EmailDetail email={selectedEmail} />
          </div>
        )}
      </main>
    </div>
  );
}