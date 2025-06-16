import React from 'react'
import Header from './Header'
import Footer from './Footer'

const MainLayout = ({ children }) => {
    return (
        <div className='w-screen *:w-full'>
            <Header />
            <main className=' bg-white dark:bg-gray-900'>{children}</main>
            <Footer />
        </div>
    )
}

export default MainLayout
