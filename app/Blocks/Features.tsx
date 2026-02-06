"use client";

import AnimatedGroup from "@/components/AnimatedGroup";
import { Icon } from "@iconify/react";

export default function Features() {
    return (
        <section id="fonctionnalites" className="relative  mx-auto overflow-hidden">


            <div className="mx-auto max-w-6xl px-4 sm:px-6 border-t py-12" >
                <AnimatedGroup variant="slideUp" stagger={0.15} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            title: "Modèles soignés",
                            desc: "Choisis parmi des thèmes élégants et personnalisables adaptés à ton événement.",
                            icon: "solar:palette-round-bold-duotone"
                        },
                        {
                            title: "Partage instantané",
                            desc: "Un lien unique à envoyer par message, email ou via QR code.",
                            icon: "solar:rocket-bold"
                        },
                        {
                            title: "RSVP en temps réel",
                            desc: "Suis les réponses facilement et gère tes invités sans tableur.",
                            icon: "solar:chart-2-bold"
                        }
                    ].map((feature) => (
                        <div key={feature.title} className="relative group p-5 rounded-xl border border-border/50 bg-background hover:border-primary/30 hover:shadow-xl transition-all duration-500">

                            <div className="h-16 w-16 rounded-sm bg-primary/10 flex items-center justify-center text-3xl text-primary mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                <Icon icon={feature.icon} />
                            </div>
                            <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </AnimatedGroup>
            </div>
        </section>
    );
}
