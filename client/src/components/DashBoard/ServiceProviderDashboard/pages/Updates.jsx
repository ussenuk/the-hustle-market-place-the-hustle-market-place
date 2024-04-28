import React from "react";
import "./update.css";
import { UpdatesData } from "./UpdateData";

const Updates = () => {
  return (
    <div className="Updates">
    <h3 className="title">Updates:</h3>
      {UpdatesData.map((update) => {
        return (
          <div className="update">
            <img src={update.img} alt="profile" />
            <div className="noti">
              <div  style={{marginBottom: '0.5rem'}}>
                <span>{update.name}</span>
                <span> {update.noti}</span>
              </div>
                <span>{update.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Updates;