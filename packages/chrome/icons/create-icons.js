const fs = require('fs');

// Create simple colored square icons with "CM" text
// This is a placeholder - in production, use proper image generation tools

const createIcon = (size, filename) => {
  // Create a simple HTML file that can be converted to PNG
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    .icon {
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, #2c3e50, #34495e);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      font-weight: bold;
      color: white;
      font-size: ${size * 0.3}px;
      border-radius: ${size * 0.125}px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div class="icon">CM</div>
</body>
</html>`;
  
  fs.writeFileSync(filename.replace('.png', '.html'), html);
  console.log(`Created ${filename.replace('.png', '.html')} - convert to PNG manually`);
};

// Create icons for different sizes
createIcon(16, 'icon-16.png');
createIcon(48, 'icon-48.png');
createIcon(128, 'icon-128.png');

console.log('Icon HTML files created. For now, we\'ll use placeholder files.');
