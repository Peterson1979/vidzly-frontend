
import React from 'react';
import { SocialSharePlatform } from './types'; // Category type import removed

export const APP_NAME = "Vidzly";
export const VIDZLY_APP_URL = typeof window !== 'undefined' ? window.location.origin : 'https://vidzly.example.com';

export const VidzlyLogoSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 185 50" xmlns="http://www.w3.org/2000/svg" {...props} className={`${props.className || ''}`} preserveAspectRatio="xMinYMid meet">
    <path 
      d="M41.667 4.167H11.25C7.046 4.167 3.75 7.462 3.75 11.667V26.667C3.75 30.871 7.046 34.167 11.25 34.167H15V40.833L21.667 34.167H35.833C40.038 34.167 43.333 30.871 43.333 26.667V11.667C43.333 7.462 40.038 4.167 35.833 4.167H41.667Z" 
      fill="#F97316"
    />
    <path d="M18.75 13.333V25.833L29.167 19.583L18.75 13.333Z" fill="#FFFFFF"/>
    <text x="55" y="33" fontFamily="Inter, Arial, sans-serif" fontSize="28" fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
      Vidzly
    </text>
  </svg>
);

// DEFAULT_CATEGORIES removed
// PRIORITY_CATEGORY_ORDER removed


export const ROUTES = {
  HOME: '/',
  VIDEO_DETAIL_BASE: '/video/',
  VIDEO_DETAIL: '/video/:id', // YouTube video ID will be used here
  // CATEGORY_FEED_BASE removed
  // CATEGORY_FEED removed
  FAVORITES: '/favorites',
  SETTINGS: '/settings',
  SUBSCRIPTION: '/subscription',
};

export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);
export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
export const HeartFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.004-.001z" />
  </svg>
);
export const CogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.255c-.007.378.138.75-.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.255c.007-.378-.138.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
export const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25 2.25 2.25 0 002.25 2.25 2.25 2.25 0 002.25-2.25A2.25 2.25 0 0012 12z" />
  </svg>
);
export const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);
export const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
  </svg>
);
export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);
export const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);
export const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);
export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.032 3.223.094C7.074 5.868 7.525 5.976 7.995 6.128m5.407 0a48.284 48.284 0 00-3.478-.397m12.56 0c-1.153 0-2.24-.032-3.223.094C16.926 5.868 16.475 5.976 16.005 6.128" />
  </svg>
);
export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
);
export const ListBulletIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
export const Squares2X2Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);
export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75a4.5 4.5 0 01-3.09 3.09L12 18.75l-1.904-.813a4.5 4.5 0 01-3.09-3.09L5.25 12l.813-1.904a4.5 4.5 0 013.09-3.09L12 5.25l1.904.813a4.5 4.5 0 013.09 3.09L18.75 12z" />
  </svg>
);
export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
export const VolumeUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);
export const VolumeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0L21.75 14.25M19.5 12l2.25 2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
export const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
export const InformationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);


