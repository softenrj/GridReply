import { Asterisk } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Navbar() {
    return (
        <div className='w-full bg-linear-to-l from-[#60c7ff] to-[#006aff] p-5'>
            <div className='flex gap-1 items-center'>
                <Asterisk className='text-white' />
                <h1 className='font-mono text-xl text-white shadow-2xs font-semibold'>GridReply</h1>
            </div>
            <div>


            </div>
        </div>
    )
}

export default Navbar
