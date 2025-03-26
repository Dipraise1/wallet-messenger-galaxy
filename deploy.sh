#!/bin/bash

# Build the application
echo "Building application..."
npm run build-all

# Create a production directory if it doesn't exist
if [ ! -d "production" ]; then
  mkdir production
fi

# Copy the dist directory to production
echo "Copying files to production directory..."
cp -r dist/* production/

# Create a production start script
echo "Creating production start script..."
cat > production/start-prod.sh << EOL
#!/bin/bash
# Start the server
node server/server.js
EOL

# Make the script executable
chmod +x production/start-prod.sh

echo "Deployment complete! Files are in the production directory."
echo "To start the application in production mode, run:"
echo "cd production && ./start-prod.sh" 