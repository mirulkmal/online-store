const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const courierCharges = [
  { weight: 200, charge: 5 },
  { weight: 500, charge: 10 },
  { weight: 1000, charge: 15 },
  { weight: 5000, charge: 20 },
];

const calculateCourierCharge = (weight) => {
  for (let i = courierCharges.length - 1; i >= 0; i--) {
    if (weight > courierCharges[i].weight) {
      return courierCharges[i].charge;
    }
  }
  return 5;
};

const splitOrder = (items) => {
  let packages = [];
  let currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };

  items.sort((a, b) => b.price - a.price); // Sort items by price descending

  items.forEach(item => {
    if (currentPackage.totalPrice + item.price > 250) {
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

  packages = packages.map(pkg => ({
    ...pkg,
    courierPrice: calculateCourierCharge(pkg.totalWeight),
  }));

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