const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
);
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.17.04-4.36-.6-5.9-2.34-1.49-1.64-2.18-3.81-2.18-5.91 0-.21.03-.42.05-.63 1.38-.45 2.94-.45 4.41-.45s2.52 0 3.78-.01V10.26c.02-1.05-.06-2.14-.23-3.16-.18-1.23-.56-2.39-1.11-3.49C11.16 2.01 11.05 1.01 12.525.02z"></path></svg>
);
const XTwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
); 
const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.198-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.377-.752-.377-1.849c0-1.713 1.002-3.001 2.247-3.001 1.051 0 1.564.784 1.564 1.741 0 1.069-.679 2.679-1.021 4.148-.292 1.226.616 2.227 1.845 2.227 2.206 0 3.814-2.324 3.814-5.413 0-2.851-2.064-4.878-5.008-4.878-3.413 0-5.409 2.556-5.409 5.199 0 1.033.394 2.143.889 2.726a.36.36 0 01.083.345l-.333 1.352a.267.267 0 01-.401.231c-1.127-.433-1.842-1.845-1.842-3.037.002-2.318 1.666-4.458 4.903-4.458 2.645 0 4.577 1.903 4.577 4.508 0 2.641-1.669 4.826-3.961 4.826-.937 0-1.839-.518-2.143-1.091l-.502 1.918c-.226.869-.835 1.958-1.244 2.621.937.29 1.966.449 3.031.449 6.62 0 11.985-5.365 11.985-11.987C23.97 5.39 18.602 0 12.017 0z"></path>
  </svg>
);
const ThreadsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.066 7.500h-2.88A4.098 4.098 0 0 0 9.118 9.73a4.074 4.074 0 0 0-.063.725 4.086 4.086 0 0 0 .725 2.438 4.074 4.074 0 0 0 2.203 1.475.578.578 0 0 1 .338.525v1.006a.578.578 0 0 1-.338.525 6.197 6.197 0 0 1-2.813 0 6.197 6.197 0 0 1-2.813 0 .578.578 0 0 1-.337-.525v-1.006a.578.578 0 0 1 .338-.525A4.074 4.074 0 0 0 7.95 10.455a4.074 4.074 0 0 0-.062-.725A4.098 4.098 0 0 0 3.818 7.5H.934a.75.75 0 0 0 0 1.5h2.88a2.598 2.598 0 0 1 2.568 2.23 2.573 2.573 0 0 1 .062.475 2.586 2.586 0 0 1-.725 1.688 2.574 2.574 0 0 1-1.453.725.75.75 0 0 0-.525.713v1.006c0 .3.175.562.438.675a7.697 7.697 0 0 0 3.562.925 7.697 7.697 0 0 0 3.563-.925.678.678 0 0 0 .437-.675v-1.006a.75.75 0 0 0-.525-.713 2.574 2.574 0 0 1-1.453-.725 2.586 2.586 0 0 1-.725-1.688 2.573 2.573 0 0 1 .062-.475 2.598 2.598 0 0 1 2.568-2.23h2.88a.75.75 0 0 0 0-1.5Zm7.000 7.425a.75.75 0 0 0-.525.713v1.006c0 .3.175.562.438.675a7.697 7.697 0 0 0 3.562.925 7.697 7.697 0 0 0 3.563-.925.678.678 0 0 0 .437-.675v-1.006a.75.75 0 0 0-.525-.713 2.574 2.574 0 0 1-1.453-.725 2.586 2.586 0 0 1-.725-1.688 2.573 2.573 0 0 1 .062-.475A2.598 2.598 0 0 1 20.182 9h2.884a.75.75 0 0 0 0-1.5h-2.88A4.098 4.098 0 0 0 16.118 9.73a4.074 4.074 0 0 0-.063.725 4.086 4.086 0 0 0 .725 2.438 4.074 4.074 0 0 0 2.203 1.475.578.578 0 0 1 .338.525v1.006a.578.578 0 0 1-.338.525 6.197 6.197 0 0 1-2.813.925 6.197 6.197 0 0 1-2.813-.925.578.578 0 0 1-.337-.525v-1.006a.578.578 0 0 1 .338-.525A4.074 4.074 0 0 0 14.05 10.455a4.074 4.074 0 0 0-.062-.725A4.098 4.098 0 0 0 9.918 7.5H7.034a.75.75 0 0 0 0 1.5h2.88A2.598 2.598 0 0 1 12.482 11.23a2.573 2.573 0 0 1 .062.475 2.586 2.586 0 0 1-.725 1.688 2.574 2.574 0 0 1-1.453.725.75.75 0 0 0-.525.713v1.006c0 .3.175.562.438.675a7.697 7.697 0 0 0 3.562.925A7.697 7.697 0 0 0 17.438 17.5a.678.678 0 0 0 .437-.675v-1.006a.75.75 0 0 0-.525-.713 2.574 2.574 0 0 1-1.453-.725 2.586 2.586 0 0 1-.725-1.688 2.573 2.573 0 0 1 .062-.475A2.598 2.598 0 0 1 17.818 9h2.88a.75.TFA.0 0 0 0-1.5Z" />
  </svg>
);

export const SOCIAL_SHARE_PLATFORMS: SocialSharePlatform[] = [
  { name: 'Instagram', icon: <InstagramIcon className="w-6 h-6" />, urlPattern: 'https://www.instagram.com/' }, 
  { name: 'TikTok', icon: <TikTokIcon className="w-6 h-6" />, urlPattern: 'https://www.tiktok.com/' }, 
  { name: 'X (Twitter)', icon: <XTwitterIcon className="w-6 h-6" />, urlPattern: 'https://twitter.com/intent/tweet?url={URL}&text={TITLE}%20--%20Shared%20via%20Vidzly%20{APP_URL}' },
  { name: 'Pinterest', icon: <PinterestIcon className="w-6 h-6" />, urlPattern: 'https://www.pinterest.com/pin/create/button/?url={URL}&media={IMAGE_URL}&description={TITLE}%20--%20Shared%20via%20Vidzly%20{APP_URL}' },
  { name: 'Threads', icon: <ThreadsIcon className="w-6 h-6" />, urlPattern: 'https://www.threads.net/intent/post?text={TITLE}%20{URL}%20--%20Shared%20via%20Vidzly%20{APP_URL}' },
];

export const LOCAL_STORAGE_KEYS = {
  USER_SETTINGS: 'vidzlyApp_userSettings_v4_youtube_trending', // Updated key version for new notification settings
  FAVORITE_VIDEOS: 'vidzlyApp_favoriteVideos_v2_youtube', 
  PREMIUM_BANNER_DISMISSED: 'vidzlyApp_premiumBannerDismissed_v2_youtube', 
};

export const PLACEHOLDER_THUMBNAIL = 'https://via.placeholder.com/480x360.png?text=Video+Loading...';
export const FEED_VIDEO_FETCH_LIMIT = 10; 
export const HOME_SCREEN_CATEGORY_VIDEO_LIMIT = 7; // This might be repurposed for initial trending load, or just use FEED_VIDEO_FETCH_LIMIT
export const HOME_SCREEN_PAGINATION_LIMIT = 5; // Used for pagination on home screen for trending videos.
// NAV_CATEGORIES_MOBILE_LIMIT removed
// NAV_CATEGORIES_DESKTOP_LIMIT removed

export const BACKEND_BASE_URL = 'https://vidzly-backend.vercel.app'; 
// For local dev with the new simple backend:
// export const BACKEND_BASE_URL = 'http://localhost:3001'; 
                                                          
export const DEFAULT_YOUTUBE_REGION_CODE = 'US';
export const AD_BANNER_HEIGHT_PX = 48; // h-12 -> 3rem -> 48px (for calculation in JS if needed)
export const BOTTOM_NAV_HEIGHT_PX = 64; // h-16 -> 4rem -> 64px
