export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Account Profile</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 font-bold text-2xl flex items-center justify-center rounded-full">
            UA
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Urwa Abbas</h2>
            <p className="text-gray-500">urwa@example.com</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-600">4</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Wishlist Items</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
