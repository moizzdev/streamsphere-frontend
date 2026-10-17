import React from 'react'
import StreamChatApp from './StreamChatApp'
import Navbar from '../Navbar'

function ChatPage() {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar/>
            <div style={{ flex: 1, minHeight: 0 }}>
                <StreamChatApp/>
            </div>
        </div>
    )
}

export default ChatPage