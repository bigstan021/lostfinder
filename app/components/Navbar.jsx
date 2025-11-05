export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-5 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-red-600">Lost<span className="text-blue-400">Finder</span></h1>
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li className="hover:text-blue-600 cursor-pointer">Home</li>
        <li className="hover:text-blue-600 cursor-pointer">Find Items</li>
        <li className="hover:text-blue-600 cursor-pointer">Report Lost Item</li>
        <li className="hover:text-blue-600 cursor-pointer">Contact</li>
      </ul>
      <button className="md:hidden bg-red-600 text-white px-3 py-2 rounded-md">☰</button>
    </nav>
  );
}
