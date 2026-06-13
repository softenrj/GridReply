"use client"

import React from 'react'
import Navbar from '../common/Navbar'
import Participant from './Participant'
import Organizer from './Organizer'
import Matrix from './Matrix'
import { Poll } from '../../../types/poll'
import { ApiResponse } from '../../../types/ApiResponse'
import { GET_POLL } from '../../../utils/api/APIConstants'
import { getApi } from '../../../utils/api/common'
import toast from 'react-hot-toast'
import { getSocket } from '@/service/socket'
import { JOIN_SESSION, JOIN_STATUS } from '../../../utils/api/socket'

function index({ pollId }: { pollId: string }) {
    const [poll, setPoll] = React.useState<Poll | null>(null)
    const [isOrganizer, setIsOrganizer] = React.useState<boolean>(false);
    const socket = getSocket();

    React.useEffect(() => {
        const org = !!localStorage.getItem('gridreply::token');
        setIsOrganizer(org);
    }, [])

    const handleUpdatePoll = (poll: Poll) => setPoll(poll);

    const loadPoll = async () => {
        try {
            if (!pollId) return;
            const res = await getApi<ApiResponse<Poll>>({
                url: GET_POLL + `/${pollId}`
            })

            if (res?.success) {
                setPoll(res.data);
            } else if (!res?.success && res?.message) {
                const isCurrentlyOrganizer = !!localStorage.getItem('gridreply::token');
                if (!isCurrentlyOrganizer) toast.error(res?.message);
            }
        } catch (error: any) {
            console.log(error);
            const isCurrentlyOrganizer = !!localStorage.getItem('gridreply::token');

            if (!isCurrentlyOrganizer) {
                toast.error(error?.response?.data?.message || "Poll not found or something went wrong");
            }
        }
    }

    React.useEffect(() => {
        loadPoll();
    }, [pollId])



    // try to connect to the poll
    React.useEffect(() => {
        if (!socket || !pollId) return;

        const joinSession = () => {
            socket.emit(JOIN_SESSION, {
                sessionCode: pollId
            })
        }

        joinSession();

        const handleJoin = (response: { success: boolean, message: string }) => {
            if (!response.success) joinSession();
            console.log('[GRIDREPLY:SOCKET] ', response.message);
        }

        socket.on(JOIN_STATUS, handleJoin)

        return () => {
            socket.off(JOIN_STATUS, handleJoin);
        }
    }, [])

    return (
        <div className='min-h-screen w-full bg-white'>
            <Navbar />

            <div className='p-3 w-full flex flex-col lg:flex-row gap-4'>
                {isOrganizer ? (
                    <Organizer sessionId={pollId} poll={poll} pollId={poll?._id!} onPoll={handleUpdatePoll} />
                ) : (
                    poll && <Participant poll={poll} />
                )}
                <Matrix poll={poll} onPollUpdate={handleUpdatePoll} />
            </div>
        </div>
    )
}

export default index