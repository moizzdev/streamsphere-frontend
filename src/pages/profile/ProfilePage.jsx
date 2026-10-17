import React from 'react'
import Navbar from '../Navbar'
import ProfilePage from './Profile'

function ChatPage() {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* <Navbar/> */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <ProfilePage />
            </div>
        </div>
    )
}

export default ChatPage