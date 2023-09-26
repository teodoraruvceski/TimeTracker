import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, MenuItem, Select, Button } from '@mui/material';
import { Project } from '../../interfaces/Project';
import { ProjectsService } from '../../services/ProjectsService';
import ProjectCreationWindow from '../ProjectCreationWindow/ProjectCreationWindow';

interface NavbarProps {
  selectedProject: string;
  setSelectedProject: any;
  projects: any;
  addProject: any;
}

const Navbar: React.FC<NavbarProps> = ({ selectedProject, setSelectedProject, projects, addProject }) => {

  const [openWindow, setOpenWindow] = useState(false);
  const projectsService = new ProjectsService();

  const handleSelectChange = (e: any) => {
    const value = e.target.value;
    setSelectedProject(value);
  };

  

  const handleCreateProject = async (newProject: any) => {
    let project = {
      id: 0,
      name: newProject,
    } 
  
    try {
      const result = await projectsService.addProject(project as Project);
      console.log(result);
      addProject(result as Project);
      
    } catch (ex) {
      console.error('An error occurred:', ex);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{backgroundColor: '#af7fd4'}} >
        <Typography sx={{fontWeight: 'bold', width:'25%'}} variant="h5">Time Tracker</Typography>
        <Box sx={{marginLeft: '50vw', display: 'flex', alignItems: 'center',width: '60vw' }}>
          <Button onClick={()=>setOpenWindow(true)}
            sx={{
              color: '#672e94',
              backgroundColor: 'white', 
              height: '5vh', 
              borderRadius: '10px',
              width: '40%',
              marginRight: '1vw',
              '&:hover': {
                backgroundColor: '#e9daf5',
                borderColor: '#af7fd4' }}} >
            Add Project
          </Button>
          <Select 
            onChange={handleSelectChange}
            value={selectedProject}
            sx={{
            backgroundColor: 'white', 
            height: '5vh', 
            borderRadius: '10px',
            width: '40%' }}>
            <MenuItem value="NoProject">NoProject</MenuItem>
            {projects.map((project: Project) => (
              <MenuItem key={project.id} value={project.name}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Toolbar>
     <ProjectCreationWindow open={openWindow} onClose={() => setOpenWindow(false)} onCreateProject={handleCreateProject}/>
    </AppBar>
  );
};

export default Navbar;