"use client"

import React, { useState, useEffect } from 'react'
import {
    Asterisk, Grid3X3, Share2, Users, ArrowRight,
    Hash, Link, EyeOff, Zap
} from 'lucide-react'
import JoinDialog from './JoinDialog'
import { postApi } from '../../../utils/api/common'
import { Poll } from '../../../types/poll'
import { NEW_SESSION } from '../../../utils/api/APIConstants'
import { ApiResponse } from '../../../types/ApiResponse'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const ROWS = 5
const COLS = 8

const CELL_COLORS = [
    { filled: 'bg-blue-400', ring: 'ring-blue-300' },
    { filled: 'bg-pink-400', ring: 'ring-pink-300' },
    { filled: 'bg-indigo-400', ring: 'ring-indigo-300' },
    { filled: 'bg-sky-400', ring: 'ring-sky-300' },
    { filled: 'bg-rose-400', ring: 'ring-rose-300' },
    { filled: 'bg-violet-400', ring: 'ring-violet-300' },
]

function cellColor(i: number, j: number) {
    return CELL_COLORS[(i * 3 + j * 7) % CELL_COLORS.length]
}

function HeroGrid() {
    const total = ROWS * COLS
    const [filled, setFilled] = useState<Set<number>>(() => {
        const s = new Set<number>()
        for (let k = 0; k < total; k++) {
            if (Math.random() > 0.55) s.add(k)
        }
        return s
    })

    useEffect(() => {
        const id = setInterval(() => {
            const k = Math.floor(Math.random() * total)
            setFilled(prev => {
                const next = new Set(prev)
                next.has(k) ? next.delete(k) : next.add(k)
                return next
            })
        }, 280)
        return () => clearInterval(id)
    }, [total])

    return (
        <div
            className="inline-grid gap-2 p-5 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-blue-100"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        >
            {Array.from({ length: ROWS }, (_, i) =>
                Array.from({ length: COLS }, (_, j) => {
                    const k = i * COLS + j
                    const { filled: fc } = cellColor(i, j)
                    const isOn = filled.has(k)
                    return (
                        <div
                            key={k}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-500 ease-out ${isOn
                                ? `${fc} scale-105 shadow-sm`
                                : 'bg-gray-50 border border-gray-200'
                                }`}
                        />
                    )
                })
            )}
        </div>
    )
}

export default function GridReplyLanding() {
    const [joinOpen, setJoinOpen] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleCloseJoin = React.useCallback(() => setJoinOpen(false), []);
    const router = useRouter();

    const handleNewSession = async () => {
        try {
            setLoading(true);
            const res = await postApi<ApiResponse<{ poll: Poll, token: string }>>({
                url: NEW_SESSION,
            })

            if (res?.success) {
                console.log(res);
                localStorage.setItem('gridreply::token', JSON.stringify(res.data.token));
                localStorage.setItem('gridreply::poll', JSON.stringify(res.data.poll));
                router.push(`/poll/${res.data.poll.code}`)
            }
        } catch (error) {
            console.log(error);
            toast.error('something went wrong')
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

                <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 group cursor-pointer select-none">
                        <Asterisk
                            size={20}
                            strokeWidth={2.5}
                            className="text-blue-500 group-hover:rotate-45 transition-transform duration-200"
                        />
                        <span className="font-mono font-black text-lg tracking-tight">GridReply</span>
                    </div>
                    <div className='px-2 py-1 bg-pink-200/30 border border-pink-300 rounded-full'>
                        <span className='text-xs'>{new Date(Date.now()).toDateString()}</span>
                    </div>
                </nav>

                <section className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 pb-10 gap-7">

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-pink-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide">
                        <Zap size={11} className="text-pink-500" />
                        Anonymous · No account to vote · Share in seconds
                    </span>

                    <h1 className="text-4xl sm:text-6xl font-black leading-[1.08] max-w-2xl tracking-tight">
                        Polls that live{' '}
                        <span className="relative whitespace-nowrap">
                            <span className="relative z-10 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
                                inside a grid
                            </span>
                            <span className="absolute inset-x-0 bottom-1 h-3 bg-gradient-to-r from-blue-100 to-pink-100 rounded -z-0" />
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-500 max-w-md leading-relaxed">
                        Build a poll with rows and columns, share a link, and collect answers anonymously — or jump into any poll with a short code.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-1" onClick={handleNewSession}>
                        <button disabled={loading} className="flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.99] transition-all duration-150">
                            <Grid3X3 size={17} />
                            Create a Poll
                            <ArrowRight size={15} />
                        </button>

                        <button
                            onClick={() => setJoinOpen(v => !v)}
                            className={`flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-xl border-2 transition-all duration-150 ${joinOpen
                                ? 'border-pink-400 text-pink-600 bg-pink-50'
                                : 'border-gray-200 text-gray-700 bg-white hover:border-pink-300 hover:text-pink-600'
                                }`}
                        >
                            <Hash size={17} />
                            Join with Code
                        </button>
                    </div>
                </section>

                <section className="flex justify-center px-6 pb-20 sm:pb-28">
                    <div className="relative">
                        <div className="absolute -inset-6 bg-gradient-to-br from-blue-100 via-transparent to-pink-100 rounded-3xl blur-3xl opacity-70 pointer-events-none" />
                        <div className="relative">
                            <HeroGrid />
                            <p className="text-center mt-3 text-xs text-gray-400 font-medium tracking-wide">
                                Live demo — cells update as votes come in
                            </p>
                        </div>
                    </div>
                </section>

                <section id="how" className="px-6 py-20 bg-gray-50 border-y border-gray-100">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-black text-center mb-2">How it works</h2>
                        <p className="text-center text-gray-500 text-sm mb-12">Three steps. Voters need zero account.</p>

                        <div className="grid sm:grid-cols-3 gap-5">
                            {[
                                {
                                    num: '1',
                                    icon: Grid3X3,
                                    title: 'Design your grid',
                                    desc: 'Pick the number of rows and columns. Label each axis to frame your question.',
                                    from: 'from-blue-500', to: 'to-indigo-500',
                                    bg: 'bg-blue-50', iconColor: 'text-blue-600',
                                },
                                {
                                    num: '2',
                                    icon: Share2,
                                    title: 'Share a link',
                                    desc: 'Copy the URL or the short code. Anyone with it can respond — anonymously.',
                                    from: 'from-indigo-500', to: 'to-violet-500',
                                    bg: 'bg-indigo-50', iconColor: 'text-indigo-600',
                                },
                                {
                                    num: '3',
                                    icon: Users,
                                    title: 'See it fill up',
                                    desc: "Cells light up as responses arrive. You see the pattern, not who clicked what.",
                                    from: 'from-pink-500', to: 'to-rose-500',
                                    bg: 'bg-pink-50', iconColor: 'text-pink-600',
                                },
                            ].map(({ num, icon: Icon, title, desc, from, to, bg, iconColor }) => (
                                <div key={num} className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${from} ${to} flex items-center justify-center shrink-0`}>
                                        <span className="text-white text-xs font-black">{num}</span>
                                    </div>
                                    <div className={`p-2.5 rounded-xl w-fit ${bg}`}>
                                        <Icon size={18} className={iconColor} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1 text-sm">{title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-6 py-20">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-black text-center mb-12">Built for quick, honest answers</h2>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                {
                                    icon: EyeOff,
                                    title: 'Fully anonymous',
                                    desc: 'Responses are never linked to names, emails, or devices. Voters just click.',
                                    bg: 'bg-blue-50', color: 'text-blue-600',
                                },
                                {
                                    icon: Link,
                                    title: 'One link, done',
                                    desc: 'Share a URL anywhere — Slack, WhatsApp, email. Works on any screen.',
                                    bg: 'bg-pink-50', color: 'text-pink-600',
                                },
                                {
                                    icon: Hash,
                                    title: 'Join by code',
                                    desc: "Short 6-character codes let people jump in when a URL isn't convenient.",
                                    bg: 'bg-indigo-50', color: 'text-indigo-600',
                                },
                                {
                                    icon: Grid3X3,
                                    title: 'Your shape, your question',
                                    desc: 'Change rows and columns to fit what you are actually asking. Not one size fits all.',
                                    bg: 'bg-violet-50', color: 'text-violet-600',
                                },
                            ].map(({ icon: Icon, title, desc, bg, color }) => (
                                <div key={title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all group cursor-default">
                                    <div className={`p-2.5 rounded-xl h-fit shrink-0 ${bg}`}>
                                        <Icon size={17} className={color} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 mb-0.5">{title}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-6 py-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-pink-500">
                    <div className="max-w-lg mx-auto text-center flex flex-col items-center gap-6">
                        <div className="flex items-center gap-1.5">
                            <Asterisk size={18} strokeWidth={2.5} className="text-white/70" />
                            <span className="font-mono font-black text-white/90 text-sm tracking-tight">GridReply</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                            Make your first poll now
                        </h2>
                        <p className="text-blue-100 max-w-sm">
                            No account. No setup. Just a grid and a question — ready to share in under a minute.
                        </p>
                        <button className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:scale-[1.03] active:scale-[0.99] transition-transform">
                            <Grid3X3 size={19} />
                            Create a Poll — it's free
                            <ArrowRight size={17} />
                        </button>
                    </div>
                </section>

                <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-6 border-t border-gray-100 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Asterisk size={14} strokeWidth={2.5} className="text-blue-400" />
                        <span className="font-mono font-black text-gray-700 text-sm">GridReply</span>
                    </div>
                    <span>© 2025 GridReply. All rights reserved.</span>
                </footer>

            </div>
            <JoinDialog open={joinOpen} onClose={handleCloseJoin} /></>
    )
}