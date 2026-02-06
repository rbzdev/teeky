"use client";

import InvitationModelRenderer from "@/app/inv/Models/renderer";
import AnimatedGroup from "@/components/AnimatedGroup";
import { Icon } from "@iconify/react";

export default function ModelsShowcase() {
    return (
        <section id="modeles" className="mx-auto max-w-6xl px-4 sm:px-6 py-24 ">
            <AnimatedGroup variant="slideUp" className="mb-16 text-center">
                <h2 className="text-2xl sm:text-5xl font-black tracking-tight mb-6">Explorez nos modèles</h2>

                <p className="text-muted-foreground text-sm lg:text-lg max-w-2xl mx-auto ">
                    Chaque modèle est conçu avec soin pour s&apos;adapter à l&apos;ambiance unique de votre événement.
                    Du minimalisme moderne au classicisme élégant.
                </p>
            </AnimatedGroup>

            <AnimatedGroup variant="slideUp" stagger={0.2} className="grid gap-10 md:grid-cols-1 lg:grid-cols-2">
                {[
                    {
                        model: "classic",
                        name: "Mariage",
                        desc: "Une élégance intemporelle pour le plus beau jour de votre vie.",
                        props: { hostManName: "Jacques", hostWomanName: "Christine", location: "Le Jardin des Arts, Marseille" }
                    },
                    {
                        model: "minimalist",
                        name: "Anniversaire",
                        desc: "Style épuré et moderne pour célébrer une nouvelle année.",
                        props: { hostManName: "Teddy", hostWomanName: "25 ans", location: "Skyline Lounge, Kinshasa" }
                    },
                    {
                        model: "elegant",
                        name: "Business",
                        desc: "Professionnalisme et distinction pour vos événements corporate.",
                        props: { hostManName: "Conférence", hostWomanName: "Teeky 2025", location: "Center Hub, Lusaka" }
                    }
                ].map((item) => (
                    <div key={item.name} className="group relative rounded-xl border border-border/50 bg-card p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                        <div className="rounded-lg overflow-hidden mb-6 border border-border/50 shadow-inner">
                            <InvitationModelRenderer
                                model={item.model as string}
                                {...item.props}
                                description="Rejoignez-nous pour une célébration chaleureuse."
                                startsAt={new Date('2025-06-21T16:00:00')}
                            />
                        </div>
                        <div className="px-3 pb-4">
                            <h3 className="font-black text-xl mb-2 flex items-center gap-2">
                                {item.name}
                                <Icon icon="solar:round-alt-arrow-right-bold" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </AnimatedGroup>
        </section>
    );
}
