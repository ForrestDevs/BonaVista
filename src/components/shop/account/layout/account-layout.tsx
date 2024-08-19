import React from 'react'

import InteractiveLink from '@/components/ui/interactive-link'
import AccountNav from './account-nav'

import type { User } from '@payload-types'

interface AccountLayoutProps {
  customer: Omit<User, 'password_hash'> | null
  children: React.ReactNode
}

export default function AccountLayout({ customer, children }: AccountLayoutProps) {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="grid grid-cols-1  small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4">Got questions?</h3>
            <span className="txt-medium">
              You can find frequently asked questions and answers on our customer service page.
            </span>
          </div>
          <div>
            <InteractiveLink href="/customer-service">Customer Service</InteractiveLink>
          </div>
        </div>
      </div>
    </div>
  )
}




// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { ChevronRightIcon, UserIcon, MapPinIcon, PackageIcon, LogOutIcon, ArrowLeftIcon } from 'lucide-react'

// export function Component() {
//   const [activeSection, setActiveSection] = useState("overview")
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const checkIsMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//     }
//     checkIsMobile()
//     window.addEventListener('resize', checkIsMobile)
//     return () => window.removeEventListener('resize', checkIsMobile)
//   }, [])

//   const handleLogout = () => {
//     // Implement logout logic here
//     console.log("Logging out...")
//   }

//   const renderContent = () => {
//     switch (activeSection) {
//       case "overview":
//         return <OverviewSection isMobile={isMobile} setActiveSection={setActiveSection} />
//       case "profile":
//         return <ProfileSection isMobile={isMobile} setActiveSection={setActiveSection} />
//       case "addresses":
//         return <AddressesSection isMobile={isMobile} setActiveSection={setActiveSection} />
//       case "orders":
//         return <OrdersSection isMobile={isMobile} setActiveSection={setActiveSection} />
//       default:
//         return <OverviewSection isMobile={isMobile} setActiveSection={setActiveSection} />
//     }
//   }

//   if (isMobile) {
//     return (
//       <div className="min-h-screen bg-background p-4">
//         {renderContent()}
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen bg-background">
//       <aside className="w-64 border-r p-6 space-y-4">
//         <h2 className="text-2xl font-bold">Account</h2>
//         <nav className="space-y-2">
//           <button onClick={() => setActiveSection("overview")} className="w-full text-left py-2 hover:underline">Overview</button>
//           <button onClick={() => setActiveSection("profile")} className="w-full text-left py-2 hover:underline">Profile</button>
//           <button onClick={() => setActiveSection("addresses")} className="w-full text-left py-2 hover:underline">Addresses</button>
//           <button onClick={() => setActiveSection("orders")} className="w-full text-left py-2 hover:underline">Orders</button>
//         </nav>
//         <Separator />
//         <button onClick={handleLogout} className="w-full text-left py-2 hover:underline">Log out</button>
//       </aside>
//       <main className="flex-1 p-6 overflow-auto">
//         {renderContent()}
//       </main>
//     </div>
//   )
// }

