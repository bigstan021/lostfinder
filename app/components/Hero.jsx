export default function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center py-20 px-6 
      [background-image:url('/bg-1.jpg')] bg-cover bg-center min-h-dvh"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white 
        [text-shadow:_1px_1px_0_#000,_-1px_1px_0_#000,_1px_-1px_0_#000,_-1px_-1px_0_#000]">
          Find Your Lost Items <span className="text-blue-500">Faster</span>
        </h1>

        <p className="mt-4 text-gray-200 max-w-2xl mx-auto">
          Every lost item has a story — because behind every loss is someone who cares. <br />
          <span className="font-bold text-white">LostFinder:</span> Restoring connections, one found item at a time.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
            Report Lost Item
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-100">
            Search Found Items
          </button>
        </div>
      </div>
    </section>
  );
}
