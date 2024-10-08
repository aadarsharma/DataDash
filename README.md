# DataDash

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **MongoDB** (local or cloud instance)

### Environment Setup

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   ```

2. **Backend Setup**

   - Navigate to the backend directory:
     ```bash
     cd backend
     npm install
     ```

   - Copy the environment variable file template and configure it:
     ```bash
     cp .env.example .env
     ```

   - Open the `.env` file and fill in the following details:
     ```bash
     PORT=<your_preferred_port>
     MONGO_URI=<your_mongo_connection_string>
     ```

3. **Frontend Setup**

   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     npm install
     ```

   - Copy the environment variable file template and configure it:
     ```bash
     cp .env.example .env
     ```

   - Open the `.env` file and update the following:
     ```bash
     VITE_API_URL='http://localhost:5000/api/transactions'
     ```

### Running the Application

1. **Start the Development Server**

   From the root directory, run the following command to start both the backend and frontend servers:
   ```bash
   npm run dev
   ```

### API Documentation

For detailed information about the API endpoints, refer to the documentation file [here](./public/api.md).
