import { Outlet } from '@tanstack/react-router'
import { AppSidebar } from '../components/Sidebar'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Navbar setSidebarOpen={setSidebarOpen} />
      <AppSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />
      <Outlet />
    </>
  )
}
