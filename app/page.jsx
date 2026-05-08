"use client";

import Hero from "./components/Hero";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SmartAssistant from "./components/SmartAssistant";

export default function HomePage() {
    return (
        <div className="pt-4">
            <Navbar />
            <main>
                <Hero />
                <HowItWorks />
                <About />
            </main>
            <SmartAssistant />
            <Footer />
        </div>
    );
}
