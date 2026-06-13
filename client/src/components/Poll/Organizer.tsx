"use client"

import { Carrot, Fan, Info, Send } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Poll, PollOption } from '../../../types/poll';
import { patchApi, postApi } from '../../../utils/api/common';
import { ApiResponse } from '../../../types/ApiResponse';
import { CREATE_POLL } from '../../../utils/api/APIConstants';

function Organizer({ pollId, sessionId, onPoll, poll }: { pollId: string | null, sessionId: string, onPoll: (poll: Poll) => void, poll: Poll | null }) {
    const [isOptions, setIsOptions] = useState(true);

    const [question, setQuestion] = useState("");

    const [rows, setRows] = useState<number>(1);
    const [cols, setCols] = useState<number>(1);

    const [options, setOptions] = useState<PollOption[]>([
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" }
    ]);
    const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);

    const [textAnswer, setTextAnswer] = useState("");

    const handleOptionTextChange = (id: number, newText: string) => {
        setOptions(prev => prev.map(opt =>
            opt.id === id ? { ...opt, text: newText } : opt
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validOptions = options.filter(opt => opt.text.trim() !== "");

        if (isOptions) {
            const selectedCorrectOption = options.find(o => o.id === correctOptionId);
            if (!selectedCorrectOption || selectedCorrectOption.text.trim() === "") {
                toast.success("Please select a valid, non-empty option as the correct answer.");
                return;
            }
        }

        const payload = {
            question,
            sessionCode: sessionId,
            pollType: isOptions ? "mcq" : "default",
            rows: Number(rows),
            cols: Number(cols),
            ...(isOptions && { options: validOptions }),
            answer: isOptions ? correctOptionId : textAnswer
        };

        if (pollId) {
            await handleUpdatePoll(payload);
        } else {
            await handleCreatePoll(payload);
        }
    };

    React.useEffect(() => {
        if (!poll) return;
        setRows(poll.rows);
        setCols(poll.cols);
        setQuestion(poll.question);
        if (poll.options && poll.options.length > 0) setOptions(poll.options);
        setTextAnswer(poll.answer);
    }, [poll])

    const handleCreatePoll = async (payload: any) => {
        try {
            const res = await postApi<ApiResponse<Poll>>({
                url: CREATE_POLL,
                values: payload
            })

            if (res?.success) {
                onPoll(res.data);
            } else if (!res?.success && res?.message) {
                toast.error(res.message);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.message ?? "Something went wrong")
        }
    }

    const handleUpdatePoll = async (payload: any) => {
        try {
            const res = await patchApi<ApiResponse<Poll>>({
                url: CREATE_POLL + `/${pollId}`,
                values: payload
            })

            if (res?.success) {
                onPoll(res.data);
            } else if (!res?.success && res?.message) {
                toast.error(res.message);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.message ?? "Something went wrong")
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="h-fit w-full mx-auto my-6 p-6 sm:p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 font-sans"
        >
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
                <div className="p-2 bg-orange-50 rounded-xl">
                    <Carrot fill="#ED9121" strokeWidth={1.5} className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="uppercase tracking-widest text-transparent bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text font-bold text-lg">
                    Organizer
                </h2>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100 relative overflow-hidden group focus-within:border-pink-200 focus-within:ring-4 focus-within:ring-pink-500/5 transition-all">
                        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] transition-transform duration-700 group-hover:rotate-180">
                            <Fan className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 flex gap-4 items-start">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm">
                                <Fan className="w-5 h-5 text-slate-400 group-focus-within:text-pink-400 transition-colors" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 group-focus-within:text-pink-500 transition-colors">Question</h3>
                                <input
                                    required
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Enter your Question..."
                                    className="w-full text-xl font-medium text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-300"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-gray-800">Grid Settings</h3>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full w-fit">
                            <Info className="w-3.5 h-3.5" />
                            <span>Rows: 1-{poll?.rows ?? 1}, Cols: 1-{poll?.cols ?? 0}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2 group">
                            <span className="text-sm font-semibold text-gray-600 group-focus-within:text-pink-500 transition-colors">Number of Rows</span>
                            <input
                                required
                                type="number"
                                min={1}
                                defaultValue={1}
                                value={rows}
                                onChange={(e) => setRows(Number(e.target.value))}
                                className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 outline-none transition-all duration-200 text-gray-700"
                                placeholder="e.g., 5"
                            />
                        </label>

                        <label className="flex flex-col gap-2 group">
                            <span className="text-sm font-semibold text-gray-600 group-focus-within:text-pink-500 transition-colors">Number of Columns</span>
                            <input
                                required
                                type="number"
                                min={1}
                                defaultValue={1}
                                value={cols}
                                onChange={(e) => setCols(Number(e.target.value))}
                                className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 outline-none transition-all duration-200 text-gray-700"
                                placeholder="e.g., 8"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <h4 className="text-sm font-semibold text-gray-600">Answer Mode</h4>
                        <div className="flex p-1 bg-gray-100/80 border border-gray-200 rounded-xl w-full sm:w-72">
                            <button
                                type="button"
                                onClick={() => setIsOptions(true)}
                                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 ${isOptions
                                    ? 'bg-white text-pink-500 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                                    }`}
                            >
                                Multiple Choice
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOptions(false)}
                                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 ${!isOptions
                                    ? 'bg-white text-pink-500 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                                    }`}
                            >
                                Text Input
                            </button>
                        </div>
                    </div>

                    {isOptions ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <p className="text-xs text-gray-500 mb-2">Select the radio button to mark the correct answer. Minimum 2 options required.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                {options.map((opt, index) => (
                                    <label
                                        key={opt.id}
                                        className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-pink-300 hover:bg-pink-50/30 transition-all duration-200 has-[:checked]:border-pink-500 has-[:checked]:bg-pink-50 has-[:checked]:shadow-sm"
                                    >
                                        <input
                                            type="radio"
                                            name="mcq-answer"
                                            checked={correctOptionId === opt.id}
                                            onChange={() => setCorrectOptionId(opt.id)}
                                            required={isOptions}
                                            className="w-5 h-5 text-pink-500 border-gray-300 accent-pink-500 border-none cursor-pointer flex-shrink-0"
                                        />
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                                            placeholder='write choices'
                                            required={isOptions && index < 2}
                                            className="w-full bg-transparent border-none outline-none font-medium text-gray-700 placeholder:text-gray-400"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <textarea
                                name="text-answer"
                                rows={4}
                                value={textAnswer}
                                onChange={(e) => setTextAnswer(e.target.value)}
                                required={!isOptions}
                                placeholder="Type the expected answer here..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-400/10 outline-none transition-all duration-200 text-gray-700 resize-y"
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 mt-6 flex justify-center items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:shadow-pink-500/20 focus:outline-none focus:ring-4 focus:ring-pink-500/20 active:scale-[0.98] transition-all duration-200 group"
                >
                    <div className="flex gap-2.5 items-center">
                        <span>Save Question</span>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                    </div>
                </button>
            </div>
        </form>
    );
}

export default Organizer;