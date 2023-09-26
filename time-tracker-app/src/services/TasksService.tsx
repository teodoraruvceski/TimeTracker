import dayjs from 'dayjs';
import { Task } from '../interfaces/Task';
import jsPDF from 'jspdf';
import autoTable  from 'jspdf-autotable';

export class TasksService {
  private readonly baseUrl: string = 'https://localhost:44385';

  async startTask(task: Task): Promise<Task | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task.id),
      });

      if (response.ok) {
        const startedTask = await response.json();
        return startedTask as Task;
      } else {
        // Handle the error here, e.g., throw an exception or return null
        throw new Error(`Failed to start the task. Status: ${response.status}`);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('An error occurred while starting the task:', error);
      return null;
    }
  }

  async generateReport(tasks: Task[]) {
    this.generatePDF(tasks);
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks/generate-report`, {
        method: 'GET',
      });
      
      if (response.ok) {
        alert('Report generated!');
      } else {
        alert('Something went wrong!');
        throw new Error(`Failed to generate report. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred while generating report:', error);
      alert('Something went wrong!');
      return null;
    }
  }

  async addTask(task: Task): Promise<Task | null> {
    try {
        console.log(task);
      const response = await fetch(`${this.baseUrl}/api/tasks/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const startedTask = await response.json();
        return startedTask as Task;
      } else {
        throw new Error(`Failed to add the task. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred while adding the task:', error);
      return null;
    }
  }

  generatePDF = (tasks: Task[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Time Report', 105, 15, { align: 'center' });

  const taskGroups: { [date: string]: Task[] } = {};
  tasks.filter((x: Task) => x.startTime).forEach((task: Task) => {
    const formattedDate = dayjs(task.startTime).format('YYYY-MM-DD');

    if (!taskGroups[formattedDate]) {
        taskGroups[formattedDate] = [];
    }

    taskGroups[formattedDate].push(task);
  });
  console.log(taskGroups);
  const tableColumns = ['Task', 'Project', 'Start Time', 'Duration'];
  
  Object.entries(taskGroups).map(([date, tasksForDate]) => {
    var taskArray : any = [];
    doc.text([dayjs(date).format('ddd, DD/MM'),'','',''], 10, 30);
    tasksForDate.map(t => {
      console.log('task',t);
      taskArray.push([
        t.name, 
        t.projectName, 
        t.startTime !== null ? dayjs(t.startTime).format('hh:mma').toString() + ' - ' + dayjs(t.endTime).format('hh:mma').toString() : ' ', 
        t.duration !== null ? Math.floor(t.duration / 3600).toString().padStart(2, '0')+':'+Math.floor(t.duration % 3600 / 60).toString().padStart(2, '0') : ' ']);
    });
    autoTable(doc, {
      head: [tableColumns],
      body: taskArray,
      startY: 50, 
    });
    doc.addPage();
  });
  
  //ToDo
  var toDoArray : any = [];
  doc.text('To do', 10, 20);
  tasks.filter(t => t.startTime === null).map(t => {
    toDoArray.push([
      t.name, 
      t.projectName, 
      t.startTime !== null ? dayjs(t.startTime).format('hh:mma').toString() + ' - ' + dayjs(t.startTime).format('hh:mma').toString() : ' ', 
      t.duration !== null ? Math.floor(t.duration / 3600).toString().padStart(2, '0')+':'+Math.floor(t.duration % 3600 / 60).toString().padStart(2, '0') : ' ']);
  });

  autoTable(doc, {
    head: [tableColumns],
    body: toDoArray,
    startY: 35, 
  });
  doc.save('TaskReport.pdf'); 

  const pdfDataUri = doc.output('datauristring');

  const link = document.createElement('a');
  link.href = pdfDataUri;
  link.download = 'TaskReport.pdf';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};
}
