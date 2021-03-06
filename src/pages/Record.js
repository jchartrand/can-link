import React, { useContext } from 'react';
import Header from '../components/Header'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import RdfDialog from '../components/RdfDialog'
import { SPARQL_SUBJECT_URL, THESIS_URI } from '../constants';

import {
    useParams, Link
  } from "react-router-dom";
import useSOLRRecordQuery from '../hooks/useSOLRRecordQuery';

import {UniversityListContext} from '../contexts/UniversityListContext'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '100%',
    flexGrow: 1
  },
  text: {
    margin: '2em',
  },
  title: {
    textDecoration: 'underline',
    fontSize: '12pt'
  },
  subheading: {
    marginBottom:'.7em',
    marginTop: '1em',
    fontSize: '12pt'
  }
});

export default function Record() {
    const classes = useStyles();
    const [uniMapping] = useContext(UniversityListContext)

    const { recordId } = useParams(); 

    const [{thesis}] = useSOLRRecordQuery(recordId);
    const uni = uniMapping[thesis.institution]
    
    const thesisURI = `${THESIS_URI}${recordId}`
    const rdfURI = SPARQL_SUBJECT_URL.replace('{SUBJECT_URI}', thesisURI)

    return (
        <div><Header/>
        <div className={classes.root}>
          <div className={classes.text}>
        <Typography component="div" variant="h5" gutterBottom>
            <span className={classes.title}>{thesis.title} </span>
        </Typography> 

        <Typography component="div" variant="h5" gutterBottom>
            {thesis.creator_first} {thesis.creator_last} 
        </Typography> 

        <Typography component="div" variant="h5" gutterBottom>
            {thesis.year} 
        </Typography> 
        
        <Typography component="div" variant="h5" gutterBottom>
            {uni?uni.name:''}
        </Typography> 

        <Typography component="div" variant="h5" gutterBottom>
        {thesis.degree_name} 
        </Typography> 

        <Box fontWeight='fontWeightBold' className={classes.subheading}>Subjects</Box>
        <Typography component="div" variant="body1" gutterBottom>
        { (thesis.subject) && 
          <Box>
            {
              thesis.subject.map((subject,i)=>{
                return <Link
                  style={{marginRight:'1em'}}
                   
                  color="primary"
                  to={{ pathname: "/subject/" + thesis.subject_url[i].split('/').pop() }}>
                            {subject}
                </Link>
              })
            }
          </Box>
        }
        </Typography>
        

        

        <Box fontWeight='fontWeightBold' className={classes.subheading}>Supervisor</Box>
        <Typography component="div" variant="body1" gutterBottom>
        {thesis.advisor_name?thesis.advisor_name.map(sub=><div style={{marginRight:'1em'}}>{sub}</div>):''} 
        </Typography>

        <Box fontWeight='fontWeightBold' className={classes.subheading}>Department or Faculty</Box>
        <Typography component="div" variant="body1" gutterBottom>
        {thesis.department?thesis.department.map(sub=><div style={{marginRight:'1em'}}>{sub}</div>):''} 
        </Typography>

        <Box fontWeight='fontWeightBold' className={classes.subheading}>Discipline</Box>
        <Typography component="div" variant="body1" gutterBottom>
        {thesis.discipline?thesis.discipline.map(sub=><div style={{marginRight:'1em'}}>{sub}</div>):''} 
        </Typography>

        <Box fontWeight='fontWeightBold' className={classes.subheading}>Link to fulltext</Box>
        <Typography component="div" variant="body1" gutterBottom>
        {thesis.link?<a href={thesis.link}>{thesis.link}</a>:''} 
        </Typography>

        <Box fontWeight='fontWeightBold' className={classes.subheading}>View RDF</Box>
        <Typography component="div" variant="body1" gutterBottom>
            <RdfDialog rdfURI={rdfURI}/> 
        </Typography>

        <Box fontWeight='fontWeightBold' className={classes.subheading}>Abstract</Box>
        <Typography component="div" variant="body2" gutterBottom style={{marginRight:'12.5%'}}>
            {thesis.abstract} 
        </Typography> 
        </div>
        </div>
         
        </div>
    )
}