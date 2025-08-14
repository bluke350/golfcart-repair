import { useShop } from '../../context/ShopContext';
import './BillView.css';

const BillView: React.FC = () => {
  const { 
    activeCustomerId, 
    activeBillItems, 
    removeItemFromBill,
    clearBillItems,
    createBill,
    getCustomerById
  } = useShop();

  const activeCustomer = getCustomerById(activeCustomerId);
  const total = activeBillItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle remove item
  const handleRemoveItem = (itemId: number) => {
    removeItemFromBill(itemId);
  };

  // Handle clear all items
  const handleClearItems = () => {
    clearBillItems();
  };

  // Handle create bill
  const handleCreateBill = async () => {
    await createBill();
  };

  if (!activeCustomerId) {
    return (
      <div className="bill-view empty-state">
        <p>Select a customer to create a bill</p>
      </div>
    );
  }

  return (
    <div className="bill-view">
      <div className="bill-header">
        <h3>Bill for {activeCustomer?.name}</h3>
      </div>

      {activeBillItems.length === 0 ? (
        <div className="empty-bill">
          <p>No items added to bill yet</p>
          <p className="hint">Add items from the tabs on the right</p>
        </div>
      ) : (
        <>
          <div className="bill-items">
            {activeBillItems.map(item => (
              <div key={item.id} className="bill-item">
                <div className="bill-item-info">
                  <div className="bill-item-name">{item.name}</div>
                  <div className="bill-item-details">
                    <span className="bill-item-price">${item.price.toFixed(2)}</span>
                    <span className="bill-item-quantity">× {item.quantity}</span>
                    <span className="bill-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  className="btn btn-sm btn-danger bill-item-remove" 
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="bill-footer">
            <div className="bill-total">
              <span className="label">Total:</span>
              <span className="value">${total.toFixed(2)}</span>
            </div>

            <div className="bill-actions">
              <button className="btn btn-sm" onClick={handleClearItems}>
                Clear All
              </button>
              <button className="btn btn-success" onClick={handleCreateBill}>
                Create Bill
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BillView;
