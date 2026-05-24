# #!/bin/bash

# # Navigate to the dist directory
# cd dist

# # Find and replace import statements in JavaScript files
# find . -type f -name "*.js" -exec sed -i 's/"@\/\([^"]*\)"/"\.\/\1.js"/g' {} +

# # Navigate back to the project root directory
# cd ..

#!/bin/bash

# Navigate to the dist directory
cd dist

# Find and replace import statements in JavaScript files
find . -type f -name "*.js" -exec sed -i -E 's/"(@\/[^"]*)"/"\1.js"/;t;d' {} +
find . -type f -name "*.js" -exec sed -i -E 's/"(\.\/[^"]*)"/"\1.js"/;t;d' {} +

# Navigate back to the project root directory
cd ..

