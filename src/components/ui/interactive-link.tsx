import { ArrowUpRight } from 'lucide-react'
import { Text } from '@/components/ui/text'
import { YnsLink } from './link'

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

const InteractiveLink = ({ href, children, onClick, ...props }: InteractiveLinkProps) => {
  return (
    <YnsLink className="flex gap-x-1 items-center group" href={href} onClick={onClick} {...props}>
      <Text className="text-ui-fg-interactive">{children}</Text>
      <ArrowUpRight className="group-hover:rotate-45 ease-in-out duration-150" color="blue" />
    </YnsLink>
  )
}

export default InteractiveLink
