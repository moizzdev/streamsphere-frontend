import api from '../../services/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const becomeStreamer = createAsyncThunk('/users/becomeStreamer', async (__, thunkAPI) => {
    try {
        let responce = await api.patch('/users/become-streamer')
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in becomeStreamer thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in becomeStreamer thunk')
    }
})

export const changePassword = createAsyncThunk('/users/changePassword', async (data, thunkAPI) => {
    try {
        let responce = await api.patch('/users/change-password', data)
        return responce.data
    } catch (error) {
        console.log(error, 'error in changePassword thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in changePassword thunk')
    }
})

export const googleLogin = createAsyncThunk('/users/googleLogin', async (credential, thunkAPI) => {
    try {
        let responce = await api.post('/users/google', { credential })
        return responce.data.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || 'error in googleLogin thunk')
    }
})

export const updateProfile = createAsyncThunk('/users/updateProfile', async (data, thunkAPI) => {
    try {
        const formData = new FormData()
        if (data.name) formData.append("name", data.name)
        if (data.email) formData.append("email", data.email)
        if (data.avatar) formData.append("avatar", data.avatar)

        let responce = await api.patch('/users/update', formData)
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in updateProfile thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in updateProfile thunk')
    }
})

export const userRegister = createAsyncThunk("/register", async (data, thunkAPI) => {
    try {
        let responce = await api.post('/users/register', data)
        console.log(responce, 'Responce From User Register Thunk');
        return responce.data.data
    } catch (error) {
        console.log(error, 'Error in Register Async thunk');
        return thunkAPI.rejectWithValue(error.response?.data || "Error in Register Thunk")
    }
})

export const userLogin = createAsyncThunk('/login', async (credentials, thunkAPI) => {
    try {
        let responce = await api.post('/users/login', credentials)
        console.log(responce.data.data, 'Responce From User Login Thunk');
        return responce.data.data
    } catch (error) {
        console.log(error, 'eroorr in login async thunk');
        return thunkAPI.rejectWithValue(error.response?.data || "Eroor in login thunk")
    }
})

export const getMe = createAsyncThunk('/getMe', async (__, thunkAPI) => {
    try {
        let responce = await api.get('/users/me')
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in getMe thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in getMe thunk')
    }
})

let initialState = {
    loading: false,
    authentication: {
        user: null,
        token: localStorage.getItem("token") || null,
        error: null
    }
}

export const authenticationSlice = createSlice({
    name: "authenticationSlice",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token')
            state.authentication.token = null
            state.authentication.user = null
        }
    },

    extraReducers: (builder) => {
        builder.addCase(userRegister.pending, (state) => {
            state.loading = true
            state.authentication.error = null
        })

        builder.addCase(userRegister.rejected, (state, action) => {
            state.loading = false
            state.authentication.error = action.payload
        })

        builder.addCase(userLogin.pending, (state) => {
            state.loading = true
            state.authentication.error = null
        })

        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false
            state.authentication.user = action.payload.user
            state.authentication.token = action.payload.token
            console.log(action.payload.token, "LOGIN FULFILLED CASE");
            localStorage.setItem('token', action.payload.token)
        })

        builder.addCase(userLogin.rejected, (state, action) => {
            state.loading = false
            state.authentication.error = action.payload
        })

        builder.addCase(getMe.pending, (state) => {
            state.loading = true
            state.authentication.error = null
        })

        builder.addCase(getMe.fulfilled, (state, action) => {
            state.loading = false
            state.authentication.user = action.payload
        })

        builder.addCase(getMe.rejected, (state, action) => {
            state.loading = false
            state.authentication.error = action.payload
        })

         builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false
            state.authentication.user = action.payload
        })
        
        builder.addCase(updateProfile.pending, (state) => {
            state.loading = true
        })
        
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.loading = false
            state.authentication.error = action.payload
        })

        builder.addCase(changePassword.pending, (state) => {
            state.loading = true
            state.authentication.error = null
        })

        builder.addCase(changePassword.fulfilled, (state) => {
            state.loading = false
        })
        
        builder.addCase(changePassword.rejected, (state, action) => {
            state.loading = false
            state.authentication.error = action.payload
        })

        builder.addCase(becomeStreamer.fulfilled, (state, action) => {
            state.loading = false
            state.authentication.user = action.payload.user
            state.authentication.token = action.payload.token
            localStorage.setItem('token', action.payload.token)
        })
        
        builder.addCase(becomeStreamer.pending, (state) => {
            state.loading = true
        })
        
        builder.addCase(becomeStreamer.rejected, (state, action) => {
            state.loading = false
            state.authentication.error = action.payload
        })
    }
})

export const { logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;