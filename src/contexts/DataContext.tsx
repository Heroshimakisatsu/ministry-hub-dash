import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { membersApi, departmentsApi, attendanceApi, eventsApi, Member, Department, AttendanceRecord, Event } from "@/services/api";
import { initialMembers as staticMembers } from "@/data/members";

interface DataContextType {
  members: Member[];
  departments: Department[];
  attendance: AttendanceRecord[];
  events: Event[];
  loading: boolean;
  error: string | null;
  refreshMembers: () => Promise<void>;
  refreshDepartments: () => Promise<void>;
  refreshAttendance: () => Promise<void>;
  refreshEvents: () => Promise<void>;
  refreshAll: () => Promise<void>;
  addMember: (member: Partial<Member>) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  addDepartment: (department: Partial<Department>) => Promise<void>;
  updateDepartment: (id: string, department: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  addAttendance: (record: Partial<AttendanceRecord>) => Promise<void>;
  addEvent: (event: Partial<Event>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(staticMembers);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshMembers = async () => {
    try {
      const data = await membersApi.getAll();
      setMembers(data);
    } catch (err) {
      console.log("API unavailable, using static data for members");
      setMembers(staticMembers);
      setError(null);
    }
  };

  const refreshDepartments = async () => {
    try {
      const data = await departmentsApi.getAll();
      setDepartments(data);
    } catch (err) {
      console.log("API unavailable, using static data for departments");
      setError(null);
    }
  };

  const refreshAttendance = async () => {
    try {
      const data = await attendanceApi.getAll();
      setAttendance(data);
    } catch (err) {
      console.log("API unavailable, using static data for attendance");
      setAttendance([]);
      setError(null);
    }
  };

  const refreshEvents = async () => {
    try {
      const data = await eventsApi.getAll();
      setEvents(data);
    } catch (err) {
      console.log("API unavailable, using static data for events");
      setEvents([]);
      setError(null);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([
      refreshMembers(),
      refreshDepartments(),
      refreshAttendance(),
      refreshEvents(),
    ]);
    setLoading(false);
  };

  const addMember = async (member: Partial<Member>) => {
    try {
      const newMember = await membersApi.create(member);
      setMembers(prev => [...prev, newMember]);
    } catch (err) {
      setError(`Failed to add member: ${err instanceof Error ? err.message : "Unknown error"}`);
      throw err;
    }
  };

  const updateMember = async (id: string, member: Partial<Member>) => {
    try {
      const updatedMember = await membersApi.update(id, member);
      setMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
    } catch (err) {
      setError(`Failed to update member: ${err instanceof Error ? err.message : "Unknown error"}`);
      throw err;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await membersApi.delete(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(`Failed to delete member: ${err instanceof Error ? err.message : "Unknown error"}`);
      throw err;
    }
  };

  const addDepartment = async (department: Partial<Department>) => {
    try {
      const newDepartment = await departmentsApi.create(department);
      setDepartments(prev => [...prev, newDepartment]);
    } catch (err) {
      setError(`Failed to add department: ${err instanceof Error ? err.message : "Unknown error"}`);
      throw err;
    }
  };

  const updateDepartment = async (id: string, department: Partial<Department>) => {
    try {
      const updatedDepartment = await departmentsApi.update(id, department);
      setDepartments(prev => prev.map(d => d.id === id ? updatedDepartment : d));
    } catch (err) {
      setError(`Failed to update department: ${err instanceof Error ? err.message : "Unknown error"}`);
      throw err;
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      await departmentsApi.delete(id);
      setDepartments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError(`Failed to delete department: ${err instanceof Error ? err.message : "Unknown error"}`);
      throw err;
    }
  };

  const addAttendance = async (record: Partial<AttendanceRecord>) => {
    try {
      const newRecord = await attendanceApi.create(record);
      setAttendance(prev => [...prev, newRecord]);
    } catch (err) {
      setError(`Failed to add attendance: ${err instanceof Error ? err.message : "Unknown error"}`);
      throw err;
    }
  };

  const addEvent = async (event: Partial<Event>) => {
    try {
      const newEvent = await eventsApi.create(event);
      setEvents(prev => [...prev, newEvent]);
    } catch (err) {
      setError(`Failed to add event: ${err instanceof Error ? err.message : "Unknown error"}`);
      throw err;
    }
  };

  // Load initial data
  useEffect(() => {
    refreshAll();
  }, []);

  const value: DataContextType = {
    members,
    departments,
    attendance,
    events,
    loading,
    error,
    refreshMembers,
    refreshDepartments,
    refreshAttendance,
    refreshEvents,
    refreshAll,
    addMember,
    updateMember,
    deleteMember,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addAttendance,
    addEvent,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
