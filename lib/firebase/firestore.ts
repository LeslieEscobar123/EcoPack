import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
} from "firebase/firestore"
import { db } from "./config"

export interface Package {
  id?: string
  packageId: string
  materialType: "maíz" | "caña" | "otro"
  manufacturingDate: Date
  status: "en producción" | "distribuido" | "reciclado"
  qrCode: string
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

const COLLECTION_NAME = "packages"

export async function createPackage(packageData: Omit<Package, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...packageData,
    manufacturingDate: Timestamp.fromDate(packageData.manufacturingDate),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updatePackage(id: string, packageData: Partial<Package>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id)
  const updateData: any = {
    ...packageData,
    updatedAt: Timestamp.now(),
  }

  if (packageData.manufacturingDate) {
    updateData.manufacturingDate = Timestamp.fromDate(packageData.manufacturingDate)
  }

  await updateDoc(docRef, updateData)
}

export async function deletePackage(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

export async function getPackages(userId: string): Promise<Package[]> {
  const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      manufacturingDate: data.manufacturingDate.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Package
  })
}

export async function searchPackages(userId: string, searchTerm: string): Promise<Package[]> {
  const packages = await getPackages(userId)

  if (!searchTerm) return packages

  const term = searchTerm.toLowerCase()
  return packages.filter(
    (pkg) =>
      pkg.packageId.toLowerCase().includes(term) ||
      pkg.materialType.toLowerCase().includes(term) ||
      pkg.status.toLowerCase().includes(term) ||
      pkg.qrCode.toLowerCase().includes(term),
  )
}
