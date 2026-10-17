import React from 'react'
import Navbar from '../Navbar'
import About from './About'

function ChatPage() {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* <Navbar/> */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <About />
            </div>
        </div>
    )
}

export default ChatPage