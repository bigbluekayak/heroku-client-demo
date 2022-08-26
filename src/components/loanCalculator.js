import React, { useMemo } from "react";
import axios from 'axios';
import spinner from '../spinner.gif';
import { Button, Container, Form, InputGroup, Card, Row, Col, ListGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './loanCalculator.css';
import NumberFormat from 'react-number-format';

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
            p: 0,
            n: 0,
            r: 0,
            monthly: 0
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
                    const r = res.data.rate__c/100/this.state.months;
                    const x = Math.pow(1 + r, this.state.months);
                    const emp = ((this.state.amount*x*r)/(x-1)).toFixed(2);
                    const t = (this.state.months * emp).toFixed(2);
                    const c = (t - this.state.amount).toFixed(2);

                    this.setState({
                        fetchingRate: false,
                        r: res.data.rate__c,
                        p: this.state.amount,
                        n: this.state.months,
                        m: emp,
                        t: t,
                        c: c,
                        fresh: false
                    });
                }, 1700);
        });
        
    }

    render() {

        let rate;
        if(this.state.r) {
            rate = <div>
                <p>Principle loan amount <NumberFormat displayType={'text'} value={this.state.p} thousandSeparator={true} prefix={'£'}/></p>
                <p>Your rate is <NumberFormat displayType={'text'} value={this.state.r}  suffix={'%'}/></p>
                <p>{this.state.n} monthly installments of <NumberFormat displayType={'text'} fixedDecimalScale={2} value={this.state.m} prefix={'£'}/></p>
                <p>Total amount payable over {this.state.n} months is <NumberFormat displayType={'text'} fixedDecimalScale={2} value={this.state.t} prefix={'£'}/></p>
                <p>Total cost of credit is <NumberFormat displayType={'text'} fixedDecimalScale={2} value={this.state.c} prefix={'£'}/></p>
              </div>
        } else if(this.state.fresh && !this.state.fetchingRate) {
            rate = <p className="text-center">Click <i>Get my quote</i></p>
        } else if(this.state.fresh && this.state.fetchingRate){
            rate = <p className="text-center">Getting you the best rate...</p>
        } else if(!this.state.fresh) {
            rate = <p className="text-center">No rate available</p>
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
                    <p className="text-center"><NumberFormat displayType={'text'} value={this.state.amount} thousandSeparator={true} prefix={'£'}/></p>
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