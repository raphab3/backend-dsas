export enum FormCategory {
  MEDICAL_CERTIFICATE = 'medical_certificate',
  PRESCRIPTION = 'prescription',
  ANAMNESIS = 'anamnesis',
  EVOLUTION = 'evolution',
  MEDICATION = 'medication',
  EXAM = 'exam',
  TEST = 'test',
  OTHER = 'other',
}

export enum ConditionType {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
}

export interface Condition {
  type: ConditionType;
  value: string | number;
}

export interface Metadata {
  key: string;
  value: string | number;
}

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  TEXTAREA = 'textarea',
  RICH_TEXT_DISPLAY = 'rich_text_display',
  RICH_TEXT_INPUT = 'rich_text_input',
}

export interface Condition {
  type: ConditionType;
  value: string | number;
}

export interface Metadata {
  key: string;
  value: string | number;
}

export enum RuleType {
  CALCULATION = 'calculation',
  CONDITION = 'condition',
}

export interface Rule {
  id: string;
  name: string;
  type: RuleType;
  calculation?: {
    operation: OperationType;
    sourceFields: string[];
  };
  condition?: {
    sourceRuleId: string;
    operator: ConditionType;
    value: number | string;
  };
  result?: string;
}

export enum OperationType {
  SUM = 'sum',
  SUBTRACT = 'subtract',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
  COUNT = 'count',
  AVERAGE = 'average',
}

export interface FieldOption {
  label: string;
  value: string | number;
  weight?: number;
}

export interface FormField {
  name: string;
  description?: string;
  type: FieldType;
  label: string;
  validations: {
    required: boolean;
    min?: number;
    max?: number;
  };
  weight?: number;
  options?: FieldOption[];
  order: number;
  content?: string;
  metadata: Metadata[];
}

export interface RuleCondition {
  field?: string;
  operator: OperationType;
  value: string | number;
}

export interface FormSession {
  name: string;
  description?: string;
  fields: FormField[];
  order?: number;
}

export interface FormTemplate {
  id?: string;
  name: string;
  description?: string;
  category: FormCategory;
  rules?: Rule[];
  sessions?: FormSession[];
  tags?: string[];
  createdBy?: string;
  isPublished?: boolean;
  mongoTemplateId?: string;
  created_at: string;
  metadata: Metadata[];
}

export interface FormTemplateCreate {
  name: string;
  description: string;
  category: FormCategory;
  sessions?: FormSession[];
  rules?: Rule[];
  tags?: string[];
  isPublished?: boolean;
  createdBy?: string;
}

export interface FormTemplateUpdate extends FormTemplateCreate {
  id: string;
}
