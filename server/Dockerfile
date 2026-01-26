# Set the base image to Python
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install the dependencies with extended timeout for large ML packages
RUN pip install --no-cache-dir --timeout=600 --retries=3 -r requirements.txt

# Copy the application code
COPY . .

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
