'use client'

import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header>
      <nav>
        <Link href='/' className='logo'>
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

          <p>DevSync</p>
        </Link>

        <ul>
          <Link href='/'>Home</Link>
          {isHomePage ? (
            <a href='#events'>Events</a>
          ) : (
            <Link href='/#events'>Events</Link>
          )}
          <Link href='/create-event'>Create Event</Link>
        </ul>
      </nav>
    </header>
  )
}


export default Navbar