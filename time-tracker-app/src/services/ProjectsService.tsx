import { Project } from '../interfaces/Project';


export class ProjectsService {
  private readonly baseUrl: string = 'https://localhost:44385';
  

  async addProject(task: Project): Promise<Project | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/projects/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const result = await response.json();
        return result as Project;
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
}
