import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error during prediction:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit">Predict</button>
      </form>

      {prediction !== null && (
        <div>
          <h3>Prediction: {prediction}</h3>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;

