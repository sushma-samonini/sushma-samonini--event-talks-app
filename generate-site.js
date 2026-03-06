const fs = require('fs');
const path = require('path');

const talksData = [
  {
    id: 'talk1',
    title: 'Modern JavaScript Features',
    speakers: ['Alice Johnson'],
    category: ['JavaScript', 'Frontend'],
    description: 'Dive into ES2023 features that will streamline your development workflow.',
  },
  {
    id: 'talk2',
    title: 'Scaling Node.js Applications',
    speakers: ['Bob Williams', 'Charlie Davis'],
    category: ['Node.js', 'Backend', 'Architecture'],
    description: 'Strategies and best practices for building scalable Node.js services.',
  },
  {
    id: 'talk3',
    title: 'CSS Grid & Flexbox Mastery',
    speakers: ['Diana Miller'],
    category: ['CSS', 'Frontend', 'Design'],
    description: 'Unlock the full potential of modern CSS layout techniques.',
  },
  {
    id: 'talk4',
    title: 'Introduction to WebAssembly',
    speakers: ['Eve Brown'],
    category: ['Web Development', 'Performance'],
    description: 'Explore the power of WebAssembly and how it can boost your web applications.',
  },
  {
    id: 'talk5',
    title: 'Database Design for Microservices',
    speakers: ['Frank Green'],
    category: ['Backend', 'Databases', 'Architecture'],
    description: 'Best practices for designing and managing databases in a microservices environment.',
  },
  {
    id: 'talk6',
    title: 'Testing React Components with Jest',
    speakers: ['Grace White', 'Heidi Black'],
    category: ['Frontend', 'Testing', 'React'],
    description: 'Learn how to effectively test your React components to ensure reliability.',
  },
];

const eventDetails = {
  eventStartTime: '10:00', // HH:MM
  talkDurationMinutes: 60,
  transitionDurationMinutes: 10,
  lunchDurationMinutes: 60,
  lunchBreakPosition: 2, // After the 2nd talk
};

function calculateSchedule(talks, details) {
  const schedule = [];
  let currentMoment = new Date(`2000-01-01T${details.eventStartTime}:00`); // Use a dummy date

  for (let i = 0; i < talks.length; i++) {
    const talk = { ...talks[i] }; // Create a copy to add timing info

    if (i === details.lunchBreakPosition) {
      // Add lunch break
      const lunchStartTime = new Date(currentMoment);
      currentMoment.setMinutes(currentMoment.getMinutes() + details.lunchDurationMinutes);
      const lunchEndTime = new Date(currentMoment);

      schedule.push({
        type: 'break',
        title: 'Lunch Break',
        startTime: lunchStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        endTime: lunchEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        duration: details.lunchDurationMinutes,
      });

      // Add transition after lunch
      currentMoment.setMinutes(currentMoment.getMinutes() + details.transitionDurationMinutes);
    }

    // Add talk
    talk.startTime = currentMoment.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    currentMoment.setMinutes(currentMoment.getMinutes() + details.talkDurationMinutes);
    talk.endTime = currentMoment.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    talk.duration = details.talkDurationMinutes;
    talk.type = 'talk';

    schedule.push(talk);

    // Add transition after talk (unless it's the last talk)
    if (i < talks.length - 1) {
      currentMoment.setMinutes(currentMoment.getMinutes() + details.transitionDurationMinutes);
    }
  }
  return schedule;
}

const generateSite = async () => {
  const schedule = calculateSchedule(talksData, eventDetails);
  const scheduledTalksData = JSON.stringify(schedule);

  let htmlTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'index.html.template'), 'utf8');
  const cssContent = fs.readFileSync(path.join(__dirname, 'src', 'style.css'), 'utf8');
  let jsContent = fs.readFileSync(path.join(__dirname, 'src', 'script.js'), 'utf8');

  // Inject scheduled talks data into script.js
  jsContent = `const talksData = ${scheduledTalksData};
` + jsContent;

  // Inline CSS and JS into HTML
  htmlTemplate = htmlTemplate.replace('<!-- INLINE_CSS -->', `<style>${cssContent}</style>`);
  htmlTemplate = htmlTemplate.replace('<!-- INLINE_SCRIPT -->', `<script>${jsContent}</script>`);

  // Write the final HTML file
  const outputPath = path.join(__dirname, 'public', 'index.html');
  fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
  console.log(`Successfully generated ${outputPath}`);
};

generateSite().catch(console.error);