import type { Timestamp } from "firebase/firestore";

export interface Todo {
  id: string;
  title: string;
  description: string;
  done: boolean;
  status: string;
  createdAt: Timestamp;
}
