from flask import Flask, request, jsonify
import joblib
import numpy as np
import cv2
from PIL import Image
import io
from flask_cors import CORS

# Load the trained KNN model and scaler
model = joblib.load('models/new_model_name.pkl')
scaler = joblib.load('models/new_scaler_name.pkl')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def extract_features_from_image(image):
    # Convert PIL Image to OpenCV format
    image_cv = np.array(image.convert('RGB'))
    image_cv = cv2.cvtColor(image_cv, cv2.COLOR_RGB2BGR)

    # Resize and process the image
    new_width, new_height = 112, 129
    resized_image = cv2.resize(image_cv, (new_width, new_height))
    gray_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)
    blurred_image = cv2.GaussianBlur(gray_image, (5, 5), 0)
    edges = cv2.Canny(blurred_image, 50, 150)

    # Extract vertical slice and calculate distances
    center_x = new_width // 2
    vertical_slice = edges[:, center_x]
    top_edge_y = np.min(np.where(vertical_slice > 0)[0])
    bottom_edge_y = np.max(np.where(vertical_slice > 0)[0])
    distance_to_border_top = top_edge_y
    distance_to_border_bottom = new_height - bottom_edge_y

    # Convert pixels to millimeters
    resolution_ppi = 300  # Example value
    pixels_to_mm = 25.4 / resolution_ppi
    distance_to_border_top_mm = distance_to_border_top * pixels_to_mm
    distance_to_border_bottom_mm = distance_to_border_bottom * pixels_to_mm

    return np.array([171, 104, 103, distance_to_border_top_mm, distance_to_border_bottom_mm, 110])

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['image']
        image = Image.open(io.BytesIO(file.read()))
        
        # Extract features from the image
        features = extract_features_from_image(image).reshape(1, -1)
        
        # Scale the features and predict
        scaled_features = scaler.transform(features)
        prediction = model.predict(scaled_features)
        
        return jsonify({'prediction': int(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)



