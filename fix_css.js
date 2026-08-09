const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf-8');

// The themes to remove
const themesToRemove = ["hawkins-83", "dark-moon", "gods-among-us", "dualsense-horizon"];

for (const theme of themesToRemove) {
    // We want to remove blocks like:
    // [data-theme="theme"] { ... }
    // Or /* ... */ followed by [data-theme="theme"]
    
    // It's probably easier to just read line by line and skip when inside a block to remove
}
