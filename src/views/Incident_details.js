/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SelectSearch, { fuzzySearch } from "react-select-search";
import { dbGet, dbPatch } from 'utils/backendFetchers';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import "pages/ic.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import DynamicTable from "components/Table/DynamicTable"
import useStyles from "styles"
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

import Select from 'react-select'
import SimpleTable from "components/Table/SimpleTable";
import { ValueAxis } from "devextreme-react/range-selector";

const options = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' },
  { value: 'Baja', label: 'Baja' }
]



const formData = {};
export const INCIDENT_DETAILS_PATH = "/incidents_details";

const tableData = [];
const ciItemColumns = [
    {"name": "id", "label": "id"},
    {"name": "name", "label": "Descripción"},
    {"name": "type", "label": "Tipo"}
]
const priorities = [{"name":"Alta"}, {"name":"Media"}, {"name":"Baja"},]


function IncidentDetails(props) {
  var classes = useStyles();
  const history = useHistory();
  var paths = window.location.pathname.split("/") 
  var incident_id = paths[paths.length - 1]
  const [itemsData, setItemsData] = React.useState([]);

  const [confItems, setConfItems]  = React.useState([]);
  const [values, setValues] = React.useState("");
  const [bigChartData, setbigChartData] = React.useState(tableData);
  const [columns, setColumns] = React.useState(ciItemColumns);
  React.useEffect(() => {
    dbGet("incidents/" + incident_id).then(data => {
        setValues(data);
    }).catch(err => {console.log(err)});
    }   , []);

    function fetchItemsData() {
        dbGet("incidents/" + incident_id).then(data => {
            var items_data = data["configuration_items"]
            setItemsData(items_data);
        }).catch(err => {console.log(err)});
    }
  console.log("Values: ", values)

  function fetchValues() {
    dbGet("incidents/" + incident_id).then(data => {
        setValues(data);
    }).catch(err => {console.log(err)});
}

  React.useEffect(() => {
    dbGet("configuration-items/names").then(data => {
        setConfItems(data["items"]);
    }).catch(err => {console.log(err)});
    }   , []);

    const [formFields, setFormFields] = React.useState([{}])

    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data)
      }

    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });
    };
    

  const handleFormChange = (event, index, field) => {
    let value;
    let data = [...formFields];
    if (field === "description" || field === "priority") {
        value = event.target.value;
        data[index] = value;
    }
    else {
        value = event;
        data[index] = value;
        setFormFields(data);
        setValues([...values, value]);
    }
    formData[field] = value;
  }

  const exitForm = () => { 
    history.push(simple_routes.incidents);
    }

  const submitForm = (data) => { 
      data = {}
      // data["description"] = document.getElementById("description").value;
      // data["priority"] = values["priority"]
      data["taken_by"] = "SuperAdmin"
      dbPatch("incidents/" + incident_id, data);
      history.push(simple_routes.incidents);
  }

  const addFields = () => {
    let object = {};

  setFormFields([...formFields, object])
  }
  
  
  function getConfigurationItem(values, type, index){
    if (!values ) return
    if (type in values && (values[type].length > 0)){
      return values[type][index].name
    }

  }

  function updatePriority(new_priority){
    //Llama al actualizador del values pasandole todos los datos
    //anteriores pero actualiza la prioridad
    setValues({...values, priority:new_priority})
  }

  if (itemsData.length === 0) {
    fetchItemsData();
  }

  function addButtons() {
      if (values === '') {
      fetchValues();
    }
    if (!values.taken_by) {
        return (
        <Button className="btn-fill"
        color="primary"
        type="submit"
        onClick={() => submitForm()}
        >
        Tomar        
        </Button>)
    }
    return (
        <Grid align="center">
        <Button className="btn-fill" align="right"
        color="success"
        type="submit"
        onClick={() => submitForm()}
        >
        Resolver        
        </Button>
        <Button className="btn-fill" align="left"
        color="warning"
        type="submit"
        onClick={() => submitForm()}
        >
        Bloquear        
        </Button>
        </Grid>)
  }

  return (
    <>
      <div className="content">
            <Card>
              <CardHeader >
                <h4 className="title">Detalles del incidente</h4>
              </CardHeader>
              <CardBody>
                <Form disabled>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Descripción</h5>
                        <input
                          readOnly
                          value= {values.description}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Prioridad</h5>
                        <input
                          readOnly
                          value= {values.priority}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Estado</h5>
                        <input
                          readOnly
                          value= {values.status}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Creado por</h5>
                        <input
                          readOnly
                          value= {values.created_by}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Tomado por</h5>
                        <input
                          readOnly
                          value= {values.taken_by}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  {/* <Grid class = {classes.SmallPaddedGrip}>
                    <Col className="px-md-1" md="3">
                      <FormGroup>
                      <h5 className="title">Prioridad</h5>
                        <Select
                            id="priority"
                            value={{ value: values.priority, label: values.priority }}
                            onChange={function(new_option){updatePriority(new_option.value)}}
                            options={options}
                        />
                      </FormGroup>
                    </Col>
                  </Grid> */}
                    <Grid class = {classes.PaddedGrid} >
                    <h5> <b>Ítems de configuración</b></h5>
                    <SimpleTable data={itemsData} columns={columns} />
                    </Grid>
                </Form>
              </CardBody>
              <CardFooter align="center">
                {addButtons()}
              </CardFooter>
            </Card>
      </div>
    </>
  );
}

export default IncidentDetails;
