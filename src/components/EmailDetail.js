// src/components/EmailDetail.js
export default function EmailDetail({ email }) {
  if (!email) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-50 rounded-lg h-full">
        <p className="text-gray-500 text-lg">Select an email to view its content</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 bg-white h-full overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{email.subject}</h2>
      <p className="text-md text-gray-700 mb-6 border-b pb-4">From: {email.from}</p>
      
      {/* The fix is to add a text color class like "text-gray-800" here.
        This forces all the text inside the rendered HTML to be a dark gray.
      */}
      <div 
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: email.body }} 
      />
    </div>
  );
}