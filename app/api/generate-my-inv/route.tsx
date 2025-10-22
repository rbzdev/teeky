import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { formatInvitationDate, formatInvitationTime } from "@/lib/utils";
import QRCode from 'qrcode';
import { prisma } from "@/lib/prisma/client";

// App router includes @vercel/og.
// No need to install it.

// Icônes SVG basées sur Lucide
const CalendarIcon = ({ size = 28, color = "#6b7280" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><g fill="none"><path stroke="currentColor" stroke-width="1.5" d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z" /><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 4V2.5M17 4V2.5M2.5 9h19" /><path fill="currentColor" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0" /></g></svg>
);

const ClockIcon = ({ size = 28, color = "#6b7280" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 64C150 64 64 150 64 256s86 192 192 192s192-86 192-192S362 64 256 64Z" /><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 128v144h96" /></svg>
);

const MapPinIcon = ({ size = 28, color = "#6b7280" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" fill-opacity="0.16" fill-rule="evenodd" d="M6.374 4.809a8.017 8.017 0 0 1 11.258 0c3.15 3.098 3.15 8.056.041 11.113l-5.67 5.578l-5.671-5.578a7.74 7.74 0 0 1 0-11.072zM12 7.5a2 2 0 1 0 0 4a2 2 0 0 0 0-4" clip-rule="evenodd" /><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M17.632 4.809c3.15 3.098 3.15 8.056.042 11.113L12.003 21.5L6.33 15.922a7.74 7.74 0 0 1 0-11.072l.042-.041a8.017 8.017 0 0 1 11.259 0m0 0q-.063-.063 0 0M14 9.5a2 2 0 1 1-4 0a2 2 0 0 1 4 0" /></g></svg>
);

const HeartIcon = ({ size = 32, color = "#dc2626" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M8.106 18.247C5.298 16.083 2 13.542 2 9.137C2 4.274 7.5.825 12 5.501V20.5c-1 0-2-.77-3.038-1.59q-.417-.326-.856-.663" clip-rule="evenodd" opacity="0.5" /><path fill="currentColor" d="M15.038 18.91C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501V20.5c1 0 2-.77 3.038-1.59" /></svg>
);

// ############################################################################################
// ########################## UTILITY FUNCTIONS ###############################################
// ############################################################################################

/**
 * Tronque un texte à un nombre maximum de caractères
 * Coupe au dernier espace pour éviter de couper un mot
 */
function truncateText(text: string | null | undefined, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

// ############################################################################################
// ########################## CUSTOM FONTS FROM GOOGLE ########################################
// ############################################################################################
async function loadGoogleFont(font: string, ...texts: string[]) {
    const text = texts.filter(Boolean).join(' ')
    const url = text
        ? `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
        : `https://fonts.googleapis.com/css2?family=${font}`
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
        // Récupérer le slug du guest depuis les paramètres URL
        const { searchParams } = new URL(request.url);
        const guestSlug = searchParams.get("guestSlug");

        if (!guestSlug) {
            return new Response("Le slug du guest est requis", {
                status: 400,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        // Récupérer les données du guest et de l'invitation depuis la base de données
        const guest = await prisma.guest.findUnique({
            where: { slug: guestSlug },
            select: {
                name: true,
                invitation: {
                    select: {
                        title: true,
                        description: true,
                        hostManName: true,
                        hostWomanName: true,
                        location: true,
                        startsAt: true,
                        slug: true,
                    },
                },
            },
        });

        if (!guest) {
            return new Response("Guest non trouvé", {
                status: 404,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        const { invitation } = guest;
        const guestName = guest.name;
        const { hostManName, hostWomanName, startsAt, slug } = invitation;

        // Tronquer la description et le lieu pour éviter le débordement
        const description = truncateText(
            invitation.description || "Nous avons le plaisir de vous inviter à célébrer notre union dans une ambiance chaleureuse et élégante.",
            260
        );
        const location = truncateText(
            invitation.location || "Lieu de l'événement",
            90
        );

        // Générer le contenu de l'image OG
        const couple = `${hostManName || ''} & ${hostWomanName || ''}`.trim();
        const invStatus = "Invitation personnelle";

        // Format the date
        const formattedDate = formatInvitationDate(startsAt.toISOString());
        const formattedTime = formatInvitationTime(startsAt.toISOString());

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
        const cellSize = 90 / matrixSize; // Ajuster pour tenir dans 90px

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
                        backgroundImage: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #bfdbfe 100%)',
                        padding: '40px',
                    }}
                >
                    {/* Monogramme */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '450px',
                            transform: 'translateX(-50%)',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: '#e2e8f0',
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
                                backgroundColor: '#93c5fd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <HeartIcon />
                        </div>
                    </div>

                    {/* Header avec nom du guest */}
                    <div
                        style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#6b7280',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            marginTop: '20px',
                            marginBottom: '5px',
                            fontFamily: 'Poppins, sans-serif',
                        }}
                    >
                        INVITATION
                    </div>

                    {/* Noms du couple */}
                    <div
                        style={{
                            fontSize: '60px',
                            fontWeight: '300',
                            color: '#1e3a8a',
                            marginBottom: '15px',
                            textAlign: 'center',
                        }}
                    >
                        {couple || 'Monsieur & Madame'}
                    </div>

                    {/* Invitation privée */}
                    <div
                        style={{
                            fontSize: '16px',
                            color: '#6b7280',
                            fontStyle: 'italic',
                            marginBottom: '10px',
                        }}
                    >
                        {invStatus}
                    </div>

                    {/* Ligne de séparation */}
                    <div
                        style={{
                            height: '1px',
                            background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)',
                            margin: '5px 0',
                            width: '40%',

                        }}
                    />

                    {/* Nom du guest */}
                    <div
                        style={{
                            fontSize: '34px',
                            fontWeight: '600',
                            color: '#1e3a8a',
                            marginBottom: '5px',
                            textAlign: 'center',
                        }}
                    >
                        {guestName}
                    </div>

                    {/* Description */}
                    <div
                        style={{
                            fontSize: '32px',
                            color: '#374151',
                            fontStyle: 'italic',
                            textAlign: 'center',
                            maxWidth: '680px',
                            marginBottom: '30px',
                            lineHeight: '1.2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {description}
                    </div>

                    {/* Date et heure */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            padding: '10px 15px',
                            borderRadius: '30px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon />
                        </div>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: '500',
                            color: '#0f172a',
                            marginRight: '40px'
                        }}>
                            {formattedDate}
                        </div>

                        <div style={{ marginRight: '5px', display: 'flex', alignItems: 'center' }}>
                            <ClockIcon />
                        </div>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: '500',
                            color: '#0f172a'
                        }}>
                            {formattedTime}
                        </div>
                    </div>

                    {/* Lieu */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                            padding: '5px 10px',
                            borderRadius: '25px',
                            marginBottom: '40px',
                            maxWidth: '700px',
                        }}
                    >
                        <div style={{ marginRight: '2px', display: 'flex', alignItems: 'center' }}>
                            <MapPinIcon />
                        </div>
                        <div
                            style={{
                                fontSize: '22px',
                                fontWeight: '500',
                                color: '#374151',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {location}
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            fontSize: '14px',
                            color: '#9ca3af',
                            fontWeight: '500',
                            fontFamily: 'Poppins, sans-serif',
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
                            width: '110px',
                            height: '110px',
                            backgroundColor: '#ffffff',
                            borderRadius: '15px',
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
                                width: '90px',
                                height: '90px',
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
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
                                fontSize: '11px',
                                color: '#6b7280',
                                margin: '2px auto',
                                textAlign: 'center',
                                fontWeight: '500',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            Scannez-moi
                        </div>
                    </div>
                </div>
            ),

            // Conifiguration de l'image OG
            {
                width: 900,
                height: 630,
                fonts: [
                    {
                        name: 'Cookie',
                        data: await loadGoogleFont('Cookie', invStatus, description, couple, location, formattedDate, formattedTime, guestName),
                        style: 'normal',
                    },
                    {
                        name: 'Poppins',
                        data: await loadGoogleFont('Poppins:wght@300;400;500;600', `INVITATION Créée avec teeky.vercel.app Scannez-moi`),
                        style: 'normal',
                        weight: 400,
                    },
                ],
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