import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({yearId, taskName, taskDetails, taskAgents, filterByAgent=null}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate()  
  const handleClick = () => {
    navigate(`/task/${yearId}`, {state: filterByAgent});
  };

  const agentList = [...new Set(taskAgents.map((agent) => (`${agent.firstName} ${agent.lastName}`)))]
  
  return (
    <Card onClick={handleClick} sx={{ maxWidth: 345, background: colors.grey[100] }} >
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" color={colors.grey[900]}>
            {taskName}
          </Typography>
          <Typography variant="body2" color={colors.grey[900]}>
            Total number of degrees: {taskDetails}
          </Typography>
          <Typography variant="body2" color={colors.grey[900]}>
            All Agents: {agentList?.join(', ')}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default TaskCard