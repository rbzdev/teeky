"use client";
import { useState } from "react";

// Components
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// Icons
import { Icon } from "@iconify/react";

interface GenerateImageButtonProps {
  invitation: {
    title: string;
    slug: string;
  };
  onClick?: () => void;
}

export default function GenerateImageButton({ invitation, onClick }: GenerateImageButtonProps) {
  const [loading, setLoading] = useState(false);

  // Handle image generation and download
  const handleGenerateImage = async () => {
    try {
      setLoading(true);
      // Envoyer uniquement le slug - les données seront récupérées côté serveur
      const response = await fetch(`/api/generate-image?slug=${invitation.slug}`);

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
      toast.success("Invitation téléchargée avec succès !");

      // Call the optional onClick prop if provided
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Erreur lors de la génération de l'image. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateImage}
    >
      {loading ?
        <div className="flex items-center gap-1 ">
          <Spinner />
          <span> Téléchargement...</span>
        </div>
        :
        <div className="flex items-center gap-1">
          <Icon icon="solar:gallery-download-linear" className="text-xl" />
          <span> Télécharger l'invitation </span>
        </div>
      }
    </Button>
  );
}