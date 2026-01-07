
import Image from 'next/image'
import Link from 'next/link'

const ExploreBtn = () => {
  return (
    <button type='button' id='explore-btn' className='mt-7 mx-auto'>
      <Link href='#events' className='flex items-center justify-center gap-3 w-full h-full'>
        Explore Events
        <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
      </Link>
    </button>
  )
}

export default ExploreBtn