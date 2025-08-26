import {defineType, defineField} from 'sanity'

export const house = defineType({
  name: 'house',
  title: 'House',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name or title of the house',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      description: 'Full address of the house',
      rows: 3
    }),
    defineField({
      name: 'bedrooms',
      title: 'Number of Bedrooms',
      type: 'number',
      description: 'Total number of bedrooms in the house',
      validation: Rule => Rule.min(0).max(20)
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'address',
      bedrooms: 'bedrooms'
    },
    prepare({title, subtitle, bedrooms}) {
      return {
        title: title || 'Untitled House',
        subtitle: `${subtitle || 'No address'} • ${bedrooms || 0} bedrooms`
      }
    }
  }
})
