import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, TextField, Typography, Select, MenuItem } from '@mui/material';
import { Project } from '../../interfaces/Project';

interface CreationModalProps {
    open: boolean; 
    onClose: any; 
    projects: Project[]; 
    onCreateTask: any;
  };

const TaskCreationWindow : React.FC<CreationModalProps> = ({ open, onClose, projects, onCreateTask }) => {
    const [taskName, setTaskName] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
  
    const handleCreateTask = () => {
        console.log('handle')
      // Create a new task object and pass it to the parent component
      const newTask = {
        name: taskName,
        projectName: selectedProject,
      };
      onCreateTask(newTask);
  
      // Reset the input fields
      setTaskName('');
      setSelectedProject('');
  
      // Close the window
      onClose();
    };
  
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '10px',
            width: '400px',
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: '16px', color:'#672e94' }}>
            Add Task
          </Typography>
          <TextField
            label="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            sx={{marginBottom: '16px',}}
          />
          <Select
            value={selectedProject !== '' ? selectedProject : 'No project selected'}
            onChange={(e) => setSelectedProject(e.target.value)}
            //label="Select Project"
            sx={{ marginBottom: '16px',
            '&:focus': {
                backgroundColor: 'red',}}}>
            {selectedProject === '' &&  <MenuItem value="No project selected">No project selected</MenuItem>}
            {projects.map((project : Project) => (
              <MenuItem key={project.id} value={project.name}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
          <Button sx={{backgroundColor:'#af7fd4',
          '&:hover': {
            backgroundColor: '#e9daf5',
            borderColor: '#af7fd4' }}} 
            variant="contained" color="primary" onClick={handleCreateTask}>
            Create Task
          </Button>
        </Box>
      </Modal>
    );
  };
  
  export default TaskCreationWindow ;