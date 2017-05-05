import React, { Component } from 'react';
import { 
  Container, Row, Col, 
  CardDeck, CardHeader, CardFooter, CardBlock, Card, CardTitle, CardSubtitle, CardText, CardImg,
  Button, Form, FormGroup, Label, Input,
  Badge, Collapse, Nav, Navbar, NavItem, NavLink, NavbarBrand
} from 'reactstrap';

class ResultCard extends Component {

  // pass in, like, an array of objects:
  // [ { provider: "megabus", price: 23, dow: "sat", date: 2017-01-17, leave: "12:00p", arrive: "11:59p" }, ... ]

  // function to get cheapest option, save to state, place in render

  render() {
    return(
      <Card>
        <CardBlock>
          
          <CardText className="d-flex justify-content-between">
            <span><h2>$23</h2></span>
            <span style={{"lineHeight": "1rem","textAlign": "right"}}>
              Sat
              <br/>
              <small>9/12</small>
            </span>
          </CardText>
          
          <CardSubtitle>12:00p-11:59p</CardSubtitle>
          <CardText>Megabus</CardText>
        
        </CardBlock>

        <CardFooter>
          <Button className="col">Open</Button>
        </CardFooter>

      </Card>
    );
  }
}

class Results extends Component {
  render() {
    return(
      <div>
        <p className="d-flex justify-content-center">cheapest price | more detail</p>
        <CardDeck className="row">
          <Col lg="2">
            <ResultCard /> 
          </Col>          
        </CardDeck>
      </div>
    );
  }
}

class SearchForm extends Component {
  constructor(props) {
    super(props);
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.props.onSearchFormInput(event);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSearchFormSubmit(event);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        
        <FormGroup>
          <Label for="route">pick a route</Label>
          <Row><Col lg="6">
            <Input type="select" name="route" defaultValue="-" onChange={this.handleInputChange} >
              <option value="-" disabled hidden>—</option>
              <option value="nyc-bos">nyc to bos</option>
              <option value="bos-nyc">bos to nyc</option>
            </Input>
          </Col></Row>
        </FormGroup>

        <FormGroup>
        <Label for="depart">depart</Label>
        <Row>
          <Col lg="6"><Input type="date" name="depart1" onChange={this.handleInputChange} /></Col>
        </Row>
        </FormGroup>

        <Button>Submit</Button>

      </Form>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openForm: true,
      openResults: false
    };

    this.handleSearchFormInput = this.handleSearchFormInput.bind(this);
    this.handleSearchFormSubmit = this.handleSearchFormSubmit.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  handleSearchFormInput(event) {
    const target = event.target;
    const value = target.value;
    const name = 'search_' + target.name;

    this.setState({
      [name]: value
    });
  }

  handleSearchFormSubmit(event) {
    event.preventDefault();

    // check route is filled, depart1 is filled
    if (this.state.search_route == null || this.state.search_depart1 == null) {
      console.log(this.state);
      alert('need route and at least first date'); // replace this with on-page ui alert
      return;
    }

    this.setState({
      openForm: false,
      openResults: true
    });

    // todo: add loading wheel to empty results page
    this.makeSearches();
  }

  makeSearches() {
    // todo: validate datefrom < dateto
    let date_walker = this.dateFrom(this.state.search_depart1);
    const date_walkto = this.dateFrom(this.state.search_depart2);
    const route = this.routeFrom(this.state.search_route);

    // this is like the first time i've used a do-while
    do {

      // for each provider:
      // build url, make axios call, scrape, objectify, save to state

      date_walker.setDate(date_walker.getDate() + 1);
    } while (date_walkto != null && !(date_walker.getTime() >= date_walkto.getTime()));
  }

  // dateString should be formatted like "2017-12-31"
  dateFrom(dateString) {
    if (dateString == null) {
      return null;
    }

    const date = dateString.split("-");
    return new Date(date[0], date[1] - 1, date[2]);
  }

  // routeString should be formatted like "nyc-bos"
  routeFrom(routeString) {
    let route = routeString.split('-');
    return { origin: route[0], destination: route[1] };
  }

  toggleView() {
    this.setState({
      openForm: !this.state.openForm,
      openResults: !this.state.openResults
    });
  }

  render() {
    return (
      <Container>

        <h1>Welcome to NYBOS</h1>
        <p>
          Hello
        </p>

        <Row><Col>
          <Collapse isOpen={this.state.openForm}>
            <SearchForm onSearchFormInput={this.handleSearchFormInput}
                        onSearchFormSubmit={this.handleSearchFormSubmit} />
            <hr />
          </Collapse>
        </Col></Row>
        
        <Collapse isOpen={this.state.openResults}>
          <Button className="col" onClick={this.toggleView}>pick a different date</Button>
          <Results />
        </Collapse>
        
      </Container>
    )
  }
}

