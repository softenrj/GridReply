"use client"

import React from 'react';
import { Eye, RotateCcw, EyeOff } from 'lucide-react';

interface OrganizerOptionsProps {
    onRevealAnswers?: () => void;
    onResetGrid?: () => void;
    isRevealed?: boolean;
}

export function OrganizerOptions({
    onRevealAnswers,
    onResetGrid,
    isRevealed = false
}: OrganizerOptionsProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-slate-100 shadow-xs my-4">
            <button
                type="button"
                onClick={onRevealAnswers}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs cursor-pointer select-none active:scale-95 ${isRevealed
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-sm'
                    }`}
            >
                {isRevealed ? (
                    <EyeOff className="w-4 h-4 shrink-0 text-amber-600" />
                ) : (
                    <Eye className="w-4 h-4 shrink-0" />
                )}
                <span>{isRevealed ? 'Hide Answers' : 'Reveal Answers'}</span>
            </button>

            <button
                type="button"
                onClick={onResetGrid}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 shadow-2xs cursor-pointer select-none active:scale-95"
            >
                <RotateCcw className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Reset Grid</span>
            </button>
        </div>
    );
}

export default OrganizerOptions;