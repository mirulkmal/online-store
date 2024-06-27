const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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
    return 20; // Defaulting to highest tier for weights above 5000g
  }
};

const splitOrder = (items) => {
  let packages = [];
  let currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };

  items.forEach(item => {
    if (currentPackage.totalPrice + item.price > 250 || currentPackage.totalWeight + item.weight > 5000) {
      packages.push(currentPackage);
      currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };
    }
    currentPackage.items.push(item);
    currentPackage.totalWeight += item.weight;
    currentPackage.totalPrice += item.price;
  });

  if (currentPackage.items.length > 0) {
    packages.push(currentPackage);
  }

  // Distribute weights evenly among packages
  let totalWeight = packages.reduce((sum, pkg) => sum + pkg.totalWeight, 0);
  let targetWeight = totalWeight / packages.length;

  packages = packages.map(pkg => ({ ...pkg, remainingWeight: targetWeight }));

  for (let i = 0; i < packages.length; i++) {
    for (let j = i + 1; j < packages.length; j++) {
      let weightDiff = packages[i].totalWeight - packages[j].totalWeight;
      if (Math.abs(weightDiff) > packages[j].remainingWeight) {
        let transferWeight = weightDiff > 0 ? packages[j].remainingWeight : -packages[j].remainingWeight;
        let transferItem = packages[i].items.find(item => item.weight <= Math.abs(transferWeight));
        if (transferItem) {
          packages[i].items = packages[i].items.filter(item => item !== transferItem);
          packages[j].items.push(transferItem);
          packages[i].totalWeight -= transferItem.weight;
          packages[j].totalWeight += transferItem.weight;
          packages[i].totalPrice -= transferItem.price;
          packages[j].totalPrice += transferItem.price;
          packages[i].remainingWeight -= Math.abs(transferWeight);
          packages[j].remainingWeight -= Math.abs(transferWeight);
        }
      }
    }
  }

  // Calculate courier charge for each package
  packages.forEach(pkg => {
    pkg.courierCharge = calculateCourierCharge(pkg.totalWeight);
  });

  return packages;
};

app.post('/place-order', (req, res) => {
  const { items } = req.body;
  const packages = splitOrder(items);
  res.json({ packages });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
