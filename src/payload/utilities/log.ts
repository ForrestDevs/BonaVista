export const log = (...args: any[]) => {
  if (process.env.CONSOLE_DEBUG_HOOKS === 'true') {
    console.log(...args)
  }
}
