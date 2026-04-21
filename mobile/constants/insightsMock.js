export const monthRecords = {
    'January': {
        total: 1250,
        chart: [300, 450, 200, 500, 350, 400],
        categories: [
            { title: 'Housing', amount: '$600', percent: '48%', color: '#005bc1', icon: 'home-outline' },
            { title: 'Food & Dining', amount: '$350', percent: '28%', color: '#3b82f6', icon: 'fast-food-outline' },
            { title: 'Transport', amount: '$150', percent: '12%', color: '#60a5fa', icon: 'car-outline' },
            { title: 'Shopping', amount: '$150', percent: '12%', color: '#93c5fd', icon: 'cart-outline' },
        ]
    },
    'February': {
        total: 1100,
        chart: [250, 400, 150, 450, 300, 350],
        categories: [
            { title: 'Housing', amount: '$600', percent: '54%', color: '#005bc1', icon: 'home-outline' },
            { title: 'Food & Dining', amount: '$250', percent: '23%', color: '#3b82f6', icon: 'fast-food-outline' },
            { title: 'Transport', amount: '$100', percent: '9%', color: '#60a5fa', icon: 'car-outline' },
            { title: 'Others', amount: '$150', percent: '14%', color: '#93c5fd', icon: 'apps-outline' },
        ]
    },
    'March': {
        total: 1420,
        chart: [400, 550, 300, 600, 450, 500],
        categories: [
            { title: 'Housing', amount: '$600', percent: '42%', color: '#005bc1', icon: 'home-outline' },
            { title: 'Shopping', amount: '$420', percent: '30%', color: '#3b82f6', icon: 'cart-outline' },
            { title: 'Food & Dining', amount: '$300', percent: '21%', color: '#60a5fa', icon: 'fast-food-outline' },
            { title: 'Transport', amount: '$100', percent: '7%', color: '#93c5fd', icon: 'car-outline' },
        ]
    },
    'default': {
        total: 1000,
        chart: [200, 300, 200, 400, 300, 300],
        categories: [
            { title: 'Miscellaneous', amount: '$1,000', percent: '100%', color: '#005bc1', icon: 'apps-outline' },
        ]
    }
};

// Add all other months as keys pointing to default if needed
const months = [
    'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
months.forEach(m => {
    if (!monthRecords[m]) monthRecords[m] = monthRecords['default'];
});
