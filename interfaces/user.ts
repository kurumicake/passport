export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    githubId?: string;
    role: 'normalUser' | 'admin'; 
  }