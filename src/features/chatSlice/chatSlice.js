import api from '../../services/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const reactToMessage = createAsyncThunk('/chats/react', async ({ id, emoji }, thunkAPI) => {
    try {
        let responce = await api.post(`/chats/react/${id}`, { emoji })
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in reactToMessage thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in reactToMessage thunk')
    }
})

export const searchUsers = createAsyncThunk('/chats/searchUsers', async (query, thunkAPI) => {
    try {
        let responce = await api.get(`/users/search?query=${encodeURIComponent(query)}`)
        console.log(responce.data.data, 'Responce From Search Users Thunk');
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in searchUsers thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in searchUsers thunk')
    }
})

export const sendMessage = createAsyncThunk("/chats/send", async (data, thunkAPI) => {
    try {
        let payload

        if (data.file) {
            // Voice note or document attached — must send as FormData
            payload = new FormData()
            payload.append("receiverId", data.receiverId)
            if (data.text) payload.append("text", data.text)
            payload.append("attachment", data.file)
        } else {
            // Plain text message — send as normal JSON
            payload = { receiverId: data.receiverId, text: data.text }
        }

        let responce = await api.post('/chats/send', payload)
        console.log(responce, 'Responce From Send Message Thunk');
        return responce.data.data
    } catch (error) {
        console.log(error, 'Error in Send Message Async thunk');
        return thunkAPI.rejectWithValue(error.response?.data || "Error in Send Message Thunk")
    }
})

export const getMyChats = createAsyncThunk('/chats/myChats', async (__, thunkAPI) => {
    try {
        let responce = await api.get('/chats/my-chats')
        console.log(responce.data.data, 'Responce From Get My Chats Thunk');
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in getMyChats thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in getMyChats thunk')
    }
})

export const getConversation = createAsyncThunk('/chats/getConversation', async (userId, thunkAPI) => {
    try {
        let responce = await api.get(`/chats/${userId}`)
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in getConversation thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in getConversation thunk')
    }
})

export const markAsRead = createAsyncThunk('/chats/markAsRead', async (userId, thunkAPI) => {
    try {
        let responce = await api.patch(`/chats/read/${userId}`)
        return { userId, ...responce.data }
    } catch (error) {
        console.log(error, 'error in markAsRead thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in markAsRead thunk')
    }
})

export const deleteMessage = createAsyncThunk('/chats/delete', async (id, thunkAPI) => {
    try {
        let responce = await api.delete(`/chats/${id}`)
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in deleteMessage thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in deleteMessage thunk')
    }
})

export const getUnreadCounts = createAsyncThunk('/chats/unreadCounts', async (__, thunkAPI) => {
    try {
        let responce = await api.get('/chats/unread-counts')
        return responce.data.data
    } catch (error) {
        console.log(error, 'error in getUnreadCounts thunk');
        return thunkAPI.rejectWithValue(error.response?.data || 'error in getUnreadCounts thunk')
    }
})

let initialState = {
    loading: false,
    chats: {
        myChats: [],
        conversation: [],
        searchResults: [],
        searchLoading: false,
        unreadCounts: {},  
        error: null
    }
}

export const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {
        clearConversation: (state) => {
            state.chats.conversation = []
        }
    },

    extraReducers: (builder) => {
        
        builder.addCase(searchUsers.pending, (state) => {
            state.chats.searchLoading = true
        })

        builder.addCase(searchUsers.fulfilled, (state, action) => {
            state.chats.searchLoading = false
            state.chats.searchResults = action.payload
        })

        builder.addCase(searchUsers.rejected, (state, action) => {
            state.chats.searchLoading = false
            state.chats.error = action.payload
        })

        builder.addCase(sendMessage.pending, (state) => {
            state.loading = true
            state.chats.error = null
        })

        builder.addCase(sendMessage.fulfilled, (state, action) => {
            state.loading = false
            state.chats.conversation.push(action.payload)
        })

        builder.addCase(sendMessage.rejected, (state, action) => {
            state.loading = false
            state.chats.error = action.payload
        })

        builder.addCase(getMyChats.pending, (state) => {
            state.loading = true
            state.chats.error = null
        })

        builder.addCase(getMyChats.fulfilled, (state, action) => {
            state.loading = false
            state.chats.myChats = action.payload
        })

        builder.addCase(getMyChats.rejected, (state, action) => {
            state.loading = false
            state.chats.error = action.payload
        })

        builder.addCase(getConversation.pending, (state) => {
            state.loading = true
            state.chats.error = null
        })

        builder.addCase(getConversation.fulfilled, (state, action) => {
            state.loading = false
            state.chats.conversation = action.payload
        })

        builder.addCase(getConversation.rejected, (state, action) => {
            state.loading = false
            state.chats.error = action.payload
        })

        builder.addCase(deleteMessage.pending, (state) => {
            state.loading = true
            state.chats.error = null
        })

        builder.addCase(deleteMessage.fulfilled, (state, action) => {
            state.loading = false
            state.chats.conversation = state.chats.conversation.filter(m => m.id !== action.payload)
        })

        builder.addCase(deleteMessage.rejected, (state, action) => {
            state.loading = false
            state.chats.error = action.payload
        })

        builder.addCase(getUnreadCounts.fulfilled, (state, action) => {
            state.chats.unreadCounts = action.payload
        })

        builder.addCase(markAsRead.fulfilled, (state, action) => {
            state.chats.unreadCounts[action.payload.userId] = 0
        })
        
    }
})

export const { clearConversation } = chatSlice.actions;

export default chatSlice.reducer;