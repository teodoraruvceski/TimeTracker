import { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from '../interfaces/Task';

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
 
    axios
      .get('https://localhost:44385/api/tasks')
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err); 
        setLoading(false); 
      });
  }, []);

  const addTask = (newTask: Task) => {
    const updatedTasks = [...tasks, { ...newTask }];
    setTasks(updatedTasks);
  };
  
  return { tasks, loading, error, addTask, setTasks };
}

export default useTasks;