'use client';
import { useTheme } from "next-themes";
import { useEffect } from "react";
import React from 'react';

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);


  // Close on ESC & click outside (mobile overlay)
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setMenuOpen(false);
    }

    if (menuOpen) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('click', onClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClickOutside);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light"); // force light when page loads
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>

      <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm pb-44 h-full">
        <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full">
          <a href="https://prebuiltui.com" aria-label="PrebuiltUI home" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="200" zoomAndPan="magnify" viewBox="0 0 600 149.999998" height="55" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><g /><clipPath id="1f1cf657fe"><path d="M 111 0 L 572.359375 0 L 572.359375 150 L 111 150 Z M 111 0 " clipRule="nonzero" /></clipPath><clipPath id="cf80fbcfc8"><rect x="0" width="462" y="0" height="150" /></clipPath><clipPath id="f301d4cdd5"><path d="M 7.175781 27.628906 L 97.605469 27.628906 L 97.605469 53.578125 L 7.175781 53.578125 Z M 7.175781 27.628906 " clipRule="nonzero" /></clipPath><clipPath id="e5706c60b3"><path d="M 84.628906 53.578125 L 20.25 53.578125 C 16.808594 53.578125 13.507812 52.210938 11.074219 49.777344 C 8.640625 47.34375 7.273438 44.046875 7.273438 40.605469 C 7.273438 37.164062 8.640625 33.863281 11.074219 31.429688 C 13.507812 28.996094 16.808594 27.628906 20.25 27.628906 L 84.628906 27.628906 C 88.070312 27.628906 91.371094 28.996094 93.804688 31.429688 C 96.238281 33.863281 97.605469 37.164062 97.605469 40.605469 C 97.605469 44.046875 96.238281 47.34375 93.804688 49.777344 C 91.371094 52.210938 88.070312 53.578125 84.628906 53.578125 Z M 84.628906 53.578125 " clipRule="nonzero" /></clipPath><clipPath id="e94800ee29"><path d="M 0.175781 0.628906 L 90.605469 0.628906 L 90.605469 26.578125 L 0.175781 26.578125 Z M 0.175781 0.628906 " clipRule="nonzero" /></clipPath><clipPath id="9e29f14a5b"><path d="M 77.628906 26.578125 L 13.25 26.578125 C 9.808594 26.578125 6.507812 25.210938 4.074219 22.777344 C 1.640625 20.34375 0.273438 17.046875 0.273438 13.605469 C 0.273438 10.164062 1.640625 6.863281 4.074219 4.429688 C 6.507812 1.996094 9.808594 0.628906 13.25 0.628906 L 77.628906 0.628906 C 81.070312 0.628906 84.371094 1.996094 86.804688 4.429688 C 89.238281 6.863281 90.605469 10.164062 90.605469 13.605469 C 90.605469 17.046875 89.238281 20.34375 86.804688 22.777344 C 84.371094 25.210938 81.070312 26.578125 77.628906 26.578125 Z M 77.628906 26.578125 " clipRule="nonzero" /></clipPath><clipPath id="b289da4009"><rect x="0" width="91" y="0" height="27" /></clipPath><clipPath id="818c310441"><path d="M 5 29 L 96 29 L 96 120 L 5 120 Z M 5 29 " clipRule="nonzero" /></clipPath><clipPath id="e88debeb2a"><path d="M 100.945312 42.640625 L 18.796875 124.789062 L 0.445312 106.4375 L 82.59375 24.289062 Z M 100.945312 42.640625 " clipRule="nonzero" /></clipPath><clipPath id="9c32aa4352"><path d="M 91.769531 51.8125 L 28.035156 115.546875 C 25.601562 117.980469 22.300781 119.347656 18.859375 119.347656 C 15.417969 119.347656 12.117188 117.980469 9.683594 115.546875 C 7.25 113.113281 5.882812 109.816406 5.882812 106.375 C 5.882812 102.933594 7.25 99.632812 9.683594 97.199219 L 73.417969 33.464844 C 75.851562 31.03125 79.152344 29.664062 82.59375 29.664062 C 86.035156 29.664062 89.335938 31.03125 91.769531 33.464844 C 94.203125 35.898438 95.570312 39.195312 95.570312 42.640625 C 95.570312 46.082031 94.203125 49.378906 91.769531 51.8125 Z M 91.769531 51.8125 " clipRule="nonzero" /></clipPath><clipPath id="8ebf92f6f1"><path d="M 0.71875 0.519531 L 90.71875 0.519531 L 90.71875 90.519531 L 0.71875 90.519531 Z M 0.71875 0.519531 " clipRule="nonzero" /></clipPath><clipPath id="0624979ef6"><path d="M 95.945312 13.640625 L 13.796875 95.789062 L -4.554688 77.4375 L 77.59375 -4.710938 Z M 95.945312 13.640625 " clipRule="nonzero" /></clipPath><clipPath id="ff5a86228a"><path d="M 86.769531 22.8125 L 23.035156 86.546875 C 20.601562 88.980469 17.300781 90.347656 13.859375 90.347656 C 10.417969 90.347656 7.117188 88.980469 4.683594 86.546875 C 2.25 84.113281 0.882812 80.816406 0.882812 77.375 C 0.882812 73.933594 2.25 70.632812 4.683594 68.199219 L 68.417969 4.464844 C 70.851562 2.03125 74.152344 0.664062 77.59375 0.664062 C 81.035156 0.664062 84.335938 2.03125 86.769531 4.464844 C 89.203125 6.898438 90.570312 10.195312 90.570312 13.640625 C 90.570312 17.082031 89.203125 20.378906 86.769531 22.8125 Z M 86.769531 22.8125 " clipRule="nonzero" /></clipPath><clipPath id="387d1798c1"><rect x="0" width="91" y="0" height="91" /></clipPath><clipPath id="e3dbc4ec5c"><path d="M 78 99 L 101 99 L 101 122 L 78 122 Z M 78 99 " clipRule="nonzero" /></clipPath><clipPath id="506ba2c260"><path d="M 105.304688 110.277344 L 89.871094 125.710938 L 74.433594 110.277344 L 89.871094 94.84375 Z M 105.304688 110.277344 " clipRule="nonzero" /></clipPath><clipPath id="3e531b8e99"><path d="M 97.585938 117.996094 C 95.539062 120.042969 92.765625 121.191406 89.871094 121.191406 C 86.976562 121.191406 84.199219 120.042969 82.152344 117.996094 C 80.105469 115.949219 78.957031 113.171875 78.957031 110.277344 C 78.957031 107.382812 80.105469 104.605469 82.152344 102.558594 C 84.199219 100.515625 86.976562 99.363281 89.871094 99.363281 C 92.765625 99.363281 95.539062 100.515625 97.585938 102.558594 C 99.632812 104.605469 100.785156 107.382812 100.785156 110.277344 C 100.785156 113.171875 99.632812 115.949219 97.585938 117.996094 Z M 97.585938 117.996094 " clipRule="nonzero" /></clipPath><clipPath id="4937a87309"><path d="M 0.921875 0.359375 L 23 0.359375 L 23 22.199219 L 0.921875 22.199219 Z M 0.921875 0.359375 " clipRule="nonzero" /></clipPath><clipPath id="5931ba7a8f"><path d="M 27.304688 11.277344 L 11.871094 26.710938 L -3.566406 11.277344 L 11.871094 -4.15625 Z M 27.304688 11.277344 " clipRule="nonzero" /></clipPath><clipPath id="c438166a54"><path d="M 19.585938 18.996094 C 17.539062 21.042969 14.765625 22.191406 11.871094 22.191406 C 8.976562 22.191406 6.199219 21.042969 4.152344 18.996094 C 2.105469 16.949219 0.957031 14.171875 0.957031 11.277344 C 0.957031 8.382812 2.105469 5.605469 4.152344 3.558594 C 6.199219 1.515625 8.976562 0.363281 11.871094 0.363281 C 14.765625 0.363281 17.539062 1.515625 19.585938 3.558594 C 21.632812 5.605469 22.785156 8.382812 22.785156 11.277344 C 22.785156 14.171875 21.632812 16.949219 19.585938 18.996094 Z M 19.585938 18.996094 " clipRule="nonzero" /></clipPath><clipPath id="cb14aecb92"><rect x="0" width="23" y="0" height="23" /></clipPath><clipPath id="c904cfda90"><path d="M 47 99 L 70 99 L 70 122 L 47 122 Z M 47 99 " clipRule="nonzero" /></clipPath><clipPath id="89b056ee5e"><path d="M 74.066406 110.277344 L 58.632812 125.710938 L 43.199219 110.277344 L 58.632812 94.84375 Z M 74.066406 110.277344 " clipRule="nonzero" /></clipPath><clipPath id="a46ef25281"><path d="M 66.351562 117.996094 C 64.304688 120.042969 61.527344 121.191406 58.632812 121.191406 C 55.738281 121.191406 52.960938 120.042969 50.914062 117.996094 C 48.867188 115.949219 47.71875 113.171875 47.71875 110.277344 C 47.71875 107.382812 48.867188 104.605469 50.914062 102.558594 C 52.960938 100.515625 55.738281 99.363281 58.632812 99.363281 C 61.527344 99.363281 64.304688 100.515625 66.351562 102.558594 C 68.398438 104.605469 69.546875 107.382812 69.546875 110.277344 C 69.546875 113.171875 68.398438 115.949219 66.351562 117.996094 Z M 66.351562 117.996094 " clipRule="nonzero" /></clipPath><clipPath id="1fa7f32b30"><path d="M 0.480469 0.359375 L 22.558594 0.359375 L 22.558594 22.199219 L 0.480469 22.199219 Z M 0.480469 0.359375 " clipRule="nonzero" /></clipPath><clipPath id="e681107a32"><path d="M 27.066406 11.277344 L 11.632812 26.710938 L -3.800781 11.277344 L 11.632812 -4.15625 Z M 27.066406 11.277344 " clipRule="nonzero" /></clipPath><clipPath id="b7608db3a1"><path d="M 19.351562 18.996094 C 17.304688 21.042969 14.527344 22.191406 11.632812 22.191406 C 8.738281 22.191406 5.960938 21.042969 3.914062 18.996094 C 1.867188 16.949219 0.71875 14.171875 0.71875 11.277344 C 0.71875 8.382812 1.867188 5.605469 3.914062 3.558594 C 5.960938 1.515625 8.738281 0.363281 11.632812 0.363281 C 14.527344 0.363281 17.304688 1.515625 19.351562 3.558594 C 21.398438 5.605469 22.546875 8.382812 22.546875 11.277344 C 22.546875 14.171875 21.398438 16.949219 19.351562 18.996094 Z M 19.351562 18.996094 " clipRule="nonzero" /></clipPath><clipPath id="4c3084f79d"><rect x="0" width="23" y="0" height="23" /></clipPath><clipPath id="02005a78b9"><rect x="0" width="573" y="0" height="150" /></clipPath></defs><g transform="matrix(1, 0, 0, 1, 19, -0.000000000000007527)"><g clip-path="url(#02005a78b9)"><g clip-path="url(#1f1cf657fe)"><g transform="matrix(1, 0, 0, 1, 111, -0.000000000000007527)"><g clip-path="url(#cf80fbcfc8)"><g fill="#050040" fillOpacity="1"><g transform="translate(1.093067, 121.446488)"><g><path d="M 84.375 -88.046875 L 84.375 -35.046875 C 84.375 -27.660156 82.96875 -21.25 80.15625 -15.8125 C 77.351562 -10.375 73.140625 -6.175781 67.515625 -3.21875 C 61.890625 -0.269531 54.84375 1.203125 46.375 1.203125 C 34.25 1.203125 24.992188 -1.90625 18.609375 -8.125 C 12.222656 -14.351562 9.03125 -23.148438 9.03125 -34.515625 L 9.03125 -88.046875 L 32.9375 -88.046875 L 32.9375 -36.375 C 32.9375 -30.15625 34.101562 -25.640625 36.4375 -22.828125 C 38.769531 -20.015625 42.203125 -18.609375 46.734375 -18.609375 C 49.984375 -18.609375 52.628906 -19.21875 54.671875 -20.4375 C 56.722656 -21.664062 58.222656 -23.601562 59.171875 -26.25 C 60.117188 -28.90625 60.59375 -32.320312 60.59375 -36.5 L 60.59375 -88.046875 Z M 84.375 -88.046875 " /></g></g></g><g fill="#050040" fillOpacity="1"><g transform="translate(107.86259, 121.446488)"><g><path d="M 39.984375 -88.046875 C 51.148438 -88.046875 59.515625 -85.613281 65.078125 -80.75 C 70.640625 -75.894531 73.421875 -68.992188 73.421875 -60.046875 C 73.421875 -56.023438 72.847656 -52.164062 71.703125 -48.46875 C 70.554688 -44.78125 68.6875 -41.488281 66.09375 -38.59375 C 63.507812 -35.707031 60.078125 -33.421875 55.796875 -31.734375 C 51.523438 -30.046875 46.253906 -29.203125 39.984375 -29.203125 L 33.3125 -29.203125 L 33.3125 0 L 9.515625 0 L 9.515625 -88.046875 Z M 39.453125 -68.84375 L 33.3125 -68.84375 L 33.3125 -48.609375 L 38 -48.609375 C 40.050781 -48.609375 41.957031 -48.957031 43.71875 -49.65625 C 45.488281 -50.351562 46.90625 -51.492188 47.96875 -53.078125 C 49.03125 -54.671875 49.5625 -56.789062 49.5625 -59.4375 C 49.5625 -62.207031 48.738281 -64.46875 47.09375 -66.21875 C 45.445312 -67.96875 42.898438 -68.84375 39.453125 -68.84375 Z M 39.453125 -68.84375 " /></g></g></g><g fill="#050040" fillOpacity="1"><g transform="translate(199.218678, 121.446488)"><g><path d="M 9.515625 0 L 9.515625 -88.046875 L 33.3125 -88.046875 L 33.3125 -19.21875 L 67.21875 -19.21875 L 67.21875 0 Z M 9.515625 0 " /></g></g></g><g fill="#050040" fillOpacity="1"><g transform="translate(284.433472, 121.446488)"><g><path d="M 9.515625 0 L 9.515625 -88.046875 L 33.421875 -88.046875 L 33.421875 0 Z M 9.515625 0 " /></g></g></g><g fill="#050040" fillOpacity="1"><g transform="translate(340.808312, 121.446488)"><g><path d="M 93.34375 0 L 62.15625 0 L 30 -62.03125 L 29.453125 -62.03125 C 29.648438 -60.144531 29.828125 -57.875 29.984375 -55.21875 C 30.148438 -52.570312 30.289062 -49.875 30.40625 -47.125 C 30.53125 -44.375 30.59375 -41.894531 30.59375 -39.6875 L 30.59375 0 L 9.515625 0 L 9.515625 -88.046875 L 40.59375 -88.046875 L 72.640625 -26.859375 L 73 -26.859375 C 72.875 -28.785156 72.75 -31.023438 72.625 -33.578125 C 72.507812 -36.128906 72.398438 -38.707031 72.296875 -41.3125 C 72.203125 -43.925781 72.15625 -46.234375 72.15625 -48.234375 L 72.15625 -88.046875 L 93.34375 -88.046875 Z M 93.34375 0 " /></g></g></g></g></g></g><g clip-path="url(#f301d4cdd5)"><g clip-path="url(#e5706c60b3)"><g transform="matrix(1, 0, 0, 1, 7, 27)"><g clip-path="url(#b289da4009)"><g clip-path="url(#e94800ee29)"><g clip-path="url(#9e29f14a5b)"><path fill="#050040" d="M 90.605469 26.578125 L 0.277344 26.578125 L 0.277344 0.628906 L 90.605469 0.628906 Z M 90.605469 26.578125 " fillOpacity="1" fill-rule="nonzero" /></g></g></g></g></g></g><g clip-path="url(#818c310441)"><g clip-path="url(#e88debeb2a)"><g clip-path="url(#9c32aa4352)"><g transform="matrix(1, 0, 0, 1, 5, 29)"><g clip-path="url(#387d1798c1)"><g clip-path="url(#8ebf92f6f1)"><g clip-path="url(#0624979ef6)"><g clip-path="url(#ff5a86228a)"><path fill="#050040" d="M 95.945312 13.640625 L 13.867188 95.714844 L -4.484375 77.367188 L 77.59375 -4.710938 Z M 95.945312 13.640625 " fillOpacity="1" fill-rule="nonzero" /></g></g></g></g></g></g></g></g><g clip-path="url(#e3dbc4ec5c)"><g clip-path="url(#506ba2c260)"><g clip-path="url(#3e531b8e99)"><g transform="matrix(1, 0, 0, 1, 78, 99)"><g clip-path="url(#cb14aecb92)"><g clip-path="url(#4937a87309)"><g clip-path="url(#5931ba7a8f)"><g clip-path="url(#c438166a54)"><path fill="#050040" d="M 27.304688 11.277344 L 11.871094 26.710938 L -3.566406 11.277344 L 11.871094 -4.15625 Z M 27.304688 11.277344 " fillOpacity="1" fill-rule="nonzero" /></g></g></g></g></g></g></g></g><g clip-path="url(#c904cfda90)"><g clip-path="url(#89b056ee5e)"><g clip-path="url(#a46ef25281)"><g transform="matrix(1, 0, 0, 1, 47, 99)"><g clip-path="url(#4c3084f79d)"><g clip-path="url(#1fa7f32b30)"><g clip-path="url(#e681107a32)"><g clip-path="url(#b7608db3a1)"><path fill="#050040" d="M 27.066406 11.277344 L 11.632812 26.710938 L -3.800781 11.277344 L 11.632812 -4.15625 Z M 27.066406 11.277344 " fillOpacity="1" fill-rule="nonzero" /></g></g></g></g></g></g></g></g></g></g></svg>
          </a>

          <div
            id="menu"
            ref={menuRef}
            className={[
              'max-md:absolute max-md:top-0 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-full max-md:bg-white/50 max-md:backdrop-blur',
              'flex items-center gap-8 font-medium',
              'max-md:flex-col max-md:justify-center',
              menuOpen ? 'max-md:w-full' : 'max-md:w-0',
            ].join(' ')}
            aria-hidden={!menuOpen}
          >
            <a href="#hero" className="hover:text-gray-600">Home</a>
            <a href="#features" className="hover:text-gray-600">Features</a>
            <a href="#testimonials" className="hover:text-gray-600">Testimonials</a>
            <a href="#faq" className="hover:text-gray-600">FAQ&apos;s</a>

            <div className="relative group flex items-center gap-1 cursor-pointer">
              <span>Policy</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#050040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="absolute bg-white font-normal flex flex-col gap-2 w-max rounded-lg p-4 top-36 left-0 opacity-0 -translate-y-full group-hover:top-44 group-hover:opacity-100 transition-all duration-300 shadow-sm">
                <a href="#" className="hover:translate-x-1 hover:text-slate-500 transition-all">Templates</a>
                <a href="#" className="hover:translate-x-1 hover:text-slate-500 transition-all">UI Components</a>
                <a href="#" className="hover:translate-x-1 hover:text-slate-500 transition-all">Mobile Apps</a>
                <a href="#" className="hover:translate-x-1 hover:text-slate-500 transition-all">Web Apps</a>
              </div>
            </div>



            <button
              onClick={() => setMenuOpen(false)}
              className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <button className="hidden md:block bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
            Contact Us
          </button>

          <button
            id="open-menu"
            onClick={() => setMenuOpen(true)}
            className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M4 6h16" />
            </svg>
          </button>
        </nav>

        <div className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max mx-auto px-4 py-2 mt-40 md:mt-32">
          <span>The only digital loyalty system that you need</span>

        </div>

        <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center mx-auto mt-8">
          Make every interaction rewarding
        </h5>

        <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6 max-md:px-2">
          Deliver meaningful loyalty experiences that keep customers coming back and build lasting relationships with your brand.
        </p>

        <div className="mx-auto w-full flex items-center justify-center gap-3 mt-4">
          <button className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
            Get Started
          </button>
          <button className="flex items-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-6 py-3">
            <span>Learn More</span>
            <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M1.25.5 4.75 4l-3.5 3.5" stroke="#050040" strokeOpacity=".4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}
