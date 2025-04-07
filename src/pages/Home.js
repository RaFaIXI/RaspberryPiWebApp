import React, { useState, useEffect } from "react";
import ButtonReload from "../components/ReloadButton";
import Card from "../components/Card";
import Header from "../components/Header";
import Footer from "../components/Footer"; 
import "./Home.css";



const API_URL = process.env.REACT_APP_API_URL;
const API_URL_Generate =process.env.REACT_APP_API_URL2;
const SECRET_KEY = process.env.REACT_APP_API_HMAC_Key;


async function generateSignature2(playerId, timestamp, nonce) {
  const message = `${playerId}${timestamp}${nonce}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET_KEY);
  const data = encoder.encode(message);

  try {
    const key = await crypto.subtle.importKey(
      "raw", // The key is raw, meaning it's not in a specific format
      keyData,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false, // The key is not extractable
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
    const signatureArray = new Uint8Array(signatureBuffer);
    return Array.from(signatureArray)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error("Error generating signature:", error);
    return null;
  }
}

function Home () {
  // State
  const [data, setData] = useState("");
  const [a, setA] = useState(0);
  const [ischecked, setCheck] = useState(false);

  // Generate a random nonce 
  function generateRandomNonce() {
    const array = new Uint32Array(7);  // This generates 7 random 32-bit integers.
    window.crypto.getRandomValues(array);  // Fill the array with random values
    return array.join('');  // Convert the array to a string
  };

  // Generate the HMAC signature
  async function getSignature(playerId,timestamp,nonce) {
  const payload = {
    player_id: playerId,
    timestamp: timestamp.toString(),
    nonce: nonce
  };
  try {
    const response = await fetch(API_URL_Generate, {
      method: 'POST',
      headers: {
        "ngrok-skip-browser-warning": "true",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();

      const signature = data.signature;

      if (signature) {
        console.log("Signature received");
        return signature;
      } else {
        console.error("No signature received.");
        return null;
      }
    } else {
      console.error("Failed to fetch signature:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching signature:", error);
    return null;
  }
}

  
  // Fetch data with signature
  async function fetchData(e) {
    console.log(e);
    try {
      const playerId = "player123"; // Example playerId
      const now = new Date();
      const timestamp = Math.floor(now.getTime() / 1000).toString(); // Get current timestamp in seconds
      const nonce = generateRandomNonce(); // Generate a random nonce

      var signature = await getSignature(playerId, timestamp, nonce); // Generate the signature
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      console.log("Fetching data... now:", timeStr);

      var nonce2 = generateRandomNonce(); // Generate a random nonce
      var signature2= await generateSignature2(playerId,timestamp,nonce2)


      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          "player_id": playerId,
          "timestamp": timestamp,
          "nonce": nonce,
          "signature": signature,
          "nonce2": nonce2,
          "signature2": signature2,
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
  }

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
