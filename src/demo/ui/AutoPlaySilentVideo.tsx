import React, { useEffect, useRef } from 'react';

// https://github.com/facebook/react/issues/6544#issuecomment-705702546
export const AutoPlaySilentVideo = (props: {
    className?: string;
    video: string;
    onClick?: () => void;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        videoRef.current!.defaultMuted = true;
    });
    return (
        <video
            ref={videoRef}
            src={props.video}
            className={props.className}
            autoPlay
            muted
            playsInline
        />
    );
};
