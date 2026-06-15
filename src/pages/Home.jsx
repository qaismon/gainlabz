import React, { useEffect, useRef } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import MarqueeBanner from '../components/MarqueeBanner'
import OfferProducts from '../components/OfferProducts'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Home() {
  const bestSellerRef = useRef(null);
  const bestSellerWrapperRef = useRef(null);
  const heroRef = useRef(null);
  const latestRef = useRef(null);
  const offersRef = useRef(null);
  const policyRef = useRef(null);
  const newsletterRef = useRef(null);

  const scrollToBestSeller = () => {
    if (bestSellerRef.current) {
      bestSellerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        y: -50, opacity: 0, duration: 1, ease: 'power3.out'
      })

      gsap.fromTo(
        latestRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: latestRef.current, start: 'top 80%', once: true }
        }
      )
      gsap.fromTo(
        latestRef.current.querySelectorAll('.gsap-item'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: latestRef.current, start: 'top 80%', once: true }
        }
      )

      gsap.fromTo(
        offersRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: offersRef.current, start: 'top 80%', once: true }
        }
      )
      gsap.fromTo(
        offersRef.current.querySelectorAll('.gsap-item'),
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.07,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: offersRef.current, start: 'top 80%', once: true }
        }
      )

      gsap.fromTo(
        bestSellerWrapperRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: bestSellerWrapperRef.current, start: 'top 80%', once: true }
        }
      )
      gsap.fromTo(
        bestSellerWrapperRef.current.querySelectorAll('.gsap-item'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: bestSellerWrapperRef.current, start: 'top 80%', once: true }
        }
      )

      const cards = policyRef.current.querySelectorAll('.gsap-policy-card')
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.8 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.15,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: policyRef.current, start: 'top 82%', once: true }
        }
      )

      gsap.fromTo(
        newsletterRef.current,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.8)',
          scrollTrigger: { trigger: newsletterRef.current, start: 'top 85%', once: true }
        }
      )
    })

    ScrollTrigger.refresh()
    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize)

    return () => {
      ctx.revert()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div>
      <div ref={heroRef}>
        <Hero scrollToBestSeller={scrollToBestSeller}/>
      </div>

      <div ref={latestRef}>
        <LatestCollection/>
      </div>

      <div ref={offersRef}>
        <OfferProducts/>
      </div>

      <div ref={bestSellerWrapperRef}>
        <BestSeller ref={bestSellerRef}/>
      </div>

      <div ref={policyRef}>
        <OurPolicy/>
      </div>

      <div ref={newsletterRef}>
        <NewsletterBox/>
      </div>

      <MarqueeBanner/>
    </div>
  )
}

export default Home
