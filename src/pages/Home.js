import React, { useState, useEffect } from "react";
import ButtonReload from "../components/ReloadButton";
import Card from "../components/Card";
import Header from "../components/Header";
import Footer from "../components/Footer"; 
import "./Home.css";


const API_URL = process.env.REACT_APP_API_URL;
const API_URL_Generate =process.env.REACT_APP_API_URL2;
var eazjo="";

async function generateSignature2(playerId, timestamp, nonce) {
  const message = `${playerId}${timestamp}${nonce}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(eazjo);
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
  var [isstartup,setstartup]=useState(false);




 


  async function load_server_keys() {
  const privateKeyStr  = `-----BEGIN RSA PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCwHDHBwuJhpFgrH3YwQHQkLpUoLTj8CINDVOutduQn/zMw0dGuNeWJbKGQR6cPlpnciyvXSRtl45YGoVpYu/g7NW5RYezNhogqcdIZNCOeOcrhpvfodJ9jQ0YRFTJqxt5ttHku39PsHWRps29j7ocgC5gC+//cyJUH+wM8Ay+IucpA8bfqueTA0Bu/1kApE79VX5MxMhvwvlMx4XJcVC2GMHrHlYez6zNeuufxQTSTakekC81K8dieVah66XibVJY4MIVfpU+Xq2f5NDJZ0xsouQufg8nCnDc2U/2hP05tlm9REWCJOqngg+378W0jzWoLSJL21UQt0uUGqM8cPwDjAgMBAAECggEAUxFRdOwYPOc4gUqrRFI6lhB04YkHLnZTd/B35A/GyYjp2/a0GSCp/trDEFuD1On79BefG8KLjlE9pC36gA1VppPqz69Jc54n3yFl8OZzgIARDsPjfn136unCBG/DorLgGs38NRx1iRNKGEN/YJsTmI1va8TyqHDiPuvq2CVGiA4UWDuS6Q/sZONjXo6CdjzqIgFLxAdOa0ilMjljrKb1NMrsZHKvkAc3HAXbgOIWBtL8S73zdqZed+HUgiabzdsXk8XMaaY720DL0tISav1tgTlIK3DNtN4+siEXdKgvLwikfIRBG5uMsmga6Zfo7lngSNHgT+Hh5tpw6NUkuQB+wQKBgQC5rKKECCdNt70xuMZEXQQjOgDg8B8hO1o9e9Z7izasaltwvI3nIxc3TIp5P8EcWJWAesOSv8pIY3fh5DvpD5XQmKgvlp5VP40PfXkZeQnXOJX1O7mWuyaTg9Pox/Cdp+6zSWtqRQIGllq7ziukWqJiDeJXc0Y5qU8QmpJi3O6CwQKBgQDy0DFyP08+5LyaVfPSiGT0inp6cWER0TIC4VRGwupmlufdlMMMa+LrSWftFSu/uhAeHU8s1CPn+l40iHuMqxqOQ0t/hA/2laTsK15eMGat1OBXBkv34KYikNm3A5IPtF6AZebIrrTysUdmYRPcjSuwPxHga4ltlRiACUXkP5HAowKBgH7ARjVB56rbarF9xQO4R/HQT/c+lNG31dOxLWsrTwiGlqOwZGLMhrW+b610A11Zb73EkKwmd23RUW6IwwlIFWrQO8g41x+1AZP4gOoNwdUFkQFXY0ttuVjsnoYDr9PAZ2hHD6f9MfPTQl+A0DQjl0S+26v9Soxkc1APZS1OSxhBAoGBAI2djWkzsXVeFP3yqX0d3bueVGa7X8DzgLabUvreTbW9x8e9LrE87yEJNBrbYSO2UhYuQ/JCXBq9NFpxS5W0aY2VhCAAFwtbJdA0TxqiIhC6eolm+8G7fUnlr4UFCRgtu3wpcpuTAagWay0z61CT6Womrrd0ILgP4DU0s1W3Gbv/AoGBALQmB0Ri0iPlhrCEc1LD6siSpevxaixdw1ygXt9c7gDBLI4NmskR5uEHHfIbthFdZV0sbO6iEuQOR6c8/QaTbw8q36fVXc4MZQrg4W4/s5lO5q2rtO5y373d+qtRnQ5shc2P7FN0Sxm9hkl+r6OuS5QASLFItcqswlR8x60q5+0a
-----END RSA PRIVATE KEY-----`;

  const publicKeyStr  = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsBwxwcLiYaRYKx92MEB0JC6VKC04/AiDQ1TrrXbkJ/8zMNHRrjXliWyhkEenD5aZ3Isr10kbZeOWBqFaWLv4OzVuUWHszYaIKnHSGTQjnjnK4ab36HSfY0NGERUyasbebbR5Lt/T7B1kabNvY+6HIAuYAvv/3MiVB/sDPAMviLnKQPG36rnkwNAbv9ZAKRO/VV+TMTIb8L5TMeFyXFQthjB6x5WHs+szXrrn8UE0k2pHpAvNSvHYnlWoeul4m1SWODCFX6VPl6tn+TQyWdMbKLkLn4PJwpw3NlP9oT9ObZZvURFgiTqp4IPt+/FtI81qC0iS9tVELdLlBqjPHD8A4wIDAQAB
-----END PUBLIC KEY-----`;   // Remove the PEM header and footer
const privateKeyPem = privateKeyStr.replace('-----BEGIN RSA PRIVATE KEY-----', '').replace('-----END RSA PRIVATE KEY-----', '').replace(/\n/g, '');
const publicKeyPem = publicKeyStr.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\n/g, '');

