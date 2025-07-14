// Data Migration Test
// This file tests the extracted slide data for completeness and accuracy

import { slidesData } from '../data/slides.js';
import { presentationConfig } from '../data/config.js';
import { validateSlideData } from './validation.js';

/**
 * Test the data migration results
 */
export function testDataMigration() {
  console.log('🧪 Testing Data Migration...');
  console.log('================================');
  
  const results = {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    errors: []
  };
  
  // Test 1: Basic slide count
  results.totalTests++;
  console.log('📊 Test 1: Slide Count');
  if (slidesData.length === presentationConfig.totalSlides) {
    console.log(`✅ PASS: Found ${slidesData.length} slides (expected ${presentationConfig.totalSlides})`);
    results.passedTests++;
  } else {
    const error = `❌ FAIL: Found ${slidesData.length} slides, expected ${presentationConfig.totalSlides}`;
    console.log(error);
    results.failedTests++;
    results.errors.push(error);
  }
  
  // Test 2: Slide validation
  results.totalTests++;
  console.log('\n🔍 Test 2: Slide Data Validation');
  const validation = validateSlideData(slidesData);
  if (validation.success) {
    console.log(`✅ PASS: All ${validation.totalSlides} slides are valid`);
    results.passedTests++;
  } else {
    const error = `❌ FAIL: ${validation.invalidSlides} slides have validation errors`;
    console.log(error);
    validation.errors.forEach(err => {
      console.log(`   - ${err.message} (${err.slideId || 'unknown'})`);
    });
    results.failedTests++;
    results.errors.push(error);
  }
  
  // Test 3: Slide types coverage
  results.totalTests++;
  console.log('\n🎯 Test 3: Slide Types Coverage');
  const expectedTypes = ['title', 'agenda', 'timeline', 'workflow', 'platform', 'gallery', 'security', 'conclusion'];
  const actualTypes = [...new Set(slidesData.map(slide => slide.type))];
  const missingTypes = expectedTypes.filter(type => !actualTypes.includes(type));
  
  if (missingTypes.length === 0) {
    console.log(`✅ PASS: All expected slide types found: ${actualTypes.join(', ')}`);
    results.passedTests++;
  } else {
    const error = `❌ FAIL: Missing slide types: ${missingTypes.join(', ')}`;
    console.log(error);
    results.failedTests++;
    results.errors.push(error);
  }
  
  // Test 4: Content completeness
  results.totalTests++;
  console.log('\n📝 Test 4: Content Completeness');
  const contentTests = [
    { test: 'Title slide has presenters', check: () => slidesData[0].presenters === 'Reduan Masud & Arafat' },
    { test: 'Agenda slide has 8 items', check: () => slidesData[1].agendaItems.length === 8 },
    { test: 'Timeline has 5 milestones', check: () => slidesData[2].timeline.milestones.length === 5 },
    { test: 'Workflow has 3 steps', check: () => slidesData[3].workflow.steps.length === 3 },
    { test: 'Gallery has 3 screenshots', check: () => slidesData[5].gallery.screenshots.length === 3 },
    { test: 'Security has 4 categories', check: () => slidesData[6].security.categories.length === 4 }
  ];
  
  let contentPassed = 0;
  contentTests.forEach(({ test, check }) => {
    try {
      if (check()) {
        console.log(`   ✅ ${test}`);
        contentPassed++;
      } else {
        console.log(`   ❌ ${test}`);
      }
    } catch (error) {
      console.log(`   ❌ ${test} (Error: ${error.message})`);
    }
  });
  
  if (contentPassed === contentTests.length) {
    console.log(`✅ PASS: All ${contentTests.length} content tests passed`);
    results.passedTests++;
  } else {
    const error = `❌ FAIL: ${contentTests.length - contentPassed} content tests failed`;
    console.log(error);
    results.failedTests++;
    results.errors.push(error);
  }
  
  // Test 5: External links validation
  results.totalTests++;
  console.log('\n🔗 Test 5: External Links');
  const links = [];
  
  // Extract links from slides
  slidesData.forEach(slide => {
    if (slide.type === 'platform' && slide.platform.preview?.url) {
      links.push(slide.platform.preview.url);
    }
    if (slide.type === 'gallery') {
      slide.gallery.screenshots.forEach(screenshot => {
        if (screenshot.demoLink) links.push(screenshot.demoLink);
      });
      if (slide.gallery.projectLink?.url) {
        links.push(slide.gallery.projectLink.url);
      }
    }
  });
  
  if (links.length > 0) {
    console.log(`✅ PASS: Found ${links.length} external links`);
    links.forEach(link => console.log(`   - ${link}`));
    results.passedTests++;
  } else {
    const error = '❌ FAIL: No external links found';
    console.log(error);
    results.failedTests++;
    results.errors.push(error);
  }
  
  // Test 6: Slide sequence
  results.totalTests++;
  console.log('\n🔢 Test 6: Slide Sequence');
  const slideNumbers = slidesData.map(slide => slide.slideNumber).sort((a, b) => a - b);
  const expectedSequence = Array.from({ length: slidesData.length }, (_, i) => i + 1);
  const sequenceCorrect = JSON.stringify(slideNumbers) === JSON.stringify(expectedSequence);
  
  if (sequenceCorrect) {
    console.log(`✅ PASS: Slide sequence is correct (1-${slidesData.length})`);
    results.passedTests++;
  } else {
    const error = `❌ FAIL: Slide sequence is incorrect. Found: ${slideNumbers.join(', ')}`;
    console.log(error);
    results.failedTests++;
    results.errors.push(error);
  }
  
  // Summary
  console.log('\n📋 Test Summary');
  console.log('================');
  console.log(`Total Tests: ${results.totalTests}`);
  console.log(`Passed: ${results.passedTests}`);
  console.log(`Failed: ${results.failedTests}`);
  console.log(`Success Rate: ${Math.round((results.passedTests / results.totalTests) * 100)}%`);
  
  if (results.failedTests === 0) {
    console.log('\n🎉 All tests passed! Data migration is successful.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
  
  return results;
}

/**
 * Generate a data migration report
 */
export function generateMigrationReport() {
  console.log('\n📊 Data Migration Report');
  console.log('=========================');
  
  // Slide overview
  console.log('\n📑 Slide Overview:');
  slidesData.forEach((slide, index) => {
    console.log(`${index + 1}. ${slide.title} (${slide.type})`);
  });
  
  // Type distribution
  console.log('\n📈 Type Distribution:');
  const typeCount = {};
  slidesData.forEach(slide => {
    typeCount[slide.type] = (typeCount[slide.type] || 0) + 1;
  });
  Object.entries(typeCount).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} slide${count > 1 ? 's' : ''}`);
  });
  
  // Content statistics
  console.log('\n📊 Content Statistics:');
  const stats = {
    totalAgendaItems: slidesData[1]?.agendaItems?.length || 0,
    totalMilestones: slidesData[2]?.timeline?.milestones?.length || 0,
    totalWorkflowSteps: slidesData[3]?.workflow?.steps?.length || 0,
    totalScreenshots: slidesData[5]?.gallery?.screenshots?.length || 0,
    totalSecurityCategories: slidesData[6]?.security?.categories?.length || 0
  };
  
  Object.entries(stats).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase());
    console.log(`   ${label}: ${value}`);
  });
  
  console.log('\n✅ Migration report complete!');
}

/**
 * Run all data migration tests
 */
export function runDataMigrationTests() {
  const testResults = testDataMigration();
  generateMigrationReport();
  return testResults;
}

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - add to window for manual testing
  window.testDataMigration = runDataMigrationTests;
}