// function OverviewSection({ isMobile, setActiveSection }) {
//   if (isMobile) {
//     return (
//       <div className="space-y-6">
//         <h1 className="text-4xl font-bold">Hello Luke</h1>
//         <nav className="space-y-4">
//           {[
//             { icon: <UserIcon />, label: "Profile", section: "profile" },
//             { icon: <MapPinIcon />, label: "Addresses", section: "addresses" },
//             { icon: <PackageIcon />, label: "Orders", section: "orders" },
//             { icon: <LogOutIcon />, label: "Log out", section: "logout" },
//           ].map((item, index) => (
//             <button
//               key={index}
//               onClick={() => item.section === "logout" ? handleLogout() : setActiveSection(item.section)}
//               className="flex items-center justify-between w-full p-4 bg-muted rounded-lg"
//             >
//               <div className="flex items-center gap-4">
//                 {item.icon}
//                 <span>{item.label}</span>
//               </div>
//               <ChevronRightIcon />
//             </button>
//           ))}
//         </nav>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Hello Luke</h1>
//         <p className="text-muted-foreground">Signed in as: luke.gannon@me.com</p>
//       </div>
//       <Separator />
//       <div className="grid grid-cols-2 gap-6">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Profile</h2>
//           <p className="text-4xl font-bold">100% <span className="text-xl text-muted-foreground">COMPLETED</span></p>
//         </div>
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Addresses</h2>
//           <p className="text-4xl font-bold">0 <span className="text-xl text-muted-foreground">SAVED</span></p>
//         </div>
//       </div>
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Recent orders</h2>
//         <div className="space-y-4">
//           {[
//             { date: "Fri Aug 16 2024", number: "#6163", amount: "$1,803.00" },
//             { date: "Fri Aug 09 2024", number: "#6036", amount: "$4,457.00" },
//             { date: "Thu Aug 08 2024", number: "#6022", amount: "$307.00" },
//           ].map((order, index) => (
//             <div key={index} className="flex justify-between items-center p-4 bg-muted rounded-lg">
//               <div>
//                 <p className="font-semibold">Date placed</p>
//                 <p>{order.date}</p>
//               </div>
//               <div>
//                 <p className="font-semibold">Order number</p>
//                 <p>{order.number}</p>
//               </div>
//               <div>
//                 <p className="font-semibold">Total amount</p>
//                 <p>{order.amount}</p>
//               </div>
//               <ChevronRightIcon className="h-6 w-6" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// function ProfileSection({ isMobile, setActiveSection }) {
//   const content = (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Profile</h1>
//       <p className="text-muted-foreground">
//         View and update your profile information, including your name, email, and phone number. You can also update
//         your billing address, or change your password.
//       </p>
//       <Separator />
//       {[
//         { label: "NAME", value: "Luke Gannon" },
//         { label: "EMAIL", value: "luke.gannon@me.com" },
//         { label: "PHONE", value: "6476197477" },
//         { label: "PASSWORD", value: "The password is not shown for security reasons" },
//       ].map((field, index) => (
//         <div key={index} className="flex justify-between items-center">
//           <div>
//             <p className="text-sm text-muted-foreground">{field.label}</p>
//             <p>{field.value}</p>
//           </div>
//           <Button variant="outline">Edit</Button>
//         </div>
//       ))}
//       <div>
//         <p className="text-sm text-muted-foreground mb-2">BILLING ADDRESS</p>
//         <p>Luke Gannon</p>
//         <p>GannonTech</p>
//         <p>36 Overbank Crescent</p>
//         <p>M3A1W2, Toronto</p>
//         <p>Canada</p>
//         <Button variant="outline" className="mt-2">Edit</Button>
//       </div>
//     </div>
//   )

//   if (isMobile) {
//     return (
//       <div className="space-y-4">
//         <button onClick={() => setActiveSection("overview")} className="flex items-center text-muted-foreground">
//           <ArrowLeftIcon className="mr-2" />
//           Account
//         </button>
//         {content}
//       </div>
//     )
//   }

//   return content
// }

// function AddressesSection({ isMobile, setActiveSection }) {
//   const content = (
//     <div>
//       <h1 className="text-3xl font-bold mb-4">Addresses</h1>
//       <p>You haven't saved any addresses yet.</p>
//     </div>
//   )

//   if (isMobile) {
//     return (
//       <div className="space-y-4">
//         <button onClick={() => setActiveSection("overview")} className="flex items-center text-muted-foreground">
//           <ArrowLeftIcon className="mr-2" />
//           Account
//         </button>
//         {content}
//       </div>
//     )
//   }

//   return content
// }

// function OrdersSection({ isMobile, setActiveSection }) {
//   const content = (
//     <div>
//       <h1 className="text-3xl font-bold mb-4">Orders</h1>
//       {/* Implement order history here */}
//     </div>
//   )

//   if (isMobile) {
//     return (
//       <div className="space-y-4">
//         <button onClick={() => setActiveSection("overview")} className="flex items-center text-muted-foreground">
//           <ArrowLeftIcon className="mr-2" />
//           Account
//         </button>
//         {content}
//       </div>
//     )
//   }

//   return content
// }
