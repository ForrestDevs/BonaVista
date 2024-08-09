type Props = {
  children: React.ReactNode
}

export function H1(props: Props) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {props.children}
    </h1>
  )
}

export function H2(props: Props) {
  return (
    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight lg:text-4xl">
      {props.children}
    </h2>
  )
}

export function H3(props: Props) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl">
      {props.children}
    </h3>
  )
}

export function H4(props: Props) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
      {props.children}
    </h4>
  )
}

export function P(props: Props) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{props.children}</p>
}

export function Blockquote(props: Props) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">&quot;{props.children}&quot;</blockquote>
  )
}

export function List(props: Props) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{props.children}</ul>
}

export function InlineCode(props: Props) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {props.children}
    </code>
  )
}
