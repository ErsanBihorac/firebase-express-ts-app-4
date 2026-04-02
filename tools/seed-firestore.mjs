import admin from "firebase-admin";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

admin.initializeApp({ projectId: "demo-project" });
const db = admin.firestore();

const opinions = [
  {
    author: { uid: "u1", email: "ersan@mail.com" },
    opinion: "Mangos are good",
    likecount: 1,
  },
  {
    author: { uid: "u2", email: "amra@mail.com" },
    opinion: "Oranges are good",
    likecount: 2,
  },
  {
    author: { uid: "u3", email: "irina@mail.com" },
    opinion: "Pineapples are good",
    likecount: 3,
  },
];

for (const item of opinions) {
  await db.collection("opinions").add(item);
}

console.log("Seed creation done");
