"use client";

import VideoAll from '@/component/Videos/VideoAll'
import React from 'react'
import { useParams } from "next/navigation";

const viewAllPage = () => {
    const { id } = useParams(); // guru_id
  return (
   <>
   <VideoAll guruId={id} />
   </>
  )
}

export default viewAllPage
