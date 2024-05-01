/* import { useEffect, useState } from "react";

const Categories = ({match}) => {
  let currentCategory = match.params.category;
  const [services, setService] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('newest')
}

  useEffect(() => {
    setLoading(true);
    setQuery("");
    getAll(currentCategory)
      .then(res => {
        setService(res.services);
        setLoading(false);
        setQuery("");
      })
      .catch(err => console.log(err));
  }, [currentCategory, setService]);

  useEffect(() => {
    setLoading(true);
    getAll(2, currentCategory, query)
      .then(res => {
        if(query === "") {
          setService(services => [...services, ...res.services]);
        } else {
          setService(res.services);
        }
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, [query, currentCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  return (
    <>
      <div id="divider">
        <input 
        className="search-input" 
        type="text" placeholder="Search" name="search" 
        value={query} 
        onChange={handleSearch} />
      </div>
      <CategoriesNav />
      <div className="container">
        <div className="sort-options">
          <span className="sort-label">Sort</span>
          <div className="sort-icons">
            <button></button>
          </div>
        </div>
      </div>
    </>
  )

export default Categories; */