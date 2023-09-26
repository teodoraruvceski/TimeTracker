import React, { useEffect, useState } from 'react';
import { Task } from '../../interfaces/Task'
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import useTasks from '../../hooks/useTasks';
import { TasksService } from '../../services/TasksService';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { Box, FormControlLabel, Radio, RadioGroup, Table, TableBody, TableCell, TableRow } from '@mui/material';
import TaskDisplay from '../Task/Task';
import CreateNew from '../CreateNew/CreateNew';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

interface TasksProps {
  selectedProject: string;
  projects: any;
}

const Tasks: React.FC<TasksProps> = ({selectedProject, projects }) => {
  const { tasks, loading, error, addTask, setTasks } = useTasks();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const tasksService = new TasksService();
  const startTimeFromLocalStorage = localStorage.getItem('startTime');
  const [timer, setTimer] = useState(Number(localStorage.getItem('elapsedTime')) || 0);
  const [isRunning, setIsRunning] = useState(localStorage.getItem('isRunning') === 'true' || false);
  const [startTime, setStartTime] = useState(startTimeFromLocalStorage ? Number(startTimeFromLocalStorage) : null);
  const [selectedTask, setSelectedTask] = useState(-1);

  const radioChange = (event: any) => {
    setSelectedTask(Number(event.target.value));
  };
  useEffect(() => {
      let interval: NodeJS.Timeout | null = null;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
        localStorage.setItem('elapsedTime',timer.toString());
      }, 1000);
      
    } else {
      clearInterval(interval || undefined);
    }

    return () => {
      clearInterval(interval || undefined);
      //localStorage.setItem('elapsedTime',timer.toString());
    }
  }, [isRunning, startTime, timer]);

  const roundButtonStyle = {
    borderRadius: '50%', // Make the button round
    padding: '2px', // Adjust padding as needed
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }
  const taskGroups: { [date: string]: Task[] } = {};

  tasks.filter((x: Task) => x.startTime).forEach((task: Task) => {
    const formattedDate = dayjs(task.startTime).format('YYYY-MM-DD');
    if (!taskGroups[formattedDate]) {
        taskGroups[formattedDate] = [];
    }
    taskGroups[formattedDate].push(task);
  });

  const handleStartTask = async (id?: number) => {
    try {
      const now = Date.now();
      setStartTime(now);
      setIsRunning(true);
      localStorage.setItem('elapsedTime', timer.toString());
      localStorage.setItem('isRunning', 'true');
      localStorage.setItem('startTime', now.toString());
    } catch (ex) {
      setErrorMessage('An error occurred while starting the task.');
      console.error('An error occurred:', ex);
    }
  };

  const handleStopTask = async () => {
    let task : any = null;
    console.log(new Date(startTime || 0));
    if(selectedTask !== -1)
    {
      const taskFound = tasks.find(x => x.id === selectedTask); 
      task = {
        id: selectedTask,
        name: taskFound?.name,
        startTime: new Date(startTime || 0),
        endTime: new Date(Date.now()),
        duration: timer,
        projectName: taskFound?.projectName
      }
    }
    else
    {
      task = {
        id: 0,
        name: 'undefined',
        startTime: new Date(startTime || 0),
        endTime: new Date(Date.now()),
        duration: timer,
        projectName: selectedProject
      } 
    }
    try {
      const newTask = await tasksService.addTask(task as Task);
      if(selectedTask !== -1)
      {
        setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === selectedTask ? { ...t, startTime: task.startTime, endTime: task.endTime, duration: task.duration } : t
        ));
      }
      else
      {
        task.id = newTask?.id;
        task.name = newTask?.name;
        if(newTask)
          addTask(task);
      }
      
      setIsRunning(false);
      setTimer(0);
      setStartTime(null);
      localStorage.setItem('elapsedTime', '0');

      localStorage.removeItem('elapsedTime');
      localStorage.removeItem('isRunning');
      localStorage.removeItem('startTime');
      console.log(localStorage.getItem('elapsedTime'));
    } catch (ex) {
      setErrorMessage('An error occurred while starting the task.');
      console.error('An error occurred:', ex);
    }
  };

  const generateReport = async () => {
    try{
      const result = await tasksService.generateReport(tasks);
    } catch (ex) {
      console.error('An error occurred:', ex);
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column">
      <Button onClick={generateReport}
          sx={{
            marginTop: '4vh',
            marginLeft: '75%',
            color: '#672e94',
            backgroundColor: 'white',
            height: '6vh', 
            borderRadius: '10px',
            width: '5wv',
            marginRight: '1vw',
            '&:hover': {
              backgroundColor: '#af7fd4',
              borderColor: '#af7fd4' }}} >
              <FontAwesomeIcon size='2x' icon={faFilePdf} />
      </Button>
      <Box sx={{
        marginTop: '-5vh',
        marginBottom: '5vh',
        borderRadius: '10px', 
        background: 'white', 
        padding: '3%', 
        width: '30%', 
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",}}>
        <IconButton
          color="primary"
          aria-label="Play"
          onClick={() => handleStartTask()}
          sx={{
            ...roundButtonStyle,
            backgroundColor: '#c4c4c4',
            border: '1px solid transparent',
            '&:hover': {
              backgroundColor: 'transparent', 
              border: '1px solid #af7fd4'},
            marginRight: '20%'
          }} >
          <PlayArrowIcon style={{ color: 'green' }} />
        </IconButton>
        <Typography sx={{ marginRight: '20%'}}>{Math.floor(timer / 3600).toString().padStart(2, '0')}:{Math.floor(timer % 3600 / 60).toString().padStart(2, '0')}:{Math.floor(timer % 60).toString().padStart(2, '0')}</Typography>
        <IconButton
          color="secondary"
          aria-label="Stop"
          onClick={() => handleStopTask()}
          sx={{
            ...roundButtonStyle,
            backgroundColor: '#c4c4c4',
            border: '1px solid transparent',
            '&:hover': {
              backgroundColor: 'transparent', 
              border: '1px solid #af7fd4'
            },
          }}>
          <StopIcon style={{ color: 'red' }} />
        </IconButton>
      </Box>
      <Box>
        <CreateNew addTask={addTask} projects={projects} tasksService={tasksService}/>
      </Box>
      <Box sx={{margin: '2%', borderRadius: '10px', background: 'white', padding: '3%', width: '80%'}}>
        <Typography sx={{color: 'black'}} variant="h5">To do</Typography>
        <form><RadioGroup
          name="radio-buttons-group"
          value={selectedTask}
          onChange={radioChange}>
          <Paper sx={{padding:'20px', marginTop:'3%'}} elevation={3}>
          <Box
            margin='16px'
            key='-1'
            padding='16px'
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            flexDirection="row">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{padding: '0px', width:'30%'}}><Typography sx={{marginRight:'20%'}} variant="h6">Start new task</Typography></TableCell>
                        <TableCell sx={{padding: '0px', width:'30%'}}><Typography sx={{marginRight:'5%'}} variant="h6"></Typography></TableCell>
                        <TableCell sx={{padding: '0px', width:'5%', textAlign: 'end'}}></TableCell>
                        <TableCell sx={{padding: '0px', width:'2%', textAlign: 'center'}}></TableCell>
                        <TableCell sx={{padding: '0px', width:'5%', textAlign: 'start'}}></TableCell>
                        <TableCell sx={{padding: '0px', width:'30%', textAlign: 'end'}}></TableCell>
                        <TableCell sx={{padding: '0px', width:'1%'}}><FormControlLabel sx={{marginLeft: '50%'}} value='-1'  control={<Radio />} label=' '/></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          </Box>
            {tasks.filter((x: Task) => x.startTime == null).map((task: Task) => (
              <TaskDisplay task= {task}/>
            ))}
          </Paper>
        </RadioGroup></form>
      </Box>
      <Box sx={{margin: '5%', borderRadius: '10px', background: 'white', padding: '3%', width: '80%'}}>
        <Typography sx={{color: 'black'}} variant="h5">Finished tasks</Typography>
          { Object.entries(taskGroups).map(([date, tasksForDate]) => (
            <Paper sx={{padding:'20px', marginTop:'3%'}} elevation={3}  key={date}>
              <Typography sx={{ textDecoration: 'underline', fontStyle: 'italic' }} variant="h6">{dayjs(date).format('ddd, DD/MM')}</Typography>
                    {tasksForDate.map((task) => (
                    <TaskDisplay task= {task}/>))}
            </Paper>))}
      </Box>
    </Box>
  );
};

export default Tasks;