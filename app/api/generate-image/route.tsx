import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { formatInvitationDate, formatInvitationTime } from "@/lib/utils";
import QRCode from 'qrcode';

// App router includes @vercel/og.
// No need to install it.

// Icônes SVG basées sur Lucide
const CalendarIcon = ({ size = 24, color = "#6b7280" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.94 2c.416 0 .753.324.753.724v1.46c.668-.012 1.417-.012 2.26-.012h4.015c.842 0 1.591 0 2.259.013v-1.46c0-.4.337-.725.753-.725s.753.324.753.724V4.25c1.445.111 2.394.384 3.09 1.055c.698.67.982 1.582 1.097 2.972L22 9H2v-.724c.116-1.39.4-2.302 1.097-2.972s1.645-.944 3.09-1.055V2.724c0-.4.337-.724.753-.724" /><path fill="currentColor" d="M22 14v-2c0-.839-.004-2.335-.017-3H2.01c-.013.665-.01 2.161-.01 3v2c0 3.771 0 5.657 1.172 6.828S6.228 22 10 22h4c3.77 0 5.656 0 6.828-1.172S22 17.772 22 14" opacity="0.5" /><path fill="currentColor" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0" /></svg>
);

const ClockIcon = ({ size = 24, color = "#6b7280" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 0 256 256"><g fill="currentColor"><path d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96" opacity="0.2" /><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 8 8" /></g></svg>
);

const MapPinIcon = ({ size = 24, color = "#6b7280" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke={color} viewBox="0 0 24 24"><path fill="currentColor" d="M17.657 5.304c-3.124-3.073-8.189-3.073-11.313 0a7.78 7.78 0 0 0 0 11.13L12 21.999l5.657-5.565a7.78 7.78 0 0 0 0-11.13M12 13.499c-.668 0-1.295-.26-1.768-.732a2.503 2.503 0 0 1 0-3.536c.472-.472 1.1-.732 1.768-.732s1.296.26 1.768.732a2.503 2.503 0 0 1 0 3.536c-.472.472-1.1.732-1.768.732" /></svg>
);

const HeartIcon = ({ size = 16, color = "#dc2626" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M8.106 18.247C5.298 16.083 2 13.542 2 9.137C2 4.274 7.5.825 12 5.501V20.5c-1 0-2-.77-3.038-1.59q-.417-.326-.856-.663" clip-rule="evenodd" opacity="0.5" /><path fill="currentColor" d="M15.038 18.91C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501V20.5c1 0 2-.77 3.038-1.59" /></svg>
);

// ############################################################################################
// ########################## CUSTOM FONTS FROM GOOGLE ########################################
// ############################################################################################
async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error('failed to load font data')
}


// ############################################################################################
// ########################## ROOT FUNCTION LOGICs  ########################################
// ############################################################################################
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
    const slug = searchParams.get("slug") || "";

    // Format the date if provided
    const formattedDate = formatInvitationDate(startsAt);
    const formattedTime = formatInvitationTime(startsAt);

    // Générer l'URL de l'invitation pour le QR code
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://teeky.vercel.app';
    const invitationUrl = `${baseUrl}/inv/${slug}`;

    // Générer le QR code en matrice pour le rendu direct
    const qrMatrix = QRCode.create(invitationUrl, {
      errorCorrectionLevel: 'M',
      version: undefined,
      maskPattern: undefined,
    });

    const matrixSize = qrMatrix.modules.size;
    const cellSize = 70 / matrixSize; // Ajuster pour tenir dans 70px

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fffbeb',
            backgroundImage: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #fef2f2 100%)',
            padding: '40px',
            fontFamily: 'Georgia, serif',
          }}
        >
          {/* Monogramme */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#fed7aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HeartIcon size={20} color="#dc2626" />
            </div>
          </div>

          {/* Header */}
          <div
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginTop: '80px',
              marginBottom: '30px',
            }}
          >
            INVITATION
          </div>

          {/* Noms du couple */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: '300',
              color: '#1f2937',
              marginBottom: '20px',
              textAlign: 'center',
              fontFamily: 'Georgia, serif',
            }}
          >
            {hostManName && hostWomanName ? `${hostManName} & ${hostWomanName}` : hostManName || hostWomanName || 'Monsieur & Madame'}
          </div>

          {/* Invitation privée */}
          <div
            style={{
              fontSize: '16px',
              color: '#6b7280',
              fontStyle: 'italic',
              marginBottom: '40px',
            }}
          >
            Invitation privée
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '20px',
              color: '#374151',
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: '600px',
              marginBottom: '60px',
              lineHeight: '1.6',
            }}
          >
            {description || "Nous avons le plaisir de vous inviter à célébrer notre union dans une ambiance chaleureuse et élégante."}
          </div>

          {/* Date et heure */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: '20px 40px',
              borderRadius: '30px',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
              <CalendarIcon size={18} color="#6b7280" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937', marginRight: '30px' }}>
              {formattedDate}
            </div>
            <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
              <ClockIcon size={18} color="#6b7280" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937' }}>
              {formattedTime}
            </div>
          </div>

          {/* Lieu */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: '15px 30px',
              borderRadius: '25px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.1)',
              marginBottom: '40px',
            }}
          >
            <div style={{ marginRight: '15px', display: 'flex', alignItems: 'center' }}>
              <MapPinIcon size={18} color="#6b7280" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: '#374151' }}>
              {location || "Lieu de l'événement"}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              fontSize: '12px',
              color: '#9ca3af',
              letterSpacing: '0.15em',
              fontWeight: '500',
            }}
          >
            Créée avec teeky.vercel.app
          </div>

          {/* QR Code - Coin inférieur droit */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '90px',
              height: '90px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* QR Code généré par matrice de carrés */}
            <div
              style={{
                width: '70px',
                height: '70px',
                backgroundColor: '#ffffff',
                position: 'relative',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {Array.from({ length: matrixSize * matrixSize }, (_, i) => {
                const row = Math.floor(i / matrixSize);
                const col = i % matrixSize;
                const isDark = qrMatrix.modules.get(row, col);

                return (
                  <div
                    key={i}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      backgroundColor: isDark ? '#000000' : '#ffffff',
                    }}
                  />
                );
              })}
            </div>
            <div
              style={{
                fontSize: '8px',
                color: '#6b7280',
                marginTop: '2px',
                textAlign: 'center',
                fontWeight: '500',
              }}
            >
              Scanner ici
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630, 
        // fonts: [
        //   {
        //     name: 'Cookie',
        //     data: await loadGoogleFont('Cookie', description),
        //     style: 'normal',
        //   },
        // ],
      }
    );

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