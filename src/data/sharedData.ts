// Shared data store for syncing MemberPortal and Admin Dashboard

// Giving History
export const getGivingHistory = () => {
  const data = localStorage.getItem("givingHistory");
  return data ? JSON.parse(data) : [];
};

export const addGivingRecord = (record: any) => {
  const history = getGivingHistory();
  history.push(record);
  localStorage.setItem("givingHistory", JSON.stringify(history));
};

// Event RSVPs
export const getEventRSVPs = () => {
  const data = localStorage.getItem("eventRSVPs");
  return data ? JSON.parse(data) : [];
};

export const addEventRSVP = (rsvp: any) => {
  const rsvps = getEventRSVPs();
  rsvps.push(rsvp);
  localStorage.setItem("eventRSVPs", JSON.stringify(rsvps));
};

// Announcements
export const getAnnouncements = () => {
  const data = localStorage.getItem("announcements");
  return data ? JSON.parse(data) : [];
};

export const addAnnouncement = (announcement: any) => {
  const announcements = getAnnouncements();
  announcements.push(announcement);
  localStorage.setItem("announcements", JSON.stringify(announcements));
};

export const updateAnnouncement = (id: string, updates: any) => {
  const announcements = getAnnouncements();
  const index = announcements.findIndex((a: any) => a.id === id);
  if (index >= 0) {
    announcements[index] = { ...announcements[index], ...updates };
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }
};

export const deleteAnnouncement = (id: string) => {
  const announcements = getAnnouncements();
  const filtered = announcements.filter((a: any) => a.id !== id);
  localStorage.setItem("announcements", JSON.stringify(filtered));
};

// Events
export const getEvents = () => {
  const data = localStorage.getItem("events");
  return data ? JSON.parse(data) : [];
};

export const addEvent = (event: any) => {
  const events = getEvents();
  events.push(event);
  localStorage.setItem("events", JSON.stringify(events));
};

export const updateEvent = (id: string, updates: any) => {
  const events = getEvents();
  const index = events.findIndex((e: any) => e.id === id);
  if (index >= 0) {
    events[index] = { ...events[index], ...updates };
    localStorage.setItem("events", JSON.stringify(events));
  }
};

export const deleteEvent = (id: string) => {
  const events = getEvents();
  const filtered = events.filter((e: any) => e.id !== id);
  localStorage.setItem("events", JSON.stringify(filtered));
};

// Member Profile Updates
export const getMemberProfiles = () => {
  const data = localStorage.getItem("memberProfiles");
  return data ? JSON.parse(data) : [];
};

export const updateMemberProfile = (memberId: string, updates: any) => {
  const profiles = getMemberProfiles();
  const existingIndex = profiles.findIndex((p: any) => p.id === memberId);
  if (existingIndex >= 0) {
    profiles[existingIndex] = { ...profiles[existingIndex], ...updates };
  } else {
    profiles.push({ id: memberId, ...updates });
  }
  localStorage.setItem("memberProfiles", JSON.stringify(profiles));
};

export const getMemberProfile = (memberId: string) => {
  const profiles = getMemberProfiles();
  return profiles.find((p: any) => p.id === memberId);
};

// Communications/Messages
export const getCommunications = () => {
  const data = localStorage.getItem("communications");
  return data ? JSON.parse(data) : [];
};

export const addCommunication = (communication: any) => {
  const communications = getCommunications();
  communications.push(communication);
  localStorage.setItem("communications", JSON.stringify(communications));
};
