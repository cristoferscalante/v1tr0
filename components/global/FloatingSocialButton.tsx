
"use client";
import React, { useState } from "react";
import { TikTokIcon, LinkedInIcon } from "@/lib/icons";
import { SVGProps } from "react";

// WhatsApp SVG (inline, ya que no hay export en lib/icons)
const WhatsAppSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 28}
    height={props.height || 28}
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
  >
    <path
      d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"
    />
  </svg>
);

// Inline SVGs for Instagram, Facebook, YouTube, Discord (from user attachments)
const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M31.6336 44.5474C38.6972 44.5474 44.4234 38.8212 44.4234 31.7576C44.4234 24.694 38.6972 18.9678 31.6336 18.9678C24.5699 18.9678 18.8438 24.694 18.8438 31.7576C18.8438 38.8212 24.5699 44.5474 31.6336 44.5474Z" fill="currentColor"/>
    <path d="M19.3086 1.86841C9.42594 1.86841 1.37891 9.91544 1.37891 19.7981V44.2005C1.37891 54.0832 9.42594 62.1297 19.3086 62.1297H43.9583C53.841 62.1297 61.8875 54.0837 61.8875 44.2005V19.7981C61.8875 9.91544 53.8415 1.86841 43.9583 1.86841H19.3086ZM19.3086 7.66671H43.9583C50.7292 7.66671 56.0892 13.0277 56.0892 19.7981V44.2005C56.0892 50.9714 50.7292 56.3314 43.9583 56.3314H19.3086C12.5377 56.3314 7.17721 50.9714 7.17721 44.2005V19.7981C7.17721 13.0272 12.5382 7.66671 19.3086 7.66671Z" fill="currentColor"/>
    <path d="M47.9098 19.6793C49.9167 19.6793 51.5435 18.0524 51.5435 16.0456C51.5435 14.0387 49.9167 12.4119 47.9098 12.4119C45.903 12.4119 44.2761 14.0387 44.2761 16.0456C44.2761 18.0524 45.903 19.6793 47.9098 19.6793Z" fill="currentColor"/>
  </svg>
);

const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M42.3281 10.148C38.3601 10.148 37.2321 11.908 37.2321 15.788V22.192H47.7861L46.7461 32.566H37.2301V64H24.6001V32.564H16.0801V22.19H24.6041V15.966C24.6041 5.5 28.8001 0 40.5701 0C43.0961 0 46.1181 0.2 47.9221 0.452V10.192" fill="currentColor"/>
  </svg>
);

const YouTubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="22" height="16" viewBox="0 0 81 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_1034_10)">
      <path d="M32.147 41.0668L54.0423 29.1334L32.147 17.1001V41.0668Z" fill="currentColor"/>
      <path opacity="0.68" d="M32.147 17.1001L51.3528 30.6001L54.0423 29.1334L32.147 17.1001Z" fill="currentColor"/>
      <path d="M10.7686 2.52954C26.1676 1.29668 41.6609 1.35736 57.1543 1.77954C59.7482 1.96599 62.5347 1.96688 65.0244 2.0813C67.5935 2.19938 70.058 2.44026 72.4258 3.09106C76.1425 4.32738 78.08 8.59337 78.6582 13.1233L78.668 13.2034C79.04 16.5915 79.2993 19.9916 79.4248 23.3958L79.4707 24.8704C79.4957 33.2078 79.7492 41.4011 78.1797 49.3479L78.1748 49.3713L78.1709 49.3948C77.465 53.6827 74.1162 57.1184 70.2012 57.4377H70.1963C58.8098 58.4017 47.3483 58.5333 35.874 58.4417C26.9818 58.1377 18.3707 58.4797 9.81641 57.135H9.81738C6.289 56.5742 3.51345 53.322 2.8252 49.3782L2.82227 49.3577L2.81738 49.3381L2.69824 48.7278C1.49923 42.4229 1.51359 35.9031 1.5 29.2854C1.56652 22.6874 1.53379 16.2069 2.97852 10.0159L2.98633 9.9856L2.99121 9.95532C3.7548 5.94891 7.05071 2.856 10.7686 2.52954ZM30.6338 43.593L32.8525 42.3831L54.7383 30.4504L57.1445 29.1389L54.7432 27.8186L32.8564 15.7854L30.6338 14.5627V43.593Z" stroke="currentColor" strokeWidth="3"/>
    </g>
    <defs>
      <clipPath id="clip0_1034_10">
        <rect width="81" height="60" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const DiscordIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_1034_8)">
      <path d="M54.1787 11.6528C50.0294 9.74814 45.6505 8.38996 41.1517 7.61224C41.1109 7.60461 41.0686 7.61007 41.0311 7.62783C40.9935 7.6456 40.9625 7.67476 40.9424 7.71117C40.3797 8.71197 39.7565 10.0173 39.3203 11.0432C34.4011 10.3066 29.5069 10.3066 24.6888 11.0432C24.2525 9.99437 23.6067 8.71197 23.0416 7.71117C23.0207 7.67559 22.9895 7.64714 22.9522 7.62954C22.9148 7.61194 22.873 7.606 22.8323 7.61251C18.333 8.38842 13.9539 9.74648 9.80508 11.6525C9.76958 11.6677 9.73967 11.6935 9.71948 11.7264C1.42241 24.1221 -0.850656 36.213 0.264544 48.1541C0.267697 48.1833 0.276686 48.2116 0.290977 48.2373C0.305268 48.263 0.324572 48.2856 0.347744 48.3037C5.82188 52.324 11.1245 54.7645 16.3288 56.3821C16.3693 56.3942 16.4125 56.3936 16.4526 56.3805C16.4927 56.3673 16.5279 56.3422 16.5533 56.3085C17.7843 54.6274 18.8816 52.8546 19.8227 50.9906C19.8356 50.9651 19.843 50.9371 19.8443 50.9086C19.8457 50.88 19.841 50.8514 19.8305 50.8248C19.82 50.7982 19.804 50.7741 19.7835 50.7541C19.7631 50.7341 19.7386 50.7186 19.7117 50.7088C17.9709 50.0485 16.3136 49.2434 14.7192 48.3293C14.6901 48.3122 14.6657 48.2883 14.6481 48.2595C14.6305 48.2308 14.6202 48.1981 14.6182 48.1644C14.6162 48.1308 14.6225 48.0972 14.6366 48.0665C14.6507 48.0359 14.6721 48.0092 14.6989 47.9888C15.0344 47.7373 15.3701 47.476 15.6904 47.2117C15.7189 47.1882 15.7533 47.1732 15.7899 47.1682C15.8264 47.1633 15.8637 47.1686 15.8973 47.1837C26.3715 51.9658 37.7107 51.9658 48.0611 47.1837C48.0948 47.1677 48.1324 47.1615 48.1694 47.166C48.2065 47.1705 48.2415 47.1854 48.2704 47.209C48.5909 47.473 48.9264 47.7373 49.2645 47.9888C49.2915 48.009 49.313 48.0355 49.3273 48.066C49.3415 48.0965 49.3481 48.13 49.3463 48.1636C49.3446 48.1972 49.3346 48.2299 49.3173 48.2587C49.3 48.2876 49.2758 48.3117 49.2469 48.329C47.652 49.2606 45.9811 50.0558 44.2523 50.7061C44.2254 50.7164 44.201 50.7322 44.1807 50.7525C44.1604 50.7729 44.1446 50.7972 44.1344 50.8241C44.1241 50.851 44.1197 50.8797 44.1213 50.9084C44.1229 50.9371 44.1306 50.9651 44.1437 50.9906C45.1048 52.852 46.2021 54.6248 47.4104 56.3058C47.4351 56.3405 47.4701 56.3666 47.5104 56.3802C47.5507 56.3939 47.5942 56.3946 47.6349 56.3821C52.8643 54.7642 58.1669 52.3237 63.6411 48.3037C63.6646 48.2865 63.6843 48.2645 63.6987 48.2391C63.7131 48.2137 63.7219 48.1856 63.7245 48.1565C65.0589 34.3512 61.4893 22.3594 54.2619 11.7288C54.2441 11.6942 54.2146 11.6674 54.1787 11.6528ZM21.3867 40.8832C18.2333 40.8832 15.6349 37.988 15.6349 34.4325C15.6349 30.8773 18.1829 27.9821 21.3869 27.9821C24.6157 27.9821 27.1888 30.9026 27.1384 34.4328C27.1384 37.988 24.5904 40.8832 21.3867 40.8832ZM42.6528 40.8832C39.4995 40.8832 36.9011 37.988 36.9011 34.4325C36.9011 30.8773 39.4488 27.9821 42.6528 27.9821C45.8816 27.9821 48.4547 30.9026 48.4043 34.4328C48.4043 37.988 45.8816 40.8832 42.6528 40.8832Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_1034_8">
        <rect width="64" height="64" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/v1tr0.dev/",
  icon: (props: SVGProps<SVGSVGElement>) => <InstagramIcon {...props} width={22} height={22} className="transition-colors duration-200 text-[#08A696] dark:text-[#26FFDF] drop-shadow-[0_3px_8px_rgba(38,255,223,0.12)]" />,
    tooltip: "Instagram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/v1tr0.tech",
  icon: (props: SVGProps<SVGSVGElement>) => <FacebookIcon {...props} width={22} height={22} className="transition-colors duration-200 text-[#08A696] dark:text-[#26FFDF] drop-shadow-[0_3px_8px_rgba(38,255,223,0.12)]" />,
    tooltip: "Facebook",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@v1tr0_tech",
  icon: (props: SVGProps<SVGSVGElement>) => <TikTokIcon width={22} height={22} {...props} className="transition-colors duration-200 text-[#08A696] dark:text-[#26FFDF] drop-shadow-[0_3px_8px_rgba(38,255,223,0.12)]" />,
    tooltip: "TikTok",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/v1tr0/?viewAsMember=true",
  icon: (props: SVGProps<SVGSVGElement>) => <LinkedInIcon width={22} height={22} {...props} className="transition-colors duration-200 text-[#08A696] dark:text-[#26FFDF] drop-shadow-[0_3px_8px_rgba(38,255,223,0.12)]" />,
    tooltip: "LinkedIn",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@v1tr0-h4p",
  icon: (props: SVGProps<SVGSVGElement>) => <YouTubeIcon {...props} width={22} height={16} className="transition-colors duration-200 text-[#08A696] dark:text-[#26FFDF] drop-shadow-[0_3px_8px_rgba(38,255,223,0.12)]" />,
    tooltip: "YouTube",
  },
  {
    name: "Discord",
    href: "https://discord.gg/j43sKghd",
  icon: (props: SVGProps<SVGSVGElement>) => <DiscordIcon {...props} width={22} height={22} className="transition-colors duration-200 text-[#08A696] dark:text-[#26FFDF] drop-shadow-[0_3px_8px_rgba(38,255,223,0.12)]" />,
    tooltip: "Discord",
  },
];




