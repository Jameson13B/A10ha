import fs from "fs-extra"
import path from "path"

export const firebaseConfigCode = (features) => `
import { initializeApp } from 'firebase/app';
${features.includes("auth") ? "import { getAuth } from 'firebase/auth';" : ""}
${
  features.includes("firestore")
    ? "import { getFirestore } from 'firebase/firestore';"
    : ""
}
${
  features.includes("storage")
    ? "import { getStorage } from 'firebase/storage';"
    : ""
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);

${features.includes("auth") ? "export const auth = getAuth(app);" : ""}
${features.includes("firestore") ? "export const db = getFirestore(app);" : ""}
${features.includes("storage") ? "export const storage = getStorage(app);" : ""}
`
const envCode = `VITE_API_KEY=""
VITE_AUTH_DOMAIN=""
VITE_PROJECT_ID=""
VITE_STORAGE_BUCKET=""
VITE_MESSAGING_SENDER_ID=""
VITE_APP_ID=""
`

export const writeFirebaseFiles = (firebaseFilePath, features) => {
  fs.writeFileSync(firebaseFilePath, firebaseConfigCode(features))
  fs.writeFileSync(path.join(process.cwd(), ".env"), envCode)
  fs.appendFileSync(path.join(process.cwd(), ".gitignore"), "\n.env\n")
}
