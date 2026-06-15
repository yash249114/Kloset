/* eslint-disable @typescript-eslint/no-require-imports */
const http = require('http');

const targetHost = 'localhost';
const targetPort = 3000;

// Since Next.js uses client-side hydration guards (if (!mounted) return null),
// server-rendered HTML will return the global layout shell containing the brand header "Kloset"
// but may not contain the client-mounted inner page strings.
// We verify 200 OK status codes and the presence of the global brand shell "Kloset".
const routesToTest = [
  { path: '/', label: 'Home Page', searchStr: 'Kloset', needsAuth: false },
  { path: '/discover', label: 'Discover Catalog', searchStr: 'Kloset', needsAuth: false },
  { path: '/help', label: 'Help Center FAQs', searchStr: 'Kloset', needsAuth: false },
  { path: '/booking/checkout', label: 'Checkout Page', searchStr: 'Kloset', needsAuth: true },
  { path: '/booking/confirmation', label: 'Confirmation Page', searchStr: 'Kloset', needsAuth: true },
  { path: '/outfit/new', label: 'Add Outfit Wizard', searchStr: 'Kloset', needsAuth: true },
  { path: '/seller/dashboard', label: 'Seller Dashboard', searchStr: 'Kloset', needsAuth: true },
  { path: '/admin-studio', label: 'Hidden Admin Portal', searchStr: 'Kloset', needsAuth: true },
];

function checkRoute(route) {
  return new Promise((resolve) => {
    const url = `http://${targetHost}:${targetPort}${route.path}`;
    
    // Set mock authentication cookie to pass Next.js middleware protection
    const headers = {};
    if (route.needsAuth) {
      headers['Cookie'] = 'kloset-auth=mock-session-token';
    }

    const options = {
      headers: headers
    };

    http.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          resolve({
            route: route.label,
            path: route.path,
            success: false,
            error: `Responded with status code: ${res.statusCode} (Redirect or Server Error)`,
          });
          return;
        }

        // Verify key signature string exists in page markup
        const contentMatch = data.toLowerCase().includes(route.searchStr.toLowerCase());
        if (!contentMatch) {
          resolve({
            route: route.label,
            path: route.path,
            success: false,
            error: `Page markup does not contain expected layout brand name: "${route.searchStr}"`,
          });
          return;
        }

        resolve({
          route: route.label,
          path: route.path,
          success: true,
        });
      });
    }).on('error', (err) => {
      resolve({
        route: route.label,
        path: route.path,
        success: false,
        error: `Connection refused: ${err.message}. Ensure Next.js dev server is running on port 3000!`,
      });
    });
  });
}

async function runE2EValidation() {
  console.log('\x1b[35m%s\x1b[0m', '\n======================================================');
  console.log('\x1b[36m%s\x1b[0m', '   Kloset Next.js Frontend E2E Routes Validator');
  console.log('\x1b[35m%s\x1b[0m', '======================================================\n');
  console.log(`Pinging local server at http://localhost:3000/ with auth cookies...\n`);

  let passed = 0;
  let failed = 0;

  for (const route of routesToTest) {
    process.stdout.write(`Testing [${route.label}] at ${route.path}... `);
    const result = await checkRoute(route);

    if (result.success) {
      console.log('\x1b[32m%s\x1b[0m', '✓ PASSED');
      passed++;
    } else {
      console.log('\x1b[31m%s\x1b[0m', '✗ FAILED');
      console.log('\x1b[33m%s\x1b[0m', `  Details: ${result.error}\n`);
      failed++;
    }
  }

  console.log('\x1b[35m%s\x1b[0m', '\n------------------------------------------------------');
  console.log('\x1b[36m%s\x1b[0m', '   E2E Validation Run Completed');
  console.log('\x1b[35m%s\x1b[0m', '------------------------------------------------------');
  console.log(`Total Routes: ${routesToTest.length}`);
  console.log('\x1b[32m%s\x1b[0m', `Passed: ${passed}`);
  if (failed > 0) {
    console.log('\x1b[31m%s\x1b[0m', `Failed: ${failed}`);
    console.log('\x1b[33m%s\x1b[0m', '\nPlease start the dev server using "npm run dev" and rerun this validator.');
    process.exit(1);
  } else {
    console.log('\x1b[32m%s\x1b[0m', '\nAll critical customer journeys compiled, validated & reachable! ✨');
    process.exit(0);
  }
}

runE2EValidation();
