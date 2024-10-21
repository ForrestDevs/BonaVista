'use client'

import React, { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const hoursConfig = [
  { day: 'Monday', hours: 'Closed' },
  { day: 'Tuesday', hours: 'Closed' },
  { day: 'Wednesday', hours: '10am - 6pm' },
  { day: 'Thursday', hours: '10am - 6pm' },
  { day: 'Friday', hours: '10am - 6pm' },
  { day: 'Saturday', hours: '10am - 5pm' },
  { day: 'Sunday', hours: '10am - 3pm' },
]

export default function HoursTable() {
  const currentDay = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[new Date().getDay()]
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead>Hours</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hoursConfig.map((item) => (
          <TableRow
            key={item.day}
            className={item.day === currentDay ? 'bg-primary text-primary-foreground' : ''}
          >
            <TableCell>{item.day}</TableCell>
            <TableCell>{item.hours}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
