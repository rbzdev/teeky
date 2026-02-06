"use client";

import { motion, HTMLMotionProps, Variants } from "motion/react";
import { ReactNode } from "react";

type AnimationVariant = "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale";

interface AnimatedGroupProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    variant?: AnimationVariant;
    stagger?: number;
    delay?: number;
    duration?: number;
    className?: string;
    viewOnce?: boolean;
}

const variants: Record<AnimationVariant, Variants> = {
    fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    slideUp: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    },
    slideDown: {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    },
    slideLeft: {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
    },
    slideRight: {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    },
    scale: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
    },
};

export default function AnimatedGroup({
    children,
    variant = "slideUp",
    stagger = 0.1,
    delay = 0,
    duration = 0.5,
    className,
    viewOnce = true,
    ...props
}: AnimatedGroupProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: viewOnce }}
            transition={{
                staggerChildren: stagger,
                delayChildren: delay,
            }}
            className={className}
            {...props}
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <motion.div
                        key={index}
                        variants={variants[variant]}
                        transition={{ duration }}
                    >
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div
                    variants={variants[variant]}
                    transition={{ duration }}
                >
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
}
