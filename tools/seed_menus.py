
import requests

# Base URL for your API
BASE_URL = 'https://menu-managment-challenge.onrender.com'

def get_all_menu_items():
    """Retrieve all menu items to prepare for deletion."""
    url = f"{BASE_URL}/menu"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()  # Assuming the response is a list of menu items
    else:
        print("Failed to retrieve menu items. Status Code:", response.status_code)
        return []

def delete_menu_item(item_id):
    """Delete a single menu item by ID."""
    url = f"{BASE_URL}/menu/{item_id}"
    response = requests.delete(url)
    if response.status_code == 200:
        print(f"Menu item {item_id} deleted successfully!")
    else:
        print(f"Failed to delete menu item {item_id}. Status Code:", response.status_code)

def delete_existing_items():
    """Delete all existing menu items."""
    menu_items = get_all_menu_items()
    for item in menu_items:
        delete_menu_item(item['id'])  # Assuming each item in the list has an 'id' field


def create_menu_item(parent_id, name):
    """Create a menu item and return its JSON response if successful."""
    url = f"{BASE_URL}/menu"
    json_data = {"name": name, "parentId": parent_id}
    response = requests.post(url, json=json_data)
    return response.json() if response.status_code == 201 else None

def main():
    # Hierarchy of menu items to create
    hierarchy = {
        "System Management": {
            "Systems": {
                "System Code": ["Code Registration", "Code Registration - 2"],
                "Properties": [],
                "Menus": ["Menu Registration"]
            },
            "API List": ["API Registration", "API Edit"],
            "Users & Groups": {
                "Users": ["User Account Registration"],
                "Groups": ["User Group Registration"]
            },
            "사용자설정": {
                "사용자 설정 상세": []
            }
        }
    }

    def create_hierarchy(parent_id, tree):
        for name, sub_tree in tree.items():
            menu_item = create_menu_item(parent_id, name)
            if menu_item is None:
                print(f"Failed to create menu item {name}")
                continue
            if isinstance(sub_tree, dict):  # Has nested items
                create_hierarchy(menu_item['id'], sub_tree)
            elif isinstance(sub_tree, list):  # List of strings (leaf nodes)
                for leaf in sub_tree:
                    create_menu_item(menu_item['id'], leaf)

    # Start creating the menu hierarchy
    create_hierarchy(None, hierarchy)
    print("Menu items created successfully!")

if __name__ == '__main__':
    #delete_existing_items()
    main()
