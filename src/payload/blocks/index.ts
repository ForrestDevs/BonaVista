import { Archive } from './ArchiveBlock'
import { Banner } from './Banner'
import { CallToAction } from './CallToAction'
import { Code } from './Code'
import { Content } from './Content'
import { Form } from './Form'
import { Media } from './Media'
import { ShopArchive } from './ShopArchive'
import { ServicesBlock } from './ServicesBlock'
import { Testimonials } from './Testimonials'
import { Contact } from './Contact'
import { Typography } from './Typography'
import { LatestPosts } from './LatestPosts'

import {
  ArchiveBlock as ArchiveBlockType,
  BannerBlock as BannerBlockType,
  CallToActionBlock as CallToActionBlockType,
  CodeBlock as CodeBlockType,
  ContentBlock as ContentBlockType,
  FormBlock as FormBlockType,
  MediaBlock as MediaBlockType,
  ShopArchiveBlock as ShopArchiveBlockType,
  ServicesBlock as ServicesBlockType,
  TestimonialsBlock as TestimonialsBlockType,
} from '@payload-types'

export type BlockTypes = {
  archive: ArchiveBlockType
  banner: BannerBlockType
  cta: CallToActionBlockType
  code: CodeBlockType
  content: ContentBlockType
  formBlock: FormBlockType
  mediaBlock: MediaBlockType
  'shop-archive': ShopArchiveBlockType
  services: ServicesBlockType
  testimonials: TestimonialsBlockType
  
}

export const pageBlocks = [
  Archive,
  Banner,
  CallToAction,
  Code,
  Content,
  Form,
  Media,
  ShopArchive,
  ServicesBlock,
  Testimonials,
  Contact,
  Typography,
  LatestPosts,
]

export const postBlocks = [
  Archive,
  Banner,
  CallToAction,
  Code,
  Content,
  Form,
  Media,
  ShopArchive,
  ServicesBlock,
  Testimonials,
]

export const inlineBlocks = [
  Archive,
  Banner,
  CallToAction,
  Code,
  Form,
  Media,
  ShopArchive,
  ServicesBlock,
  Testimonials,
]

export const contentBlocks = [
  // Form,
  Media,
]
