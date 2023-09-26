import { Task } from '../../interfaces/Task'
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { Box, FormControlLabel, Table, TableBody, TableCell, TableRow } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

interface TasksProps {
  task: Task;
}

const TaskDisplay: React.FC<TasksProps> = ({ task }) => {

  return (
    //<Paper  style={{ padding: '16px', marginBottom: '16px'}} key={task.id}>
        <Box
          margin='16px'
          key={task.id}
          padding='16px'
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          flexDirection="row">
          <Table>
              <TableBody>
                  <TableRow>
                      <TableCell sx={{padding: '0px', width:'30%'}}><Typography sx={{marginRight:'20%'}} variant="h6">{task.name}</Typography></TableCell>
                      <TableCell sx={{padding: '0px', width:'30%'}}><Typography sx={{marginRight:'5%'}} variant="h6">{task.projectName}</Typography></TableCell>
                      <TableCell sx={{padding: '0px', width:'5%', textAlign: 'end'}}>{task.startTime !== null && (<Typography sx={{marginRight:'2%'}}>{dayjs(task.startTime).format('hh:mma').toString()}</Typography>)}</TableCell>
                      <TableCell sx={{padding: '0px', width:'2%', textAlign: 'center'}}>{task.startTime !== null && (<Typography sx={{marginRight:'2%'}}>-</Typography>)}</TableCell>
                      <TableCell sx={{padding: '0px', width:'5%', textAlign: 'start'}}>{task.endTime !== null && (<Typography sx={{marginRight:'15%'}}>{dayjs(task.endTime).format('hh:mma').toString()}</Typography>)}</TableCell>
                      <TableCell sx={{padding: '0px', width:'30%', textAlign: 'end'}}>{task.duration !== null && (<Typography>{Math.floor(task.duration / 3600).toString().padStart(2, '0')}:{Math.floor(task.duration % 3600 / 60).toString().padStart(2, '0')}</Typography>)}</TableCell>
                      <TableCell sx={{padding: '0px', width:'1%'}}>{task.startTime == null && <FormControlLabel sx={{marginLeft: '50%'}} value={task.id} control={<Radio />} label=' '/>}</TableCell>
                  </TableRow>
              </TableBody>
          </Table>
        </Box>
  );
};

export default TaskDisplay;