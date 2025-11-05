import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import HowItWorks from "./components/HowItWorks"
import About from "./components/About";


export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <About />
      <Footer />

    </>
  );
}
