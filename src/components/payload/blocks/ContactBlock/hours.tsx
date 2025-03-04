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
import { cn } from '@/lib/utils/cn'

function formatTime(time: string) {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default async function HoursTable() {
  // const hours = await getCachedGlobal('store-hours')
  const hours = {
    days: [
      {
        dayOfWeek: 'Monday',
        openTime: '2023-01-02T10:00:00',
        closeTime: '2023-01-02T18:00:00',
        isClosed: true,
      },
      {
        dayOfWeek: 'Tuesday',
        openTime: '2023-01-03T10:00:00',
        closeTime: '2023-01-03T17:00:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Wednesday',
        openTime: '2023-01-04T10:00:00',
        closeTime: '2023-01-04T17:00:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Thursday',
        openTime: '2023-01-05T10:00:00',
        closeTime: '2023-01-05T17:00:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Friday',
        openTime: '2023-01-06T10:00:00',
        closeTime: '2023-01-06T17:00:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Saturday',
        openTime: '2023-01-07T10:00:00',
        closeTime: '2023-01-07T17:00:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Sunday',
        openTime: '2023-01-08T10:00:00',
        closeTime: '2023-01-08T17:00:00',
        isClosed: true,
      },
    ],
  }

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
            className={cn(
              item.dayOfWeek === currentDay?.dayOfWeek
                ? 'bg-primary text-primary-foreground hover:bg-blue-400'
                : '',
            )}
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
