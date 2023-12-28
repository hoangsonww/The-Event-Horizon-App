import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

data = {
    'event_type': ['music', 'sports', 'music', 'theatre', 'sports', 'theatre'],
    'user_age': [25, 30, 22, 40, 35, 29],
    'attended': [1, 0, 1, 0, 1, 0]  # 1 for attended, 0 for not attended
}

df = pd.DataFrame(data)

# Feature and target variables
X = df[['event_type', 'user_age']]
y = df['attended']

# Encoding categorical data
X = pd.get_dummies(X)

# Splitting the dataset into the Training set and Test set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# Fitting Random Forest Classification to the Training set
classifier = RandomForestClassifier(n_estimators=10, criterion='entropy', random_state=0)
classifier.fit(X_train, y_train)

# Predicting the Test set results
y_pred = classifier.predict(X_test)

# Evaluating the Algorithm
print(f'Accuracy: {accuracy_score(y_test, y_pred)}')

# Example of predicting a new observation
new_data = pd.DataFrame({
    'event_type_music': [0],
    'event_type_sports': [1],
    'event_type_theatre': [0],
    'user_age': [28]
})
print(f'Predicted attendance: {classifier.predict(new_data)[0]}')
