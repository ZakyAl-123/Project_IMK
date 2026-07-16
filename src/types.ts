export enum AppRole {
  BUYER = "buyer",
  SELLER = "seller",
  ADMIN = "admin",
  DEVELOPER = "developer",
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: AppRole;
  balance: number;
  earnings: number;
  membership: "Free" | "Pro" | "Business" | "Enterprise";
  joinedDate: string;
  mustChangePassword?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  thumbnail: string;
  previews: string[];
  fileUrl: string;
  fileSize: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  rating: number;
  reviews: Review[];
  tags: string[];
  sales: number;
  status: "active" | "pending" | "rejected";
  licenseType: "Personal" | "Commercial" | "Extended";
  version: string;
  changelog: string[];
  software: string; // e.g., Figma, Photoshop, Illustrator, Canva, Canva Template
  formats: string[]; // e.g., .fig, .psd, .ai, .zip
}

export interface Proposal {
  id: string;
  designerId: string;
  designerName: string;
  designerAvatar: string;
  designerRating: number;
  amount: number;
  deliveryDays: number;
  coverLetter: string;
  status: "pending" | "approved" | "rejected";
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: "unfunded" | "funded" | "completed" | "released";
  deadline: string;
}

export interface CustomProject {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: "open" | "ongoing" | "completed" | "cancelled";
  proposals: Proposal[];
  milestones: Milestone[];
  chosenProposalId?: string;
}

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  description: string;
  prizePool: number;
  deadline: string;
  participantsCount: number;
  submissions: {
    id: string;
    designerName: string;
    designerAvatar: string;
    preview: string;
    votes: number;
  }[];
}

export interface DiscussionThread {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  repliesCount: number;
  likesCount: number;
  viewsCount: number;
  lastActive: string;
  content: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  thumbnail: string;
  content: string;
}
