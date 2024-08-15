// 'use client'

// import React from 'react'

// import {
//   Select,
//   useFormFields,
//   SelectField,
//   SelectInput,
//   SelectFieldProps,
//   Options,
// } from '@payloadcms/ui'

// import { useField } from '@payloadcms/ui'

// import { icons } from 'lucide-react'

// export function generateLucideIconOptions(): Options[] {
//   const lucideIconOptions: Options[] = []

//   Object.keys(icons).forEach((icon) => {
//     lucideIconOptions.push({
//       hasRows: true,
//     })
//   })

//   return lucideIconOptions
// }

// interface LucideProps {
//   name: string
//   color: string
//   size: number
// }

// export const LucideIcon = ({ name, color, size }: LucideProps) => {
//   const LucideIcon = icons[name]

//   return <LucideIcon color={color} size={size} />
// }

// export function CustomIconSelect() {
//   const { value, setValue, path } = useField({ })

//   return (
//     <div>
//       <Select options={generateLucideIconOptions} />
//       <h3>Preview</h3>
//       <LucideIcon name={value ?? 'Plus'} color={'white'} size={48} />
//     </div>
//   )
// }
