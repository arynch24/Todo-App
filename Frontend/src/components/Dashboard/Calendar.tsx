import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { PanelRightOpen } from 'lucide-react';
import axios from "axios";

export default function CalendarComponent() {
  type EventType = {
    id: string;
    title: string;
    description: string;
    start: string | Date;
    end: string | Date;
    allDay: boolean;
  };

  //State to store events
  const [events, setEvents] = useState<EventType[]>([]);
  const [isOpenEditor, setIsOpenEditor] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<{ startStr: string; endStr: string } | null>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);

  //Fetching Events from the backend
  const fetchEvents = async () => {
    const res = await axios.get('https://routine-jf3l.onrender.com/api/google/events', {
      withCredentials: true,
    });

    const data = res.data;
    const formatted = data.map((e: any) => {
      return {
        id: e.id,
        start: e.start.dateTime,
        end: e.end.dateTime,
        title: e.summary,
        description: e.description || "",
        allDay: false
      }
    });
    console.log(formatted);
    setEvents(formatted);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    console.log("Updated events:", events);
  }, [events]);

  //Creating Events
  const handleCreateEvent = async () => {
    if (!selectedSlot) return;

    const newEvent = {
      summary: title,
      description: description,
      start: {
        dateTime: selectedSlot.startStr,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: selectedSlot.endStr,
        timeZone: "Asia/Kolkata",
      },
    };

    try {
      const res = await axios.post('https://routine-jf3l.onrender.com/api/google/events/create', newEvent, {
        withCredentials: true,
      });

      const formattedNewEvent = {
        id: res.data.id,
        start: newEvent.start.dateTime,
        end: newEvent.end.dateTime,
        title: newEvent.summary,
        description: newEvent.description,
        allDay: false,
      };

      setEvents((prevEvents) => [
        ...prevEvents,
        { ...formattedNewEvent },
      ]);
      setIsOpenEditor(false);
      setEditEventId(null);
    }
    catch (err) {
      console.error("Error creating event:", err);
    }

  };

  //handle Save Edit
  const handleSaveEdit = (e: any) => {
    const event = e.event;
    setEditEventId(event.id);
    setTitle(event.title);
    setDescription(event.extendedProps.description);
    setIsOpenEditor(true);
    setSelectedSlot({
      startStr: event.startStr,
      endStr: event.endStr,
    });
  }

  //Updating Events Content
  const handleEventUpdate = async () => {
    if (!editEventId || !selectedSlot) return;

    const updatedEvent = {
      id: editEventId,
      summary: title,
      description: description,
      start: {
        dateTime: selectedSlot.startStr,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: selectedSlot.endStr,
        timeZone: "Asia/Kolkata",
      },
    };

    try {
      await axios.patch(
        `https://routine-jf3l.onrender.com/api/google/events/${editEventId}`,
        updatedEvent,
        { withCredentials: true }
      );

      console.log("e.event - updated", event);

      const formattedUpdatedEvent = {
        id: editEventId,
        start: updatedEvent.start.dateTime,
        end: updatedEvent.end.dateTime,
        title: title,
        description: description,
        allDay: false,
      };

      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === editEventId ? { ...ev, ...formattedUpdatedEvent } : ev
        )
      );
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  //handling drag or resize
  const handleDragOrResize = async (e: any) => {
    const event = e.event;

    const updatedEvent = {
      summary: event.title,
      description: event.extendedProps.description || "",
      start: {
        dateTime: event.start.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: event.end.toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };

    try {
      await axios.patch(
        `https://routine-jf3l.onrender.com/api/google/events/${event.id}`,
        updatedEvent,
        { withCredentials: true }
      );

      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === event.id ? {
            ...ev,
            start: updatedEvent.start.dateTime,
            end: updatedEvent.end.dateTime,
          } : ev
        )
      );
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };


  //Deleting Events
  const handleEventDelete = async () => {
    if (!editEventId) return;

    try {
      await axios.delete(`https://routine-jf3l.onrender.com/api/google/events/${editEventId}`, {
        withCredentials: true,
      });

      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.id !== editEventId)
      );
      setEditEventId(null);
      setTitle("");
      setDescription("");
    }
    catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="h-full w-full flex ">
      {
        isOpenEditor && (
          <div className="w-54 h-full border-r-1 border-zinc-300 ">
            <div className="h-full">
              <form className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Unitiled"
                      className="border-b-1 border-zinc-300 p-2 font-semibold text-zinc-700 text-xl focus:outline-none w-full mb-4 mt-2"
                      onChange={(e: any) => { setTitle(e.target.value) }}
                      value={title}
                    />
                    <div className="p-1 mr-1 mb-1 hover:bg-zinc-100 cursor-pointer rounded-lg">
                      <PanelRightOpen strokeWidth={1} size={18}
                        className="text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 "
                        onClick={() => { setIsOpenEditor(false) }}
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Add Description"
                    className=" p-2 rounded w-full text-sm mb-4 focus:outline-none"
                    onChange={(e: any) => { setDescription(e.target.value) }}
                    value={description}
                  />
                </div>

                {
                  (title || description) && (
                    <div className=" w-full flex justify-between p-3 mb-2">
                      {
                        editEventId && (<button
                          type="button"
                          onClick={handleEventDelete}
                          className="text-coral border-1 border-[#fac0c0] px-2 py-1 hover:bg-[#f8eaea] cursor-pointer transition-colors rounded-sm"
                        >
                          Delete
                        </button>)
                      }

                      <button
                        type="button"
                        className="bg-zinc-800 text-white px-3 py-1 rounded cursor-pointer hover:bg-zinc-700 transition-colors"
                        onClick={editEventId ? handleEventUpdate : handleCreateEvent}
                      >
                        {editEventId ? "Update" : "Create"}
                      </button>
                    </div>)
                }

              </form>
            </div>
          </div>
        )
      }
      <div className="flex-1 w-full overflow-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          allDaySlot={false}
          editable={true}
          selectable={true}

          //pass an array of events objects to the events prop
          events={[...events]}
          select={(e) => {
            setTitle("");
            setDescription("");
            setIsOpenEditor(true);
            setSelectedSlot({ startStr: e.startStr, endStr: e.endStr });
            setEditEventId(null);
          }}
          eventClick={handleSaveEdit}
          eventDrop={handleDragOrResize}
          eventResize={handleDragOrResize}

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
          slotDuration={"00:15:00"}
          slotLabelInterval={"01:00:00"}
          dayHeaderFormat={{ weekday: 'short', day: '2-digit', omitCommas: true }}
          titleFormat={{
            year: 'numeric',
            month: 'short',
          }}
        />
      </div>
    </div>
  );
}
