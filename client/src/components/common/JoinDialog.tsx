"use client";

import React from "react";
import Dialog from "./Dialog";
import { useRouter } from "next/navigation";

function JoinDialog({
    onClose,
    open,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [code, setCode] = React.useState("");
    const router = useRouter();

    const handleRedirect = () => {
        router.push(`/poll/${code}`);
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="w-[420px] p-6">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-zinc-900">
                        Join Session
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        Enter the session code shared by the host.
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-zinc-700">
                        Session Code
                    </label>

                    <input
                        autoFocus
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
                        placeholder="GR4X2K"
                        maxLength={6}
                        minLength={6}
                        className=" w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center font-mono text-lg font-semibold tracking-[0.3em] text-zinc-900 outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />

                    <p className="text-xs text-zinc-400">
                        Codes look like GR4X2K
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className=" flex-1 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
                        Cancel
                    </button>

                    <button
                        disabled={code.length < 6}
                        className=" flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                        onClick={handleRedirect}
                    >
                        Join Session
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

export default JoinDialog;