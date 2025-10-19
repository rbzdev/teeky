import { NextRequest } from "next/server";
import sharp from "sharp";

// Test simple pour vérifier que Sharp fonctionne
export async function GET(request: NextRequest) {
  try {
    const svg = `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="100" fill="#ff0000"/>
      <text x="100" y="50" text-anchor="middle" fill="white" font-size="20">Test Sharp</text>
    </svg>`;

    const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(new Uint8Array(buffer), {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    return new Response(`Erreur: ${error}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}