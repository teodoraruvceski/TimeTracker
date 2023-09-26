import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { Project } from '../../interfaces/Project';
import TaskCreationWindow from '../TaskCreationWindow/TaskCreationWindow';
import { Task } from '../../interfaces/Task';

interface Props {
    tasksService: any;
    addTask: any;
    projects: Project[];
}

const CreateNew: React.FC<Props> = ({ tasksService, addTask, projects }) => {
    const [openTaskWindow, setOpenTaskWindow] = useState(false);

    const handleCreateTask = async (newTask: any) => {
        let task = {
          id: 0,
          name: newTask.name,
          startTime: null,
          endTime: null,
          duration: null,
          projectName: newTask.projectName
        } 
        try {
          const newTask = await tasksService.addTask(task as Task);
          addTask(newTask as Task);          
        } catch (ex) {
          console.error('An error occurred:', ex);
        }
      };

  return (
    
        <Box sx={{justifyContent:"center",display: 'flex', alignItems: 'center',width: '50vw'}}>
          <Button
            onClick={() => setOpenTaskWindow(true)}
            sx={{
              color: '#672e94',
              backgroundColor: 'white', 
              height: '5vh', 
              borderRadius: '10px',
              width: '25%',
              marginRight: '1vw',
              '&:hover': {
                backgroundColor: '#af7fd4',
                borderColor: '#af7fd4' }}} >
            Add Task
          </Button>
          <TaskCreationWindow
            open={openTaskWindow}
            onClose={() => setOpenTaskWindow(false)}
            projects={projects}
            onCreateTask={handleCreateTask}
          />
        </Box>
     
  );
};

export default CreateNew;