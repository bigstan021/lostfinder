"use client";

import Hero from "./components/Hero";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SmartAssistant from "./components/SmartAssistant";
import CampusLife from "./components/CampusLife";
import WhyItMatters from "./components/WhyItMatters";
import AIMatching from "./components/AIMatching";
import RecoveredItems from "./components/RecoveredItems";

export default function HomePage() {
    return (
        <div className="pt-4">
            <Navbar />
            <main>
                <Hero />
                <HowItWorks />
                <CampusLife />
                <WhyItMatters />
                <AIMatching />
                <RecoveredItems />
                <About />
            </main>
            <SmartAssistant />
            <Footer />
        </div>
    );
}
