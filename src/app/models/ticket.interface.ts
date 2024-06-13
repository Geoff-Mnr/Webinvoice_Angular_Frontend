import { User } from "./user.interface";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  users: User[];
  showMenu?: boolean;
}
