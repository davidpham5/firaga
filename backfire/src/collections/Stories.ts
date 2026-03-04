import type { CollectionConfig } from 'payload'

/**
 * Stories — the editorial workflow object.
 *
 * A Story lives before a Post exists. It is a pitch, an assignment, an idea
 * in progress. When a Story is published, it becomes (or is linked to) a Post.
 *
 * The workflow:
 *   pitched → assigned → inProgress → submitted → inReview → approved → published
 *
 * For a 2-person newsletter:
 *   One person pitches + writes (pitched → inProgress → submitted)
 *   The other edits and approves (inReview → approved → published)
 *
 * For a 25-person newsroom:
 *   Editor manages the desk (pitched → assigned)
 *   Reporter works the story (inProgress → submitted)
 *   Editor reviews (inReview → approved)
 *   Editor publishes (published)
 *
 * The "desk" is the Stories board — the newsroom's nervous system.
 */
export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'headline',
    group: 'Editorial',
    defaultColumns: ['headline', 'status', 'assignee', 'beat', 'deadline'],
  },
  fields: [
    // The pitch
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: { description: 'Working headline. Can change before publication.' },
    },
    {
      name: 'pitch',
      type: 'textarea',
      admin: {
        description:
          'What is this story? Why does it matter? Who are the sources? ' +
          'What is the publication angle?',
      },
    },

    // Beat / section
    {
      name: 'beat',
      type: 'text',
      admin: {
        description:
          'The beat or section this belongs to. e.g. "Education", "Local Politics", "Investigations"',
      },
    },

    // Workflow status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pitched',
      options: [
        { label: 'Pitched', value: 'pitched' },
        { label: 'Assigned', value: 'assigned' },
        { label: 'In progress', value: 'inProgress' },
        { label: 'Submitted for review', value: 'submitted' },
        { label: 'In review', value: 'inReview' },
        { label: 'Approved', value: 'approved' },
        { label: 'Published', value: 'published' },
        { label: 'Killed', value: 'killed' },
      ],
    },

    // Assignment
    {
      name: 'assignee',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Reporter or journalist assigned to this story.' },
    },
    {
      name: 'assignedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Editor who made the assignment.' },
    },
    {
      name: 'deadline',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },

    // Notes between editor and reporter
    {
      name: 'editorialNotes',
      type: 'array',
      admin: { description: 'Back-and-forth notes between editor and reporter. Timestamped.' },
      fields: [
        { name: 'author', type: 'relationship', relationTo: 'users' },
        { name: 'note', type: 'textarea', required: true },
        { name: 'createdAt', type: 'date', admin: { readOnly: true } },
      ],
    },

    // The resulting Post once the story is written
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      admin: { description: 'Linked once the story has a draft Post.' },
    },

    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
  ],
}
