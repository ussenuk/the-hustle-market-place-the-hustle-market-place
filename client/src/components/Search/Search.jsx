import axios from 'axios';
import React, {useEffect, useState} from 'react';

function Search() {

  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5555/services')
    .then(res => {
      setData(res.data)
      setRecords(res.data);
    })
    .catch(err => console.log(err));
  }, []);

  const Filter = (event) => {
    setRecords(data.filter(f => f.service_title.toLowerCase().includes(event.target.value.toLowerCase())));
  }

  return (
    <div className='p-5 bg-light'>
       <input type="text" placeholder="Search"
        onChange={Filter}
        />
      <div className='bg-white shadow border'>
        {records.map((val, i) => {
          return (
            <div className='p-3 border-bottom' key={i}>
              <h3>{val.service_title}</h3>
              <p>{val.service_category}</p>
              <p>{val.service_price}</p>
            </div>
          )
        })}
          
      </div>

    </div>
  )
}

export default Search