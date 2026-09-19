const shelters = [
  {
    id: "s1",
    name: "Happy Tails Rescue",
    city: "Toronto",
    processingFee: 40, // small admin fee
    pets: [
      { id: "p1", name: "Milo", type: "Dog", breed: "Beagle Mix", age: 3, health: "Vaccinated, Neutered", traits: ["Friendly", "Energetic", "Good with kids"], image: "images/dog1.jpg", views: 0, adoptionFee: 180, daysAtShelter: 45 },
      { id: "p2", name: "Luna", type: "Cat", breed: "Siamese", age: 2, health: "Vaccinated", traits: ["Quiet", "Affectionate"], image: "images/cat1.jpg", views: 0, adoptionFee: 160, daysAtShelter: 30 },
      { id: "p3", name: "Rocky", type: "Dog", breed: "German Shepherd", age: 5, health: "Hip dysplasia (managed)", traits: ["Loyal", "Protective", "Trained"], image: "images/dog2.jpg", views: 0, adoptionFee: 190, daysAtShelter: 60 },
      { id: "p4", name: "Coco", type: "Parrot", breed: "African Grey", age: 8, health: "Healthy", traits: ["Talkative", "Intelligent"], image: "images/parrot1.jpg", views: 0, adoptionFee: 200, daysAtShelter: 120 }
    ]
  },
  {
    id: "s2",
    name: "Paws & Whiskers Haven",
    city: "Ottawa",
    processingFee: 35,
    pets: [
      { id: "p5", name: "Bella", type: "Dog", breed: "Labrador", age: 4, health: "Vaccinated, Spayed", traits: ["Gentle", "Loves water"], image: "images/dog3.jpg", views: 0, adoptionFee: 150, daysAtShelter: 40 },
      { id: "p6", name: "Simba", type: "Cat", breed: "Maine Coon", age: 3, health: "Healthy", traits: ["Fluffy", "Playful"], image: "images/cat2.jpg", views: 0, adoptionFee: 155, daysAtShelter: 35 },
      { id: "p7", name: "Nibbles", type: "Other", breed: "Ferret", age: 2, health: "Healthy", traits: ["Curious", "Fast"], image: "images/ferret1.jpg", views: 0, adoptionFee: 120, daysAtShelter: 25 },
      { id: "p8", name: "Max", type: "Dog", breed: "Boxer", age: 6, health: "Allergy to chicken", traits: ["Energetic", "Goofy"], image: "images/dog4.jpg", views: 0, adoptionFee: 160, daysAtShelter: 55 },
      { id: "p9", name: "Whiskers", type: "Cat", breed: "Domestic Shorthair", age: 1, health: "Vaccinated", traits: ["Curious", "Playful"], image: "images/cat3.jpg", views: 0, adoptionFee: 140, daysAtShelter: 20 }
    ]
  },
  {
    id: "s3",
    name: "Second Chance Animals",
    city: "Vancouver",
    processingFee: 45,
    pets: [
      { id: "p10", name: "Charlie", type: "Dog", breed: "Golden Retriever", age: 2, health: "Healthy", traits: ["Friendly", "Loyal"], image: "images/dog5.jpg", views: 0, adoptionFee: 200, daysAtShelter: 30 },
      { id: "p11", name: "Shadow", type: "Cat", breed: "Sphinx", age: 4, health: "Healthy", traits: ["Quiet", "Independent"], image: "images/cat4.jpg", views: 0, adoptionFee: 210, daysAtShelter: 50 },
      { id: "p12", name: "Spike", type: "Reptile", breed: "Green Iguana", age: 5, health: "Requires heat lamp", traits: ["Calm", "Observant"], image: "images/iguana1.jpg", views: 0, adoptionFee: 180, daysAtShelter: 90 },
      { id: "p13", name: "Buddy", type: "Dog", breed: "Cocker Spaniel", age: 7, health: "Mild heart murmur", traits: ["Gentle", "Calm"], image: "images/dog6.jpg", views: 0, adoptionFee: 190, daysAtShelter: 70 },
      { id: "p14", name: "Mittens", type: "Cat", breed: "Ragdoll", age: 3, health: "Healthy", traits: ["Affectionate", "Lazy"], image: "images/cat5.jpg", views: 0, adoptionFee: 200, daysAtShelter: 40 },
      { id: "p15", name: "Slinky", type: "Reptile", breed: "Corn Snake", age: 4, health: "Healthy", traits: ["Docile", "Low maintenance"], image: "images/snake1.jpg", views: 0, adoptionFee: 170, daysAtShelter: 100 }
    ]
  },
  {
    id: "s4",
    name: "Forever Friends Shelter",
    city: "Calgary",
    processingFee: 50,
    pets: [
      { id: "p16", name: "Daisy", type: "Dog", breed: "Poodle", age: 2, health: "Healthy", traits: ["Smart", "Active"], image: "images/dog7.jpg", views: 0, adoptionFee: 170, daysAtShelter: 35 },
      { id: "p17", name: "Leo", type: "Cat", breed: "Bengal", age: 2, health: "Healthy", traits: ["Energetic", "Vocal"], image: "images/cat6.jpg", views: 0, adoptionFee: 165, daysAtShelter: 25 },
      { id: "p18", name: "Porky", type: "Other", breed: "Miniature Pot-belly Pig", age: 3, health: "Healthy", traits: ["Intelligent", "Social"], image: "images/pig1.jpg", views: 0, adoptionFee: 250, daysAtShelter: 90 },
      { id: "p19", name: "Rex", type: "Dog", breed: "Doberman", age: 5, health: "Healthy", traits: ["Protective", "Alert"], image: "images/dog8.jpg", views: 0, adoptionFee: 180, daysAtShelter: 60 }
    ]
  },
  {
    id: "s5",
    name: "Safe Haven Pets",
    city: "Montreal",
    processingFee: 25,
    pets: [
      { id: "p20", name: "Oliver", type: "Cat", breed: "Sphynx", age: 12, health: "Healthy", traits: ["Quiet", "Sweet"], image: "images/cat7.jpg", views: 0, adoptionFee: 160, daysAtShelter: 180 },
      { id: "p21", name: "Bailey", type: "Dog", breed: "Husky", age: 3, health: "Healthy", traits: ["Energetic", "Vocal"], image: "images/dog9.jpg", views: 0, adoptionFee: 160, daysAtShelter: 40 },
      { id: "p22", name: "Lemon & Lime", type: "Bird", breed: "Budgies", age: 2, health: "Healthy", traits: ["Friendly", "Sings"], image: "images/budgie1.jpg", views: 0, adoptionFee: 120, daysAtShelter: 30 },
      { id: "p23", name: "Gizmo", type: "Reptile", breed: "Chameleon", age: 1, health: "Requires humidity control", traits: ["Calm", "Color-changing"], image: "images/chameleon1.jpg", views: 0, adoptionFee: 180, daysAtShelter: 50 },
      { id: "p24", name: "Toby", type: "Dog", breed: "Shih Tzu", age: 6, health: "Dental issues (treated)", traits: ["Calm", "Loves laps"], image: "images/dog10.jpg", views: 0, adoptionFee: 160, daysAtShelter: 65 }
    ]
  }
];
