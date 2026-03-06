export const PROFICIENCY_LEVELS = [
  { value: 'NATIVE', label: 'Native' },
  { value: 'FLUENT', label: 'Fluent' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'BEGINNER', label: 'Beginner' },
] as const;

export type ProficiencyLevel = (typeof PROFICIENCY_LEVELS)[number]['value'];