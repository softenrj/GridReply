"use client"
import React from 'react';
import { Grid3X3, CheckCircle2, CircleDashed, LayoutGrid, CheckSquare, XSquare, MoveHorizontal } from 'lucide-react';
import { Poll } from '../../../types/poll';
import { getApi } from '../../../utils/api/common';
import { ApiResponse } from '../../../types/ApiResponse';
import { GET_POLL } from '../../../utils/api/APIConstants';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function MatrixCard({ label, value, icon: Icon, colorClass }: any) {
    return (
        <div className="flex flex-col p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${colorClass}`} />
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">{label}</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-800">{value}</p>
        </div>
    );
}

function Matrix({ poll }: { poll: Poll | null }) {

    const row = 10;
    const col = 10;
    const totalCells = row * col;

    const [answeredCells, setAnsweredCells] = React.useState(new Set());
    const gridRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const gridElement = gridRef.current;
        if (!gridElement) return;

        const handleGridClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const cell = target.closest('.matrix-cell');

            if (!cell) return;

            const r = cell.getAttribute('data-row');
            const c = cell.getAttribute('data-col');
            const cellId = `${r}-${c}`;

            setAnsweredCells(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cellId)) {
                    newSet.delete(cellId);
                } else {
                    newSet.add(cellId);
                }
                return newSet;
            });
        };

        gridElement.addEventListener('click', handleGridClick);

        return () => {
            gridElement.removeEventListener('click', handleGridClick);
        };
    }, []);



    return (
        <div className="w-full min-w-0 overflow-hidden mx-auto my-2 sm:my-6 p-4 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 font-sans">

            <div className="flex items-center gap-3 pb-4 sm:pb-6 border-b border-gray-200 mb-4 sm:mb-6">
                <div className="p-2 bg-pink-100 rounded-xl shrink-0">
                    <Grid3X3 strokeWidth={1.5} className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                </div>
                <div className="min-w-0">
                    <h2 className="uppercase tracking-widest text-transparent bg-linear-to-r from-red-500 to-pink-500 bg-clip-text font-bold text-lg sm:text-xl">
                        Matrix Grid
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">
                        Dimensions: {poll?.rows} &times; {poll?.cols}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 pb-4">
                <MatrixCard label="Total Area" value={totalCells} icon={LayoutGrid} colorClass="text-purple-500" />
                <MatrixCard label="Answered" value={answeredCells.size} icon={CheckSquare} colorClass="text-blue-500" />
                <MatrixCard label="Unanswered" value={totalCells - answeredCells.size} icon={XSquare} colorClass="text-gray-400" />
                <MatrixCard label="Progress" value={`${Math.round((answeredCells.size / totalCells) * 100) || 0}%`} icon={CheckCircle2} colorClass="text-emerald-500" />
            </div>

            <div className="min-w-0 space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <span className="text-xs sm:text-sm font-semibold text-gray-500 mr-1">Legend:</span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gray-50 rounded-full border border-gray-200">
                            <CircleDashed className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="text-[10px] sm:text-xs font-semibold text-gray-600">Unanswered</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-blue-50 rounded-full border border-blue-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="text-[10px] sm:text-xs font-semibold text-blue-600">Answered</span>
                        </div>
                    </div>

                    <div className="flex md:hidden items-center gap-1.5 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                        <MoveHorizontal className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Swipe to scroll</span>
                    </div>
                </div>

                <div className="w-full overflow-x-auto scrollbar xl:max-h-140 pb-2 sm:pb-4 rounded-lg sm:rounded-none" >
                    <div
                        ref={gridRef}
                        id="grid"
                        className="grid gap-1 sm:gap-2"
                        style={{
                            gridTemplateColumns: `repeat(${col}, 48px)`,
                            gridTemplateRows: `repeat(${row}, 48px)`,
                        }}
                    >
                        {Array.from({ length: poll?.rows ?? 0 }).map((_, i) => (
                            Array.from({ length: poll?.cols ?? 0 }).map((_, j) => {
                                const isAnswered = answeredCells.has(`${i + 1}-${j + 1}`);

                                return (
                                    <div
                                        key={`cell-${i}-${j}`}
                                        data-row={i + 1}
                                        data-col={j + 1}
                                        className={`matrix-cell relative flex items-center justify-center rounded-lg sm:rounded-xl border text-[9px] sm:text-[10px] font-semibold transition-all duration-200 cursor-pointer sm:hover:scale-105 select-none
                            ${isAnswered
                                                ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-400 sm:hover:border-pink-300 sm:hover:bg-pink-50'
                                            }`}
                                        title={`Row ${i + 1}, Col ${j + 1}`}
                                    >
                                        <span>{i + 1},{j + 1}</span>
                                    </div>
                                )
                            })
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Matrix;