const FloatingSocialButton: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
  <div className="fixed z-50 bottom-12 left-12">
      <div className="tooltip-container relative group">
        <a
          href="https://wa.me/573222237026?text=Hola%20V1TR0%2C%20quiero%20agendar%20una%20reuni%C3%B3n%20o%20saber%20m%C3%A1s%20sobre%20sus%20servicios."
          target="_blank"
          rel="noopener noreferrer"
          className="text flex items-center justify-center gap-2 px-4 py-2 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl text-[#08A696] dark:text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
          style={{boxShadow: '0 6px 15px rgba(8, 166, 150, 0.05), 0 3px 8px rgba(38, 255, 223, 0.05)', borderColor: '#08A696'}}
          tabIndex={0}
          aria-label="WhatsApp"
        >
          <WhatsAppSvg width={28} height={28} style={{ color: 'inherit' }} />
        </a>
        {socialLinks.map((link, idx) => {
          // Media luna aún más abierta y separada: arco de -110° a 20°
          const total = socialLinks.length;
          const startDeg = -110;
          const endDeg = 20;
          const angle = (startDeg + ((endDeg - startDeg) * (idx / (total - 1)))) * (Math.PI / 180);
          const radius = 95; // Más separación radial
          const x = Math.round(Math.cos(angle) * radius) + 10; // 10px extra a la derecha
          const y = Math.round(Math.sin(angle) * radius);
          const scale = hovered === idx ? 1.22 : 1;
          // Stagger: el primero (arriba) aparece primero, el último (Discord) último
          const delay = 0.08 * idx; // 80ms entre cada icono
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible flex items-center justify-center gap-2 px-4 py-2 bg-transparent rounded-2xl transition-all duration-500 ease-out"
              style={{
                zIndex: 10 + idx,
                transform: `translateY(-50%) translateX(${x}px) translateY(${y}px) scale(${scale})`,
                transition: `opacity 0.4s ${delay}s, visibility 0.4s ${delay}s, transform 0.3s cubic-bezier(0.4,0,0.2,1) ${delay}s, background 0.3s`,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              tabIndex={0}
              aria-label={link.name}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {link.icon({})}
            </a>
          );
        })}
      </div>
      <style jsx global>{`
        .tooltip-container {
          background: transparent;
          position: relative;
          cursor: pointer;
          font-size: 17px;
          padding: 0.7em 0.7em;
          border-radius: 50px;
          box-shadow: none;
        }
        .tooltip-container:hover {
          background: transparent;
          transition: all 0.6s;
        }
        .tooltip-container .text {
          display: flex;
          align-items: center;
          justify-content: center;
          fill: #fff;
          transition: all 0.2s;
        }
        .tooltip-container:hover .text {
          fill: #1db954;
          transition: all 0.6s;
        }
        .tooltip1 {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          visibility: hidden;
          background: #fff;
          color: #E1306C;
          padding: 10px;
          border-radius: 50px;
          transition: opacity 0.3s, visibility 0.3s, top 0.3s, background 0.3s, color 0.3s;
          z-index: 1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .tooltip-container:hover .tooltip1 {
          top: 150%;
          opacity: 1;
          visibility: visible;
          background: #fff;
          border-radius: 50px;
          transform: translate(-50%, -5px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tooltip-container:hover .tooltip1:hover {
          background: #E1306C;
        }
        .tooltip-container:hover .tooltip1:hover svg {
          color: #fff !important;
        }
        .tooltip2 {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          visibility: hidden;
          background: #fff;
          color: #0462df;
          padding: 10px;
          border-radius: 50px;
          transition: opacity 0.3s, visibility 0.3s, top 0.3s, background 0.3s, color 0.3s;
          z-index: 1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .tooltip-container:hover .tooltip2 {
          top: -120%;
          opacity: 1;
          visibility: visible;
          background: #fff;
          transform: translate(-50%, -5px);
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tooltip-container:hover .tooltip2:hover {
          background: #0462df;
        }
        .tooltip-container:hover .tooltip2:hover svg {
          color: #fff !important;
        }
        .tooltip3 {
          position: absolute;
          top: 100%;
          left: 60%;
          transform: translateX(80%);
          opacity: 0;
          visibility: hidden;
          background: #fff;
          color: #000;
          padding: 10px;
          border-radius: 50px;
          transition: opacity 0.3s, visibility 0.3s, top 0.3s, background 0.3s, color 0.3s;
          z-index: 1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .tooltip-container:hover .tooltip3 {
          top: 10%;
          opacity: 1;
          visibility: visible;
          background: #fff;
          transform: translate(85%, -5px);
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tooltip-container:hover .tooltip3:hover {
          background: #000;
        }
        .tooltip-container:hover .tooltip3:hover svg {
          color: #fff !important;
        }
        .tooltip4 {
          position: absolute;
          top: 100%;
          left: -190%;
          transform: translateX(70%);
          opacity: 0;
          visibility: hidden;
          background: #fff;
          color: #0077b5;
          padding: 10px;
          border-radius: 50px;
          transition: opacity 0.3s, visibility 0.3s, top 0.3s, background 0.3s, color 0.3s;
          z-index: 1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .tooltip-container:hover .tooltip4 {
          top: 10%;
          opacity: 1;
          visibility: visible;
          background: #fff;
          transform: translate(70%, -5px);
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tooltip-container:hover .tooltip4:hover {
          background: #0077b5;
        }
        .tooltip-container:hover .tooltip4:hover svg {
          color: #fff !important;
        }
        .tooltip5 {
          position: absolute;
          top: 100%;
          left: -145%;
          transform: translateX(70%);
          opacity: 0;
          visibility: hidden;
          background: #fff;
          color: #FF0000;
          padding: 10px;
          border-radius: 50px;
          transition: opacity 0.3s, visibility 0.3s, top 0.3s, background 0.3s, color 0.3s;
          z-index: 1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .tooltip-container:hover .tooltip5 {
          top: -78%;
          opacity: 1;
          visibility: visible;
          background: #fff;
          transform: translate(70%, -5px);
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tooltip-container:hover .tooltip5:hover {
          background: #FF0000;
        }
        .tooltip-container:hover .tooltip5:hover svg {
          color: #fff !important;
        }
        .tooltip6 {
          position: absolute;
          top: 100%;
          left: 35%;
          transform: translateX(70%);
          opacity: 0;
          visibility: hidden;
          background: #fff;
          color: #8c9eff;
          padding: 10px;
          border-radius: 50px;
          transition: opacity 0.3s, visibility 0.3s, top 0.3s, background 0.3s, color 0.3s;
          z-index: 1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .tooltip-container:hover .tooltip6 {
          top: -79%;
          opacity: 1;
          visibility: visible;
          background: #fff;
          transform: translate(70%, -5px);
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tooltip-container:hover .tooltip6:hover {
          background: #8c9eff;
        }
        .tooltip-container:hover .tooltip6:hover svg {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default FloatingSocialButton;
