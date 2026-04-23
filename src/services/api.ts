// API Service Layer for Ministry Hub
// This handles all API calls to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Generic fetch wrapper
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const result: ApiResponse<T> = await response.json();
  
  if (result.error) {
    throw new Error(result.error);
  }

  return result.data;
}

// Members API
export const membersApi = {
  getAll: () => fetchApi<Member[]>("/members"),
  getById: (id: string) => fetchApi<Member>(`/members/${id}`),
  create: (member: Partial<Member>) => 
    fetchApi<Member>("/members", {
      method: "POST",
      body: JSON.stringify(member),
    }),
  update: (id: string, member: Partial<Member>) =>
    fetchApi<Member>(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(member),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/members/${id}`, {
      method: "DELETE",
    }),
};

// Departments API
export const departmentsApi = {
  getAll: () => fetchApi<Department[]>("/departments"),
  getById: (id: string) => fetchApi<Department>(`/departments/${id}`),
  create: (department: Partial<Department>) =>
    fetchApi<Department>("/departments", {
      method: "POST",
      body: JSON.stringify(department),
    }),
  update: (id: string, department: Partial<Department>) =>
    fetchApi<Department>(`/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(department),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/departments/${id}`, {
      method: "DELETE",
    }),
  getMembers: (id: string) => fetchApi<Member[]>(`/departments/${id}/members`),
  addMember: (departmentId: string, memberId: string) =>
    fetchApi<void>(`/departments/${departmentId}/members/${memberId}`, {
      method: "POST",
    }),
  removeMember: (departmentId: string, memberId: string) =>
    fetchApi<void>(`/departments/${departmentId}/members/${memberId}`, {
      method: "DELETE",
    }),
};

// Attendance API
export const attendanceApi = {
  getAll: () => fetchApi<AttendanceRecord[]>("/attendance"),
  getByDate: (date: string) => fetchApi<AttendanceRecord[]>(`/attendance?date=${date}`),
  create: (record: Partial<AttendanceRecord>) =>
    fetchApi<AttendanceRecord>("/attendance", {
      method: "POST",
      body: JSON.stringify(record),
    }),
  update: (id: string, record: Partial<AttendanceRecord>) =>
    fetchApi<AttendanceRecord>(`/attendance/${id}`, {
      method: "PUT",
      body: JSON.stringify(record),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/attendance/${id}`, {
      method: "DELETE",
    }),
};

// Events API
export const eventsApi = {
  getAll: () => fetchApi<Event[]>("/events"),
  getById: (id: string) => fetchApi<Event>(`/events/${id}`),
  create: (event: Partial<Event>) =>
    fetchApi<Event>("/events", {
      method: "POST",
      body: JSON.stringify(event),
    }),
  update: (id: string, event: Partial<Event>) =>
    fetchApi<Event>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/events/${id}`, {
      method: "DELETE",
    }),
};

// Types (re-exported for convenience)
export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  status: "Active" | "New Member" | "Visitor" | "Inactive" | "Deceased";
  baptized: boolean;
  joined: string;
  photo: string;
  familyGroup?: string;
  role?: string;
  dateOfBirth?: string;
}

export interface Department {
  id: string;
  name: string;
  leader: string;
  members: number;
  meetingDay: string;
  meetingTime: string;
  lastAttendance: number;
  monthlyContribution: number;
  description: string;
  color: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  serviceType: "morning" | "afternoon" | "evening" | "event";
  date: string;
  checkedIn: boolean;
  eventId?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
}
