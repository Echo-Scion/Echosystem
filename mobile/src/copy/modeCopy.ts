export const modeCopy = {
  titles: {
    journaling: { normal: 'Luminote', lore: 'Etchings of the Heart' },
    quotes: { normal: 'Vershine', lore: 'Light Fragments' },
    tasks: { normal: 'Nextra', lore: 'Paths of Intention' },
    habits: { normal: 'Resonary', lore: 'Rhythms of Becoming' },
    faith: { normal: 'Ekklesion', lore: 'Chorus of Faith' },
    read: { normal: 'Stellaread', lore: 'Scrolls of Creation' },
  },
  cta: {
    reflect: { normal: 'Reflect with Flow', lore: 'Listen to the Hum' },
    addTask: { normal: 'Add Task', lore: 'Mark a Step' },
    addHabit: { normal: 'Add Habit', lore: 'Breathe a Pattern' },
    share: { normal: 'Share', lore: 'Let it Echo' },
  },
} as const;

export type ModeCopy = typeof modeCopy;
