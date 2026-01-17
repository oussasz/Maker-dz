import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const useAlgeriaData = () => {
    const [algeriaData, setAlgeriaData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const csvModule = await import('../assets/algeria_cities.csv?raw');
                const csvData = csvModule.default;

                return new Promise((resolve, reject) => {
                    Papa.parse(csvData, {
                        header: false,
                        delimiter: ',',
                        complete: (results) => {
                            if (results.errors.length > 0) {
                                reject(new Error(`CSV parse errors: ${results.errors[0].message}`));
                                return;
                            }
                            
                            const formattedData = transformData(results.data);
                            setAlgeriaData(formattedData);
                            setIsLoading(false);
                            resolve(formattedData);
                        },
                        error: (error) => {
                            reject(new Error(`Parse failed: ${error.message}`));
                        }
                    });
                });

            } catch (err) {
                console.error('Error in useAlgeriaData:', err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const transformData = (data) => {
        // Your existing transformData function
        const wilayas = {};
        
        data.filter(row => row && row.length >= 8).forEach((row) => {
            const wilaya_name_ascii = row[7];
            const daira_name_ascii = row[2];
            
            if (!wilaya_name_ascii) return;

            if (!wilayas[wilaya_name_ascii]) {
                wilayas[wilaya_name_ascii] = {
                    name: wilaya_name_ascii,
                    dairas: [],
                };
            }

            if (daira_name_ascii && !wilayas[wilaya_name_ascii].dairas.find(d => d.name === daira_name_ascii)) {
                wilayas[wilaya_name_ascii].dairas.push({
                    name: daira_name_ascii,
                    communes: [],
                });
            }
        });

        return Object.values(wilayas);
    };

    return { algeriaData, isLoading, error };
};

export default useAlgeriaData;