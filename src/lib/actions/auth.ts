// 'use server'

// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
// import type { User } from '@payload-types'

// export const getMeUser = async (): Promise<User | null> => {
//   const cookieStore = await cookies()
//   const token = cookieStore.get('payload-token')?.value
//   const meUserReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
//     headers: {
//       Authorization: `JWT ${token}`,
//     },
//   })

//   const { user } = await meUserReq.json()
//   return user
// }

// export const logout = async () => {
//   const cookieStore = await cookies()
//   cookieStore.delete('payload-token')
//   redirect('/shop/account')
// }
