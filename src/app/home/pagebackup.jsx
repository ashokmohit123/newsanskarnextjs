import HomeGuruWiseKatha from '@/component/Home-backup/HomeGuruWiseKatha'
import HomeLiveChannel from '@/component/Home-backup/HomeLiveChannel'
import HomeLiveTvTop from '@/component/Home-backup/HomeLiveTvTop'
import HomeVideoAll from '@/component/Home-backup/HomeVideoAll'
import React from 'react'

const HomePage = () => {
  return (
   <>
   <HomeLiveTvTop />
   <HomeLiveChannel />
   <HomeGuruWiseKatha />
   <HomeVideoAll />
   </>
  )
}

export default HomePage
