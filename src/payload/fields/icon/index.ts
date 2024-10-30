import { Field } from 'payload'

export const iconField: Field = {
  name: 'icon',
  type: 'text',
  admin: {
    components: {
      Field: {
        path: 'src/payload/fields/icon/ui/#CustomIconSelect',
      }
    },
  },
}
