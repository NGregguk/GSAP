// Utility helpers for manual text splitting to avoid DOM reflows at runtime.
function splitByChars(element) {
  const text = element.textContent || "";
  element.textContent = "";
  const nodes = [];
  [...text].forEach((char) => {
    const span = document.createElement("span");
    span.classList.add("split__char");
    span.textContent = char === " " ? "\u00a0" : char;
    element.appendChild(span);
    nodes.push(span);
  });
  return nodes;
}

function splitByWords(element) {
  const text = element.textContent || "";
  const words = text.trim().split(/\s+/);
  element.textContent = "";
  const nodes = [];
  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.classList.add("split__word");
    span.textContent = word;
    element.appendChild(span);
    nodes.push(span);
    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(" "));
    }
  });
  return nodes;
}

export { splitByChars, splitByWords };
