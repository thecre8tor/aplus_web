// app.js
document.addEventListener("DOMContentLoaded", () => {
  // config.js
  window.ENV = {
    API_URL: "https://api-staging.example.com",
    APP_MODE: "staging",
    ENABLE_LOGS: true,
  };

  const info = document.getElementById("info");

  const { API_URL, APP_MODE, ENABLE_LOGS } = window.ENV;

  info.textContent = `Current Environment: ${APP_MODE} | API: ${API_URL}`;

  if (ENABLE_LOGS) {
    console.log("Environment variables loaded:", window.ENV);
  }
});
