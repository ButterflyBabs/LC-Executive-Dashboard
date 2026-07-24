export default function TestButtons() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Button Test Page</h1>
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Health Check
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded">
          Auto-Calculate
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded">
          Add Task
        </button>
      </div>
    </div>
  );
}
