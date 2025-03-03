import React from 'react'
import Grid from '@components/payload/grid'
import clsx from 'clsx'

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded'
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300'
const items = 'bg-neutral-400 dark:bg-neutral-700'

export function ResultsSkeleton() {
  return (
    <React.Fragment>
      <div className="order-first w-full flex-none md:max-w-[125px]">
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      </div>
      <div className="order-last min-h-screen w-full md:order-none">
        <div className="space-y-4">
          <h1 className={clsx(skeleton, activeAndTitles)} />
          <p className={clsx(skeleton, items)} />
          <div className="gap-6">
            <Grid className="grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              {Array(12)
                .fill(0)
                .map((_, index) => {
                  return (
                    <Grid.Item
                      className="animate-pulse bg-neutral-100 dark:bg-neutral-900"
                      key={index}
                    />
                  )
                })}
            </Grid>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
