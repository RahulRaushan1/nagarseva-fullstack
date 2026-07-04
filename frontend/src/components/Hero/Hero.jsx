import React from 'react'
import styles from './Hero.module.css'
import HeroLeft from './HeroLeft'
import HeroRight from './HeroRight'

const Hero = () => {
  return (
   <section className={styles.hero_section}>

    <HeroLeft />
    <HeroRight />

</section>
  )
}

export default Hero
