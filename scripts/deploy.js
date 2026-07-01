const fs = require('fs');
const path = require('path');

const profiles = [
  'marie-dubois',
  'amin-hassani',
  'clara-voss',
  'isabelle-frost',
  'kofi-mensah',
  'nadia-okafor',
  'thomas-renard',
  'rafael-santos',
  'lea-moreau',
  'yuki-tanaka'
];

const distDir = path.join(__dirname, '..', 'dist');
const profilesDir = path.join(__dirname, '..', 'packages', 'profiles');

// Create dist directory
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create root index.html
const rootHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cinema SOTD — Filmmaker Portfolios</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #fff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    h1 { 
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #fff 0%, #888 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #666;
      margin-bottom: 3rem;
      font-size: 0.9rem;
      letter-spacing: 0.1em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      width: 100%;
    }
    .card {
      background: #111;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 1.5rem;
      text-decoration: none;
      color: #fff;
      transition: all 0.3s ease;
    }
    .card:hover {
      border-color: #444;
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    }
    .card-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .card-role {
      color: #888;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }
    .card-brand {
      color: #555;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    .footer {
      margin-top: 4rem;
      color: #444;
      font-size: 0.75rem;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Cinema SOTD</h1>
  <p class="subtitle">10 Filmmaker Portfolios</p>
  <div class="grid">
    <a href="/marie-dubois/" class="card">
      <div class="card-name">Marie Dubois</div>
      <div class="card-role">Director & Visual Poet</div>
      <div class="card-brand">Dubois Films</div>
    </a>
    <a href="/amin-hassani/" class="card">
      <div class="card-name">Amin Hassani</div>
      <div class="card-role">Sound Designer</div>
      <div class="card-brand">Sonic Architecture</div>
    </a>
    <a href="/clara-voss/" class="card">
      <div class="card-name">Clara Voss</div>
      <div class="card-role">Editor</div>
      <div class="card-brand">The Voss Edit</div>
    </a>
    <a href="/isabelle-frost/" class="card">
      <div class="card-name">Isabelle Frost</div>
      <div class="card-role">Casting Director</div>
      <div class="card-brand">Frost Casting</div>
    </a>
    <a href="/kofi-mensah/" class="card">
      <div class="card-name">Kofi Mensah</div>
      <div class="card-role">Cinematographer</div>
      <div class="card-brand">Mensah Lens</div>
    </a>
    <a href="/nadia-okafor/" class="card">
      <div class="card-name">Nadia Okafor</div>
      <div class="card-role">Costume Designer</div>
      <div class="card-brand">Okafor Costume</div>
    </a>
    <a href="/thomas-renard/" class="card">
      <div class="card-name">Thomas Renard</div>
      <div class="card-role">Producer</div>
      <div class="card-brand">Renard Production</div>
    </a>
    <a href="/rafael-santos/" class="card">
      <div class="card-name">Rafael Santos</div>
      <div class="card-role">Composer</div>
      <div class="card-brand">Santos Compositions</div>
    </a>
    <a href="/lea-moreau/" class="card">
      <div class="card-name">Léa Moreau</div>
      <div class="card-role">Screenwriter</div>
      <div class="card-brand">Moreau Scripts</div>
    </a>
    <a href="/yuki-tanaka/" class="card">
      <div class="card-name">Yuki Tanaka</div>
      <div class="card-role">Production Designer</div>
      <div class="card-brand">Tanaka Design</div>
    </a>
  </div>
  <div class="footer">
    <p>© Norman James · made with ❤️ by Empathy Studio +91 9833274308</p>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), rootHtml);

// Copy each profile's dist to root dist
profiles.forEach(profile => {
  const profileDist = path.join(profilesDir, profile, 'dist');
  const targetDir = path.join(distDir, profile);
  
  if (fs.existsSync(profileDist)) {
    console.log(`Copying ${profile}...`);
    copyDirSync(profileDist, targetDir);
  } else {
    console.log(`Warning: ${profile}/dist not found, skipping`);
  }
});

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

console.log('Deployment build complete!');
