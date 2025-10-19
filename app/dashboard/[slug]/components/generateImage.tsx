"use client";

import { Button } from "@/components/ui/button";

interface GenerateImageButtonProps {
  invitation: {
    title: string;
    description?: string | null;
    hostManName?: string | null;
    hostWomanName?: string | null;
    location?: string | null;
    startsAt: Date;
    theme?: string | null;
  };
  onClick?: () => void;
}

export default function GenerateImageButton({ invitation, onClick }: GenerateImageButtonProps) {
  const handleGenerateImage = async () => {
    try {
      // Build query parameters with invitation data
      const params = new URLSearchParams({
        title: invitation.title,
        description: invitation.description || '',
        hostManName: invitation.hostManName || '',
        hostWomanName: invitation.hostWomanName || '',
        location: invitation.location || '',
        startsAt: invitation.startsAt.toISOString(),
        theme: invitation.theme || 'classic',
      });

      // Call the API to generate the image
      const response = await fetch(`/api/generate-image?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      // Get the image blob
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invitation-${invitation.title.replace(/\s+/g, '-').toLowerCase()}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Call the optional onClick prop if provided
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Erreur lors de la génération de l'image. Veuillez réessayer.");
    }
  };

  return (
    <Button
      onClick={handleGenerateImage}
    >
      Générer une image
    </Button>
  );
}