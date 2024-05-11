import React, { useEffect, useState } from "react";

function HttpCall() {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("/http-call", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => setData(responseData.data));
  });

  return <h3>{data}</h3>;
}

export default HttpCall;