import React from "react";
import axios from 'axios';
import spinner from '../spinner.gif';

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
            this.setState({
                fetchingRate: false,
                rate: res.data.rate__c,
                fresh: false
            });
        });
    }

    render() {

        let rateSpan;
        if(this.state.rate) {
            rateSpan = <span>Your rate is {this.state.rate}</span>
        } else if(this.state.fresh) {
            rateSpan = <span>Click Get my rate</span>
        } else if(!this.state.fresh) {
            rateSpan = <span>No rate available</span>
        }

        let loading;
        if(this.state.fetchingRate) {
            loading = <img src={spinner} alt="Waiting for rate"/>
        }

        return(
            <div>
                <h1>Loan Calculator</h1>
                <p>
                    <label for="amount">Loan Amount</label>
                    <br/>
                    <input id="amount" name="amount" type="number" value={this.state.amount} onChange={(e) => this.handleChange('amount', e)}></input>
                </p>
                <p>
                    <label for="months">Repayment Terms</label>
                    <br/>
                    <select id="months" name="months" value={this.state.months} onChange={(e) => this.handleChange('months', e)}>
                    <option selected disabled>-- Repayment --</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="36">36</option>
                    <option value="48">48</option>
                    </select>
                </p>
                <button onClick={this.getRate}>Get my rate</button>
                <br/>
                {loading}
                <br/>
                {rateSpan}
                
            </div>
        );
    }
}

export default LoanCalculator;