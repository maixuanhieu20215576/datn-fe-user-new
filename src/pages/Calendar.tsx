import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import Modal from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import moment from "moment";
interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    classId: string;
  };
}

interface CalendarInputItem {
  classId: string;
  id: string;
  timeFrom: string;
  timeText: string;
  timeTo: string;
  title: string;
}

const colors = ["Primary", "Success", "Warning", "Danger"];

const colorMap = new Map<string, string>();

const formatCalendarInput = (input: {
  classId: string;
  id: string;
  timeFrom: string;
  timeText: string;
  timeTo: string;
  title: string;
}) => {
  if (!colorMap.has(input.classId)) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    colorMap.set(input.classId, randomColor);
  }

  return {
    id: input.id,
    title: input.title,
    start: `${input.timeText}T${input.timeFrom}`,
    end: `${input.timeText}T${input.timeTo}`,
    extendedProps: {
      calendar: colorMap.get(input.classId) || "Primary",
      classId: input.classId
    },
  };
};

const Calendar: React.FC<{ calendarInput: CalendarInputItem[] }> = ({ calendarInput }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const formattedEvents = calendarInput.map(item => formatCalendarInput(item));
    setEvents(formattedEvents);
  }, [calendarInput]);


  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openModal();
  };


  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">{selectedEvent?.title}</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Thời gian:</span> {moment(selectedEvent?.start?.toString()).format('HH:mm')} - {moment(selectedEvent?.end?.toString()).format('HH:mm')}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Ngày:</span> {moment(selectedEvent?.start?.toString()).format('DD/MM/YYYY')}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Mã lớp:</span> {selectedEvent?.extendedProps.classId}
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const renderEventContent = (eventInfo: { event: CalendarEvent; timeText: string }) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm text-xs truncate`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time truncate">{eventInfo.timeText}</div>
      <div className="fc-event-title truncate">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
