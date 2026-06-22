import { Post, User } from "./types";

export const USERS: Record<string, User> = {
  "evol_mushroom": {
    id: "evol_mushroom",
    name: "Mycelium Ancestor",
    handle: "@fungi_prime",
    avatarUrl: "https://images.unsplash.com/photo-1579723049247-49fcc01191a3?auto=format&fit=crop&w=150&q=80",
    traits: { energy: 5, sociability: 5, trainability: 5, preyDrive: 5, vocalization: 5, loyalty: 5 }
  },
  "evol_fish": {
    id: "evol_fish",
    name: "Ancient Tiktaalik",
    handle: "@land_walker",
    avatarUrl: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=150&q=80",
    traits: { energy: 30, sociability: 20, trainability: 10, preyDrive: 50, vocalization: 10, loyalty: 10 }
  },
  "evol_mammal": {
    id: "evol_mammal",
    name: "Early Synapsid",
    handle: "@warm_blooded",
    avatarUrl: "https://images.unsplash.com/photo-1590499690659-42b781df5a48?auto=format&fit=crop&w=150&q=80",
    traits: { energy: 50, sociability: 30, trainability: 20, preyDrive: 70, vocalization: 30, loyalty: 30 }
  },
  "evol_wolf": {
    id: "evol_wolf",
    name: "Dire Wolf of Antiquity",
    handle: "@first_howl",
    avatarUrl: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=150&q=80",
    traits: { energy: 90, sociability: 60, trainability: 40, preyDrive: 100, vocalization: 80, loyalty: 80 }
  },
  "u1": {
    id: "u1",
    name: "Bella the Golden",
    handle: "@bellagolden",
    avatarUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80",
    traits: { energy: 85, sociability: 95, trainability: 90, preyDrive: 40, vocalization: 50, loyalty: 95 }
  },
  "u2": {
    id: "u2",
    name: "Mittens & Co.",
    handle: "@mittens_vibes",
    avatarUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80",
    traits: { energy: 30, sociability: 40, trainability: 20, preyDrive: 85, vocalization: 60, loyalty: 40 }
  },
  "u3": {
    id: "u3",
    name: "Charlie the Pug",
    handle: "@charliepugin",
    avatarUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=150&q=80",
    traits: { energy: 40, sociability: 85, trainability: 60, preyDrive: 20, vocalization: 70, loyalty: 80 }
  },
  "u4": {
    id: "u4",
    name: "Luna the Husky",
    handle: "@luna_howls",
    avatarUrl: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=150&q=80",
    traits: { energy: 95, sociability: 70, trainability: 50, preyDrive: 80, vocalization: 100, loyalty: 85 }
  }
};

export const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    userId: "u1",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    caption: "Just had the best afternoon at the dog park! Caught so many frisbees 🥏🐾 #dogpark #goldenretriever",
    likes: 342,
    comments: [
      { id: "c1", userId: "u3", content: "Looking so fast!", createdAt: "2h ago" },
      { id: "c2", userId: "u4", content: "Wish I was there tracking those squirrels!", createdAt: "1h ago" }
    ],
    createdAt: "3h ago",
  },
  {
    id: "p2",
    userId: "u2",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    caption: "I claim this keyboard as my new bed. Human can't work today. ⌨️😴 #caturday #boss",
    likes: 891,
    comments: [],
    createdAt: "5h ago",
  },
  {
    id: "p3",
    userId: "u3",
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
    caption: "Did someone say treat? 🍖👀",
    likes: 125,
    comments: [
      { id: "c3", userId: "u1", content: "Share some!!", createdAt: "1m ago" }
    ],
    createdAt: "8h ago",
  }
];

export const TRENDING_TAGS = [
  { tag: "#Caturday", posts: "125K" },
  { tag: "#DogsofTikTok", posts: "89K" },
  { tag: "#TreatTime", posts: "45K" },
  { tag: "#BoopTheSnoot", posts: "32K" },
];

export const CURRENT_USER: User = {
  id: "me",
  name: "My Pet Profile",
  handle: "@mypet",
  avatarUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80",
  traits: { energy: 60, sociability: 80, trainability: 70, preyDrive: 30, vocalization: 40, loyalty: 90 }
};

export const INITIAL_LINEAGE: Record<string, import("./types").LineageData> = {
  "evol_mushroom": { id: "evol_mushroom", sireId: undefined, damId: undefined, offspringIds: ["evol_fish"] },
  "evol_fish": { id: "evol_fish", sireId: "evol_mushroom", damId: undefined, offspringIds: ["evol_mammal"] },
  "evol_mammal": { id: "evol_mammal", sireId: "evol_fish", damId: undefined, offspringIds: ["evol_wolf"] },
  "evol_wolf": { id: "evol_wolf", sireId: "evol_mammal", damId: undefined, offspringIds: ["u3"] },
  "me": { id: "me", sireId: "u3", damId: undefined, offspringIds: [] },
  "u3": { id: "u3", sireId: "evol_wolf", damId: undefined, offspringIds: ["me"] },
  "u1": { id: "u1", sireId: undefined, damId: undefined, offspringIds: [] },
  "u2": { id: "u2", sireId: undefined, damId: undefined, offspringIds: [] },
  "u4": { id: "u4", sireId: undefined, damId: undefined, offspringIds: [] },
};

export const INITIAL_REQUESTS: import("./types").LineageRequest[] = [
  {
    id: "req1",
    fromUserId: "u1",
    toUserId: "me",
    relationship: "dam",
    status: "pending"
  }
];
