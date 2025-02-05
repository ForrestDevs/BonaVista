import getPayload from '@/lib/utils/getPayload'

type SeedPost = {
  title: string
  slug: string
  category: string
  description: string
  content: string
  relatedPosts: string[]
}

const seedCategories = ['hot-tubs', 'swim-spas', 'hydrotherapy', 'maintenance']

const generateSeedPosts = (): SeedPost[] => {
  const posts: SeedPost[] = []

  seedCategories.forEach((category) => {
    for (let i = 1; i <= 12; i++) {
      let title, description, content
      switch (category) {
        case 'hot-tubs':
          title = `Top ${i} Benefits of Owning a Hot Tub`
          description = `Discover the amazing health and lifestyle benefits of having a hot tub at home.`
          content = `Hot tubs offer numerous benefits, from stress relief to improved sleep. This article explores how regular use can enhance your overall well-being and quality of life.`
          break
        case 'swim-spas':
          title = `Swim Spa Workout: ${i} Exercises for a Full-Body Routine`
          description = `Learn how to maximize your swim spa with these effective exercises for all fitness levels.`
          content = `Swim spas provide a versatile environment for low-impact, high-resistance workouts. This guide outlines a series of exercises targeting different muscle groups, suitable for beginners to advanced users.`
          break
        case 'hydrotherapy':
          title = `Hydrotherapy Technique #${i} for Pain Management`
          description = `Explore this powerful hydrotherapy method for alleviating chronic pain and promoting healing.`
          content = `Hydrotherapy has been used for centuries to treat various ailments. This article delves into a specific technique, explaining its application, benefits, and scientific backing for pain relief and rehabilitation.`
          break
        case 'maintenance':
          title = `${i} Essential Tips for Spa Water Maintenance`
          description = `Keep your spa crystal clear and safe with these crucial maintenance practices.`
          content = `Proper spa maintenance is key to longevity and user safety. This guide provides practical tips on water chemistry, cleaning routines, and troubleshooting common issues to ensure your spa remains in top condition.`
          break
      }
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      posts.push({
        title,
        slug,
        category,
        description,
        content,
        relatedPosts: [],
      })
    }
  })

  // Add related posts
  posts.forEach((post) => {
    post.relatedPosts = posts
      .filter((p) => p.category === post.category && p.slug !== post.slug)
      .slice(0, 3)
      .map((p) => p.slug)
  })

  return posts
}

const categoryMap: { [key: string]: string } = {
  'hot-tubs': '67195faff98ef1ba38192282',
  'swim-spas': '67195fb9f98ef1ba381922a1',
  hydrotherapy: '67195fc8f98ef1ba381922c9',
  maintenance: '67195fdaf98ef1ba381922f3',
}

async function seedMockBlogs() {
  const posts = generateSeedPosts()
  //   try {
  // // Map blog seed data to payload format
  // const mapPostToPayloadFormat = async (post: any) => {
  //   const categoryId = categoryMap[post.category]
  //   return {
  //     title: post.title,
  //     slug: post.slug,
  //     category: categoryId,
  //     meta: {
  //       title: post.title,
  //       description: post.description,
  //     },
  //     content: post.content,
  //     status: 'published',
  //     relatedPosts: post.relatedPosts,
  //   }
  // }

  // // Seed posts into Payload
  // const createdPosts = [];

  // // Create posts
  // for (const post of blogSeedData) {
  //   const payloadPost = await mapPostToPayloadFormat(post);
  //   const createdPost = await payload.create({
  //     collection: 'posts',
  //     data: {
  //       title: payloadPost.title,
  //       slug: payloadPost.slug,
  //       _status: 'published',
  //       categories: [payloadPost.category],
  //       content: {
  //         root: {
  //           type: 'root',
  //           children: [
  //             {
  //               type: 'paragraph',
  //               children: [
  //                 {
  //                   type: 'text',
  //                   detail: 0,
  //                   format: 0,
  //                   mode: 'normal',
  //                   style: '',
  //                   text: payloadPost.content,
  //                   version: 1,
  //                 },
  //               ],
  //               direction: 'ltr',
  //               format: '',
  //               indent: 0,
  //               textFormat: 0,
  //               version: 1,
  //             },
  //           ],
  //           format: '',
  //           indent: 0,
  //           version: 1,
  //           direction: 'ltr',
  //         },
  //       },
  //       meta: {
  //         title: payloadPost.meta.title,
  //         description: payloadPost.meta.description,
  //       },
  //     },
  //   });
  //   createdPosts.push({ id: createdPost.id, slug: createdPost.slug });
  // }

  // // Update posts with related posts
  // for (const post of createdPosts) {
  //   const originalPost = blogSeedData.find(p => p.slug === post.slug);
  //   if (originalPost) {
  //     const relatedPostIds = originalPost.relatedPosts
  //       .map(slug => createdPosts.find(p => p.slug === slug)?.id)
  //       .filter(id => id !== undefined);

  //     await payload.update({
  //       collection: 'posts',
  //       id: post.id,
  //       data: {
  //         relatedPosts: relatedPostIds,
  //       },
  //     });
  //   }
  // }
}

seedMockBlogs()
