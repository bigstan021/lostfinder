import { Search, Upload, MessageCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Search Lost Items",
      desc: "Quickly find lost belongings by name, location, or category.",
      icon: <Search className="text-blue-600 w-8 h-8" />,
    },
    {
      id: 2,
      title: "Upload Found Items",
      desc: "Found something? Upload details with an image so the owner can find it.",
      icon: <Upload className="text-blue-600 w-8 h-8" />,
    },
    {
      id: 3,
      title: "Connect & Chat",
      desc: "Easily chat with the finder or owner to confirm and reunite items.",
      icon: <MessageCircle className="text-blue-600 w-8 h-8" />,
    },
  ];

  return (
    <section className="bg-white py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-12">How LostFinder Works</h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-center mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
