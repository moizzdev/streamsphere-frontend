import api from '../../services/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const createOrder = createAsyncThunk("/orders/create", async (data, thunkAPI) => {
    try {
        let responce = await api.post('/orders/create', data)
        console.log(responce, 'Responce From Create Order Thunk');
        return responce.data.data
    } catch (error) {
        console.log(error, 'Error in Create Order Async thunk');
        return thunkAPI.rejectWithValue(error.response?.data || "Error in Create Order Thunk")
    }
})

export const getMyOrders = createAsyncThunk('/orders/getMy', async (__, thunkAPI) => {
    try {
        let responce = await api.get('/orders/my-orders')
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in getMyOrders thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in getMyOrders thunk')
    }
})

export const getOrder = createAsyncThunk('/orders/getOne', async (id, thunkAPI) => {
    try {
        let responce = await api.get(`/orders/${id}`)
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in getOrder thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in getOrder thunk')
    }
})

let initialState = {
    loading: false,
    orders: {
        list: [],
        selected: null,
        error: null
    }
}

export const orderSlice = createSlice({
    name: "orderSlice",
    initialState,
    reducers: {
        clearSelectedOrder: (state) => {
            state.orders.selected = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true
            state.orders.error = null
        })
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false
            state.orders.selected = action.payload
            state.orders.list.unshift(action.payload)
        })
        builder.addCase(createOrder.rejected, (state, action) => {
            state.loading = false
            state.orders.error = action.payload
        })

        builder.addCase(getMyOrders.pending, (state) => {
            state.loading = true
            state.orders.error = null
        })
        builder.addCase(getMyOrders.fulfilled, (state, action) => {
            state.loading = false
            state.orders.list = action.payload
        })
        builder.addCase(getMyOrders.rejected, (state, action) => {
            state.loading = false
            state.orders.error = action.payload
        })

        builder.addCase(getOrder.pending, (state) => {
            state.loading = true
            state.orders.error = null
        })
        builder.addCase(getOrder.fulfilled, (state, action) => {
            state.loading = false
            state.orders.selected = action.payload
        })
        builder.addCase(getOrder.rejected, (state, action) => {
            state.loading = false
            state.orders.error = action.payload
        })
    }
})

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;