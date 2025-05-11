import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CalendarComponent() {
  type EventType = {
    id: string;
    summary: string;
    start: string | Date;
    end: string | Date;
  };

  //State to store events
  const [events, setEvents] = useState<EventType[]>([]);

  //Fetching Events from the backend
  const fetchEvents = async () => {
    const res = await axios.get('https://routine-jf3l.onrender.com/api/google/events', {
      withCredentials: true,
    });

    const data = res.data;
    const formatted = data.map((e:any)=>{
      return {
        id: e.id,
        start: e.start,
        end: e.end,
        title: e.summary,
        allDay: false
      }
    });
    setEvents(formatted);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  //Creating Events
  const handleCreateEvent = async (e:any) => {
    const title = prompt("New Event Title");
    if (title) {
      const newEvent = {
        summary: title,
        start: e.startStr,
        end: e.endStr,
      };

      const res = await axios.post('https://routine-jf3l.onrender.com/api/google/events/create', newEvent, {
        withCredentials: true,
      });

      setEvents((prevEvents) => [
        ...prevEvents,
        { id: res.data.id, ...newEvent },
      ]);
    }
  };

  //Updating Events
  const handleEventDrop = async (e:any) => {
    const event= e.event;
    const updatedEvent = {
      id: event.id,
      start: event.startStr,
      end: event.endStr,
    };

    await axios.patch(`https://routine-jf3l.onrender.com/api/google/events/${event.id}`, updatedEvent, {
      withCredentials: true,
    });

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  //Deleting Events
  const handleEventClick = async (e:any) => {
    const event = e.event;
    if (confirm(`Delete event '${event.title}'`)) {
      await axios.delete(`https://routine-jf3l.onrender.com/api/google/events/${event.id}`, {
        withCredentials: true,
      });

      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.id !== event.id)
      );
    }
  };

  return (
    <div className="h-full w-full overflow-clip">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        allDaySlot={false}
        editable={true}
        selectable={true}

        //pass an array of events objects to the events prop
        events={events}
        select={handleCreateEvent}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}

        headerToolbar={{
          left: 'title prev,next',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        slotDuration={"01:00:00"}
        slotLabelInterval={"01:00:00"}
        dayHeaderFormat={{ weekday: 'short', day: '2-digit', omitCommas: true }}
        titleFormat={{
          year: 'numeric',
          month: 'short',
        }}
      />
    </div>
  );
}
