'use client'

import { useState, useMemo, useEffect } from 'react'
import { debounce } from 'lodash'

interface UseDebouncedOptimisticOptions<TInput, TState> {
  initialState: TState
  action: (input: TInput) => Promise<any>
  prepareInput: (state: TState) => TInput
  isExecuting: boolean
  hasErrored: boolean
  delay?: number
}

export function useDebouncedOptimistic<TInput, TState>({
  initialState,
  action,
  prepareInput,
  isExecuting,
  hasErrored,
  delay = 1000,
}: UseDebouncedOptimisticOptions<TInput, TState>) {
  const [state, setState] = useState<TState>(initialState)

  const debouncedAction = useMemo(
    () =>
      debounce((newState: TState) => {
        const input = prepareInput(newState)
        action(input)
      }, delay),
    [action, prepareInput, delay], // Added delay to dependencies
  )

  useEffect(() => {
    if (hasErrored) {
      setState(initialState)
    }
  }, [hasErrored, initialState])

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedAction.cancel()
    }
  }, [debouncedAction])

  const update = (newState: TState) => {
    setState(newState) // Update optimistic state immediately
    debouncedAction(newState) // Debounce the server update
  }

  return { state, update }
}
