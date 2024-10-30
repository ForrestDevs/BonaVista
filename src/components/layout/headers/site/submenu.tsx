import * as React from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { createStitches } from '@stitches/core'
import { cn } from '@/lib/utils/cn'

const TriggerWithIndicator: React.FC<{ children?: React.ReactNode; disabled?: boolean }> = ({
  children,
  disabled,
}) => {
  return (
    <NavigationMenu.Trigger className={triggerClass()} disabled={disabled}>
      {children}
      <CaretDownIcon />
    </NavigationMenu.Trigger>
  )
}

const CaretDownIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
)

const LinkGroup: React.FC<{ items: string[]; bordered?: boolean }> = ({
  items,
  bordered = true,
}) => {
  return (
    <ul className={bordered ? borderdListClass() : listClass()}>
      {items.map((item, i) => (
        <li key={i}>
          <NavigationMenu.Link
            href="#example"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'black',
            }}
          >
            {item}
          </NavigationMenu.Link>
        </li>
      ))}
    </ul>
  )
}

export const Submenus = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className={mainListClass()}>
        <NavigationMenu.Item>
          <TriggerWithIndicator>Products</TriggerWithIndicator>
          <NavigationMenu.Content className={submenusContentClass()}>
            <NavigationMenu.Sub className={submenusRootClass()} defaultValue="extensibility">
              <NavigationMenu.List className={mainListClass()}>
                <NavigationMenu.Item value="extensibility">
                  <NavigationMenu.Trigger className={submenusSubTriggerClass()}>
                    Extensibility
                  </NavigationMenu.Trigger>

                  <NavigationMenu.Content
                    className={submenusSubContentClass()}
                    style={{
                      gridTemplateColumns: '1.5fr 1fr 1fr',
                    }}
                  >
                    <LinkGroup items={['Donec quis dui', 'Vestibulum', 'Nunc dignissim']} />
                    <LinkGroup
                      items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                    />
                    <LinkGroup
                      items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                    />
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item value="security">
                  <NavigationMenu.Trigger className={submenusSubTriggerClass()}>
                    Security
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content
                    className={submenusSubContentClass()}
                    style={{
                      gridTemplateColumns: '1fr 1fr 1fr',
                    }}
                  >
                    <LinkGroup
                      items={[
                        'Fusce pellentesque',
                        'Aliquam porttitor',
                        'Pellentesque',
                        'Vestibulum',
                      ]}
                    />
                    <LinkGroup
                      items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                    />
                    <LinkGroup items={['Fusce pellentesque', 'Aliquam porttitor']} />
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item value="authentication">
                  <NavigationMenu.Trigger className={submenusSubTriggerClass()}>
                    Authentication
                  </NavigationMenu.Trigger>

                  <NavigationMenu.Content
                    className={submenusSubContentClass()}
                    style={{
                      gridTemplateColumns: '1.5fr 1fr 1fr',
                    }}
                  >
                    <LinkGroup items={['Donec quis dui', 'Vestibulum', 'Nunc dignissim']} />
                    <LinkGroup
                      items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                    />
                    <LinkGroup
                      items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                    />
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Indicator className={submenusSubIndicatorClass()} />
              </NavigationMenu.List>

              <NavigationMenu.Viewport className={submenusSubViewportClass()} />
            </NavigationMenu.Sub>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <TriggerWithIndicator>Company</TriggerWithIndicator>
          <NavigationMenu.Content className={submenusContentClass()}>
            <NavigationMenu.Sub
              className={submenusRootClass()}
              orientation="vertical"
              defaultValue="customers"
            >
              <NavigationMenu.List className={mainListClass()}>
                <NavigationMenu.Item value="customers">
                  <NavigationMenu.Trigger className={submenusSubTriggerClass()}>
                    Customers
                  </NavigationMenu.Trigger>

                  <NavigationMenu.Content
                    className={submenusSubContentClass()}
                    style={{
                      gridTemplateColumns: '1.5fr 1fr',
                    }}
                  >
                    <LinkGroup items={['Donec quis dui', 'Vestibulum', 'Nunc dignissim']} />
                    <LinkGroup
                      items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                    />
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item value="partners">
                  <NavigationMenu.Trigger className={submenusSubTriggerClass()}>
                    Partners
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content
                    className={submenusSubContentClass()}
                    style={{
                      gridTemplateColumns: '1fr 1fr',
                    }}
                  >
                    <LinkGroup
                      items={[
                        'Fusce pellentesque',
                        'Aliquam porttitor',
                        'Pellentesque',
                        'Vestibulum',
                      ]}
                    />
                    <LinkGroup
                      items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                    />
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Item value="enterprise">
                  <NavigationMenu.Trigger className={submenusSubTriggerClass()}>
                    Enterprise
                  </NavigationMenu.Trigger>

                  <NavigationMenu.Content
                    className={submenusSubContentClass()}
                    style={{
                      gridTemplateColumns: '1.5fr 1fr',
                    }}
                  >
                    <LinkGroup items={['Donec quis dui', 'Vestibulum', 'Nunc dignissim']} />
                    <LinkGroup
                      items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                    />
                  </NavigationMenu.Content>
                </NavigationMenu.Item>

                <NavigationMenu.Indicator className={submenusSubIndicatorClass()} />
              </NavigationMenu.List>

              <NavigationMenu.Viewport className={submenusSubViewportClass()} />
            </NavigationMenu.Sub>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <TriggerWithIndicator disabled>Developers</TriggerWithIndicator>
          <NavigationMenu.Content
            className={submenusSubContentClass()}
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <LinkGroup items={['Donec quis dui', 'Vestibulum']} />
            <LinkGroup items={['Fusce pellentesque', 'Aliquam porttitor']} />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="#example" className={linkClass()}>
            Link
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport className={submenusViewportClass()} />
    </NavigationMenu.Root>
  )
}

