import requests

url = 'http://localhost:5000/api/clear-users'
token = 'your_admin_jwt_token'  # Replace with your admin JWT token

headers = {
    'Authorization': f'Bearer {token}'
}

response = requests.post(url, headers=headers)
print(response.json())
