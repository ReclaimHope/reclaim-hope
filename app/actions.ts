// app/actions.ts
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteChildAction(id: string) {
  try {
    // Direct database access on the server
    await prisma.child.delete({ where: { id } })
    
    // Automatically refetch data for the specified path to update the UI
    revalidatePath('/children') 
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete child" }
  }
}
