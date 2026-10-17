import React from 'react';
import Home from './pages/Home/Home';
import { Route, Routes } from 'react-router';
import Login from './forms/Login';
import Register from './forms/Register';
import CommunityPage from './pages/community/CommunityPage';
import AboutPage from './pages/about/AboutPage';
import ProfilePage from './pages/profile/ProfilePage';
import ChatPage from './pages/chat/ChatPage';
import Products from './pages/products/Products'
import ProductDetailPage from './pages/products/ProductDetailPage';
import Subscription from './pages/subscription/Subscription';
import SettingsPage from './pages/settings/SettingsPage';
import CheckoutPage from './pages/products/CheckoutPage';
import OrderConfirmedPage from './pages/products/OrderConfirmed';
import CartPage from './pages/products/CartPage';
import UserProfilePage from './pages/profile/UserProfilePage';
import AdminRoute from './pages/admin/AdminRoute';
import AdminPanel from './pages/admin/AdminPanel';

export default function App() {

    
    return (
        <>
        <Routes>
            <Route path='/' element={<Home></Home>}/>
            <Route path='/chat' element={<ChatPage></ChatPage>}/>
            <Route path='/products' element={<Products></Products>}/>
            <Route path='/community' element={<CommunityPage></CommunityPage>}/>
            <Route path='/about' element={<AboutPage></AboutPage>}/>
            <Route path='/profile' element={<ProfilePage></ProfilePage>}/>
            <Route path='/login' element={<Login></Login>}/>
            <Route path='/register' element={<Register></Register>}/>
            <Route path='/products/:id' element={<ProductDetailPage></ProductDetailPage>}/>
            <Route path='/subscription' element={<Subscription></Subscription>}/>
            <Route path='/settings' element={<SettingsPage></SettingsPage>}/>
            <Route path='/checkout/:id' element={<CheckoutPage></CheckoutPage>}/>
            <Route path='/order-confirmed/:id' element={<OrderConfirmedPage></OrderConfirmedPage>}/>
            <Route path='/cart' element={<CartPage></CartPage>}/>
            <Route path='/users/:id' element={<UserProfilePage></UserProfilePage>}/>
            <Route path="/admin" element={<AdminRoute><AdminPanel/></AdminRoute>} />
        </Routes>
        </>
    );
}