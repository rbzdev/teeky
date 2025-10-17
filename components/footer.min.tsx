"use client";

import Link from "next/link";

// Icons
import { Icon } from "@iconify/react";


export default function FooterMin() {
    // const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background py-6">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="inline-flex items-center gap-1 font-medium text-sm">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Teeky
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            © 2025-{new Date().getFullYear()} Tous droits réservés
                        </span>
                    </div>

                    <nav className="flex items-center gap-5 text-xs text-muted-foreground">
                        <Link href="/auth/login" className="hover:text-foreground transition-colors">
                            Connexion
                        </Link>
                        <Link href="/#features" className="hover:text-foreground transition-colors">
                            Fonctionnalités
                        </Link>
                        <Link
                            href="https://wa.me/243850605759?text=Bonjour%20safaridew%20-%20J%27ai%20besoin%20d%27aide%20à%20propos%20de%20Teeky"
                            className="hover:text-foreground flex items-center group transition-all"
                        >
                            <Icon icon="tabler:brand-whatsapp" className="size-3 group-hover:text-green-500 group-hover:scale-110 transition-all " />
                            <span> Contact</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
