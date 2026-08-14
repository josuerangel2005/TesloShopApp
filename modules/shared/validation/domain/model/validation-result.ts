export interface ValidationResult {
  success: boolean;
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
  };
}
