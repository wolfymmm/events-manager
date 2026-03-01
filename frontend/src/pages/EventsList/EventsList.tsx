export default function EventsList() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Events List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example event cards */}
        {[1, 2, 3].map((id) => (
          <div key={id} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Event {id}</h2>
            <p className="text-gray-600">Description of event {id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}