const privateKey = await crypto.subtle.importKey(
    "pkcs8", // Private key format
    str2ab(atob(privateKeyPem)),
    {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" }
    },
    false,
    ["decrypt"]
);

const publicKey = await crypto.subtle.importKey(
    "spki", // Public key format
    str2ab(atob(publicKeyPem)),
    {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" }
    },
    false,
    ["encrypt"]
);

return { privateKey, publicKey };
}

// Helper function to convert base64 string to ArrayBuffer
function str2ab(str) {
const buf = new ArrayBuffer(str.length);
const view = new Uint8Array(buf);
for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
}
return buf;
}
// ---- Client Side ----

async function client_generate_keypair() {
  // Generate the elliptic curve key pair using ECDSA (or ECDH if needed)
  const keyPair = await crypto.subtle.generateKey(
      {
          name: "ECDSA",
          namedCurve: "P-256"  // Use P-256 curve (prime256v1)
      },
      true,  // Can be used for signing and verification
      ["sign", "verify"]  // Can be used for these operations
  );

  return { 
      client_private_key: keyPair.privateKey, 
      client_public_key: keyPair.publicKey 
  };
}



async function establishAESKeyServer(serverPrivateKey, encryptedPreMasterSecret) {
  try {
    // Decrypt the pre-master secret that was encrypted with the server's public key
    const preMasterSecret = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      serverPrivateKey,
      encryptedPreMasterSecret
    );
    
    // Derive the same AES key from the pre-master secret
    const aesKey = await window.crypto.subtle.importKey(
      "raw",
      preMasterSecret,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["encrypt", "decrypt"]
    );
    
    return {
      aesKey
      // Note: The IV is typically sent separately with each encrypted message
      // so we don't return it here, as it would be provided with the ciphertext
    };
  } catch (error) {
    console.error("Error establishing server AES key:", error);
    throw error;
  }
}
async function establishAESKey(clientPrivateKey, serverPublicKeyObj) {
  try {
    // Make sure the server public key is properly imported as a CryptoKey
    // This step ensures we have a valid CryptoKey object
    let serverPublicKey;
    
    // Check if it's already a CryptoKey object
    if (serverPublicKeyObj instanceof CryptoKey) {
      serverPublicKey = serverPublicKeyObj;
    } else {
      console.error("Server public key is not a valid CryptoKey object");
      throw new Error("Invalid server public key format");
    }
    
    // Ensure the key is usable for encryption
    if (!serverPublicKey.usages.includes("encrypt")) {
      console.error("Server public key doesn't have 'encrypt' usage rights");
      console.log("Key usages:", serverPublicKey.usages);
      throw new Error("Server public key cannot be used for encryption");
    }
    
    // Generate a random 32-byte value to use as our pre-master secret
    const preMasterSecret = window.crypto.getRandomValues(new Uint8Array(32));
    
    // Encrypt the pre-master secret with the server's RSA public key
    const encryptedPreMasterSecret = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      serverPublicKey,
      preMasterSecret
    );
    
    // Now derive an AES key from the pre-master secret
    const aesKey = await window.crypto.subtle.importKey(
      "raw",
      preMasterSecret,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["encrypt", "decrypt"]
    );
    
    // Generate a random IV for AES-GCM
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    return {
      aesKey,
      iv,
      encryptedPreMasterSecret
    };
  } catch (error) {
    console.error("Error establishing AES key:", error);
    throw error;
  }
}


