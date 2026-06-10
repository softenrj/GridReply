"use client"

import React from 'react'
import { AnimatePresence, motion } from "motion/react";

function Dialog({ children, open, onClose }: { children: React.ReactNode, open: boolean, onClose: () => void }) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        className="absolute inset-0 bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 bg-white rounded-2xl p-6"
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default Dialog