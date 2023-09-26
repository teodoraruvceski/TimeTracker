import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Tasks from './components/Tasks/Tasks';
import Navbar from './components/Navbar/Navbar';
import { Box } from '@mui/material';
import useProjects from './hooks/useProjects';

function App() {
  const [selectedProject, setSelectedProject] = useState('NoProject');
  const { projects, loading, error, addProject } = useProjects();

  return (
    <Box sx={{background: '#e9daf5', height:'100%'}}>
      <Navbar addProject={addProject} selectedProject={selectedProject} setSelectedProject={setSelectedProject} projects={projects}/>
      <Tasks projects={projects} selectedProject={selectedProject} />
    </Box>
  );
}

export default App;
