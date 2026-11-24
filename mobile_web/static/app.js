(() => {
  "use strict";

  const PAGE_META = {
    home: { title: "Home", icon: "home" },
    stats: { title: "PC Stats", icon: "insights" },
    media: { title: "Mídia", icon: "music_note" },
    shortcuts: { title: "Atalhos", icon: "grid_view" },
    weather: { title: "Clima", icon: "wb_sunny" },
    calendar: { title: "Agenda", icon: "calendar_today" },
    network: { title: "Internet", icon: "wifi" },
    games: { title: "Jogos", icon: "sports_esports" },
    timer: { title: "Timer", icon: "timer" },
  };

  // Inline SVG paths (24x24 viewBox) so everything renders offline with 0 CDN requests.
  const ICONS = {
    spotify: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.627.627 0 0 1-.86.208c-2.355-1.439-5.32-1.764-8.812-.966a.625.625 0 1 1-.278-1.22c3.821-.873 7.098-.506 9.742 1.118a.626.626 0 0 1 .208.86zm1.224-2.721a.784.784 0 0 1-1.077.259c-2.696-1.657-6.805-2.137-9.993-1.169a.784.784 0 1 1-.456-1.5c3.64-1.106 8.18-.574 11.267 1.332a.784.784 0 0 1 .259 1.078zm.106-2.833C14.686 8.948 9.38 8.77 6.302 9.704a.94.94 0 1 1-.55-1.8c3.535-1.073 9.399-.867 13.14 1.355a.942.942 0 0 1-.976 1.61z",
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    insights: "M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9c-1.45 0-2.27 1.44-1.93 2.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55c1.07.33 2.51-.48 2.51-1.93 0-1.1-.9-2-2-2z",
    memory: "M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z",
    speed: "M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z",
    music_note: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
    event: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
    calendar_today: "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z",
    wb_sunny: "M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z",
    cloud: "M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z",
    grid_view: "M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z",
    apps: "M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z",
    wifi: "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z",
    computer: "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
    desktop_windows: "M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z",
    play_arrow: "M8 5v14l11-7z",
    pause: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
    skip_next: "M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z",
    skip_previous: "M6 6h2v12H6zm3.5 6l8.5 6V6z",
    volume_up: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
    volume_down: "M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z",
    volume_off: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z",
    mic: "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z",
    mic_off: "M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z",
    lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
    photo_camera: "M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z",
    screenshot_monitor: "M20 3H4c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h4v2h8v-2h4c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 14H4V5h16v12zM6.5 7.5H9V6H5v4h1.5V7.5zM19 12h-1.5v2.5H15V16h4v-4z",
    terminal: "M20 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4-4 4z",
    code: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    public: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    folder: "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z",
    keyboard: "M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z",
    power_settings_new: "M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z",
    schedule: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
    timer: "M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
    mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    chat: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z",
    sports_esports: "M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
    rocket_launch: "M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83L11.17 17zm6.48-2.19c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81l-.26-1.33zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12C4.42 15.34 5.17 15 6 15c1.66 0 3 1.34 3 3z",
    bolt: "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z",
    star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    favorite: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    refresh: "M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
    dark_mode: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
    headphones: "M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z",
    videocam: "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z",
    movie: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
    developer_board: "M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z",
    lan: "M13 22h8v-7h-3v-4h-5V9h3V2H8v7h3v2H6v4H3v7h8v-7H8v-2h8v2h-3v7z",
    shuffle: "M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
    repeat: "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z",
    fullscreen: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z",
  };

  function iconSvg(name) {
    const d = ICONS[name] || ICONS.apps;
    return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
  }

  function esc(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function fmtBytes(b) {
    if (!b || b < 1024) return `${b || 0} B`;
    const units = ["KB", "MB", "GB", "TB"];
    let v = b / 1024;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) {
      v /= 1024;
      i++;
    }
    return `${v.toFixed(v >= 100 ? 0 : 1)} ${units[i]}`;
  }

  function fmtRate(kbps) {
    if (kbps == null) return "--";
    if (kbps >= 1024) return `${(kbps / 1024).toFixed(1)} MB/s`;
    return `${Math.round(kbps)} KB/s`;
  }

  function wmoText(code) {
    if (code === 0) return "Céu limpo";
    if (code <= 3) return "Parcialmente nublado";
    if (code === 45 || code === 48) return "Nevoeiro";
    if (code >= 51 && code <= 57) return "Garoa";
    if (code >= 61 && code <= 67) return "Chuva";
    if (code >= 71 && code <= 77) return "Neve";
    if (code >= 80 && code <= 82) return "Pancadas de chuva";
    if (code >= 95) return "Tempestade";
    return "Nublado";
  }

  const state = {
    wsConnected: false,
    pcOnline: false,
    activePage: "home",
    pages: ["home", "stats", "media", "shortcuts", "weather", "calendar", "network", "timer"],
    layout: null,
    home: null,
    stats: null,
    statsHist: { cpu: [], gpu: [] },
    media: null,
    mediaUpdatedAt: 0,
    artById: {},
    latestArtUrl: "",
    tiles: [],
    tileOn: new Set(),
    events: [],
    eventsDays: 7,
    weather: null,
    net: null,
    steam: null,
    steamImgs: {},
    pcAsleep: false,
    wakeOverrideUntil: 0,
    timer: {
      totalSec: 5 * 60,
      remainSec: 5 * 60,
      running: false,
      lastTick: 0,
    },
  };

  const els = {
    navItems: document.getElementById("nav-items"),
    statusDot: document.getElementById("status-dot"),
    hdrTime: document.getElementById("hdr-time"),
    hdrDate: document.getElementById("hdr-date"),
    hdrPageTitle: document.getElementById("hdr-page-title"),
    hdrPcBadge: document.getElementById("hdr-pc-badge"),
    pageContainer: document.getElementById("page-container"),
    btnFullscreen: document.getElementById("btn-fullscreen"),
    sleepOverlay: document.getElementById("sleep-overlay"),
    sleepClockBox: document.getElementById("sleep-clock-box"),
    sleepTime: document.getElementById("sleep-time"),
    sleepDate: document.getElementById("sleep-date"),
    timerAlarm: document.getElementById("timer-alarm"),
    btnAlarmOk: document.getElementById("btn-alarm-ok"),
  };

  // Inject static utility icons
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = iconSvg(el.dataset.icon);
  });

  // Create page DOM containers once
  const pageEls = {};
  for (const key of Object.keys(PAGE_META)) {
    const sec = document.createElement("div");
    sec.className = "page";
    sec.id = `page-${key}`;
    els.pageContainer.appendChild(sec);
    pageEls[key] = sec;
  }

  let ws = null;
  let reconnectTimer = null;

  function sendCmd(obj) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(obj));
    }
  }

  function updateStatusUi() {
    if (!state.wsConnected) {
      els.statusDot.className = "status-dot offline";
      els.hdrPcBadge.className = "badge badge-offline";
      els.hdrPcBadge.textContent = "Desconectado";
    } else if (!state.pcOnline) {
      els.statusDot.className = "status-dot warn";
      els.hdrPcBadge.className = "badge badge-warn";
      els.hdrPcBadge.textContent = "PC offline";
    } else {
      els.statusDot.className = "status-dot online";
      els.hdrPcBadge.className = "badge badge-online";
      els.hdrPcBadge.textContent = "PC online";
    }
  }

  function computeVisiblePages() {
    let list = state.layout?.pages
      ? state.layout.pages.filter((p) => p in PAGE_META)
      : ["home", "stats", "media", "weather", "calendar", "timer", "network", "shortcuts"];

    if (!list.includes("home")) list.unshift("home");
    if (list.includes("games")) {
      const hasGames = state.steam && (state.steam.found || state.steam.playing || (state.steam.recent || []).length > 0);
      if (!hasGames) list = list.filter((p) => p !== "games");
    }
    state.pages = list;
    if (!state.pages.includes(state.activePage)) {
      state.activePage = "home";
    }
  }

  function renderNav() {
    computeVisiblePages();
    els.navItems.innerHTML = state.pages
      .map((p) => {
        const meta = PAGE_META[p];
        const active = p === state.activePage ? "active" : "";
        let badge = "";
        if (p === "timer" && (state.timer.running || state.timer.remainSec !== state.timer.totalSec)) {
          badge = `<span class="nav-badge">${fmtTime(state.timer.remainSec)}</span>`;
        }
        return `<button class="nav-btn ${active}" data-page="${p}" type="button" title="${esc(meta.title)}">
          <span class="nav-ico">${iconSvg(meta.icon)}</span>${badge}
        </button>`;
      })
      .join("");

    els.hdrPageTitle.textContent = PAGE_META[state.activePage]?.title || "Home";
    for (const [key, el] of Object.entries(pageEls)) {
      el.classList.toggle("active", key === state.activePage);
    }
  }

  els.navItems.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    switchPage(btn.dataset.page);
  });

  function switchPage(page) {
    if (!PAGE_META[page]) return;
    state.activePage = page;
    renderNav();
    renderActivePage();
  }

  // ---- Clock & Night / Sleep Mode ----
  function checkNightMode() {
    const lay = state.layout;
    if (!lay || lay.night_start == null || lay.night_end == null || lay.night_start < 0 || lay.night_end < 0) {
      return false;
    }
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const s = lay.night_start;
    const e = lay.night_end;
    return s < e ? mins >= s && mins < e : mins >= s || mins < e;
  }

  function updateSleepOverlay() {
    const now = Date.now();
    if (now < state.wakeOverrideUntil) {
      els.sleepOverlay.classList.add("hidden");
      return;
    }
    const night = checkNightMode();
    const sleepMode = state.layout?.pc_sleep || "clock";
    const nightStyle = state.layout?.night_style || "off";

    const shouldSleep = (state.pcAsleep && sleepMode !== "none") || night;
    if (!shouldSleep) {
      els.sleepOverlay.classList.add("hidden");
      return;
    }
    const style = night ? nightStyle : sleepMode;
    els.sleepClockBox.classList.toggle("off", style === "off");
    els.sleepOverlay.classList.remove("hidden");
  }

  els.sleepOverlay.addEventListener("click", () => {
    state.wakeOverrideUntil = Date.now() + 60_000;
    updateSleepOverlay();
  });

  function tickClock() {
    const now = new Date();
    const hhmm = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
    els.hdrTime.textContent = hhmm;
    els.hdrDate.textContent = dateStr;
    els.sleepTime.textContent = hhmm;
    els.sleepDate.textContent = dateStr;
    updateSleepOverlay();

    // Update running media timeline smoothly every second
    if (state.media?.active && state.media.playing && state.activePage === "media") {
      const slider = pageEls.media.querySelector("#media-seek");
      const posLbl = pageEls.media.querySelector("#media-pos");
      if (slider && posLbl) {
        const cur = currentMediaPos();
        posLbl.textContent = fmtTime(cur);
        if (!slider.matches(":active")) slider.value = Math.floor(cur);
      }
    }

    // Update Timer
    if (state.timer.running) {
      const elapsed = Math.floor((Date.now() - state.timer.lastTick) / 1000);
      if (elapsed >= 1) {
        state.timer.lastTick += elapsed * 1000;
        state.timer.remainSec = Math.max(0, state.timer.remainSec - elapsed);
        if (state.timer.remainSec === 0) {
          state.timer.running = false;
          triggerAlarm();
        }
        renderNav();
        if (state.activePage === "timer") renderTimer();
      }
    }
  }

  function currentMediaPos() {
    if (!state.media) return 0;
    let pos = Number(state.media.pos || 0);
    if (state.media.playing && state.mediaUpdatedAt) {
      pos += (Date.now() - state.mediaUpdatedAt) / 1000;
    }
    const dur = Number(state.media.dur || 0);
    return dur > 0 ? Math.min(pos, dur) : pos;
  }

  // ---- Renderers ----
  function renderActivePage() {
    switch (state.activePage) {
      case "home":
        renderHome();
        break;
      case "stats":
        renderStats();
        break;
      case "media":
        renderMedia();
        break;
      case "shortcuts":
        renderShortcuts();
        break;
      case "weather":
        renderWeather();
        break;
      case "calendar":
        renderCalendar();
        break;
      case "network":
        renderNetwork();
        break;
      case "games":
        renderGames();
        break;
      case "timer":
        renderTimer();
        break;
    }
  }

  function renderWidgetBody(widget) {
    if (widget === "stats") {
      const s = state.stats;
      if (!s) return `<div class="empty-state">Aguardando PC...</div>`;
      const gpuHtml =
        s.gpu != null
          ? `<div class="w-stat-pill"><span class="w-stat-val" style="color:var(--green)">${Math.round(s.gpu)}%</span><span class="w-stat-lbl">GPU</span></div>`
          : "";
      const ramPct = s.ram_total ? Math.round((s.ram_used / s.ram_total) * 100) : 0;
      return `<div class="w-stats-row">
        <div class="w-stat-pill"><span class="w-stat-val" style="color:var(--cyan)">${Math.round(s.cpu)}%</span><span class="w-stat-lbl">CPU</span></div>
        ${gpuHtml}
        <div class="w-stat-pill"><span class="w-stat-val" style="color:var(--amber)">${ramPct}%</span><span class="w-stat-lbl">RAM</span></div>
        <div class="w-stat-pill"><span class="w-stat-val" style="color:var(--indigo)">${Math.round(s.disk)}%</span><span class="w-stat-lbl">Disco</span></div>
      </div>`;
    }

    if (widget === "weather") {
      const w = state.weather;
      if (!w?.current) return `<div class="empty-state">Carregando clima...</div>`;
      const c = w.current;
      return `<div class="w-weather-row">
        <div class="w-weather-temp">${Math.round(c.temperature_2m)}°</div>
        <div class="w-weather-meta">
          <div style="color:var(--text);font-weight:700">${esc(w.city || "Local")}</div>
          <div>${esc(wmoText(c.weather_code))}</div>
          <div>Sensação ${Math.round(c.apparent_temperature)}°</div>
        </div>
      </div>`;
    }

    if (widget === "media") {
      const m = state.media;
      if (!m || !m.active) return `<div class="empty-state">Nada tocando</div>`;
      const art = (m.art_id && state.artById[m.art_id]) || state.latestArtUrl;
      const img = art
        ? `<img class="w-media-cover" src="${art}" alt="">`
        : `<div class="w-media-cover" style="display:flex;align-items:center;justify-content:center;color:var(--muted)">${iconSvg("music_note")}</div>`;
      return `<div class="w-media-row">
        ${img}
        <div class="w-media-info">
          <div class="w-media-title">${esc(m.title)}</div>
          <div class="w-media-artist">${esc(m.artist || m.source || "")}</div>
        </div>
      </div>`;
    }

    if (widget === "events") {
      if (!state.events.length) {
        return `<div class="empty-state">Sem eventos nos próximos ${state.eventsDays} dias</div>`;
      }
      return `<div class="w-events-list">${state.events
        .map((ev) => {
          const d = new Date(ev.start * 1000);
          const dayName = d.toLocaleDateString("pt-BR", { weekday: "short" });
          const time = ev.all_day
            ? `${dayName} (Dia todo)`
            : `${dayName} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
          return `<div class="w-event-item">
            <span class="ev-bar" style="background:${esc(ev.color || "#38bdf8")}"></span>
            <span class="ev-time" style="min-width:68px">${esc(time)}</span>
            <span class="ev-title">${esc(ev.title)}</span>
          </div>`;
        })
        .join("")}</div>`;
    }

    if (widget === "net") {
      const n = state.net;
      if (!n) return `<div class="empty-state">Aguardando rede...</div>`;
      const lat = n.latency_ms != null ? `${Math.round(n.latency_ms)} ms` : "--";
      return `<div class="w-stats-row">
        <div class="w-stat-pill"><span class="w-stat-val" style="color:${n.online ? "var(--green)" : "var(--red)"}">${n.online ? "ON" : "OFF"}</span><span class="w-stat-lbl">Status</span></div>
        <div class="w-stat-pill"><span class="w-stat-val" style="color:var(--cyan)">${lat}</span><span class="w-stat-lbl">Ping</span></div>
        <div class="w-stat-pill"><span class="w-stat-val">${fmtBytes(n.today_bytes)}</span><span class="w-stat-lbl">Hoje</span></div>
      </div>`;
    }

    if (widget === "game") {
      const p = state.steam?.playing;
      if (!p) return `<div class="empty-state">Nenhum jogo aberto</div>`;
      return `<div class="w-media-row"><div class="w-media-info"><div class="w-media-title">${esc(p.name)}</div><div class="w-media-artist">${fmtTime(p.session_s)} jogados</div></div></div>`;
    }

    if (widget === "clock") {
      const now = new Date();
      return `<div class="w-stats-row"><span style="font-size:32px;font-weight:800">${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span></div>`;
    }

    return `<div class="empty-state">--</div>`;
  }

  function renderHome() {
    const defaultGrid = [
      { widget: "stats", x: 0, y: 0, w: 3, h: 1 },
      { widget: "events", x: 0, y: 1, w: 3, h: 2 },
      { widget: "weather", x: 3, y: 0, w: 2, h: 1 },
      { widget: "media", x: 3, y: 1, w: 2, h: 1 },
      { widget: "net", x: 3, y: 2, w: 2, h: 1 },
    ];
    const items = (state.home?.grid || defaultGrid).filter(
      (g) => g.widget !== "claude" && g.widget !== "ai"
    );
    const targetPage = {
      stats: "stats",
      events: "calendar",
      weather: "weather",
      media: "media",
      net: "network",
      game: "games",
    };
    const titles = {
      stats: "PC",
      events: "Agenda",
      weather: "Clima",
      media: "Mídia",
      net: "Internet",
      game: "Jogo",
      clock: "Relógio",
    };

    pageEls.home.innerHTML = `<div class="home-grid">${items
      .map((it) => {
        const style = `grid-column:${it.x + 1}/span ${it.w};grid-row:${it.y + 1}/span ${it.h};`;
        const dest = targetPage[it.widget] || "home";
        return `<div class="card widget-card" style="${style}" data-goto="${dest}">
          <div class="card-title"><span>${titles[it.widget] || esc(it.widget)}</span></div>
          ${renderWidgetBody(it.widget)}
        </div>`;
      })
      .join("")}</div>`;

    pageEls.home.querySelectorAll("[data-goto]").forEach((el) => {
      el.addEventListener("click", () => switchPage(el.dataset.goto));
    });
  }

  function drawLineChart(canvas, seriesList, yMax = 100) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(120, Math.floor(rect.width));
    const h = Math.max(60, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Subtle grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      const y = Math.round((h * i) / 4) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    for (const s of seriesList) {
      const pts = s.data;
      if (!pts.length) continue;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const step = w / Math.max(pts.length - 1, 1);
      let started = false;
      pts.forEach((v, idx) => {
        if (v == null || v < 0) {
          started = false;
          return;
        }
        const x = idx * step;
        const y = h - (Math.min(Math.max(v, 0), yMax) / yMax) * (h - 8) - 4;
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }
  }

  function renderStats() {
    const s = state.stats;
    if (!s) {
      pageEls.stats.innerHTML = `<div class="card" style="height:100%"><div class="empty-state">Aguardando estatísticas do PC...</div></div>`;
      return;
    }
    const ramPct = s.ram_total ? (s.ram_used / s.ram_total) * 100 : 0;
    const hasGpu = s.gpu != null;
    const vramPct = hasGpu && s.vram_total ? (s.vram_used / s.vram_total) * 100 : 0;

    pageEls.stats.innerHTML = `<div class="stats-layout">
      <div class="stats-gauges">
        <div class="card gauge-card">
          <div class="gauge-head"><span>CPU</span><span>${esc(s.cpu_name || "")}</span></div>
          <div class="gauge-val" style="color:var(--cyan)">${Math.round(s.cpu)}%</div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.min(s.cpu, 100)}%;background:var(--cyan)"></div></div>
        </div>
        <div class="card gauge-card">
          <div class="gauge-head"><span>GPU</span><span>${hasGpu ? `${s.gpu_temp}°C` : "N/D"}</span></div>
          <div class="gauge-val" style="color:var(--green)">${hasGpu ? `${Math.round(s.gpu)}%` : "--"}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${hasGpu ? Math.min(s.gpu, 100) : 0}%;background:var(--green)"></div></div>
        </div>
        <div class="card gauge-card">
          <div class="gauge-head"><span>RAM</span><span>${s.ram_used}/${s.ram_total} GB</span></div>
          <div class="gauge-val" style="color:var(--amber)">${Math.round(ramPct)}%</div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.min(ramPct, 100)}%;background:var(--amber)"></div></div>
        </div>
        <div class="card gauge-card">
          <div class="gauge-head"><span>VRAM</span><span>${hasGpu && s.vram_total ? `${s.vram_used}/${s.vram_total} GB` : "N/D"}</span></div>
          <div class="gauge-val" style="color:var(--indigo)">${hasGpu && s.vram_total ? `${Math.round(vramPct)}%` : "--"}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.min(vramPct, 100)}%;background:var(--indigo)"></div></div>
        </div>
      </div>

      <div class="card chart-card">
        <div class="card-title"><span>Histórico (60s)</span><span style="color:var(--cyan)">CPU</span></div>
        <div class="chart-wrap"><canvas id="stats-chart"></canvas></div>
      </div>

      <div class="card">
        <div class="card-title"><span>Rede & Disco</span><span>${esc(s.gpu_name || "")}</span></div>
        <div class="stats-details">
          <div class="kv-box"><div class="kv-lbl">Download</div><div class="kv-val" style="color:var(--cyan)">${fmtRate(s.net_down)}</div></div>
          <div class="kv-box"><div class="kv-lbl">Upload</div><div class="kv-val" style="color:var(--green)">${fmtRate(s.net_up)}</div></div>
          <div class="kv-box"><div class="kv-lbl">Disco C:</div><div class="kv-val">${s.disk}%</div></div>
          <div class="kv-box"><div class="kv-lbl">Temp. GPU</div><div class="kv-val">${hasGpu ? `${s.gpu_temp}°C` : "--"}</div></div>
        </div>
      </div>
    </div>`;

    const series = [{ data: state.statsHist.cpu, color: "#38bdf8" }];
    if (hasGpu) series.push({ data: state.statsHist.gpu, color: "#34d399" });
    drawLineChart(pageEls.stats.querySelector("#stats-chart"), series, 100);
  }

  function renderMedia() {
    const m = state.media;
    const spotifyTileIdx = state.tiles.findIndex(
      (t) => String(t.label || "").toLowerCase().includes("spotify")
    );

    if (!m || !m.active) {
      pageEls.media.innerHTML = `<div class="card" style="height:100%;display:flex;align-items:center;justify-content:center;">
        <div class="media-empty-actions">
          <div class="empty-state" style="padding:0">Nenhuma mídia tocando no momento.</div>
          <button id="btn-media-open-spotify" class="btn-open-spotify icon-only" type="button" title="Abrir Spotify no PC">
            ${iconSvg("spotify")}
          </button>
        </div>
      </div>`;
      pageEls.media.querySelector("#btn-media-open-spotify")?.addEventListener("click", () => {
        if (spotifyTileIdx >= 0) {
          sendCmd({ type: "shortcut", id: spotifyTileIdx });
        }
      });
      return;
    }
    const art = (m.art_id && state.artById[m.art_id]) || state.latestArtUrl;
    const dur = Number(m.dur || 0);
    const pos = Math.floor(currentMediaPos());

    pageEls.media.innerHTML = `<div class="media-layout">
      <div class="media-art-box">
        ${art ? `<img src="${art}" alt="Capa">` : iconSvg("music_note")}
      </div>
      <div class="media-right">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span class="media-source">${esc(m.source || "Mídia")}</span>
          <button id="btn-media-open-spotify" class="media-btn media-btn-app" type="button" title="Abrir Spotify no PC">
            ${iconSvg("spotify")}
          </button>
        </div>
        <div class="media-title">${esc(m.title)}</div>
        <div class="media-artist">${esc([m.artist, m.album].filter(Boolean).join(" • "))}</div>
        <div class="media-seek-row">
          <span id="media-pos" class="media-time">${fmtTime(pos)}</span>
          <input id="media-seek" class="seek-slider" type="range" min="0" max="${Math.max(dur, 1)}" value="${pos}" ${m.can_seek ? "" : "disabled"}>
          <span class="media-time">${fmtTime(dur)}</span>
        </div>
        <div class="media-controls">
          <button class="media-btn" data-media-cmd="prev" type="button" title="Anterior">${iconSvg("skip_previous")}</button>
          <button class="media-btn play" data-media-cmd="toggle" type="button" title="Play/Pause">${iconSvg(m.playing ? "pause" : "play_arrow")}</button>
          <button class="media-btn" data-media-cmd="next" type="button" title="Próxima">${iconSvg("skip_next")}</button>
        </div>
      </div>
    </div>`;

    pageEls.media.querySelector("#btn-media-open-spotify")?.addEventListener("click", () => {
      if (spotifyTileIdx >= 0) {
        sendCmd({ type: "shortcut", id: spotifyTileIdx });
      }
    });

    pageEls.media.querySelectorAll("[data-media-cmd]").forEach((btn) => {
      btn.addEventListener("click", () => sendCmd({ type: "media", cmd: btn.dataset.mediaCmd, value: 0 }));
    });
    const slider = pageEls.media.querySelector("#media-seek");
    if (slider && m.can_seek) {
      slider.addEventListener("change", () => {
        sendCmd({ type: "media", cmd: "seek", value: Number(slider.value) });
      });
    }
  }

  function renderShortcuts() {
    if (!state.tiles.length) {
      pageEls.shortcuts.innerHTML = `<div class="card" style="height:100%"><div class="empty-state">Nenhum atalho configurado em config.toml.</div></div>`;
      return;
    }
    pageEls.shortcuts.innerHTML = `<div class="tiles-grid">${state.tiles
      .map((t, idx) => {
        const lit = state.tileOn.has(idx) ? "lit" : "";
        return `<button class="tile-btn ${lit}" data-tile-id="${idx}" type="button" style="background:${esc(t.color || "#2b2f3a")}">
          ${iconSvg(t.icon)}
          <span>${esc(t.label)}</span>
        </button>`;
      })
      .join("")}</div>`;

    pageEls.shortcuts.querySelectorAll("[data-tile-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sendCmd({ type: "shortcut", id: Number(btn.dataset.tileId) });
      });
    });
  }

  function renderWeather() {
    const w = state.weather;
    if (!w?.current) {
      pageEls.weather.innerHTML = `<div class="card" style="height:100%"><div class="empty-state">Buscando previsão do tempo...</div></div>`;
      return;
    }
    const c = w.current;
    const h = w.hourly || {};
    const d = w.daily || {};

    const nowMs = Date.now();
    const hours = (h.time || [])
      .map((t, i) => ({
        t,
        ms: new Date(t).getTime(),
        temp: h.temperature_2m?.[i],
        pop: h.precipitation_probability?.[i],
      }))
      .filter((x) => x.ms >= nowMs - 3600_000)
      .slice(0, 12);

    const days = (d.time || []).slice(0, 6).map((t, i) => ({
      t,
      code: d.weather_code?.[i],
      tmax: d.temperature_2m_max?.[i],
      tmin: d.temperature_2m_min?.[i],
      pop: d.precipitation_probability_max?.[i],
    }));

    pageEls.weather.innerHTML = `<div class="weather-layout">
      <div class="card weather-now">
        <div>
          <div class="card-title"><span>${esc(w.city || "Local")}</span></div>
          <div class="weather-big-temp">${Math.round(c.temperature_2m)}°C</div>
          <div class="weather-cond">${esc(wmoText(c.weather_code))}</div>
        </div>
        <div class="weather-meta-grid">
          <div>Sensação: <b>${Math.round(c.apparent_temperature)}°</b></div>
          <div>Umidade: <b>${Math.round(c.relative_humidity_2m)}%</b></div>
          <div>Vento: <b>${Math.round(c.wind_speed_10m)} km/h</b></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span>Próximas horas</span></div>
        <div class="hourly-strip">${hours
          .map((x) => {
            const hh = new Date(x.t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
            return `<div class="hour-pill">
              <div style="color:var(--muted)">${hh}</div>
              <div style="font-size:15px;font-weight:800;margin:2px 0">${Math.round(x.temp)}°</div>
              <div style="color:var(--cyan)">${x.pop ?? 0}%</div>
            </div>`;
          })
          .join("")}</div>
      </div>

      <div class="card">
        <div class="card-title"><span>Próximos 6 dias</span></div>
        <div class="daily-list">${days
          .map((x) => {
            const label = new Date(x.t + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" });
            return `<div class="day-card">
              <div style="font-weight:700;text-transform:capitalize">${label}</div>
              <div style="color:var(--muted);font-size:11px">${esc(wmoText(x.code))}</div>
              <div><b>${Math.round(x.tmax)}°</b> <span style="color:var(--muted)">/ ${Math.round(x.tmin)}°</span></div>
            </div>`;
          })
          .join("")}</div>
      </div>
    </div>`;
  }

  function renderCalendar() {
    if (!state.events.length) {
      pageEls.calendar.innerHTML = `<div class="card" style="height:100%"><div class="empty-state">Sem eventos nos próximos ${state.eventsDays} dias.<br><span style="font-size:11px">Configure feeds ICS em companion/config.toml</span></div></div>`;
      return;
    }
    const groups = new Map();
    for (const ev of state.events) {
      const d = new Date(ev.start * 1000);
      const dayKey = d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
      if (!groups.has(dayKey)) groups.set(dayKey, []);
      groups.get(dayKey).push(ev);
    }

    let html = `<div class="cal-list">`;
    for (const [day, list] of groups.entries()) {
      html += `<div class="cal-day-hdr">${esc(day)}</div>`;
      for (const ev of list) {
        const s = new Date(ev.start * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        const e = new Date(ev.end * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        const when = ev.all_day ? "Dia todo" : `${s} - ${e}`;
        html += `<div class="cal-ev">
          <span class="ev-bar" style="background:${esc(ev.color || "#7c9cff")}"></span>
          <span class="ev-time" style="min-width:92px">${esc(when)}</span>
          <div style="min-width:0;flex:1">
            <div class="ev-title">${esc(ev.title)}</div>
            ${ev.loc ? `<div style="font-size:11px;color:var(--muted)">${esc(ev.loc)}</div>` : ""}
          </div>
          <span style="font-size:11px;color:var(--muted)">${esc(ev.cal)}</span>
        </div>`;
      }
    }
    html += `</div>`;
    pageEls.calendar.innerHTML = html;
  }

  function renderNetwork() {
    const n = state.net;
    if (!n) {
      pageEls.network.innerHTML = `<div class="card" style="height:100%"><div class="empty-state">Aguardando dados de internet...</div></div>`;
      return;
    }
    const lat = n.latency_ms != null ? `${n.latency_ms} ms` : "--";
    const jit = n.jitter_ms != null ? `${n.jitter_ms} ms` : "--";
    const hist = n.hist || [];
    const maxPing = Math.max(60, ...hist.filter((x) => x > 0));

    pageEls.network.innerHTML = `<div class="net-layout">
      <div class="card chart-card">
        <div class="card-title">
          <span>Latência (60s)</span>
          <span class="badge ${n.online ? "badge-online" : "badge-offline"}">${n.online ? "Online" : "Offline"}</span>
        </div>
        <div class="net-metrics">
          <div class="kv-box"><div class="kv-lbl">Ping</div><div class="kv-val" style="color:var(--cyan)">${lat}</div></div>
          <div class="kv-box"><div class="kv-lbl">Jitter</div><div class="kv-val">${jit}</div></div>
          <div class="kv-box"><div class="kv-lbl">Perda</div><div class="kv-val" style="color:${n.loss_pct ? "var(--red)" : "var(--green)"}">${n.loss_pct}%</div></div>
        </div>
        <div class="chart-wrap"><canvas id="net-chart"></canvas></div>
      </div>

      <div class="net-side">
        <div class="card">
          <div class="card-title"><span>Tráfego</span></div>
          <div class="stats-details">
            <div class="kv-box"><div class="kv-lbl">Hoje</div><div class="kv-val">${fmtBytes(n.today_bytes)}</div></div>
            <div class="kv-box"><div class="kv-lbl">Mês</div><div class="kv-val">${fmtBytes(n.month_bytes)}</div></div>
          </div>
        </div>

        <div class="card" style="flex:1;justify-content:space-between">
          <div class="card-title"><span>Speedtest</span></div>
          <div class="stats-details">
            <div class="kv-box"><div class="kv-lbl">Down</div><div class="kv-val" style="color:var(--cyan)">${n.speed ? `${n.speed.down_mbps} Mbps` : "--"}</div></div>
            <div class="kv-box"><div class="kv-lbl">Up</div><div class="kv-val" style="color:var(--green)">${n.speed ? `${n.speed.up_mbps} Mbps` : "--"}</div></div>
          </div>
          <button id="btn-speedtest" class="btn-primary" type="button" ${n.testing ? "disabled" : ""}>
            ${n.testing ? "Testando..." : "Rodar Speedtest"}
          </button>
        </div>
      </div>
    </div>`;

    drawLineChart(pageEls.network.querySelector("#net-chart"), [{ data: hist, color: "#38bdf8" }], maxPing);
    const btn = pageEls.network.querySelector("#btn-speedtest");
    if (btn) {
      btn.addEventListener("click", () => sendCmd({ type: "speedtest" }));
    }
  }

  function renderGames() {
    const st = state.steam;
    if (!st) {
      pageEls.games.innerHTML = `<div class="card" style="height:100%"><div class="empty-state">Steam não detectada.</div></div>`;
      return;
    }
    const p = st.playing;
    const heroImg = p ? state.steamImgs[`${p.appid}_0`] : "";

    pageEls.games.innerHTML = `<div class="games-layout">
      <div class="card">
        <div class="card-title"><span>Jogando agora</span></div>
        ${
          p
            ? `${heroImg ? `<img class="game-hero" src="${heroImg}" alt="">` : ""}
               <div style="font-size:18px;font-weight:800">${esc(p.name)}</div>
               <div style="font-size:12px;color:var(--muted);margin-top:4px">Sessão: ${fmtTime(p.session_s)} • Total: ${(p.total_min / 60).toFixed(1)} h</div>`
            : `<div class="empty-state">Nenhum jogo em execução</div>`
        }
      </div>

      <div class="card">
        <div class="card-title"><span>Recentes (toque para abrir)</span></div>
        <div class="recent-games">${(st.recent || [])
          .map((g) => {
            const thumb = state.steamImgs[`${g.appid}_2`] || state.steamImgs[`${g.appid}_1`] || "";
            return `<div class="game-row" data-appid="${g.appid}">
              ${thumb ? `<img class="game-thumb" src="${thumb}" alt="">` : `<div class="game-thumb"></div>`}
              <div style="min-width:0;flex:1">
                <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(g.name)}</div>
                <div style="font-size:11px;color:var(--muted)">${(g.total_min / 60).toFixed(1)} h jogadas</div>
              </div>
            </div>`;
          })
          .join("")}</div>
      </div>
    </div>`;

    pageEls.games.querySelectorAll("[data-appid]").forEach((row) => {
      row.addEventListener("click", () => {
        sendCmd({ type: "steam_launch", appid: Number(row.dataset.appid) });
      });
    });
  }

  function triggerAlarm() {
    els.timerAlarm.classList.remove("hidden");
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.22, 0.44].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.19);
      });
    } catch {
      // AudioContext might require prior user gesture
    }
  }

  els.btnAlarmOk.addEventListener("click", () => {
    els.timerAlarm.classList.add("hidden");
  });

  function renderTimer() {
    const t = state.timer;
    const presets = [1, 5, 10, 15, 25, 45];
    pageEls.timer.innerHTML = `<div class="card timer-layout">
      <div class="timer-display">${fmtTime(t.remainSec)}</div>
      <div class="timer-presets">${presets
        .map((m) => `<button class="btn-secondary" data-preset="${m}" type="button">${m} min</button>`)
        .join("")}</div>
      <div class="timer-actions">
        <button id="btn-timer-toggle" class="btn-primary" type="button">${t.running ? "Pausar" : "Iniciar"}</button>
        <button id="btn-timer-reset" class="btn-secondary" type="button">Zerar</button>
      </div>
    </div>`;

    pageEls.timer.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sec = Number(btn.dataset.preset) * 60;
        t.totalSec = sec;
        t.remainSec = sec;
        t.running = true;
        t.lastTick = Date.now();
        renderNav();
        renderTimer();
      });
    });

    pageEls.timer.querySelector("#btn-timer-toggle").addEventListener("click", () => {
      if (t.remainSec <= 0) t.remainSec = t.totalSec;
      t.running = !t.running;
      t.lastTick = Date.now();
      renderNav();
      renderTimer();
    });

    pageEls.timer.querySelector("#btn-timer-reset").addEventListener("click", () => {
      t.running = false;
      t.remainSec = t.totalSec;
      renderNav();
      renderTimer();
    });
  }

  // ---- NoSleep & Fullscreen ----
  const noSleep = typeof NoSleep === "function" ? new NoSleep() : null;

  async function enableNoSleep() {
    if (!noSleep || noSleep.isEnabled) return;
    try {
      await noSleep.enable();
    } catch {
      // Browser autoplay policy may require a user gesture first; listeners below retry.
    }
  }

  for (const evt of ["touchstart", "pointerdown", "click"]) {
    document.addEventListener(
      evt,
      () => {
        if (noSleep && !noSleep.isEnabled) enableNoSleep();
      },
      { passive: true }
    );
  }

  els.btnFullscreen.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if (screen.orientation?.lock) {
          screen.orientation.lock("landscape").catch(() => {});
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore if unsupported
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      enableNoSleep();
    }
  });

  // ---- WebSocket Client ----
  function handleServerMessage(msg) {
    switch (msg.type) {
      case "hub_status":
        state.pcOnline = Boolean(msg.pc_online);
        if (!state.pcOnline) state.pcAsleep = false;
        updateStatusUi();
        break;
      case "layout":
        state.layout = msg;
        renderNav();
        break;
      case "home":
        state.home = msg;
        if (state.activePage === "home") renderHome();
        break;
      case "pc_power":
        state.pcAsleep = Boolean(msg.asleep);
        updateSleepOverlay();
        break;
      case "stats":
        state.stats = msg;
        state.statsHist.cpu.push(Number(msg.cpu || 0));
        if (state.statsHist.cpu.length > 60) state.statsHist.cpu.shift();
        if (msg.gpu != null) {
          state.statsHist.gpu.push(Number(msg.gpu));
          if (state.statsHist.gpu.length > 60) state.statsHist.gpu.shift();
        }
        if (state.activePage === "home") renderHome();
        if (state.activePage === "stats") renderStats();
        break;
      case "media":
        state.media = msg;
        state.mediaUpdatedAt = Date.now();
        if (!msg.active || !msg.art_id) state.latestArtUrl = "";
        if (state.activePage === "home") renderHome();
        if (state.activePage === "media") renderMedia();
        break;
      case "art_image":
        state.artById[msg.art_id] = msg.data_url;
        state.latestArtUrl = msg.data_url;
        if (state.activePage === "home") renderHome();
        if (state.activePage === "media") renderMedia();
        break;
      case "tiles":
        state.tiles = msg.tiles || [];
        if (state.activePage === "shortcuts") renderShortcuts();
        break;
      case "tile_state":
        state.tileOn = new Set(msg.on || []);
        if (state.activePage === "shortcuts") renderShortcuts();
        break;
      case "events":
        state.events = msg.events || [];
        state.eventsDays = Number(msg.days || 7);
        if (state.activePage === "home") renderHome();
        if (state.activePage === "calendar") renderCalendar();
        break;
      case "weather":
        state.weather = msg;
        if (state.activePage === "home") renderHome();
        if (state.activePage === "weather") renderWeather();
        break;
      case "net":
        state.net = msg;
        if (state.activePage === "home") renderHome();
        if (state.activePage === "network") renderNetwork();
        break;
      case "steam":
        state.steam = msg;
        renderNav();
        if (state.activePage === "home") renderHome();
        if (state.activePage === "games") renderGames();
        break;
      case "steam_image":
        state.steamImgs[`${msg.appid}_${msg.kind}`] = msg.data_url;
        if (state.activePage === "games") renderGames();
        break;
    }
  }

  function connect() {
    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${proto}//${location.host}/client`;
    ws = new WebSocket(url);

    ws.addEventListener("open", () => {
      state.wsConnected = true;
      updateStatusUi();
    });

    ws.addEventListener("message", (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        handleServerMessage(msg);
      } catch {
        // Ignore malformed frame
      }
    });

    ws.addEventListener("close", () => {
      state.wsConnected = false;
      state.pcOnline = false;
      updateStatusUi();
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connect, 2500);
    });
  }

  renderNav();
  renderActivePage();
  updateStatusUi();
  tickClock();
  setInterval(tickClock, 1000);
  enableNoSleep();
  connect();
})();
