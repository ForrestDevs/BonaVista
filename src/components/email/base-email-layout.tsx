import React from 'react'
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Hr,
} from '@react-email/components'

interface BaseEmailLayoutProps {
  children: React.ReactNode
  previewText: string
}

export function BaseEmailLayout({ children, previewText }: BaseEmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: '#f6f9fc',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: '0',
          padding: '0',
        }}
      >
        <Container style={{ padding: '20px', margin: '0 auto', maxWidth: '600px' }}>
          <Section style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
            <Row>
              <Column>
                <Img
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/logo.webp`}
                  width="150"
                  height="50"
                  alt="Bonavista Leisurescapes"
                  style={{ marginBottom: '16px' }}
                />
              </Column>
            </Row>

            {children}

            <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />

            <Text style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
              © {new Date().getFullYear()} Bonavista Leisurescapes. All rights reserved.
            </Text>
            <Text style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
              If you have any questions, please contact our customer service team.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
