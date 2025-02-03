export type PayloadJSON =
  | string
  | number
  | boolean
  | unknown[]
  | {
      [k: string]: unknown
    }
