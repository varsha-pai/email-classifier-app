// src/components/EmailCard.js
export default function EmailCard({ email, onSelect, isSelected }) {
  const categoryColors = {
    Important: 'bg-green-100 text-green-800',
    Promotional: 'bg-blue-100 text-blue-800',
    Social: 'bg-indigo-100 text-indigo-800',
    Marketing: 'bg-orange-100 text-orange-800',
    Spam: 'bg-red-100 text-red-800',
    General: 'bg-gray-100 text-gray-800',
  };

  return (
    <div
      onClick={() => onSelect(email)}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'bg-white hover:shadow-md border-gray-200'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow overflow-hidden pr-2">
          <p className="font-bold text-gray-800 truncate">{email.from}</p>
          <p className="font-semibold text-gray-600 truncate">{email.subject}</p>
          <p className="text-sm text-gray-500 mt-1 truncate">{email.snippet}</p>
        </div>
        {email.category && (
          <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[email.category]}`}>
            {email.category}
          </span>
        )}
      </div>
    </div>
  );
}