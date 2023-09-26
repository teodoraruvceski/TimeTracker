import { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from '../interfaces/Task';

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define the URL of your backend API
    //const apiUrl = 'https://localhost:44385/api/tasks'//process.env.SERVER_URL as string;

    // Make a GET request to fetch tasks
    axios
      .get('https://localhost:44385/api/tasks')
      .then((response) => {
        setTasks(response.data); // Update the tasks state with the fetched data
        setLoading(false); // Set loading to false
      })
      .catch((err) => {
        setError(err); // Set the error state if the request fails
        setLoading(false); // Set loading to false
        console.log(err);
      });
  }, []);

  const addTask = (newTask: Task) => {
    //setTasks((prevTasks) => [...prevTasks, newTask]);
    const updatedTasks = [...tasks, { ...newTask }];

  setTasks(updatedTasks);
  };


  return { tasks, loading, error, addTask, setTasks };
}

export default useTasks;