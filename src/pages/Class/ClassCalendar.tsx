import Calendar from "../Calendar";
import { useEffect, useState } from "react";
import { getUserIdFromLocalStorage } from "../../components/common/utils";

interface CalendarInputItem {
    classId: string;
    id: string;
    timeFrom: string;
    timeText: string;
    timeTo: string;
    title: string;
}


export default function ClassCalendar() {
    const [calendarInput, setCalendarInput] = useState<CalendarInputItem[]>([]);
    const userId = getUserIdFromLocalStorage();

    useEffect(() => {
        const fetchCalendarInput = async () => {
            const reponse = await fetch(`${import.meta.env.VITE_API_URL}/user/get-calendar/${userId}`)
            const data = await reponse.json();
            setCalendarInput(data)
        }
        fetchCalendarInput()
    }, [])
    return (
        <Calendar calendarInput={calendarInput} />
    );
}