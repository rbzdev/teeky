"use client";

import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

const steps = [
    { text: "Création...", icon: "solar:magic-stick-3-bold", color: "text-blue-500" },
    { text: "Partage...", icon: "solar:share-bold", color: "text-amber-500" },
    { text: "Validation", icon: "solar:check-circle-bold", color: "text-emerald-500" },
];

export default function FloatingBadge() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % steps.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    const step = steps[currentStep];

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-8 -left-8 p-2 bg-white dark:bg-neutral-900 rounded-[12px] shadow-2xl border border-black/5 dark:border-white/10 rotate-6 hidden sm:block overflow-hidden min-w-[200px] pb-3"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex items-center gap-4"
                >
                    <div className="h-12 w-12 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary">
                        <Icon icon={step.icon} className={`text-2xl ${step.color}`} />
                    </div>
                    <div>
                        <p className="text-xs font-black">{step.text}</p>
                        <p className="text-[10px] text-muted-foreground ">
                            {currentStep === 2 ? "Réception instantanée" : "En cours..."}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-muted w-[90%]  ">
                <motion.div
                    key={`bar-${currentStep}`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "linear" }}
                    className={`h-full w-full rounded-full bg-emerald-500 `}
                />
            </div>
        </motion.div>
    );
}
