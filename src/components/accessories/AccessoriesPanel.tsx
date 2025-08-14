import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import type { Accessory } from '../../types';
import './AccessoriesPanel.css';

const AccessoriesPanel: React.FC = () => {
  const { accessories, setAccessories, addItemToBill, activeCustomerId } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const [newAccessory, setNewAccessory] = useState<Partial<Accessory>>({
    name: '',
    salesPoint: '',
    price: 0,
    quantityOnHand: 0,
  });

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'quantityOnHand') {
      setNewAccessory(prev => ({ 
        ...prev, 
        [name]: name === 'price' ? parseFloat(value) : parseInt(value, 10) 
      }));
    } else {
      setNewAccessory(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle add new accessory
  const handleAddAccessory = () => {
    if (!newAccessory.name || !newAccessory.price) {
      alert('Name and price are required');
      return;
    }

    const accessory: Accessory = {
      id: Date.now(),
      name: newAccessory.name,
      salesPoint: newAccessory.salesPoint || '',
      price: newAccessory.price || 0,
      quantityOnHand: newAccessory.quantityOnHand || 0,
    };

    setAccessories(prev => [...prev, accessory]);
    setNewAccessory({
      name: '',
      salesPoint: '',
      price: 0,
      quantityOnHand: 0,
    });
    setIsAdding(false);
  };

  // Add accessory to bill
  const handleAddToBill = (accessory: Accessory) => {
    if (!activeCustomerId) {
      alert('Please select a customer first');
      return;
    }
    addItemToBill('accessory', accessory);
  };

  return (
    <div className="accessories-panel">
      <div className="panel-header">
        <h2>Manage Accessories</h2>
        <button className="btn" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Accessory'}
        </button>
      </div>

      {isAdding && (
        <div className="add-accessory-form">
          <h3>Add New Accessory</h3>
          <div className="form-group">
            <label className="form-label">Accessory Name*</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={newAccessory.name}
              onChange={handleInputChange}
              placeholder="Cup Holder, Phone Mount, etc."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Sales Point</label>
            <textarea
              className="form-control"
              name="salesPoint"
              value={newAccessory.salesPoint}
              onChange={handleInputChange}
              placeholder="Why customers should buy this (e.g., 'Keeps drinks secure while driving')"
              rows={2}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price ($)*</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={newAccessory.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity On Hand</label>
              <input
                type="number"
                className="form-control"
                name="quantityOnHand"
                value={newAccessory.quantityOnHand}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-success" onClick={handleAddAccessory}>
              Save Accessory
            </button>
          </div>
        </div>
      )}

      <div className="accessories-list">
        <div className="accessory-cards">
          {accessories.map(accessory => (
            <div key={accessory.id} className="accessory-card">
              <div className="accessory-content">
                <h3 className="accessory-name">{accessory.name}</h3>
                <p className="accessory-price">${accessory.price.toFixed(2)}</p>
                <p className="accessory-sales-point">{accessory.salesPoint}</p>
                <div className="accessory-inventory">
                  <span className="label">In stock:</span>
                  <span className="value">{accessory.quantityOnHand}</span>
                </div>
              </div>
              <div className="accessory-actions">
                <button 
                  className="btn" 
                  onClick={() => handleAddToBill(accessory)}
                  disabled={!activeCustomerId}
                >
                  Add to Bill
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {!activeCustomerId && (
          <div className="customer-alert">
            <p>Select a customer to add accessories to their bill</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoriesPanel;
