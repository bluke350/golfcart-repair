import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import type { Customer } from '../../types';
import './CustomersPanel.css';

const CustomersPanel: React.FC = () => {
  const { customers, setCustomers } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  // Handle add new customer
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Name and phone are required');
      return;
    }

    const customer: Customer = {
      id: Date.now(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email || '',
      address: newCustomer.address || '',
    };

    setCustomers(prev => [...prev, customer]);
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
    });
    setIsAdding(false);
  };

  return (
    <div className="customers-panel">
      <div className="panel-header">
        <h2>Manage Customers</h2>
        <button className="btn" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {isAdding && (
        <div className="add-customer-form">
          <h3>Add New Customer</h3>
          <div className="form-group">
            <label className="form-label">Name*</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              placeholder="Full Name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone*</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={newCustomer.phone}
              onChange={handleInputChange}
              placeholder="555-123-4567"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={newCustomer.address}
              onChange={handleInputChange}
              placeholder="123 Main St, City, ST"
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-success" onClick={handleAddCustomer}>
              Save Customer
            </button>
          </div>
        </div>
      )}

      <div className="customers-list">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPanel;
