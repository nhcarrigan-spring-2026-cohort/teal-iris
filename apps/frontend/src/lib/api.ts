import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { UserProfile } from "../components/userCard/userCard";


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

export interface FetchUsersParams {
  speaking?: string;
  learning?: string;
  page: number;
  pageSize?: number;
}

export interface FetchUsersResult {
  users: UserProfile[];
  total: number;
  page: number;
  pageSize: number;
}


const ALL_USERS: UserProfile[] = [
  { id:"1",  name:"Amara Osei",      avatarUrl:"https://i.pravatar.cc/150?img=47", speaking:[{language:"English",proficiency:"Native"},{language:"Twi",proficiency:"Native"}],    learning:[{language:"Spanish",proficiency:"Intermediate"}], timezoneOffsetHours: 1  },
  { id:"2",  name:"Luca Marchetti",  avatarUrl:"https://i.pravatar.cc/150?img=12", speaking:[{language:"Italian",proficiency:"Native"},{language:"English",proficiency:"Fluent"}], learning:[{language:"Japanese",proficiency:"Beginner"}],    timezoneOffsetHours: 2  },
  { id:"3",  name:"Yuki Tanaka",     avatarUrl:"https://i.pravatar.cc/150?img=32", speaking:[{language:"Japanese",proficiency:"Native"},{language:"English",proficiency:"Fluent"}],learning:[{language:"French",proficiency:"Intermediate"}],   timezoneOffsetHours: 9  },
  { id:"4",  name:"Sofia Reyes",     avatarUrl:"https://i.pravatar.cc/150?img=44", speaking:[{language:"Spanish",proficiency:"Native"}],                                           learning:[{language:"English",proficiency:"Intermediate"},{language:"German",proficiency:"Beginner"}], timezoneOffsetHours:-5 },
  { id:"5",  name:"Ravi Patel",      avatarUrl:"https://i.pravatar.cc/150?img=53", speaking:[{language:"Hindi",proficiency:"Native"},{language:"English",proficiency:"Fluent"}],   learning:[{language:"Mandarin",proficiency:"Beginner"}],    timezoneOffsetHours: 5  },
  { id:"6",  name:"Mei Lin",         avatarUrl:"https://i.pravatar.cc/150?img=25", speaking:[{language:"Mandarin",proficiency:"Native"},{language:"English",proficiency:"Fluent"}],learning:[{language:"Korean",proficiency:"Intermediate"}],   timezoneOffsetHours: 8  },
  { id:"7",  name:"Carlos Mendoza",  avatarUrl:"https://i.pravatar.cc/150?img=61", speaking:[{language:"Spanish",proficiency:"Native"},{language:"English",proficiency:"Fluent"}], learning:[{language:"Portuguese",proficiency:"Intermediate"}],timezoneOffsetHours:-6 },
  { id:"8",  name:"Aisha Diallo",    avatarUrl:"https://i.pravatar.cc/150?img=48", speaking:[{language:"French",proficiency:"Native"},{language:"Wolof",proficiency:"Native"}],    learning:[{language:"English",proficiency:"Intermediate"}],  timezoneOffsetHours: 0  },
  { id:"9",  name:"Jonas Weber",     avatarUrl:"https://i.pravatar.cc/150?img=15", speaking:[{language:"German",proficiency:"Native"},{language:"English",proficiency:"Fluent"}],  learning:[{language:"Spanish",proficiency:"Beginner"}],     timezoneOffsetHours: 1  },
  { id:"10", name:"Priya Nair",      avatarUrl:"https://i.pravatar.cc/150?img=36", speaking:[{language:"Malayalam",proficiency:"Native"},{language:"English",proficiency:"Fluent"}],learning:[{language:"French",proficiency:"Beginner"}],     timezoneOffsetHours: 5  },
  { id:"11", name:"Tom Nakamura",    avatarUrl:"https://i.pravatar.cc/150?img=18", speaking:[{language:"English",proficiency:"Native"},{language:"Japanese",proficiency:"Intermediate"}],learning:[{language:"Korean",proficiency:"Beginner"}],timezoneOffsetHours:-8 },
  { id:"12", name:"Elena Popescu",   avatarUrl:"https://i.pravatar.cc/150?img=41", speaking:[{language:"Romanian",proficiency:"Native"},{language:"English",proficiency:"Fluent"}], learning:[{language:"Italian",proficiency:"Intermediate"}],timezoneOffsetHours: 2  },
];

export async function fetchUsers({ speaking, learning, page, pageSize = 6 }: FetchUsersParams): Promise<FetchUsersResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 700));

  let results = ALL_USERS;

  if (speaking) {
    results = results.filter((u) =>
      u.speaking.some((s) => s.language.toLowerCase() === speaking.toLowerCase())
    );
  }
  if (learning) {
    results = results.filter((u) =>
      u.learning.some((l) => l.language.toLowerCase() === learning.toLowerCase())
    );
  }

  const total = results.length;
  const start = (page - 1) * pageSize;
  const users = results.slice(start, start + pageSize);

  return { users, total, page, pageSize };
}

export const LANGUAGES = [
  "English","Spanish","French","German","Japanese","Mandarin",
  "Korean","Italian","Portuguese","Hindi","Arabic","Russian",
  "Twi","Wolof","Malayalam","Romanian",
];
