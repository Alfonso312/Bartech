import pandas as pd
import random
import string

def random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

data = {
    'ID': range(1, 2501), # Generate 2500 rows to create 3 batches
    'Name': [random_string(8) for _ in range(2500)],
    'Price': [random.randint(10, 1000) for _ in range(2500)],
    'Category': [random.choice(['Electronics', 'Clothing', 'Home', 'Toys']) for _ in range(2500)]
}

df = pd.DataFrame(data)
df.to_excel('test_upload.xlsx', index=False)
print("test_upload.xlsx generated successfully with 2500 rows.")
