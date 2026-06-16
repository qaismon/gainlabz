import React, { useRef } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import MarqueeBanner from '../components/MarqueeBanner'
import OfferProducts from '../components/OfferProducts'
import RecommendedForYou from '../components/RecommendedForYou'

function Home() {
  const bestSellerRef = useRef(null);

  const scrollToBestSeller = () => {
    if (bestSellerRef.current) {
      bestSellerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  return (
    <div>
      <div>
        <Hero scrollToBestSeller={scrollToBestSeller}/>
      </div>

      <div>
        <LatestCollection/>
      </div>

      <div>
        <OfferProducts/>
      </div>

      <div>
        <BestSeller ref={bestSellerRef}/>
      </div>

      <RecommendedForYou/>

      <div>
        <OurPolicy/>
      </div>

      <div>
        <NewsletterBox/>
      </div>

      <MarqueeBanner/>
    </div>
  )
}

export default Home
