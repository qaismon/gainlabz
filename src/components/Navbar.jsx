import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Navbar = () => {

    const {setShowSearch, showSearch, getCartCount, isLoggedIn, logoutUser, isAdmin} = useContext(ShopContext)
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
        <div className='flex items-center justify-between  font-medium z-30 relative bg-transparent'>
            <Link to={"/"}>
                <img 
                    src={assets.logotext} 
                    className="w-62 transition duration-300 transform hover:scale-110" 
                    alt='logotext'
                />
            </Link>

            <ul className='hidden sm:flex gap-8 '>
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

            <div className='flex items-center gap-6'>
                
                {isCollectionsPage && (
                    <img 
                        onClick={() => setShowSearch(!showSearch)} 
                        src={assets.search_icon} 
                        className='w-6 cursor-pointer hover:opacity-75 transition-opacity' 
                        alt="search-icon"
                    />
                )}

                <div className='group relative'>
                    <img src={assets.profile_icon} alt="profile-icon" className='w-6 cursor-pointer'/>
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-40'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-700 rounded shadow-lg border border-gray-100'>
                            
                            {isLoggedIn && (
                                <>
                                    
                                    {isAdmin && (
                                        <Link 
                                            to="/admin" 
                                            className='cursor-pointer hover:text-red-600 font-bold border-b pb-2 mb-1 border-gray-100'
                                        >
                                            Admin Panel
                                        </Link>
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
                    <img src={assets.shopping_cart} className='w-6 min-w-6' alt="shopping-cart-icon"/>
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] '>{getCartCount()}</p>
                </Link>
                
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="menu-icon"/>
            </div>

            <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white shadow-xl transition-all duration-300 z-50 ${visible ? "w-full sm:w-80" : "w-0"}`}>
                <div className='flex flex-col text-gray-800 h-full'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-5 cursor-pointer border-b hover:bg-gray-50'>
                        <img className='h-3 transform rotate-90' src={assets.dropdown_icon} alt="back-icon"/>
                        <p className='font-semibold'>Close Menu</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b hover:bg-gray-100" to="/">Home</NavLink>
                    <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b hover:bg-gray-100" to="/collections">Collections</NavLink>
                    <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b hover:bg-gray-100" to="/about">About</NavLink>
                    <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b hover:bg-gray-100" to="/contact">Contact</NavLink>
                    
                    
                    {isLoggedIn && isAdmin && (
                        <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b hover:bg-gray-100 text-red-600 font-bold" to="/admin">Admin Panel</NavLink>
                    )}
                    
                    <div className='mt-auto p-6 border-t'>
                        {!isLoggedIn ? (
                            <Link onClick={() => setVisible(false)} to="/login" className='block text-center py-2 bg-orange-500 text-white rounded font-bold'>Login</Link>
                        ) : (
                            <p onClick={() => { handleLogout(); setVisible(false); }} className='cursor-pointer text-center py-2 border border-red-500 text-red-500 rounded font-bold hover:bg-red-50'>Logout</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar