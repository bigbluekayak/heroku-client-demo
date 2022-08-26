import React, { useMemo } from "react";
import axios from 'axios';
import spinner from '../spinner.gif';
import { Button, Container, Form, InputGroup, Card, Row, Col, ListGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './loanCalculator.css';

class LoanCalculator extends React.Component {
    constructor(props) {
        super(props);

        this.getRate = this.getRate.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            fresh: true,
            fetchingRate: false,
            amount: 500,
            months: 12,
            rate: 0
        }
    }

    handleChange(name, event) {
        this.setState({[name]: event.target.value});
    }

    getRate() {
        this.setState({fetchingRate: true});
            axios.get('https://heroku-api-demo-staging.herokuapp.com/api/v1/rate', { params: {
                amount: this.state.amount, 
                months: this.state.months
            }}).then(res => {
                setTimeout(() => { // Pause for dramatic effect
                    this.setState({
                        fetchingRate: false,
                        rate: res.data.rate__c,
                        fresh: false
                    });
                }, 1700);
        });
        
    }

    emi = (p, rt, n) => {
        const r = rt/100/n;
        var x = Math.pow(1 + r, n);
        var monthly = (p*x*r)/(x-1);
        return monthly;
    }

    render() {

        let rate;
        if(this.state.rate) {
            rate = <div>
                <p>Principle loan amount {this.state.amount}</p>
                <p>Your rate is {this.state.rate}%</p>
                <p>{this.state.months} monthly installments of £{this.emi(this.state.amount,this.state.rate,this.state.months)}</p>
                <p>Total amount payable over {this.state.months} months is £{this.emi(this.state.amount,this.state.rate,this.state.months) * this.state.months}</p>
                <Button>Apply NOW</Button>
              </div>
        } else if(this.state.fresh) {
            rate = <p>Click <i>Get my quote</i></p>
        } else if(!this.state.fresh) {
            rate = <p>No rate available</p>
        }

        let loading;
        if(this.state.fetchingRate) {
            loading = <p><img src={spinner} alt="Waiting for rate"/></p>
        }

        return(

            <Card>
                <Card.Body>
                    <Card.Title className="text-center">Get your quote now</Card.Title>
                    <Card.Text className="text-center text-muted">Tell us how much you would like to borrow, and for how long to get our best available rate.</Card.Text>
                    <Form.Range className="md-5" min="500" max="1999" step="1" value={this.state.amount} onChange={(e) => this.handleChange('amount', e)}/>
                    <p className="text-center">£{this.state.amount}</p>
                    <Form.Range min="12" max="48" step="12" value={this.state.months} onChange={(e) => this.handleChange('months', e)}/>
                    <p className="text-center">over {this.state.months} months</p>
                    <div className="d-grid gap-2">
                        <Button variant="primary" onClick={this.getRate}>Get my quote</Button>
                    </div>
                    <p className="text-center">{loading}</p>
                    {rate}
                </Card.Body>
            </Card>


            
        );
    }
}

export default LoanCalculator;