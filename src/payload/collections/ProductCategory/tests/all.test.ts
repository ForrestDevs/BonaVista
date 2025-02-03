import { describe, expect, test, beforeEach, afterEach } from 'bun:test'
import { PRODUCT_CATEGORY_SLUG } from '@payload/collections/constants'
import getPayload from '@/lib/utils/getPayload'

describe('ProductCategory Tests', async () => {
  const payload = await getPayload()

  afterEach(async () => {
    // Delete all test categories in a loop until none remain
    let hasMore = true
    while (hasMore) {
      const result = await payload.delete({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          title: { contains: 'Test' },
        },
      })
      hasMore = result.docs?.length > 0
    }
  })

  describe('Create Operations', () => {
    test('should create a root category with minimal fields', async () => {
      const category = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Root',
        },
      })

      expect(category.title).toBe('Test Root')
      expect(category.slug).toBe('test-root')
      expect(category.fullSlug).toBe('test-root')
      expect(category.isLeaf).toBe(true)
      expect(category.parent).toBeUndefined()
      expect(category.description).toBeUndefined()
    })

    test('should create a category with all fields', async () => {
      const category = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Full',
          description: 'Test Description',
          slug: 'custom-slug',
        },
      })

      expect(category.title).toBe('Test Full')
      expect(category.slug).toBe('custom-slug')
      expect(category.description).toBe('Test Description')
    })

    test('should handle special characters in title', async () => {
      const category = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test & Special @ Characters!',
        },
      })

      expect(category.title).toBe('Test & Special @ Characters!')
      expect(category.slug).toBe('test--special--characters')
    })

    test('should reject creation without title', async () => {
      // Fix: proper async rejection testing
      const promise = payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        //@ts-ignore
        data: {
          description: 'No Title',
        },
      })

      expect(promise).rejects.toThrow('The following field is invalid: Title')
    })
  })

  describe('Read Operations', () => {
    test('should find category by ID', async () => {
      const created = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Find' },
      })

      const found = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: created.id,
      })

      expect(found.id).toBe(created.id)
      expect(found.title).toBe('Test Find')
    })

    test('should find categories by query', async () => {
      await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: { title: 'Test Query 1' },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: { title: 'Test Query 2' },
        }),
      ])

      const results = await payload.find({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          title: { contains: 'Query' },
        },
      })

      expect(results.docs.length).toBe(2)
      expect(results.totalDocs).toBe(2)
    })

    test('should handle non-existent ID', async () => {
      const promise = payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: 'non-existent-id',
      })

      expect(promise).rejects.toThrow()
    })
  })

  describe('Update Operations', () => {
    test('should update basic fields', async () => {
      const category = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Update',
          description: 'Original',
        },
      })

      const updated = await payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: category.id,
        data: {
          title: 'Test Updated',
          description: 'Updated',
        },
      })

      expect(updated.title).toBe('Test Updated')
      expect(updated.description).toBe('Updated')
      expect(updated.slug).toBe('test-updated')
    })

    test('should handle partial updates', async () => {
      const category = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Partial',
          description: 'Original',
        },
      })

      const updated = await payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: category.id,
        data: {
          description: 'Updated',
        },
      })

      expect(updated.title).toBe('Test Partial') // Unchanged
      expect(updated.description).toBe('Updated')
      expect(updated.slug).toBe('test-partial') // Unchanged
    })
  })

  describe('Delete Operations', () => {
    test('should delete a single category', async () => {
      const category = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Delete' },
      })

      await payload.delete({
        collection: PRODUCT_CATEGORY_SLUG,
        id: category.id,
      })

      const promise = payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: category.id,
      })

      expect(promise).rejects.toThrow(/not found/i)
    })

    test('should handle bulk delete of siblings', async () => {
      // Create parent
      const parent = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Parent' },
      })

      // Create multiple children
      await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 1',
            parent: parent.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 2',
            parent: parent.id,
          },
        }),
      ])

      //check parent is not a leaf
      const updatedParent1 = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: parent.id,
      })
      expect(updatedParent1.isLeaf).toBe(false)

      // Delete all children
      await payload.delete({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          parent: { equals: parent.id },
        },
      })

      // Check that children are gone
      const remainingChildren = await payload.find({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          parent: { equals: parent.id },
        },
      })
      expect(remainingChildren.totalDocs).toBe(0)

      // Check that parent is now a leaf
      const updatedParent = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: parent.id,
      })
      expect(updatedParent.isLeaf).toBe(true)
    })

    test('should prevent deletion of parent with children', async () => {
      // Create parent
      const parent = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Parent' },
      })

      // Create child
      await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Child',
          parent: parent.id,
        },
      })

      // Attempt to delete parent
      expect(
        payload.delete({
          collection: PRODUCT_CATEGORY_SLUG,
          id: parent.id,
        }),
      ).rejects.toThrow(/cannot delete category with children/i)
    })

    test('should handle hierarchical bulk deletion', async () => {
      // Create grandparent
      const grandparent = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Grandparent' },
      })

      // Create multiple parents
      const [parent1, parent2] = await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Parent 1',
            parent: grandparent.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Parent 2',
            parent: grandparent.id,
          },
        }),
      ])

      // Create children for each parent
      await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 1',
            parent: parent1.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 2',
            parent: parent2.id,
          },
        }),
      ])

      // Attempt to delete all parents (should fail)
      const res = await payload.delete({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          parent: { equals: grandparent.id },
        },
      })
      expect(res.errors).toBeDefined()
      expect(res.errors).toHaveLength(2)

      // Delete all children first
      await payload.delete({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          or: [{ parent: { equals: parent1.id } }, { parent: { equals: parent2.id } }],
        },
      })

      // Now delete parents
      await payload.delete({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          parent: { equals: grandparent.id },
        },
      })

      // Verify hierarchy state
      const updatedGrandparent = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: grandparent.id,
      })
      expect(updatedGrandparent.isLeaf).toBe(true)
    })

    test('should handle delete of non-existent category', async () => {
      const promise = payload.delete({
        collection: PRODUCT_CATEGORY_SLUG,
        id: 'non-existent-id',
      })

      expect(promise).rejects.toThrow(/not found/i)
    })
  })

  describe('Complex Hierarchy Mutations', () => {
    test('should create child category and update parent isLeaf', async () => {
      const parent = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Parent' },
      })
      expect(parent.isLeaf).toBe(true)

      const child = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Child',
          parent: parent.id,
        },
      })

      expect(child.fullSlug).toBe(`${parent.slug}/${child.slug}`)
      expect(child.isLeaf).toBe(true)

      const updatedParent = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: parent.id,
      })
      expect(updatedParent.isLeaf).toBe(false)
    })

    test('should handle deep hierarchy paths', async () => {
      const grandparent = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Grandparent' },
      })

      const parent = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Parent',
          parent: grandparent.id,
        },
      })

      const child = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Child',
          parent: parent.id,
        },
      })

      const [updatedGrandparent, updatedParent, updatedChild] = await Promise.all([
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: grandparent.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: parent.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: child.id }),
      ])

      expect(updatedChild.fullSlug).toBe(`${grandparent.slug}/${parent.slug}/${child.slug}`)
      expect(updatedGrandparent.isLeaf).toBe(false)
      expect(updatedParent.isLeaf).toBe(false)
      expect(updatedChild.isLeaf).toBe(true)
    })

    test('should handle moving entire subtree to new parent', async () => {
      // Create initial hierarchy
      const oldRoot = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Old Root' },
      })

      const parent = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Parent',
          parent: oldRoot.id,
        },
      })

      const [child1, child2] = await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 1',
            parent: parent.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 2',
            parent: parent.id,
          },
        }),
      ])

      // Create new root
      const newRoot = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test New Root' },
      })

      expect(newRoot.isLeaf).toBe(true)

      // Move parent to new root
      const updatedParent = await payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: parent.id,
        data: { parent: newRoot.id },
      })

      // Fetch all updated documents
      const [updatedOldRoot, updatedNewRoot, updatedChild1, updatedChild2] = await Promise.all([
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: oldRoot.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: newRoot.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: child1.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: child2.id }),
      ])

      // Verify fullSlug updates
      expect(updatedParent.fullSlug).toBe(`${newRoot.slug}/${parent.slug}`)
      expect(updatedChild1.fullSlug).toBe(`${newRoot.slug}/${parent.slug}/${child1.slug}`)
      expect(updatedChild2.fullSlug).toBe(`${newRoot.slug}/${parent.slug}/${child2.slug}`)

      // Verify isLeaf states
      expect(updatedOldRoot.isLeaf).toBe(true)
      expect(updatedNewRoot.isLeaf).toBe(false)
      expect(updatedParent.isLeaf).toBe(false)
      expect(updatedChild1.isLeaf).toBe(true)
      expect(updatedChild2.isLeaf).toBe(true)
    })

    test('should handle complex reparenting operations', async () => {
      // Create initial hierarchy
      //        root
      //      /      \
      //   parent1  parent2
      //    /  \      /  \
      // child1 child2 child3 child4
      const root = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Root' },
      })

      const [parent1, parent2] = await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Parent 1',
            parent: root.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Parent 2',
            parent: root.id,
          },
        }),
      ])

      const [child1, child2, child3, child4] = await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 1',
            parent: parent1.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 2',
            parent: parent1.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 3',
            parent: parent2.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Child 4',
            parent: parent2.id,
          },
        }),
      ])

      // Perform complex reparenting:
      // 1. Move child1 to parent2
      // 2. Move child3 to parent1
      // 3. Make child2 a root category
      await Promise.all([
        payload.update({
          collection: PRODUCT_CATEGORY_SLUG,
          id: child1.id,
          data: { parent: parent2.id },
        }),
        payload.update({
          collection: PRODUCT_CATEGORY_SLUG,
          id: child3.id,
          data: { parent: parent1.id },
        }),
        payload.update({
          collection: PRODUCT_CATEGORY_SLUG,
          id: child2.id,
          data: { parent: null },
        }),
      ])

      // Fetch all updated documents
      const [
        updatedRoot,
        updatedParent1,
        updatedParent2,
        updatedChild1,
        updatedChild2,
        updatedChild3,
        updatedChild4,
      ] = await Promise.all([
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: root.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: parent1.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: parent2.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: child1.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: child2.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: child3.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: child4.id }),
      ])

      // Verify fullSlugs
      expect(updatedChild1.fullSlug).toBe(`${root.slug}/${parent2.slug}/${child1.slug}`)
      expect(updatedChild2.fullSlug).toBe(child2.slug)
      expect(updatedChild3.fullSlug).toBe(`${root.slug}/${parent1.slug}/${child3.slug}`)
      expect(updatedChild4.fullSlug).toBe(`${root.slug}/${parent2.slug}/${child4.slug}`)

      // Verify isLeaf states
      expect(updatedRoot.isLeaf).toBe(false)
      expect(updatedParent1.isLeaf).toBe(false)
      expect(updatedParent2.isLeaf).toBe(false)
      expect(updatedChild1.isLeaf).toBe(true)
      expect(updatedChild2.isLeaf).toBe(true)
      expect(updatedChild3.isLeaf).toBe(true)
      expect(updatedChild4.isLeaf).toBe(true)
    })

    test('should handle concurrent hierarchy updates', async () => {
      // Create initial structure
      const root = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Root' },
      })

      const [branch1, branch2] = await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Branch 1',
            parent: root.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Branch 2',
            parent: root.id,
          },
        }),
      ])

      // Perform concurrent updates
      const updates = await Promise.all([
        // Move branch1 to null (make root)
        payload.update({
          collection: PRODUCT_CATEGORY_SLUG,
          id: branch1.id,
          data: { parent: null },
        }),
        // Move branch2 to branch1
        payload.update({
          collection: PRODUCT_CATEGORY_SLUG,
          id: branch2.id,
          data: { parent: branch1.id },
        }),
      ])

      // Fetch final states
      const [updatedRoot, updatedBranch1, updatedBranch2] = await Promise.all([
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: root.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: branch1.id }),
        payload.findByID({ collection: PRODUCT_CATEGORY_SLUG, id: branch2.id }),
      ])

      // Verify final states
      expect(updatedRoot.isLeaf).toBe(true)
      expect(updatedBranch1.isLeaf).toBe(false)
      expect(updatedBranch2.isLeaf).toBe(true)

      expect(updatedBranch1.fullSlug).toBe(branch1.slug)
      expect(updatedBranch2.fullSlug).toBe(`${branch1.slug}/${branch2.slug}`)
    })

    test('should maintain hierarchy integrity during bulk operations', async () => {
      // Create a complex hierarchy
      const root = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Root' },
      })

      const [branch1, branch2] = await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Branch 1',
            parent: root.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Branch 2',
            parent: root.id,
          },
        }),
      ])

      // Create leaves
      await Promise.all([
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Leaf 1',
            parent: branch1.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Leaf 2',
            parent: branch1.id,
          },
        }),
        payload.create({
          collection: PRODUCT_CATEGORY_SLUG,
          data: {
            title: 'Test Leaf 3',
            parent: branch2.id,
          },
        }),
      ])

      // Delete all leaves from branch1
      await payload.delete({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          parent: { equals: branch1.id },
        },
      })

      // Verify branch1 is now a leaf
      const updatedBranch1 = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: branch1.id,
      })
      expect(updatedBranch1.isLeaf).toBe(true)

      // Verify branch2 is still not a leaf
      const updatedBranch2 = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: branch2.id,
      })
      expect(updatedBranch2.isLeaf).toBe(false)

      // Verify root is still not a leaf
      const updatedRoot = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: root.id,
      })
      expect(updatedRoot.isLeaf).toBe(false)
    })
  })

  describe('Basic Field Validation', () => {
    test('should enforce unique titles', async () => {
      await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Duplicate' },
      })

      const promise = payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Duplicate' },
      })

      // Match the actual error message from Payload
      expect(promise).rejects.toThrow('The following field is invalid: title')
    })

    test('should sanitize and validate slug format', async () => {
      const category = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Slug',
          slug: 'Invalid Slug!@#$%',
        },
      })

      // Verify the slug is properly sanitized
      expect(category.slug).toMatch(/^[a-z0-9-]+$/)
    })
  })

  describe('Hierarchy Validation', () => {
    test('should prevent circular references', async () => {
      const parent = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Parent' },
      })

      const child = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Child',
          parent: parent.id,
        },
      })

      const promise = payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: parent.id,
        data: { parent: child.id },
      })

      // Match the actual error message from your validation
      expect(promise).rejects.toThrow('The following field is invalid: Parent')
    })

    test('should prevent self as parent', async () => {
      const category = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Self Parent' },
      })

      const promise = payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: category.id,
        data: { parent: category.id },
      })

      // Match the actual error message from your validation
      expect(promise).rejects.toThrow('The following field is invalid: Parent')
    })
  })

  describe('fullSlug Validation', () => {
    test('should maintain correct fullSlug on parent change', async () => {
      const parent1 = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Parent 1' },
      })

      const parent2 = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Parent 2' },
      })

      const child = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Child',
          parent: parent1.id,
        },
      })

      // Verify initial fullSlug
      expect(child.fullSlug).toBe(`${parent1.slug}/${child.slug}`)

      // Change parent
      const updatedChild = await payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: child.id,
        data: { parent: parent2.id },
      })

      // Verify updated fullSlug
      expect(updatedChild.fullSlug).toBe(`${parent2.slug}/${child.slug}`)
    })

    test('should handle root-to-child conversion', async () => {
      // Create two root categories
      const root1 = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Root 1' },
      })

      const root2 = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Root 2' },
      })

      // Make root2 a child of root1
      const updated = await payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: root2.id,
        data: { parent: root1.id },
      })

      // Fetch the updated root1 to check its isLeaf status
      const updatedRoot1 = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: root1.id,
      })

      expect(updated.fullSlug).toBe(`${root1.slug}/${root2.slug}`)
      expect(updatedRoot1.isLeaf).toBe(false)
    })

    test('should handle child-to-root conversion', async () => {
      const parent = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: { title: 'Test Parent' },
      })

      const child = await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title: 'Test Child',
          parent: parent.id,
        },
      })

      // Convert child to root
      const updated = await payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: child.id,
        data: { parent: null },
      })

      // Fetch updated parent to check isLeaf status
      const updatedParent = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: parent.id,
      })

      expect(updated.fullSlug).toBe(updated.slug)
      expect(updatedParent.isLeaf).toBe(true)
    })
  })
})
