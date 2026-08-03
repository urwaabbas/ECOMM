'use client';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section with high-contrast text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Have questions about Haanli Bazaar products or orders? Send us a message!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
          <form onSubmit={(e) => { e.preventDefault(); alert("Message submitted successfully!"); }} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition"
                placeholder="John Doe" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition"
                placeholder="john@example.com" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea 
                rows={4} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}