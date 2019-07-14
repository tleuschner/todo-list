import { Task } from './task.model';

export class List {
    task: Task[];
    created: Date;
    remainingTasks: number;
    doneTasks: number;
    priority: number;
    title: string;
    id: string;
}
