'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils/cn'
import NumberFlow from '@number-flow/react'

interface DualRangeSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: 'top' | 'bottom'
  lableContenPos?: 'left' | 'right'
  label?: React.ReactNode | ((value: number | undefined) => React.ReactNode)
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

function DualRangeSlider({
  className,
  label,
  labelPosition = 'top',
  lableContenPos = 'right',
  ...props
}: DualRangeSliderProps) {
  const initialValue = Array.isArray(props.value) ? props.value : [props.min, props.max]

  return (
    <SliderPrimitive.Root
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full dark:bg-gray-800 bg-gray-300">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <React.Fragment>
        {initialValue.map((value, index) => (
          <React.Fragment key={index}>
            <SliderPrimitive.Thumb className="relative block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              {label && (
                <div
                  className={cn(
                    'absolute flex w-full justify-center items-baseline gap-1',
                    labelPosition === 'top' && '-top-7',
                    labelPosition === 'bottom' && 'top-4',
                  )}
                >
                  {lableContenPos === 'left' && (
                    <>
                      {typeof label === 'function' ? (
                        <span className="inline-block">{label(value)}</span>
                      ) : (
                        label && <span className="inline-block">{label}</span>
                      )}
                    </>
                  )}
                  <NumberFlow
                    willChange
                    value={value}
                    isolate
                    opacityTiming={{
                      duration: 250,
                      easing: 'ease-out',
                    }}
                    transformTiming={{
                      easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
                      duration: 500,
                    }}
                  />
                  {lableContenPos === 'right' && (
                    <>
                      {typeof label === 'function' ? (
                        <span className="inline-block">{label(value)}</span>
                      ) : (
                        label && <span className="inline-block">{label}</span>
                      )}
                    </>
                  )}
                </div>
              )}
            </SliderPrimitive.Thumb>
          </React.Fragment>
        ))}
      </React.Fragment>
    </SliderPrimitive.Root>
  )
}

function RangeLabel({
  min,
  max,
  prefix,
  suffix,
}: {
  min: number
  max: number
  prefix?: string
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex items-center">
        {prefix && <span>{prefix}</span>}
        <NumberFlow
          value={min}
          isolate
          opacityTiming={{
            duration: 250,
            easing: 'ease-out',
          }}
          transformTiming={{
            easing: 'linear',
            duration: 500,
          }}
        />
        {suffix && <span>{suffix}</span>}
      </div>
      <span>-</span>
      <div className="flex items-center">
        {prefix && <span>{prefix}</span>}
        <NumberFlow
          value={max}
          isolate
          opacityTiming={{
            duration: 250,
            easing: 'ease-out',
          }}
          transformTiming={{
            easing: 'linear',
            duration: 500,
          }}
        />
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  )
}

export { DualRangeSlider, RangeLabel, Slider }
