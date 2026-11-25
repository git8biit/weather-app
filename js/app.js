import { createWidget } from './widget.js';

const container = document.getElementById('widgets-container');
const addButton = document.getElementById('add-widget-btn');

function init() {
  createWidget(container);
  addButton.addEventListener('click', () => createWidget(container));
}

init();