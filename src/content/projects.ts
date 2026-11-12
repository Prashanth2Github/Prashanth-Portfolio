import type { Project } from "./types";

/** From the PROJECTS section of the résumé. No repo/demo URLs were provided, so none are shown. */
export const projects: Project[] = [
  {
    id: "smart-deadline-notifier",
    code: "PRJ-01",
    title: "Smart Deadline Notifier",
    category: "Prediction · Personalisation",
    summary:
      "An intelligent task and deadline manager that learns from user activity and historical patterns to organise and prioritise work.",
    problem: "Deadlines slip when tasks are tracked but never prioritised.",
    contribution:
      "Developed the system end to end — the prediction model, task and reminder processing, and the MERN dashboard.",
    decisions: [
      "LSTM-based prediction over historical activity patterns to prioritise tasks",
      "NLP techniques to process task and reminder text",
      "MongoDB for persistent task and reminder storage",
      "A MERN dashboard with automated reminders and personalised scheduling",
    ],
    tech: ["Python", "LSTM", "NLP", "MongoDB", "Express", "React", "Node.js"],
    diagram: "deadline",
  },
  {
    id: "vehicle-rental-system",
    code: "PRJ-02",
    title: "Vehicle Rental System",
    category: "Transactions · Relational data",
    summary: "A desktop application that manages the full operational lifecycle of a vehicle rental business.",
    problem:
      "Rentals involve linked records — customers, vehicles, bookings, returns and maintenance — that have to stay consistent.",
    contribution:
      "Built the application in Java: registration, vehicle management, availability, booking, returns and maintenance.",
    decisions: [
      "An object-oriented domain model for users, vehicles and bookings",
      "A relational database accessed through JDBC and SQL",
      "Availability tracking tied directly to booking and return processing",
      "Maintenance management as part of each vehicle's lifecycle",
    ],
    tech: ["Java", "JDBC", "SQL"],
    diagram: "rental",
  },
  {
    id: "smart-glove",
    code: "PRJ-03",
    title: "Smart Glove for the Visually Impaired",
    category: "Accessibility · Embedded systems",
    summary:
      "A wearable assistive glove that supports navigation and object recognition through real-time feedback.",
    problem: "Navigation and object-recognition assistance delivered through touch, not sight.",
    contribution: "Designed and developed the wearable: sensor processing, gesture recognition and feedback.",
    decisions: [
      "ESP32 and Arduino for sensor processing and gesture recognition",
      "Bluetooth communication between components",
      "Real-time feedback designed for intuitive, accessible interaction",
    ],
    tech: ["ESP32", "Arduino", "Bluetooth"],
    diagram: "glove",
  },
];
