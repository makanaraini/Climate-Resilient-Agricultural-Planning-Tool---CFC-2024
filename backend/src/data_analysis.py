import pandas as pd
import numpy as np
from typing import Dict, List

def analyze_crop_data(data: List[Dict]) -> Dict:
    """
    Analyze crop yield data in relation to weather conditions.
    
    :param data: List of dictionaries containing crop and weather data
    :return: Dictionary containing analysis results
    """
    # Convert data to DataFrame
    df = pd.DataFrame(data)
    
    # Basic statistics
    yield_stats = df['yield'].describe()
    
    # Correlation between weather factors and yield
    correlations = df[['temperature', 'rainfall', 'yield']].corr()['yield'].drop('yield')
    
    # Identify optimal conditions
    optimal_temp = df.loc[df['yield'].idxmax(), 'temperature']
    optimal_rainfall = df.loc[df['yield'].idxmax(), 'rainfall']
    
    # Group by crop type and calculate average yield
    crop_yields = df.groupby('crop_type')['yield'].mean().sort_values(ascending=False)
    
    # Identify years with extreme weather conditions
    extreme_years = df[
        (df['temperature'] > df['temperature'].mean() + df['temperature'].std()) |
        (df['rainfall'] < df['rainfall'].mean() - df['rainfall'].std())
    ]['year'].tolist()
    
    # Prepare results
    results = {
        "yield_statistics": yield_stats.to_dict(),
        "weather_yield_correlation": correlations.to_dict(),
        "optimal_conditions": {
            "temperature": optimal_temp,
            "rainfall": optimal_rainfall
        },
        "crop_type_yields": crop_yields.to_dict(),
        "extreme_weather_years": extreme_years
    }
    
    return results

# Sample data (this could come from an API or database)
sample_data = [
    {"year": 2020, "crop_type": "wheat", "yield": 3.2, "temperature": 25, "rainfall": 500},
    {"year": 2020, "crop_type": "corn", "yield": 9.5, "temperature": 28, "rainfall": 800},
    {"year": 2021, "crop_type": "wheat", "yield": 3.0, "temperature": 26, "rainfall": 450},
    {"year": 2021, "crop_type": "corn", "yield": 10.2, "temperature": 27, "rainfall": 750},
    {"year": 2022, "crop_type": "wheat", "yield": 2.8, "temperature": 28, "rainfall": 400},
    {"year": 2022, "crop_type": "corn", "yield": 8.9, "temperature": 30, "rainfall": 600},
    {"year": 2023, "crop_type": "wheat", "yield": 3.5, "temperature": 24, "rainfall": 550},
    {"year": 2023, "crop_type": "corn", "yield": 11.0, "temperature": 26, "rainfall": 850},
]

# Run the analysis
analysis_results = analyze_crop_data(sample_data)

# Print the results
print(json.dumps(analysis_results, indent=2))
