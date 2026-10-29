const STORAGE_KEY = "sigpra_mvp_data_v1";
const SESSION_KEY = "sigpra_mvp_session_v1";
const API_BASE = "/api";

let apiEnabled = false;
let apiStatusText = "Modo local";
let syncTimer = null;

const additionalDemoStudents = [
  { id: 7, name: "Sofia Martinez", email: "sofia@udi.edu.co", password: "123456", role: "ESTUDIANTE", initials: "SM", code: "UDI-2026-003", semester: 8 },
  { id: 8, name: "Daniel Torres", email: "daniel@udi.edu.co", password: "123456", role: "ESTUDIANTE", initials: "DT", code: "UDI-2026-004", semester: 8 },
  { id: 9, name: "Valentina Ruiz", email: "valentina@udi.edu.co", password: "123456", role: "ESTUDIANTE", initials: "VR", code: "UDI-2026-005", semester: 8 }
];

const additionalDemoPlaces = [
  { id: 3, agreementId: 1, level: "Practica pedagogica VIII", shift: "TARDE", offered: 4, occupied: 0, tutor: "Sandra Perez", status: "DISPONIBLE" },
  { id: 4, agreementId: 1, level: "Practica pedagogica VIII", shift: "MIXTA", offered: 3, occupied: 0, tutor: "Sandra Perez", status: "DISPONIBLE" },
  { id: 5, agreementId: 2, level: "Practica pedagogica VIII", shift: "MANANA", offered: 5, occupied: 0, tutor: "Paula Vargas", status: "DISPONIBLE" }
];

const seedData = {
  users: [
    { id: 1, name: "Rafael Carreno", email: "coordinador@udi.edu.co", password: "123456", role: "COORDINADOR", initials: "RC" },
    { id: 2, name: "Laura Gomez", email: "estudiante@udi.edu.co", password: "123456", role: "ESTUDIANTE", initials: "LG", code: "UDI-2026-001", semester: 8 },
    { id: 3, name: "Martha Rodriguez", email: "docente@udi.edu.co", password: "123456", role: "DOCENTE_ASESOR", initials: "MR" },
    { id: 4, name: "Director Programa", email: "director@udi.edu.co", password: "123456", role: "DIRECTOR", initials: "DP" },
    { id: 5, name: "Miguel Rios", email: "miguel@udi.edu.co", password: "123456", role: "ESTUDIANTE", initials: "MR", code: "UDI-2026-002", semester: 8 },
    { id: 6, name: "Carlos Mendoza", email: "docente2@udi.edu.co", password: "123456", role: "DOCENTE_ASESOR", initials: "CM" },
    ...additionalDemoStudents
  ],
  programs: [
    { id: 1, name: "Ingenieria de Sistemas", levels: ["Practica profesional"], active: true },
    { id: 2, name: "Licenciatura en Pedagogia", levels: ["Practica I", "Practica II"], active: true },
    { id: 3, name: "Licenciatura en Educacion Infantil", levels: ["VIII semestre"], active: true }
  ],
  periods: [
    {
      id: 1,
      program: "Licenciatura en Educacion Infantil",
      level: "VIII semestre",
      year: 2026,
      semester: 2,
      start: "2026-08-17",
      end: "2026-11-28",
      reportLimit: "2026-11-30",
      minHours: 320,
      status: "PUBLICADO",
      rubric: [
        { name: "Cumplimiento de horas", weight: 35 },
        { name: "Calidad del soporte", weight: 25 },
        { name: "Desempeno institucional", weight: 25 },
        { name: "Informe final", weight: 15 }
      ]
    }
  ],
  institutions: [
    {
      id: 1,
      name: "Centro Educativo La Esperanza",
      nit: "900123456-1",
      contact: "Sandra Perez",
      phone: "607 555 1234",
      email: "contacto@laesperanza.edu.co",
      active: true
    },
    {
      id: 2,
      name: "Fundacion Aprender",
      nit: "901222333-4",
      contact: "Paula Vargas",
      phone: "607 555 7788",
      email: "practicas@aprender.org",
      active: true
    }
  ],
  agreements: [
    { id: 1, institutionId: 1, number: "CV-2026-013", start: "2026-01-15", end: "2027-06-30", status: "VIGENTE", document: "convenio-la-esperanza.pdf" },
    { id: 2, institutionId: 2, number: "CV-2025-044", start: "2025-03-01", end: "2026-12-15", status: "VIGENTE", document: "convenio-aprender.pdf" }
  ],
  places: [
    { id: 1, agreementId: 1, level: "Practica pedagogica VIII", shift: "MANANA", offered: 12, occupied: 1, tutor: "Sandra Perez", status: "DISPONIBLE" },
    { id: 2, agreementId: 2, level: "Practica pedagogica VIII", shift: "TARDE", offered: 6, occupied: 1, tutor: "Paula Vargas", status: "DISPONIBLE" },
    ...additionalDemoPlaces
  ],
  assignments: [
    { id: 1, studentId: 2, teacherId: 3, placeId: 1, periodId: 1, date: "2026-08-20", status: "ACTIVA", approvedHours: 96 },
    { id: 2, studentId: 5, teacherId: 6, placeId: 2, periodId: 1, date: "2026-08-21", status: "ACTIVA", approvedHours: 42 }
  ],
  activities: [
    {
      id: 1,
      assignmentId: 1,
      date: "2026-09-13",
      type: "Acompanamiento pedagogico",
      description: "Apoyo en planeacion y ejecucion de actividad de lectura guiada con grupo de transicion.",
      hours: 4,
      status: "PENDIENTE",
      observation: ""
    },
    {
      id: 2,
      assignmentId: 1,
      date: "2026-09-06",
      type: "Planeacion de clase",
      description: "Preparacion de material didactico y guia de clase.",
      hours: 6,
      status: "APROBADA",
      observation: "Soporte completo."
    },
    {
      id: 3,
      assignmentId: 2,
      date: "2026-09-10",
      type: "Refuerzo pedagogico",
      description: "Acompanamiento a estudiantes con dificultad lectora.",
      hours: 3,
      status: "DEVUELTA",
      observation: "Adjuntar soporte firmado por la institucion."
    }
  ],
  evidences: [
    { id: 1, activityId: 1, fileName: "evidencia_foto.pdf", type: "PDF", url: "storage/sigpra/2026-2/asignacion-1/actividad-1/evidencia_foto.pdf", status: "CARGADA", mongoId: "ev-demo-001" },
    { id: 2, activityId: 2, fileName: "planeacion_clase.docx", type: "DOCX", url: "storage/sigpra/2026-2/asignacion-1/actividad-2/planeacion_clase.docx", status: "VALIDADA", mongoId: "ev-demo-002" }
  ],
  visits: [
    { id: 1, assignmentId: 1, teacherId: 3, date: "2026-09-20", mode: "PRESENCIAL", attendance: true, observation: "Buen manejo del grupo. Se recomienda fortalecer el cierre de la actividad.", score: 4.4, status: "REGISTRADA" }
  ],
  requests: [
    {
      id: 1,
      studentId: 2,
      periodId: 1,
      level: "VIII semestre",
      modality: "Convenio institucional",
      placeId: 1,
      status: "APROBADA",
      documents: {
        matricula: { name: "matricula_laura.pdf", type: "application/pdf", uploadedAt: "2026-08-18" },
        epsArl: { name: "arl_sura_laura.pdf", type: "application/pdf", uploadedAt: "2026-08-18" },
        pazYSalvo: { name: "paz_y_salvo_laura.pdf", type: "application/pdf", uploadedAt: "2026-08-18" }
      },
      comments: "Solicitud radicada para realizar practica en Centro Educativo La Esperanza.",
      submittedAt: "2026-08-18 09:30",
      reviewedAt: "2026-08-19 14:15",
      reviewedBy: 4,
      justification: "Cumple con totalidad de créditos y documentación verificada.",
      createdAt: "2026-08-18 09:10",
      updatedAt: "2026-08-19 14:15"
    },
    {
      id: 2,
      studentId: 5,
      periodId: 1,
      level: "VIII semestre",
      modality: "Convenio institucional",
      placeId: 2,
      status: "APROBADA",
      documents: {
        matricula: { name: "matricula_miguel.pdf", type: "application/pdf", uploadedAt: "2026-08-19" },
        epsArl: { name: "arl_positiva_miguel.pdf", type: "application/pdf", uploadedAt: "2026-08-19" },
        pazYSalvo: { name: "paz_y_salvo_miguel.pdf", type: "application/pdf", uploadedAt: "2026-08-19" }
      },
      comments: "Interés en turno de la tarde.",
      submittedAt: "2026-08-19 10:00",
      reviewedAt: "2026-08-20 11:00",
      reviewedBy: 4,
      justification: "Documentación en regla.",
      createdAt: "2026-08-19 09:45",
      updatedAt: "2026-08-20 11:00"
    },
    {
      id: 3,
      studentId: 7,
      periodId: 1,
      level: "VIII semestre",
      modality: "Convenio institucional",
      placeId: 3,
      status: "PENDIENTE_REVISION",
      documents: {
        matricula: { name: "matricula_sofia.pdf", type: "application/pdf", uploadedAt: "2026-08-22" },
        epsArl: { name: "eps_sanitas_sofia.pdf", type: "application/pdf", uploadedAt: "2026-08-22" },
        pazYSalvo: { name: "paz_y_salvo_sofia.pdf", type: "application/pdf", uploadedAt: "2026-08-22" }
      },
      comments: "Solicitud pendiente de revision por Director de Programa.",
      submittedAt: "2026-08-22 15:40",
      createdAt: "2026-08-22 15:00",
      updatedAt: "2026-08-22 15:40"
    },
    {
      id: 4,
      studentId: 8,
      periodId: 1,
      level: "VIII semestre",
      modality: "Practica autogestionada",
      suggestedCompany: "Colegio Bilingüe San José",
      status: "BORRADOR",
      documents: {
        matricula: { name: "matricula_daniel.pdf", type: "application/pdf", uploadedAt: "2026-08-23" }
      },
      comments: "Borrador en curso. Pendiente anexar paz y salvo académico.",
      createdAt: "2026-08-23 11:20",
      updatedAt: "2026-08-23 11:25"
    },
    {
      id: 5,
      studentId: 9,
      periodId: 1,
      level: "VIII semestre",
      modality: "Convenio institucional",
      placeId: 4,
      status: "DEVUELTA",
      documents: {
        matricula: { name: "matricula_valentina.pdf", type: "application/pdf", uploadedAt: "2026-08-21" },
        epsArl: { name: "eps_sura_valentina.pdf", type: "application/pdf", uploadedAt: "2026-08-21" },
        pazYSalvo: { name: "paz_salvo_antiguo.pdf", type: "application/pdf", uploadedAt: "2026-08-21" }
      },
      comments: "Por favor revisar el documento de paz y salvo.",
      submittedAt: "2026-08-21 16:10",
      reviewedAt: "2026-08-22 09:00",
      reviewedBy: 4,
      justification: "El certificado de paz y salvo aportado corresponde al periodo 2025-2. Por favor adjuntar constancia de créditos actualizada al semestre actual.",
      createdAt: "2026-08-21 15:30",
      updatedAt: "2026-08-22 09:00"
    }
  ],
  audit: [
    { id: 1, date: "2026-09-13 10:00", user: "Sistema", event: "Carga inicial de datos demo", entity: "APP" }
  ]
};

let data = loadData();
let session = loadSession();
let currentView = "dashboard";
let reportFilters = { periodId: "", program: "", institutionId: "", teacherId: "" };
let directorFilter = "ALL";
let studentRequestTab = "status";
let directorStatusFilter = "ALL";
let notificationsOpen = false;
const readNotifIds = new Set();
let authMode = "login";

