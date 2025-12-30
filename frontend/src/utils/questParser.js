
/**
 * Quest Schedule Parser
 * 
 * Parses course schedule data copied from UWaterloo Quest Class Schedule page.
 * Extracts course information such as course code code, name, term, section, meeting times.
 * 
 * Expected Quest format:
 * - Term header: "Fall 2025 | Undergraduate | University of Waterloo"
 * - Course header: "CS 246 - Obj-Oriented Soft Dev"
 * - Section rows: Class #, Section #, Component, Days & Times
 * - Only extracts LEC (lecture) sections, ignores TUT/TST/LAB
 * 
 *
 *
 * Example Input:
 * Fall 2025 | Undergraduate
 *   CS 246 - Object-Oriented Software Development
 *   6923
 *   003
 *   LEC
 *   TTh 1:00PM - 2:20PM
 * 
 */

// Helper: Convert term name to code
const termToCode = (termString) => {
  const match = termString.match(/(Winter|Spring|Fall)\s+(\d{4})/);
  if (!match) return null;
  
  const [_, season, year] = match;
  const yearCode = year.slice(-2); // "2025" → "25"
  
  const seasonMap = {
    'Winter': '1',
    'Spring': '5',
    'Fall': '9'
  };
  
  return `1${yearCode}${seasonMap[season]}`;
};

// Helper: Convert 12h to 24h time
const convertTo24h = (timeStr) => {
  const [time, period] = [timeStr.slice(0, -2), timeStr.slice(-2)];
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

// Main parser
export const parseQuestSchedule = (text) => {
  const courses = [];
  const lines = text.split('\n').map(line => line.trim());
  
  // Extract term
  let currentTerm = null;
  for (const line of lines) {
    const termMatch = line.match(/(Winter|Spring|Fall)\s+(\d{4})/);
    if (termMatch) {
      currentTerm = termToCode(termMatch[0]);
      break;
    }
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match course header: "CS 245 - Logic & Computation"
    const courseMatch = line.match(/^([A-Z]{2,5}\s+\d{3}[A-Z]?)\s+-\s+(.+)$/);
    if (!courseMatch) continue;
    
    const courseCode = courseMatch[1].trim();
    const courseName = courseMatch[2].trim();
    
    // Look ahead for LEC sections
    for (let j = i + 1; j < lines.length; j++) {
      // Stop if we hit another course
      if (lines[j].match(/^([A-Z]{2,5}\s+\d{3}[A-Z]?)\s+-\s+(.+)$/)) {
        i = j - 1; // Continue from here
        break;
      }
      
      // Check if this line is "LEC"
      if (lines[j] === 'LEC') {
        // Section should be 2 lines before (j-2)
        // Pattern: Class# (j-3), Section (j-2), Component (j-1 should be empty or irrelevant), LEC (j)
        
        // Actually the pattern is:
        // Class Nbr (j-2)
        // Section (j-1)  
        // LEC (j)
        // Time (j+1)
        
        const sectionLine = lines[j - 1];
        const section = sectionLine?.match(/^\d{3}$/) ? sectionLine : null;
        
        if (!section) continue;
        
        // Time should be next line (j+1)
        const timeLine = lines[j + 1];
        const timeMatch = timeLine?.match(/^([MTWThF]+)\s+(\d{1,2}:\d{2}[AP]M)\s+-\s+(\d{1,2}:\d{2}[AP]M)/);
        
        if (!timeMatch) continue;
        
        const daysStr = timeMatch[1];
        const startTime = timeMatch[2];
        const endTime = timeMatch[3];
        
        // Parse days
        const days = [];
        let m = 0;
        while (m < daysStr.length) {
          if (daysStr.substring(m, m + 2) === 'Th') {
            days.push('Thursday');
            m += 2;
          } else {
            const dayMap = { 'M': 'Monday', 'T': 'Tuesday', 'W': 'Wednesday', 'F': 'Friday' };
            if (dayMap[daysStr[m]]) {
              days.push(dayMap[daysStr[m]]);
            }
            m++;
          }
        }
        
        // Save course
        if (currentTerm && days.length > 0) {
          courses.push({
            course_code: courseCode,
            course_name: courseName,
            term: currentTerm,
            section: section,
            days_of_week: days,
            start_time: convertTo24h(startTime),
            end_time: convertTo24h(endTime)
          });
        }
      }
    }
  }
  
  return courses;
};