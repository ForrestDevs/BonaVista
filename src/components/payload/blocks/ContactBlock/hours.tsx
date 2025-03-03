import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCachedGlobal } from '@/lib/utils/getGlobals'

function formatTime(time: string) {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default async function HoursTable() {
  const hours = await getCachedGlobal('store-hours')

  const currentDay = hours.days.find(
    (day) => day.dayOfWeek === new Date().toLocaleDateString('en-US', { weekday: 'long' }),
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead>Hours</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hours.days.map((item) => (
          <TableRow
            key={item.dayOfWeek}
            className={
              item.dayOfWeek === currentDay?.dayOfWeek ? 'bg-primary text-primary-foreground' : ''
            }
          >
            <TableCell>{item.dayOfWeek}</TableCell>
            <TableCell>
              {item.isClosed
                ? 'Closed'
                : `${formatTime(item.openTime)} - ${formatTime(item.closeTime)}`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
