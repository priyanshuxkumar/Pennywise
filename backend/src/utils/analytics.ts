import { getUserTransactions } from '../lib/db/queries';

async function getSummary(userId: string) {
    try {
        const txns = await getUserTransactions(userId);

        const summary = txns.reduce<Record<string, number>>(
            (acc, t) => {
                const amt = Number(t.amount);

                if (t.type === 'income') acc.totalIncome += amt;
                else if (t.type === 'expense') acc.totalExpense += amt;

                acc.netSavings = acc.totalIncome - acc.totalExpense;
                return acc;
            },
            { totalIncome: 0, totalExpense: 0, netSavings: 0 },
        );

        return [
            { label: 'TOTAL INCOME', value: summary.totalIncome, type: 'income' },
            { label: 'TOTAL EXPENSES', value: summary.totalExpense, type: 'expense' },
            { label: 'NET SAVINGS', value: summary.netSavings, type: 'savings' },
        ];
    } catch (err: unknown) {
        throw err;
    }
}

async function getTxnInCategories(userId: string) {
    try {
        const txns = await getUserTransactions(userId);

        const categories = txns.reduce<Record<string, number>>((acc, t) => {
            const amt = Number(t.amount);
            acc[t.category] = (acc[t.category] || 0) + amt;
            return acc;
        }, {});

        const total = Object.entries(categories).reduce((sum, val) => sum + Number(val[1]), 0);

        return Object.entries(categories).map(([category, amount]) => ({
            category,
            amount,
            percentage: total > 0 ? Number(((amount / total) * 100).toFixed(2)) : 0,
        }));
    } catch (err: unknown) {
        throw err;
    }
}

const getTxnInTrends = async (userId: string) => {
    let days = 7; // atleat 7 days data
    try {
        const txns = await getUserTransactions(userId);
        
        const dailyTotals = txns.reduce<Record<string, number>>((acc, t) => {
            const date = new Date(t.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + Math.abs(Number(t.amount));
            return acc;
        }, {});

        console.log('dailyTotals', dailyTotals);

        const result = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() - i);

            const dateStr = currentDate.toISOString().split('T')[0];

            const displayDate = currentDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });

            result.push({
                date: dateStr,
                month: displayDate,
                amount: dailyTotals[dateStr] || 0,
            });
        }

        return result;
    } catch (err: unknown) {
        throw err;
    }
};

export { getSummary, getTxnInCategories, getTxnInTrends };
