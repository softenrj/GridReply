"use client"
import { Carrot, Fan, Info, Plane, Send } from 'lucide-react';
import React from 'react';

function Participant() {
    const isOptions = false;

    return (
        <div className="max-w-2xl mx-auto my-10 p-6 sm:p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 font-sans">

            <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
                <div className="p-2 bg-orange-50 rounded-xl">
                    <Carrot fill="#ED9121" strokeWidth={1.5} className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="uppercase tracking-widest text-transparent bg-linear-to-r from-red-500 to-pink-500 bg-clip-text font-bold text-lg">
                    Participant
                </h2>
            </div>

            <div className="space-y-8">

                <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] transition-transform duration-700 group-hover:rotate-180">
                        <Fan className="w-32 h-32" />
                    </div>

                    <div className="relative z-10 flex gap-4 items-start">
                        <div className="mt-1 bg-white p-2 rounded-lg shadow-sm">
                            <Fan className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Question</h3>
                            <p className="text-xl font-medium text-slate-800">How is stupid?</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-gray-800">Your Response</h3>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full w-fit">
                            <Info className="w-3.5 h-3.5" />
                            <span>Rows: 1-14, Cols: 1-14</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2 group">
                            <span className="text-sm font-semibold text-gray-600 group-focus-within:text-pink-500 transition-colors">Row Number</span>
                            <input
                                type="number"
                                min={1}
                                max={14}
                                className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 outline-none transition-all duration-200 text-gray-700"
                                placeholder="e.g., 5"
                            />
                        </label>

                        <label className="flex flex-col gap-2 group">
                            <span className="text-sm font-semibold text-gray-600 group-focus-within:text-pink-500 transition-colors">Column Number</span>
                            <input
                                type="number"
                                min={1}
                                max={14}
                                className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 outline-none transition-all duration-200 text-gray-700"
                                placeholder="e.g., 8"
                            />
                        </label>
                    </div>

                    {isOptions ? <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Select an Answer</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <label
                                    key={index}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-pink-300 hover:bg-pink-50/30 transition-all duration-200 has-[:checked]:border-pink-500 has-[:checked]:bg-pink-50 has-[:checked]:shadow-sm"
                                >
                                    <input
                                        type="radio"
                                        name="mcq-answer"
                                        className="w-5 h-5 text-pink-500 border-gray-300 accent-pink-500 border-none"
                                    />
                                    <span className="font-medium text-gray-700">Option {index + 1}</span>
                                </label>
                            ))}
                        </div>
                    </div> : <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Write your Answer</h4>

                        <div className="w-full">
                            <textarea
                                name="text-answer"
                                rows={4}
                                placeholder="Type your answer here..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 outline-none transition-all duration-200 text-gray-700 resize-y"
                            />
                        </div>
                    </div>}

                </div>
                <button className="w-full py-3 px-4 mt-4 flex justify-center items-center bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:shadow-pink-500/20 focus:outline-none focus:ring-4 focus:ring-pink-500/20 active:scale-[0.98] transition-all duration-200">
                    <div className='flex gap-3 items-center'>
                        <Send size={18} />
                        <span>Submit Answer</span>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default Participant;