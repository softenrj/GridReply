import React from 'react'
import Poll from "@/components/Poll"

async function page({ params }: { params: Promise<{ pollId: string }> }) {
    const param = await params;
    const pollId = param.pollId;

    return (
        <Poll pollId={pollId} />
    )
}

export default page