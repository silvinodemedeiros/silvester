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

widgetSource.onmessage = (event) => {
  const gridWidgets = JSON.parse(event.data).data[0];
  
  Object.values(gridWidgets).forEach((gridWidget) => {
    const widgetNode = [
      ...document.querySelectorAll(".grid-widget-" + gridWidget.type),
    ][0];

    if (widgetNode) {
      const widgetValueNode = [...widgetNode.querySelectorAll(".grid-widget-value")][0];
      widgetValueNode.textContent = widget_value(gridWidget);

      widgetSuffixNode = document.createElement('div');
      widgetSuffixNode.classList.add('grid-widget-value-suffix');
      widgetSuffixNode.textContent = widget_suffix(gridWidget.metadata?.measures?.value);
      widgetValueNode.appendChild(widgetSuffixNode);
    }
  });
};

[...document.querySelectorAll(".grid-widget")].map(widgetNode => {
    widgetNode.addEventListener("focus", () => {
        widgetNode.classList.add('magnified');
    });

    widgetNode.addEventListener("blur", () => {
        widgetNode.classList.remove('magnified');
    });
})

document.addEventListener("keydown", (event) => {
    const container = document.querySelector('.grid-widgets-wrapper');
    const focusableElements = container.querySelectorAll('[tabindex="1"]');
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
});