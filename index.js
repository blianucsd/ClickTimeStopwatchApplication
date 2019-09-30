import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* Declare global variables that can be accessed by all functions and classes */
var longitude;
var latitude;

/* This function returns a box that displays a given value */
function Box(props) {
    return (
      <label className="Box">
        {props.value}
      </label>
    );
}

/* This function returns a button that displays a given value */
function Button(props) {
    return (
        <button className="Button" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

/* 
 * This class is in charge of making the table, which it does by making all of the boxes
 * that make up the table and then rendering them
 */
class Table extends React.Component {

    /* This method sets the value inside an individual box which is stored in an array */
    renderBox(i) {
        return (
            <Box
                value = {this.props.oldArray[i]}
            />
        );
    }

    /* This method creates and returns an array that represents the table */
    createTable = (rows) => {
        let table = []

        /* 
         * This for loop belongs in here because React does not like having for
         * loops inside a return statement or a render method
         */
        for(let i = 0; i < rows + 1; i = i + 1) {
            let children = []
            for(let j = 0; j < 8; j = j + 1) {
                children.push(<td>{this.renderBox((i*8)+j)}</td>)
            }
            table.push(<tr>{children}</tr>)
        }
        return table
    }

    /* This function calls createTable() to render the table */
    render() {
            return (
                <table>
                    {this.createTable(this.props.numRows)}
                </table>
            )
    }
}

/*
 * This class controls the entire page and creates the buttons and the table, it is also in charge
 * of handling clicks and determining and assigning new values into the boxes
 */ 
class Page extends React.Component {

    /* This constructor initializes many local variables */
    constructor(props) {
        super(props);
        this.state = {
            oldArray: [null, "Start Time", "Start Longitude", "Start Latitude", "End Time", "End Longitude", "End Latitude", "Time Elapsed (seconds)"],
            numOfRows: 0,
            btnLabel: "Start",
            startTime: 0
        };
    }

    /* This makes the button and also deals with clicks */
    renderButton(i) {
        return(
            <Button
                value = {i}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    /* 
     * This method handles clicks and depending on "Start" or "Stop", it will either make a
     * new row or it will fill in a pre-existing row
     */ 
    handleClick(i) {
        let startingTime;
        let endTime;
        let timeElapsed;

        /* Check if it was the "Start" button */
        if(this.state.btnLabel === "Start") {

            /* increment the number of rows */
            const newNumOfRows = this.state.numOfRows + 1;

            /* Get the date to fill in the table entry with */
            let dt = new Date();
            startingTime = Date.now();

            /* Get it in a nicely formatted string */
            let startTimeUTC = dt.toUTCString();
            
            /* Update the local variables */
            this.setState({
                numOfRows: newNumOfRows,
                btnLabel: "Stop",
                startTime: startingTime,
            });

            /* Make a copy of the array to alter */
            let tempArray = this.state.oldArray.slice();
            tempArray.push(newNumOfRows);
            tempArray.push(startTimeUTC);

            /* Get the longitude and latitude */
            navigator.geolocation.getCurrentPosition(function(position){
                    longitude = position.coords.longitude;
                    latitude = position.coords.latitude;
            });
            tempArray.push(longitude);
            tempArray.push(latitude);

            /* Update the array */
            this.setState({
                oldArray: tempArray
            });
        }

        /* Otherwise it is the "Stop" button */
        else {

            /* Get the current time */
            let dt = new Date();
            endTime = Date.now();

            /* Get the UTC formatted string */
            let endTimeUTC = dt.toUTCString();

            /* Calculate the time elapsed */
            timeElapsed = endTime - this.state.startTime;
            timeElapsed = Math.floor(timeElapsed/1000);

            /* Update the button label and startTime */
            this.setState({
                btnLabel: "Start",
                startTime: 0
            });

            /* Create a copy of the array to alter */
            let tempArray = this.state.oldArray.slice();
            tempArray.push(endTimeUTC);

            /* Get the longitude and latitude */
            navigator.geolocation.getCurrentPosition(function(position){
                longitude = position.coords.longitude;
                latitude = position.coords.latitude;
            });
            tempArray.push(longitude);
            tempArray.push(latitude);
            tempArray.push(timeElapsed);

            /* Update the array */
            this.setState({
                oldArray: tempArray
            });
        }
    }

    /* This method renders the whole page, button and table */
    render() {

        /* For some reason this is needed to get the longitude and latitude the first time */
        if(this.state.numOfRows === 0) {
            navigator.geolocation.getCurrentPosition(function(position){
                longitude = position.coords.longitude;
                latitude = position.coords.latitude;
            });
        }

        /* Returns a button and a table */
        return(
            <div className="page">                
                <div className="button">
                    {this.renderButton(this.state.btnLabel)}
                </div>
                <div className="table">
                    <Table
                        oldArray={this.state.oldArray}
                        numRows = {this.state.numOfRows}
                    />
                </div>
            </div>
        );
    }
}

/* Works the entire page */
ReactDOM.render(<Page />, document.getElementById("root"));

