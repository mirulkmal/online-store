import React, { useState } from 'react';
import axios from 'axios';

const items = [
  { name: "Item 1", price: 10, weight: 200 },
  { name: "Item 2", price: 100, weight: 20 },
  { name: "Item 3", price: 30, weight: 300 },
  { name: "Item 4", price: 20, weight: 500 },
  { name: "Item 5", price: 30, weight: 250 },
  { name: "Item 6", price: 40, weight: 10 },
  { name: "Item 7", price: 200, weight: 10 },
  { name: "Item 8", price: 120, weight: 500 },
  { name: "Item 9", price: 130, weight: 790 },
  { name: "Item 10", price: 20, weight: 100 },
  { name: "Item 11", price: 10, weight: 340 },
  { name: "Item 12", price: 4, weight: 800 },
  { name: "Item 13", price: 5, weight: 200 },
  { name: "Item 14", price: 240, weight: 20 },
  { name: "Item 15", price: 123, weight: 700 },
  { name: "Item 16", price: 245, weight: 10 },
  { name: "Item 17", price: 230, weight: 20 },
  { name: "Item 18", price: 110, weight: 200 },
  { name: "Item 19", price: 45, weight: 200 },
  { name: "Item 20", price: 67, weight: 20 },
  { name: "Item 21", price: 88, weight: 300 },
  { name: "Item 22", price: 10, weight: 500 },
  { name: "Item 23", price: 17, weight: 250 },
  { name: "Item 24", price: 19, weight: 10 },
  { name: "Item 25", price: 89, weight: 100 },
  { name: "Item 26", price: 45, weight: 500 },
  { name: "Item 27", price: 99, weight: 790 },
  { name: "Item 28", price: 125, weight: 1000 },
  { name: "Item 29", price: 198, weight: 340 },
  { name: "Item 30", price: 220, weight: 800 },
  { name: "Item 31", price: 249, weight: 200 },
  { name: "Item 32", price: 230, weight: 20 },
  { name: "Item 33", price: 190, weight: 700 },
  { name: "Item 34", price: 45, weight: 200 },
  { name: "Item 35", price: 12, weight: 20 },
  { name: "Item 36", price: 5, weight: 200 },
  { name: "Item 37", price: 2, weight: 200 },
  { name: "Item 38", price: 90, weight: 200 },
  { name: "Item 39", price: 12, weight: 300 },
  { name: "Item 40", price: 167, weight: 500 },
  { name: "Item 41", price: 12, weight: 250 },
  { name: "Item 42", price: 8, weight: 10 },
  { name: "Item 43", price: 2, weight: 10 },
  { name: "Item 44", price: 9, weight: 500 },
  { name: "Item 45", price: 210, weight: 790 },
  { name: "Item 46", price: 167, weight: 100 },
  { name: "Item 47", price: 23, weight: 340 },
  { name: "Item 48", price: 190, weight: 800 },
  { name: "Item 49", price: 199, weight: 200 },
  { name: "Item 50", price: 12, weight: 20 },
];

const calculateCourierCharge = (weight) => {
  if (weight <= 200) {
    return 5;
  } else if (weight <= 500) {
    return 10;
  } else if (weight <= 1000) {
    return 15;
  } else if (weight <= 5000) {
    return 20;
  } else {
    // Handle cases where weight is above 5000g if needed
    return 20; // Defaulting to highest tier for weights above 5000g
  }
};

const App = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [packages, setPackages] = useState([]);

  const handleSelect = (item) => {
    setSelectedItems(prevItems =>
      prevItems.includes(item)
        ? prevItems.filter(i => i !== item)
        : [...prevItems, item]
    );
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post('https://online-store-rfhg.onrender.com/place-order', { items: selectedItems });
      const packages = response.data.packages.map(pkg => ({
        ...pkg,
        courierCharge: calculateCourierCharge(pkg.totalWeight)
      }));
      setPackages(packages);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div>
      <h1>Place Your Order</h1>
      <ul>
        {items.map(item => (
          <li key={item.name}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {item.name} - ${item.price} - {item.weight}g
          </li>
        ))}
      </ul>
      <button onClick={handlePlaceOrder}>Place Order</button>

      {packages.length > 0 && (
        <div>
          <h2>This order has following packages:</h2>
          {packages.map((pkg, index) => (
            <div key={index}>
              <h3>Package {index + 1}</h3>
              <ul>
                {pkg.items.map(item => (
                  <li key={item.name}>{item.name}</li>
                ))}
              </ul>
              <p>Total Weight: {pkg.totalWeight}g</p>
              <p>Total Price: ${pkg.totalPrice}</p>
              <p>Courier Price: ${pkg.courierCharge}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
