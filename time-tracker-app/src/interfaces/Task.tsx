export interface Task {
    id: number;
    name: string;
    startTime: Date | null;
    endTime: Date | null;
    duration: number | null;
    projectName: string;
}