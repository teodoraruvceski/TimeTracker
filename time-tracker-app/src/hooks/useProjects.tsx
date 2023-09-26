import { useState, useEffect } from 'react';
import axios from 'axios';
import { Project } from '../interfaces/Project';

function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    axios
      .get('https://localhost:44385/api/projects')
      .then((response) => {
        setProjects(response.data); 
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.log(err);
      });
  }, []);

  const addProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };


  return { projects, loading, error, addProject, setProjects };
}

export default useProjects;