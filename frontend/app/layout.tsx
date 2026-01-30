// 'use client';

// import { useEffect, useState } from 'react';
// import { clearToken, isLoggedIn } from './lib/api';
// import AdminHeader from './components/AdminHeader';
// import { isAdmin } from './lib/auth';
// import './globals.css';

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [logged, setLogged] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     setLogged(isLoggedIn());
//     // TODO: Fetch isAdmin status from your API
//   }, []);

//   function logout() {
//     clearToken();
//     setLogged(false);
//     window.location.href = '/products';
//   }

//   return (
//     <html lang="en">
//       <body className="bg-gray-50">
//         {/* NAVBAR */}
//         <nav className="bg-white border-b shadow-sm">
//           <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
//             {/* LEFT */}
//             <div className="flex gap-6 items-center">
//               <a href="/products" className="text-lg font-bold">
//                 MiniEcom
//               </a>
//               <a href="/products" className="hover:underline">
//                 Products
//               </a>
//               {logged && (
//                 <>
//                   <a href="/cart" className="hover:underline">
//                     Cart
//                   </a>
//                   <a href="/orders" className="hover:underline">
//                     Orders
//                   </a>
//                 </>
//               )}
//             </div>

//             {/* RIGHT */}
//             <div className="flex gap-4 items-center">
//               {!logged ? (
//                 <>
//                   <a href="/login" className="hover:underline">
//                     Login
//                   </a>
//                   <a
//                     href="/register"
//                     className="px-4 py-1 border rounded hover:bg-gray-100"
//                   >
//                     Register
//                   </a>
//                 </>
//               ) : (
//                 <button
//                   onClick={logout}
//                   className="px-4 py-1 border rounded hover:bg-gray-100"
//                 >
//                   Logout
//                 </button>
//               )}
//             {logged && (
//               <>
//                 <a href="/profile" className="hover:underline">Profile</a>
//                 <a href="/seller/products" className="hover:underline">Seller</a>
//                 {/* {isAdmin && (
//                   <a href="/admin" className="hover:underline">
//                     Admin
//                   </a>
//                 )} */}
//               </>
//             )}
//             </div>
            
//           </div>
//         </nav>

//         {/* PAGE CONTENT */}
//         <main className="max-w-6xl mx-auto px-6 py-6">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from 'next';
import './globals.css';
import HeaderSwitcher from './components/HeaderSwitcher';

export const metadata: Metadata = {
  title: 'Mini Ecommerce',
  description: 'Mini ecommerce system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <HeaderSwitcher />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
