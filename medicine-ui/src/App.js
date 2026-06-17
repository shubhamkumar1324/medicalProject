import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    notes: "",
    expiryDate: "",
    quantity: "",
    price: "",
    brand: ""
  });

  const apiUrl = "http://localhost:5020/api/medicines";

  const loadMedicines = async () => {
    const response = await axios.get(apiUrl);
    setMedicines(response.data);
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addMedicine = async (e) => {
    e.preventDefault();

    await axios.post(apiUrl, form);

    setForm({
      fullName: "",
      notes: "",
      expiryDate: "",
      quantity: "",
      price: "",
      brand: ""
    });

    loadMedicines();
  };

  const filtered = medicines.filter((m) =>
    m.fullName.toLowerCase()
      .includes(search.toLowerCase())
  );

  const getRowClass = (medicine) => {
  const expiryDate = new Date(medicine.expiryDate);
  const today = new Date();

  const diffDays = Math.ceil(
    (expiryDate - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays >= 0 && diffDays < 30) {
    return "expiry-warning";
  }

  if (medicine.quantity < 10) {
    return "stock-warning";
  }

  return "";
};

  return (
    <div className="container mt-4">

      <h2>Medicine Inventory</h2>

      <input
        className="form-control mb-3"
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form onSubmit={addMedicine}>
        <div className="row">

          <div className="col-md-4">
            <input
              className="form-control"
              name="fullName"
              placeholder="Medicine Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mt-2">
            <input
              type="number"
              className="form-control"
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mt-2">
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mt-2">
            <input
              className="form-control"
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-12 mt-3">
            <button
              className="btn btn-primary"
              type="submit">
              Add Medicine
            </button>
          </div>
        </div>
      </form>

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Expiry Date</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((m) => (
            <tr key={m.id} className={getRowClass(m)}>
              <td>{m.fullName}</td>
              <td>{m.brand}</td>
              <td>{m.expiryDate}</td>
              <td>{m.quantity}</td>
              <td>{m.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default App;