import heroImage from '@/images/hero-right-4.png'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
  className?: string
}

const SectionHero3: FC<Props> = ({ className = '' }) => {
  return (
    <div className={`relative w-[100vw] h-[85vh] min-h-[600px] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden flex items-center justify-center bg-neutral-900 group ${className}`}>
      
      {/* Background Image with Parallax & Hover Zoom */}
      <Image
        src={heroImage}
        alt="Sports equipment collection"
        fill
        className="object-cover transition-transform duration-[10000ms] ease-out group-hover:scale-110 opacity-60 mix-blend-overlay"
        sizes="100vw"
        priority
      />

      {/* Cinematic Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 lg:px-8 mt-20 text-center flex flex-col items-center">
        <span className="font-medium tracking-widest uppercase text-white/90 text-sm md:text-base fade--animation__subheading mb-4">
          In this season, find the best 🔥
        </span>
        
        <h2 className="text-4xl leading-[1.1] font-display font-medium text-white sm:text-5xl md:text-6xl lg:text-7xl fade--animation__heading mb-8 max-w-4xl">
          Sports equipment collection.
        </h2>
        
        <div className="fade--animation__button">
          <ButtonPrimary className="bg-white text-black hover:bg-neutral-200 border-none px-8 py-4 text-base font-medium rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-[1.02]">
            <span className="me-2">Start your search</span>
            <HugeiconsIcon icon={Search01Icon} size={24} />
          </ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

export default SectionHero3
