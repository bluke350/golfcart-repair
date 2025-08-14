import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import type { InventoryItem } from '../../types';
import './InventoryPanel.css';

const InventoryPanel: React.FC = () => {
  const { inventoryItems, setInventoryItems, addItemToBill, activeCustomerId } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    type: 'cart',
    price: 0,
    forSale: true,
    quantityOnHand: 1,
  });

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const { type } = e.target;
    
    if (name === 'price' || name === 'quantityOnHand') {
      setNewItem(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseFloat(value) : parseInt(value, 10) 
      }));
    } else if (name === 'forSale') {
      setNewItem(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setNewItem(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle add new item
  const handleAddItem = () => {
    if (!newItem.name || !newItem.type || !newItem.price) {
      alert('Name, type, and price are required');
      return;
    }

    const item: InventoryItem = {
      id: Date.now(),
      name: newItem.name,
      type: newItem.type || 'cart',
      price: newItem.price || 0,
      forSale: newItem.forSale === undefined ? true : newItem.forSale,
      quantityOnHand: newItem.quantityOnHand || 1,
    };

    setInventoryItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      type: 'cart',
      price: 0,
      forSale: true,
      quantityOnHand: 1,
    });
    setIsAdding(false);
  };

  // Add inventory item to bill
  const handleAddToBill = (item: InventoryItem) => {
    if (!activeCustomerId) {
      alert('Please select a customer first');
      return;
    }
    addItemToBill('inventory', item);
  };

  return (
    <div className="inventory-panel">
      <div className="panel-header">
        <h2>Manage Inventory</h2>
        <button className="btn" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Inventory Item'}
        </button>
      </div>

      {isAdding && (
        <div className="add-inventory-form">
          <h3>Add New Inventory Item</h3>
          <div className="form-row">
            <div className="form-group flex-2">
              <label className="form-label">Item Name*</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="2019 E-Z-GO TXT, Premium Wheels, etc."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type*</label>
              <select
                className="form-control"
                name="type"
                value={newItem.type}
                onChange={handleInputChange}
              >
                <option value="cart">Cart</option>
                <option value="part">Part</option>
                <option value="accessory">Accessory</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price ($)*</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={newItem.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantityOnHand"
                value={newItem.quantityOnHand}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="form-group form-group-checkbox">
              <label className="form-label">
                <input
                  type="checkbox"
                  name="forSale"
                  checked={newItem.forSale}
                  onChange={handleInputChange}
                />
                For Sale
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-success" onClick={handleAddItem}>
              Save Item
            </button>
          </div>
        </div>
      )}

      <div className="inventory-list">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantityOnHand}</td>
                <td>{item.forSale ? 'For Sale' : 'Not For Sale'}</td>
                <td>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => handleAddToBill(item)}
                    disabled={!activeCustomerId || !item.forSale}
                  >
                    Add to Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!activeCustomerId && (
          <div className="customer-alert">
            <p>Select a customer to add inventory items to their bill</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPanel;