const listStyles = cn('flex flex-col gap-3.5 m-0 p-0 list-none')

const listClass = () => listStyles

const borderdListClass = () => cn(listStyles, 'bg-[#f3f4f5] border border-[#d4d6d8] p-6 rounded-lg')

const mainListClass = () => cn('list-none flex data-[orientation=vertical]:flex-col')

const itemStyles = 'px-4 py-2.5 font-bold'

const linkClass = () => cn(itemStyles, 'text-inherit no-underline block')

const triggerClass = () =>
  cn(
    itemStyles,
    'flex items-center border-0 bg-transparent text-inherit gap-1',
    '[&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-[ease]',
    '[&[data-state=open]>svg]:rotate-180',
  )

const submenusRootClass = () =>
  cn(
    'grid w-full max-w-[800px] gap-5',
    'data-[orientation=vertical]:grid-cols-[0.3fr_1fr]',
    'data-[orientation=horizontal]:justify-items-center data-[orientation=horizontal]:-mt-2.5',
  )

const submenusViewportClass = () =>
  cn(
    'absolute left-4 right-4 top-full border origin-top-center w-[calc(100%-2rem)] bg-white mt-4',
    'h-[var(--radix-navigation-menu-viewport-height)] transition-[height] duration-300 ease-[ease] overflow-hidden',
    'shadow-[0_50px_100px_-20px_rgba(50,50,93,0.1),0_30px_60px_-30px_rgba(0,0,0,0.2)]',
    'data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut',
  )

const submenusContentClass = () =>
  cn(
    'flex justify-center absolute top-0 left-0 w-full p-9',
    'data-[motion=from-start]:animate-enterFromLeft',
    'data-[motion=from-end]:animate-enterFromRight',
    'data-[motion=to-start]:animate-exitToLeft',
    'data-[motion=to-end]:animate-exitToRight',
  )

const submenusSubContentClass = () => cn('grid gap-5 w-full')

const submenusSubViewportClass = () => cn('w-full')

const submenusSubTriggerClass = () =>
  cn(
    itemStyles,
    'relative flex items-center border-0 bg-transparent text-inherit w-full rounded',
    'data-[state=open]:bg-[#f3f4f5]',
  )

const submenusSubIndicatorClass = () =>
  cn(
    'bg-black rounded',
    'data-[orientation=vertical]:w-[3px] data-[orientation=vertical]:transition-[transform,height] data-[orientation=vertical]:duration-250 data-[orientation=vertical]:ease-[ease]',
    '[dir=ltr]:data-[orientation=vertical]:right-0 [dir=rtl]:data-[orientation=vertical]:left-0',
    'data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:transition-[transform,width] data-[orientation=horizontal]:duration-250 data-[orientation=horizontal]:ease-[ease]',
  )
