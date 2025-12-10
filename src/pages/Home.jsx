import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import { useRef } from 'react'
import MarqueeBanner from '../components/MarqueeBanner'
import OfferProducts from '../components/OfferProducts'

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
      <Hero scrollToBestSeller={scrollToBestSeller}/>
      
     
      <LatestCollection/>
       <OfferProducts/>
      <BestSeller ref={bestSellerRef}/>
      <OurPolicy/>
      <NewsletterBox/>
      <MarqueeBanner/>
    </div>
  )
}

export default Home