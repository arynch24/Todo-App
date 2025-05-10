// Calendar.js
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarComponent() {
  return (
    <div className="h-full w-full overflow-clip">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        allDaySlot={false}
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
        editable={true}
        selectable={true}
        events={[
          { title: "Meeting", date: "2025-05-11" },
          // Add dynamic events later
        ]}
        dateClick={(info) => {
          alert("Clicked date: " + info.dateStr);
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
