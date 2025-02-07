export const log = (...args: any[]) => {
  if (process.env.NEXT_PUBLIC_CONSOLE_DEBUG_HOOKS === 'true') {
    console.log(...args)
  }
}
