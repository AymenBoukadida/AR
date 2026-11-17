# Deployment and phone testing

## Static hosting

The production build is in `dist/` after running `npm run build`. It can be hosted on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or another static host.

Camera access requires a secure context. Production hosting must use HTTPS.

## Phone testing on a local network

1. Connect the phone and computer to the same Wi-Fi network.
2. Run `npm run dev:phone`.
3. Open the HTTPS network URL printed by Vite on the phone.
4. Accept the local development certificate warning if the browser presents one.
5. Open `/marker.html` on a second screen — a laptop, tablet, or printed sheet.
6. Allow camera permission and point the phone at the marker.

If the phone cannot connect, check the Windows firewall and confirm that Vite is listening on `0.0.0.0` rather than only `localhost`.

## Marker page

`/marker.html` renders the Hiro pattern on a quiet white card with print styles.

- Show it on a second device, or print it with the browser print dialog.
- Keep the white space around the square visible; cropping it breaks recognition.
- Hold the phone 20–30 cm away and fill roughly two thirds of the scan frame.
- Avoid glossy screens and direct light on the marker.
- The page warns when it is opened on a small touch device, because a phone cannot scan its own display.

The marker page is static HTML and does not require JavaScript for the marker itself. Vite copies it to `dist/marker.html` during the build.

## Demo progression

The pilot campaign uses the same Hiro marker for all five stops. Each successful scan marks the next undiscovered collectible, so one marker completes the whole museum. This is intentional for demos and testing. A real venue deployment should assign a unique marker or QR identifier per stop.

## Permission recovery

- `granted` starts the scanner.
- `prompt` requests camera access through `getUserMedia`.
- `denied` shows instructions to allow camera access in browser site settings.
- `unsupported` means the browser has no usable camera API.
- `unavailable` means the page is not in a secure context or the camera cannot currently be used.

The scanner shows a **Try again** action for recoverable states, and the collection remains usable when the camera is unavailable.

## PWA behavior

The manifest enables installation on supported browsers. The service worker caches the application shell after the first successful load. If service-worker registration or caching fails, the normal online web experience still loads.
