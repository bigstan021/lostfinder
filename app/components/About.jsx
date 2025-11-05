export default function About() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white text-center px-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">About LostFinder</h2>
      <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
        LostFinder is a community-driven platform that bridges the gap between
        people who’ve lost items and those who’ve found them. Whether it’s a
        misplaced phone, ID card, or backpack, LostFinder helps reconnect items
        with their rightful owners — quickly, securely, and with ease.
      </p>

      <div className="mt-8 flex justify-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </section>
  );
}
