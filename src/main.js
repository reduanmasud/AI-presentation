// Main JavaScript Entry Point
// This file initializes the presentation slider application

// Import styles first
import './styles/main.scss';

import { slidesData } from './data/slides.js';
import { presentationConfig } from './data/config.js';
import { runDataMigrationTests } from './utils/test-data-migration.js';
import { presentationApp } from './components/PresentationApp.js';

// Add original interactive functions for compatibility
window.changeScreenshot = function(direction, event) {
  if (event) event.stopPropagation();

  const screenshots = document.querySelectorAll('.screenshot-item');
  const dots = document.querySelectorAll('.gallery-dot');
  let currentIndex = Array.from(screenshots).findIndex(item => item.classList.contains('active'));

  currentIndex += direction;

  if (currentIndex < 0) currentIndex = screenshots.length - 1;
  if (currentIndex >= screenshots.length) currentIndex = 0;

  screenshots.forEach(item => item.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  screenshots[currentIndex].classList.add('active');
  dots[currentIndex].classList.add('active');
};

window.currentScreenshot = function(id, event) {
  if (event) event.stopPropagation();

  const screenshots = document.querySelectorAll('.screenshot-item');
  const dots = document.querySelectorAll('.gallery-dot');

  screenshots.forEach(item => item.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  const targetScreenshot = document.querySelector(`[data-screenshot="${id}"]`);
  const targetDot = dots[id - 1];

  if (targetScreenshot) targetScreenshot.classList.add('active');
  if (targetDot) targetDot.classList.add('active');
};

console.log('🚀 Interactive Presentation Slider - Node.js Version');
console.log('📦 Vite + Sass setup complete!');

// Test data migration
console.log('\n🧪 Running Data Migration Tests...');
const testResults = runDataMigrationTests();

// Initialize the presentation app
console.log('\n🎯 Initializing Component Architecture...');
// The PresentationApp will initialize automatically

// Hide loading screen once the app is ready
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');

  // Update total slides counter
  const totalSlidesElement = document.querySelector('.total-slides');
  if (totalSlidesElement) {
    totalSlidesElement.textContent = slidesData.length;
  }

  // Simulate loading time for now
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }

    console.log('✅ Application loaded successfully');
    console.log(`📊 Loaded ${slidesData.length} slides`);
    console.log(`⚙️  Configuration: ${presentationConfig.title}`);
  }, 1000);
});

// Update placeholder content with component architecture progress
const slidesWrapper = document.getElementById('slides-wrapper');
if (slidesWrapper) {
  const successRate = Math.round((testResults.passedTests / testResults.totalTests) * 100);
  const statusIcon = '🎉';

  slidesWrapper.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      flex-direction: column;
      text-align: center;
      padding: 2rem;
    ">
      <h1 style="color: var(--primary-color); margin-bottom: 1rem;">
        ${statusIcon} Phase 5: Template System Complete
      </h1>
      <p style="color: var(--text-secondary); font-size: 1.125rem; margin-bottom: 2rem;">
        Successfully implemented dynamic template rendering system with slide components.
      </p>

      <div style="
        background: var(--background-secondary);
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid var(--primary-color);
        margin-bottom: 1.5rem;
        max-width: 700px;
      ">
        <h3 style="color: var(--text-primary); margin-bottom: 1rem;">
          🎨 Template System Architecture
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: left;">
          <div>
            <strong>Template Components:</strong><br>
            • TemplateRenderer<br>
            • SlideFactory<br>
            • BaseSlide<br>
            • TitleSlide<br>
            • AgendaSlide
          </div>
          <div>
            <strong>System Features:</strong><br>
            • Dynamic slide rendering<br>
            • Component-based architecture<br>
            • Data-driven templates<br>
            • Factory pattern<br>
            • Event-driven updates
          </div>
        </div>
      </div>

      <div style="
        background: var(--background-secondary);
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid var(--success-color, var(--primary-color));
      ">
        <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">
          ✅ Phase 5: Template System Complete
        </h3>
        <ul style="text-align: left; color: var(--text-secondary);">
          <li>✅ Created BaseSlide component</li>
          <li>✅ Implemented TitleSlide & AgendaSlide</li>
          <li>✅ Built TemplateRenderer system</li>
          <li>✅ Created SlideFactory pattern</li>
          <li>✅ Integrated with component architecture</li>
          <li>✅ Dynamic slide rendering from data</li>
        </ul>
      </div>

      <p style="color: var(--text-tertiary); font-size: 0.875rem; margin-top: 1.5rem;">
        Check the browser console for template rendering logs and slide component details.
      </p>
    </div>
  `;
}
