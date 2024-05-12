import React, {useState, useEffect} from 'react'

function UsersList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("fullname");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [confirmDeleteIds, setConfirmDeleteIds] = useState([]);

    useEffect(()=>{
        fetch("/users")
        .then((r) => r.json())
        .then((data) => {
          // Flatten the array of arrays into a single array of users
        const flattenedUsers = data.flat();
        setUsers(flattenedUsers);
        });
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users?.length > 0 ? users
      .filter((user) =>
          user[searchCategory].toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(indexOfFirstUser, indexOfLastUser) : [];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = (userId, userType) => {
      setConfirmDeleteIds([...confirmDeleteIds, userId, userType]);
    };

    const confirmDelete = async (userId, userType) => {
      try {
        const response = await fetch(`/user/${userId}/${userType}`, {
            method: 'DELETE',
        });
          if (response.ok) {
              alert('User deleted successfully');
              setUsers(users.filter((user) => user.id !== userId || user.user_type !== userType));
          } else if (response.status === 404) {
              throw new Error('User not found');
          } else if (response.status === 400) {
              throw new Error('Invalid user type specified');
          } else {
              throw new Error('Failed to delete user');
          }
      } catch (error) {
          console.error('Error deleting user:', error.message);
      }
      setConfirmDeleteIds(confirmDeleteIds.filter((id) => id !== userId)); // Reset confirmDeleteId after deletion
  };

  const cancelDelete = (userId) => {
      setConfirmDeleteIds(confirmDeleteIds.filter((id) => id !== userId)); // Remove the canceled user ID
  };

  const handleSearch = (event) => {
      setSearchTerm(event.target.value);
      setCurrentPage(1);
  };

  const handleSelectChange = (event) => {
      setSearchCategory(event.target.value);
      setCurrentPage(1);
  };

  return (
    <main className='main-container'>
    <section style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <div style={{ textAlign: "center" }}>
          <h2>
            <strong>
              <u>LIST OF ALL USERS</u>
            </strong>
          </h2>
          <input
            type="text"
            placeholder="Enter search term"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select value={searchCategory} onChange={handleSelectChange}>
            <option value="fullname">By Name</option>
          </select>
          <p>Items found: {currentUsers.length}</p>
        </div>

        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                FULLNAME
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                USERNAME
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                LOCATION
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>ROLE</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
          {currentUsers.map((userData, index) => (
            Array.isArray(userData) ? (
              userData.map((user) => (
                <tr key={`${index}-${user.id}`} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.fullname}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.username}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.location}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.service_title || user.user_title}
                  </td>

                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button onClick={() => handleDelete(user.id, user.user_type)}>Delete</button>
                    {confirmDeleteIds.includes(user.id) && (
                      <>
                        <button onClick={() => confirmDelete(user.id, user.user_type)}>
                          Confirm
                        </button>
                        <button onClick={() => cancelDelete(user.id)}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr key={`${index}-${userData.id}`} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {userData.fullname}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {userData.username}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {userData.location}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {userData.service_title || userData.user_title}
                </td>

                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button onClick={() => handleDelete(userData.id, userData.user_type)}>Delete</button>
                  {confirmDeleteIds.includes(userData.id) && (
                    <>
                      <button onClick={() => confirmDelete(userData.id, userData.user_type)}>
                        Confirm
                      </button>
                      <button onClick={() => cancelDelete(userData.id)}>Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            )
          ))}
          
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3>Page</h3>
          {users.length > 0 && (
            [...Array(Math.ceil(users.length / usersPerPage)).keys()].map(
                (number) => (
                    <button key={number} onClick={() => paginate(number + 1)} style={{ padding: "3px 8px", marginLeft: "5px", fontSize: "12px", width: "50px", height: "50px" }}>
                        {number + 1}
                        
                    </button>
                )
            )
        )}
        </div>
      </div>
    </section>
    
    </main>
  )
}

export default UsersList