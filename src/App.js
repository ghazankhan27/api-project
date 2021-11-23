import './App.css';
import UserList from './UserList';
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/dave132/barchart/master/links.json")
      .then(res => res.text())
      .then(
        (result) => {
          result = result.replace(/'/g, '"');
          result = JSON.parse(result);
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])



  const [startDate, setStartDate] = useState(new Date());

  function convertToDate(timestamp) {
    var new_date = timestamp * 1000;
    const dateObject = new Date(new_date);
    return dateObject;
  }

  function getDate(linkString) {
    var timestamp = linkString.substring(58, 68);
    var date = convertToDate(timestamp);
    return date;
  }

  function convertTo12Hour(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;

  }

  return (
    <div className="App">
      <div className="content">
        <div className="Calender">
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </div>

        {items.filter(item => (getDate(item.link).toString().substring(0, 15) === startDate.toString().substring(0, 15))).map((item) => (
          <div>
            <h2>{convertTo12Hour(getDate(item.link))}</h2>
            <UserList url={item.link} _date={startDate} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
