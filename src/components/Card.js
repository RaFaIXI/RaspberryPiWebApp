import React, { useState } from "react";
import "./Card.css";

function Card({title,value}){
    var a="";
    if (title=="Disk Usage : "){
        a="disk-usage";
    }
    if (title=="CPU Temperature : "){
        a="cpu-temp";
    }
    if (title=="CPU Usage : "){
        a="cpu-usage";
    }
    if (title=="RAM Usage : "){
        a="ram-usage";
    }


    return (
        <div className="stat-card">
        <div className={"stat-icon "+a}></div>    
          <div className="stat-info">
            <h2>{title}</h2>
            <div className="stat-value">{value}
            </div>
          </div>
        </div>
      );



}

export default Card;