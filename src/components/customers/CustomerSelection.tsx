import { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import type { Customer } from '../../types';
import './CustomerSelection.css';

const CustomerSelection: React.FC = () => {
  const { customers, activeCustomerId, setActiveCustomerId } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      setFilteredCustomers(
        customers.filter(
          customer =>
            customer.name.toLowerCase().includes(lowerCaseSearch) ||
            customer.phone.includes(searchTerm) ||
            customer.email.toLowerCase().includes(lowerCaseSearch)
        )
      );
    }
  }, [searchTerm, customers]);

  // Handle customer selection
  const handleSelectCustomer = (customerId: number) => {
    setActiveCustomerId(customerId);
  };

  return (
    <div className="customer-selection">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="customer-list">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className={`customer-item ${activeCustomerId === customer.id ? 'selected' : ''}`}
              onClick={() => handleSelectCustomer(customer.id)}
            >
              <h3>{customer.name}</h3>
              <p>{customer.phone}</p>
              <p>{customer.email}</p>
              <p className="customer-address">{customer.address}</p>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSelection;
