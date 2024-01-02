const inventoryHeader = ['No.', 'Items', 'Qty', "Amount"];

const inventoryData = [
    ["1.", 'Coca Cola', '15', "KES 0.00"],
    ["2.", "Butter-Toast Bread you cannot want to miss. just some random text to test hwo robust the pdf file is", "300", "KES 0.00"],
    ["3.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["4.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["5.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["6.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["7.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["8.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["9.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["10.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["11.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["12.", "Butter-Toast Bread", "300", "KES 0.00"],
    ["13.", "Butter-Toast Bread", "300", "KES 0.00"],

    // Add more rows as needed
];

const outOfStockHeader = ['No.', 'Items'];
    
// Define table rows
const outOfStockData = [
    ["1.", 'Coca Cola'],
    ["2.", "Butter-Toast Bread"],
            // Add more rows as needed
];


export const TableContent = {
    inventoryHeader,
    inventoryData,
    outOfStockHeader,
    outOfStockData
}