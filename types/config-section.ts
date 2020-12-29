// TS types for elements on the Config pages

export interface TextFieldProps {
  onUpdate: ({ fieldName, value }: UpdateArgs) => void;
  fieldName: string;
  initialValue: string;
  type: string;
}

export interface UpdateArgs {
  fieldName: string;
  value: string;
  path?: string;
}