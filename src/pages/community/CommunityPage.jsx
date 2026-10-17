import React from 'react'
import Navbar from '../Navbar'
import CommunityPage from './Community'

function ChatPage() {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* <Navbar/> */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <CommunityPage />
            </div>
        </div>
    )
}

export default ChatPage