import { NextRequest } from "next/server";
import sharp from "sharp";
import { formatInvitationDate, formatInvitationTime } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // Récupérer les données depuis les paramètres URL
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Invitation";
    const description = searchParams.get("description") || "Vous êtes invité";
    const hostManName = searchParams.get("hostManName") || "";
    const hostWomanName = searchParams.get("hostWomanName") || "";
    const location = searchParams.get("location") || "";
    const startsAt = searchParams.get("startsAt");

    // Fonction pour échapper les entités XML
    const escapeXml = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    // Fonction pour diviser le texte en lignes
    const wrapText = (text: string, maxCharsPerLine: number = 50): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);

      return lines;
    };

    // Format the date if provided
    const formattedDate = formatInvitationDate(startsAt);
    const formattedTime = formatInvitationTime(startsAt);

    // Créer le SVG de l'invitation Classic
    const svgContent = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Fond gradient Classic -->
          <linearGradient id="classicBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fffbeb;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fef2f2;stop-opacity:1" />
          </linearGradient>

          <!-- Monogramme shadow -->
          <filter id="monogramShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.1)"/>
          </filter>

          <!-- Pilule shadow -->
          <filter id="pillShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.08)"/>
          </filter>
        </defs>

        <!-- Fond principal -->
        <rect width="1200" height="630" fill="url(#classicBg)"/>

        <!-- Monogramme / cœur en haut -->
        <circle cx="600" cy="40" r="28" fill="#d97706" filter="url(#monogramShadow)"/>
        <circle cx="600" cy="40" r="20" fill="#fed7aa"/>
        <path d="M600 25 C595 20, 585 20, 585 28 C585 32, 590 38, 600 45 C610 38, 615 32, 615 28 C615 20, 605 20, 600 25 Z"
              fill="#dc2626"/>

        <!-- Conteneur principal -->
        <rect x="150" y="80" width="900" height="480" rx="24" ry="24" fill="none"/>

        <!-- Header -->
        <text x="600" y="100" text-anchor="middle" font-family="serif" font-size="14"
              fill="#6b7280" letter-spacing="0.25em" text-transform="uppercase" font-weight="500">
          INVITATION
        </text>

        <!-- Noms du couple -->
        <text x="600" y="160" text-anchor="middle" font-family="serif" font-size="48"
              font-weight="300" letter-spacing="-0.02em" fill="#1f2937">
          ${escapeXml(hostManName && hostWomanName ? `${hostManName} & ${hostWomanName}` : hostManName || hostWomanName || 'Monsieur & Madame')}
        </text>

        <!-- Invitation privée -->
        <text x="600" y="200" text-anchor="middle" font-family="serif" font-size="16"
              fill="#6b7280" font-style="italic">
          Invitation privée
        </text>

        <!-- Ligne décorative -->
        <line x1="520" y1="225" x2="680" y2="225" stroke="#d1d5db" stroke-width="1"/>

        <!-- Description -->
        <text x="600" y="250" text-anchor="middle" font-family="serif" font-size="20"
              fill="#374151" font-style="italic" line-height="1.6">
          ${wrapText(escapeXml(description || "Nous avons le plaisir de vous inviter à célébrer notre union dans une ambiance chaleureuse et élégante."), 45)
            .map((line, index) => `<tspan x="600" dy="${index === 0 ? '0' : '1.4em'}">${line}</tspan>`)
            .join('')}
        </text>

        <!-- Pilule date et heure -->
        <rect x="350" y="450" width="500" height="60" rx="30" ry="30"
              fill="rgba(255,255,255,0.8)" stroke="rgba(0,0,0,0.1)" stroke-width="1"
              filter="url(#pillShadow)"/>

        <!-- Icône calendrier dans la pilule -->
        <circle cx="400" cy="480" r="12" fill="#6b7280"/>
        <rect x="394" y="474" width="4" height="4" fill="white"/>
        <rect x="400" y="474" width="4" height="4" fill="white"/>
        <rect x="394" y="480" width="10" height="2" fill="white"/>
        <line x1="394" y1="478" x2="394" y2="476" stroke="white" stroke-width="1"/>
        <line x1="398" y1="478" x2="398" y2="476" stroke="white" stroke-width="1"/>
        <line x1="402" y1="478" x2="402" y2="476" stroke="white" stroke-width="1"/>
        <line x1="404" y1="478" x2="404" y2="476" stroke="white" stroke-width="1"/>

        <!-- Date -->
        <text x="430" y="488" text-anchor="start" font-family="serif" font-size="18"
              fill="#1f2937" font-weight="500">
          ${escapeXml(formattedDate)}
        </text>

        <!-- Séparateur -->
        <circle cx="600" cy="480" r="3" fill="#6b7280"/>

        <!-- Icône horloge dans la pilule -->
        <circle cx="720" cy="480" r="12" fill="#6b7280"/>
        <circle cx="720" cy="480" r="8" fill="white"/>
        <line x1="720" y1="480" x2="720" y2="475" stroke="#6b7280" stroke-width="1"/>
        <line x1="720" y1="480" x2="725" y2="480" stroke="#6b7280" stroke-width="1"/>

        <!-- Heure -->
        <text x="750" y="488" text-anchor="start" font-family="serif" font-size="18"
              fill="#1f2937" font-weight="500">
          ${escapeXml(formattedTime)}
        </text>

        <!-- Pilule lieu -->
        <rect x="350" y="530" width="500" height="50" rx="25" ry="25"
              fill="rgba(255,255,255,0.8)" stroke="rgba(0,0,0,0.1)" stroke-width="1"
              filter="url(#pillShadow)"/>

        <!-- Icône localisation dans la pilule -->
        <circle cx="400" cy="555" r="12" fill="#6b7280"/>
        <path d="M470 545 L465 550 L470 560 L475 550 Z" fill="white"/>
        <circle cx="400" cy="552" r="2" fill="#6b7280"/>

        <!-- Lieu -->
        <text x="490" y="563" text-anchor="start" font-family="serif" font-size="18"
              fill="#374151" font-weight="500">
          ${escapeXml(location || "Lieu de l'événement")}
        </text>

        <!-- Footer -->


        <text x="600" y="610" text-anchor="middle" font-family="serif" font-size="12"
              fill="#9ca3af" letter-spacing="0.15em" text-transform="uppercase" font-weight="500">
          Créée avec teeky.vercel.app
        </text>      </svg>
    `;

    // Générer l'image avec Sharp (optimisé pour Vercel)
    const imageBuffer = await sharp(Buffer.from(svgContent), {
      limitInputPixels: 1200 * 630 * 4, // Limiter les pixels d'entrée
    })
      .png({
        quality: 90, // Réduire légèrement la qualité pour économiser mémoire
        compressionLevel: 9, // Compression maximale
        progressive: false, // Désactiver le progressif pour économiser mémoire
      })
      .toBuffer();

    // Retourner l'image
    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300', // Cache 5 minutes
      },
    });

  } catch (error) {
    console.error('Erreur lors de la génération de l\'image:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // Retourner une réponse d'erreur détaillée pour le développement
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = isDevelopment
      ? `Erreur détaillée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      : 'Erreur lors de la génération de l\'image';

    return new Response(errorMessage, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}