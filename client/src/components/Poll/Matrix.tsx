"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Grid3X3, CheckCircle2, CircleDashed, LayoutGrid, CheckSquare, XSquare, MoveHorizontal, X } from 'lucide-react';
import { Poll } from '../../../types/poll';
import { getSocket } from '@/service/socket';
import { ANSWER_POLL, UPDATED_POLL, REVEAL_ANSWERS, RESET_GRID } from '../../../utils/api/socket';
import { getApi } from '../../../utils/api/common';
import { GET_ANSWERS } from '../../../utils/api/APIConstants';
import { ApiResponse } from '../../../types/ApiResponse';

export function MatrixCard({ label, value, icon: Icon, colorClass }: any) {
    return (
        <div className="flex flex-col p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 bg-white shadow-xs hover:shadow-sm transition-all overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${colorClass}`} />
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">{label}</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-800">{value}</p>
        </div>
    );
}

function Matrix({ poll, onPollUpdate }: { poll: Poll | null, onPollUpdate: (poll: Poll) => void }) {
    const row = poll?.rows ?? 10;
    const col = poll?.cols ?? 10;
    const totalCells = row * col;

    const [answeredCells, setAnsweredCells] = useState<Record<string, number>>({});
    const [lastAnsweredCell, setLastAnsweredCell] = useState<string | null>(null);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number; answer?: number } | null>(null);
    const [revealedAnswers, setRevealedAnswers] = useState<Record<string, { isCorrect: boolean, correctAnswer?: any }>>({});

    const gridRef = useRef<HTMLDivElement | null>(null);
    const socket = getSocket();

    // Lookup option object matching answer value (matches by option.id or 1-based array index)
    const getAnswerOption = (answerVal?: number) => {
        if (answerVal === undefined || !poll?.options) return null;
        return (
            poll.options.find(
                (opt: any) => opt.id === String(answerVal) || opt._id === String(answerVal)
            ) || poll.options[answerVal - 1]
        );
    };

    // 1. Sync initial answered cells from poll prop if existing data is present
    useEffect(() => {
        if (poll && (poll as any).answers) {
            const initialMap: Record<string, number> = {};
            ((poll as any).answers as Array<{ row: number; col: number; answer: number }>).forEach((item) => {
                initialMap[`${item.row}-${item.col}`] = item.answer;
            });
            setAnsweredCells(initialMap);
        }
    }, [poll]);

    // 1.5. Fetch persisted answers from database
    useEffect(() => {
        const fetchAnswers = async () => {
            if (!poll?._id) return;

            try {
                const res = await getApi<ApiResponse<Array<{ row: number; col: number; answer: any }>>>({
                    url: GET_ANSWERS + `/${poll._id}`
                });

                if (res?.success && res?.data) {
                    const answersMap: Record<string, number> = {};
                    res.data.forEach((ans: any) => {
                        answersMap[`${ans.row}-${ans.col}`] = ans.answer;
                    });
                    setAnsweredCells(answersMap);
                }
            } catch (error) {
                console.log('[Error] fetching answers:', error);
            }
        };

        fetchAnswers();
    }, [poll?._id]);

    // 2. Click Handler for cell interaction
    useEffect(() => {
        const gridElement = gridRef.current;
        if (!gridElement) return;

        const handleGridClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const cell = target.closest('.matrix-cell');

            if (!cell) return;

            const r = Number(cell.getAttribute('data-row'));
            const c = Number(cell.getAttribute('data-col'));
            const cellId = `${r}-${c}`;

            setSelectedCell({
                row: r,
                col: c,
                answer: answeredCells[cellId]
            });
        };

        gridElement.addEventListener('click', handleGridClick);

        return () => {
            gridElement.removeEventListener('click', handleGridClick);
        };
    }, [answeredCells]);

    // 3. Socket Listener for Poll Updates
    useEffect(() => {
        if (!socket) return;

        const handlePollUpdate = (response: { success: boolean, data: Poll }) => {
            if (response.success) {
                onPollUpdate(response.data);
            }
        };

        socket.on(UPDATED_POLL, handlePollUpdate);

        return () => {
            socket.off(UPDATED_POLL, handlePollUpdate);
        };
    }, [poll?._id, socket, onPollUpdate]);

    // 4. Socket Listener for Live Answers
    useEffect(() => {
        if (!socket) return;

        const handleAnswerPoll = (response: {
            col: number,
            row: number,
            answer: number,
            success: boolean,
            message: string
        }) => {
            if (response.success) {
                const cellKey = `${response.row}-${response.col}`;

                setAnsweredCells(prev => ({
                    ...prev,
                    [cellKey]: response.answer
                }));

                setLastAnsweredCell(cellKey);
                setTimeout(() => setLastAnsweredCell(null), 1500);
            }
        };

        socket.on(ANSWER_POLL, handleAnswerPoll);

        return () => {
            socket.off(ANSWER_POLL, handleAnswerPoll);
        };
    }, [socket]);

    // 5. Socket Listener for Reveal Answers
    useEffect(() => {
        if (!socket) return;

        const handleRevealAnswers = (response: {
            answers: Array<{ row: number, col: number, answer: any, isCorrect: boolean, _id: string }>,
            correctAnswer: any,
            success: boolean,
            message: string
        }) => {
            if (response.success) {
                const revealMap: Record<string, { isCorrect: boolean, correctAnswer: any }> = {};
                response.answers.forEach(ans => {
                    const cellKey = `${ans.row}-${ans.col}`;
                    revealMap[cellKey] = {
                        isCorrect: ans.isCorrect,
                        correctAnswer: response.correctAnswer
                    };
                });
                setRevealedAnswers(revealMap);
            }
        };

        socket.on(REVEAL_ANSWERS, handleRevealAnswers);

        return () => {
            socket.off(REVEAL_ANSWERS, handleRevealAnswers);
        };
    }, [socket]);

    // 6. Socket Listener for Reset Grid
    useEffect(() => {
        if (!socket) return;

        const handleResetGrid = (response: { success: boolean, message: string }) => {
            if (response.success) {
                setAnsweredCells({});
                setRevealedAnswers({});
                setSelectedCell(null);
                setLastAnsweredCell(null);
            }
        };

        socket.on(RESET_GRID, handleResetGrid);

        return () => {
            socket.off(RESET_GRID, handleResetGrid);
        };
    }, [socket]);

    const answeredCount = Object.keys(answeredCells).length;
    const selectedOption = getAnswerOption(selectedCell?.answer);

    return (
        <div className="w-full min-w-0 overflow-hidden mx-auto my-2 sm:my-6 p-4 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-3xl shadow-xs border border-slate-100 font-sans relative">

            <div className="flex items-center gap-3 pb-4 sm:pb-6 border-b border-slate-200/80 mb-4 sm:mb-6">
                <div className="p-2 bg-pink-100 rounded-xl shrink-0">
                    <Grid3X3 strokeWidth={1.5} className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                </div>
                <div className="min-w-0">
                    <h2 className="uppercase tracking-widest text-transparent bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text font-bold text-lg sm:text-xl">
                        Matrix Grid
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                        Dimensions: {poll?.rows} &times; {poll?.cols}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 pb-4">
                <MatrixCard label="Total Area" value={totalCells} icon={LayoutGrid} colorClass="text-purple-500" />
                <MatrixCard label="Answered" value={answeredCount} icon={CheckSquare} colorClass="text-blue-500" />
                <MatrixCard label="Unanswered" value={totalCells - answeredCount} icon={XSquare} colorClass="text-slate-400" />
                <MatrixCard label="Progress" value={`${Math.round((answeredCount / totalCells) * 100) || 0}%`} icon={CheckCircle2} colorClass="text-emerald-500" />
            </div>

            <div className="min-w-0 space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xs border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <span className="text-xs sm:text-sm font-semibold text-slate-500 mr-1">Legend:</span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-50 rounded-full border border-slate-200">
                            <CircleDashed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-600">Unanswered</span>
                        </div>
                        {Object.keys(revealedAnswers).length === 0 ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-blue-50 rounded-full border border-blue-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="text-[10px] sm:text-xs font-semibold text-blue-700">Answered</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-yellow-50 rounded-full border border-yellow-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                                    <span className="text-[10px] sm:text-xs font-semibold text-yellow-700">Correct</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-red-50 rounded-full border border-red-200">
                                    <X className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                    <span className="text-[10px] sm:text-xs font-semibold text-red-700">Wrong</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-1.5 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full w-fit">
                        <MoveHorizontal className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Swipe to scroll</span>
                    </div>
                </div>

                <div className="w-full overflow-x-auto scrollbar xl:max-h-[560px] pb-2 sm:pb-4 rounded-lg sm:rounded-none">
                    <div
                        ref={gridRef}
                        id="grid"
                        className="grid gap-1.5 sm:gap-2 w-fit mx-auto p-1"
                        style={{
                            gridTemplateColumns: `repeat(${col}, 48px)`,
                            gridTemplateRows: `repeat(${row}, 48px)`,
                        }}
                    >
                        {Array.from({ length: poll?.rows ?? 0 }).map((_, i) => (
                            Array.from({ length: poll?.cols ?? 0 }).map((_, j) => {
                                const cellId = `${i + 1}-${j + 1}`;
                                const isAnswered = cellId in answeredCells;
                                const isJustAnswered = lastAnsweredCell === cellId;
                                const cellAnswerOpt = getAnswerOption(answeredCells[cellId]);
                                const isRevealed = cellId in revealedAnswers;
                                const revealData = revealedAnswers[cellId];

                                return (
                                    <div
                                        key={`cell-${i}-${j}`}
                                        data-row={i + 1}
                                        data-col={j + 1}
                                        className={`matrix-cell relative flex flex-col items-center justify-center rounded-lg sm:rounded-xl border text-[9px] sm:text-[10px] font-semibold transition-all duration-200 cursor-pointer sm:hover:scale-105 select-none
                                            ${isJustAnswered && !isRevealed
                                                ? 'bg-blue-100 border-blue-400 text-blue-800 ring-2 ring-blue-300 scale-105'
                                                : isRevealed && isAnswered
                                                    ? revealData.isCorrect
                                                        ? 'bg-yellow-100 border-yellow-400 text-yellow-800 ring-2 ring-yellow-300'
                                                        : 'bg-red-100 border-red-400 text-red-800 ring-2 ring-red-300'
                                                    : isAnswered && !isRevealed
                                                        ? 'bg-blue-50/80 border-blue-200 text-blue-700 shadow-2xs'
                                                        : 'bg-white border-slate-200 text-slate-400 hover:border-pink-200 hover:bg-pink-50/50'
                                            }`}
                                        title={`Row ${i + 1}, Col ${j + 1}${cellAnswerOpt ? `: ${cellAnswerOpt.text}` : ''}`}
                                    >
                                        <span className={isAnswered ? "text-slate-400 text-[8px]" : ""}>
                                            {i + 1},{j + 1}
                                        </span>
                                        {isAnswered && (
                                            <span className={`font-bold text-[9px] leading-none mt-0.5 truncate max-w-[40px] px-0.5 ${isRevealed
                                                ? revealData.isCorrect
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                                : 'text-blue-600'
                                                }`}>
                                                {cellAnswerOpt ? cellAnswerOpt.text : `#${answeredCells[cellId]}`}
                                            </span>
                                        )}
                                    </div>
                                )
                            })
                        ))}
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {selectedCell && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4 animate-in fade-in duration-150"
                    onClick={() => setSelectedCell(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-lg border border-slate-100 w-full max-w-sm overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between bg-slate-50/80 p-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                                Cell Position ({selectedCell.row}, {selectedCell.col})
                            </h3>
                            <button
                                onClick={() => setSelectedCell(null)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col items-center justify-center text-center">
                            {poll?.question && (
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                    Q: {poll.question}
                                </p>
                            )}

                            {selectedCell.answer !== undefined ? (
                                <>
                                    <div className={`w-full rounded-xl p-4 flex flex-col items-center gap-1 shadow-2xs border ${revealedAnswers[`${selectedCell.row}-${selectedCell.col}`]?.isCorrect
                                        ? 'bg-yellow-50/70 border-yellow-100'
                                        : revealedAnswers[`${selectedCell.row}-${selectedCell.col}`]
                                            ? 'bg-red-50/70 border-red-100'
                                            : 'bg-blue-50/70 border-blue-100'
                                        }`}>
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${revealedAnswers[`${selectedCell.row}-${selectedCell.col}`]?.isCorrect
                                            ? 'text-yellow-400'
                                            : revealedAnswers[`${selectedCell.row}-${selectedCell.col}`]
                                                ? 'text-red-400'
                                                : 'text-blue-400'
                                            }`}>
                                            {revealedAnswers[`${selectedCell.row}-${selectedCell.col}`]?.isCorrect
                                                ? '✓ Correct Answer'
                                                : revealedAnswers[`${selectedCell.row}-${selectedCell.col}`]
                                                    ? '✗ Wrong Answer'
                                                    : 'User Answer'}
                                        </span>
                                        <span className={`text-xl font-extrabold ${revealedAnswers[`${selectedCell.row}-${selectedCell.col}`]?.isCorrect
                                            ? 'text-yellow-700'
                                            : revealedAnswers[`${selectedCell.row}-${selectedCell.col}`]
                                                ? 'text-red-700'
                                                : 'text-blue-700'
                                            }`}>
                                            {selectedOption ? selectedOption.text : `Option #${selectedCell.answer}`}
                                        </span>
                                    </div>
                                    {revealedAnswers[`${selectedCell.row}-${selectedCell.col}`] && (
                                        <div className="w-full mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                                                Correct Answer
                                            </span>
                                            <span className="text-lg font-extrabold text-slate-700">
                                                {revealedAnswers[`${selectedCell.row}-${selectedCell.col}`].correctAnswer || 'N/A'}
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center flex flex-col items-center text-slate-400 py-2">
                                    <CircleDashed className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-500">No answer provided yet</span>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-slate-50/80 border-t border-slate-100">
                            <button
                                onClick={() => setSelectedCell(null)}
                                className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Matrix;