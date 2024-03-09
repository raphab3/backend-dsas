export interface IDependent {
  id: string;
  name: string;
  degree_of_kinship: DegreeOfKinshipType;
  birth_date?: string;
  cpf?: string;
  gender?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export type IDependentCreate = Omit<
  IDependent,
  'id' | 'created_at' | 'updated_at'
>;

export const DegreeOfKinshipEnuns = [
  'father',
  'mother',
  'son',
  'daughter',
  'grandparent',
  'grandchild',
] as const;
export type DegreeOfKinshipType = (typeof DegreeOfKinshipEnuns)[number];

export const GenderEnuns = ['male', 'female'] as const;
export type GenderType = (typeof GenderEnuns)[number];