/**
 * Encrypts data using the AES-GCM algorithm with the established AES key
 * @param {CryptoKey} aesKey - The AES key to use for encryption
 * @param {Uint8Array} iv - The initialization vector
 * @param {string|ArrayBuffer} data - The data to encrypt
 * @returns {Promise<{ciphertext: ArrayBuffer, iv: Uint8Array}>} - The encrypted data and IV
 */
async function encryptWithAES(aesKey, iv, data) {
  try {
    // Convert string data to ArrayBuffer if necessary
    let dataBuffer;
    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      dataBuffer = encoder.encode(data);
    } else {
      dataBuffer = data;
    }
    
    // Encrypt the data using AES-GCM
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128 // Authentication tag length in bits
      },
      aesKey,
      dataBuffer
    );
    
    return {
      ciphertext,
      iv
    };
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

/**
 * Decrypts data using the AES-GCM algorithm with the established AES key
 * @param {CryptoKey} aesKey - The AES key to use for decryption
 * @param {Uint8Array} iv - The initialization vector used during encryption
 * @param {ArrayBuffer} ciphertext - The encrypted data to decrypt
 * @returns {Promise<ArrayBuffer>} - The decrypted data as ArrayBuffer
 */
async function decryptWithAES(aesKey, iv, ciphertext) {
  try {
    // Decrypt the data using AES-GCM
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128 // Authentication tag length in bits
      },
      aesKey,
      ciphertext
    );
    
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
}


function arrayBufferToString(buffer) {
  return new TextDecoder().decode(buffer);
}


function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray.buffer;
}
function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}



async function AESmainFlow() {
    
  // Load server keys
  const keys = await load_server_keys();
  
  // Generate client key pair
  const { client_private_key, client_public_key } = await client_generate_keypair();
  
  // Validate server public key
  if (!(keys.publicKey instanceof CryptoKey)) {
    console.error("Server public key is not a valid CryptoKey object");
    throw new Error("Invalid server public key");
  }
  
  
  // Establish AES key using the server's public key
  const { aesKey, iv, encryptedPreMasterSecret } = await establishAESKey(
    client_private_key, 
    keys.publicKey
  );
  

  // Encrypt data using AES-GCM
  const dataToEncrypt = "Hello, this is a test message!";

  const { ciphertext } = await encryptWithAES(aesKey, iv, dataToEncrypt);

  //decryt data using AES-GCM
  const decryptedData = await decryptWithAES(aesKey, iv, ciphertext);



  const ciphertextB64 = bufferToBase64(ciphertext);
  const ivB64 = bufferToBase64(iv);
  const encryptedPreMasterSecretB64 = bufferToBase64(encryptedPreMasterSecret);

  const response = await fetch(process.env.REACT_APP_API_URL3 + "/aes", {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
      
      "ciphertext": ciphertextB64,
      "iv": ivB64,
      "encryptedPreMasterSecret": encryptedPreMasterSecretB64,
 
    },
  });










}










  useEffect(() => {
    // Call on startup function here
    if (isstartup==false){
      for (let i = 0; i < process.env.REACT_APP_API_HMAC_Key.length; i++) {
        eazjo += process.env.REACT_APP_API_HMAC_Key[i];
      }
    }
      setstartup(true)
    });

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
    await AESmainFlow()

    try {
      const playerId = "player123"; // Example playerId
      const now = new Date();
      const timestamp = Math.floor(now.getTime() / 1000).toString(); // Get current timestamp in seconds
      const nonce = generateRandomNonce(); // Generate a random nonce

      var signature = await getSignature(playerId, timestamp, nonce); // Generate the signature

      
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      console.log("Fetching data... now:", timeStr);
      console.log(timestamp)

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
