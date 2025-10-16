"use client";

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ChevronDown, MoreVertical, Trash2, UserCheck } from 'lucide-react'

// UI Components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Actions
import { deleteGuest, assignSeat } from "./actions"

type Guest = {
    id: string
    name: string
    email: string | null
    phone: string | null
    status: string
    respondedAt: Date | null
    createdAt: Date
}

type GuestListProps = {
    guests: Guest[]
    invitationSlug: string
}

const ITEMS_PER_PAGE = 14

export default function GuestList({ guests, invitationSlug }: GuestListProps) {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [visibleCount, setVisibleCount] = React.useState(ITEMS_PER_PAGE)
    const [isPending, startTransition] = React.useTransition()
    const [assignSeatDialog, setAssignSeatDialog] = React.useState<{
        isOpen: boolean
        guestId: string | null
        guestName: string
    }>({
        isOpen: false,
        guestId: null,
        guestName: '',
    })
    const [seatNumber, setSeatNumber] = React.useState('')

    // Filtrer les invités selon la recherche - doit être avant toute condition
    const filteredGuests = React.useMemo(() => {
        if (!searchQuery.trim()) return guests

        const query = searchQuery.toLowerCase()
        return guests.filter(guest =>
            guest.name.toLowerCase().includes(query) ||
            (guest.email && guest.email.toLowerCase().includes(query)) ||
            (guest.phone && guest.phone.toLowerCase().includes(query))
        )
    }, [guests, searchQuery])

    // Invités visibles selon la pagination
    const visibleGuests = filteredGuests.slice(0, visibleCount)
    const hasMore = visibleCount < filteredGuests.length

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'text-green-600 bg-green-50 border-green-200'
            case 'declined':
                return 'text-red-600 bg-red-50 border-red-200'
            case 'pending':
            default:
                return 'text-yellow-600 bg-yellow-50 border-yellow-200'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'Accepté'
            case 'declined':
                return 'Refusé'
            case 'pending':
            default:
                return 'En attente'
        }
    }

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE)
    }

    const handleDeleteGuest = (guestId: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet invité ?")) {
            startTransition(async () => {
                try {
                    await deleteGuest(guestId, invitationSlug)
                } catch (error) {
                    console.error("Erreur lors de la suppression:", error)
                    // TODO: Afficher un toast d'erreur
                }
            })
        }
    }

    const handleAssignSeat = () => {
        if (!assignSeatDialog.guestId || !seatNumber.trim()) return

        startTransition(async () => {
            try {
                await assignSeat(assignSeatDialog.guestId!, invitationSlug, seatNumber.trim())
                setAssignSeatDialog({ isOpen: false, guestId: null, guestName: '' })
                setSeatNumber('')
            } catch (error) {
                console.error("Erreur lors de l'attribution de place:", error)
                // TODO: Afficher un toast d'erreur
            }
        })
    }

    const openAssignSeatDialog = (guestId: string, guestName: string) => {
        setAssignSeatDialog({ isOpen: true, guestId, guestName })
    }

    if (guests.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border p-4"
            >
                <h3 className="font-medium mb-2">Invités</h3>
                <p className="text-sm text-muted-foreground">Aucun invité pour le moment.</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border p-4"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">
                    Invités ({filteredGuests.length}{searchQuery && ` sur ${guests.length}`})
                </h3>
            </div>

            {/* Barre de recherche */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative mb-6"
            >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setVisibleCount(ITEMS_PER_PAGE) // Reset pagination when searching
                    }}
                    className="pl-10"
                />
            </motion.div>

            {/* Grille des invités */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {visibleGuests.map((guest, index) => (
                        <motion.div
                            key={guest.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{
                                delay: index * 0.05,
                                layout: { duration: 0.3 }
                            }}
                            className="flex items-center justify-between p-3 rounded-md border bg-card hover:shadow-md transition-shadow"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{guest.name}</p>
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            {guest.email && <span className="truncate">{guest.email}</span>}
                                            {guest.phone && <span>{guest.phone}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${getStatusColor(guest.status)}`}>
                                        {getStatusLabel(guest.status)}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {guest.respondedAt && (
                                            <p className="text-xs text-muted-foreground">
                                                {guest.respondedAt.toLocaleDateString('fr-FR')}
                                            </p>
                                        )}

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    disabled={isPending}
                                                >
                                                    <span className="sr-only">Ouvrir le menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => openAssignSeatDialog(guest.id, guest.name)}
                                                    disabled={isPending}
                                                >
                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                    Attribuer une place
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteGuest(guest.id)}
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>


                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Bouton Voir plus */}
            {hasMore && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mt-6"
                >
                    <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        Voir ({filteredGuests.length - visibleCount}) autres restants
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </motion.div>
            )}

            {/* Message quand aucun résultat */}
            {filteredGuests.length === 0 && searchQuery && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                >
                    <p className="text-sm text-muted-foreground">
                        Aucun invité trouvé pour &quot;{searchQuery}&quot;
                    </p>
                </motion.div>
            )}

            {/* Boîte de dialogue pour attribuer une place */}
            <Dialog
                open={assignSeatDialog.isOpen}
                onOpenChange={(open) =>
                    setAssignSeatDialog({ isOpen: open, guestId: null, guestName: '' })
                }
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Attribuer une place</DialogTitle>
                        <DialogDescription>
                            Attribuer une place à {assignSeatDialog.guestName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="seat-number" className="text-right">
                                Numéro de place
                            </Label>
                            <Input
                                id="seat-number"
                                value={seatNumber}
                                onChange={(e) => setSeatNumber(e.target.value)}
                                placeholder="Ex: A12, 15, etc."
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setAssignSeatDialog({ isOpen: false, guestId: null, guestName: '' })}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            onClick={handleAssignSeat}
                            disabled={isPending || !seatNumber.trim()}
                        >
                            {isPending ? 'Attribution...' : 'Attribuer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
