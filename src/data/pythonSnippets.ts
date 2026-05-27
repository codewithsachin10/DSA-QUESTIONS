export const getSnippets = (moduleId: string, sectionIdx: number): string[] => {
  const snippets: Record<string, Record<number, string[]>> = {
    "1": {
      0: [
`# 1. Empty Dictionary
student_data = {}
print("Empty dictionary:", student_data)
print("Type:", type(student_data))`,

`# 2. Using dict() constructor
config = dict()
config["theme"] = "dark"
config["version"] = 1.2
print("Configuration:", config)`,

`# 3. Initializing with data
user = {
    "name": "Alice",
    "age": 25,
    "role": "Admin"
}
print(f"{user['name']} is an {user['role']}")`,

`# 4. Mixed Data Types
record = {
    1: "First",
    "scores": [95, 82, 99],
    "passed": True
}
print("Scores:", record["scores"])`,

`# 5. Nested Dictionary
school = {
    "class_a": {"students": 30},
    "class_b": {"students": 25}
}
print("Class A students:", school["class_a"]["students"])`
      ],
      2: [
`# 1. Direct Assignment
inventory = {"apples": 10, "bananas": 5}
print("Inventory:", inventory)`,

`# 2. dict() with kwargs
settings = dict(host="localhost", port=8080)
print("Settings:", settings)`,

`# 3. List of Tuples
pairs = [("x", 100), ("y", 200)]
coordinates = dict(pairs)
print("Coordinates:", coordinates)`,

`# 4. Dictionary Comprehension
squares = {x: x*x for x in range(1, 6)}
print("Squares:", squares)`,

`# 5. Using fromkeys
keys = ['a', 'b', 'c']
default_dict = dict.fromkeys(keys, 0)
print("Default dict:", default_dict)`
      ],
      3: [
`# 1. Direct Access
user = {"name": "Bob", "age": 30}
print("Name:", user["name"])`,

`# 2. Using .get() safely
user = {"name": "Bob"}
age = user.get("age", "Unknown")
print("Age:", age) # Returns Unknown`,

`# 3. Iterating Keys
data = {"a": 1, "b": 2}
for key in data.keys():
    print("Key:", key)`,

`# 4. Iterating Values
data = {"a": 1, "b": 2}
for val in data.values():
    print("Value:", val)`,

`# 5. Iterating Items
data = {"x": 10, "y": 20}
for key, value in data.items():
    print(f"{key} -> {value}")`
      ],
      4: [
`# 1. Updating a Value
car = {"brand": "Ford", "year": 1964}
car["year"] = 2020
print("Updated car:", car)`,

`# 2. Using .update()
user = {"name": "Alice"}
user.update({"age": 25, "role": "User"})
print("Updated user:", user)`,

`# 3. Deleting with 'del'
data = {"a": 1, "b": 2, "c": 3}
del data["b"]
print("After del:", data)`,

`# 4. Popping a value
data = {"a": 1, "b": 2}
val = data.pop("a")
print(f"Popped {val}, remaining: {data}")`,

`# 5. Clearing the dictionary
temp = {"x": 100, "y": 200}
temp.clear()
print("Cleared dict:", temp)`
      ]
    },
    "2": {
      0: [
`# 1. Zero Division Error
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")`,

`# 2. Type Error
try:
    calc = "5" + 5
except TypeError:
    print("Cannot add string and int!")`,

`# 3. Value Error
try:
    num = int("hello")
except ValueError:
    print("Invalid conversion!")`,

`# 4. File Not Found Error
try:
    f = open("missing.txt", "r")
except FileNotFoundError:
    print("File does not exist.")`,

`# 5. Key Error
try:
    d = {"a": 1}
    print(d["b"])
except KeyError:
    print("Key 'b' not found!")`
      ],
      2: [
`# 1. Multiple Except Blocks
try:
    val = int("text")
except ValueError:
    print("Value Error caught")
except TypeError:
    print("Type Error caught")`,

`# 2. Grouping Exceptions
try:
    10 / 0
except (ZeroDivisionError, TypeError):
    print("Math or Type error occurred")`,

`# 3. Catching as Variable
try:
    int("xyz")
except ValueError as e:
    print(f"Error details: {e}")`,

`# 4. Catch-All Exception (Use with caution)
try:
    x = 1 / 0
except Exception as e:
    print(f"Caught generic exception: {e}")`,

`# 5. Nested Try-Except
try:
    try:
        raise ValueError()
    except ValueError:
        print("Inner catch")
except Exception:
    print("Outer catch")`
      ],
      3: [
`# 1. The 'finally' Block
try:
    print("Running...")
finally:
    print("This ALWAYS executes!")`,

`# 2. The 'else' Block
try:
    res = 10 / 2
except ZeroDivisionError:
    print("Error")
else:
    print("Success! Result:", res)`,

`# 3. Full Try-Except-Else-Finally
try:
    x = 1
except Exception:
    print("Error")
else:
    print("No errors!")
finally:
    print("Cleanup step")`,

`# 4. Finally for Resource Cleanup
f = open("temp.txt", "w")
try:
    f.write("Hello")
finally:
    f.close()
    print("File closed safely")`,

`# 5. Return in Finally
def test():
    try:
        return 1
    finally:
        print("Executing finally before return")
print(test())`
      ],
      4: [
`# 1. Raising ValueError
age = -5
if age < 0:
    raise ValueError("Age cannot be negative!")`,

`# 2. Raising TypeError
def add_nums(a, b):
    if not isinstance(a, int):
        raise TypeError("Must be integer")
    return a + b`,

`# 3. Assertions
temperature = -100
assert temperature > -50, "Temperature too low!"
print("System stable")`,

`# 4. Re-raising Exceptions
try:
    1 / 0
except ZeroDivisionError:
    print("Logging error...")
    raise # Throws the error again`,

`# 5. Custom Exceptions
class CustomError(Exception):
    pass

raise CustomError("Something went wrong!")`
      ]
    },
    "3": {
      0: [
`# 1. Importing NumPy
import numpy as np
print("NumPy imported successfully!")`,

`# 2. List vs Array memory
import numpy as np
my_list = [1, 2, 3]
my_arr = np.array([1, 2, 3])
print(type(my_list), "vs", type(my_arr))`,

`# 3. Array Vectorization
import numpy as np
arr = np.array([1, 2, 3])
print("List * 2 = [1,2,3,1,2,3]")
print("Array * 2 =", arr * 2)`,

`# 4. Checking Data Types
import numpy as np
arr = np.array([1.5, 2.5])
print("Data type:", arr.dtype)`,

`# 5. Checking Shape
import numpy as np
arr = np.array([[1, 2], [3, 4]])
print("Shape of array:", arr.shape)`
      ],
      1: [
`# 1. Zeros and Ones
import numpy as np
z = np.zeros((2, 3))
o = np.ones(4)
print("Zeros:\\n", z)`,

`# 2. Arange (Like Python range)
import numpy as np
arr = np.arange(0, 10, 2)
print("Arange 0-10 step 2:", arr)`,

`# 3. Linspace (Linear Spacing)
import numpy as np
arr = np.linspace(0, 1, 5)
print("5 values between 0 and 1:", arr)`,

`# 4. Random Arrays
import numpy as np
rand_arr = np.random.rand(2, 2)
print("Random Matrix:\\n", rand_arr)`,

`# 5. Full Arrays
import numpy as np
f = np.full((2, 2), 7)
print("Array filled with 7:\\n", f)`
      ],
      3: [
`# 1. Basic Arithmetic
import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print("A + B =", a + b)`,

`# 2. Array Broadcasting
import numpy as np
a = np.array([1, 2, 3])
print("A + 10 =", a + 10)`,

`# 3. Statistical Functions
import numpy as np
arr = np.array([10, 20, 30, 40])
print("Mean:", np.mean(arr))
print("Sum:", np.sum(arr))`,

`# 4. Universal Functions (ufuncs)
import numpy as np
arr = np.array([1, 4, 9])
print("Square Root:", np.sqrt(arr))`,

`# 5. Dot Product
import numpy as np
a = np.array([1, 2])
b = np.array([3, 4])
print("Dot product:", np.dot(a, b))`
      ],
      4: [
`# 1. Reshape 1D to 2D
import numpy as np
arr = np.arange(6)
reshaped = arr.reshape((2, 3))
print("Reshaped:\\n", reshaped)`,

`# 2. Flattening Arrays
import numpy as np
arr = np.array([[1, 2], [3, 4]])
flat = arr.flatten()
print("Flattened:", flat)`,

`# 3. Transposing Arrays
import numpy as np
arr = np.array([[1, 2], [3, 4]])
print("Transposed:\\n", arr.T)`,

`# 4. Ravel (Memory Efficient Flatten)
import numpy as np
arr = np.array([[1, 2], [3, 4]])
print("Ravel:", arr.ravel())`,

`# 5. Unknown Dimension (-1)
import numpy as np
arr = np.arange(8)
matrix = arr.reshape(2, -1)
print("Reshaped with -1:\\n", matrix)`
      ]
    },
    "4": {
      0: [
`# 1. Importing Pandas
import pandas as pd
print("Pandas imported successfully!")`,

`# 2. Creating a Series
import pandas as pd
s = pd.Series([10, 20, 30], index=['A', 'B', 'C'])
print("Series:\\n", s)`,

`# 3. Creating a DataFrame from Dict
import pandas as pd
data = {"Name": ["Alice", "Bob"], "Age": [25, 30]}
df = pd.DataFrame(data)
print("DataFrame:\\n", df)`,

`# 4. DataFrame vs Series
import pandas as pd
df = pd.DataFrame({"X": [1, 2]})
print("df type:", type(df))
print("Column type:", type(df["X"]))`,

`# 5. Creating DF from List of Lists
import pandas as pd
data = [[1, "A"], [2, "B"]]
df = pd.DataFrame(data, columns=["ID", "Val"])
print(df)`
      ],
      1: [
`# 1. Mocking a CSV Read
import pandas as pd
print("df = pd.read_csv('data.csv')")
print("# Loads CSV directly into a DataFrame")`,

`# 2. Writing to CSV
import pandas as pd
df = pd.DataFrame({"A": [1, 2]})
print("df.to_csv('output.csv', index=False)")
print("# Saves dataframe without row indices")`,

`# 3. Reading Excel Files
import pandas as pd
print("df = pd.read_excel('report.xlsx', sheet_name='Q1')")
print("# Requires openpyxl installed")`,

`# 4. Reading JSON
import pandas as pd
print("df = pd.read_json('api_response.json')")
print("# Automatically parses JSON into tabular data")`,

`# 5. Handling Missing Values on Load
import pandas as pd
print("df = pd.read_csv('data.csv', na_values=['N/A', '?'])")
print("# Treats specific strings as NaN")`
      ],
      2: [
`# 1. Head and Tail
import pandas as pd
df = pd.DataFrame({"A": range(10)})
print("First 2 rows:\\n", df.head(2))
print("Last 2 rows:\\n", df.tail(2))`,

`# 2. DataFrame Info
import pandas as pd
df = pd.DataFrame({"A": [1, 2]})
print("# df.info() prints memory usage and column datatypes")`,

`# 3. Describe (Summary Stats)
import pandas as pd
df = pd.DataFrame({"Salary": [50000, 60000, 70000]})
print(df.describe())`,

`# 4. Checking Shape and Columns
import pandas as pd
df = pd.DataFrame({"A": [1], "B": [2]})
print("Shape (rows, cols):", df.shape)
print("Columns:", df.columns)`,

`# 5. Checking Data Types
import pandas as pd
df = pd.DataFrame({"ID": [1, 2], "Name": ["A", "B"]})
print("Dtypes:\\n", df.dtypes)`
      ],
      3: [
`# 1. Filtering by Condition
import pandas as pd
df = pd.DataFrame({"Age": [20, 25, 30]})
adults = df[df["Age"] >= 25]
print("Age >= 25:\\n", adults)`,

`# 2. Using .loc (Label based)
import pandas as pd
df = pd.DataFrame({"Val": [10, 20]}, index=["A", "B"])
print("Row 'A':\\n", df.loc["A"])`,

`# 3. Using .iloc (Index based)
import pandas as pd
df = pd.DataFrame({"Val": [10, 20]}, index=["A", "B"])
print("First Row:\\n", df.iloc[0])`,

`# 4. Multiple Conditions
import pandas as pd
df = pd.DataFrame({"Age": [20, 30], "Score": [80, 90]})
res = df[(df["Age"] > 20) & (df["Score"] > 85)]
print("Result:\\n", res)`,

`# 5. Using .query()
import pandas as pd
df = pd.DataFrame({"Age": [20, 30]})
print(df.query("Age > 20"))`
      ]
    }
  };

  return snippets[moduleId]?.[sectionIdx] || [
    `# Complete snippet 1 coming soon!\nprint("Stay tuned")`,
    `# Complete snippet 2 coming soon!\nprint("Stay tuned")`,
    `# Complete snippet 3 coming soon!\nprint("Stay tuned")`,
    `# Complete snippet 4 coming soon!\nprint("Stay tuned")`,
    `# Complete snippet 5 coming soon!\nprint("Stay tuned")`
  ];
};
