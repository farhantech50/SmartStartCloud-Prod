import { Box, useTheme, Typography } from '@mui/material'
import Header from '../../components/Header'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { tokens } from '../../theme'
import { faqData } from '../../data/mockData'


const FAQ = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

  return (
    <Box m="20px">
        <Header title="FAQ" subtitle="Frequently Asked Questions" />
        {faqData && faqData.map((data, idx)=>(
            <Accordion key={idx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant='h5'>
                        {data.summary}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {data.details}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        ))}
    </Box>
  )
}

export default FAQ