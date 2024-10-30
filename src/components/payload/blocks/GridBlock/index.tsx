import React from 'react'
import { Grid, Col } from '@/components/ui/grid'
import { GridBlockProps } from './types'
import { RenderBlocks } from '@components/payload/blocks'
import RichText from '@components/payload/RichText'

export const GridBlock: React.FC<
  GridBlockProps & {
    id?: string
  }
> = async (props) => {
  const { gridStyle, columns, gap, content } = props

  return (
    <Grid cols={1} className="container">
      {content.map((column, index) => (
        <Col key={index} className="">
          {column.richText && <RichText content={column.richText} />}
          {column.blocks && <RenderBlocks blocks={column.blocks} />}
        </Col>
      ))}
    </Grid>
  )
}
