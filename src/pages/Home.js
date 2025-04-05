import React, { useState, useEffect } from "react";
import ButtonReload from "../components/ReloadButton";
import Card from "../components/Card";
import Header from "../components/Header";
import Footer from "../components/Footer"; 
import "./Home.css";

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  // State
  const [data, setData] = useState("");
  const [a, setA] = useState(0);
  const [ischecked, setCheck] = useState(true);





  // Fetch data
  async function fetchData(e) {
    console.log(e);
    try {
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      console.log("Fetching data... now:", timeStr);

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
      setA(prev => prev + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Checkbox toggle
  const checkboxScript = () => {
    setCheck(!ischecked);
  };

  // Auto-fetch effect
  useEffect(() => {
    fetchData("initial");
    const intervalId = setInterval(() => {
      if (ischecked) {
        fetchData("auto");
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [ischecked]);

  return (
    <div>
      <Header />
      <div className="eaderPage1">
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
        <ButtonReload onReload={fetchData} reloadParams={["button"]} buttontext="reload me" />
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
        <Footer />

    </div>
  );
};

export default Home;
