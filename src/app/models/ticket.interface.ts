import { User } from "./user.interface";

export interface Ticket {
  showComponent: boolean;
  id: number;
  title: string;
  description: string;
  comment: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  createdBy: User;
  users: User[];
  showMenu?: boolean;
  is_active: string;
}
