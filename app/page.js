"use client"
import { useState } from "react";
import Script from 'next/script';
import Objectdetection from "@/components/object-detection";

export default function Home() {
    

    return (
      
        <main className="flex min-h-screen flex-col items-center p-8">
            <h1 className="font-extrabold text-1xl md:text-2xl lg:text-8xl tracking-tighter md:px-6 text-center">
                Real-Time Thief Detection and Alarm System 
            </h1>

            {/* object detection component */}
            <Objectdetection />

            <Script 
        src="https://cdn.botpress.cloud/webchat/v2.2/inject.js" 
        strategy="lazyOnload" 
        onLoad={() => {
          console.log('Botpress Webchat Script Loaded');
        }}
      />
      <Script 
        src="https://files.bpcontent.cloud/2025/01/12/17/20250112170825-JHPRM44C.js" 
        strategy="lazyOnload" 
        onLoad={() => {
          console.log('Custom Botpress Script Loaded');
        }}
      />


        </main>

        
        
    );
}

