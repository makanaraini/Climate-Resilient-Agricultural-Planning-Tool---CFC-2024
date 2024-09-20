def calculate_kpis(crop_data):
    total_yield = sum(data.yield_amount * data.area for data in crop_data)
    total_area = sum(data.area for data in crop_data)
    average_yield = total_yield / total_area if total_area > 0 else 0

    return {
        'totalYield': round(total_yield, 2),
        'totalArea': round(total_area, 2),
        'averageYield': round(average_yield, 2)
    }
