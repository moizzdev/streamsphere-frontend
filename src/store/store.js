import { configureStore } from '@reduxjs/toolkit'
import authenticationSlice from '../features/authentication/authenticationSlice'
import productSlice from '../features/productSlice/productSlice'
import chatSlice from '../features/chatSlice/chatSlice'
import orderReducer from '../features/productSlice/orderSlice'
import cartReducer from '../features/productSlice/cartSlice'

export const store = configureStore({
    reducer: {
        authentication: authenticationSlice,
        products: productSlice,
        chats: chatSlice,
        orders: orderReducer,
        cart: cartReducer
    }
})