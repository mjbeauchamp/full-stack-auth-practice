import React, {Component} from 'react';
import axios from 'axios';
//This imports our action-creator function from the users.js file where our reducer is stored
import {getUserData} from "./../../ducks/users"
import {connect} from 'react-redux';
import "./Private.css"

class Private extends Component{
    //On component mount, we want to run a get request to verify whether or not the user is logged in
    componentDidMount(){
        //This is pulling in data from our server app.get("/api/user-data") endpoint
        //We need to plan in that endpoint what data we want to send to our component if the user is logged in
        axios.get("/api/user-data")
            .then(response => {
                console.log(response.data)
                //This pulls 
                this.props.getUserData(response.data);
            })
            .catch(err => {
                console.log(err)
            })
    }

    bankBalance(){
        return Math.floor((Math.random() + 100) * 1000)
    }


    render(){
        //This is pulling the user info from props
        //Use an <a> tag instead of axios if you want to redirect a page after something is clicked
        let {user} = this.props;
        console.log(this.props)
        return (
            <div>
                <h2>Account Information</h2>
                <hr/>
                <h4>Account Holder: {user.user_name ? user.user_name : null}</h4>
                <p>Account Number: {user.auth_id ? user.auth_id : null}</p>
                <p>Balance: {this.bankBalance()}.00</p>
                {user.user_pic ? <img className="avatar" src={user.user_pic}/> : null}
                <a href="http://localhost:3005/api/logout">
                    <button onClick={this.logout}>Logout</button>
                </a>
            </div>
        )
    }
}
//This is how we pull data from the store state into this specific component
//THis literally maps the store's global state 
//The state parameter that we pass in is always the ENTIRE store state object
//Always return an object from this function
//Whatever we return from this object is automatically going to be added to THIS component's props object
function mapStateToProps(state){
    return {
        user: state.user
    }
}

//Whatever we add as an object after mapStateToProps WILL BE ADDED TO OUR PROPS AS WELL
//We can now invoke it in this file as this.props.getUserData
export default connect(mapStateToProps, {getUserData})(Private);