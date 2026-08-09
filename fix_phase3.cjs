const fs = require('fs');
let code = fs.readFileSync('src/components/Phase3Panel.tsx', 'utf-8');

const startUI = code.indexOf('{/* Dynamic Past Paper Track suite similar to Syllabus Tracker */}');
console.log('startUI', startUI);

const endUI = code.lastIndexOf('</div>\n    </div>\n  );\n}');
console.log('endUI', endUI);

if (startUI !== -1) {
  let end = code.lastIndexOf('</div>\n    </div>\n  );\n}');
  if (end === -1) {
      end = code.lastIndexOf('  );\n}');
      end = code.lastIndexOf('</div>', end) - 1; 
      end = code.lastIndexOf('</div>', end) - 1; 
  }
  
  if (end !== -1) {
      code = code.substring(0, startUI) + '<PastPaperChecklist userSubjects={userSubjects} username={username} />\n    </div>\n  );\n}';
      fs.writeFileSync('src/components/Phase3Panel.tsx', code);
  }
}
