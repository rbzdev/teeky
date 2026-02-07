"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import InvitationModelRenderer from "@/app/inv/Models/renderer";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import AnimatedGroup from "@/components/AnimatedGroup";
import FloatingBadge from "@/app/Blocks/FloatingBadge";
import Image from "next/image";

export default function Header() {
    return (
        <section className="relative overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-32">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.4, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    <AnimatedGroup variant="slideUp" stagger={0.2} className="flex flex-col space-y-8">

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[11px] font-bold tracking-wider text-emerald-500">
                                100% GRATUIT
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl  font-extrabold tracking-tight leading-[1.1]">
                                Votre événement <br />
                                en moins de
                                <span className="text-primary ml-1">
                                    5 minutes
                                </span>
                            </h1>

                            <p className="text-lg text-muted-foreground  max-w-lg leading-relaxed">
                                Invitations, traiteurs, lieux et bien plus. Teeky simplifie chaque étape de votre organisation pour un événement sans stress.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {[
                                { name: "Invitations", icon: "solar:letter-bold" },
                                { name: "Traiteurs", icon: "solar:chef-hat-bold" },
                                { name: "Lieux", icon: "solar:map-point-wave-bold" },
                                { name: "Envoi & RSVP", icon: "zondicons:user-group" },
                            ].map((service) => (
                                <div key={service.name} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold transition-all hover:bg-primary/5 hover:border-primary/20">
                                    <Icon icon={service.icon} className="text-primary text-base" />
                                    {service.name}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <Link href="/inv/create">
                                <Button size="lg" className="">
                                    <Icon icon="solar:magic-stick-3-bold" className="mr-2 text-xl" />
                                    Démarrer gratuitement
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button size="lg" variant="outline" className="">
                                    Découvrir <span className="hidden lg:block ml-"> les fonctions </span>
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-5 pt-2 ">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, zIndex: 10 }}
                                        className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden shadow-sm"
                                    >
                                        <Image src={`https://i.pravatar.cc/150?u=${i + 20}`} width={50} height={50} alt="User" className="h-full w-full object-cover" />
                                    </motion.div>
                                ))}
                            </div>
                            <div className="h-8 w-px bg-border/50" />
                            <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                <Icon icon="solar:star-bold" className="text-amber-500 text-lg" />
                                <span className="text-foreground">4.9/5</span> de satisfaction
                            </p>
                        </div>
                    </AnimatedGroup>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-primary/5 rounded-[3rem] blur-2xl opacity-20 animate-pulse" />
                        <div className="relative rounded-xl border  bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-sm p-2 overflow-hidden transform hover:rotate-0 transition-transform duration-700">

                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)] pointer-events-none" />

                            <div className="relative z-10 space-y-5">
                                <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
                                    <div className="flex gap-2">
                                        <div className="h-3 w-3 rounded-full bg-rose-400/80 shadow-sm" />
                                        <div className="h-3 w-3 rounded-full bg-amber-400/80 shadow-sm" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-400/80 shadow-sm" />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
                                        <Icon icon="solar:lock-bold" />
                                        teeky.app/mon-evenement-special
                                    </div>
                                </div>

                                <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10">
                                    <InvitationModelRenderer
                                        model="elegant"
                                        hostManName="Leïla"
                                        hostWomanName="Sami"
                                        description="Rejoignez-nous pour célébrer cet instant inoubliable avec nous."
                                        location="Villa des Oliviers, Tunis"
                                        startsAt={new Date('2025-08-15T19:00:00')}
                                    />
                                </div>

                                <div className="flex justify-center pt-2">
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary">
                                        <Icon icon="solar:share-bold" className="animate-bounce" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Lien prêt à être envoyé</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 h-20 w-20 bg-white dark:bg-neutral-900 rounded-3xl flex items-center justify-center shadow-2xl border border-primary/20 -rotate-12"
                        >
                            <Icon icon="heroicons:sparkles" className="text-3xl text-primary" />
                        </motion.div>


                        {/* Animated floating badge */}
                        <FloatingBadge />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
