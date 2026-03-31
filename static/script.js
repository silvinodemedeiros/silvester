
let darkMode = false;
const darkModeToggle = document.getElementById("dark-mode-toggle");

let mapContainer = document.querySelector('.grid-widget-location .grid-widget-map');
let mapWidget = null;

if (mapContainer) {
  mapWidget = L.map(mapContainer).setView([-5.837008, -35.203026], 14);
}

toggleDarkMode = () => {
    const layoutNode = document.querySelector('.layout');
    const accessibilityNode = document.querySelector('.accessibility');
    const cellNodeList = document.querySelectorAll('.grid-widget');
    const widgetTitlesNodeList = document.querySelectorAll('.grid-widget-title');
    const widgetValuesNodeList = document.querySelectorAll('.grid-widget-value');

    if (darkMode) {
        darkMode = false;
        layoutNode.classList.remove('layout-dark');
        accessibilityNode.classList.remove('accessibility-high-contrast');
        [...cellNodeList].forEach(cell => cell.classList.remove('cell-dark'));
        [...widgetTitlesNodeList].forEach(gridWidgetTitle => gridWidgetTitle.classList.remove('grid-widget-title-dark'));
        [...widgetValuesNodeList].forEach(gridWidgetValue => gridWidgetValue.classList.remove('grid-widget-value-dark'));
    } else {
        darkMode = true;
        layoutNode.classList.add('layout-dark');
        accessibilityNode.classList.add('accessibility-high-contrast');
        [...cellNodeList].forEach(cell => cell.classList.add('cell-dark'));
        [...widgetTitlesNodeList].forEach(gridWidgetTitle => gridWidgetTitle.classList.add('grid-widget-title-dark'));
        [...widgetValuesNodeList].forEach(gridWidgetValue => gridWidgetValue.classList.add('grid-widget-value-dark'));
    }
}

formatOffset_function = (offset) => {
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hours = Math.floor(abs);
  const minutes = Math.round((abs - hours) * 60);

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");

  return `${sign}${hh}${mm}`;
};

widget_value = (widget) => {
  let resultValue;
  const valueType = widget.metadata.measures?.value;
  const dataType = widget.type;

  switch (valueType) {
    case 'time':
      resultValue = new Date(widget.value, 'HH:mm');
      break;
    case "distance":
      resultValue = widget.value / 1000;
      break;
    case "timezoneOffset":
      resultValue = formatOffset_function(widget.value / 3600);
      break;
    default:
      resultValue = widget.value;
      break;
  }

  switch (dataType) {
    case "Integer":
      resultValue = parseInt(resultValue, 10);
      break;
    case "Float":
      resultValue = parseFloat(resultValue).toFixed(1);
      break;
  }

  return resultValue;
};

widget_suffix = (unit) => {
  let suffix = "";

  switch (unit) {
    case "percentage":
      suffix = "%";
      break;
    case "temperature":
      suffix = "°C";
      break;
    case "angle":
      suffix = "°";
      break;
    case "distance":
      suffix = "km";
      break;
    case "hectoPascal":
      suffix = "hPa";
      break;
    case "velocity":
      suffix = "m/s";
      break;
    default:
      suffix = "";
      break;
  }

  return suffix;
};

const widgetSource = new EventSource("http://localhost:3000/events");

// # SUBSCRIBES TO NOTIFICATIONS FROM SERVER
widgetSource.onmessage = (event) => {
  const gridWidgets = JSON.parse(event.data).data[0];
  
  Object.values(gridWidgets).forEach((gridWidget) => {
    const widgetNode = [
      ...document.querySelectorAll(".grid-widget-" + gridWidget.type),
    ][0];

    if (widgetNode) {

      const widgetValueNode = [...widgetNode.querySelectorAll(".grid-widget-value")][0];

      if (gridWidget.data.type === 'location') {

      } else {
        widgetValueNode.textContent = widget_value(gridWidget);
  
        widgetSuffixNode = document.createElement('div');
        widgetSuffixNode.classList.add('grid-widget-value-suffix');
        widgetSuffixNode.textContent = widget_suffix(gridWidget.metadata?.measures?.value);
        widgetValueNode.appendChild(widgetSuffixNode);
      } 
    }
  });
};

// # ADDS FOCUS AND UNFOCUS EVENTS TO PROTOTYPED WIDGETS
[...document.querySelectorAll(".grid-widget")].map(widgetNode => {
    widgetNode.addEventListener("focus", () => {
        widgetNode.classList.add('magnified');
    });

    widgetNode.addEventListener("blur", () => {
        widgetNode.classList.remove('magnified');
    });
})

// KEYPRESS HANDLE - 
document.addEventListener("keydown", (event) => {
    
    if (event.key === "Tab") {
        
      const focusableElements = document.querySelectorAll('[tabindex="0"]');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (event.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    } else if (event.key === "Enter") {
      const activeElement = document.activeElement;
      if (activeElement === darkModeToggle) {
          toggleDarkMode();
      }
    }
});

darkModeToggle.addEventListener("mousedown", () => toggleDarkMode());

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapWidget);