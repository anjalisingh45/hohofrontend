import React from 'react'
import Hero from '../../components/HeroSection/Hero'
import HowItWorks from '../../components/HowItWorks/HowItWorks'
import ServicesSec from '../../components/ServicesSec/servicesCard'
import Cta from '../../components/CTA/Cta'

const Home = () => {
    return (
        <>
            <Hero />
            <ServicesSec />
            <HowItWorks />
            <Cta />
        </>
    )
}

export default Home