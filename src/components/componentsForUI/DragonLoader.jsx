import React, { useState, useEffect } from 'react';
import './DragonLoader.css';

export default function DragonLoader({ progress = 0 }) {
    const [displayProgress, setDisplayProgress] = useState(0);

    useEffect(() => {
        setDisplayProgress(progress);
    }, [progress]);

    return (
        <div className="dragon-loader-container">
            {/* Deep black background with subtle noise */}
            <div className="dragon-background">
                <div className="noise-texture"></div>
            </div>

            {/* Main loader content */}
            <div className="dragon-content">
                {/* Dragon eye - main focal point */}
                <div className="dragon-eye-container">
                    <div className="dragon-eye">
                        <div className="eye-glow"></div>
                        <div className="eye-pupil">
                            <div className="pupil-shine"></div>
                        </div>
                        <div className="eye-lashes">
                            <span className="lash"></span>
                            <span className="lash"></span>
                            <span className="lash"></span>
                        </div>
                    </div>

                    {/* Aura around the eye */}
                    <div className="dragon-aura">
                        <div className="aura-ring aura-ring-1"></div>
                        <div className="aura-ring aura-ring-2"></div>
                        <div className="aura-ring aura-ring-3"></div>
                    </div>
                </div>

                {/* Loading bar - long and cinematic */}
                <div className="loading-bar-container">
                    <div className="loading-bar-background">
                        <div className="loading-bar-fill" style={{ width: `${displayProgress}%` }}>
                            <div className="loading-bar-shimmer"></div>
                        </div>
                    </div>
                    <div className="loading-percentage">{displayProgress}%</div>
                </div>

                {/* Dragon text with animated underline */}
                <div className="dragon-text-container">
                    <h1 className="dragon-title">
                        <span className="title-char">A</span>
                        <span className="title-char">W</span>
                        <span className="title-char">A</span>
                        <span className="title-char">K</span>
                        <span className="title-char">E</span>
                        <span className="title-char">N</span>
                        <span className="title-char">I</span>
                        <span className="title-char">N</span>
                        <span className="title-char">G</span>
                    </h1>
                    <div className="dragon-underline"></div>
                </div>

                {/* Status text */}
                <div className="status-text">
                    <span className="status-label">Channeling Power</span>
                    <span className="status-dots">
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                    </span>
                </div>

                {/* Dragon scales decoration */}
                <div className="dragon-scales">
                    <div className="scale scale-1"></div>
                    <div className="scale scale-2"></div>
                    <div className="scale scale-3"></div>
                    <div className="scale scale-4"></div>
                    <div className="scale scale-5"></div>
                </div>
            </div>

            {/* Ambient glow effect */}
            <div className="ambient-glow"></div>
        </div>
    );
}
