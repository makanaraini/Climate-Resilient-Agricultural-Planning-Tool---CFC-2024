import axios from 'axios';

// Replace with your actual Watsonx API endpoint
const WATSON_API_URL = 'https://eu-gb.ml.cloud.ibm.com/ml/v4/deployments/8be0910c-47f3-48a6-b1ed-6eec41b7d324/predictions?version=2021-05-01';

export const predictYield = async (data) => {
    try {
        const response = await axios.post(WATSON_API_URL, {
            data: data,
        }, {
            headers: {
                'Content-Type': 'application/json',
                // Add any required authentication headers here, e.g., API key
                'Authorization': `Bearer Q9G-adhcsG9PgyuKhIqw-Xpk0RAmXSA0g0Kt4fvzSPjY`, // Replace with your actual API key
            },
        });

        return response.data; // Return the prediction data
    } catch (error) {
        console.error('Error making prediction:', error);
        throw new Error('Failed to fetch predictions from Watsonx.');
    }
};
