
# DocVault

Streamlining the process of issuing verifiable onchain documents.

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Python](https://www.python.org/) installed
- Metamask browser extension

## Running the Project Locally

Follow these steps to run the project locally:
- Root directory: `code/`

### Step 0: Set Up Python Virtual Environment

1. Navigate to the `code` directory:

    ```bash
    cd code
    ```

2. Create a virtual environment. Replace `venv` with your preferred environment name if desired:

    ```bash
    python -m venv venv
    ```

3. Activate the virtual environment:

    - On Windows:

        ```bash
        venv\Scripts\activate
        ```

    - On macOS/Linux:

        ```bash
        source venv/bin/activate
        ```

4. Install Python dependencies from `requirements.txt`:

    ```bash
    pip install -r requirements.txt
    ```

5. Install Node.js dependencies:

    ```bash
    npm install
    ```

### Step 1: Start the Server

1. Navigate to the `server` directory:

    ```bash
    cd server
    ```

2. Run the server with Node.js:

    ```bash
    node index.js
    ```

3. In the same directory, run the Python application:

    ```bash
    python app.py
    ```

### Step 2: Start the Certificate Backend

1. Open a new terminal window or tab.

2. Navigate to the `certificate-backend` directory:

    ```bash
    cd certificate-backend
    ```

3. Run the backend server with Node.js:

    ```bash
    node server.mjs
    ```

### Step 3: Start the React App

1. Open a new terminal window or tab.

2. Run the command:

    ```bash
    npm run dev
    ```

## Additional Notes

- Make sure you have all required dependencies installed before running the project.
- If you encounter any issues, check the console logs for error messages and troubleshoot accordingly.

## Contact

If you have any questions or need further assistance, feel free to reach out to the maintainers.
