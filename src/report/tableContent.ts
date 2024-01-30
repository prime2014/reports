const inventoryHeader = ['No.', 'Items', 'Qty', "Amount"];
const categoryHeader = ['No', "Category", "Qty", "Amount"];
const outOfStockHeader = ['No.', 'Items'];

const inventoryData = [
    {
        categoryName: 'Food & Drinks',
        amount: "KES 0.00",
        items: [
          [ 1, 'Item C', 4, 40 ],
          [ 2, 'Item C', 4, 40 ],
          [ 3, 'Item C', 4, 40 ],
          [ 4, 'Item C', 4, 40 ],
          [ 5, 'Item C', 4, 40 ],
          [ 6, 'Item C', 4, 40 ],
          [ 7, 'Item C', 4, 40 ],
          [ 8, 'Item C', 4, 40 ],
          [ 9, 'Item C', 4, 40 ],
          [ 11, 'Item C', 4, 40 ],
          [ 12, 'Item C', 4, 40 ],
          [ 13, 'Item C', 4, 40 ],
          [ 14, 'Item C', 4, 40 ],
          [ 15, 'Item C', 4, 40 ],
        ],
      },
      {
        categoryName: 'Stationery',
        amount: "KES 0.00",
        items: [
          [ 1, 'Item C', 4, 40 ],
          [ 2, 'Item C', 4, 40 ],
          [ 3, 'Item C', 4, 40 ],
          [ 4, 'Item C', 4, 40 ],
          [ 5, 'Item C', 4, 40 ],
          [ 6, 'Item C', 4, 40 ],
          [ 7, 'Item C', 4, 40 ],
          [ 8, 'Item C', 4, 40 ],
          [ 9, 'Item C', 4, 40 ],
          [ 10, 'Item C', 4, 40 ],
          [ 11, 'Item C', 4, 40 ],
          [ 12, 'Item C', 4, 40 ],
          [ 13, 'Item C', 4, 40 ],
          [ 14, 'Item C', 4, 40 ],
          [ 15, 'Item C', 4, 40 ],
        ],
      },
      {
        categoryName: 'Art & Paintings',
        amount: "KES 0.00",
        items: [
          [ 1, 'Item C', 4, 40 ],
          [ 2, 'Item C', 4, 40 ],
          [ 3, 'Item C', 4, 40 ],
          [ 4, 'Item C', 4, 40 ],
          [ 5, 'Item C', 4, 40 ],
          [ 6, 'Item C', 4, 40 ],
          [ 7, 'Item C', 4, 40 ],
          [ 8, 'Item C', 4, 40 ],
          [ 9, 'Item C', 4, 40 ],
          [ 10, 'Item C', 4, 40 ],
          [ 11, 'Item C', 4, 40 ],
          [ 12, 'Item C', 4, 40 ],
          [ 13, 'Item C', 4, 40 ],
          [ 14, 'Item C', 4, 40 ],
          [ 15, 'Item C', 4, 40 ],
        ],
      },
      {
        categoryName: 'Electronics',
        amount: "KES 0.00",
        items: [
          [ 1, 'Item C', 4, 40 ],
          [ 2, 'Item C', 4, 40 ],
          [ 3, 'Item C', 4, 40 ],
          [ 4, 'Item C', 4, 40 ],
          [ 5, 'Item C', 4, 40 ],
          [ 6, 'Item C', 4, 40 ],
          [ 7, 'Item C', 4, 40 ],
          [ 8, 'Item C', 4, 40 ],
          [ 9, 'Item C', 4, 40 ],
          [ 10, 'Item C', 4, 40 ],
          [ 11, 'Item C', 4, 40 ],
          [ 12, 'Item C', 4, 40 ],
          [ 13, 'Item C', 4, 40 ],
          [ 14, 'Item C', 4, 40 ],
          [ 15, 'Item C', 4, 40 ],
        ],
      },
      {
        categoryName: 'Garden & Outdoors',
        amount: "KES 0.00",
        items: [
          [ 1, 'Item C', 4, 40 ],
          [ 2, 'Item C', 4, 40 ],
          [ 3, 'Item C', 4, 40 ],
          [ 4, 'Item C', 4, 40 ],
          [ 5, 'Item C', 4, 40 ],
          [ 6, 'Item C', 4, 40 ],
          [ 7, 'Item C', 4, 40 ],
          [ 8, 'Item C', 4, 40 ],
          [ 9, 'Item C', 4, 40 ],
          [ 110, 'Item C', 4, 40 ],
          [ 11, 'Item C', 4, 40 ],
          [ 12, 'Item C', 4, 40 ],
          [ 13, 'Item C', 4, 40 ],
          [ 14, 'Item C', 4, 40 ],
          [ 15, 'Item C', 4, 40 ],
        ],
      },
      {
        categoryName: 'Groceries',
        amount: "KES 0.00",
        items: [
          [ 1, 'Item C', 4, 40 ],
          [ 2, 'Item C', 4, 40 ],
          [ 3, 'Item C', 4, 40 ],
          [ 4, 'Item C', 4, 40 ],
          [ 5, 'Item C', 4, 40 ],
          [ 6, 'Item C', 4, 40 ],
          [ 7, 'Item C', 4, 40 ],
          [ 8, 'Item C', 4, 40 ],
          [ 9, 'Item C', 4, 40 ],
          [ 10, 'Item C', 4, 40 ],
          [ 11, 'Item C', 4, 40 ],
          [ 12, 'Item C', 4, 40 ],
          [ 13, 'Item C', 4, 40 ],
          [ 14, 'Item C', 4, 40 ],
          [ 15, 'Item C', 4, 40 ],
        ],
      },
      {
        categoryName: 'Toys & Games',
        amount: "KES 0.00",
        items: [
          [ 1, 'Item C', 4, 40 ],
          [ 2, 'Item C', 4, 40 ],
          [ 3, 'Item C', 4, 40 ],
          [ 4, 'Item C', 4, 40 ],
          [ 5, 'Item C', 4, 40 ],
          [ 6, 'Item C', 4, 40 ],
          [ 7, 'Item C', 4, 40 ],
          [ 8, 'Item C', 4, 40 ],
          [ 9, 'Item C', 4, 40 ],
          [ 10, 'Item C', 4, 40 ],
          [ 11, 'Item C', 4, 40 ],
          [ 12, 'Item C', 4, 40 ],
          [ 13, 'Item C', 4, 40 ],
          [ 14, 'Item C', 4, 40 ],
          [ 15, 'Item C', 4, 40 ],
        ],
      },

    // Add more rows as needed
];

const data = [
    
  ];

const categoriesData = [
    ["1.", 'Food & Drinks', '15', "KES 0.00"],
    ["2.", "Stationery", "300", "KES 0.00"],
    ["3.", "Art & Paintings", "300", "KES 0.00"],
    ["4.", "Fashion", "300", "KES 0.00"],
    ["5.", "Electronics", "300", "KES 0.00"],
    ["6.", "Books", "300", "KES 0.00"],
    ["7.", "Garden & Outdoors", "300", "KES 0.00"],
    ["8.", "Groceries", "300", "KES 0.00"],
    ["9.", "Toys & Games", "300", "KES 0.00"],
    ["10.", "Automotive", "300", "KES 0.00"],
    ["11.", "Office Products", "300", "KES 0.00"],
    ["12.", "Cellphones", "300", "KES 0.00"],
    ["13.", "Home & Kitchen", "300", "KES 0.00"],

    // Add more rows as needed
];


    
// Define table rows
const outOfStockData = [
    ["1.", 'Coca Cola'],
    ["2.", "Butter-Toast Bread"],
            // Add more rows as needed
];


export const TableContent = {
    inventoryHeader,
    inventoryData,
    categoryHeader,
    categoriesData,
    outOfStockHeader,
    outOfStockData
}