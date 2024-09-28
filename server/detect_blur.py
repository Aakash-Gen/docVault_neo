import pytesseract
from PIL import Image
import numpy as np
import cv2
import sys
import os

# Set the path for pytesseract
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def variance_of_laplacian(image):
    # Compute the Laplacian of the image and return the focus measure
    return cv2.Laplacian(image, cv2.CV_64F).var()

def is_blurry(image_path, threshold=10.0):
    # Load the image from the path
    image = cv2.imread(image_path)
    if image is None:
        return "Error: Image could not be loaded. Check the path."

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Calculate the focus measure
    fm = variance_of_laplacian(gray)

    # Return whether the image is blurry or not
    if fm < threshold:
        return "The image is blurry."
    else:
        return "The image is clear."

def preprocess_image(image):
    # Convert image to NumPy array
    image_np = np.array(image.convert('RGB'))

    # Convert to OpenCV format (BGR)
    image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    # Convert to grayscale
    gray_image = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)

    # Apply binary thresholding
    _, thresh_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Apply GaussianBlur to reduce noise
    blurred_image = cv2.GaussianBlur(thresh_image, (5, 5), 0)

    return gray_image, thresh_image, blurred_image

def extract_text(image_path):
    try:
        # Open image using PIL
        image = Image.open(image_path)
    except Exception as e:
        return "Error: Unable to open image. " + str(e), None, None, None
    
    # Preprocess image
    gray_image, thresh_image, blurred_image = preprocess_image(image)

    # Convert blurred image to PIL Image for pytesseract
    pil_blurred_image = Image.fromarray(blurred_image)

    # Extract text using pytesseract
    text = pytesseract.image_to_string(pil_blurred_image)
    return gray_image, thresh_image, blurred_image, text

def document_type(words, doc_type):
    # Define keywords for each document type
    keywords = {
        "bonafide": ["bonafide", "certificate", "date", "name", "course"]
    }

    # Convert the list of words to a set for efficient lookup
    words_set = set(word.lower() for word in words)  # Convert to lower case to handle case insensitivity

    if doc_type in keywords:
        required_keywords = set(keyword.lower() for keyword in keywords[doc_type])  # Convert to lower case

        # Check if all required keywords are present in the words set
        missing_keywords = required_keywords - words_set

        if len(missing_keywords) == 0:
            return "Document passed OCR test"
        else:
            return "Document rejected in OCR test. Missing keywords: " + ', '.join(missing_keywords)
    else:
        return "Error: Document type not recognized."

def text_to_word_array(text):
    # Remove unwanted characters and extra whitespace
    cleaned_text = text.replace('\n', ' ').replace(':', ' ').strip()

    # Split the text into words
    words = cleaned_text.split()

    return words

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    try:
        # Check if the image is blurry
        blur_result = is_blurry(image_path)
        
        if blur_result == "The image is blurry.":
            print(blur_result)
            sys.exit(0)  # Exit if the image is blurry
        
        print(blur_result)
        
        # Extract text and process image
        gray_image, thresh_image, blurred_image, text = extract_text(image_path)
        print(text)
        
        if text is None:
            print(gray_image)  # Display error message if image extraction failed
        else:
            words = text_to_word_array(text)
            document_result = document_type(words, "bonafide")
            print(f"Blurriness Status: {blur_result}")
            print(f"OCR Test Result: {document_result}")

    except Exception as e:
        print("Unexpected error:", str(e))
