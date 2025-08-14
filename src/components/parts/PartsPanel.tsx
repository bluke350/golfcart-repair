import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import type { Part } from '../../types';
import './PartsPanel.css';

const PartsPanel: React.FC = () => {
  const { parts, setParts, addItemToBill, activeCustomerId } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const [newPart, setNewPart] = useState<Partial<Part>>({
    name: '',
    cost: 0,
    marketPrice: 0,
    markup: 0,
    quantityOnHand: 0,
    supplier: '',
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cost' || name === 'marketPrice' || name === 'quantityOnHand') {
      const numValue = parseFloat(value);
      const updatedValues: Partial<Part> = { ...newPart, [name]: numValue };
      
      // If cost or marketPrice change, update markup
      if (name === 'cost' && numValue > 0 && newPart.marketPrice) {
        const markup = ((newPart.marketPrice - numValue) / numValue) * 100;
        updatedValues.markup = parseFloat(markup.toFixed(2));
      } else if (name === 'marketPrice' && numValue > 0 && newPart.cost && newPart.cost > 0) {
        const markup = ((numValue - newPart.cost) / newPart.cost) * 100;
        updatedValues.markup = parseFloat(markup.toFixed(2));
      }
      
      setNewPart(updatedValues);
    } else {
      setNewPart(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle add new part
  const handleAddPart = () => {
    if (!newPart.name || !newPart.cost || !newPart.marketPrice) {
      alert('Name, cost, and market price are required');
      return;
    }

    if (newPart.cost && newPart.marketPrice) {
      // Calculate markup if not set
      if (!newPart.markup) {
        const markup = ((newPart.marketPrice - newPart.cost) / newPart.cost) * 100;
        newPart.markup = parseFloat(markup.toFixed(2));
      }
    }

    const part: Part = {
      id: Date.now(),
      name: newPart.name,
      cost: newPart.cost || 0,
      marketPrice: newPart.marketPrice || 0,
      markup: newPart.markup || 0,
      quantityOnHand: newPart.quantityOnHand || 0,
      supplier: newPart.supplier || '',
    };

    setParts(prev => [...prev, part]);
    setNewPart({
      name: '',
      cost: 0,
      marketPrice: 0,
      markup: 0,
      quantityOnHand: 0,
      supplier: '',
    });
    setIsAdding(false);
  };

  // Add part to bill
  const handleAddToBill = (part: Part) => {
    if (!activeCustomerId) {
      alert('Please select a customer first');
      return;
    }
    addItemToBill('part', part);
  };

  return (
    <div className="parts-panel">
      <div className="panel-header">
        <h2>Manage Parts</h2>
        <button className="btn" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Part'}
        </button>
      </div>

      {isAdding && (
        <div className="add-part-form">
          <h3>Add New Part</h3>
          <div className="form-group">
            <label className="form-label">Part Name*</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={newPart.name}
              onChange={handleInputChange}
              placeholder="Battery, Lift Kit, etc."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cost ($)*</label>
              <input
                type="number"
                className="form-control"
                name="cost"
                value={newPart.cost}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Market Price ($)*</label>
              <input
                type="number"
                className="form-control"
                name="marketPrice"
                value={newPart.marketPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Markup (%)</label>
              <input
                type="number"
                className="form-control"
                name="markup"
                value={newPart.markup}
                readOnly
                disabled
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity On Hand</label>
              <input
                type="number"
                className="form-control"
                name="quantityOnHand"
                value={newPart.quantityOnHand}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Supplier</label>
              <input
                type="text"
                className="form-control"
                name="supplier"
                value={newPart.supplier}
                onChange={handleInputChange}
                placeholder="Supplier name"
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-success" onClick={handleAddPart}>
              Save Part
            </button>
          </div>
        </div>
      )}

      <div className="parts-list">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Price</th>
              <th>Markup</th>
              <th>On Hand</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(part => (
              <tr key={part.id}>
                <td>{part.name}</td>
                <td>${part.cost.toFixed(2)}</td>
                <td>${part.marketPrice.toFixed(2)}</td>
                <td>{part.markup.toFixed(2)}%</td>
                <td>{part.quantityOnHand}</td>
                <td>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => handleAddToBill(part)}
                    disabled={!activeCustomerId}
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
            <p>Select a customer to add parts to their bill</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartsPanel;