const app = document.querySelector("#app");

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(seedData);
  try {
    const stored = JSON.parse(saved);
    if (Array.isArray(stored.users)) {
      let migrated = false;
      stored.users = stored.users.map((user) => {
        if (typeof user.email === "string" && user.email.endsWith("@sigpra.edu.co")) {
          migrated = true;
          return { ...user, email: user.email.replace(/@sigpra\.edu\.co$/, "@udi.edu.co") };
        }
        return user;
      });
      for (const student of additionalDemoStudents) {
        if (!stored.users.some((user) => user.email === student.email)) {
          stored.users.push({ ...student, id: nextId(stored.users) });
          migrated = true;
        }
      }
      if (Array.isArray(stored.places)) {
        for (const place of additionalDemoPlaces) {
          if (!stored.places.some((item) =>
            item.agreementId === place.agreementId && item.level === place.level && item.shift === place.shift
          )) {
            stored.places.push({ ...place, id: nextId(stored.places) });
            migrated = true;
          }
        }
      }
      if (migrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }
    if (!Array.isArray(stored.programs)) {
      stored.programs = structuredClone(seedData.programs);
      for (const period of stored.periods || []) {
        let program = stored.programs.find((item) => item.name.toLocaleLowerCase("es") === String(period.program).toLocaleLowerCase("es"));
        if (!program) {
          program = { id: nextId(stored.programs), name: period.program, levels: [], active: true };
          stored.programs.push(program);
        }
        if (!program.levels.includes(period.level)) program.levels.push(period.level);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }
    if (!Array.isArray(stored.requests)) {
      stored.requests = structuredClone(seedData.requests || []);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }
    return stored;
  } catch {
    return structuredClone(seedData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  syncDataWithApi();
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de API" }));
    throw new Error(error.message || "Error de API");
  }
  return response.json();
}

async function initializeApi() {
  try {
    await apiRequest("/health");
    const [state, periods, agreements, assignments] = await Promise.all([
      apiRequest("/state"),
      apiRequest("/periods"),
      apiRequest("/agreements"),
      apiRequest("/assignments")
    ]);
    if (state?.data) {
      if (!Array.isArray(state.data.programs)) {
        state.data.programs = structuredClone(seedData.programs);
        for (const period of state.data.periods || []) {
          let program = state.data.programs.find((item) => item.name.toLocaleLowerCase("es") === String(period.program).toLocaleLowerCase("es"));
          if (!program) { program = { id: nextId(state.data.programs), name: period.program, levels: [], active: true }; state.data.programs.push(program); }
          if (!program.levels.includes(period.level)) program.levels.push(period.level);
        }
      }
      // Combinar usuarios y solicitudes
      const localUsers = Array.isArray(data?.users) ? data.users : [];
      const serverUsers = Array.isArray(state.data?.users) ? state.data.users : [];
      const mergedUsers = [...serverUsers];
      let needsSync = false;
      for (const lu of localUsers) {
        if (!mergedUsers.some(su => su.email.toLowerCase() === lu.email.toLowerCase())) {
          mergedUsers.push(lu);
          needsSync = true;
        }
      }
      const localReqs = Array.isArray(data?.requests) ? data.requests : [];
      const serverReqs = Array.isArray(state.data?.requests) ? state.data.requests : [];
      const mergedReqs = [...serverReqs];
      for (const lr of localReqs) {
        if (!mergedReqs.some(sr => sr.id === lr.id)) {
          mergedReqs.push(lr);
          needsSync = true;
        }
      }

      data = {
        ...state.data,
        users: mergedUsers,
        requests: mergedReqs,
        periods: periods.periods,
        institutions: agreements.institutions,
        agreements: agreements.agreements,
        places: agreements.places,
        assignments: assignments.assignments
      };
      if (needsSync) {
        apiRequest("/state", { method: "PUT", body: JSON.stringify(data) }).catch(() => {});
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    apiEnabled = true;
    apiStatusText = "API Express conectada";
  } catch {
    apiEnabled = false;
    apiStatusText = "Modo local";
  }
  render();
}

function syncDataWithApi() {
  if (!apiEnabled) return;
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(async () => {
    try {
      await apiRequest("/state", {
        method: "PUT",
        body: JSON.stringify(data)
      });
      apiStatusText = "API Express sincronizada";
    } catch {
      apiEnabled = false;
      apiStatusText = "Modo local";
      render();
    }
  }, 250);
}

async function loginWithApi(email, password) {
  if (!apiEnabled) {
    return data.users.find((item) => item.email === email && item.password === password) || null;
  }
  try {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    return data.users.find((item) => item.id === result.user.id) || result.user;
  } catch {
    return null;
  }
}

function loadSession() {
  const saved = localStorage.getItem(SESSION_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveSession(user) {
  session = user ? { userId: user.id } : null;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

function currentUser() {
  return data.users.find((user) => user.id === session?.userId) || null;
}

function nextId(collection) {
  return Math.max(0, ...collection.map((item) => Number(item.id))) + 1;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateGuidedWorkflow(form) {
  let previousStepComplete = true;
  for (const step of form.querySelectorAll("[data-workflow-step]")) {
    step.hidden = !previousStepComplete;
    const controls = step.querySelectorAll("input, select, textarea");
    controls.forEach((control) => {
      if (!control.hasAttribute("data-original-disabled")) {
        control.dataset.originalDisabled = String(control.disabled);
      }
      control.disabled = !previousStepComplete || control.dataset.originalDisabled === "true";
    });
    const requiredControls = [...controls].filter((control) => control.required);
    previousStepComplete = previousStepComplete &&
      requiredControls.every((control) => control.checkValidity());
  }
}

function moneyDate(value) {
  if (!value) return "Sin fecha";
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "2-digit" });
}

function toast(message) {
  document.querySelector(".sigpra-toast")?.remove();
  const node = document.createElement("div");
  node.className = "sigpra-toast tw-shadow-2xl tw-transition-all";
  node.setAttribute("role", "status");
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

function audit(event, entity) {
  const user = currentUser();
  data.audit.unshift({
    id: nextId(data.audit),
    date: new Date().toLocaleString("es-CO"),
    user: user?.name || "Sistema",
    event,
    entity
  });
}

function roleLabel(role) {
  return {
    COORDINADOR: "Coordinador de practicas",
    ESTUDIANTE: "Estudiante practicante",
    DOCENTE_ASESOR: "Docente asesor",
    DIRECTOR: "Director de programa"
  }[role] || role;
}

function statusTag(status) {
  const ok = ["APROBADA", "PUBLICADO", "VIGENTE", "ACTIVA", "VALIDADA", "REGISTRADA"];
  const warn = ["PENDIENTE", "CONFIGURACION", "DEVUELTA", "BORRADOR"];
  const bad = ["RECHAZADA", "VENCIDO", "CANCELADA", "INACTIVA"];
  const cls = ok.includes(status) ? "ok" : warn.includes(status) ? "warn" : bad.includes(status) ? "bad" : "";
  return `<span class="badge rounded-pill tag ${cls} tw-inline-flex tw-items-center tw-transition-transform hover:tw-scale-105 tw-cursor-default">${escapeHtml(status)}</span>`;
}

function agreementStatus(agreement) {
  const today = new Date().toISOString().slice(0, 10);
  return Boolean(String(agreement.document || "").trim()) && agreement.end >= today
    ? "VIGENTE"
    : "INACTIVA";
}

function placeStatus(place, agreement) {
  return agreement && agreementStatus(agreement) === "VIGENTE" && place.occupied < place.offered
    ? "DISPONIBLE"
    : "INACTIVA";
}

function assignmentPlaceLabel(place) {
  const agreement = data.agreements.find((item) => item.id === place.agreementId);
  const institution = data.institutions.find((item) => item.id === agreement?.institutionId);
  return `${institution?.name || "Institucion"} - ${place.level} (${place.shift})`;
}

function studentUsers() {
  return data.users.filter((user) => user.role === "ESTUDIANTE");
}

function teacherUsers() {
  return data.users.filter((user) => user.role === "DOCENTE_ASESOR");
}

function assignmentDetails(assignment) {
  const student = data.users.find((user) => user.id === assignment.studentId);
  const teacher = data.users.find((user) => user.id === assignment.teacherId);
  const place = data.places.find((item) => item.id === assignment.placeId);
  const agreement = data.agreements.find((item) => item.id === place?.agreementId);
  const institution = data.institutions.find((item) => item.id === agreement?.institutionId);
  const period = data.periods.find((item) => item.id === assignment.periodId);
  return { student, teacher, place, agreement, institution, period };
}

function approvedHours(assignmentId) {
  return data.activities
    .filter((activity) => activity.assignmentId === assignmentId && activity.status === "APROBADA")
    .reduce((sum, activity) => sum + Number(activity.hours), 0);
}

function pendingActivitiesForTeacher(teacherId) {
  const teacherAssignments = data.assignments.filter((assignment) => assignment.teacherId === teacherId).map((assignment) => assignment.id);
  return data.activities.filter((activity) => teacherAssignments.includes(activity.assignmentId) && activity.status === "PENDIENTE");
}

function render() {
  const user = currentUser();
  if (!user) {
    renderLogin();
    return;
  }

  const nav = navForRole(user.role);
  if (!nav.some((item) => item.id === currentView)) currentView = nav[0].id;

  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <strong>SIGPRA</strong>
          <span>Gestion de practicas academicas</span>
        </div>
        <nav class="nav flex-nowrap" aria-label="Navegacion de ${escapeHtml(roleLabel(user.role))}">
          ${renderNavigation(nav)}
        </nav>
        <div class="sidebar-footer">
          <strong>${escapeHtml(user.name)}</strong>
          <p class="muted">${escapeHtml(roleLabel(user.role))}</p>
          <p class="api-status">${escapeHtml(apiStatusText)}</p>
          <button class="btn btn-outline-secondary button" data-action="logout">Cerrar sesion</button>
        </div>
      </aside>
      <main class="content">
        <header class="topbar">
          <div>
            <h1>${escapeHtml(viewTitle(currentView, user.role))}</h1>
            <p class="subtitle">${escapeHtml(viewSubtitle(currentView, user.role))}</p>
          </div>
          <div class="d-flex align-items-center gap-3">
            ${renderNotificationBell(user)}
            <div class="userbox">
              <div>
                <strong>${escapeHtml(user.name)}</strong>
                <div class="muted">${escapeHtml(user.email)}</div>
              </div>
              <span class="avatar">${escapeHtml(user.initials)}</span>
            </div>
          </div>
        </header>
        ${renderView(user)}
      </main>
    </div>
  `;
  app.querySelectorAll("form[data-guided-workflow]").forEach(updateGuidedWorkflow);
  setupDropzones();
}

function navForRole(role) {
  const shared = [{ id: "dashboard", label: "Inicio", group: "Principal", description: "Resumen de tus tareas y accesos frecuentes." }];
  const map = {
    COORDINADOR: [
      ...shared,
      { id: "periods", label: "Periodos de practica", group: "Preparar practicas", description: "Configura fechas, horas y criterios para cada periodo." },
      { id: "agreements", label: "Convenios y plazas", group: "Preparar practicas", description: "Organiza instituciones, convenios y cupos disponibles." },
      { id: "assignments", label: "Asignaciones", group: "Seguimiento", description: "Consulta y organiza las practicas de los estudiantes." },
      { id: "director-requests", label: "Solicitudes de práctica", group: "Seguimiento", description: "Consulta las solicitudes radicadas por estudiantes." },
      { id: "reports", label: "Consolidado", group: "Seguimiento", description: "Filtra el avance y consulta resultados de las practicas." },
      { id: "audit", label: "Auditoria", group: "Seguimiento", description: "Revisa el historial de acciones registradas." }
    ],
    ESTUDIANTE: [
      ...shared,
      { id: "student-request", label: "Solicitar práctica", group: "Mi practica", description: "Radica tu solicitud formal y consulta su estado de aprobacion." },
      { id: "student-progress", label: "Mi avance", group: "Mi practica", description: "Consulta tus horas aprobadas y el estado de tu practica." },
      { id: "student-activities", label: "Mi bitacora", group: "Mi practica", description: "Registra el trabajo realizado y reporta tus horas." },
      { id: "student-evidence", label: "Evidencias", group: "Mi practica", description: "Adjunta y consulta los soportes de tus actividades." },
      { id: "student-validations", label: "Validaciones", group: "Mi practica", description: "Consulta las respuestas y observaciones de tu docente." }
    ],
    DOCENTE_ASESOR: [
      ...shared,
      { id: "teacher-validations", label: "Validar actividades", group: "Seguimiento", description: "Revisa soportes y responde a los reportes pendientes." },
      { id: "teacher-visits", label: "Visitas y evaluacion", group: "Seguimiento", description: "Registra acompanamientos y evaluaciones." }
    ],
    DIRECTOR: [
      ...shared,
      { id: "director-requests", label: "Solicitudes de práctica", group: "Gestion de practicas", description: "Revisa, aprueba, devuelve o rechaza solicitudes de practica (CU-08)." },
      { id: "assignments", label: "Asignaciones", group: "Gestion de practicas", description: "Asigna plazas institucionales y docentes asesores a los estudiantes habilitados (CU-03)." },
      { id: "reports", label: "Consolidado", group: "Consulta", description: "Consulta el avance general de las practicas." },
      { id: "audit", label: "Auditoria", group: "Consulta", description: "Revisa las acciones registradas en el sistema." }
    ]
  };
  return map[role] || shared;
}

function renderNavigation(nav) {
  let currentGroup = "";
  return nav.map((item) => {
    const heading = item.group !== currentGroup
      ? `<span class="nav-heading">${escapeHtml(item.group)}</span>`
      : "";
    currentGroup = item.group;
    return `${heading}<button class="${item.id === currentView ? "active" : ""} tw-transition-transform hover:tw-translate-x-1.5" data-view="${item.id}" ${item.id === currentView ? 'aria-current="page"' : ""}>${escapeHtml(item.label)}</button>`;
  }).join("");
}

function countLabel(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function moduleSummary(view, user) {
  if (view === "periods") return countLabel(data.periods.length, "periodo", "periodos");
  if (view === "agreements") return `${countLabel(data.institutions.length, "institucion", "instituciones")} · ${countLabel(data.places.length, "plaza", "plazas")}`;
  if (view === "assignments") return countLabel(data.assignments.filter((item) => item.status === "ACTIVA").length, "practica activa", "practicas activas");
  if (view === "reports") return countLabel(data.assignments.filter((item) => item.status === "ACTIVA").length, "practica para consultar", "practicas para consultar");
  if (view === "audit") return countLabel(data.audit.length, "evento registrado", "eventos registrados");
  if (view === "student-activities" || view === "student-evidence" || view === "student-validations" || view === "student-progress") {
    const assignmentIds = data.assignments.filter((item) => item.studentId === user.id).map((item) => item.id);
    const activities = data.activities.filter((item) => assignmentIds.includes(item.assignmentId));
    if (view === "student-activities") return countLabel(activities.length, "actividad", "actividades");
    if (view === "student-validations") return countLabel(activities.filter((item) => item.status !== "BORRADOR").length, "actividad enviada", "actividades enviadas");
    if (view === "student-evidence") {
      const activityIds = activities.map((item) => item.id);
      return countLabel(data.evidences.filter((item) => activityIds.includes(item.activityId)).length, "evidencia cargada", "evidencias cargadas");
    }
    const assignment = data.assignments.find((item) => item.studentId === user.id && item.status === "ACTIVA");
    const period = data.periods.find((item) => item.id === assignment?.periodId);
    const hours = assignment ? approvedHours(assignment.id) || assignment.approvedHours : 0;
    return assignment ? `${Math.min(100, Math.round((hours / (period?.minHours || 320)) * 100))}% de avance` : "Sin practica activa";
  }
  if (view === "teacher-validations") return countLabel(pendingActivitiesForTeacher(user.id).length, "actividad por revisar", "actividades por revisar");
  if (view === "teacher-visits") return countLabel(data.visits.filter((item) => item.teacherId === user.id).length, "visita registrada", "visitas registradas");
  return "";
}

function renderModuleCards(user) {
  const modules = navForRole(user.role).filter((item) => item.id !== "dashboard");
  return `
    <section class="module-section" aria-labelledby="modules-heading">
      <div class="module-section-heading">
        <h2 id="modules-heading">Modulos de trabajo</h2>
        <p>Selecciona una opcion para ir directamente a la tarea que necesitas.</p>
      </div>
      <div class="module-grid">
        ${modules.map((item) => `
          <button class="module-card tw-transition-all hover:tw--translate-y-1 hover:tw-shadow-xl" type="button" data-view="${item.id}">
            <span class="module-card-heading">
              <strong>${escapeHtml(item.label)}</strong>
              <span aria-hidden="true">→</span>
            </span>
            <span class="module-card-description">${escapeHtml(item.description)}</span>
            <span class="module-card-summary">${escapeHtml(moduleSummary(item.id, user))}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function viewTitle(view, role) {
  if (view === "dashboard" && role !== "COORDINADOR") {
    return {
      ESTUDIANTE: "Resumen de practica",
      DOCENTE_ASESOR: "Resumen de seguimiento",
      DIRECTOR: "Resumen del programa"
    }[role] || "Resumen";
  }
  return {
    dashboard: "Resumen de coordinacion",
    periods: "Programar periodo de practica",
    agreements: "Gestionar convenios y plazas",
    assignments: "Asignar practicante a plaza y docente asesor",
    reports: "Consultar estado consolidado de practicas",
    audit: "Auditoria",
    "student-activities": "Registrar actividad ejecutada y soportes",
    "student-evidence": "Evidencias y soportes",
    "student-validations": "Estado de validaciones",
    "student-progress": "Avance de practica",
    "teacher-validations": "Validar actividades reportadas",
    "teacher-visits": "Realizar visita de acompanamiento y evaluar"
  }[view] || "SIGPRA";
}

function viewSubtitle(view, role) {
  return {
    dashboard: `Panel de ${role === "COORDINADOR" ? "coordinacion" : role === "DOCENTE_ASESOR" ? "seguimiento" : role === "DIRECTOR" ? "direccion" : "estudiante"}`,
    periods: "Define fechas, horas minimas y criterios de evaluacion.",
    agreements: "Administra instituciones receptoras, convenios y cupos.",
    assignments: "Vincula estudiante, plaza, docente asesor y periodo.",
    reports: "Consulta horas, estados, evidencias y visitas.",
    audit: "Revisa acciones importantes registradas por el sistema.",
    "student-activities": "Registra actividades ejecutadas y horas reportadas.",
    "student-evidence": "Asocia soportes a las actividades reportadas.",
    "student-progress": "Consulta tu avance frente al periodo asignado.",
    "student-validations": "Consulta el resultado de las actividades revisadas por tu docente asesor.",
    "teacher-validations": "Aprueba, devuelve o rechaza actividades de estudiantes asignados.",
    "teacher-visits": "Registra visitas de acompanamiento y evaluaciones."
  }[view] || "";
}

function renderView(user) {
  const renderers = {
    dashboard: () => renderDashboard(user),
    periods: renderPeriods,
    agreements: renderAgreements,
    assignments: renderAssignments,
    reports: () => renderReports(user),
    audit: renderAudit,
    "student-activities": () => renderStudentActivities(user),
    "student-evidence": () => renderStudentEvidence(user),
    "student-validations": () => renderStudentValidations(user),
    "student-progress": () => renderStudentProgress(user),
    "teacher-validations": () => renderTeacherValidations(user),
    "teacher-visits": () => renderTeacherVisits(user),
    "student-request": () => renderStudentRequest(user),
    "director-requests": () => renderDirectorRequests(user)
  };
  return renderers[currentView]?.() || renderDashboard(user);
}

function renderLogin() {
  const isRegister = authMode === "register";
  const defaultUser = data.users.find((u) => u.role === "COORDINADOR") || data.users[0];

  const roleOrder = [
    { role: "COORDINADOR", title: "Coordinación" },
    { role: "DIRECTOR", title: "Dirección de Programa" },
    { role: "DOCENTE_ASESOR", title: "Docentes Asesores" },
    { role: "ESTUDIANTE", title: "Estudiantes" }
  ];

  const optionsHtml = roleOrder
    .map((group) => {
      const groupUsers = data.users.filter((u) => u.role === group.role);
      if (!groupUsers.length) return "";
      return `
        <optgroup label="${escapeHtml(group.title)}">
          ${groupUsers
            .map((u) => {
              const isSelected = defaultUser && u.id === defaultUser.id ? "selected" : "";
              const extraCode = u.code ? ` (${u.code})` : "";
              return `<option value="${escapeHtml(u.email)}" ${isSelected}>${escapeHtml(u.name)}${escapeHtml(extraCode)} — ${escapeHtml(u.email)}</option>`;
            })
            .join("")}
        </optgroup>
      `;
    })
    .join("");

  app.innerHTML = `
    <main class="login-page">
      <section class="login-card">
        <div class="login-photo-side tw-overflow-hidden">
          <img
            src="login-photo.jpg"
            alt="SIGPRA - Gestión de Prácticas Académicas"
            class="login-photo-img tw-transition-transform tw-duration-700 hover:tw-scale-105"
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';"
          />
          <div class="login-photo-caption">
            <h3>SIGPRA</h3>
            <p>Gestión de Prácticas Académicas y Pedagógicas</p>
          </div>
        </div>
        <div class="login-form-side">
          <div class="brand login-brand">
            <strong>SIGPRA</strong>
            <span>Gestion de practicas academicas</span>
          </div>
          ${isRegister ? `
            <div class="d-flex align-items-center justify-content-between mb-2">
              <h2 class="mb-0">Registro de Estudiante</h2>
              <span class="badge bg-success text-white">Nuevo Practicante</span>
            </div>
            <p class="muted mb-3">Crea tu cuenta institucional para radicar tu solicitud de práctica (CU-08).</p>

            <form id="register-form" class="form-grid">
              <label class="full-field">Nombre y Apellidos completos *
                <input class="form-control" name="name" type="text" placeholder="Ej: Camilo Andrés Pérez" required />
              </label>

              <label class="full-field">Correo institucional UDI *
                <input class="form-control" name="email" type="email" placeholder="estudiante@udi.edu.co" required />
              </label>

              <div class="row g-2 w-100 m-0">
                <div class="col-md-6 p-0 pe-1">
                  <label class="w-100">Código estudiantil *
                    <input class="form-control" name="code" type="text" placeholder="UDI-2026-..." required />
                  </label>
                </div>
                <div class="col-md-6 p-0 ps-1">
                  <label class="w-100">Semestre actual *
                    <select class="form-select" name="semester" required>
                      <option value="7">7° Semestre</option>
                      <option value="8" selected>8° Semestre</option>
                      <option value="9">9° Semestre</option>
                      <option value="10">10° Semestre</option>
                    </select>
                  </label>
                </div>
              </div>

              <div class="row g-2 w-100 m-0">
                <div class="col-md-6 p-0 pe-1">
                  <label class="w-100">Contraseña *
                    <input class="form-control" name="password" type="password" minlength="6" placeholder="Mínimo 6 caracteres" required />
                  </label>
                </div>
                <div class="col-md-6 p-0 ps-1">
                  <label class="w-100">Confirmar contraseña *
                    <input class="form-control" name="confirmPassword" type="password" minlength="6" placeholder="Repite contraseña" required />
                  </label>
                </div>
              </div>

              <button class="button primary full-field btn btn-success tw-py-2.5 tw-shadow-md hover:tw-shadow-lg tw-transition-all fw-bold mt-2" type="submit">
                ✨ Crear Cuenta y Comenzar Solicitud
              </button>
            </form>

            <div class="text-center mt-3 pt-3 border-top">
              <span class="text-muted small">¿Ya tienes una cuenta registrada?</span>
              <button class="btn btn-link p-0 fw-bold ms-1 text-decoration-none" type="button" data-action="toggle-auth-mode" data-mode="login">
                Iniciar sesión aquí
              </button>
            </div>
          ` : `
            <h2>Iniciar sesion</h2>
            <p class="muted">Selecciona en la lista con quién deseas ingresar al sistema.</p>
            <form id="login-form" class="form-grid">
              <label class="full-field">Usuario para ingresar
                <select id="login-user-select" name="user_select" class="form-select">
                  ${optionsHtml}
                </select>
              </label>
              <div id="login-user-preview" class="login-user-preview full-field">
                <span class="avatar login-preview-avatar">${escapeHtml(defaultUser?.initials || "RC")}</span>
                <div class="login-preview-info">
                  <strong id="login-preview-name">${escapeHtml(defaultUser?.name || "")}</strong>
                  <span id="login-preview-role" class="muted">${escapeHtml(roleLabel(defaultUser?.role || ""))}</span>
                </div>
              </div>
              <label class="full-field">Correo
                <input id="login-email" name="email" type="email" value="${escapeHtml(defaultUser?.email || "coordinador@udi.edu.co")}" required class="form-control" />
              </label>
              <label class="full-field">Clave
                <input id="login-password" name="password" type="password" value="${escapeHtml(defaultUser?.password || "123456")}" required class="form-control" />
              </label>
              <button class="button primary full-field btn btn-primary tw-py-2.5 tw-shadow-md hover:tw-shadow-lg tw-transition-all hover:tw-scale-[1.01] active:tw-scale-[0.99] tw-font-medium" type="submit">Entrar</button>
            </form>

            <div class="text-center my-3 p-2 bg-light rounded border">
              <span class="text-muted small">¿Eres un estudiante nuevo?</span>
              <button class="btn btn-link p-0 fw-bold ms-1 text-decoration-none" type="button" data-action="toggle-auth-mode" data-mode="register">
                📝 Registrar nueva cuenta de estudiante
              </button>
            </div>
          `}
        </div>
      </section>
    </main>
  `;
}

function renderDashboard(user) {
  if (user.role === "ESTUDIANTE") return renderStudentProgress(user, true);
  if (user.role === "DOCENTE_ASESOR") return renderTeacherHome(user);
  if (user.role === "DIRECTOR") return renderDirectorHome(user);

  const publishedPeriods = data.periods.filter((period) => period.status === "PUBLICADO");
  const activeAgreements = data.agreements.filter((agreement) => agreementStatus(agreement) === "VIGENTE");
  const activePeriod = [...publishedPeriods].sort((left, right) =>
    `${right.year}-${right.semester}`.localeCompare(`${left.year}-${left.semester}`)
  )[0];
  const unassignedStudents = activePeriod
    ? studentUsers().filter((student) => !data.assignments.some((assignment) =>
      assignment.studentId === student.id && assignment.periodId === activePeriod.id && assignment.status === "ACTIVA"
    )).length
    : studentUsers().length;

  return `
    <section class="grid">
      ${metricCard("Periodos publicados", publishedPeriods.length, activePeriod ? `${activePeriod.year}-${activePeriod.semester} activo` : "No hay periodos activos", "periods")}
      ${metricCard("Convenios vigentes", activeAgreements.length, `${activeAgreements.filter((agreement) => {
        const daysUntilEnd = (new Date(`${agreement.end}T00:00:00`) - new Date()) / 86400000;
        return daysUntilEnd >= 0 && daysUntilEnd <= 30;
      }).length} por vencer este mes`, "agreements")}
      ${metricCard("Asignaciones pendientes", unassignedStudents, "Estudiantes por asignar", "assignments")}
      <article class="card wide">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h2 class="mb-0">Periodos académicos activos / publicados</h2>
          <button class="btn btn-sm btn-outline-primary" data-view="periods">Ver todos &rarr;</button>
        </div>
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Periodo</th><th>Programa</th><th>Nivel</th><th>Vigencia</th><th>Horas mín.</th><th>Estado</th></tr></thead>
            <tbody>
              ${publishedPeriods.length
                ? publishedPeriods.map((p) => `
                    <tr>
                      <td><strong>${escapeHtml(p.year)}-${escapeHtml(p.semester)}</strong></td>
                      <td>${escapeHtml(p.program)}</td>
                      <td>${escapeHtml(p.level)}</td>
                      <td>${moneyDate(p.start)} - ${moneyDate(p.end)}</td>
                      <td><span class="badge bg-light text-dark border">${p.minHours} hrs</span></td>
                      <td>${statusTag(p.status)}</td>
                    </tr>
                  `).join("")
                : `<tr><td colspan="6" class="text-center py-3 text-muted">No hay periodos publicados. Configura uno en Periodos de práctica.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
      <article class="card">
        <h2>Acciones</h2>
        <p class="muted">Continua la gestion del periodo.</p>
        <div class="toolbar">
          <button class="btn btn-primary button primary tw-shadow-sm hover:tw-shadow-md hover:tw-scale-[1.02] active:tw-scale-[0.98] tw-transition-all" data-view="assignments">Asignar practicantes</button>
        </div>
      </article>
    </section>
    ${renderModuleCards(user)}
  `;
}

function renderDirectorHome(user) {
  const allAssignments = data.assignments;
  const activeAssignments = allAssignments.filter((assignment) => assignment.status === "ACTIVA");
  const completedAssignments = allAssignments.filter((a) => {
    const period = data.periods.find((p) => p.id === a.periodId);
    const hrs = approvedHours(a.id) || a.approvedHours || 0;
    return hrs >= (period?.minHours || 320);
  });
  const visitedAssignments = allAssignments.filter((a) => data.visits.some((v) => v.assignmentId === a.id));
  const pendingAssignments = allAssignments.filter((a) =>
    data.activities.some((act) => act.assignmentId === a.id && act.status === "PENDIENTE")
  );

  const averageProgress = activeAssignments.length
    ? Math.round(activeAssignments.reduce((sum, assignment) => {
      const period = data.periods.find((item) => item.id === assignment.periodId);
      const hours = approvedHours(assignment.id) || assignment.approvedHours || 0;
      return sum + Math.min(100, (hours / (period?.minHours || 1)) * 100);
    }, 0) / activeAssignments.length)
    : 0;
  const activeTeachers = new Set(activeAssignments.map((assignment) => assignment.teacherId)).size;

  let displayed = allAssignments;
  if (directorFilter === "ACTIVA") displayed = activeAssignments;
  else if (directorFilter === "COMPLETADA") displayed = completedAssignments;
  else if (directorFilter === "VISITAS") displayed = visitedAssignments;
  else if (directorFilter === "PENDIENTE") displayed = pendingAssignments;

  return `
    <section class="grid">
      ${metricCard("Programas activos", data.periods.filter((period) => period.status === "PUBLICADO").length, "Periodos publicados", "reports")}
      ${metricCard("Estudiantes en practica", activeAssignments.length, `${activeTeachers} docentes asesores`, "reports")}
      ${metricCard("Avance promedio", `${averageProgress}%`, "Sobre horas requeridas", "reports")}
      
      <article class="card full">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <h2 class="mb-0">Bandeja de Radicación y Seguimiento Académico (CU-08)</h2>
            <p class="muted mb-0 tw-text-sm">Supervisión institucional y auditoría en tiempo real de prácticas radicadas.</p>
          </div>
          <button class="btn btn-outline-primary btn-sm" data-view="reports">Ver reporte consolidado &rarr;</button>
        </div>

        <!-- Chips de filtrado interactivo -->
        <div class="d-flex gap-2 flex-wrap mb-3">
          <button class="btn btn-sm ${directorFilter === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}" data-action="director-filter" data-filter="ALL">Todas las prácticas (${allAssignments.length})</button>
          <button class="btn btn-sm ${directorFilter === 'ACTIVA' ? 'btn-primary' : 'btn-outline-secondary'}" data-action="director-filter" data-filter="ACTIVA">En curso (${activeAssignments.length})</button>
          <button class="btn btn-sm ${directorFilter === 'COMPLETADA' ? 'btn-primary' : 'btn-outline-secondary'}" data-action="director-filter" data-filter="COMPLETADA">Horas cumplidas (${completedAssignments.length})</button>
          <button class="btn btn-sm ${directorFilter === 'VISITAS' ? 'btn-primary' : 'btn-outline-secondary'}" data-action="director-filter" data-filter="VISITAS">Con visitas (${visitedAssignments.length})</button>
          <button class="btn btn-sm ${directorFilter === 'PENDIENTE' ? 'btn-primary' : 'btn-outline-secondary'}" data-action="director-filter" data-filter="PENDIENTE">Con pendientes (${pendingAssignments.length})</button>
        </div>

        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Programa & Periodo</th>
                <th>Institución receptora</th>
                <th>Docente asesor</th>
                <th>Horas / Avance</th>
                <th>Estado</th>
                <th>Auditoría</th>
              </tr>
            </thead>
            <tbody>
              ${displayed.length
                ? displayed.map((a) => {
                    const d = assignmentDetails(a);
                    const hrs = approvedHours(a.id) || a.approvedHours || 0;
                    const req = d.period?.minHours || 320;
                    const pct = Math.min(100, Math.round((hrs / req) * 100));
                    return `
                      <tr>
                        <td>
                          <strong>${escapeHtml(d.student?.name || "Sin estudiante")}</strong><br>
                          <small class="text-muted">${escapeHtml(d.student?.code || d.student?.email || "")}</small>
                        </td>
                        <td>
                          <span>${escapeHtml(d.period?.program || "N/A")}</span><br>
                          <small class="text-muted">${d.period ? `${d.period.year}-${d.period.semester}` : ""}</small>
                        </td>
                        <td>${escapeHtml(d.institution?.name || "N/A")}</td>
                        <td>${escapeHtml(d.teacher?.name || "N/A")}</td>
                        <td>
                          <div class="d-flex align-items-center gap-2">
                            <div class="progress flex-grow-1" style="height: 6px; width: 60px;">
                              <div class="progress-bar bg-success" style="width: ${pct}%"></div>
                            </div>
                            <small><strong>${hrs}</strong>/${req}h (${pct}%)</small>
                          </div>
                        </td>
                        <td>${statusTag(a.status)}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary tw-py-0.5 tw-px-2 tw-text-xs" data-modal="student-dossier" data-id="${a.id}">Expediente</button>
                        </td>
                      </tr>
                    `;
                  }).join("")
                : `<tr><td colspan="7" class="text-center py-4 text-muted">No hay prácticas para el filtro seleccionado.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </section>
    ${renderModuleCards(user)}
  `;
}

function renderTeacherHome(user) {
  const pending = pendingActivitiesForTeacher(user.id);
  const teacherAssignments = data.assignments.filter((assignment) => assignment.teacherId === user.id);
  return `
    <section class="grid">
      ${metricCard("Estudiantes asignados", teacherAssignments.length, "Practicas activas", "teacher-visits")}
      ${metricCard("Pendientes", pending.length, "Actividades por revisar", "teacher-validations")}
      ${metricCard("Visitas registradas", data.visits.filter((visit) => visit.teacherId === user.id).length, "Acompanamiento", "teacher-visits")}
      <article class="card full">
        <h2>Actividades pendientes</h2>
        ${activitiesTable(pending, true)}
      </article>
    </section>
    ${renderModuleCards(user)}
  `;
}

function metricCard(label, value, helper, targetView = null) {
  const interactiveAttr = targetView ? `data-view="${escapeHtml(targetView)}" role="button" tabindex="0"` : "";
  const interactiveClasses = targetView
    ? "tw-cursor-pointer hover:tw-border-primary hover:tw-shadow-lg hover:tw--translate-y-1 tw-transition-all group"
    : "tw-transition-all hover:tw-shadow-md hover:tw--translate-y-0.5";
  return `
    <article class="card ${interactiveClasses}" ${interactiveAttr}>
      <div class="d-flex justify-content-between align-items-center mb-1">
        <p class="muted mb-0">${escapeHtml(label)}</p>
        ${targetView ? '<span class="tw-text-xs tw-text-primary tw-font-semibold group-hover:tw-translate-x-0.5 tw-transition-transform">Ir &rarr;</span>' : ""}
      </div>
      <span class="metric text-primary">${escapeHtml(value)}</span>
      <p class="muted mb-0 tw-text-xs">${escapeHtml(helper)}</p>
    </article>
  `;
}

function renderProgramCatalog() {
  if (currentUser()?.role !== "COORDINADOR") return "";
  const rows = (data.programs || []).map((program) => `
    <tr>
      <td>${escapeHtml(program.name)}</td>
      <td>${escapeHtml(program.levels.join(", "))}</td>
      <td>${statusTag(program.active ? "ACTIVA" : "INACTIVA")}</td>
      <td>
        <button class="btn btn-outline-secondary button" data-action="edit-program" data-id="${program.id}">Editar</button>
        <button class="btn btn-outline-secondary button" data-action="delete-program" data-id="${program.id}">Eliminar</button>
      </td>
    </tr>`).join("");
  return `<article class="card full">
    <h2>Gestion de programas academicos</h2>
    <p class="muted">Registra programas y sus niveles de practica. Los programas en uso no pueden eliminarse.</p>
    <form class="form-grid" data-submit="academic-program" id="program-crud-form">
      <input class="form-control" type="hidden" name="programId" value="">
      <label>Nombre del programa<input class="form-control" name="name" required maxlength="120" placeholder="Nombre del programa"></label>
      <label>Niveles de practica (separados por coma)<input class="form-control" name="levels" required placeholder="Practica I, Practica II"></label>
      <label>Estado<select class="form-select" name="active"><option value="true">ACTIVO</option><option value="false">INACTIVO</option></select></label>
      <div class="toolbar full-field"><button class="btn btn-primary button primary" type="submit">Guardar programa</button>
      <button class="btn btn-outline-secondary button" type="button" data-action="cancel-program-edit">Limpiar</button></div>
    </form>
    <div class="table-wrap table-responsive"><table class="table table-hover align-middle"><thead><tr><th>PROGRAMA</th><th>NIVELES</th><th>ESTADO</th><th>ACCIONES</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="4">No hay programas registrados.</td></tr>'}</tbody></table></div>
  </article>`;
}

function renderPeriods() {
  return `
    ${renderProgramCatalog()}
    <section class="stack">
      <article class="card full">
        <h2>Programar periodo de practica</h2>
        <p class="muted">Completa cada etapa en orden para definir el programa, la vigencia y los criterios de evaluacion.</p>
        ${modalForm("period")}
      </article>
      <article class="card full">
        <h2>Periodos registrados</h2>
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Programa</th><th>Nivel</th><th>Periodo</th><th>Vigencia</th><th>Reporte hasta</th><th>Horas</th><th>Evaluacion</th><th>Estado</th><th class="text-end">Acciones</th></tr></thead>
            <tbody>
              ${data.periods.map((period) => `
                <tr>
                  <td>${escapeHtml(period.program)}</td>
                  <td>${escapeHtml(period.level)}</td>
                  <td>${period.year}-${period.semester}</td>
                  <td>${moneyDate(period.start)} - ${moneyDate(period.end)}</td>
                  <td>${moneyDate(period.reportLimit)}</td>
                  <td>${period.minHours}</td>
                  <td>${(period.rubric || []).map((criterion) => `${escapeHtml(criterion.name)} (${criterion.weight}%)`).join("<br>") || "Sin criterios configurados"}</td>
                  <td>${statusTag(period.status)}${period.status === "BORRADOR" ? `<br><button class="btn btn-outline-secondary button" data-modal="period" data-id="${period.id}">Continuar borrador</button>` : ""}</td>
                  <td class="text-end">
                    <div class="d-flex justify-content-end gap-1">
                      <button class="btn btn-sm btn-outline-primary py-0 px-2" style="font-size: 0.78rem;" data-action="edit-period" data-id="${period.id}" title="Editar periodo">✏️ Editar</button>
                      <button class="btn btn-sm btn-outline-danger py-0 px-2" style="font-size: 0.78rem;" data-action="delete-period" data-id="${period.id}" title="Eliminar periodo">🗑️ Borrar</button>
                    </div>
                  </td>
                </tr>
              `).join("") || `<tr><td colspan="8">No hay periodos registrados.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function renderAgreements() {
  return `
    <section class="stack">
      <article class="card full">
        <div class="toolbar">
          <button class="btn btn-primary button primary" data-modal="institution">Nueva institucion</button>
        </div>
        <h2>Registrar convenio y plaza</h2>
        <p class="muted">Selecciona una institucion y completa en orden el convenio y la plaza ofrecida. Los convenios vencidos o sin documento quedan inactivos y sus plazas no se ofrecen para asignacion.</p>
        ${modalForm("agreement-place")}
      </article>
      <article class="card full">
        <h2>Convenios y plazas registrados</h2>
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Institucion</th><th>Convenio</th><th>Vigencia</th><th>Plazas</th><th>Cupos</th><th>Estado</th></tr></thead>
            <tbody>
              ${data.agreements.map((agreement) => {
                const institution = data.institutions.find((item) => item.id === agreement.institutionId);
                const places = data.places.filter((place) => place.agreementId === agreement.id);
                const cupos = agreementStatus(agreement) === "VIGENTE"
                  ? places.reduce((sum, place) => sum + (place.offered - place.occupied), 0)
                  : 0;
                return `
                  <tr>
                    <td>${escapeHtml(institution?.name)}</td>
                    <td>${escapeHtml(agreement.number)}</td>
                    <td>${moneyDate(agreement.start)} - ${moneyDate(agreement.end)}</td>
                    <td>${places.length}</td>
                    <td>${cupos}</td>
                    <td>${statusTag(agreementStatus(agreement))}</td>
                  </tr>
                `;
              }).join("") || `<tr><td colspan="6">No hay convenios registrados.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
      <article class="card full">
        <h2>Plazas disponibles</h2>
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Institucion</th><th>Nivel</th><th>Jornada</th><th>Cupos</th><th>Docente titular</th><th>Estado</th></tr></thead>
            <tbody>
              ${data.places.map((place) => {
                const agreement = data.agreements.find((item) => item.id === place.agreementId);
                const institution = data.institutions.find((item) => item.id === agreement?.institutionId);
                return `
                  <tr>
                    <td>${escapeHtml(institution?.name)}</td>
                    <td>${escapeHtml(place.level)}</td>
                    <td>${escapeHtml(place.shift)}</td>
                    <td>${place.occupied} / ${place.offered}</td>
                    <td>${escapeHtml(place.tutor)}</td>
                    <td>${statusTag(placeStatus(place, agreement))}</td>
                  </tr>
                `;
              }).join("") || `<tr><td colspan="6">No hay plazas registradas.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function renderAssignments() {
  const assignments = data.assignments;
  return `
    <section class="stack">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2 p-2 bg-light rounded border">
        <div>
          <strong class="d-block text-primary">Gestión de Asignaciones y Docentes Tutores</strong>
          <small class="text-muted">Vincula estudiantes habilitados con plazas institucionales y docentes asesores.</small>
        </div>
        <button class="btn btn-sm btn-success fw-bold shadow-sm" type="button" data-action="open-new-teacher-modal">
          ➕ Registrar Nuevo Docente Asesor
        </button>
      </div>
      ${assignmentWorkflowForm()}
      <details class="assignment-history">
        <summary>Asignaciones registradas (${assignments.length})</summary>
        ${assignmentsTable(assignments)}
      </details>
    </section>
  `;
}

function assignmentWorkflowForm() {
  const publishedPeriods = data.periods.filter((period) => period.status === "PUBLICADO");
  const availablePlaces = data.places.filter((place) => {
    const agreement = data.agreements.find((item) => item.id === place.agreementId);
    return placeStatus(place, agreement) === "DISPONIBLE";
  });
  const availableTeachers = teacherUsers().filter((teacher) =>
    data.assignments.filter((assignment) =>
      assignment.teacherId === teacher.id && assignment.status === "ACTIVA"
    ).length < 6
  );
  const activePeriod = [...publishedPeriods].sort((left, right) =>
    `${right.year}-${right.semester}`.localeCompare(`${left.year}-${left.semester}`)
  )[0];

  if (!publishedPeriods.length) {
    return `<div class="empty">Publica un periodo antes de crear asignaciones.</div>`;
  }

  return `
    <form class="form-grid workflow-form assignment-workflow" data-submit="assignment">
      <article class="card full assignment-step" id="assignment-step-student">
        <h2><span class="step-number">1</span> Estudiante practicante</h2>
        <label class="full-field">Periodo académico y programa formativo
          <select class="form-select" name="periodId" required>
            ${publishedPeriods.map((period) => `
              <option value="${period.id}" ${period.id === activePeriod.id ? "selected" : ""}>
                Periodo ${period.year}-${period.semester} — ${escapeHtml(period.program)} (${escapeHtml(period.level)}) [Mín: ${period.minHours} hrs]
              </option>
            `).join("")}
          </select>
        </label>
        <label class="full-field">Estudiante habilitado
          <select class="form-select" name="studentId" required>
            <option value="">-- Seleccione un estudiante --</option>
            ${studentUsers().map((student) => `<option value="${student.id}">${escapeHtml(student.name)} - ${escapeHtml(student.code || student.email)}</option>`).join("")}
          </select>
        </label>
        <div class="full-field" id="assignment-student-details" hidden></div>
        <div class="full-field notice warning" id="assignment-reassignment" hidden>
          <strong>Asignacion activa encontrada.</strong> Para cambiar la plaza o el docente, selecciona el motivo de la reasignacion.
          <label>Motivo de la reasignacion
            <select class="form-select" name="reassignmentReason">
              <option value="">-- Seleccione un motivo --</option>
              <option>Solicitud de la institucion receptora</option>
              <option>Solicitud del estudiante</option>
              <option>Cambio de disponibilidad del docente asesor</option>
              <option>Otro</option>
            </select>
          </label>
        </div>
      </article>
      <article class="card full assignment-step" id="assignment-step-place" hidden>
        <h2><span class="step-number">2</span> Plaza de practica</h2>
        <p class="muted">Solo se muestran plazas con cupo disponible y convenio vigente.</p>
        <label class="full-field">Plaza disponible
          <select class="form-select" name="placeId" ${availablePlaces.length ? "" : "disabled"}>
            <option value="">-- Seleccione una plaza --</option>
            ${availablePlaces.map((place) => {
              const agreement = data.agreements.find((item) => item.id === place.agreementId);
              const institution = data.institutions.find((item) => item.id === agreement?.institutionId);
              return `<option value="${place.id}">${escapeHtml(institution?.name)} - ${escapeHtml(place.level)} (${place.offered - place.occupied} cupos)</option>`;
            }).join("")}
          </select>
        </label>
        ${availablePlaces.length ? "" : `<div class="empty full-field">No hay plazas con cupos disponibles y convenios vigentes para este periodo.</div>`}
        <div class="full-field" id="assignment-place-details" hidden></div>
      </article>
      <article class="card full assignment-step" id="assignment-step-teacher" hidden>
        <h2><span class="step-number">3</span> Docente asesor</h2>
        <p class="muted">Selecciona un docente con disponibilidad en el periodo.</p>
        <label class="full-field">Docente asesor disponible
          <select class="form-select" name="teacherId" ${availableTeachers.length ? "" : "disabled"}>
            <option value="">-- Seleccione un docente --</option>
            ${availableTeachers.map((teacher) => {
              const load = data.assignments.filter((assignment) =>
                assignment.teacherId === teacher.id && assignment.status === "ACTIVA"
              ).length;
              return `<option value="${teacher.id}">${escapeHtml(teacher.name)} - ${load} de 6 estudiantes asignados</option>`;
            }).join("")}
          </select>
        </label>
        ${availableTeachers.length ? "" : `<div class="empty full-field">No hay docentes asesores con disponibilidad de asignacion.</div>`}
      </article>
      <article class="card full assignment-step" id="assignment-step-summary" hidden>
        <h2><span class="step-number">4</span> Resumen de la asignacion</h2>
        <div id="assignment-summary" class="empty">Revisa los datos seleccionados antes de confirmar.</div>
        <div class="toolbar">
          <button class="btn btn-outline-secondary button" type="button" data-action="reset-assignment-workflow">Limpiar seleccion</button>
          <button class="btn btn-primary button primary" type="submit">Confirmar asignacion</button>
        </div>
      </article>
    </form>
  `;
}

function updateAssignmentWorkflow(form, changedField = "") {
  if (changedField === "periodId" || changedField === "studentId") {
    form.elements.placeId.value = "";
    form.elements.teacherId.value = "";
    form.elements.reassignmentReason.value = "";
  } else if (changedField === "placeId") {
    form.elements.teacherId.value = "";
  }

  const studentId = Number(form.elements.studentId.value);
  const periodId = Number(form.elements.periodId.value);
  const placeId = Number(form.elements.placeId.value);
  const teacherId = Number(form.elements.teacherId.value);
  const student = data.users.find((item) => item.id === studentId && item.role === "ESTUDIANTE");
  const period = data.periods.find((item) => item.id === periodId);
  const place = data.places.find((item) => item.id === placeId);
  const agreement = data.agreements.find((item) => item.id === place?.agreementId);
  const institution = data.institutions.find((item) => item.id === agreement?.institutionId);
  const teacher = data.users.find((item) => item.id === teacherId && item.role === "DOCENTE_ASESOR");
  const activeAssignment = data.assignments.find((item) =>
    item.studentId === studentId && item.periodId === periodId && item.status === "ACTIVA"
  );
  const studentDetails = form.querySelector("#assignment-student-details");
  const placeDetails = form.querySelector("#assignment-place-details");
  const summary = form.querySelector("#assignment-summary");
  const reassignment = form.querySelector("#assignment-reassignment");
  const reason = form.elements.reassignmentReason;
  const placeField = form.elements.placeId;
  const teacherField = form.elements.teacherId;
  const stepPlace = form.querySelector("#assignment-step-place");
  const stepTeacher = form.querySelector("#assignment-step-teacher");
  const stepSummary = form.querySelector("#assignment-step-summary");
  const hasStudentAndPeriod = Boolean(student && period);
  const hasPlace = Boolean(hasStudentAndPeriod && place);
  const hasTeacher = Boolean(hasPlace && teacher);

  studentDetails.hidden = !student;
  studentDetails.innerHTML = student
    ? `<table class="table table-hover align-middle"><tbody><tr><th>Programa</th><td>${escapeHtml(period?.program || "No especificado")}</td><th>Semestre</th><td>${escapeHtml(student.semester || "No especificado")}</td></tr><tr><th>Estado</th><td><span class="badge rounded-pill tag ok">Habilitado</span></td><th>Horas requeridas</th><td>${period?.minHours || "No definidas"}</td></tr></tbody></table>`
    : "";

  reassignment.hidden = !activeAssignment;
  reason.required = Boolean(activeAssignment);
  if (!activeAssignment) reason.value = "";
  if (activeAssignment) {
    const previous = assignmentDetails(activeAssignment);
    reassignment.querySelector("strong").nextSibling.textContent =
      ` Este estudiante ya esta asignado en el periodo ${period?.year}-${period?.semester} a ${previous.institution?.name || "una institucion"} con ${previous.teacher?.name || "un docente asesor"}.`;
  }

  stepPlace.hidden = !hasStudentAndPeriod;
  placeField.required = hasStudentAndPeriod && !placeField.disabled;
  placeDetails.hidden = !place;
  placeDetails.innerHTML = place
    ? `<table class="table table-hover align-middle"><tbody><tr><th>Institucion</th><td>${escapeHtml(institution?.name || "")}</td><th>Convenio</th><td>${escapeHtml(agreement?.number || "")}</td></tr><tr><th>Nivel / jornada</th><td>${escapeHtml(place.level)} - ${escapeHtml(place.shift)}</td><th>Cupos</th><td>${place.offered - place.occupied} disponibles de ${place.offered}</td></tr></tbody></table>`
    : "";

  stepTeacher.hidden = !hasPlace;
  teacherField.required = hasPlace && !teacherField.disabled;
  stepSummary.hidden = !hasTeacher;

  const selectedStudent = form.elements.studentId.selectedOptions[0]?.textContent || student?.name || "";
  const selectedPlace = form.elements.placeId.selectedOptions[0]?.textContent || "";
  const selectedTeacher = form.elements.teacherId.selectedOptions[0]?.textContent || "";
  const selectedPeriod = period ? `${period.year}-${period.semester} (${period.program} - ${period.level})` : "";
  summary.classList.toggle("empty", !hasTeacher);
  summary.innerHTML = hasTeacher
    ? `<table class="table table-hover align-middle"><tbody><tr><th>Estudiante</th><td>${escapeHtml(selectedStudent)}</td></tr><tr><th>Plaza / institucion</th><td>${escapeHtml(selectedPlace)}</td></tr><tr><th>Docente asesor</th><td>${escapeHtml(selectedTeacher)}</td></tr><tr><th>Periodo</th><td>${escapeHtml(selectedPeriod)}</td></tr><tr><th>Tipo</th><td>${activeAssignment ? "Reasignacion" : "Nueva asignacion"}</td></tr></tbody></table>`
    : "Revisa los datos seleccionados antes de confirmar.";
}

function assignmentsTable(assignments) {
  if (!assignments.length) return `<div class="empty">No hay asignaciones registradas.</div>`;
  return `
    <div class="table-wrap table-responsive">
      <table class="table table-hover align-middle">
        <thead><tr><th>Estudiante</th><th>Institucion</th><th>Docente asesor</th><th>Periodo</th><th>Horas</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          ${assignments.map((assignment) => {
            const d = assignmentDetails(assignment);
            const hours = approvedHours(assignment.id) || assignment.approvedHours;
            const min = d.period?.minHours || 1;
            return `
              <tr>
                <td>${escapeHtml(d.student?.name)}</td>
                <td>${escapeHtml(d.institution?.name)}</td>
                <td>${escapeHtml(d.teacher?.name)}</td>
                <td>${d.period ? `${d.period.year}-${d.period.semester}` : ""}</td>
                <td>${hours} / ${min}</td>
                <td>${statusTag(assignment.status)}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary tw-py-0.5 tw-px-2 tw-text-xs" data-modal="student-dossier" data-id="${assignment.id}">Expediente</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderStudentActivities(user) {
  const assignment = data.assignments.find((item) => item.studentId === user.id && item.status === "ACTIVA");
  const activities = assignment ? data.activities.filter((activity) => activity.assignmentId === assignment.id) : [];
  return `
    <section class="stack">
      <article class="card full">
        <h2>Nueva bitacora de actividades</h2>
        <p class="muted">Registra la actividad realizada, las horas y sus soportes. Puedes guardar un borrador o enviarlo al docente asesor.</p>
        ${assignment ? modalForm("activity") : `<div class="empty">Necesitas una asignacion activa para registrar actividades.</div>`}
      </article>
      <article class="card full">
        <h2>Actividades registradas</h2>
        ${studentActivitiesTable(activities)}
      </article>
    </section>
  `;
}

function studentActivitiesTable(activities) {
  if (!activities.length) return `<div class="empty">No hay actividades registradas.</div>`;
  return `
    <div class="table-wrap table-responsive">
      <table class="table table-hover align-middle">
        <thead><tr><th>Fecha</th><th>Actividad</th><th>Horas</th><th>Soportes</th><th>Estado</th><th>Observacion</th><th>Accion</th></tr></thead>
        <tbody>
          ${activities.map((activity) => {
            const evidences = data.evidences.filter((evidence) => evidence.activityId === activity.id);
            const canEdit = ["DEVUELTA", "BORRADOR"].includes(activity.status);
            return `<tr>
              <td>${moneyDate(activity.date)}</td>
              <td><strong>${escapeHtml(activity.type)}</strong><br><span class="muted">${escapeHtml(activity.description)}</span></td>
              <td>${activity.hours}</td>
              <td>${evidences.map((evidence) => escapeHtml(evidence.fileName)).join("<br>") || "Sin soportes"}</td>
              <td>${statusTag(activity.status)}</td>
              <td>${escapeHtml(activity.observation || "Sin observacion")}</td>
              <td>${canEdit ? `<button class="btn btn-outline-secondary button" data-modal="activity" data-id="${activity.id}">${activity.status === "DEVUELTA" ? "Corregir y reenviar" : "Completar borrador"}</button>` : "—"}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function activitiesTable(activities, withActions = false) {
  if (!activities.length) return `<div class="empty">No hay actividades registradas.</div>`;
  return `
    <div class="table-wrap table-responsive">
      <table class="table table-hover align-middle">
        <thead><tr><th>Fecha</th><th>Estudiante</th><th>Actividad</th><th>Horas</th><th>Estado</th><th>Observacion</th>${withActions ? "<th>Accion</th>" : ""}</tr></thead>
        <tbody>
          ${activities.map((activity) => {
            const assignment = data.assignments.find((item) => item.id === activity.assignmentId);
            const d = assignmentDetails(assignment || {});
            return `
              <tr>
                <td>${moneyDate(activity.date)}</td>
                <td>${escapeHtml(d.student?.name || "")}</td>
                <td><strong>${escapeHtml(activity.type)}</strong><br><span class="muted">${escapeHtml(activity.description)}</span></td>
                <td>${activity.hours}</td>
                <td>${statusTag(activity.status)}</td>
                <td>${escapeHtml(activity.observation || "Sin observacion")}</td>
                ${withActions ? `<td><button class="btn btn-outline-secondary button" data-modal="validate" data-id="${activity.id}">Revisar</button></td>` : ""}
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderStudentEvidence(user) {
  const assignment = data.assignments.find((item) => item.studentId === user.id && item.status === "ACTIVA");
  const activities = assignment ? data.activities.filter((activity) => activity.assignmentId === assignment.id) : [];
  const activityIds = activities.map((activity) => activity.id);
  const evidences = data.evidences.filter((evidence) => activityIds.includes(evidence.activityId));
  return `
    <section class="stack">
      <article class="card full">
        <h2>Registrar soporte o evidencia</h2>
        <p class="muted">Selecciona la actividad y adjunta el archivo que la respalda.</p>
        ${assignment ? modalForm("evidence") : `<div class="empty">Necesitas una asignacion activa para adjuntar evidencias.</div>`}
      </article>
      <article class="card full">
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Archivo</th><th>Actividad</th><th>Tipo</th><th>Referencia</th><th>Estado</th></tr></thead>
            <tbody>
              ${evidences.map((evidence) => {
                const activity = data.activities.find((item) => item.id === evidence.activityId);
                return `<tr><td>${escapeHtml(evidence.fileName)}</td><td>${escapeHtml(activity?.type)}</td><td>${escapeHtml(evidence.type)}</td><td>${escapeHtml(evidence.mongoId)}</td><td>${statusTag(evidence.status)}</td></tr>`;
              }).join("") || `<tr><td colspan="5">No hay evidencias registradas.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function renderStudentValidations(user) {
  const assignmentIds = data.assignments
    .filter((assignment) => assignment.studentId === user.id)
    .map((assignment) => assignment.id);
  const activities = data.activities.filter((activity) =>
    assignmentIds.includes(activity.assignmentId) && activity.status !== "BORRADOR"
  );
  return `
    <section class="grid">
      <article class="card full">
        <h2>Estado de validaciones</h2>
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Actividad</th><th>Fecha</th><th>Horas</th><th>Resultado</th><th>Observacion</th></tr></thead>
            <tbody>
              ${activities.map((activity) => `
                <tr>
                  <td>${escapeHtml(activity.type)}</td>
                  <td>${moneyDate(activity.date)}</td>
                  <td>${activity.hours}</td>
                  <td>${statusTag(activity.status)}</td>
                  <td>${escapeHtml(activity.observation || "Sin observacion")}</td>
                </tr>
              `).join("") || `<tr><td colspan="5">Aun no hay actividades enviadas a validacion.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function renderStudentProgress(user, compact = false) {
  const assignment = data.assignments.find((item) => item.studentId === user.id && item.status === "ACTIVA");
  if (!assignment) return `<div class="empty">No tienes una asignacion activa.</div>${compact ? renderModuleCards(user) : ""}`;
  const d = assignmentDetails(assignment);
  const hours = approvedHours(assignment.id) || assignment.approvedHours;
  const required = d.period?.minHours || 320;
  const percent = Math.min(100, Math.round((hours / required) * 100));
  const activities = data.activities.filter((activity) => activity.assignmentId === assignment.id);
  return `
    <section class="grid">
      ${metricCard("Horas aprobadas", `${hours} / ${required}`, `${percent}% de avance`, "student-progress")}
      ${metricCard("Actividades", activities.length, "Registros creados", "student-activities")}
      ${metricCard("Pendientes", activities.filter((item) => item.status === "PENDIENTE").length, "Por validar", "student-validations")}
      <article class="card wide p-4 shadow-sm">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h2 class="mb-0">Practica Academica Activa</h2>
          <span class="badge bg-success text-white px-3 py-1">En curso</span>
        </div>
        
        <div class="circular-progress-box mb-3">
          <div style="position: relative; width: 120px; height: 120px; flex-shrink: 0;">
            <svg class="circular-progress-svg" viewBox="0 0 100 100">
              <circle class="circle-bg" cx="50" cy="50" r="42"></circle>
              <circle class="circle-progress" cx="50" cy="50" r="42" style="stroke-dasharray: 264; stroke-dashoffset: ${264 - (percent / 100) * 264};"></circle>
            </svg>
            <div class="circular-progress-center">
              <div class="circular-progress-percent">${percent}%</div>
              <div class="circular-progress-label">Avance</div>
            </div>
          </div>

          <div class="circular-progress-stats w-100">
            <div class="stat-pill">
              <span class="text-muted">Horas acreditadas:</span>
              <strong class="text-success">${hours} de ${required} hrs</strong>
            </div>
            <div class="stat-pill">
              <span class="text-muted">Faltante para meta:</span>
              <strong class="text-primary">${Math.max(0, required - hours)} horas</strong>
            </div>
            <div class="stat-pill">
              <span class="text-muted">Institución receptora:</span>
              <strong class="text-truncate" style="max-width: 200px;">${escapeHtml(d.institution?.name || 'Por asignar')}</strong>
            </div>
          </div>
        </div>

        <div class="row g-2 small text-muted mb-3 border-top pt-2">
          <div class="col-sm-6"><strong>Docente Asesor:</strong> ${escapeHtml(d.teacher?.name || 'Asignado')}</div>
          <div class="col-sm-6"><strong>Periodo Académico:</strong> ${escapeHtml(d.period?.program || '')} (${d.period?.year}-${d.period?.semester})</div>
        </div>

        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-outline-primary btn-sm fw-bold shadow-sm" type="button" data-action="open-official-letter" data-id="${assignment.id}">
            📄 Carta de Presentación Oficial UDI
          </button>
        </div>
      </article>
      <article class="card">
        <h2>Acciones</h2>
        <div class="toolbar">
          <button class="btn btn-primary button primary" data-view="student-activities">Registrar actividad</button>
          <button class="btn btn-outline-secondary button" data-view="student-evidence">Registrar evidencia</button>
        </div>
      </article>
      ${compact ? "" : `<article class="card full"><h2>Historial</h2>${activitiesTable(activities)}</article>`}
    </section>
    ${compact ? renderModuleCards(user) : ""}
  `;
}

function renderTeacherValidations(user) {
  const assignments = data.assignments.filter((assignment) => assignment.teacherId === user.id).map((assignment) => assignment.id);
  const activities = data.activities.filter((activity) => assignments.includes(activity.assignmentId) && activity.status === "PENDIENTE");
  return `<section class="stack"><article class="card full"><h2>Actividades pendientes</h2><p class="muted">Selecciona una actividad para revisar su descripcion, horas y soportes.</p>${activitiesTable(activities, true)}</article></section>`;
}

function renderTeacherVisits(user) {
  const assignments = data.assignments.filter((assignment) => assignment.teacherId === user.id);
  return `
    <section class="stack">
      <article class="card full">
        <h2>Registrar visita y evaluacion</h2>
        <p class="muted">Selecciona al practicante y completa los datos de la visita antes de diligenciar la rubrica.</p>
        ${assignments.length ? modalForm("visit") : `<div class="empty">No tienes estudiantes asignados para realizar visitas.</div>`}
      </article>
      <article class="card full">
        <h2>Visitas registradas</h2>
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Fecha</th><th>Estudiante</th><th>Modalidad</th><th>Asistencia</th><th>Concepto</th><th>Puntaje</th><th>Observacion</th><th>Estado</th></tr></thead>
            <tbody>
              ${data.visits.filter((visit) => visit.teacherId === user.id).map((visit) => {
                const assignment = assignments.find((item) => item.id === visit.assignmentId);
                const d = assignmentDetails(assignment || {});
                return `<tr><td>${moneyDate(visit.date)}</td><td>${escapeHtml(d.student?.name)}</td><td>${escapeHtml(visit.mode)}</td><td>${visit.attendance ? "Asistio" : "No asistio"}</td><td>${escapeHtml(visit.concept || "Sin evaluacion")}</td><td>${visit.score}</td><td>${escapeHtml(visit.observation)}${visit.supportFileName ? `<br><span class="muted">Soporte: ${escapeHtml(visit.supportFileName)}</span>` : ""}</td><td>${statusTag(visit.status)}</td></tr>`;
              }).join("") || `<tr><td colspan="8">No hay visitas registradas.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function renderReports(user) {
  const visibleAssignments = data.assignments.filter((assignment) =>
    assignment.status === "ACTIVA" && (user.role !== "DOCENTE_ASESOR" || assignment.teacherId === user.id)
  );
  const rows = visibleAssignments.map((assignment) => {
    const d = assignmentDetails(assignment);
    const hours = approvedHours(assignment.id) || assignment.approvedHours;
    const required = d.period?.minHours || 320;
    return { assignment, d, hours, required, percent: Math.round((hours / required) * 100) };
  }).filter((row) =>
    (!reportFilters.periodId || row.assignment.periodId === Number(reportFilters.periodId)) &&
    (!reportFilters.program || row.d.period?.program === reportFilters.program) &&
    (!reportFilters.institutionId || row.d.institution?.id === Number(reportFilters.institutionId)) &&
    (!reportFilters.teacherId || row.assignment.teacherId === Number(reportFilters.teacherId))
  );
  const assignmentIds = rows.map((row) => row.assignment.id);
  const reportActivities = data.activities.filter((item) => assignmentIds.includes(item.assignmentId));
  const reportVisits = data.visits.filter((item) => assignmentIds.includes(item.assignmentId));
  const pendingCount = reportActivities.filter((item) => item.status === "PENDIENTE").length;
  const programs = [...new Set(data.periods.map((period) => period.program))];
  const selectedFilter = (value, selected) => String(value) === String(selected) ? "selected" : "";
  const institutionGroups = [...rows.reduce((groups, row) => {
    const key = row.d.institution?.id || 0;
    const group = groups.get(key) || {
      name: row.d.institution?.name || "Sin institucion",
      students: 0,
      hours: 0,
      required: 0
    };
    group.students += row.assignment.status === "ACTIVA" ? 1 : 0;
    group.hours += row.hours;
    group.required += row.required;
    groups.set(key, group);
    return groups;
  }, new Map()).values()];
  return `
    <section class="grid">
      <article class="card full">
        <!-- Membrete oficial UDI para impresion -->
        <div class="official-print-header">
          <div class="print-header-inner">
            <div class="print-logo-text">
              <h2 class="print-uni-title">UNIVERSIDAD DE INVESTIGACIÓN Y DESARROLLO — UDI</h2>
              <p class="print-uni-sub">Sistema Integrado de Gestión de Prácticas Académicas y Pedagógicas (SIGPRA)</p>
              <p class="print-uni-dept">Vicerrectoría Académica • Coordinación Institucional de Prácticas</p>
            </div>
            <div class="print-badge-box">
              <div class="print-badge">REPORTE CONSOLIDADO</div>
              <div class="print-date">Expedido: ${new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
          </div>
        </div>

        <div class="toolbar">
          <button class="btn btn-outline-success button" data-action="export-csv">📊 Exportar Excel (CSV)</button>
          <button class="btn btn-primary button primary" data-action="export-print">🖨️ Imprimir / Guardar como PDF</button>
        </div>
        <h2>Periodo y filtros</h2>
        <form class="form-grid report-filters" data-submit="report-filters">
          <label>Periodo academico<select class="form-select" name="periodId">
            <option value="">Todos los periodos</option>
            ${data.periods.map((period) => `<option value="${period.id}" ${selectedFilter(period.id, reportFilters.periodId)}>${period.year}-${period.semester}</option>`).join("")}
          </select></label>
          <label>Programa<select class="form-select" name="program">
            <option value="">Todos</option>
            ${programs.map((program) => `<option value="${escapeHtml(program)}" ${selectedFilter(program, reportFilters.program)}>${escapeHtml(program)}</option>`).join("")}
          </select></label>
          <label>Institucion receptora<select class="form-select" name="institutionId">
            <option value="">Todas</option>
            ${optionList(data.institutions, (item) => item.name, reportFilters.institutionId)}
          </select></label>
          <label>Docente asesor<select class="form-select" name="teacherId">
            <option value="">Todos</option>
            ${optionList(teacherUsers(), (item) => item.name, reportFilters.teacherId)}
          </select></label>
          <button class="btn btn-primary button primary full-field" type="submit">Aplicar filtros</button>
        </form>
        ${pendingCount ? `<div class="alert alert-warning notice warning">Consolidado parcial: ${pendingCount} actividad(es) esperan validacion.</div>` : ""}
        <div class="report-box ${rows.length ? "" : "hidden"}">
          <article><strong>${rows.length}</strong><br><span class="muted">Practicas</span></article>
          <article><strong>${rows.reduce((sum, row) => sum + row.hours, 0)}</strong><br><span class="muted">Horas aprobadas</span></article>
          <article><strong>${reportActivities.filter((item) => item.status === "APROBADA").length}</strong><br><span class="muted">Actividades validadas</span></article>
          <article><strong>${reportVisits.length}</strong><br><span class="muted">Visitas realizadas</span></article>
        </div>
        ${rows.length ? "" : `<div class="empty">No hay informacion para los filtros seleccionados. Ajusta los filtros para generar el consolidado.</div>`}
        <div class="report-data ${rows.length ? "" : "hidden"}">
        <h2>Consolidado por institucion</h2>
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Institucion</th><th>Estudiantes activos</th><th>Horas aprobadas</th><th>Avance</th></tr></thead>
            <tbody>
              ${institutionGroups.map((group) => {
                const percent = group.required ? Math.round(group.hours / group.required * 100) : 0;
                return `<tr><td>${escapeHtml(group.name)}</td><td>${group.students}</td><td>${group.hours}</td><td>${percent}%</td></tr>`;
              }).join("") || `<tr><td colspan="4">No hay instituciones para los filtros seleccionados.</td></tr>`}
            </tbody>
          </table>
        </div>
        <h2>Detalle de practicas</h2>
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Periodo</th><th>Programa</th><th>Estudiante</th><th>Institucion</th><th>Docente</th><th>Horas</th><th>Avance</th><th>Estado</th><th>Expediente</th></tr></thead>
            <tbody>
              ${rows.map((row) => `
                <tr>
                  <td>${row.d.period ? `${row.d.period.year}-${row.d.period.semester}` : ""}</td>
                  <td>${escapeHtml(row.d.period?.program)}</td>
                  <td>${escapeHtml(row.d.student?.name)}</td>
                  <td>${escapeHtml(row.d.institution?.name)}</td>
                  <td>${escapeHtml(row.d.teacher?.name)}</td>
                  <td>${row.hours} / ${row.required}</td>
                  <td><div class="progress"><span style="width:${Math.min(100, row.percent)}%"></span></div>${row.percent}%</td>
                  <td>${statusTag(row.assignment.status)}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary tw-py-0.5 tw-px-2 tw-text-xs" data-modal="student-dossier" data-id="${row.assignment.id}">Expediente</button>
                  </td>
                </tr>
              `).join("") || `<tr><td colspan="9">No hay informacion para los filtros seleccionados.</td></tr>`}
            </tbody>
          </table>
        </div>
        </div>

        <!-- Firmas Oficiales para Impresion -->
        <div class="official-print-signatures">
          <div class="print-signatures-grid">
            <div class="signature-col">
              <div class="signature-line">
                <strong>Coordinación de Prácticas</strong><br>
                <span>Firma y Sello</span>
              </div>
            </div>
            <div class="signature-col">
              <div class="signature-line">
                <strong>Dirección de Programa</strong><br>
                <span>Firma y Visto Bueno</span>
              </div>
            </div>
            <div class="signature-col">
              <div class="signature-line">
                <strong>Sello Institucional</strong><br>
                <span>Universidad de Investigación y Desarrollo</span>
              </div>
            </div>
          </div>
        </div>

        <p class="muted">El reporte se calcula con los datos registrados para el periodo y los filtros aplicados. PDF se genera con la opcion Imprimir del navegador.</p>
      </article>
    </section>
  `;
}

function filteredReportAssignments() {
  const user = currentUser();
  return data.assignments.filter((assignment) => {
    if (assignment.status !== "ACTIVA") return false;
    if (user?.role === "DOCENTE_ASESOR" && assignment.teacherId !== user.id) return false;
    const details = assignmentDetails(assignment);
    return (!reportFilters.periodId || assignment.periodId === Number(reportFilters.periodId)) &&
      (!reportFilters.program || details.period?.program === reportFilters.program) &&
      (!reportFilters.institutionId || details.institution?.id === Number(reportFilters.institutionId)) &&
      (!reportFilters.teacherId || assignment.teacherId === Number(reportFilters.teacherId));
  });
}

function renderAudit() {
  return `
    <section class="grid">
      <article class="card full">
        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Fecha</th><th>Usuario</th><th>Evento</th><th>Entidad</th></tr></thead>
            <tbody>
              ${data.audit.map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.user)}</td><td>${escapeHtml(item.event)}</td><td>${escapeHtml(item.entity)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function openModal(type, id = null) {
  const modal = document.createElement("div");
  modal.className = "sigpra-modal-backdrop";
  modal.innerHTML = `<section class="sigpra-modal ${type === 'student-dossier' ? 'sigpra-modal-lg' : ''}" role="dialog" aria-modal="true">${modalContent(type, id)}</section>`;
  document.body.appendChild(modal);
  modal.querySelectorAll("form[data-guided-workflow]").forEach(updateGuidedWorkflow);
}

function modalContent(type, id) {
  const title = {
    period: "Nuevo periodo",
    institution: "Nueva institucion",
    agreement: "Nuevo convenio",
    "agreement-place": "Registrar convenio y plazas",
    place: "Nueva plaza",
    assignment: "Nueva asignacion",
    activity: "Nueva actividad",
    evidence: "Registrar evidencia",
    validate: "Validar actividad",
    visit: "Registrar visita",
    "student-dossier": "Expediente del Practicante"
  }[type];
  return `
    <div class="sigpra-modal-header">
      <h2>${escapeHtml(title)}</h2>
      <button class="close" data-action="close-modal" aria-label="Cerrar">×</button>
    </div>
    ${modalForm(type, id)}
  `;
}

function optionList(items, labelFn, selectedId = "") {
  return items.map((item) => `<option value="${item.id}" ${Number(item.id) === Number(selectedId) && selectedId !== "" ? "selected" : ""}>${escapeHtml(labelFn(item))}</option>`).join("");
}

function modalForm(type, id) {
  const user = currentUser();
  if (type === "student-dossier") {
    const assignment = data.assignments.find((item) => item.id === Number(id));
    if (!assignment) return '<div class="empty">No se encontro el registro de la asignacion.</div>';
    const d = assignmentDetails(assignment);
    const hours = approvedHours(assignment.id) || assignment.approvedHours || 0;
    const required = d.period?.minHours || 320;
    const percent = Math.min(100, Math.round((hours / required) * 100));
    const studentActivities = data.activities.filter((a) => a.assignmentId === assignment.id);
    const studentVisits = data.visits.filter((v) => v.assignmentId === assignment.id);
    const studentEvidences = data.evidences.filter((e) => studentActivities.some((a) => a.id === e.activityId));

    return `
      <div class="dossier-content tw-space-y-4">
        <!-- Ficha de Identificacion -->
        <div class="card p-3 border tw-bg-slate-50">
          <div class="row align-items-center">
            <div class="col-auto">
              <span class="avatar fs-4" style="width: 52px; height: 52px;">${escapeHtml(d.student?.initials || "EP")}</span>
            </div>
            <div class="col">
              <h3 class="mb-0 text-primary">${escapeHtml(d.student?.name || "Estudiante")}</h3>
              <p class="mb-1 text-muted tw-text-sm">
                <strong>Codigo:</strong> ${escapeHtml(d.student?.code || "N/A")} &bull; 
                <strong>Correo:</strong> ${escapeHtml(d.student?.email || "")} &bull; 
                <strong>Semestre:</strong> ${escapeHtml(d.student?.semester || 8)}
              </p>
              <div class="d-flex gap-2 flex-wrap align-items-center">
                <span class="badge bg-secondary">${escapeHtml(d.period?.program || "Programa")}</span>
                <span class="badge bg-info text-dark">Periodo ${escapeHtml(d.period?.year || "")}-${escapeHtml(d.period?.semester || "")}</span>
                <span class="badge ${assignment.status === 'ACTIVA' ? 'bg-success' : 'bg-secondary'}">${escapeHtml(assignment.status)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Metricas de Avance -->
        <div class="card p-3 border">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong>Avance de Horas Academicas:</strong>
            <span class="badge bg-primary fs-6">${hours} / ${required} hrs (${percent}%)</span>
          </div>
          <div class="progress" style="height: 10px;">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${percent}%;" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <div class="row mt-2 tw-text-xs text-muted">
            <div class="col-6"><strong>Institucion Receptora:</strong> ${escapeHtml(d.institution?.name || "No asignada")}</div>
            <div class="col-6"><strong>Docente Asesor:</strong> ${escapeHtml(d.teacher?.name || "No asignado")}</div>
          </div>
        </div>

        <!-- Bitacora de Actividades -->
        <div>
          <h4 class="tw-font-bold tw-text-sm text-secondary mb-2">Bitacora de Actividades Reportadas (${studentActivities.length})</h4>
          <div class="table-wrap table-responsive" style="max-height: 180px; overflow-y: auto;">
            <table class="table table-sm table-hover align-middle tw-text-xs">
              <thead><tr><th>Fecha</th><th>Tipo</th><th>Descripcion</th><th>Horas</th><th>Estado</th></tr></thead>
              <tbody>
                ${studentActivities.length
                  ? studentActivities.map((act) => `
                      <tr>
                        <td>${moneyDate(act.date)}</td>
                        <td>${escapeHtml(act.type)}</td>
                        <td title="${escapeHtml(act.description)}">${escapeHtml(act.description.slice(0, 45))}${act.description.length > 45 ? "..." : ""}</td>
                        <td><strong>${act.hours}h</strong></td>
                        <td>${statusTag(act.status)}</td>
                      </tr>
                    `).join("")
                  : '<tr><td colspan="5" class="text-center text-muted py-2">No hay actividades registradas aun.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Visitas y Evidencias -->
        <div class="row g-3">
          <div class="col-md-6">
            <h4 class="tw-font-bold tw-text-sm text-secondary mb-2">Visitas de Acompanamiento (${studentVisits.length})</h4>
            <div class="table-wrap table-responsive" style="max-height: 140px; overflow-y: auto;">
              <table class="table table-sm table-hover align-middle tw-text-xs">
                <thead><tr><th>Fecha</th><th>Modalidad</th><th>Nota</th><th>Observacion</th></tr></thead>
                <tbody>
                  ${studentVisits.length
                    ? studentVisits.map((v) => `
                        <tr>
                          <td>${moneyDate(v.date)}</td>
                          <td><span class="badge bg-light text-dark">${escapeHtml(v.mode)}</span></td>
                          <td><strong>${v.score ? v.score.toFixed(1) : "N/A"}</strong></td>
                          <td title="${escapeHtml(v.observation || "")}">${escapeHtml((v.observation || "Sin obs.").slice(0, 25))}...</td>
                        </tr>
                      `).join("")
                    : '<tr><td colspan="4" class="text-center text-muted py-2">Sin visitas registradas.</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-md-6">
            <h4 class="tw-font-bold tw-text-sm text-secondary mb-2">Evidencias Adjuntas (${studentEvidences.length})</h4>
            <div class="table-wrap table-responsive" style="max-height: 140px; overflow-y: auto;">
              <table class="table table-sm table-hover align-middle tw-text-xs">
                <thead><tr><th>Archivo</th><th>Tipo</th><th>Estado</th></tr></thead>
                <tbody>
                  ${studentEvidences.length
                    ? studentEvidences.map((e) => `
                        <tr>
                          <td><span class="tw-text-blue-700">&#128196; ${escapeHtml(e.fileName)}</span></td>
                          <td><span class="badge bg-light text-secondary">${escapeHtml(e.type)}</span></td>
                          <td>${statusTag(e.status)}</td>
                        </tr>
                      `).join("")
                    : '<tr><td colspan="3" class="text-center text-muted py-2">Sin evidencias adjuntas.</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="modal-footer d-flex justify-content-end gap-2 pt-2 border-top">
          <button class="btn btn-outline-secondary" data-action="close-modal" type="button">Cerrar</button>
        </div>
      </div>
    `;
  }
  if (type === "period") {
    const period = id ? data.periods.find((item) => item.id === Number(id)) : null;
    const criterion = (index, field, fallback) => escapeHtml(period?.rubric?.[index]?.[field] ?? fallback);
    const programs = (data.programs || []).filter((item) => item.active || item.name === period?.program);
    const levels = (data.programs || []).find((item) => item.name === period?.program)?.levels || [];
    return `
      <form class="form-grid workflow-form guided-workflow" data-guided-workflow data-submit="period" data-id="${period?.id || ""}">
        <article class="card full workflow-step" data-workflow-step>
          <h3><span class="step-number">1</span> Programa y configuracion previa</h3>
          <label>Programa academico
            <select class="form-select" name="program" required>
              <option value="">-- Seleccione un programa --</option>
              ${programs.map((program) => `<option value="${escapeHtml(program.name)}" ${program.name === period?.program ? "selected" : ""}>${escapeHtml(program.name)}</option>`).join("")}
            </select>
          </label>
          <label>Nivel de practica
            <select class="form-select" name="level" required>
              <option value="">-- Seleccione un nivel --</option>
              ${levels.map((level) => `<option value="${escapeHtml(level)}" ${level === period?.level ? "selected" : ""}>${escapeHtml(level)}</option>`).join("")}
            </select>
          </label>
          <label>Anio<input class="form-control" name="year" type="number" value="${period?.year || 2026}" required></label>
          <label>Semestre<select class="form-select" name="semester"><option value="1" ${period?.semester === 1 ? "selected" : ""}>1</option><option value="2" ${!period || period.semester === 2 ? "selected" : ""}>2</option></select></label>
        </article>
        <article class="card full workflow-step" data-workflow-step hidden>
          <h3><span class="step-number">2</span> Fechas e intensidad horaria</h3>
          <label>Fecha inicio<input class="form-control" name="start" type="date" value="${escapeHtml(period?.start || "")}" required></label>
          <label>Fecha fin<input class="form-control" name="end" type="date" value="${escapeHtml(period?.end || "")}" required></label>
          <label>Fecha limite de reporte<input class="form-control" name="reportLimit" type="date" value="${escapeHtml(period?.reportLimit || "")}" required></label>
          <label>Intensidad horaria minima<input class="form-control" name="minHours" type="number" min="1" value="${period?.minHours || 320}" required></label>
        </article>
        <article class="card full workflow-step" data-workflow-step hidden>
          <h3><span class="step-number">3</span> Criterios de evaluacion y publicacion</h3>
          <div class="form-grid">
            <label>Criterio 1<input class="form-control" name="criterion1" value="${criterion(0, "name", "Cumplimiento de horas")}" required></label>
            <label>Peso (%)<input class="form-control" name="weight1" type="number" min="0" max="100" value="${criterion(0, "weight", 40)}" required></label>
            <label>Criterio 2<input class="form-control" name="criterion2" value="${criterion(1, "name", "Validacion de actividades")}" required></label>
            <label>Peso (%)<input class="form-control" name="weight2" type="number" min="0" max="100" value="${criterion(1, "weight", 30)}" required></label>
            <label>Criterio 3<input class="form-control" name="criterion3" value="${criterion(2, "name", "Visita de acompanamiento")}" required></label>
            <label>Peso (%)<input class="form-control" name="weight3" type="number" min="0" max="100" value="${criterion(2, "weight", 30)}" required></label>
          </div>
          <p class="muted">Los pesos deben sumar exactamente 100% para publicar el periodo.</p>
          <div class="alert alert-warning notice warning">No se podra publicar si las fechas no son coherentes, las horas son inferiores al minimo previo del programa o los pesos no suman 100%.</div>
          <div class="toolbar">
            <button class="btn btn-outline-secondary button" type="submit" name="status" value="BORRADOR">Guardar como borrador</button>
            <button class="btn btn-primary button primary" type="submit" name="status" value="PUBLICADO">Publicar periodo</button>
          </div>
        </article>
      </form>`;
  }
  if (type === "institution") {
    return `
      <form class="form-grid" data-submit="institution">
        <label>Nombre<input class="form-control" name="name" required></label>
        <label>NIT<input class="form-control" name="nit" required></label>
        <label>Contacto<input class="form-control" name="contact" required></label>
        <label>Telefono<input class="form-control" name="phone" required></label>
        <label class="full-field">Correo<input class="form-control" name="email" type="email" required></label>
        <button class="btn btn-primary button primary full-field" type="submit">Guardar institucion</button>
      </form>`;
  }
  if (type === "agreement") {
    return `
      <form class="form-grid" data-submit="agreement">
        <label>Institucion<select class="form-select" name="institutionId">${optionList(data.institutions, (item) => item.name)}</select></label>
        <label>Numero convenio<input class="form-control" name="number" required></label>
        <label>Fecha inicio<input class="form-control" name="start" type="date" required></label>
        <label>Fecha fin<input class="form-control" name="end" type="date" required></label>
        <label class="full-field">Documento<input class="form-control" name="document" placeholder="convenio.pdf"></label>
        <button class="btn btn-primary button primary full-field" type="submit">Guardar convenio</button>
      </form>`;
  }
  if (type === "agreement-place") {
    const institutions = data.institutions.filter((institution) => institution.active);
    return `
      <form class="form-grid guided-workflow" data-guided-workflow data-submit="agreement-place">
        <article class="card full workflow-step" data-workflow-step>
          <h3><span class="step-number">1</span> Institucion receptora</h3>
          <p class="muted">Selecciona la institucion donde se ofrecera la practica.</p>
          <label>Institucion receptora
            <select class="form-select" name="institutionId" required>
              <option value="">-- Seleccione una institucion --</option>
              ${optionList(institutions, (item) => `${item.name} - ${item.contact}`)}
            </select>
          </label>
        </article>
        <article class="card full workflow-step" data-workflow-step hidden>
          <h3><span class="step-number">2</span> Convenio</h3>
          <label>Numero de convenio<input class="form-control" name="number" required></label>
          <label>Vigencia desde<input class="form-control" name="start" type="date" required></label>
          <label>Vigencia hasta<input class="form-control" name="end" type="date" required></label>
          <label class="full-field">Documento suscrito del convenio<input class="form-control" name="document" type="file" accept=".pdf,.doc,.docx" /></label>
          <div class="alert alert-warning notice warning full-field">El prototipo registra el nombre y los datos del archivo localmente; no carga documentos a un servidor.</div>
        </article>
        <article class="card full workflow-step" data-workflow-step hidden>
          <h3><span class="step-number">3</span> Plaza ofrecida</h3>
          <label>Nivel educativo<input class="form-control" name="level" required></label>
          <label>Jornada<select class="form-select" name="shift"><option value="MANANA">Manana</option><option value="TARDE">Tarde</option><option value="NOCHE">Noche</option><option value="MIXTA">Mixta</option></select></label>
          <label>Cupos<input class="form-control" name="offered" type="number" min="1" value="2" required></label>
          <label>Docente titular<input class="form-control" name="tutor" required></label>
          <button class="btn btn-primary button primary full-field" type="submit">Guardar convenio y plaza</button>
        </article>
      </form>`;
  }
  if (type === "place") {
    return `
      <form class="form-grid" data-submit="place">
        <label>Convenio<select class="form-select" name="agreementId">${optionList(data.agreements, (item) => item.number)}</select></label>
        <label>Nivel<input class="form-control" name="level" required></label>
        <label>Jornada<select class="form-select" name="shift"><option>MANANA</option><option>TARDE</option><option>NOCHE</option><option>MIXTA</option></select></label>
        <label>Cupos<input class="form-control" name="offered" type="number" min="1" value="5" required></label>
        <label class="full-field">Docente titular<input class="form-control" name="tutor" required></label>
        <button class="btn btn-primary button primary full-field" type="submit">Guardar plaza</button>
      </form>`;
  }
  if (type === "assignment") {
    const availablePlaces = data.places.filter((place) => {
      const agreement = data.agreements.find((item) => item.id === place.agreementId);
      return placeStatus(place, agreement) === "DISPONIBLE";
    });
    const availableTeachers = teacherUsers().filter((teacher) =>
      data.assignments.filter((assignment) => assignment.teacherId === teacher.id && assignment.status === "ACTIVA").length < 6
    );
    return `
      <form class="form-grid" data-submit="assignment">
        <label>Estudiante habilitado<select class="form-select" name="studentId" required><option value="">Seleccione un estudiante</option>${optionList(studentUsers(), (item) => `${item.name} - ${item.code || item.email}`)}</select></label>
        <label>Periodo vigente<select class="form-select" name="periodId" required><option value="">Seleccione periodo</option>${optionList(data.periods.filter((period) => period.status === "PUBLICADO"), (item) => `${item.program} ${item.year}-${item.semester}`)}</select></label>
        <label>Plaza disponible<select class="form-select" name="placeId" required><option value="">Seleccione plaza</option>${optionList(availablePlaces, (item) => `${assignmentPlaceLabel(item)} - ${item.offered - item.occupied} cupos`)}</select></label>
        <label>Docente asesor disponible<select class="form-select" name="teacherId" required><option value="">Seleccione docente</option>${optionList(availableTeachers, (item) => `${item.name} - ${data.assignments.filter((assignment) => assignment.teacherId === item.id && assignment.status === "ACTIVA").length}/6 estudiantes`)}</select></label>
        <label class="full-field">Motivo de reasignacion <select class="form-select" name="reassignmentReason"><option value="">No es una reasignacion</option><option>Solicitud de la institucion receptora</option><option>Solicitud del estudiante</option><option>Cambio de disponibilidad del docente asesor</option><option>Otro</option></select></label>
        <div class="full-field notice warning">Si el estudiante ya tiene asignacion activa en este periodo, indica un motivo para reasignarlo. Se conserva el historial anterior.</div>
        <button class="btn btn-primary button primary full-field" type="submit">Confirmar asignacion</button>
      </form>`;
  }
  if (type === "activity") {
    const activity = id ? data.activities.find((item) => item.id === Number(id)) : null;
    return `
      <form class="form-grid guided-workflow" data-guided-workflow data-submit="activity" data-id="${id || ""}">
        ${activity?.observation ? `<div class="alert alert-warning notice warning full-field">Observacion del docente: ${escapeHtml(activity.observation)}</div>` : ""}
        <article class="card full workflow-step" data-workflow-step>
          <h3><span class="step-number">1</span> Datos de la actividad</h3>
          <label>Fecha de la actividad<input class="form-control" name="date" type="date" value="${escapeHtml(activity?.date || "")}" required></label>
          <label>Horas ejecutadas<input class="form-control" name="hours" type="number" min="0.5" max="24" step="0.5" value="${escapeHtml(activity?.hours || "")}" required></label>
          <label class="full-field">Tipo de actividad
            <input class="form-control" name="type" list="activity-types" value="${escapeHtml(activity?.type || "")}" required>
            <datalist id="activity-types"><option>Planeacion de clase</option><option>Refuerzo pedagogico</option><option>Reunion con docente titular</option></datalist>
          </label>
          <label class="full-field">Descripcion<textarea class="form-control" name="description" required>${escapeHtml(activity?.description || "")}</textarea></label>
        </article>
        <article class="card full workflow-step" data-workflow-step hidden>
          <h3><span class="step-number">2</span> Soportes y envio</h3>
          <label class="full-field">Soportes o evidencias<input class="form-control" name="files" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple></label>
          <div class="alert alert-warning notice warning full-field">El envio requiere al menos un soporte. Se permiten PDF, imagenes y documentos Office de hasta 10 MB cada uno. En este prototipo se persiste la referencia y el nombre de archivo, no el contenido binario.</div>
          <div class="toolbar">
            <button class="btn btn-outline-secondary button" type="submit" name="status" value="BORRADOR">Guardar como borrador</button>
            <button class="btn btn-primary button primary" type="submit" name="status" value="PENDIENTE">Enviar a validacion</button>
          </div>
        </article>
      </form>`;
  }
  if (type === "evidence") {
    const assignment = data.assignments.find((item) => item.studentId === user.id && item.status === "ACTIVA");
    const activities = assignment ? data.activities.filter((item) => item.assignmentId === assignment.id) : [];
    return `
      <form class="form-grid guided-workflow" data-guided-workflow data-submit="evidence">
        <article class="card full workflow-step" data-workflow-step>
          <h3><span class="step-number">1</span> Seleccionar actividad</h3>
          ${activities.length ? `
            <label class="full-field">Actividad
              <select class="form-select" name="activityId" required>
                <option value="">-- Seleccione una actividad --</option>
                ${optionList(activities, (item) => `${item.date} - ${item.type}`)}
              </select>
            </label>
          ` : `<div class="empty">No hay actividades asociadas a tu asignacion activa.</div>`}
        </article>
        <article class="card full workflow-step" data-workflow-step hidden>
          <h3><span class="step-number">2</span> Adjuntar soporte</h3>
          <label class="full-field">Soporte o evidencia<input class="form-control" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required></label>
          <div class="alert alert-warning notice warning full-field">En esta version se guarda el nombre y la referencia del archivo en el navegador, no el contenido binario.</div>
          <button class="btn btn-primary button primary full-field" type="submit">Registrar evidencia</button>
        </article>
      </form>`;
  }
  if (type === "validate") {
    const activity = data.activities.find((item) => item.id === Number(id));
    const assignment = activity && data.assignments.find((item) => item.id === activity.assignmentId);
    const evidence = data.evidences.filter((item) => item.activityId === activity?.id);
    return `
      <form class="form-grid guided-workflow" data-guided-workflow data-submit="validate" data-id="${id}">
        <article class="card full workflow-step" data-workflow-step>
          <h3><span class="step-number">1</span> Revisar actividad y soportes</h3>
          <div>
            <p><strong>${escapeHtml(activity?.type)}</strong><br>${escapeHtml(activity?.description)}</p>
            <p class="muted">Estudiante: ${escapeHtml(assignment && assignmentDetails(assignment).student?.name)} · Fecha: ${moneyDate(activity?.date)} · Horas: ${activity?.hours}</p>
            <h4>Soportes adjuntos</h4>
            ${evidence.length ? `<ul>${evidence.map((item) => `<li>${escapeHtml(item.fileName)} (${escapeHtml(item.type)})</li>`).join("")}</ul>` : `<div class="empty">No se adjuntaron soportes.</div>`}
          </div>
          <label class="full-field"><span><input class="form-check-input" name="evidenceReviewed" type="checkbox" value="yes" required style="width:auto"> Confirmo que revise los soportes disponibles para esta actividad</span></label>
        </article>
        <article class="card full workflow-step" data-workflow-step hidden>
          <h3><span class="step-number">2</span> Registrar decision y justificacion</h3>
          <label>Resultado<select class="form-select" name="status"><option value="APROBADA">Aprobar</option><option value="DEVUELTA">Devolver</option><option value="RECHAZADA">Rechazar</option></select></label>
          <label>Observacion / justificacion<textarea class="form-control" name="observation" placeholder="Obligatoria al devolver o rechazar"></textarea></label>
          <div class="alert alert-warning notice warning full-field">Al devolver o rechazar, registra la justificacion para el estudiante.</div>
          <button class="btn btn-primary button primary full-field" type="submit">Guardar validacion</button>
        </article>
      </form>`;
  }
  if (type === "visit") {
    const assignments = data.assignments.filter((item) => item.teacherId === user.id && item.status === "ACTIVA");
    return `
      <form class="form-grid guided-workflow" data-guided-workflow data-submit="visit">
        <article class="card full workflow-step" data-workflow-step>
          <h3><span class="step-number">1</span> Seleccionar practicante</h3>
          <label>Estudiante a evaluar
            <select class="form-select" name="assignmentId" required>
              <option value="">-- Seleccione estudiante --</option>
              ${optionList(assignments, (item) => `${assignmentDetails(item).student?.name} - ${assignmentDetails(item).institution?.name}`)}
            </select>
          </label>
          <div id="visit-assignment-details">${visitAssignmentDetails("")}</div>
        </article>
        <article class="card full workflow-step" data-workflow-step hidden>
          <h3><span class="step-number">2</span> Completar datos de la visita</h3>
          <label>Fecha<input class="form-control" name="date" type="date" required></label>
          <label>Modalidad<select class="form-select" name="mode"><option value="PRESENCIAL">Presencial</option><option value="VIRTUAL">Remota</option><option value="MIXTA">Mixta</option></select></label>
          <label class="full-field">Observaciones de la visita<textarea class="form-control" name="observation" required></textarea></label>
          <label class="full-field"><span><input class="form-check-input" name="attendance" type="checkbox" checked style="width:auto"> El estudiante asistio a la visita programada</span></label>
          <label class="full-field">Soporte de visita remota (si aplica)<input class="form-control" name="support" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"></label>
          <div class="alert alert-warning notice warning full-field">Si la visita es remota, adjunta un soporte. Si el estudiante no asistio, se registra la inasistencia para coordinar una reprogramacion.</div>
        </article>
        <article class="card full workflow-step" data-workflow-step hidden>
          <h3><span class="step-number">3</span> Evaluar con la rubrica</h3>
          <div class="form-grid" id="visit-rubric">${visitRubricFields("")}</div>
          <button class="btn btn-primary button primary full-field" type="submit">Guardar visita y evaluacion</button>
        </article>
      </form>`;
  }
  return `<div class="empty">Formulario no disponible.</div>`;
}

function visitAssignmentDetails(assignmentId) {
  const assignment = data.assignments.find((item) => item.id === Number(assignmentId));
  if (!assignment) return `<div class="empty">Selecciona un estudiante asignado para ver la informacion de su practica.</div>`;
  const details = assignmentDetails(assignment);
  const activities = data.activities.filter((activity) => activity.assignmentId === assignment.id);
  const evidence = data.evidences.filter((item) => activities.some((activity) => activity.id === item.activityId));
  return `
    <div class="alert alert-info notice">
      <strong>Institucion receptora:</strong> ${escapeHtml(details.institution?.name || "No registrada")}<br>
      <strong>Actividades reportadas:</strong> ${activities.length}<br>
      <strong>Evidencias disponibles:</strong> ${evidence.map((item) => escapeHtml(item.fileName)).join(", ") || "Ninguna"}
    </div>
  `;
}

function visitRubricFields(assignmentId) {
  const assignment = data.assignments.find((item) => item.id === Number(assignmentId));
  const period = assignment && data.periods.find((item) => item.id === assignment.periodId);
  const rubric = period?.rubric || [];
  if (!rubric.length) return `<div class="alert alert-warning notice warning full-field">No existe una rubrica configurada para el periodo. El coordinador debe configurar criterios antes de registrar la evaluacion.</div>`;
  return rubric.map((criterion, index) => `
    <label>${escapeHtml(criterion.name)} (${criterion.weight}%)
      <select class="form-select" name="score-${index}" required>
        <option value="">Seleccione puntaje</option>
        <option value="4">Excelente</option>
        <option value="3">Bueno</option>
        <option value="2">Aceptable</option>
        <option value="1">Insuficiente</option>
      </select>
    </label>
    <label>Comentario<input class="form-control" name="comment-${index}" placeholder="Comentario del criterio"></label>
  `).join("");
}

function handleSubmit(form, submitter) {
  const type = form.dataset.submit;
  const formData = Object.fromEntries(new FormData(form).entries());
  const user = currentUser();
  if (type === "academic-program") {
    if (user?.role !== "COORDINADOR") { toast("Operacion no autorizada."); return; }
    const name = String(formData.name || "").trim().replace(/\s+/g, " ");
    const levels = [...new Set(String(formData.levels || "").split(",").map((value) => value.trim()).filter(Boolean))];
    const id = Number(formData.programId || 0);
    const existing = (data.programs || []).find((program) => program.id === id);
    if (name.length < 3 || !levels.length || levels.some((level) => level.length > 100)) { toast("Verifica el nombre y los niveles."); return; }
    if (data.programs.some((program) => program.id !== id && program.name.toLocaleLowerCase("es") === name.toLocaleLowerCase("es"))) {
      toast("Ya existe un programa con ese nombre."); return;
    }
    if (existing) {
      const related = data.periods.filter((period) => period.program === existing.name);
      if (related.length && (existing.name !== name || related.some((period) => !levels.includes(period.level)))) {
        toast("No puedes cambiar el nombre ni retirar niveles utilizados por periodos existentes."); return;
      }
      Object.assign(existing, { name, levels, active: formData.active === "true" });
      audit("Actualizo programa academico", "PROGRAMA_ACADEMICO");
    } else {
      data.programs.push({ id: nextId(data.programs), name, levels, active: formData.active === "true" });
      audit("Registro programa academico", "PROGRAMA_ACADEMICO");
    }
    saveData(); toast("Programa guardado correctamente."); render(); return;
  }
  if (type === "period") {
    const selectedProgram = (data.programs || []).find((item) => item.name === String(formData.program));
    if (!selectedProgram || !selectedProgram.active || !selectedProgram.levels.includes(String(formData.level))) {
      toast("Selecciona un programa activo y uno de sus niveles registrados."); return;
    }
    const rubric = [1, 2, 3].map((index) => ({
      name: String(formData[`criterion${index}`]).trim(),
      weight: Number(formData[`weight${index}`])
    }));
    const minimumForProgram = Math.max(0, ...data.periods
      .filter((period) => period.id !== Number(form.dataset.id) && period.status === "PUBLICADO" &&
        period.program.toLowerCase() === String(formData.program).trim().toLowerCase())
      .map((period) => Number(period.minHours)));
    const periodStatus = submitter?.value || "PUBLICADO";
    const existingPeriod = form.dataset.id ? data.periods.find((period) => period.id === Number(form.dataset.id)) : null;
    if (new Date(`${formData.start}T00:00:00`) > new Date(`${formData.end}T00:00:00`) ||
      new Date(`${formData.reportLimit}T00:00:00`) < new Date(`${formData.end}T00:00:00`)) {
      toast("Verifica las fechas: el inicio debe preceder al fin y el limite de reporte no puede ser anterior al fin.");
      return;
    }
    if (data.periods.some((period) => period.id !== existingPeriod?.id &&
      period.program.toLowerCase() === String(formData.program).trim().toLowerCase() &&
      period.year === Number(formData.year) && period.semester === Number(formData.semester))) {
      toast("Ya existe un periodo para ese programa, ano y semestre.");
      return;
    }
    // Permitir actualizar periodo académico existente
    if (periodStatus === "PUBLICADO" && Number(formData.minHours) < minimumForProgram) {
      toast(`Las horas minimas no pueden ser inferiores al minimo anterior del programa (${minimumForProgram}).`);
      return;
    }
    if (periodStatus === "PUBLICADO" && rubric.reduce((sum, criterion) => sum + criterion.weight, 0) !== 100) {
      toast("No se puede publicar: los pesos de evaluacion deben sumar 100%.");
      return;
    }
    const periodRecord = existingPeriod || { id: nextId(data.periods) };
    Object.assign(periodRecord, {
      program: String(formData.program).trim(),
      level: String(formData.level).trim(),
      year: Number(formData.year),
      semester: Number(formData.semester),
      start: formData.start,
      end: formData.end,
      reportLimit: formData.reportLimit,
      minHours: Number(formData.minHours),
      status: periodStatus,
      rubric
    });
    if (!existingPeriod) data.periods.push(periodRecord);
    audit(existingPeriod ? `${periodStatus === "PUBLICADO" ? "Publico" : "Actualizo"} un periodo en borrador` : "Creo un periodo de practica", "PERIODO_PRACTICA");
  }
  if (type === "institution") {
    data.institutions.push({ id: nextId(data.institutions), ...formData, active: true });
    audit("Registro una institucion", "INSTITUCION");
  }
  if (type === "agreement") {
    if (formData.start > formData.end) {
      toast("La fecha de inicio del convenio debe ser anterior a su fecha de vencimiento.");
      return;
    }
    const agreement = {
      id: nextId(data.agreements),
      institutionId: Number(formData.institutionId),
      number: String(formData.number).trim(),
      start: formData.start,
      end: formData.end,
      document: String(formData.document).trim(),
      status: String(formData.document || "").trim() && formData.end >= new Date().toISOString().slice(0, 10) ? "VIGENTE" : "INACTIVA"
    };
    data.agreements.push(agreement);
    audit("Registro un convenio", "CONVENIO");
  }
  if (type === "agreement-place") {
    const document = form.querySelector('[name="document"]').files[0];
    if (formData.start > formData.end) {
      toast("La fecha de inicio del convenio debe ser anterior a su fecha de vencimiento.");
      return;
    }
    if (data.agreements.some((agreement) => agreement.number.toLowerCase() === String(formData.number).trim().toLowerCase())) {
      toast("Ya existe un convenio con ese numero.");
      return;
    }
    const agreementId = nextId(data.agreements);
    const agreement = {
      id: agreementId,
      institutionId: Number(formData.institutionId),
      number: String(formData.number).trim(),
      start: formData.start,
      end: formData.end,
      document: document?.name || "",
      status: document &&
        formData.end >= new Date().toISOString().slice(0, 10) ? "VIGENTE" : "INACTIVA"
    };
    data.agreements.push(agreement);
    data.places.push({
      id: nextId(data.places),
      agreementId,
      level: String(formData.level).trim(),
      shift: formData.shift,
      offered: Number(formData.offered),
      occupied: 0,
      tutor: String(formData.tutor).trim(),
      status: agreement.status === "VIGENTE" ? "DISPONIBLE" : "INACTIVA"
    });
    audit("Registro un convenio y sus plazas", "CONVENIO_PLAZA");
  }
  if (type === "place") {
    data.places.push({ id: nextId(data.places), agreementId: Number(formData.agreementId), level: formData.level, shift: formData.shift, offered: Number(formData.offered), occupied: 0, tutor: formData.tutor, status: "DISPONIBLE" });
    audit("Registro una plaza de practica", "PLAZA_PRACTICA");
  }
  if (type === "assignment") {
    const studentId = Number(formData.studentId);
    const teacherId = Number(formData.teacherId);
    const placeId = Number(formData.placeId);
    const periodId = Number(formData.periodId);
    const activeAssignment = data.assignments.find((assignment) =>
      assignment.studentId === studentId && assignment.periodId === periodId && assignment.status === "ACTIVA"
    );
    const id = nextId(data.assignments);
    const place = data.places.find((item) => item.id === placeId);
    const agreement = data.agreements.find((item) => item.id === place?.agreementId);
    const teacherLoad = data.assignments.filter((assignment) =>
      assignment.teacherId === teacherId && assignment.status === "ACTIVA" && assignment.id !== activeAssignment?.id
    ).length;
    if (!data.users.some((item) => item.id === studentId && item.role === "ESTUDIANTE") ||
      !data.users.some((item) => item.id === teacherId && item.role === "DOCENTE_ASESOR") ||
      !data.periods.some((item) => item.id === periodId && item.status === "PUBLICADO")) {
      toast("Selecciona un estudiante, docente asesor y periodo publicado validos.");
      return;
    }
    if (!place || placeStatus(place, agreement) !== "DISPONIBLE") {
      toast("La plaza no tiene cupos o el convenio no esta vigente y documentado.");
      return;
    }
    if (teacherLoad >= 6) {
      toast("El docente asesor ya alcanzo el maximo de seis estudiantes asignados.");
      return;
    }
    if (activeAssignment && !formData.reassignmentReason) {
      toast("El estudiante ya tiene una asignacion activa en este periodo. Selecciona un motivo para reasignarlo.");
      return;
    }
    if (activeAssignment) {
      const previousPlace = data.places.find((item) => item.id === activeAssignment.placeId);
      activeAssignment.status = "CANCELADA";
      activeAssignment.reassignmentReason = String(formData.reassignmentReason);
      if (previousPlace) previousPlace.occupied = Math.max(0, previousPlace.occupied - 1);
    }
    data.assignments.push({
      id,
      studentId,
      teacherId,
      placeId,
      periodId,
      date: new Date().toISOString().slice(0, 10),
      status: "ACTIVA",
      approvedHours: 0,
      reassignedFrom: activeAssignment?.id || null,
      reassignmentReason: activeAssignment ? String(formData.reassignmentReason) : ""
    });
    place.occupied += 1;
    audit(activeAssignment ? "Reasigno un estudiante conservando el historial" : "Creo una asignacion de practica", "ASIGNACION");
    const details = assignmentDetails(data.assignments[data.assignments.length - 1]);
    audit(`Asignacion preparada para ${details.student?.name}, docente ${details.teacher?.name} e institucion ${details.institution?.name}; verificar notificacion externa`, "NOTIFICACION");
  }
  if (type === "activity") {
    const assignment = data.assignments.find((item) => item.studentId === user.id && item.status === "ACTIVA");
    const submitStatus = submitter?.value || "PENDIENTE";
    const date = String(formData.date);
    const hours = Number(formData.hours);
    const period = assignment && data.periods.find((item) => item.id === assignment.periodId);
    const existing = form.dataset.id ? data.activities.find((item) => item.id === Number(form.dataset.id)) : null;
    const files = Array.from(form.querySelector('[name="files"]').files);
    const allowedExtensions = new Set(["pdf", "jpg", "jpeg", "png", "doc", "docx"]);
    if (!assignment || !period) {
      toast("No hay una asignacion activa para registrar esta actividad.");
      return;
    }
    if (existing && (existing.assignmentId !== assignment.id || !["DEVUELTA", "BORRADOR"].includes(existing.status))) {
      toast("Solo puedes corregir tus actividades devueltas o completar borradores.");
      return;
    }
    if (date < period.start || date > period.end || date > period.reportLimit) {
      toast(`La fecha debe estar dentro del periodo ${moneyDate(period.start)} - ${moneyDate(period.end)} y antes del cierre de reportes.`);
      return;
    }
    if (!Number.isFinite(hours) || hours < 0.5 || hours > 24) {
      toast("Las horas deben ser un valor entre 0.5 y 24.");
      return;
    }
    if (submitStatus === "PENDIENTE" && files.length === 0 && !data.evidences.some((evidence) => evidence.activityId === existing?.id)) {
      toast("Adjunta al menos un soporte antes de enviar la actividad a validacion.");
      return;
    }
    const invalidFile = files.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      return !allowedExtensions.has(extension) || file.size > 10 * 1024 * 1024;
    });
    if (invalidFile) {
      toast(`El archivo ${invalidFile.name} no es valido. Usa PDF, JPG, PNG, DOC o DOCX de hasta 10 MB.`);
      return;
    }
    const activity = existing || {
      id: nextId(data.activities),
      assignmentId: assignment.id,
      observation: ""
    };
    activity.date = date;
    activity.type = String(formData.type).trim();
    activity.description = String(formData.description).trim();
    activity.hours = hours;
    activity.status = submitStatus;
    if (existing) activity.observation = "";
    else data.activities.push(activity);
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toUpperCase() || "ARCHIVO";
      const evidenceId = nextId(data.evidences);
      data.evidences.push({
        id: evidenceId,
        activityId: activity.id,
        fileName: file.name,
        type: extension,
        url: `storage/sigpra/assignment-${assignment.id}/activity-${activity.id}/${encodeURIComponent(file.name)}`,
        status: "CARGADA",
        mongoId: `ev-local-${String(evidenceId).padStart(3, "0")}`
      });
    }
    audit(submitStatus === "BORRADOR" ? "Guardo actividad como borrador" : existing ? "Reenvio actividad corregida" : "Registro una actividad", "REGISTRO_ACTIVIDAD");
  }
  if (type === "evidence") {
    const file = form.querySelector('[name="file"]').files[0];
    const activity = data.activities.find((item) => item.id === Number(formData.activityId));
    const assignment = activity && data.assignments.find((item) =>
      item.id === activity.assignmentId && item.studentId === user.id && item.status === "ACTIVA"
    );
    const extension = file?.name.split(".").pop()?.toLowerCase() || "";
    if (!file || !assignment || !["pdf", "jpg", "jpeg", "png", "doc", "docx"].includes(extension) ||
      file.size > 10 * 1024 * 1024) {
      toast("Selecciona una actividad propia y un archivo permitido de hasta 10 MB.");
      return;
    }
    const id = nextId(data.evidences);
    data.evidences.push({ id, activityId: activity.id, fileName: file.name, type: extension.toUpperCase(), url: `storage/sigpra/evidencia-${id}-${encodeURIComponent(file.name)}`, status: "CARGADA", mongoId: `ev-local-${String(id).padStart(3, "0")}` });
    audit("Registro una evidencia", "EVIDENCIA");
  }
  if (type === "validate") {
    const activity = data.activities.find((item) => item.id === Number(form.dataset.id));
    const assignment = activity && data.assignments.find((item) => item.id === activity.assignmentId);
    const evidence = data.evidences.filter((item) => item.activityId === activity?.id);
    if (!activity || !assignment || assignment.teacherId !== user.id || activity.status !== "PENDIENTE") {
      toast("La actividad ya no esta pendiente o no pertenece a tus estudiantes asignados.");
      return;
    }
    if (formData.status === "APROBADA" && (!formData.evidenceReviewed || evidence.length === 0)) {
      toast("Para aprobar, confirma la revision y verifica que la actividad tenga al menos un soporte.");
      return;
    }
    if (["DEVUELTA", "RECHAZADA"].includes(String(formData.status)) && !String(formData.observation).trim()) {
      toast("Escribe la observacion obligatoria al devolver o rechazar una actividad.");
      return;
    }
    activity.status = formData.status;
    activity.observation = String(formData.observation || (formData.status === "APROBADA" ? "Actividad aprobada." : "")).trim();
    activity.validatedBy = user.id;
    activity.validatedAt = new Date().toISOString();
    evidence.forEach((item) => { item.status = formData.status === "APROBADA" ? "VALIDADA" : item.status; });
    assignment.approvedHours = approvedHours(assignment.id);
    audit(`Valido actividad como ${formData.status}`, "REGISTRO_ACTIVIDAD");
  }
  if (type === "visit") {
    const assignment = data.assignments.find((item) => item.id === Number(formData.assignmentId) &&
      item.teacherId === user.id && item.status === "ACTIVA");
    const period = assignment && data.periods.find((item) => item.id === assignment.periodId);
    const rubric = period?.rubric || [];
    const support = form.querySelector('[name="support"]').files[0];
    if (!assignment || !period) {
      toast("Selecciona una asignacion activa propia para registrar la visita.");
      return;
    }
    if (formData.date < period.start || formData.date > period.end) {
      toast("La fecha de la visita debe estar dentro del periodo de practica.");
      return;
    }
    if (!rubric.length) {
      toast("No se puede guardar la evaluacion porque el periodo no tiene una rubrica configurada.");
      return;
    }
    const ratings = rubric.map((criterion, index) => ({
      criterion: criterion.name,
      weight: Number(criterion.weight),
      score: Number(formData[`score-${index}`]),
      comment: String(formData[`comment-${index}`] || "").trim()
    }));
    if (ratings.some((rating) => !Number.isFinite(rating.score) || rating.score < 1 || rating.score > 4) ||
      rubric.reduce((sum, criterion) => sum + Number(criterion.weight), 0) !== 100) {
      toast("Completa todos los criterios y verifica que la rubrica del periodo sume 100%.");
      return;
    }
    if (formData.mode === "VIRTUAL" && !support) {
      toast("Adjunta el soporte requerido para una visita remota.");
      return;
    }
    if (support && (support.size > 10 * 1024 * 1024 ||
      !["pdf", "jpg", "jpeg", "png", "doc", "docx"].includes(support.name.split(".").pop()?.toLowerCase() || ""))) {
      toast("El soporte debe ser PDF, imagen, DOC o DOCX de hasta 10 MB.");
      return;
    }
    const weightedScore = ratings.reduce((sum, rating) => sum + rating.score * rating.weight, 0) / 100;
    const concept = weightedScore >= 3.5 ? "Excelente" : weightedScore >= 2.5 ? "Bueno" : weightedScore >= 1.5 ? "Aceptable" : "Insuficiente";
    data.visits.push({
      id: nextId(data.visits),
      assignmentId: assignment.id,
      teacherId: user.id,
      date: formData.date,
      mode: formData.mode,
      attendance: form.querySelector('[name="attendance"]').checked,
      observation: String(formData.observation).trim(),
      score: Math.round(weightedScore * 100) / 100,
      concept,
      rubric: ratings,
      supportFileName: support?.name || "",
      status: "REGISTRADA"
    });
    audit("Registro visita y evaluacion", "VISITA_SEGUIMIENTO");
    if (!form.querySelector('[name="attendance"]').checked) {
      audit("Registro inasistencia del estudiante y requiere reprogramacion", "VISITA_SEGUIMIENTO");
    }
  }
  if (type === "report-filters") {
    reportFilters = {
      periodId: String(formData.periodId || ""),
      program: String(formData.program || ""),
      institutionId: String(formData.institutionId || ""),
      teacherId: String(formData.teacherId || "")
    };
    audit(`Aplico filtros al consolidado (${JSON.stringify(reportFilters)})`, "CONSULTA_CONSOLIDADA");
    saveData();
    toast("Filtros aplicados; consolidado actualizado.");
    render();
    return;
  }
  saveData();
  document.querySelector(".sigpra-modal-backdrop")?.remove();
  toast("Operacion guardada correctamente.");
  render();
}

function exportJson() {
  downloadFile("sigpra-datos.json", JSON.stringify(data, null, 2), "application/json");
  audit("Exporto datos JSON", "REPORTE");
  saveData();
}

function exportCsv() {
  const header = ["Estudiante", "Codigo", "Programa", "Institucion", "Docente Asesor", "Horas Aprobadas", "Horas Requeridas", "Avance", "Estado"];
  const assignments = filteredReportAssignments();
  const rows = assignments.map((assignment) => {
    const d = assignmentDetails(assignment);
    const hours = approvedHours(assignment.id) || assignment.approvedHours || 0;
    const required = d.period?.minHours || 320;
    const percent = `${Math.round((hours / required) * 100)}%`;
    return [
      d.student?.name || "Sin estudiante",
      d.student?.code || "N/A",
      d.period?.program || "Sin programa",
      d.institution?.name || "Sin institucion",
      d.teacher?.name || "Sin docente",
      hours,
      required,
      percent,
      assignment.status
    ];
  });
  const csvContent = "\ufeff" + [header, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(";")).join("\r\n");
  downloadFile("sigpra-consolidado-udi.csv", csvContent, "text/csv;charset=utf-8;");
  audit(`Exporto consolidado CSV (${JSON.stringify(reportFilters)})`, "REPORTE");
  saveData();
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("submit", async (event) => {
  if (event.target.id === "register-form") {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target).entries());

    if (formData.password !== formData.confirmPassword) {
      toast("Las contraseñas no coinciden. Por favor verifícalas.");
      return;
    }

    const email = String(formData.email || "").trim().toLowerCase();
    const name = String(formData.name || "").trim();
    const code = String(formData.code || "").trim();
    const semester = Number(formData.semester) || 8;
    const password = String(formData.password);

    if (data.users.some(u => u.email.toLowerCase() === email)) {
      toast("Ese correo institucional ya se encuentra registrado.");
      return;
    }

    const nameParts = name.split(" ");
    const initials = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

    const newUser = {
      id: nextId(data.users),
      name,
      email,
      password,
      role: "ESTUDIANTE",
      initials,
      code: code || ("UDI-2026-" + String(data.users.length + 1).padStart(3, "0")),
      semester,
      enabledForAssignment: false
    };

    data.users.push(newUser);
    audit(`Registro de nuevo estudiante practicante (${newUser.email})`, "USUARIO");
    saveData();

    if (apiEnabled) {
      apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, code, semester })
      }).catch(() => {});
    }

    authMode = "login";
    saveSession(newUser);
    currentView = "student-request";
    studentRequestTab = "form";
    toast(`¡Bienvenido ${newUser.name}! Tu cuenta ha sido creada.`);
    render();
    return;
  }
  if (event.target.id === "login-form") {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target).entries());
    const email = String(formData.email?.trim() || formData.user_select || "");
    const password = String(formData.password || "123456");
    const user = await loginWithApi(email, password);
    if (!user) {
      toast("Correo o clave incorrectos.");
      return;
    }
    currentView = "dashboard";
    saveSession(user);
    render();
    return;
  }
  if (event.target.dataset.submit) {
    event.preventDefault();
    handleSubmit(event.target, event.submitter);
  }
});

document.addEventListener("input", (event) => {
  const guidedForm = event.target.closest("form[data-guided-workflow]");
  if (guidedForm) updateGuidedWorkflow(guidedForm);
});

document.addEventListener("change", (event) => {
  if (event.target.id === "login-user-select") {
    const selectedEmail = event.target.value;
    const user = data.users.find((u) => u.email === selectedEmail);
    if (user) {
      const emailInput = document.querySelector("#login-email");
      const passwordInput = document.querySelector("#login-password");
      const previewAvatar = document.querySelector(".login-preview-avatar");
      const previewName = document.querySelector("#login-preview-name");
      const previewRole = document.querySelector("#login-preview-role");

      if (emailInput) emailInput.value = user.email;
      if (passwordInput) passwordInput.value = user.password || "123456";
      if (previewAvatar) previewAvatar.textContent = user.initials || user.name.slice(0, 2).toUpperCase();
      if (previewName) previewName.textContent = user.name;
      if (previewRole) previewRole.textContent = roleLabel(user.role);
    }
    return;
  }
  const guidedForm = event.target.closest("form[data-guided-workflow]");
  if (guidedForm) updateGuidedWorkflow(guidedForm);
  if (event.target.matches('[data-submit="visit"] [name="assignmentId"]')) {
    const form = event.target.closest("form");
    const rubric = form.querySelector("#visit-rubric");
    const details = form.querySelector("#visit-assignment-details");
    rubric.innerHTML = visitRubricFields(event.target.value);
    details.innerHTML = visitAssignmentDetails(event.target.value);
    updateGuidedWorkflow(form);
    return;
  }
  const assignmentForm = event.target.closest('[data-submit="assignment"]');
  if (assignmentForm?.classList.contains("assignment-workflow")) {
    updateAssignmentWorkflow(assignmentForm, event.target.name);
    return;
  }
  if (event.target.matches('[data-submit="period"] [name="program"]')) {
    const form = event.target.closest('form[data-submit="period"]');
    const program = (data.programs || []).find((item) => item.name === event.target.value);
    const select = form.elements.level;
    const previous = select.value;
    select.innerHTML = '<option value="">-- Seleccione un nivel --</option>' +
      (program?.levels || []).map((level) => `<option value="${escapeHtml(level)}">${escapeHtml(level)}</option>`).join("");
    if (program?.levels.includes(previous)) select.value = previous;
    updateGuidedWorkflow(form);
    return;
  }
});

document.addEventListener("click", async (event) => {
  // Filtro de chips y tarjetas en la bandeja del Director
  const statusFilterBtn = event.target.closest('[data-status-filter]');
  if (statusFilterBtn) {
    event.stopPropagation();
    const filter = statusFilterBtn.getAttribute('data-status-filter');
    if (filter) {
      directorStatusFilter = filter;
      render();
    }
    return;
  }

  // Modal para agregar nuevo docente asesor
  const newTeacherBtn = event.target.closest('[data-action="open-new-teacher-modal"]');
  if (newTeacherBtn) {
    event.stopPropagation();
    openNewTeacherModal();
    return;
  }

  // Editar periodo académico
  const editPeriodBtn = event.target.closest('[data-action="edit-period"]');
  if (editPeriodBtn) {
    event.stopPropagation();
    const pId = editPeriodBtn.getAttribute('data-id');
    openModal('period', pId);
    return;
  }

  // Eliminar periodo académico
  const deletePeriodBtn = event.target.closest('[data-action="delete-period"]');
  if (deletePeriodBtn) {
    event.stopPropagation();
    const pId = Number(deletePeriodBtn.getAttribute('data-id'));
    const hasAssignments = (data.assignments || []).some(a => a.periodId === pId);
    const hasRequests = (data.requests || []).some(r => r.periodId === pId);

    if (hasAssignments || hasRequests) {
      toast("No se puede eliminar este periodo porque ya tiene estudiantes o prácticas vinculadas.", "warning");
      return;
    }

    if (confirm("¿Estás seguro de eliminar este periodo académico? Esta acción no se puede deshacer.")) {
      data.periods = data.periods.filter(p => p.id !== pId);
      audit(`Eliminó periodo académico ID #${pId}`, "PERIODO");
      saveData();
      toast("Periodo académico eliminado correctamente.", "success");
      render();
    }
    return;
  }

  const notifToggle = event.target.closest('[data-action="toggle-notifications"]');
  if (notifToggle) {
    event.stopPropagation();
    notificationsOpen = !notificationsOpen;
    render();
    return;
  }

  const markAllRead = event.target.closest('[data-action="mark-all-notifications-read"]');
  if (markAllRead) {
    event.stopPropagation();
    const session = getSession();
    if (session) {
      getNotificationsForUser(session).forEach(n => readNotifIds.add(n.id));
    }
    render();
    return;
  }

  const notifItem = event.target.closest('[data-action="click-notification"]');
  if (notifItem) {
    const id = notifItem.getAttribute("data-id");
    const view = notifItem.getAttribute("data-view");
    if (id) readNotifIds.add(id);
    notificationsOpen = false;
    if (view) {
      currentView = view;
    }
    render();
    return;
  }

  const openLetterBtn = event.target.closest('[data-action="open-official-letter"]');
  if (openLetterBtn) {
    const asgId = openLetterBtn.getAttribute("data-id");
    openOfficialPresentationLetterModal(asgId);
    return;
  }

  // Close notifications dropdown on outside click
  if (notificationsOpen && !event.target.closest(".notification-wrapper")) {
    notificationsOpen = false;
    render();
  }

  const login = event.target.closest("[data-login]");
  if (login) {
    const demoUser = data.users.find((item) => item.email === login.dataset.login);
    const user = await loginWithApi(login.dataset.login, demoUser?.password || "123456");
    saveSession(user);
    currentView = "dashboard";
    render();
    return;
  }

  const view = event.target.closest("[data-view]");
  if (view) {
    currentView = view.dataset.view;
    render();
    return;
  }

  const modal = event.target.closest("[data-modal]");
  if (modal) {
    openModal(modal.dataset.modal, modal.dataset.id);
    return;
  }

  const action = event.target.closest("[data-action]");
  if (!action) return;

  if (["edit-program", "delete-program", "cancel-program-edit"].includes(action.dataset.action)) {
    if (currentUser()?.role !== "COORDINADOR") { toast("Operacion no autorizada."); return; }
    const program = (data.programs || []).find((item) => item.id === Number(action.dataset.id));
    if (action.dataset.action === "delete-program") {
      if (!program) return;
      if (data.periods.some((period) => period.program === program.name)) {
        toast("No se puede eliminar: el programa tiene periodos asociados. Puedes desactivarlo."); return;
      }
      if (!window.confirm(`Eliminar el programa ${program.name}?`)) return;
      data.programs = data.programs.filter((item) => item.id !== program.id);
      audit("Elimino programa academico", "PROGRAMA_ACADEMICO");
      saveData(); render(); return;
    }
    const form = document.querySelector("#program-crud-form");
    if (!form) return;
    form.reset();
    form.elements.programId.value = "";
    if (action.dataset.action === "edit-program" && program) {
      form.elements.programId.value = String(program.id);
      form.elements.name.value = program.name;
      form.elements.levels.value = program.levels.join(", ");
      form.elements.active.value = String(program.active);
    }
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (action.dataset.action === "toggle-auth-mode") {
    authMode = action.dataset.mode;
    renderLogin();
    return;
  }
  if (action.dataset.action === "switch-request-tab") {
    studentRequestTab = action.dataset.tab;
    render();
    return;
  }
  if (action.dataset.action === "preview-doc") {
    const student = action.dataset.student || currentUser()?.name || "Estudiante Practicante";
    const docType = action.dataset.doctype || "Documento Digital";
    const filename = action.dataset.filename || "soporte.pdf";
    openDocPreviewModal(student, docType, filename);
    return;
  }
  if (action.dataset.action === "open-review-modal") {
    openRequestReviewModal(action.dataset.id);
    return;
  }
  if (action.dataset.action === "save-request-draft" || action.dataset.action === "submit-student-request") {
    const user = currentUser();
    if (!user || user.role !== "ESTUDIANTE") return;
    const form = document.querySelector("#student-request-form");
    if (!form) return;
    const isDraft = action.dataset.action === "save-request-draft";
    const periodId = Number(form.elements.periodId.value);
    const level = form.elements.level.value;
    const modality = form.elements.modality.value;
    const placeId = form.elements.placeId?.value ? Number(form.elements.placeId.value) : undefined;
    const suggestedCompany = form.elements.suggestedCompany?.value || "";
    const comments = form.elements.comments?.value || "";

    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    let reqIndex = (data.requests || []).findIndex(r => r.studentId === user.id && r.periodId === periodId);

    const docMatricula = form.elements.fileMatricula?.files?.[0]?.name || "matricula_" + user.name.toLowerCase().replace(/ /g, '_') + ".pdf";
    const docEps = form.elements.fileEps?.files?.[0]?.name || "eps_arl_" + user.name.toLowerCase().replace(/ /g, '_') + ".pdf";
    const docPaz = form.elements.filePazYSalvo?.files?.[0]?.name || "paz_y_salvo_" + user.name.toLowerCase().replace(/ /g, '_') + ".pdf";

    if (!data.requests) data.requests = [];

    const reqData = {
      id: reqIndex >= 0 ? data.requests[reqIndex].id : nextId(data.requests),
      studentId: user.id,
      periodId,
      level,
      modality,
      placeId,
      suggestedCompany,
      status: isDraft ? "BORRADOR" : "PENDIENTE_REVISION",
      documents: {
        matricula: { name: docMatricula, type: "application/pdf", uploadedAt: timestamp },
        epsArl: { name: docEps, type: "application/pdf", uploadedAt: timestamp },
        pazYSalvo: { name: docPaz, type: "application/pdf", uploadedAt: timestamp }
      },
      comments,
      submittedAt: isDraft ? undefined : timestamp,
      createdAt: reqIndex >= 0 ? data.requests[reqIndex].createdAt : timestamp,
      updatedAt: timestamp
    };

    if (reqIndex >= 0) {
      data.requests[reqIndex] = reqData;
    } else {
      data.requests.push(reqData);
    }

    audit(isDraft ? `Guardó borrador de solicitud #${reqData.id}` : `Radicó solicitud formal de práctica #${reqData.id}`, "SOLICITUD");
    studentRequestTab = "status";
    saveData();

    if (apiEnabled) {
      apiRequest("/requests", {
        method: "POST",
        body: JSON.stringify({
          ...reqData,
          userName: user.name
        })
      }).catch(() => {});
    }

    toast(isDraft ? "Borrador guardado exitosamente." : "¡Solicitud formal de práctica radicada exitosamente!");
    render();
    return;
  }
  if (action.dataset.action === "approve-request-confirm") {
    const user = currentUser();
    if (user?.role !== "DIRECTOR") {
      toast("Operación no autorizada: Solo el Director de Programa puede aprobar solicitudes.");
      return;
    }
    const reqId = Number(action.dataset.id);
    const req = (data.requests || []).find(r => r.id === reqId);
    if (!req) return;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    req.status = "APROBADA";
    req.reviewedAt = timestamp;
    req.reviewedBy = user?.id || 4;
    req.justification = document.querySelector("#review-justification-input")?.value?.trim() || "Cumple requisitos y soportes verificados.";

    const student = data.users.find(u => u.id === req.studentId);
    if (student) student.enabledForAssignment = true;

    audit(`Aprobó solicitud de práctica #${req.id} y habilitó practicante`, "SOLICITUD");
    saveData();

    if (apiEnabled) {
      apiRequest(`/requests/${req.id}/review`, {
        method: "PUT",
        body: JSON.stringify({
          status: "APROBADA",
          justification: req.justification,
          reviewerName: user.name,
          reviewerId: user.id
        })
      }).catch(() => {});
    }

    document.querySelector(".sigpra-modal-backdrop")?.remove();
    toast(`Solicitud #${req.id} APROBADA. El estudiante ha sido Habilitado.`);
    render();
    return;
  }
  if (action.dataset.action === "return-request-confirm" || action.dataset.action === "reject-request-confirm") {
    const user = currentUser();
    if (user?.role !== "DIRECTOR") {
      toast("Operación no autorizada: Solo el Director de Programa puede resolver solicitudes.");
      return;
    }
    const isReturn = action.dataset.action === "return-request-confirm";
    const reqId = Number(action.dataset.id);
    const req = (data.requests || []).find(r => r.id === reqId);
    if (!req) return;
    const justification = document.querySelector("#review-justification-input")?.value?.trim();
    if (!justification) {
      toast("La justificación es obligatoria para devolver o rechazar una solicitud.");
      return;
    }
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    req.status = isReturn ? "DEVUELTA" : "RECHAZADA";
    req.reviewedAt = timestamp;
    req.reviewedBy = user?.id || 4;
    req.justification = justification;

    const student = data.users.find(u => u.id === req.studentId);
    if (student) student.enabledForAssignment = false;

    audit(`${isReturn ? 'Devolvió' : 'Rechazó'} solicitud de práctica #${req.id}: ${justification}`, "SOLICITUD");
    saveData();

    if (apiEnabled) {
      apiRequest(`/requests/${req.id}/review`, {
        method: "PUT",
        body: JSON.stringify({
          status: req.status,
          justification,
          reviewerName: user.name,
          reviewerId: user.id
        })
      }).catch(() => {});
    }

    document.querySelector(".sigpra-modal-backdrop")?.remove();
    toast(`Solicitud #${req.id} ${isReturn ? 'DEVUELTA para corrección' : 'RECHAZADA'}.`);
    render();
    return;
  }
  if (action.dataset.action === "director-filter") {
    directorFilter = action.dataset.filter || "ALL";
    render();
    return;
  }
  if (action.dataset.action === "reset-assignment-workflow") {
    const form = action.closest('[data-submit="assignment"]');
    form.elements.studentId.value = "";
    form.elements.placeId.value = "";
    form.elements.teacherId.value = "";
    form.elements.reassignmentReason.value = "";
    updateAssignmentWorkflow(form, "studentId");
    form.elements.studentId.focus();
    return;
  }

  if (action.dataset.action === "logout") {
    saveSession(null);
    render();
  }
  if (action.dataset.action === "close-modal") {
    document.querySelector(".sigpra-modal-backdrop")?.remove();
  }
  if (action.dataset.action === "reset-demo") {
    data = structuredClone(seedData);
    saveData();
    toast("Datos demo restaurados.");
    render();
  }
  if (action.dataset.action === "export-json") exportJson();
  if (action.dataset.action === "export-csv") exportCsv();
  if (action.dataset.action === "export-print") {
    audit(`Preparo impresion PDF del consolidado (${JSON.stringify(reportFilters)})`, "REPORTE");
    saveData();
    window.print();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") document.querySelector(".sigpra-modal-backdrop")?.remove();
});

initializeApi();


function renderRequestStepper(status, hasAssignment) {
  const isDraft = status === "BORRADOR";
  const isPending = status === "PENDIENTE_REVISION";
  const isApproved = status === "APROBADA";
  const isReturned = status === "DEVUELTA";
  const isRejected = status === "RECHAZADA";

  // Step 1: Radicación
  const step1Class = (!status || isDraft) ? "active" : "completed";
  const step1Icon = (!status || isDraft) ? "📝" : "✓";
  const step1Desc = (!status || isDraft) ? "Diligenciando" : "Soportes cargados";

  // Step 2: Dictamen Director
  let step2Class = "";
  let step2Icon = "⚖️";
  let step2Desc = "En espera";
  if (isPending) {
    step2Class = "in-review active";
    step2Icon = "⏳";
    step2Desc = "En revisión";
  } else if (isApproved) {
    step2Class = "completed";
    step2Icon = "✓";
    step2Desc = "Aprobado (Habilitado)";
  } else if (isReturned) {
    step2Class = "returned";
    step2Icon = "⚠";
    step2Desc = "Devuelto p/ corrección";
  } else if (isRejected) {
    step2Class = "returned";
    step2Icon = "✕";
    step2Desc = "Rechazado";
  }

  // Step 3: Asignación
  let step3Class = "";
  let step3Icon = "🏫";
  let step3Desc = "Pendiente plaza";
  if (hasAssignment) {
    step3Class = "completed";
    step3Icon = "✓";
    step3Desc = "Plaza y tutor asignados";
  } else if (isApproved) {
    step3Class = "active";
    step3Icon = "🔄";
    step3Desc = "En asignación por Coord.";
  }

  // Step 4: En Ejecución
  let step4Class = "";
  let step4Icon = "⏱️";
  let step4Desc = "Pendiente inicio";
  if (hasAssignment) {
    step4Class = "active";
    step4Icon = "🚀";
    step4Desc = "Bitácoras en curso";
  }

  return `
    <div class="sigpra-stepper-box mb-4">
      <div class="small fw-bold text-uppercase text-muted mb-2 text-center">Ruta del Trámite de Práctica Pedagógica (CU-08)</div>
      <div class="sigpra-stepper">
        <div class="sigpra-step ${step1Class}">
          <div class="sigpra-step-bubble">${step1Icon}</div>
          <div class="sigpra-step-title">1. Radicación</div>
          <div class="sigpra-step-desc">${step1Desc}</div>
        </div>
        <div class="sigpra-step ${step2Class}">
          <div class="sigpra-step-bubble">${step2Icon}</div>
          <div class="sigpra-step-title">2. Dirección</div>
          <div class="sigpra-step-desc">${step2Desc}</div>
        </div>
        <div class="sigpra-step ${step3Class}">
          <div class="sigpra-step-bubble">${step3Icon}</div>
          <div class="sigpra-step-title">3. Asignación</div>
          <div class="sigpra-step-desc">${step3Desc}</div>
        </div>
        <div class="sigpra-step ${step4Class}">
          <div class="sigpra-step-bubble">${step4Icon}</div>
          <div class="sigpra-step-title">4. En Ejecución</div>
          <div class="sigpra-step-desc">${step4Desc}</div>
        </div>
      </div>
    </div>
  `;
}

function openDocPreviewModal(studentName, docType, filename) {
  document.querySelector(".sigpra-modal-backdrop")?.remove();
  const timestamp = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const hash = Array.from(filename + studentName).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0x12345678).toString(16).toUpperCase();

  const backdrop = document.createElement("div");
  backdrop.className = "sigpra-modal-backdrop";
  backdrop.innerHTML = `
    <div class="sigpra-modal" style="max-width: 650px;">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
        <div class="d-flex align-items-center gap-2">
          <span class="fs-4">📄</span>
          <h3 class="mb-0 fw-bold" style="font-size: 1.15rem; color: #004b87;">Visor de Soporte Digital — SIGPRA</h3>
        </div>
        <button class="btn-close" type="button" data-action="close-modal" aria-label="Cerrar"></button>
      </div>

      <div class="doc-modal-paper my-2">
        <div class="doc-modal-watermark">EXPEDIENTE VERIFICADO</div>
        <div class="text-center border-bottom pb-3 mb-3">
          <div style="font-size: 0.85rem; font-weight: 700; color: #004b87; letter-spacing: 1px;">UNIVERSIDAD DE INVESTIGACIÓN Y DESARROLLO — UDI</div>
          <div style="font-size: 0.75rem; color: #64748b;">FACULTAD DE INGENIERÍAS · PROGRAMA DE INGENIERÍA DE SISTEMAS</div>
          <div class="badge bg-success-subtle text-success border border-success-subtle mt-2 px-3 py-1">
            ✓ Documento Oficial Radicado en Convocatoria
          </div>
        </div>

        <div class="mb-3">
          <h4 style="font-size: 1.05rem; font-weight: 700; color: #1e293b;" class="mb-1">${escapeHtml(docType)}</h4>
          <p class="small text-muted mb-2">Archivo digital: <code>${escapeHtml(filename)}</code></p>
        </div>

        <div class="bg-light p-3 rounded small mb-3 border">
          <div class="row g-2">
            <div class="col-sm-6"><strong>Estudiante:</strong> ${escapeHtml(studentName)}</div>
            <div class="col-sm-6"><strong>Fecha Radicación:</strong> ${timestamp}</div>
            <div class="col-sm-6"><strong>Tipo MIME:</strong> application/pdf</div>
            <div class="col-sm-6"><strong>Firma SHA-256:</strong> <span class="text-primary font-monospace">${hash}4E8B</span></div>
          </div>
        </div>

        <div class="p-3 border rounded text-center bg-white shadow-sm" style="min-height: 120px; display: grid; place-items: center;">
          <div>
            <div class="fs-1 text-primary mb-1">📋</div>
            <div class="fw-bold small text-dark">${escapeHtml(docType)} Digitalizado</div>
            <div class="text-muted" style="font-size: 0.75rem;">Verificado por el subsistema de radicación CU-08 conforme al Decreto 1075 de 2015.</div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
        <span class="small text-muted">ID de auditoría: SIGPRA-DOC-${hash}</span>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary btn-sm" type="button" onclick="toast('Descargando copia local de ' + '${escapeHtml(filename)}', 'info')">
            ⬇️ Descargar Copia
          </button>
          <button class="btn btn-secondary btn-sm" type="button" data-action="close-modal">Cerrar</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
}


function renderStudentRequest(user) {
  const publishedPeriods = (data.periods || []).filter((period) => period.status === "PUBLICADO");
  const activePeriod = publishedPeriods[0] || (data.periods || [])[0];

  if (!publishedPeriods.length) {
    return `
      <section class="stack">
        <article class="card full">
          <h2>Convocatoria de practicas</h2>
          <div class="alert alert-warning mb-0" role="alert">
            <h5 class="alert-heading">⚠️ No hay convocatorias abiertas</h5>
            <p class="mb-0">En este momento no existen periodos de practica en estado PUBLICADO . Comunícate con la coordinación académica para más información.</p>
          </div>
        </article>
      </section>
    `;
  }

  const existingRequest = (data.requests || []).find(
    (req) => req.studentId === user.id && req.periodId === activePeriod.id
  );

  // Si no tiene solicitud previa, la pestaña por defecto es el formulario
  const currentTab = (!existingRequest) ? "form" : studentRequestTab;

  const isApproved = existingRequest?.status === "APROBADA";
  const isReturned = existingRequest?.status === "DEVUELTA";
  const isPending = existingRequest?.status === "PENDIENTE_REVISION";
  const isDraft = existingRequest?.status === "BORRADOR";

  const defaultLevel = existingRequest?.level || activePeriod.level || "VIII semestre";
  const defaultModality = existingRequest?.modality || "Convenio institucional";
  const defaultComments = existingRequest?.comments || "";

  const hasAssignment = (data.assignments || []).some(a => a.studentId === user.id && a.status === "ACTIVA");

  return `
    <section class="stack">
      ${renderRequestStepper(existingRequest?.status, hasAssignment)}
      <article class="card full">
        <!-- Navegación de pestañas: Estado vs Formulario -->
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 border-bottom pb-2">
          <ul class="nav nav-pills gap-2" role="tablist">
            ${existingRequest ? `
              <li class="nav-item">
                <button class="nav-link ${currentTab === 'status' ? 'active' : 'btn-outline-primary'}" data-action="switch-request-tab" data-tab="status">
                  📋 Mi Estado de Radicación (${existingRequest.status})
                </button>
              </li>
            ` : ''}
            <li class="nav-item">
              <button class="nav-link ${currentTab === 'form' ? 'active' : 'btn-outline-primary'}" data-action="switch-request-tab" data-tab="form">
                📝 ${existingRequest ? 'Diligenciar / Nueva Solicitud (Formulario)' : 'Diligenciar Formulario de Solicitud '}
              </button>
            </li>
          </ul>

          <div>
            ${existingRequest ? `
              <span class="badge ${isApproved ? 'bg-success' : isPending ? 'bg-warning text-dark' : isReturned ? 'bg-danger' : 'bg-secondary'} px-3 py-2 fs-6">
                ${escapeHtml(existingRequest.status)}
              </span>
            ` : '<span class="badge bg-primary px-3 py-2 fs-6">NUEVA SOLICITUD</span>'}
          </div>
        </div>

        ${currentTab === 'status' && existingRequest ? `
          <!-- VISTA 1: RESUMEN DE ESTADO RADICADO -->
          <div>
            <h2 class="mb-1">Estado de tu solicitud de practica </h2>
            <p class="muted mb-3">Periodo academico: <strong>${escapeHtml(activePeriod.program)} - ${escapeHtml(activePeriod.level)} (${activePeriod.year}-${activePeriod.semester})</strong></p>

            ${isApproved ? `
              <div class="alert alert-success d-flex align-items-center gap-3" role="alert">
                <span class="fs-2">🎉</span>
                <div>
                  <h5 class="alert-heading mb-1">¡Solicitud Aprobada y Estudiante Habilitado!</h5>
                  <p class="mb-0">Tu solicitud formal fue evaluada y aprobada por la Direccion de Programa. Cumples con todos los prerrequisitos y estas habilitado para asignacion de plaza y docente asesor.</p>
                  <small class="text-muted">Aprobada el: ${escapeHtml(existingRequest.reviewedAt || existingRequest.updatedAt)} | Observacion: "${escapeHtml(existingRequest.justification || 'Cumple con totalidad de créditos y documentación verificada.')}"</small>${hasAssignment ? `
                  <div class="mt-3"><button class="btn btn-sm btn-success fw-bold shadow-sm" type="button" data-action="open-official-letter" data-id="${data.assignments.find(a => a.studentId === user.id)?.id || 1}">📄 Ver / Imprimir Carta de Presentación Oficial UDI</button></div>` : ""}
                </div>
              </div>
            ` : isPending ? `
              <div class="alert alert-info d-flex align-items-center gap-3" role="alert">
                <span class="fs-2">⏳</span>
                <div>
                  <h5 class="alert-heading mb-1">Solicitud en revision por el Director de Programa</h5>
                  <p class="mb-0">Tu solicitud fue radicada exitosamente el <strong>${escapeHtml(existingRequest.submittedAt || existingRequest.updatedAt)}</strong>. Actualmente el Director se encuentra validando tus soportes academicos y de seguridad social.</p>
                </div>
              </div>
            ` : isReturned ? `
              <div class="alert alert-danger d-flex align-items-center gap-3" role="alert">
                <span class="fs-2">⚠️</span>
                <div>
                  <h5 class="alert-heading mb-1">Solicitud devuelta para correccion por el Director:</h5>
                  <p class="mb-0 fw-bold">"${escapeHtml(existingRequest.justification || 'Ajustar soportes')}"</p>
                  <button class="btn btn-sm btn-outline-danger mt-2" data-action="switch-request-tab" data-tab="form">Ir al formulario para corregir</button>
                </div>
              </div>
            ` : `
              <div class="alert alert-secondary d-flex align-items-center gap-3" role="alert">
                <span class="fs-2">💾</span>
                <div>
                  <h5 class="alert-heading mb-1">Borrador guardado</h5>
                  <p class="mb-0">Tienes un borrador pendiente por completar y radicar.</p>
                  <button class="btn btn-sm btn-primary mt-2" data-action="switch-request-tab" data-tab="form">Continuar diligenciando formulario</button>
                </div>
              </div>
            `}

            <div class="card p-3 bg-light border-0 mt-3">
              <h5 class="fw-bold mb-3">Detalle del tramite radicado</h5>
              <div class="row g-3">
                <div class="col-md-4">
                  <span class="text-muted d-block small">Nivel de practica:</span>
                  <strong>${escapeHtml(existingRequest.level)}</strong>
                </div>
                <div class="col-md-4">
                  <span class="text-muted d-block small">Modalidad:</span>
                  <strong>${escapeHtml(existingRequest.modality)}</strong>
                </div>
                <div class="col-md-4">
                  <span class="text-muted d-block small">Plaza / Institucion:</span>
                  <strong>${escapeHtml(existingRequest.placeId ? (data.places.find(p=>p.id===existingRequest.placeId)?.tutor || 'Convenio institucional') : (existingRequest.suggestedCompany || 'Por asignar'))}</strong>
                </div>
              </div>

              <hr class="my-3" />

              <h6 class="fw-bold mb-2">Documentacion de soporte adjunta (Prerrequisitos)</h6>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-secondary p-2">📄 Certificado de matricula: ${escapeHtml(existingRequest.documents?.matricula?.name || 'matricula.pdf')}</span>
                <span class="badge bg-secondary p-2">📄 EPS / ARL vigente: ${escapeHtml(existingRequest.documents?.epsArl?.name || 'eps_arl.pdf')}</span>
                <span class="badge bg-secondary p-2">📄 Paz y salvo academico: ${escapeHtml(existingRequest.documents?.pazYSalvo?.name || 'paz_y_salvo.pdf')}</span>
              </div>

              ${existingRequest.comments ? `
                <div class="mt-3">
                  <span class="text-muted d-block small">Observaciones adicionales:</span>
                  <p class="mb-0 fst-italic">"${escapeHtml(existingRequest.comments)}"</p>
                </div>
              ` : ''}

              <div class="mt-4 pt-3 border-top d-flex justify-content-end">
                <button class="btn btn-outline-primary" data-action="switch-request-tab" data-tab="form">
                  ✏️ Diligenciar / Modificar formulario de solicitud
                </button>
              </div>
            </div>
          </div>
        ` : `
          <!-- VISTA 2: FORMULARIO INTERACTIVO POR ETAPAS PARA LLENAR INFORMACION -->
          <div>
            <div class="mb-4">
              <h2 class="mb-1">Formulario de Solicitud de Practica Academica </h2>
              <p class="muted mb-0">Diligencia la informacion requerida en cada una de las 4 etapas y adjunta tus soportes digitales para habilitar tu practica.</p>
            </div>

            ${isReturned ? `
              <div class="alert alert-danger d-flex align-items-center gap-3 mb-4" role="alert">
                <span class="fs-2">⚠️</span>
                <div>
                  <h5 class="alert-heading mb-1">Motivo de devolucion registrado por el Director:</h5>
                  <p class="mb-0 fw-bold">"${escapeHtml(existingRequest.justification || 'Ajustar documentos')}"</p>
                  <small>Por favor realiza las correcciones solicitadas en las etapas a continuacion y vuelve a enviar.</small>
                </div>
              </div>
            ` : ''}

            <form class="form-grid workflow-form" id="student-request-form">
              <input type="hidden" name="periodId" value="${activePeriod.id}" />

              <!-- Etapa 1: Periodo y Nivel -->
              <article class="card full mb-3">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="badge bg-primary fs-6 rounded-pill">Etapa 1</span>
                  <h3 class="mb-0 fs-5">Periodo y Nivel Academico</h3>
                </div>
                <p class="muted small mb-3">Verifica que el periodo activo corresponda a tu semestre y programa de formacion.</p>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold small">Periodo academico activo</label>
                    <input type="text" class="form-control bg-light" readonly value="${escapeHtml(activePeriod.program)} - ${activePeriod.year}-${activePeriod.semester}" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold small">Nivel de practica que vas a cursar *</label>
                    <select class="form-select" name="level" required>
                      <option value="${escapeHtml(activePeriod.level)}" ${defaultLevel === activePeriod.level ? 'selected' : ''}>${escapeHtml(activePeriod.level)}</option>
                      <option value="Practica pedagogica VIII" ${defaultLevel === 'Practica pedagogica VIII' ? 'selected' : ''}>Practica pedagogica VIII</option>
                      <option value="Practica profesional" ${defaultLevel === 'Practica profesional' ? 'selected' : ''}>Practica profesional</option>
                    </select>
                  </div>
                </div>
              </article>

              <!-- Etapa 2: Modalidad y Plaza -->
              <article class="card full mb-3">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="badge bg-primary fs-6 rounded-pill">Etapa 2</span>
                  <h3 class="mb-0 fs-5">Modalidad de Solicitud y Plaza de Interes</h3>
                </div>
                <p class="muted small mb-3">Indica si realizaras tu practica en los convenios gestionados por la UDI o mediante autogestion.</p>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold small">Modalidad de solicitud *</label>
                    <select class="form-select" name="modality" id="request-modality-select" required>
                      <option value="Convenio institucional" ${defaultModality === 'Convenio institucional' ? 'selected' : ''}>Convenio institucional (Plazas UDI)</option>
                      <option value="Practica autogestionada" ${defaultModality === 'Practica autogestionada' ? 'selected' : ''}>Practica autogestionada (Empresa propia)</option>
                      <option value="Validacion laboral" ${defaultModality === 'Validacion laboral' ? 'selected' : ''}>Validacion por experiencia laboral</option>
                    </select>
                  </div>
                  <div class="col-md-6" id="request-place-container">
                    <label class="form-label fw-bold small">Plaza de practica sugerida (opcional)</label>
                    <select class="form-select" name="placeId">
                      <option value="">-- Seleccionar plaza institucional --</option>
                      ${(data.places || []).map(p => {
                        const inst = data.institutions.find(i => i.id === data.agreements.find(a => a.id === p.agreementId)?.institutionId);
                        return `<option value="${p.id}" ${existingRequest?.placeId === p.id ? 'selected' : ''}>${escapeHtml(inst?.name || 'Institucion')} (${escapeHtml(p.shift)} - Cupos: ${p.offered - p.occupied})</option>`;
                      }).join('')}
                    </select>
                  </div>
                  <div class="col-md-6 d-none" id="request-company-container">
                    <label class="form-label fw-bold small">Nombre de la institucion o empresa propuesta</label>
                    <input type="text" class="form-control" name="suggestedCompany" placeholder="Ej: Colegio Bilingue..." value="${escapeHtml(existingRequest?.suggestedCompany || '')}" />
                  </div>
                </div>
              </article>

              <!-- Etapa 3: Soportes y Prerrequisitos -->
              <article class="card full mb-3">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="badge bg-primary fs-6 rounded-pill">Etapa 3</span>
                  <h3 class="mb-0 fs-5">Carga de Documentos de Soporte y Prerrequisitos</h3>
                </div>
                <p class="muted small mb-3">Formatos autorizados: PDF, JPG, PNG (Tamano maximo 10 MB). Todos los campos son validados para revision del Director.</p>
                <div class="row g-3">
                  <div class="col-md-4">
                    <div class="sigpra-dropzone has-file" data-field="fileMatricula" data-name="matricula">
                      <input type="file" class="d-none dropzone-input" name="fileMatricula" accept=".pdf,.png,.jpg" />
                      <span class="dropzone-icon">☁️</span>
                      <strong class="d-block small mb-1">1. Certificado de Matrícula *</strong>
                      <div class="small text-muted mb-2">Arrastra tu PDF aquí o haz clic</div>
                      <div class="dropzone-file-info">
                        <span class="badge bg-success-subtle text-success border border-success-subtle">✓ Soporte listo</span>
                        <span class="dropzone-file-name" title="${escapeHtml(existingRequest?.documents?.matricula?.name || 'matricula.pdf')}">${escapeHtml(existingRequest?.documents?.matricula?.name || 'matricula_' + user.name.toLowerCase().replace(/ /g, '_') + '.pdf')}</span>
                      </div>
                      <button type="button" class="btn btn-outline-secondary btn-sm mt-2 py-0 px-2 fs-7" onclick="this.closest('.sigpra-dropzone').querySelector('.dropzone-input').click()">Examinar archivo</button>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="sigpra-dropzone has-file" data-field="fileEps" data-name="epsArl">
                      <input type="file" class="d-none dropzone-input" name="fileEps" accept=".pdf,.png,.jpg" />
                      <span class="dropzone-icon">☁️</span>
                      <strong class="d-block small mb-1">2. Afiliación EPS / ARL *</strong>
                      <div class="small text-muted mb-2">Arrastra tu PDF aquí o haz clic</div>
                      <div class="dropzone-file-info">
                        <span class="badge bg-success-subtle text-success border border-success-subtle">✓ Soporte listo</span>
                        <span class="dropzone-file-name" title="${escapeHtml(existingRequest?.documents?.epsArl?.name || 'eps_arl.pdf')}">${escapeHtml(existingRequest?.documents?.epsArl?.name || 'eps_arl_' + user.name.toLowerCase().replace(/ /g, '_') + '.pdf')}</span>
                      </div>
                      <button type="button" class="btn btn-outline-secondary btn-sm mt-2 py-0 px-2 fs-7" onclick="this.closest('.sigpra-dropzone').querySelector('.dropzone-input').click()">Examinar archivo</button>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="sigpra-dropzone has-file" data-field="filePazYSalvo" data-name="pazYSalvo">
                      <input type="file" class="d-none dropzone-input" name="filePazYSalvo" accept=".pdf,.png,.jpg" />
                      <span class="dropzone-icon">☁️</span>
                      <strong class="d-block small mb-1">3. Paz y Salvo Académico *</strong>
                      <div class="small text-muted mb-2">Arrastra tu PDF aquí o haz clic</div>
                      <div class="dropzone-file-info">
                        <span class="badge bg-success-subtle text-success border border-success-subtle">✓ Soporte listo</span>
                        <span class="dropzone-file-name" title="${escapeHtml(existingRequest?.documents?.pazYSalvo?.name || 'paz_y_salvo.pdf')}">${escapeHtml(existingRequest?.documents?.pazYSalvo?.name || 'paz_y_salvo_' + user.name.toLowerCase().replace(/ /g, '_') + '.pdf')}</span>
                      </div>
                      <button type="button" class="btn btn-outline-secondary btn-sm mt-2 py-0 px-2 fs-7" onclick="this.closest('.sigpra-dropzone').querySelector('.dropzone-input').click()">Examinar archivo</button>
                    </div>
                  </div>
                </div>
              </article>

              <!-- Etapa 4: Observaciones y Radicacion -->
              <article class="card full mb-3">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="badge bg-primary fs-6 rounded-pill">Etapa 4</span>
                  <h3 class="mb-0 fs-5">Observaciones Adicionales y Radicacion</h3>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold">Comentarios o informacion complementaria para el Director de Programa</label>
                  <textarea class="form-control" name="comments" rows="2" placeholder="Escribe aqui cualquier observacion sobre tu disponibilidad, jornada o modalidad...">${escapeHtml(defaultComments)}</textarea>
                </div>

                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2 border-top">
                  ${existingRequest ? `
                    <button type="button" class="btn btn-outline-secondary" data-action="switch-request-tab" data-tab="status">
                      ← Volver a mi estado
                    </button>
                  ` : '<div></div>'}

                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-outline-secondary" data-action="save-request-draft">
                      💾 Guardar como borrador
                    </button>
                    <button type="button" class="btn btn-primary px-4 fw-bold shadow-sm" data-action="submit-student-request">
                      📤 Radicar Solicitud Formal
                    </button>
                  </div>
                </div>
              </article>
            </form>
          </div>
        `}
      </article>
    </section>
  `;
}


function renderDirectorRequests(user) {
  const requests = data.requests || [];
  const pending = requests.filter(r => r.status === "PENDIENTE_REVISION");
  const approved = requests.filter(r => r.status === "APROBADA");
  const returned = requests.filter(r => r.status === "DEVUELTA");
  const rejected = requests.filter(r => r.status === "RECHAZADA");

  return `
    <section class="stack">
      <!-- Tarjetas de metricas rapidas interactivas -->
      <div class="row g-3">
        <div class="col-6 col-md-3">
          <div class="card p-3 border-start border-4 border-warning shadow-sm ${directorStatusFilter === 'PENDIENTE_REVISION' ? 'ring-2 ring-warning' : ''}" data-status-filter="PENDIENTE_REVISION" style="cursor: pointer; transition: transform 0.15s ease;" title="Clic para filtrar pendientes" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <span class="text-muted small text-uppercase fw-bold">Pendientes de Revision</span>
            <div class="d-flex justify-content-between align-items-center mt-1">
              <h2 class="mb-0 text-warning">${pending.length}</h2>
              <span class="fs-4">⏳</span>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card p-3 border-start border-4 border-success shadow-sm ${directorStatusFilter === 'APROBADA' ? 'ring-2 ring-success' : ''}" data-status-filter="APROBADA" style="cursor: pointer; transition: transform 0.15s ease;" title="Clic para filtrar aprobadas" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <span class="text-muted small text-uppercase fw-bold">Aprobadas (Habilitados)</span>
            <div class="d-flex justify-content-between align-items-center mt-1">
              <h2 class="mb-0 text-success">${approved.length}</h2>
              <span class="fs-4">✅</span>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card p-3 border-start border-4 border-primary shadow-sm ${directorStatusFilter === 'DEVUELTA' ? 'ring-2 ring-primary' : ''}" data-status-filter="DEVUELTA" style="cursor: pointer; transition: transform 0.15s ease;" title="Clic para filtrar devueltas" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <span class="text-muted small text-uppercase fw-bold">Devueltas p/ correccion</span>
            <div class="d-flex justify-content-between align-items-center mt-1">
              <h2 class="mb-0 text-primary">${returned.length}</h2>
              <span class="fs-4">↩️</span>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card p-3 border-start border-4 border-danger shadow-sm ${directorStatusFilter === 'RECHAZADA' ? 'ring-2 ring-danger' : ''}" data-status-filter="RECHAZADA" style="cursor: pointer; transition: transform 0.15s ease;" title="Clic para filtrar rechazadas" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <span class="text-muted small text-uppercase fw-bold">Rechazadas</span>
            <div class="d-flex justify-content-between align-items-center mt-1">
              <h2 class="mb-0 text-danger">${rejected.length}</h2>
              <span class="fs-4">❌</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de solicitudes -->
      <article class="card full mt-3 shadow-sm">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <h2 class="mb-1">Bandeja de Solicitudes de Práctica Académica</h2>
            <p class="muted mb-0">Revisa la documentación adjunta de los estudiantes y evalúa su habilitación formal en el sistema.</p>
          </div>
          <div class="table-search-bar">
            <span class="text-muted">🔍</span>
            <input type="text" placeholder="Filtrar por estudiante, código o estado..." data-table-filter="#director-requests-table">
          </div>
        </div>

        <!-- Chips de Filtro Rápido por Estado Interactivos -->
        <div class="d-flex align-items-center gap-2 flex-wrap mb-3" id="director-status-chips">
          <span class="small text-muted fw-bold">Filtrar por:</span>
          <button class="btn btn-sm ${directorStatusFilter === 'ALL' ? 'btn-primary active text-white' : 'btn-outline-primary'} py-1 px-2" data-status-filter="ALL" style="font-size: 0.8rem;">Todos (${requests.length})</button>
          <button class="btn btn-sm ${directorStatusFilter === 'PENDIENTE_REVISION' ? 'btn-warning active text-dark fw-bold' : 'btn-outline-warning'} py-1 px-2" data-status-filter="PENDIENTE_REVISION" style="font-size: 0.8rem;">⏳ Pendientes (${pending.length})</button>
          <button class="btn btn-sm ${directorStatusFilter === 'APROBADA' ? 'btn-success active text-white fw-bold' : 'btn-outline-success'} py-1 px-2" data-status-filter="APROBADA" style="font-size: 0.8rem;">✅ Aprobadas (${approved.length})</button>
          <button class="btn btn-sm ${directorStatusFilter === 'DEVUELTA' ? 'btn-info active text-white fw-bold' : 'btn-outline-info'} py-1 px-2" data-status-filter="DEVUELTA" style="font-size: 0.8rem;">↩️ Devueltas (${returned.length})</button>
          <button class="btn btn-sm ${directorStatusFilter === 'RECHAZADA' ? 'btn-danger active text-white fw-bold' : 'btn-outline-danger'} py-1 px-2" data-status-filter="RECHAZADA" style="font-size: 0.8rem;">❌ Rechazadas (${rejected.length})</button>
        </div>

        <div class="table-wrap table-responsive">
          <table class="table table-hover align-middle" id="director-requests-table">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Estudiante</th>
                <th>Periodo / Nivel</th>
                <th>Modalidad</th>
                <th>Soportes Anexos</th>
                <th>Radicacion</th>
                <th>Estado</th>
                <th class="text-end">Accion</th>
              </tr>
            </thead>
            <tbody>
              ${studentUsers().filter(student => {
                const req = (data.requests || []).find(r => r.studentId === student.id);
                const status = req ? req.status : 'SIN_SOLICITUD';
                if (directorStatusFilter === 'ALL') return true;
                return status === directorStatusFilter;
              }).map(student => {
                const req = (data.requests || []).find(r => r.studentId === student.id);
                const period = req ? data.periods.find(p => p.id === req.periodId) : (data.periods || [])[0];
                const status = req ? req.status : 'SIN_SOLICITUD';
                const badgeMap = {
                  SIN_SOLICITUD: 'bg-light text-dark border',
                  BORRADOR: 'bg-secondary',
                  PENDIENTE_REVISION: 'bg-warning text-dark',
                  APROBADA: 'bg-success',
                  DEVUELTA: 'bg-primary',
                  RECHAZADA: 'bg-danger'
                };
                const badgeClass = badgeMap[status] || 'bg-secondary';
                const statusLabel = {
                  SIN_SOLICITUD: 'Sin solicitud formal',
                  BORRADOR: 'Borrador',
                  PENDIENTE_REVISION: 'Pendiente de revisión',
                  APROBADA: 'Aprobada (Habilitado)',
                  DEVUELTA: 'Devuelta',
                  RECHAZADA: 'Rechazada'
                }[status] || status;

                const isPending = req?.status === "PENDIENTE_REVISION";
                const isApproved = req?.status === "APROBADA";
                const isReturned = req?.status === "DEVUELTA";
                const isRejected = req?.status === "RECHAZADA";

                const actionButtonText = isPending && user.role === 'DIRECTOR'
                  ? '📝 Evaluar Solicitud'
                  : isApproved
                  ? '👁️ Ver Detalle (Aprobada)'
                  : isReturned
                  ? '👁️ Ver Observación'
                  : isRejected
                  ? '👁️ Ver Causal'
                  : '👁️ Ver Detalle';

                const buttonClass = isPending && user.role === 'DIRECTOR'
                  ? 'btn-primary fw-bold shadow-sm'
                  : isApproved
                  ? 'btn-outline-success'
                  : isReturned
                  ? 'btn-outline-info'
                  : isRejected
                  ? 'btn-outline-danger'
                  : 'btn-outline-secondary';

                return `
                  <tr data-status="${status}">
                    <td>${req ? '#' + req.id : '-'}</td>
                    <td>
                      <strong>${escapeHtml(student.name)}</strong>
                      <div class="text-muted small">${escapeHtml(student.code || student.email)} • Semestre ${student.semester || 8}</div>
                    </td>
                    <td>
                      <div>${escapeHtml(period?.program || 'Programa UDI')}</div>
                      <small class="text-muted">${escapeHtml(req?.level || period?.level || 'VIII semestre')}</small>
                    </td>
                    <td>${escapeHtml(req?.modality || 'No definida')}</td>
                    <td>
                      ${req ? `
                        <button class="btn btn-sm btn-link p-0 d-block text-start text-primary" style="font-size: 0.8rem; text-decoration: none;" type="button" data-action="preview-doc" data-student="${escapeHtml(student.name)}" data-doctype="Certificado de Matrícula" data-filename="${escapeHtml(req.documents?.matricula?.name || 'matricula.pdf')}">📄 Matrícula 👁️</button>
                        <button class="btn btn-sm btn-link p-0 d-block text-start text-primary" style="font-size: 0.8rem; text-decoration: none;" type="button" data-action="preview-doc" data-student="${escapeHtml(student.name)}" data-doctype="Afiliación EPS/ARL" data-filename="${escapeHtml(req.documents?.epsArl?.name || 'eps_arl.pdf')}">📄 EPS/ARL 👁️</button>
                        <button class="btn btn-sm btn-link p-0 d-block text-start text-primary" style="font-size: 0.8rem; text-decoration: none;" type="button" data-action="preview-doc" data-student="${escapeHtml(student.name)}" data-doctype="Paz y Salvo Académico" data-filename="${escapeHtml(req.documents?.pazYSalvo?.name || 'paz_y_salvo.pdf')}">📄 Paz y Salvo 👁️</button>
                      ` : '<span class="text-muted small fst-italic">Pendiente de anexar</span>'}
                    </td>
                    <td><small>${escapeHtml(req?.submittedAt || req?.updatedAt || 'No radicada')}</small></td>
                    <td><span class="badge ${badgeClass}">${escapeHtml(statusLabel)}</span></td>
                    <td class="text-end">
                      ${req ? `
                        <button class="btn btn-sm ${buttonClass}" data-action="open-review-modal" data-id="${req.id}">
                          ${actionButtonText}
                        </button>
                      ` : '<span class="text-muted small">Sin radicar</span>'}
                    </td>
                  </tr>
                `;
              }).join('') || `
                <tr>
                  <td colspan="8" class="text-center text-muted py-4">
                    No se encontraron solicitudes con el filtro seleccionado (<strong>${directorStatusFilter}</strong>).
                    <div class="mt-2"><button class="btn btn-sm btn-link" data-status-filter="ALL">Mostrar todas</button></div>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function openRequestReviewModal(requestId) {
  const req = (data.requests || []).find(r => r.id === Number(requestId));
  if (!req) return;
  const student = data.users.find(u => u.id === req.studentId);
  const period = data.periods.find(p => p.id === req.periodId);
  const currentUserObj = currentUser();
  const isDirector = currentUserObj?.role === "DIRECTOR";
  const isPending = req.status === "PENDIENTE_REVISION";

  const backdrop = document.createElement("div");
  backdrop.className = "sigpra-modal-backdrop";
  backdrop.innerHTML = `
    <div class="sigpra-modal" style="max-width: 750px;">
      <div class="sigpra-modal-header d-flex justify-content-between align-items-center">
        <div>
          <h3 class="mb-0">${isPending ? (isDirector ? "Evaluación de Solicitud #" + req.id : "Detalle de Solicitud #" + req.id) : "Expediente de Solicitud #" + req.id}</h3>
          <small class="text-muted">${isPending ? (isDirector ? "Panel de Decisión - Dirección de Programa" : "Modo Consulta - Coordinación de Prácticas") : "Dictamen Registrado en Firme - Trámite Académico CU-08"}</small>
        </div>
        <button class="btn-close" data-action="close-modal" aria-label="Cerrar"></button>
      </div>
      <div class="sigpra-modal-body">
        ${!isPending ? `
          <div class="alert ${req.status === 'APROBADA' ? 'alert-success border-success' : req.status === 'DEVUELTA' ? 'alert-info border-info' : 'alert-danger border-danger'} mb-3 shadow-sm">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="fs-4">${req.status === 'APROBADA' ? '✅' : req.status === 'DEVUELTA' ? '↩️' : '❌'}</span>
              <strong class="fs-6">${req.status === 'APROBADA' ? 'Solicitud Aprobada en Firme (Estudiante Habilitado para Asignación)' : req.status === 'DEVUELTA' ? 'Solicitud Devuelta para Corrección' : 'Solicitud Rechazada'}</strong>
            </div>
            <p class="mb-1 small"><strong>Concepto emitido por la Dirección de Programa:</strong> "${escapeHtml(req.justification || 'Verificación documental completada satisfactoriamente.')}"</p>
            <div class="small text-muted">
              Evaluada el: <strong>${escapeHtml(req.reviewedAt || req.updatedAt || 'Reciente')}</strong> &bull; Estado definitivo inmutable.
            </div>
          </div>
        ` : !isDirector ? `
          <div class="alert alert-info py-2 px-3 small mb-3 d-flex align-items-center gap-2" role="alert">
            <span class="fs-4">ℹ️</span>
            <div>
              <strong>Rol de Coordinación (Solo Consulta):</strong> La potestad de evaluar, aprobar o rechazar la solicitud formal de práctica corresponde exclusivamente a la <strong>Dirección de Programa</strong>. Una vez aprobada, el practicante quedará disponible en el módulo de Asignaciones.
            </div>
          </div>
        ` : ''}

        <div class="alert alert-light border mb-3">
          <div class="row g-2">
            <div class="col-md-6">
              <span class="text-muted small d-block">Estudiante practicante:</span>
              <strong>${escapeHtml(student?.name)}</strong> (${escapeHtml(student?.code || student?.email)})
            </div>
            <div class="col-md-6">
              <span class="text-muted small d-block">Periodo / Nivel:</span>
              <strong>${escapeHtml(period?.program)} - ${escapeHtml(req.level)}</strong>
            </div>
            <div class="col-md-6">
              <span class="text-muted small d-block">Modalidad de práctica:</span>
              <strong>${escapeHtml(req.modality)}</strong>
            </div>
            <div class="col-md-6">
              <span class="text-muted small d-block">Estado de la solicitud:</span>
              <span class="badge ${req.status === 'APROBADA' ? 'bg-success' : req.status === 'PENDIENTE_REVISION' ? 'bg-warning text-dark' : req.status === 'DEVUELTA' ? 'bg-info text-white' : 'bg-danger'} px-2 py-1">${escapeHtml(req.status)}</span>
            </div>
          </div>
        </div>

        <h5 class="fw-bold mb-2 fs-6">Verificación de soportes documentales (Prerrequisitos):</h5>
        <div class="list-group mb-3">
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>1. Certificado de Matrícula</strong>
              <div class="text-muted small">${escapeHtml(req.documents?.matricula?.name || 'matricula.pdf')}</div>
            </div>
            <button class="btn btn-outline-primary btn-sm py-1 px-2" data-action="preview-doc" data-student="${escapeHtml(student?.name)}" data-doctype="Certificado de Matrícula" data-filename="${escapeHtml(req.documents?.matricula?.name || 'matricula.pdf')}">👁️ Auditar</button>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>2. Afiliación EPS / ARL vigente</strong>
              <div class="text-muted small">${escapeHtml(req.documents?.epsArl?.name || 'eps_arl.pdf')}</div>
            </div>
            <button class="btn btn-outline-primary btn-sm py-1 px-2" data-action="preview-doc" data-student="${escapeHtml(student?.name)}" data-doctype="Afiliación EPS/ARL" data-filename="${escapeHtml(req.documents?.epsArl?.name || 'eps_arl.pdf')}">👁️ Auditar</button>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>3. Paz y Salvo Académico (Créditos aprobados)</strong>
              <div class="text-muted small">${escapeHtml(req.documents?.pazYSalvo?.name || 'paz_y_salvo.pdf')}</div>
            </div>
            <button class="btn btn-outline-primary btn-sm py-1 px-2" data-action="preview-doc" data-student="${escapeHtml(student?.name)}" data-doctype="Paz y Salvo Académico" data-filename="${escapeHtml(req.documents?.pazYSalvo?.name || 'paz_y_salvo.pdf')}">👁️ Auditar</button>
          </div>
        </div>

        ${isDirector && isPending ? `
          <div class="mb-3">
            <label class="form-label fw-bold">Observación / Justificación del Dictamen *</label>
            <textarea class="form-control" id="review-justification-input" rows="3" placeholder="Ingresa tus observaciones. (Obligatorio en caso de devolver para corrección o rechazar; opcional si se aprueba)...">${escapeHtml(req.justification || '')}</textarea>
            <div class="form-text">Al aprobar, el estudiante quedará habilitado de manera definitiva para la asignación de plaza y tutor.</div>
          </div>
        ` : ''}
      </div>

      <div class="sigpra-modal-footer d-flex justify-content-between flex-wrap gap-2">
        <button class="btn btn-secondary" data-action="close-modal">${isDirector && isPending ? "Cancelar" : "Cerrar"}</button>
        ${isDirector && isPending ? `
          <div class="d-flex gap-2">
            <button class="btn btn-danger" data-action="reject-request-confirm" data-id="${req.id}">
              ❌ Rechazar
            </button>
            <button class="btn btn-warning text-dark" data-action="return-request-confirm" data-id="${req.id}">
              ↩️ Devolver para corrección
            </button>
            <button class="btn btn-success fw-bold px-3 shadow-sm" data-action="approve-request-confirm" data-id="${req.id}">
              ✅ Aprobar Solicitud
            </button>
          </div>
        ` : `
          <span class="small text-muted py-1">Dictamen registrado formalmente &bull; Solo lectura</span>
        `}
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
}

function getNotificationsForUser(user) {
  const list = [];
  const reqs = data.requests || [];
  const asgs = data.assignments || [];

  if (user.role === "ESTUDIANTE") {
    const myReq = reqs.find(r => r.studentId === user.id);
    if (myReq) {
      if (myReq.status === "APROBADA") {
        list.push({
          id: "notif-req-appr-" + myReq.id,
          icon: "🎉",
          title: "¡Solicitud de Práctica Aprobada!",
          desc: "La Dirección de Programa aprobó tu solicitud formal. Quedas habilitado para asignación.",
          time: myReq.reviewedAt || "Reciente",
          actionView: "student-request"
        });
      } else if (myReq.status === "DEVUELTA") {
        list.push({
          id: "notif-req-ret-" + myReq.id,
          icon: "⚠️",
          title: "Solicitud Devuelta para Corrección",
          desc: myReq.justification || "Revisa tus documentos de soporte.",
          time: myReq.reviewedAt || "Urgente",
          actionView: "student-request"
        });
      } else if (myReq.status === "PENDIENTE_REVISION") {
        list.push({
          id: "notif-req-pend-" + myReq.id,
          icon: "⏳",
          title: "Solicitud en Revisión",
          desc: "Tu solicitud está en estudio por la Dirección de Programa.",
          time: myReq.submittedAt || "En espera",
          actionView: "student-request"
        });
      }
    }

    const myAsg = asgs.find(a => a.studentId === user.id && a.status === "ACTIVA");
    if (myAsg) {
      const inst = data.institutions.find(i => i.id === data.agreements.find(ag => ag.id === data.places.find(p => p.id === myAsg.placeId)?.agreementId)?.institutionId);
      list.push({
        id: "notif-asg-" + myAsg.id,
        icon: "🏢",
        title: "Plaza de Práctica Asignada",
        desc: "Práctica activa en " + (inst?.name || "Institución asignada") + ".",
        time: "Periodo 2026-2",
        actionView: "student-progress"
      });
    }
  } else if (user.role === "DIRECTOR") {
    const pending = reqs.filter(r => r.status === "PENDIENTE_REVISION");
    if (pending.length > 0) {
      list.push({
        id: "notif-dir-pend",
        icon: "📋",
        title: pending.length + " Solicitud(es) por Dictaminar",
        desc: "Estudiantes practicantes esperando evaluación formal (CU-08).",
        time: "Pendiente",
        actionView: "director-requests"
      });
    }
  } else if (user.role === "COORDINADOR") {
    const published = (data.periods || []).filter(p => p.status === "PUBLICADO");
    list.push({
      id: "notif-coord-period",
      icon: "🎓",
      title: "Convocatoria 2026-2 Activa",
      desc: published.length + " periodo(s) activo(s) para vinculación y seguimiento.",
      time: "Vigente",
      actionView: "periods"
    });
  } else if (user.role === "DOCENTE_ASESOR") {
    const pendingActs = (data.activities || []).filter(a => a.status === "PENDIENTE");
    if (pendingActs.length > 0) {
      list.push({
        id: "notif-doc-acts",
        icon: "📝",
        title: pendingActs.length + " Actividad(es) por Validar",
        desc: "Practicantes han registrado evidencias para tu revisión.",
        time: "Revisión",
        actionView: "teacher-validations"
      });
    }
  }

  return list;
}

function renderNotificationBell(user) {
  const notifs = getNotificationsForUser(user);
  const unreadCount = notifs.filter(n => !readNotifIds.has(n.id)).length;

  return `
    <div class="notification-wrapper">
      <button class="notification-bell-btn shadow-sm" type="button" data-action="toggle-notifications" aria-label="Centro de Notificaciones" title="Centro de Notificaciones">
        🔔 ${unreadCount > 0 ? `<span class="notification-badge">${unreadCount}</span>` : ''}
      </button>

      ${notificationsOpen ? `
        <div class="notification-dropdown" id="notification-dropdown-menu">
          <div class="notification-header">
            <strong class="small text-dark">🔔 Notificaciones (${notifs.length})</strong>
            ${unreadCount > 0 ? `
              <button class="btn btn-link p-0 text-decoration-none small text-primary" data-action="mark-all-notifications-read">
                Marcar leídas
              </button>
            ` : '<span class="small text-muted">Al día</span>'}
          </div>
          <ul class="notification-list">
            ${notifs.length === 0 ? `
              <li class="p-3 text-center text-muted small">No tienes notificaciones pendientes.</li>
            ` : notifs.map(n => `
              <li class="notification-item ${readNotifIds.has(n.id) ? '' : 'unread'}" data-action="click-notification" data-id="${n.id}" data-view="${n.actionView}">
                <span class="notif-icon">${n.icon}</span>
                <div class="w-100">
                  <div class="notif-title">${escapeHtml(n.title)}</div>
                  <div class="notif-desc">${escapeHtml(n.desc)}</div>
                  <div class="notif-time">${escapeHtml(n.time)}</div>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}

function openOfficialPresentationLetterModal(assignmentId) {
  document.querySelector(".sigpra-modal-backdrop")?.remove();
  const assignment = (data.assignments || []).find(a => a.id === Number(assignmentId)) || (data.assignments || [])[0];
  if (!assignment) {
    toast("No se encontró registro de asignación formal para emitir la carta.", "warning");
    return;
  }

  const student = data.users.find(u => u.id === assignment.studentId);
  const teacher = data.users.find(u => u.id === assignment.teacherId);
  const place = data.places.find(p => p.id === assignment.placeId);
  const agreement = data.agreements.find(a => a.id === place?.agreementId);
  const institution = data.institutions.find(i => i.id === agreement?.institutionId) || { name: "Institución Aliada UDI" };
  const period = data.periods.find(p => p.id === assignment.periodId) || data.periods[0];

  const todayStr = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const radicadoId = "UDI-PRAC-" + period.year + "-" + String(assignment.id).padStart(4, '0');

  const backdrop = document.createElement("div");
  backdrop.className = "sigpra-modal-backdrop";
  backdrop.innerHTML = `
    <div class="sigpra-modal official-letter-modal">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
        <div class="d-flex align-items-center gap-2">
          <span class="fs-4">📜</span>
          <h3 class="mb-0 fw-bold fs-5 text-primary">Carta Oficial de Presentación del Practicante</h3>
        </div>
        <button class="btn-close" type="button" data-action="close-modal" aria-label="Cerrar"></button>
      </div>

      <div class="official-letter-paper" id="printable-official-letter">
        <div class="official-letter-header">
          <div class="d-flex align-items-center gap-3">
            <img src="/assets/logo-sigpra.svg" alt="UDI" style="height: 48px;" onerror="this.style.display='none'" />
            <div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #004b87; letter-spacing: 0.5px;">UNIVERSIDAD DE INVESTIGACIÓN Y DESARROLLO — UDI</div>
              <div style="font-size: 0.78rem; color: #475569; font-weight: 600;">FACULTAD DE INGENIERÍAS Y CIENCIAS BÁSICAS</div>
              <div style="font-size: 0.72rem; color: #64748b;">COORDINACIÓN DE PRÁCTICAS ACADÉMICAS Y PROFESIONALES (SIGPRA)</div>
            </div>
          </div>
          <div class="text-end">
            <span class="badge bg-light text-dark border font-monospace">${radicadoId}</span>
          </div>
        </div>

        <div class="official-letter-body">
          <p class="mb-3 text-end small text-muted">Bucaramanga, ${todayStr}</p>

          <p class="mb-3">
            Señores:<br />
            <strong class="text-dark">${escapeHtml(institution.name)}</strong><br />
            <span class="text-muted small">Atención: Dirección de Gestión Humana / Coordinación de Prácticas</span><br />
            Ciudad
          </p>

          <p class="mb-3">
            <strong>Asunto:</strong> Presentación formal del estudiante en Práctica Académica Formativa
          </p>

          <p>
            Cordial saludo:
          </p>

          <p>
            Por medio de la presente, la <strong>Universidad de Investigación y Desarrollo — UDI</strong> se complace en presentar de manera formal al(la) estudiante:
          </p>

          <div class="p-3 my-3 bg-light rounded border">
            <div class="row g-2 small">
              <div class="col-sm-6"><strong>Estudiante:</strong> ${escapeHtml(student?.name)}</div>
              <div class="col-sm-6"><strong>Código Estudiantil:</strong> ${escapeHtml(student?.code || 'UDI-2026-001')}</div>
              <div class="col-sm-6"><strong>Programa Formativo:</strong> ${escapeHtml(period.program)}</div>
              <div class="col-sm-6"><strong>Nivel de Práctica:</strong> ${escapeHtml(period.level || 'VIII semestre')}</div>
            </div>
          </div>

          <p>
            El(La) estudiante ha culminado a satisfacción los créditos académicos prerrequisito y cuenta con la respectiva cobertura de afiliación en salud y riesgos laborales (ARL), encontrándose plenamente habilitado(a) por la Dirección de Programa para desarrollar sus labores en el periodo académico <strong>${period.year}-${period.semester}</strong>, con una intensidad mínima de <strong>${period.minHours || 320} horas formativas</strong>.
          </p>

          <p>
            Para el debido acompañamiento, concertación del plan de trabajo y evaluación del desempeño institucional, la Universidad ha asignado como <strong>Docente Asesor</strong> al(la) profesor(a) <strong>${escapeHtml(teacher?.name || 'Asignado')}</strong> (${escapeHtml(teacher?.email || 'docente@udi.edu.co')}).
          </p>

          <p>
            Agradecemos de antemano el valioso respaldo que su entidad brinda a nuestros futuros profesionales.
          </p>

          <div class="official-letter-signatures">
            <div>
              <div class="letter-signature-line">
                <strong>Dirección de Programa Académico</strong><br />
                Universidad de Investigación y Desarrollo - UDI
              </div>
            </div>
            <div>
              <div class="letter-signature-line">
                <strong>${escapeHtml(teacher?.name || 'Docente Asesor')}</strong><br />
                Tutor Académico Asignado
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="letter-qr-stamp">
              <span class="fs-4">🔐</span>
              <div>
                <strong>Expediente Oficial Verificado</strong><br />
                <span class="text-muted">Ley 30 de 1992 · Decreto 1075 de 2015</span>
              </div>
            </div>
            <small class="text-muted font-monospace">Hash de Validación: ${radicadoId}-AUTH</small>
          </div>
        </div>
      </div>

      <div class="sigpra-modal-footer d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
        <span class="small text-muted">Documento oficial generado por SIGPRA UDI</span>
        <div class="d-flex gap-2">
          <button class="btn btn-primary btn-sm fw-bold shadow-sm" type="button" onclick="window.print()">
            🖨️ Imprimir Carta / Guardar PDF
          </button>
          <button class="btn btn-secondary btn-sm" type="button" data-action="close-modal">Cerrar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
}

function setupDropzones() {
  document.querySelectorAll(".sigpra-dropzone").forEach(dropzone => {
    const input = dropzone.querySelector(".dropzone-input");
    if (!input) return;

    ["dragenter", "dragover"].forEach(eventName => {
      dropzone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("drag-over");
      });
    });

    ["dragleave", "drop"].forEach(eventName => {
      dropzone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("drag-over");
      });
    });

    dropzone.addEventListener("drop", e => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        input.files = files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    dropzone.addEventListener("click", e => {
      if (e.target.tagName !== "BUTTON") {
        input.click();
      }
    });

    input.addEventListener("change", () => {
      const file = input.files[0];
      if (file) {
        const nameEl = dropzone.querySelector(".dropzone-file-name");
        if (nameEl) nameEl.textContent = file.name + " (" + (file.size / 1024).toFixed(0) + " KB)";
        dropzone.classList.add("has-file");
        toast("Archivo preparado: " + file.name, "success");
      }
    });
  });
}

function openNewTeacherModal() {
  document.querySelector(".sigpra-modal-backdrop")?.remove();
  const backdrop = document.createElement("div");
  backdrop.className = "sigpra-modal-backdrop";
  backdrop.innerHTML = `
    <div class="sigpra-modal" style="max-width: 520px;">
      <div class="sigpra-modal-header d-flex justify-content-between align-items-center">
        <h3 class="mb-0">👨‍🏫 Registrar Nuevo Docente Asesor</h3>
        <button class="btn-close" data-action="close-modal" aria-label="Cerrar"></button>
      </div>
      <form id="new-teacher-form" class="my-3">
        <div class="mb-3">
          <label class="form-label small fw-bold">Nombre completo del Docente Asesor *</label>
          <input type="text" class="form-control" name="name" placeholder="Ej: Dra. Claudia Patricia Peña" required />
        </div>
        <div class="mb-3">
          <label class="form-label small fw-bold">Correo electrónico institucional (@udi.edu.co) *</label>
          <input type="email" class="form-control" name="email" placeholder="docente@udi.edu.co" required />
        </div>
        <div class="mb-3">
          <label class="form-label small fw-bold">Área formativa o Especialidad</label>
          <input type="text" class="form-control" name="specialty" placeholder="Ej: Práctica Pedagógica, Redes, Software..." />
        </div>
        <div class="d-flex justify-content-end gap-2 pt-2 border-top">
          <button type="button" class="btn btn-secondary" data-action="close-modal">Cancelar</button>
          <button type="submit" class="btn btn-success fw-bold">Guardar Docente</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(backdrop);

  backdrop.querySelector("#new-teacher-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim().toLowerCase();
    const specialty = String(fd.get("specialty") || "").trim();

    if (!name || !email) {
      toast("El nombre y el correo son obligatorios.", "warning");
      return;
    }
    if (data.users.some(u => u.email.toLowerCase() === email)) {
      toast("Ya existe un usuario registrado con ese correo institucional.", "warning");
      return;
    }

    const nameParts = name.split(" ");
    const initials = nameParts.length >= 2 ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();

    const newTeacher = {
      id: nextId(data.users),
      name,
      email,
      password: "123456",
      role: "DOCENTE_ASESOR",
      initials,
      specialty: specialty || "Docente Asesor de Práctica"
    };

    data.users.push(newTeacher);
    audit(`Registro de nuevo docente asesor: ${name} (${email})`, "USUARIO");
    saveData();
    backdrop.remove();
    toast(`Docente asesor ${name} registrado exitosamente.`, "success");
    render();
  });
}
