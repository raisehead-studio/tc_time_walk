const SCOPES = "https://www.googleapis.com/auth/calendar";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

const formatEvents = (list) => {
  return list.map((item) => ({
    title: item.summary,
    start: item.start.dateTime || item.start.date,
    end: item.end.dateTime || item.end.date,
  }));
};

export const listUpcomingEvents = () => {
  window.gapi.client.calendar.events
    .list({
      // Fetch events from user's primary calendar
      calendarId: "primary",
      showDeleted: true,
      singleEvents: true,
    })
    .then(function (response) {
      let events = response.result.items;

      if (events.length > 0) {
        return formatEvents(events);
      }
    });
};

const openSignInPopup = () => {
  window.gapi.auth2.getAuthInstance().signIn();
};

export const initClient = () => {
  window.gapi.client
    .init({
      apiKey: "AIzaSyDwJTtU6LBpjgh12vMGIi8YciVuiPiIdAo",
      clientId:
        "590656010474-6nk7ii0ir98cj192ovbd0q7252lqtrue.apps.googleusercontent.com",
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(function (res) {
      if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
        openSignInPopup();
      }
    });
};

export const handleCreateEvents = (data) => {
  const request = window.gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: data,
  });

  request.execute(function (event) {
    console.log("Event created: " + event.htmlLink);
  });
};
