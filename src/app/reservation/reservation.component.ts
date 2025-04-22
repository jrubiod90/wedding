import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  providers: [DatePipe]
})
export class ReservationComponent {
  currentMonth: Date = new Date();
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  availableHours: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  daysInMonth: any[] = [];

  constructor(private datePipe: DatePipe) {
    this.updateCalendar();
  }

  // Actualiza los días del mes visible
  updateCalendar() {
    const startOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const days: any[] = [];

    for (let day = startOfMonth.getDate(); day <= endOfMonth.getDate(); day++) {
      const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
      days.push({ date: day, fullDate: date });
    }

    this.daysInMonth = days;
  }

  previousMonth() {
    const previousMonth = new Date(this.currentMonth);
    previousMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.currentMonth = previousMonth;
    this.updateCalendar();
  }
  
  nextMonth() {
    const nextMonth = new Date(this.currentMonth);
    nextMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.currentMonth = nextMonth;
    this.updateCalendar();
  }
  

  // Seleccionar un día en el calendario
  selectDate(day: any) {
    this.selectedDate = day.fullDate;
    this.selectedTime = null;  // Reiniciar la hora seleccionada
  }

  // Seleccionar una hora
  onTimeSelect(hour: string) {
    this.selectedTime = hour;
  }

  // Confirmar la reserva
  confirmReservation() {
    if (this.selectedDate && this.selectedTime) {
      alert(`¡Reserva confirmada para el `);
    } else {
      alert('Por favor, selecciona una fecha y hora.');
    }
  }
}
