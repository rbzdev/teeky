"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import AnimatedGroup from "@/components/AnimatedGroup";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t bg-white dark:bg-neutral-950 overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mb-64 -mr-64 pointer-events-none" />

            <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-12">
                <div className="grid gap-16 lg:grid-cols-12 mb-16">
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="group flex items-center gap-3 font-bold text-3xl tracking-tight">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: -10 }}
                                className="h-12 w-12 flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20"
                            >

                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={50}
                                    height={50}
                                    className="rounded-sm border hover:scale-105 hover:-rotate-12 transition-all duration-300"
                                />
                            </motion.div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60 transition-all group-hover:to-foreground">
                                Teeky
                            </span>


                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-medium">
                            Nous réinventons l&apos;art de l&apos;invitation pour l&apos;ère numérique. Élégance, simplicité et gestion instantanée pour vos moments précieux.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { name: "Twitter", icon: "codicon:twitter", href: "#" },
                                { name: "Instagram", icon: "hugeicons:instagram", href: "https://instagram.com/safaridew_" },
                                { name: "LinkedIn", icon: "hugeicons:linkedin-01", href: "https://www.linkedin.com/in/rubuz/" },
                            ].map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    whileHover={{ y: -4, scale: 1.1 }}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-border/50 bg-background/50 hover:border-primary hover:text-primary transition-all shadow-sm"
                                >
                                    <Icon icon={social.icon} className="text-xl" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid gap-10 sm:grid-cols-3">
                        <AnimatedGroup variant="slideUp" stagger={0.05} className="space-y-6">
                            <h4 className=" text-sm tracking-[0.2em] uppercase text-foreground/50">Produit</h4>
                            <ul className="space-y-2">
                                {["Fonctionnalités", "Modèles", "Tarifs", "FAQ"].map((item) => (
                                    <li key={item}>
                                        <Link href={`#${item.toLowerCase().replace("é", "e")}`} className="hover:text-primary hover:underline transition-all">

                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </AnimatedGroup>

                        <AnimatedGroup variant="slideUp" stagger={0.05} className="space-y-6">
                            <h4 className=" text-sm tracking-[0.2em] uppercase text-foreground/50">Ressources</h4>
                            <ul className="space-y-4">
                                {["Blog", "Guides"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="thover:text-primary hover:underline transition-all">

                                            {item}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="https://wa.me/243850605759"
                                        className="text-sm font-bold text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-1 bg-primary/5 hover:bg-emerald-500/20 px-4 py-2 rounded-xl w-fit"
                                    >
                                        <Icon icon="solar:chat-round-dots-bold" className="text-lg text-emerald-500" />
                                        WhatsApp
                                    </Link>
                                </li>
                            </ul>
                        </AnimatedGroup>

                        <AnimatedGroup variant="slideUp" stagger={0.05} className="space-y-6">
                            <h4 className="text-sm tracking-[0.2em] uppercase text-foreground/50">Légal</h4>
                            <ul className="space-y-4">
                                {["Terms", "Privacy"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="hover:text-primary hover:underline transition-all">
                                            {item === "Terms" ? "Conditions d'utilisation" : "Confidentialité"}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </AnimatedGroup>
                    </div>
                </div>

                <div className="pt-10 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-8">

                    <div className="text-[12px] text-muted-foreground">
                        © {currentYear} <Link href="safaridew.vercel.app" target="_blank" className="text-foreground hover:underline hover:text-primary">safaridew</Link>
                        <span className="mx-3 opacity-30">|</span>
                        Crafted with <Icon icon="solar:heart-bold" className="inline text-rose-500 mx-1 text-xl" /> by <Link href="https://www.linkedin.com/in/rubuz/" target="_blank" className="text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary">Olivier Rubuz</Link>
                    </div>

                    <div className="flex items-center gap-8 text-[10px]">
                        <span className="flex items-center gap-2 group cursor-default">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Système Opérationnel
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
