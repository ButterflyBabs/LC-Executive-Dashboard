"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";

// Types
interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  location?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  attendees?: string[];
  calendarSource: string;
  color: string;
  isRecurring?: boolean;
}

interface ConnectedCalendar {
  id: string;
  name: string;
  provider: "google" | "icloud" | "outlook" | "other";
  email: string;
  color: string;
  isConnected: boolean;
  lastSynced?: Date;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Mock connected calendars
const mockCalendars: ConnectedCalendar[] = [
  {
    id: "1",
    name: "Primary Google Calendar",
    provider: "google",
    email: "babs@example.com",
    color: "#4285F4",
    isConnected: true,
    lastSynced: new Date(),
  },
  {
    id: "2",
    name: "iCloud Calendar",
    provider: "icloud",
    email: "babs@icloud.com",
    color: "#FF9500",
    isConnected: false,
  },
  {
    id: "3",
    name: "Work Outlook",
    provider: "outlook",
    email: "babs@company.com",
    color: "#0078D4",
    isConnected: false,
  },
];

// Mock events
const generateMockEvents = (): CalendarEvent[] => {
  const today = new Date();
  const events: CalendarEvent[] = [];
  
  // Today's events
  events.push({
    id: "1",
    title: "LifeCharter Circle Session",
    startTime: new Date(today.setHours(10, 0, 0, 0)),
    endTime: new Date(today.setHours(11, 30, 0, 0)),
    description: "Weekly coaching session with LifeCharter Circle members",
    isVirtual: true,
    meetingLink: "https://zoom.us/j/example",
    attendees: ["Circle Member 1", "Circle Member 2"],
    calendarSource: "Primary Google Calendar",
    color: "#4285F4",
    isRecurring: true,
  });
  
  events.push({
    id: "2",
    title: "Content Creation Block",
    startTime: new Date(today.setHours(14, 0, 0, 0)),
    endTime: new Date(today.setHours(16, 0, 0, 0)),
    description: "Write weekly article and create social content",
    calendarSource: "Primary Google Calendar",
    color: "#34A853",
  });
  
  // Tomorrow's events
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  events.push({
    id: "3",
    title: "Podcast Recording",
    startTime: new Date(tomorrow.setHours(9, 0, 0, 0)),
    endTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
    description: "Record Conversations of Consequence episode",
    location: "Home Studio",
    calendarSource: "Primary Google Calendar",
    color: "#EA4335",
  });
  
  events.push({
    id: "4",
    title: "Strategy Planning Session",
    startTime: new Date(tomorrow.setHours(13, 0, 0, 0)),
    endTime: new Date(tomorrow.setHours(15, 0, 0, 0)),
    description: "Quarterly business planning with team",
    isVirtual: true,
    meetingLink: "https://meet.google.com/example",
    attendees: ["Team Member 1", "Team Member 2"],
    calendarSource: "Primary Google Calendar",
    color: "#9AA0A6",
  });
  
  return events;
};

export default function TimePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendars, setCalendars] = useState<ConnectedCalendar[]>(mockCalendars);
  const [activeView, setActiveView] = useState<"day" | "week" | "month">("week");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>(["1"]);

  useEffect(() => {
    setEvents(generateMockEvents());
  }, []);

  // Calendar navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (activeView === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (activeView === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (activeView === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (activeView === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get week days
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal/20 flex items-center justify-center">
            <Clock className="w-7 h-7 text-teal" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-navy">Time</h1>
            <p className="text-soft-taupe">Calendar and scheduling</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Connect Calendar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow">
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-cream-dark rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-navy" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-navy hover:bg-cream-dark rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className="p-2 hover:bg-cream-dark rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-navy" />
            </button>
          </div>
          <h2 className="text-xl font-serif text-navy">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {(["day", "week", "month"] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeView === view
                  ? "bg-navy text-white"
                  : "text-navy hover:bg-cream-dark"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Connected Calendars */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-soft-taupe">Calendars:</span>
        {calendars.map((calendar) => (
          <button
            key={calendar.id}
            onClick={() => {
              if (selectedCalendars.includes(calendar.id)) {
                setSelectedCalendars(selectedCalendars.filter((id) => id !== calendar.id));
              } else {
                setSelectedCalendars([...selectedCalendars, calendar.id]);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
              selectedCalendars.includes(calendar.id)
                ? "bg-white shadow-md"
                : "bg-cream-dark/50 opacity-50"
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: calendar.color }}
            />
            <span className="text-navy">{calendar.name}</span>
            {!calendar.isConnected && (
              <span className="text-xs text-soft-taupe">(disconnected)</span>
            )}
          </button>
        ))}
      </div>

      {/* Week View */}
      {activeView === "week" && (
        <div className="bg-white rounded-2xl soft-shadow overflow-hidden">
          {/* Week Header */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 border-r border-gray-200">
              <span className="text-sm text-soft-taupe">Time</span>
            </div>
            {weekDays.map((day, idx) => {
              const isToday =
                day.getDate() === new Date().getDate() &&
                day.getMonth() === new Date().getMonth();
              const isSelected =
                day.getDate() === selectedDate.getDate() &&
                day.getMonth() === selectedDate.getMonth();
              
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`p-4 text-center transition-colors ${
                    isSelected
                      ? "bg-teal/10"
                      : isToday
                      ? "bg-gold/10"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="text-sm text-soft-taupe">{DAYS[day.getDay()]}</p>
                  <p
                    className={`text-xl font-bold ${
                      isToday ? "text-gold" : "text-navy"
                    }`}
                  >
                    {day.getDate()}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-8 h-96 overflow-y-auto">
            {/* Time Column */}
            <div className="border-r border-gray-200">
              {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-gray-100 px-2 py-1"
                >
                  <span className="text-xs text-soft-taupe">
                    {hour % 12 || 12} {hour >= 12 ? "PM" : "AM"}
                  </span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map((day, dayIdx) => {
              const dayEvents = getEventsForDate(day);
              
              return (
                <div
                  key={dayIdx}
                  className="border-r border-gray-200 relative"
                  onClick={() => setSelectedDate(day)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    />
                  ))}
                  
                  {/* Events */}
                  {dayEvents.map((event) => {
                    const startHour = event.startTime.getHours();
                    const startMinute = event.startTime.getMinutes();
                    const endHour = event.endTime.getHours();
                    const endMinute = event.endTime.getMinutes();
                    const duration =
                      (endHour - startHour) * 60 + (endMinute - startMinute);
                    const top = (startHour - 8) * 64 + (startMinute / 60) * 64;
                    const height = (duration / 60) * 64;
                    
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-lg p-2 text-xs cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          backgroundColor: event.color + "20",
                          borderLeft: `3px solid ${event.color}`,
                        }}
                      >
                        <p className="font-medium text-navy truncate">
                          {event.title}
                        </p>
                        <p className="text-soft-taupe">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Date Events */}
      <div className="mt-8 bg-white rounded-2xl p-6 soft-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif text-navy">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <span className="text-sm text-soft-taupe">
            {selectedDateEvents.length} events
          </span>
        </div>

        {selectedDateEvents.length === 0 ? (
          <div className="text-center py-8 text-soft-taupe">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No events scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-cream-dark/30"
                style={{ borderLeft: `4px solid ${event.color}` }}
              >
                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-bold text-navy">
                    {formatTime(event.startTime)}
                  </p>
                  <p className="text-xs text-soft-taupe">
                    {formatTime(event.endTime)}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-navy">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-soft-taupe mt-1">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        {event.isVirtual && (
                          <span className="flex items-center gap-1 text-xs text-teal">
                            <Video className="w-3 h-3" />
                            Virtual
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1 text-xs text-soft-taupe">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-soft-taupe">
                            <Users className="w-3 h-3" />
                            {event.attendees.length} attendees
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.meetingLink && (
                        <a
                          href={event.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors"
                        >
                          Join
                        </a>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-soft-taupe" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Calendar Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">Connect Calendar</h2>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Google Calendar */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#4285F4">
                    <path d="M19.5 3h-15A2.5 2.5 0 0 0 2 5.5v13A2.5 2.5 0 0 0 4.5 21h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 3zm-9.75 13.5h-3v-3h3v3zm0-4.5h-3v-3h3v3zm4.5 4.5h-3v-3h3v3zm0-4.5h-3v-3h3v3z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy">Google Calendar</p>
                  <p className="text-sm text-soft-taupe">Connect your Google account</p>
                </div>
              </button>

              {/* iCloud Calendar */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF9500">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy">iCloud Calendar</p>
                  <p className="text-sm text-soft-taupe">Connect your Apple ID</p>
                </div>
              </button>

              {/* Outlook Calendar */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0078D4">
                    <path d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.2 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy">Outlook Calendar</p>
                  <p className="text-sm text-soft-taupe">Connect your Microsoft account</p>
                </div>
              </button>

              {/* Other */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy">Other Calendar</p>
                  <p className="text-sm text-soft-taupe">Connect via CalDAV or iCal</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
