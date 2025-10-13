# Système de Models (thèmes d'invitations)

Ce document explique comment fonctionnent les « Models » (thèmes d'invitations) dans ce projet, comment ils sont conçus, comment ils sont sélectionnés et comment en ajouter facilement de nouveaux.

## Vue d'ensemble

- Emplacement des modèles: `app/inv/Models/`
  - Exemples existants: `minimalist.tsx`, `elegant.tsx`, `classic.tsx`
- Sélecteur/registre: `app/inv/Models/renderer.tsx`
  - Fournit `InvitationModelRenderer` qui choisit le composant de modèle à rendre en fonction d'une clé de thème (string).
  - Contient un petit registre des modèles connus (clé → composant) et un fallback par défaut sur `minimalist` si la clé est inconnue.
- Types partagés: `lib/types/invitation.ts`
  - Props communes des modèles: `MinimalistInvitationProps` (réutilisées par tous les modèles)
  - Clé de modèle: `InvitationModelKey` (de type `string` pour autoriser n'importe quel thème)

## Contrat de props d'un modèle

Tous les modèles acceptent le même contrat de props (type `MinimalistInvitationProps`):

- `title?: string`
- `hostManName?: string`
- `hostWomanName?: string`
- `description?: string`
- `location?: string`
- `coordinate?: string[]`
- `startsAt: string | Date` (Date ou ISO string; les modèles gèrent la conversion en `Date` côté client si nécessaire)

Bonnes pratiques:
- Les modèles sont des composants client (`"use client"`) pour bénéficier du formatage local (date/heure) côté navigateur.
- Garder les composants courts, accessibles et stylés avec Tailwind.
- Éviter de faire des effets secondaires dans les modèles (ils doivent être purement présentiels).

## Sélection du modèle (theme)

La clé de thème est une chaîne libre (ex: `"minimalist"`, `"elegant"`, `"classic"`, `"mon-theme"`, ...).

- Lors de la création:
  - Le brouillon (context) contient `draft.theme` (par défaut `"minimalist"`).
  - Le rendu de l'aperçu (preview) utilise `InvitationModelRenderer` avec `model={draft.theme}`.
  - Le formulaire de création envoie `theme` au serveur; l'action serveur persiste cette valeur en base (`Invitation.theme`).

- Dans le dashboard (lecture):
  - La page `app/dashboard/[slug]/page.tsx` récupère l'invitation et passe `invitation.theme` au `InvitationModelRenderer`.
  - Si la clé n'est pas reconnue par le registre, le renderer tombe automatiquement sur le modèle `minimalist`.

## Fonctionnement du renderer

Fichier: `app/inv/Models/renderer.tsx`

- Expose `InvitationModelRenderer` qui reçoit:
  - `model?: InvitationModelKey` (clé de thème, string)
  - Les props communes (`MinimalistInvitationProps`)
- Interne: un `registry` mappe les clés connues vers leurs composants (ex: `{ minimalist, elegant, classic }`).
- Logique: `const Cmp = registry[model] ?? Minimalist` → fallback si clé inconnue.

Ainsi, vous pouvez introduire de nouvelles clés immédiatement (elles fonctionneront avec le fallback) et ensuite enregistrer le composant correspondant pour activer le rendu dédié.

## Ajouter un nouveau modèle (étapes)

1) Créer un composant dans `app/inv/Models/` (ex: `boho.tsx`)

```tsx
 "use client"
 import * as React from 'react'
 import type { MinimalistInvitationProps as BohoProps } from '@/lib/types/invitation'

 export default function BohoInvitationModel(props: BohoProps) {
   const startsAtDate = React.useMemo(
     () => (typeof props.startsAt === 'string' ? new Date(props.startsAt) : props.startsAt),
     [props.startsAt]
   )

   return (
     <div className="rounded-xl border bg-card p-8">
       {/* Votre mise en page et vos styles ici */}
       <h2 className="text-3xl font-semibold">{[props.hostManName, props.hostWomanName].filter(Boolean).join(' & ') || 'Monsieur & Madame'}</h2>
       {/* ... contenu ... */}
     </div>
   )
 }
```

2) L'enregistrer dans le renderer

Dans `app/inv/Models/renderer.tsx`:

```tsx
 import Boho from './boho'

 const registry = {
   // modèles existants
   minimalist: Minimalist,
   elegant: Elegant,
   classic: Classic,
   // nouveau modèle
   boho: Boho,
 }
```

3) Optionnel: exposer la clé dans l'UI

- Prévisualisation (create): ajouter la clé dans la datalist des thèmes connus pour l'autocomplétion.
- Formulaire: si vous avez un champ pour choisir le thème, il suffit de stocker la string dans le draft (`draft.theme`) puis elle sera envoyée au serveur.

C'est tout! La clé `"boho"` sera rendue par le modèle `Boho` là où elle est utilisée (preview, dashboard).

## Notes sur `startsAt` et fuseaux horaires

- Côté création, `startsAt` est construit à partir de la date + l'heure locales et sérialisé avec l'offset du fuseau (ex: `2025-10-10T12:00:00.000+02:00`).
- Côté modèle, on convertit `startsAt` en `Date` côté client et on utilise `toLocaleDateString`/`toLocaleTimeString` pour respecter le fuseau de l'utilisateur.

## Edge cases et conseils

- Clé de thème inconnue → fallback automatique sur `minimalist` (rendu assuré).
- Si vous ajoutez un modèle mais oubliez de l'enregistrer dans le renderer, utilisez quand même sa clé: le fallback s'appliquera jusqu'à l'enregistrement.
- Gardez les modèles autonomes et sans effets (juste du rendu). Le formatage et les calculs lourds restent en dehors.
- Typage strict: utilisez toujours `MinimalistInvitationProps` pour garder la compatibilité avec le renderer.

## Références de fichiers

- Modèles: `app/inv/Models/`
- Renderer: `app/inv/Models/renderer.tsx`
- Types: `lib/types/invitation.ts`
- Aperçu de création: `app/inv/create/components/preview.tsx`
- Formulaire de création: `app/inv/create/components/form.tsx`
- Action de création (serveur): `app/inv/create/action.ts`
- Rendu Dashboard (lecture): `app/dashboard/[slug]/page.tsx`

---

En cas de question ou pour standardiser davantage les modèles (tokens de design, typographies, palettes), on peut ajouter un guide de style dédié dans `docs/` et des helper components partagés.