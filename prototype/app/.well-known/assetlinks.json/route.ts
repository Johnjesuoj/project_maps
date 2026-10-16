import { NextResponse } from "next/server";

// Digital Asset Links — lets the Android TWA verify s-maps.netlify.app
// and run fullscreen without a URL bar. Fingerprint = smaps-release.keystore.
export async function GET() {
  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.johnjesuoj.smaps",
          sha256_cert_fingerprints: [
            "55:03:14:79:61:51:A3:93:61:46:09:6E:C7:A7:9B:71:FF:C6:7B:A2:D3:0B:A5:7D:53:26:B0:A1:76:3D:7B:03",
          ],
        },
      },
    ],
    { headers: { "Content-Type": "application/json" } }
  );
}
