import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { FiX, FiMenu, FiUser, FiLogOut, FiChevronRight } from 'react-icons/fi' // Added icons

const Navbar = () => {
    const { setShowSearch, showSearch, getCartCount, isLoggedIn, logoutUser, isAdmin } = useContext(ShopContext)
    const [visible, setVisible] = useState(false)
    const location = useLocation()

    const handleLogout = () => {
        logoutUser()
    }

    const isCollectionsPage = location.pathname === '/collections'

    const navLinkClasses = ({ isActive }) =>
        `flex flex-col items-center gap-1 text-sm transition-colors ${
            isActive ? 'text-green-500 font-semibold' : 'text-gray-700 hover:text-gray-900'
        }`

    return (
        <div className='flex items-center justify-between font-medium z-30 relative bg-transparent py-2'>
            <Link to={"/"}>
                <img 
                    src={assets.logotext} 
                    className="w-48 sm:w-62 transition duration-300 transform hover:scale-105" 
                    alt='logotext'
                />
            </Link>

            {/* Desktop Menu */}
            <ul className='hidden sm:flex gap-8'>
                <NavLink to="/" className={navLinkClasses}>
                    <p className='text-lg'>Home</p>
                </NavLink>
                <NavLink to="/collections" className={navLinkClasses}>
                    <p className='text-lg'>Collections</p>
                </NavLink>
                <NavLink to="/about" className={navLinkClasses}>
                    <p className='text-lg'>About</p>
                </NavLink>
                <NavLink to="/contact" className={navLinkClasses}>
                    <p className='text-lg'>Contact</p>
                </NavLink>
            </ul>

            <div className='flex items-center gap-4 sm:gap-6'>
                {isCollectionsPage && (
                    <img 
                        onClick={() => setShowSearch(!showSearch)} 
                        src={assets.search_icon} 
                        className='w-5 cursor-pointer hover:opacity-75 transition-opacity' 
                        alt="search-icon"
                    />
                )}

                {/* Profile Dropdown (Desktop) */}
                <div className='group relative hidden sm:block'>
                    <img src={assets.profile_icon} alt="profile-icon" className='w-5 cursor-pointer'/>
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-40'>
                        <div className='flex flex-col gap-2 w-40 py-3 px-5 bg-white text-gray-700 rounded shadow-xl border border-gray-100'>
                            {isLoggedIn && (
                                <>
                                    {isAdmin && (
                                        <Link to="/admin" className='cursor-pointer hover:text-red-600 font-bold border-b pb-2 mb-1 border-gray-100'>Admin Panel</Link>
                                    )}
                                    <Link to="/profile" className='cursor-pointer hover:text-green-500'>My Profile</Link>
                                    <Link to="/orders" className='cursor-pointer hover:text-green-500'>Orders</Link> 
                                </>
                            )}
                            {!isLoggedIn ? (
                                <Link to="/login" className='cursor-pointer hover:text-green-500 font-semibold'>Login</Link>
                            ) : (
                                <p onClick={handleLogout} className='cursor-pointer hover:text-green-500 font-semibold'>Logout</p>
                            )}
                        </div>
                    </div>
                </div>
                
                <Link to="/cart" className='relative'>
                    <img src={assets.shopping_cart} className='w-5 min-w-5' alt="shopping-cart-icon"/>
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-green-500 text-white aspect-square rounded-full text-[8px] font-bold'>{getCartCount()}</p>
                </Link>
                
                {/* Mobile Menu Toggle */}
                <div onClick={() => setVisible(true)} className='sm:hidden p-1 cursor-pointer text-gray-700'>
                    <FiMenu size={24} />
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${visible ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setVisible(false)}>
                <div 
                    className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 flex flex-col ${visible ? "translate-x-0" : "translate-x-full"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className='flex items-center justify-between p-6 border-b'>
                        <img src={assets.logotext} className='w-32' alt="" />
                        <button onClick={() => setVisible(false)} className='p-2 bg-gray-100 rounded-full text-gray-600'>
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className='flex flex-col py-6'>
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'Collections', path: '/collections' },
                            { name: 'About Us', path: '/about' },
                            { name: 'Contact', path: '/contact' }
                        ].map((item) => (
                            <NavLink 
                                key={item.path}
                                onClick={() => setVisible(false)} 
                                to={item.path}
                                className={({ isActive }) => `flex items-center justify-between px-8 py-4 text-lg font-medium transition-all ${isActive ? 'text-green-600 bg-green-50/50 border-r-4 border-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                {item.name}
                                <FiChevronRight size={18} className='opacity-30' />
                            </NavLink>
                        ))}
                    </div>

                    {/* User Section */}
                    <div className='mt-auto p-8 bg-gray-50/80 border-t'>
                        {isLoggedIn ? (
                            <div className='space-y-4'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700'>
                                        <FiUser size={24} />
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-500 uppercase tracking-wider font-bold'>Welcome back</p>
                                        <Link onClick={() => setVisible(false)} to="/profile" className='text-gray-800 font-bold hover:text-green-600'>View Profile</Link>
                                    </div>
                                </div>
                                
                                {isAdmin && (
                                    <Link onClick={() => setVisible(false)} to="/admin" className='block w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl text-center font-bold border border-red-100'>
                                        Admin Dashboard
                                    </Link>
                                )}
                                
                                <button 
                                    onClick={() => { handleLogout(); setVisible(false); }} 
                                    className='flex items-center justify-center gap-2 w-full py-3 text-gray-600 font-bold bg-white border border-gray-200 rounded-xl shadow-sm'
                                >
                                    <FiLogOut size={18} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                <p className='text-center text-sm text-gray-500 mb-4'>Login to track orders and save your favorites.</p>
                                <Link onClick={() => setVisible(false)} to="/login" className='block w-full py-4 bg-green-600 text-white rounded-xl text-center font-bold shadow-lg shadow-green-200 active:scale-95 transition-transform'>
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar