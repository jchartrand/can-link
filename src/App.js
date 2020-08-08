import React, {useState, Fragment} from 'react';
import './App.css';
import useSOLRQuery from './hooks/useSOLRQuery';

import canLinkLogo from './canlink.png';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import AppBar from '@material-ui/core/AppBar';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paginator from './components/Paginator';

import '../node_modules/react-vis/dist/style.css';
import '../node_modules/leaflet/dist/leaflet.css'

import ThesisDialog from './components/ThesisDialog'
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import { useForm } from "react-hook-form";
import Suggester from './components/Suggester';
import UniversitySelect from './components/UniversitySelect';
import VisualizationBar from './components/VisualizationBar';
import FacetMap from './components/FacetMap';
import WordCloud from './components/WordCloud'
import ToggleBar from './components/ToggleBar';
import Bubbles from './components/Bubbles';
import { Toolbar } from '@material-ui/core';
import AnimatedTreeMap from './components/AnimatedTreeMap';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  popover: {
    pointerEvents: 'none',
  },
}));

function App() {

  const classes = useStyles();

  const [visualization, setVisualization] = useState('map')

  const [{ response, universities, subjects, degrees, years, languages, isLoading, isError }, doQuery] = useSOLRQuery();
  
  const { register, handleSubmit, setValue, errors } = useForm();
  
  const onSubmit = queryInputs => {
    doQuery({...queryInputs, page: 0});
  }

  //console.log(watch("Discipline")); // watch input value by passing the name of it

  const handlePageChange = (page) => {
    handleSubmit(queryInputs => doQuery({...queryInputs, page: page-1}))()
  }

  const handleTabBarChange = (tabName) => {
    setVisualization(tabName)
  }

React.useEffect(() => {
  register({ name: 'Subject' });
  register({ name: 'Creator' });
  register({ name: 'Institution' });

}, [register]);

  return (
    
<div>
<AppBar  position="static" color="transparent" >

  <Toolbar >
 <img src={canLinkLogo} alt={'logo'} height={'50px'} />
  </Toolbar>
   </AppBar>
  
  <div className="App">
    <div className={classes.root}>
      
    
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Grid container  >
        <Grid item sm={6} >
            <FormControl> <TextField  style={{ width: "47.9vw" }} variant={'outlined'} type="search" label={"Query"} inputRef={register} name="query"   /></FormControl>
        </Grid>

        <Grid item sm={3}  >
        <FormControl> <TextField  style={{ width: "23vw" }} variant={'outlined'} type="number" label={"From Year"} inputRef={register({ min: 1000, max: 9999 })} name="from"   /> {errors.from && "Year must be four digits"}</FormControl>
 
        </Grid>
        
        <Grid item sm={3} >
        <FormControl> <TextField  style={{ width: "23vw" }} variant={'outlined'} type="number" label={"To Year"} inputRef={register({ min: 1000, max: 9999 })} name="to"   />  {errors.from && "Year must be four digits"} </FormControl>
 
        </Grid>
      </Grid>
      <Grid container spacing={1} >
        <Grid item sm={3} >
            <UniversitySelect width='23vw' setValue={setValue}/>
        </Grid>
        
        <Grid item sm={3} >
            <Suggester  width='23.5vw' title={'Subject'} suggestType="subjects" setValue={setValue}/>
        </Grid>
        
        <Grid item sm={3} >
            <Suggester  width='23vw' title={'Creator'} suggestType="agents" setValue={setValue}/>
        </Grid>
        <Grid item sm={3} >
          <Button style={{ width: "10vw", height: "100%"}} variant="outlined" color="primary" type="submit">Search</Button>
      </Grid>
    
      </Grid>

      </form>
      <Grid container spacing={3} style={{padding: '1vw'}}>
  {isError && <div>Something went wrong ...</div>}
 
              {isLoading ? (
                <div>Loading ...</div>
              ) : (
                <Grid container spacing={1}>
                      <Grid item xs={4}>
                  {response.docs[0] ? (
                    <Fragment>
                      <Typography component="span"
                    variant="body2">Page {response.start/10 + 1} of {Math.ceil(response.numFound/10)}</Typography>

                      <div className={classes.demo}>
                        <List dense={true}>
                          {response.docs.map(thesis => (
                            <ThesisDialog key={thesis.id} thesis={thesis}/>))}
                        </List>
                      </div>

                      <Paginator  handlePageChange={handlePageChange} page={response.start/10 + 1} totalPages={Math.ceil(response.numFound/10)}/>
                      </Fragment>
                  ):(<Typography component="span"
                  variant="body2">No Results To Show</Typography>)
                  }
                    </Grid>

                    <Grid item xs={8}>
                             <ToggleBar setVisualization={handleTabBarChange} />
                             
                           <div>
                             {visualization === 'map' && <FacetMap facets={universities} /> }
                             {visualization === 'cloud' && <WordCloud words={subjects} /> }
                             {visualization === 'rdTree' &&   <AnimatedTreeMap data={universities} type="circlePack"/>}
                             {visualization === 'sqTree' &&   <AnimatedTreeMap data={years} type="squarify"/>}
                             {visualization === 'subbub' &&   <Bubbles values={degrees}/>}
                             {visualization === 'lang' &&   <Bubbles values={languages}/>}
                            </div> 
                        </Grid>
                </Grid>
              )}
          
      </Grid>
    </div>
    </div>
    </div>
   
  );
}

export default App;