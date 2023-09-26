import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, TextField, Typography } from '@mui/material';

interface CreationModalProps {
    open: boolean; 
    onClose: any; 
    onCreateProject: any;
  };

const ProjectCreationWindow : React.FC<CreationModalProps> = ({ open, onClose, onCreateProject }) => {
    const [projectName, setProjectName] = useState('');
  
    const handleCreateProject = () => {
      onCreateProject(projectName);
      setProjectName('');
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
          }}>
          <Typography variant="h5" sx={{ marginBottom: '16px', color:'#672e94' }}>
            Add Project
          </Typography>
          <TextField
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            sx={{marginBottom: '16px',}}/>
          <Button sx={{
            backgroundColor:'#af7fd4',
            '&:hover': {
              backgroundColor: '#e9daf5',
              borderColor: '#af7fd4' }}} 
              variant="contained" color="primary" onClick={handleCreateProject}>
            Create Project
          </Button>
        </Box>
      </Modal>
    );
  };
  
  export default ProjectCreationWindow ;