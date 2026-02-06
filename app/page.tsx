"use client";

// Blocks
import Navbar from "@/app/Blocks/Navbar"
import Header from "@/app/Blocks/Header"
import Footer from "@/app/Blocks/Footer"
import ModelsShowcase from "@/app/Blocks/ModelsShowcase"
import Features from "@/app/Blocks/Features"
import CTA from "@/app/Blocks/CTA"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Navbar />

      <main>
        <Header />
        <ModelsShowcase />
        <Features />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
