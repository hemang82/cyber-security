"use client"

import React from 'react';
import { RotatingTriangles, Triangle, ThreeDots, TailSpin, Oval } from 'react-loader-spinner';

export default function Spinner({ message, isActive } : any) {

    if (!isActive) return <></>;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Set the background color with transparency
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
        }}>
            <ThreeDots
                height="80"
                width="80"
                color="#465fff"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            {/* {message && <h4 className='mt-3' style={{ color: '#2f704c' }}>{message}</h4>} */}
        </div>
    );
}
