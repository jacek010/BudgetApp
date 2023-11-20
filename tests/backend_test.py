import requests
import pytest

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJaaW9tZWN6ZWsiLCJ1c2VyX3N1cm5hbWUiOiJaaW9ta293c2tpIiwidXNlcl9lbWFpbCI6Inppb21rb3dza2lAZ21haWwuY29tIiwidXNlcl9pZCI6MjUsImJ1ZGdldF9pZCI6MjF9.6rmJgckF2OF4iOSyrGMdOvb4k9cBG1_5abWfmgkDlIk"

def test_get_api():
    response = requests.get('http://localhost:8000/api')
    assert response.status_code == 200
    assert response.json()=={"Message": "Hello in BudgetApp"}
    
def test_create_user():
    user_data = {
        "user_email": "testuser@example.com",
        "user_surname": "testuser",
        "user_name": "testuser",
        "user_hashed_password": "testpassword"
    }
    response = requests.post('http://localhost:8000/api/users', json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data['token_type'] == "bearer"
    
def test_get_current_user():
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get('http://localhost:8000/api/users/me', headers=headers)
    assert response.status_code == 200
    user = response.json()
    assert 'user_email' in user
    
@pytest.mark.parametrize(
    "email,expected_status_code",
    [
        ("testuser@example.com", 200),  # replace with an email of an existing user
        ("nonexistinguser@example.com", 404),  # replace with an email of a non-existing user
    ],
)
def test_get_user_by_email(email, expected_status_code):
    headers={"Authorization": f"Bearer {token}"}
    response = requests.get(f'http://localhost:8000/api/users/get_by_email/{email}', headers=headers)
    assert response.status_code == expected_status_code
    
def test_update_user():
    headers = {"Authorization": f"Bearer {token}"}
    user_update_data = {
        "user_email": "testuser@example.com",
        "user_surname": "testuserupdated",
        "user_name": "testuserupdated",
        "user_hashed_password": "testpassword"
    }
    response = requests.put('http://localhost:8000/api/users/update', headers=headers, json=user_update_data)
    assert response.status_code == 200
    assert response.json() == {"message": "Succesfully updated"}
    
def test_delete_user():
    headers={"Authorization": f"Bearer {token}"}
    # Get the user's ID
    response = requests.get('http://localhost:8000/api/users/get_by_email/testuser@example.com', headers=headers)
    assert response.status_code == 200
    user = response.json()
    user_id = user['user_id']

    # Delete the user
    response = requests.delete(f'http://localhost:8000/api/admin/delete_user/{user_id}', headers=headers)
    assert response.status_code == 200
    assert response.json() == {"Message":"User deleted successfully"}