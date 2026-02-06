"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import AnimatedGroup from "@/components/AnimatedGroup";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                scrolled
                    ? "border-b bg-background/80 backdrop-blur-xl py-2 shadow-sm"
                    : "bg-transparent py-4"
            )}
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between">
                <Link
                    href="/"
                    className="group flex items-center gap-2 font-bold text-xl tracking-tight transition-all"
                >
                    {/* <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="relative h-9 w-9 overflow-hidden rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20"
                    >
                        <Icon icon="solar:ticket-bold" className="text-xl" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                    </motion.div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-foreground transition-all">
                        Teeky
                    </span> */}
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                        className="rounded-xl hover:scale-105 hover:-rotate-12 transition-all duration-300"
                    />
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {["Fonctionnalités", "Modèles", "FAQ"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace("é", "e")}`}
                            className="relative text-sm text-muted-foreground transition-colors hover:text-foreground group py-1"
                        >
                            {item}
                            <motion.span
                                className="absolute inset-x-0 -bottom-px h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                            />
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/auth/login" className="hidden sm:inline-flex">
                        <Button variant="outline" className="text-sm font-semibold hover:bg-primary/5 text-muted-foreground hover:text-primary">
                            Se connecter
                        </Button>
                    </Link>

                    <Link href="/inv/create">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 border-none px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Icon icon="solar:add-circle-bold" className="mr- text-lg" />
                            Créer
                        </Button>
                    </Link>
                    <div className="pl-2 ml-2 border-l border-border/50">
                        <AnimatedThemeToggler />
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
