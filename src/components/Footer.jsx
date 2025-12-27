import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router'

function Footer() {
        const navigate=useNavigate()

  return (
    
    <>
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm'>
        <div>
             <Link to={"/"}>
            <img src={assets.logotext} className='mb-5 w-32 ' alt="" />
            </Link>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li  className="cursor-pointer" onClick={() => navigate("/")}>Home</li>
                    <li  className="cursor-pointer" onClick={() => navigate("/about")}>About Us</li>
                    <li className="cursor-pointer" onClick={() => navigate("/privacy")}>Privacy Policy</li>

                </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>Get In Touch</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+91 23232323</li>
                <li>gainlabz@gmail.com</li> 
                </ul>
        </div>

    </div>
     <div>
            <hr className='border-gray-300'/>
            <p className='py-5 text-sm text-center'>Copyright 2025© All Rights Reserved</p>
        </div>
        </>
  )
}

export default Footer