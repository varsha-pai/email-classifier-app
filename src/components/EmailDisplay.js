// src/components/EmailDetail.js
export default function EmailDetail({ email }) {
  if (!email) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-50 rounded-lg h-full">
        <p className="text-gray-500 text-lg">Select an email to view its content</p>
      </div>
    );
  }

  // Same color mapping from the EmailCard for consistency
  const categoryColors = {
    Important: 'bg-green-100 text-green-800',
    Promotional: 'bg-blue-100 text-blue-800',
    Social: 'bg-indigo-100 text-indigo-800',
    Marketing: 'bg-orange-100 text-orange-800',
    Spam: 'bg-red-100 text-red-800',
    General: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-white h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{email.subject}</h2>
        {/* New Category Badge */}
        {email.category && (
          <span className={`flex-shrink-0 text-sm font-semibold ml-4 px-3 py-1 rounded-full ${categoryColors[email.category]}`}>
            {email.category}
          </span>
        )}
      </div>
      <p className="text-md text-gray-700 mb-6 border-b pb-4">From: {email.from}</p>
      
      <div 
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: email.body }} 
      />
    </div>
  );
}