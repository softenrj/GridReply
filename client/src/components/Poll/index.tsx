"use client"

import React from 'react'
import Navbar from '../common/Navbar'
import Participant from './Participant'
import Organizer from './Organizer'
import Matrix from './Matrix'

function index() {
    return (
        <div className='min-h-screen w-full bg-white'>
            <Navbar />

            <div className='p-3 w-full flex flex-col lg:flex-row  gap-4'>
                {/* <Participant /> */}
                <Organizer />
                <Matrix />
            </div>
        </div>
    )
}

export default index