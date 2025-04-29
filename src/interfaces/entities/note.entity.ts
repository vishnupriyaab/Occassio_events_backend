export interface INote {
  content: string;
  employeeId?: string;
  conversationId?: string;
  userId?:string;
  createdAt?: Date;
  updatedAt?: Date;
}
