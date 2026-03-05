Run the project : 

docker compose up --build

Populate mongo : 

docker exec -it shop_mongo mongosh   -u shop_user   -p shop_password   --authenticationDatabase shop_db

use shop_db


db.adstypes.insertMany([
  {
    _id: ObjectId("66a000000000000000000001"),
    name: "Appartement"
  },
  {
    _id: ObjectId("66a000000000000000000002"),
    name: "Maison"
  },
  {
    _id: ObjectId("66a000000000000000000003"),
    name: "Terrain"
  }
])

db.ads.insertMany([
  {
    title: "Appartement T3 lumineux",
    description: "Bel appartement proche centre",
    price: 250000,
    rooms: 3,
    surface: 68,
    adsType: ObjectId("66a000000000000000000001"),
    images: [
      { url: "https://site.com/appart1.jpg", alt: "salon" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maison avec jardin",
    description: "Grande maison familiale",
    price: 420000,
    rooms: 5,
    surface: 140,
    adsType: ObjectId("66a000000000000000000002"),
    images: [
      { url: "https://site.com/maison1.jpg", alt: "facade" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Terrain constructible",
    description: "Terrain de 600m2",
    price: 120000,
    rooms: 0,
    surface: 600,
    adsType: ObjectId("66a000000000000000000003"),
    images: [
      { url: "https://site.com/terrain1.jpg", alt: "terrain" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
