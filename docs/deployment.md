# Deployment and phone testing

## Static hosting

The production build is in `dist/` after running `npm run build`. It can be hosted on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or another static host.

Camera access requires a secure context. Production hosting must use HTTPS.

## Phone testing on a local network

1. Connect the phone and computer to the same Wi-Fi network.
2. Run `npm run dev:phone`.
3. Open the HTTPS network URL printed by Vite on the phone.
4. Accept the local development certificate warning if the browser presents one.
5. Allow camera permission.
6. Scan `pattern-hiro.png`.

If the phone cannot connect, check the Windows firewall and confirm that Vite is listening on `0.0.0.0` rather than only `localhost`.

## Permission recovery

- `granted` starts the scanner.
- `prompt` requests camera access through `getUserMedia`.
- `denied` shows instructions to allow camera access in browser site settings.
- `unsupported` means the browser has no usable camera API.
- `unavailable` means the page is not in a secure context or the camera cannot currently be used.

The collection panel remains usable when the camera is unavailable.

## PWA behavior

The manifest enables installation on supported browsers. The service worker caches the application shell after the first successful load. If service-worker registration or caching fails, the normal online web experience still loads.
