import pandas as pd
import pickle

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier

data = pd.read_csv("winequality-red.csv", sep=";")

# Separate features and target
X = data.drop("quality", axis=1)
y_raw = data["quality"]

label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y_raw)

# split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# XGBoost model
model = XGBClassifier(
    n_estimators=500,
    learning_rate=0.03,
    max_depth=6,
    subsample=0.9,
    colsample_bytree=0.9,
    objective="multi:softprob",
    num_class=len(set(y)),
    random_state=42,
    eval_metric="mlogloss",
    use_label_encoder=False
)

# scaling + model)
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", model)
])


cv_scores = cross_val_score(pipeline, X, y, cv=5)
print(f"Cross Validation Accuracy: {cv_scores.mean():.4f}")

# Train model
pipeline.fit(X_train, y_train)

# Testing
y_pred = pipeline.predict(X_test)
test_accuracy = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {test_accuracy:.4f}")

# Save pipeline
with open("wine_model.pkl", "wb") as f:
    pickle.dump(pipeline, f)

with open("label_encoder.pkl", "wb") as f:
    pickle.dump(label_encoder, f)

print("Model saved as wine_model.pkl")
print("Label encoder saved as label_encoder.pkl")
