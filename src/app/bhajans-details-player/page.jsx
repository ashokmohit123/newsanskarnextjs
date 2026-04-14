import BhajanRow from '@/component/Bhajans/BhajanRow'
//import BhajansDetailsPlayer from '@/component/Bhajans/BhajansDetailsPlayer'
import PlayerBar from '@/component/Bhajans/PlayerBar'
import React from 'react'

const BhajansDetailsPlayerPage = () => {
  return (
   <>
   <BhajanRow title="Related Bhajan" />
   <BhajanRow title="Top 20 Bhajan" />
   {/* <BhajansDetailsPlayer /> */}
   <PlayerBar />
   </>
  )
}

export default BhajansDetailsPlayerPage
