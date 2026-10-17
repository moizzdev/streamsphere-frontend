import api from '../../services/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const addToCart = createAsyncThunk("/cart/add", async (data, thunkAPI) => {
    try {
        let responce = await api.post('/cart/add', data)
        console.log(responce, 'Responce From Add To Cart Thunk');
        return responce.data.data
    } catch (error) {
        console.log(error, 'Error in Add To Cart Async thunk');
        return thunkAPI.rejectWithValue(error.response?.data || "Error in Add To Cart Thunk")
    }
})

export const getMyCart = createAsyncThunk('/cart/getMy', async (__, thunkAPI) => {
    try {
        let responce = await api.get('/cart/my-cart')
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in getMyCart thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in getMyCart thunk')
    }
})

export const updateCartItem = createAsyncThunk('/cart/update', async ({ id, quantity }, thunkAPI) => {
    try {
        let responce = await api.patch(`/cart/${id}`, { quantity })
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in updateCartItem thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in updateCartItem thunk')
    }
})

export const removeFromCart = createAsyncThunk('/cart/remove', async (id, thunkAPI) => {
    try {
        let responce = await api.delete(`/cart/${id}`)
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in removeFromCart thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in removeFromCart thunk')
    }
})

export const clearCart = createAsyncThunk('/cart/clear', async (__, thunkAPI) => {
    try {
        let responce = await api.delete('/cart/')
        return responce.data
    } catch (error) {
        console.log(error, 'error in clearCart thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in clearCart thunk')
    }
})

let initialState = {
    loading: false,
    cart: {
        list: [],
        error: null
    }
}

export const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addToCart.pending, (state) => {
            state.loading = true
            state.cart.error = null
        })
        builder.addCase(addToCart.fulfilled, (state) => {
            state.loading = false
            // The list is refetched via getMyCart after adding, rather
            // than trying to merge this single item in here — simpler
            // and avoids duplicate-vs-updated-quantity edge cases.
        })
        builder.addCase(addToCart.rejected, (state, action) => {
            state.loading = false
            state.cart.error = action.payload
        })

        builder.addCase(getMyCart.pending, (state) => {
            state.loading = true
            state.cart.error = null
        })
        builder.addCase(getMyCart.fulfilled, (state, action) => {
            state.loading = false
            state.cart.list = action.payload
        })
        builder.addCase(getMyCart.rejected, (state, action) => {
            state.loading = false
            state.cart.error = action.payload
        })

        builder.addCase(updateCartItem.fulfilled, (state, action) => {
            const index = state.cart.list.findIndex((i) => i.id === action.payload.id)
            if (index !== -1) state.cart.list[index] = { ...state.cart.list[index], quantity: action.payload.quantity }
        })

        builder.addCase(removeFromCart.fulfilled, (state, action) => {
            state.cart.list = state.cart.list.filter((i) => i.id !== action.payload)
        })

        builder.addCase(clearCart.fulfilled, (state) => {
            state.cart.list = []
        })
    }
})

export default cartSlice.reducer;