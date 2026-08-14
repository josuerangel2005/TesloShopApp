export interface ForHashPassword {
  encrypt: (password: string) => Promise<string>;
  compare: (requestPassword: string, password: string) => Promise<boolean>;
}
