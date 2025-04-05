import { useState, useEffect } from "react";
import ButtonReload from "./components/ReloadButton";
import Card from "./components/Card";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;


function App() {
  //states état et donnés
  let [data, setData] = useState("");
  let [a, setA] = useState(0);
  let [ischecked, setCheck] = useState(true);

  //comportements

  // Fetch data function
  async function fetchData(e) {
    console.log(e);
    try {
      var hours = new Date().getHours();
      var minutes = new Date().getMinutes();
      var sec = new Date().getSeconds();
      if (minutes.toString().length == 1) {
        minutes = "0" + minutes.toString();
      }
      if (sec.toString().length == 1) {
        sec = "0" + sec.toString();
      }
      console.log(
        "Fetching data... now : " + hours + ":" + minutes + ":" + sec
      );

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      const text = await response.text();
      console.log("Raw API Response:", text);
      const result = JSON.parse(text);
      setData(result);
      setA((prevA) => prevA + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Toggle checkbox state
  const checkboxScript = () => {
    setCheck(!ischecked);
  };

  // Setup interval for auto-fetch
  useEffect(() => {
    // Initial fetch
    fetchData("initial");

    // Setup interval
    const intervalId = setInterval(() => {
      // Only fetch if checkbox is checked
      if (ischecked) {
        fetchData("auto");
      }
    }, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [ischecked]); // Re-run when checkbox state changes

  //render en jsx (html sur un fichier javascript)
  return (
    <div>
      <div className="header">
      <h1>API Data</h1>
      </div>

      <div className="gray-background">
      <div className="stats-grid">

      <Card title="CPU Temperature : " value={data.cpu_temp} />
      <Card title="CPU Usage : " value={data.cpu_usage} />
      <Card title="Disk Usage : " value={data.disk_usage} />
      <Card title="RAM Usage : " value={data.ram_usage} />
      </div>
    </div>
      <h2>Reloads : {a}</h2>
      <div className="button-container">
      <ButtonReload onReload={fetchData} buttontext="reload me" />
      </div>
      <h4>
        auto reload :{" "}
        <input
          onClick={checkboxScript}
          type="checkbox"
          id="reloadOn?"
          checked={ischecked}
        />
      </h4>
    </div>
  );
}

export default App;
