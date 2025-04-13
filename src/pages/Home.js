import React, { useState, useEffect } from "react";
import ButtonReload from "../components/ReloadButton";
import Card from "../components/Card";
import Header from "../components/Header";
import Footer from "../components/Footer"; 
import "./Home.css";
import { Paillier } from 'paillier-bigint';
import bigInt from "big-integer";
import {Buffer} from 'buffer';
const forge = require('node-forge');


const API_URL = process.env.REACT_APP_API_URL;
const API_URL_Generate =process.env.REACT_APP_API_URL2;
var eazjo="";
const HomomorphicNumberEncryptedKey = process.env.REACT_APP_API_HomomorphicNumberEncryptedKey;
const RSAprivate_key_str = process.env.REACT_APP_RSA_PRIVATE_KEY;
const RSApublicKeyStr  = process.env.REACT_APP_RSA_PUBLIC_KEY;
const HOMOMORPHICpublic_key_str = process.env.REACT_APP_HOMOMORPHIC_PUBLIC_KEY;
const HOMOMORPHICprivate_key_str = process.env.REACT_APP_HOMOMORPHIC_PRIVATE_KEY;



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




 


  async function load_server_keys(privateKeyStr,publicKeyStr) {

 
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



















  useEffect(() => {
    // Call on startup function here
    if (!eazjo) {

    if (isstartup==false){
      for (let i = 0; i < process.env.REACT_APP_API_HMAC_Key.length; i++) {
        eazjo += process.env.REACT_APP_API_HMAC_Key[i];
      }
    }
      setstartup(true)
    }
    });
  
    // called only once when the component mounts

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


  function string_to_private_key(private_key_str) {
    const lines = private_key_str.split("\n");
    const p_line = lines.find((line) => line.trim().startsWith("p:")) || null;
    const q_line = lines.find((line) => line.trim().startsWith("q:")) || null;

    if (p_line && q_line) {
      const p = bigInt(p_line.split(":")[1].trim());
      const q = bigInt(q_line.split(":")[1].trim());
      const n = p.multiply(q);
      return { p, q, n };
    } else {
      throw new Error("Invalid private key string format.");
    }
  }

  function string_to_public_key(public_key_str) {
    const lines = public_key_str.split("\n");
    const n_line = lines.find((line) => line.trim().startsWith("n:")) || null;
    const g_line = lines.find((line) => line.trim().startsWith("g:")) || null;

    if (n_line && g_line) {
      const n = bigInt(n_line.split(":")[1].trim());
      const g = bigInt(g_line.split(":")[1].trim());
      return { n, g };
    } else {
      throw new Error("Invalid public key string format.");
    }
  }

  function encrypt_message(message, public_key) {
    const { n, g } = public_key;
    const r = bigInt.randBetween(1, n.minus(1)); // Random value
    const ciphertext = g
      .modPow(bigInt(message), n.multiply(n))
      .multiply(r.modPow(n, n.multiply(n)))
      .mod(n.multiply(n));
    return ciphertext;
  }

  function L(u, n) {
    return u.subtract(1).divide(n);
  }
  
  function decrypt_message(ciphertext, private_key) {
    const { p, q, n } = private_key;
    const nsquare = n.multiply(n);
  
    // Step 1: λ = lcm(p-1, q-1)
    const lambda = bigInt.lcm(p.subtract(1), q.subtract(1));
  
    // Step 2: u = g^λ mod n^2
    const g = n.add(1); // Assuming g = n + 1, common in simplified Paillier
    const u = g.modPow(lambda, nsquare);
  
    // Step 3: L(u)
    const l_u = L(u, n);
  
    // Step 4: μ = (L(u))^-1 mod n
    const mu = l_u.modInv(n);
  
    // Step 5: Decrypt
    const c_lambda = ciphertext.modPow(lambda, nsquare);
    const l_c = L(c_lambda, n);
    return l_c.multiply(mu).mod(n);
  }
  







  function RSAdecrypt_messages(encryptedBase64, privateKeyPem) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encryptedBytes = forge.util.decode64(encryptedBase64);
  
    try {
      return privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');
    } catch (e1) {
      console.warn("PKCS1 decryption failed, trying OAEP...");
      try {
        return privateKey.decrypt(encryptedBytes, 'RSA-OAEP');
      } catch (e2) {
        throw new Error("Both PKCS1 and OAEP decryption failed. Possibly wrong key or corrupted message.");
      }
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
      console.log(timestamp)

      var nonce2 = generateRandomNonce(); // Generate a random nonce
      var signature2= await generateSignature2(playerId,timestamp,nonce2)





        // Load server keys
  const keys = await load_server_keys(RSAprivate_key_str,RSApublicKeyStr);
  
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
  const dataToEncrypt = process.env.REACT_APP_API_AES_Key+"sosis";

  const { ciphertext } = await encryptWithAES(aesKey, iv, dataToEncrypt);

  //decryt data using AES-GCM
  const decryptedData = await decryptWithAES(aesKey, iv, ciphertext);



  const ciphertextB64 = bufferToBase64(ciphertext);
  const ivB64 = bufferToBase64(iv);
  const encryptedPreMasterSecretB64 = bufferToBase64(encryptedPreMasterSecret);




  const public_key = string_to_public_key(HOMOMORPHICpublic_key_str);
  const private_key = string_to_private_key(HOMOMORPHICprivate_key_str);


  const encrypted = encrypt_message(HomomorphicNumberEncryptedKey, public_key);



      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          "player_id": playerId,
          "timestamp": timestamp,
          "encryptedHomomorphic": encrypted.toString(),
          "nonce": nonce,
          "signature": signature,
          "nonce2": nonce2,
          "signature2": signature2,
          "ciphertext": ciphertextB64,
          "iv": ivB64,
          "encryptedPreMasterSecret": encryptedPreMasterSecretB64,
     
        },
      });

      const text = await response.text();
      console.log("Raw API Response:", text);
      const result = JSON.parse(text);
      
      //decrypt the data using RSA
      const r2=await RSAdecrypt_messages(result.encrypted_usage_data, RSAprivate_key_str)
      const fixedJson = r2.replace(/'/g, '"');

      // now parse the fixed string
      const systemUsage = JSON.parse(fixedJson);




      setData(systemUsage);
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
