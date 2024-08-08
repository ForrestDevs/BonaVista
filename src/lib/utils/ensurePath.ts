const ensurePath = (slug: string) => `/${slug}/`.replace(/\/+/g, '/')

export default ensurePath
