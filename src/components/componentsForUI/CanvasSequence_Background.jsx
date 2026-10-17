import React, { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DragonLoader from './DragonLoader';

gsap.registerPlugin(ScrollTrigger);

const imageModules = import.meta.glob('../assets/*.jpg', { eager: true, as: 'url' });


const sortedImageUrls = Object.keys(imageModules)
    .sort((a, b) => {
        const numA = parseInt(a.match(/scene(\d+)\.jpg/)[1]);
        const numB = parseInt(b.match(/scene(\d+)\.jpg/)[1]);
        return numA - numB;
    })
    .map(key => imageModules[key]);

export default function CanvasSequence() {
    const total_frames = sortedImageUrls.length;
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [actualProgress, setActualProgress] = useState(0);
    const [displayedProgress, setDisplayedProgress] = useState(0);
    const [loadingError, setLoadingError] = useState(false);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);
    const images = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let cancelled = false;

        const imageSeq = { frame: 0 };
        let settledCount = 0;
        let errorCount = 0;

        // Define renderFrame
        const renderFrame = () => {
            const img = images.current[Math.floor(imageSeq.frame)];
            if (!img || !img.complete || !img.naturalWidth) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scale = Math.max(
                canvas.width / img.naturalWidth,
                canvas.height / img.naturalHeight
            );

            const x = (canvas.width - img.naturalWidth * scale) / 2;
            const y = (canvas.height - img.naturalHeight * scale) / 2;

            ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
        };

        const resizeCanvas = () => {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            renderFrame();
        };

        // Define initGSAP - now it just displays the first frame and animates on scroll
        const initGSAP = () => {
            renderFrame(); // Initial render

            gsap.fromTo(canvas,
                { opacity: 0 },
                { opacity: 1, duration: 1.2, ease: "power2.inOut" }
            );

            // Animate canvas based on scroll
            gsap.to(imageSeq, {
                frame: total_frames - 1,
                ease: "none",
                scrollTrigger: {
                    trigger: "body", // Trigger on body scroll
                    start: "top top",
                    end: `+=${total_frames * 10}`, // Adjust multiplier for speed
                    scrub: 0.5,
                    onUpdate: renderFrame,
                }
            });
        };

        const onSettle = () => {
            settledCount++;
            const currentActualProgress = Math.round((settledCount / total_frames) * 100);
            setActualProgress(currentActualProgress);

            if (settledCount === total_frames && !cancelled) {
                if (errorCount > 0) {
                    setLoadingError(true);
                    console.error(`Failed to load ${errorCount} out of ${total_frames} frames.`);
                } else {
                    setAllImagesLoaded(true);
                }
            }
        };

        if (total_frames === 0) {
            setLoadingError(true);
            console.error("No image files found.");
            return;
        }

        for (let i = 0; i < total_frames; i++) {
            const img = new Image();
            img.onload = () => {
                images.current[i] = img;
                onSettle();
            };
            img.onerror = () => {
                console.warn(`Missing frame ${i}: ${sortedImageUrls[i]}`);
                errorCount++;
                onSettle();
            };
            img.src = sortedImageUrls[i];
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => {
            cancelled = true;
            ScrollTrigger.getAll().forEach(st => st.kill());
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    // Effect to smooth out the displayed progress
    useEffect(() => {
        if (loadingError) return;

        let animationFrameId;
        const animateProgress = () => {
            setDisplayedProgress(prevProgress => {
                const nextProgress = Math.min(prevProgress + 1, actualProgress);
                return nextProgress;
            });

            if (allImagesLoaded && displayedProgress >= 99) {
                return;
            }

            if (displayedProgress < 100) {
                animationFrameId = requestAnimationFrame(animateProgress);
            } else if (allImagesLoaded && displayedProgress < 100) {
                animationFrameId = requestAnimationFrame(animateProgress);
            }
        };

        if (actualProgress > displayedProgress) {
            animationFrameId = requestAnimationFrame(animateProgress);
        } else if (allImagesLoaded && displayedProgress < 100) {
            animationFrameId = requestAnimationFrame(animateProgress);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [actualProgress, displayedProgress, allImagesLoaded, loadingError]);

    // Trigger GSAP initialization when loading completes
    useEffect(() => {
        if (allImagesLoaded && displayedProgress >= 100) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                // Re-initialize GSAP animations
                ScrollTrigger.getAll().forEach(st => st.kill());
                
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                const imageSeq = { frame: 0 };

                const renderFrame = () => {
                    const img = images.current[Math.floor(imageSeq.frame)];
                    if (!img || !img.complete || !img.naturalWidth) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        return;
                    }

                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    const scale = Math.max(
                        canvas.width / img.naturalWidth,
                        canvas.height / img.naturalHeight
                    );

                    const x = (canvas.width - img.naturalWidth * scale) / 2;
                    const y = (canvas.height - img.naturalHeight * scale) / 2;

                    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
                };

                gsap.to(imageSeq, {
                    frame: total_frames - 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: "body",
                        start: "top top",
                        end: `+=${total_frames * 10}`,
                        scrub: 0.5,
                        onUpdate: renderFrame,
                    }
                });
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [allImagesLoaded, displayedProgress]);

    return (
        <div ref={containerRef} className="canvas-background-container">
            <canvas ref={canvasRef} className="canvas-background" />
            {loadingError && (
                <div className="loading-error">
                    Error loading images. Please check console for details.
                </div>
            )}
            {!allImagesLoaded && !loadingError && (
                <DragonLoader progress={displayedProgress} />
            )}
        </div>
    );
}
