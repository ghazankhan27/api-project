import { useEffect, useState } from "react";

function UserList({ url }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("ASC");

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...items].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setItems(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...items].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setItems(sorted);
      setOrder("ASC");
    }
  };

  const sortingNum = (col) => {
    if (order === "ASC") {
      const sorted = [...items].sort((a, b) => (a[col] > b[col] ? 1 : -1));
      setItems(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...items].sort((a, b) => (a[col] < b[col] ? 1 : -1));
      setItems(sorted);
      setOrder("ASC");
    }
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    var u = url;
    fetch(u)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [url]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="UserTable">
        <table>
          <thead>
            <tr>
              <th onClick={() => sorting("Symbol")}>Symbol</th>
              <th onClick={() => sortingNum("Call")}>Call</th>
              <th onClick={() => sortingNum("Put")}>Put</th>
              <th onClick={() => sortingNum("TotalCount")}>TotalCount</th>
              <th onClick={() => sortingNum("Percentage")}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {items
              .filter(
                (item) => !item.Symbol.includes("Downloaded from Barchart.com")
              )
              .map((item) => (
                <tr>
                  <td>{item.Symbol}</td>
                  <td>{item.Call}</td>
                  <td>{item.Put}</td>
                  <td>{item.TotalCount}</td>
                  <td>{item.Percentage}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default UserList;
