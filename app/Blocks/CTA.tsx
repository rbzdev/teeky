"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export default function CTA() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 ">
            <div className="relative rounded-[4rem] border overflow-hidden bg- p-10 sm:p-12 text-center">

                <div className="relative z-10 flex flex-col items-center">
                    <Icon icon="heroicons:sparkles" className="text-primary text-5xl mb-8 animate-pulse" />
                    <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
                        Prêt à créer <br />ton invitation ?
                    </h2>
                    <p className=" text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Rejoins des milliers d&apos;utilisateurs qui font confiance à Teeky pour leurs événements les plus précieux.
                    </p>
                    <Link href="/inv/create">
                        <Button size="lg" className="py-2 px-12 ">
                            Créer gratuitement
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
