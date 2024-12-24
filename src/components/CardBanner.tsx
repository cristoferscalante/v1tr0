import React from 'react';
import Image from 'next/image';

interface CardBannerProps {
    icon: string; // Ruta del archivo SVG
    title: string;
  }

export default function CardBanner({ Icon, title }: CardBannerProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
      <div className="relative bg-[#02505931] p-6 rounded-lg border border-[#08A696]/20 flex flex-row items-center justify-center transition duration-200 group-hover:border-[#08A696]">
        <div className="w-1/3 flex items-center justify-center mx-auto">
          <Image 
            src={Icon} 
            alt={title} 
            height={60}
            width={60}
          />
        </div>
        <h3 className="w-2/3 text-[#26FFDF] font-medium">{title}</h3>
      </div>
    </div>
  );
}

