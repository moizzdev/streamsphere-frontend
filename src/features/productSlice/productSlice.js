import api from '../../services/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const createProduct = createAsyncThunk("/products/create", async (data, thunkAPI) => {
    try {
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description || "")
        formData.append("price", data.price)
        if (data.coverImage) {
            formData.append("coverImage", data.coverImage)
        }

        let responce = await api.post('/products/create', formData)
        console.log(responce, 'Responce From Create Product Thunk');
        return responce.data.data
    } catch (error) {
        console.log(error, 'Error in Create Product Async thunk');
        return thunkAPI.rejectWithValue(error.response?.data || "Error in Create Product Thunk")
    }
})

export const getAllProducts = createAsyncThunk('/products/getAll', async (__, thunkAPI) => {
    try {
        let responce = await api.get('/products')
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in getAllProducts thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in getAllProducts thunk')
    }
})

export const getProduct = createAsyncThunk('/products/getOne', async (id, thunkAPI) => {
    try {
        let responce = await api.get(`/products/${id}`)
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in getProduct thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in getProduct thunk')
    }
})

export const updateProduct = createAsyncThunk('/products/update', async ({ id, data }, thunkAPI) => {
    try {
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description || "")
        formData.append("price", data.price)
        if (data.coverImage) {
            formData.append("coverImage", data.coverImage)
        }
        let responce = await api.patch(`/products/${id}`, formData)
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in updateProduct thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in updateProduct thunk')
    }
})

export const deleteProduct = createAsyncThunk('/products/delete', async (id, thunkAPI) => {
    try {
        let responce = await api.delete(`/products/${id}`)
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in deleteProduct thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in deleteProduct thunk')
    }
})

let initialState = {
    loading: false,
    products: {
        list: [],
        selected: null,
        error: null
    }
}

export const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {
        clearSelectedProduct: (state) => {
            state.products.selected = null
        }
    },

    extraReducers: (builder) => {
        builder.addCase(createProduct.pending, (state) => {
            state.loading = true
            state.products.error = null
        })

        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false
            state.products.list.unshift(action.payload)
        })

        builder.addCase(createProduct.rejected, (state, action) => {
            state.loading = false
            state.products.error = action.payload
        })

        builder.addCase(getAllProducts.pending, (state) => {
            state.loading = true
            state.products.error = null
        })

        builder.addCase(getAllProducts.fulfilled, (state, action) => {
            state.loading = false
            state.products.list = action.payload
        })

        builder.addCase(getAllProducts.rejected, (state, action) => {
            state.loading = false
            state.products.error = action.payload
        })

        builder.addCase(getProduct.pending, (state) => {
            state.loading = true
            state.products.error = null
        })

        builder.addCase(getProduct.fulfilled, (state, action) => {
            state.loading = false
            state.products.selected = action.payload
        })

        builder.addCase(getProduct.rejected, (state, action) => {
            state.loading = false
            state.products.error = action.payload
        })

        builder.addCase(updateProduct.pending, (state) => {
            state.loading = true
            state.products.error = null
        })

        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false
            let index = state.products.list.findIndex(p => p.id === action.payload.id)
            if (index !== -1) state.products.list[index] = action.payload
            state.products.selected = action.payload
        })

        builder.addCase(updateProduct.rejected, (state, action) => {
            state.loading = false
            state.products.error = action.payload
        })

        builder.addCase(deleteProduct.pending, (state) => {
            state.loading = true
            state.products.error = null
        })

        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false
            state.products.list = state.products.list.filter(p => p.id !== action.payload)
        })

        builder.addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false
            state.products.error = action.payload
        })
    }
})

export const { clearSelectedProduct } = productSlice.actions;

export default productSlice.reducer;