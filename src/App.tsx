import { useState } from 'react';
import { ShopProvider } from './context/ShopContext';
import CustomerSelection from './components/customers/CustomerSelection';
import BillView from './components/billing/BillView';
import Tabs from './components/common/Tabs';
import CustomersPanel from './components/customers/CustomersPanel';
import JobsPanel from './components/jobs/JobsPanel';
import PartsPanel from './components/parts/PartsPanel';
import InventoryPanel from './components/inventory/InventoryPanel';
import AccessoriesPanel from './components/accessories/AccessoriesPanel';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('customers');

  const tabs = [
    { id: 'customers', label: 'Customers' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'parts', label: 'Parts' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'customers':
        return <CustomersPanel />;
      case 'jobs':
        return <JobsPanel />;
      case 'parts':
        return <PartsPanel />;
      case 'inventory':
        return <InventoryPanel />;
      case 'accessories':
        return <AccessoriesPanel />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <ShopProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Wild Bill's Golf Cart Repair</h1>
        </header>
        
        <div className="main-content">
          <aside className="customer-sidebar">
            <div className="sidebar-section">
              <h2>Customer Selection</h2>
              <p>Select a customer to create or view bills</p>
              <CustomerSelection />
            </div>
            
            <div className="sidebar-section">
              <h2>Current Bill</h2>
              <p>Items added to the current bill will appear here</p>
              <BillView />
            </div>
          </aside>
          
          <main className="content-area">
            <Tabs 
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <div className="tab-content">
              {renderActiveTabContent()}
            </div>
          </main>
        </div>
      </div>
    </ShopProvider>
  )
}

export default App
