export type SubTaskType = { id: number; text: string; done: boolean };
export type TaskType = {
  id: number;
  text: string;
  done: boolean;
  completedAt?: string;
  subtasks?: SubTaskType[];
};
export type NoteType = { text: string; color: string; x: number; y: number };