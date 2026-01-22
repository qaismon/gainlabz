import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import PrivacyPolicy from './pages/Privacy'
import Contact from "./pages/Contact"
import Product from "./pages/Product"
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CursorSpotlightWrapper from './components/CursorSpotlightwrapper'


// 🔑 Admin Imports
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/admin/Dashboard'; 
import AddProduct from './pages/admin/AddProduct'; 
import ListProducts from './pages/admin/ListProducts'; 
import EditProduct from './pages/admin/EditProduct'
import AdminOrders from './pages/admin/AdminOrders';
import Users from './pages/admin/Users'
import AdminOfferSetter from './pages/admin/AdminOfferSetter'
import ScrollToTop from './components/ScrollToTop'



const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      
      <ToastContainer 
        position="top-right"
        autoClose={500}    
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      /> 
      
      <Navbar/>
      <SearchBar/>
      <ScrollToTop/>



      <Routes>
        
        <Route path='/' element={<Home/>}/>
        <Route path='/collections' element={<Collection/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/place-order' element={<PlaceOrder/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/privacy' element={<PrivacyPolicy/>}/>
        
   
        <Route path="/admin/*" element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />              
            <Route path="add-product" element={<AddProduct />} /> 
            <Route path="list-products" element={<ListProducts />} /> 
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="offers" element={<AdminOfferSetter />} />
            <Route path="orders" element={<AdminOrders />} />  
            <Route path="users" element={<Users />} />  
                  
          </Route>
        </Route>

      </Routes>
      <Footer/>
    </div>
  )
}

export default App;