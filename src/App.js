import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import LoanCalculator from './components/loanCalculator';
import herokuLogo from './heroku-logo.png';

function App() {
  return (
    <Container fluid>
      <Row>
        <Col xs={1} sm={2} md={3} lg={4}></Col>
        <Col>
          <LoanCalculator></LoanCalculator>
        </Col>
        <Col xs={1} sm={2} md={3} lg={4}></Col>
      </Row>
      <Row>
        <Col xs={1} sm={2} md={3} lg={4}></Col>
        <Col>
          <p className="text-center">Powered by <img src={herokuLogo} height="40"/></p>
        </Col>
        <Col xs={1} sm={2} md={3} lg={4}></Col>
      </Row>
    </Container>
  );
}

export default App;
