// Course content. The design lives in course.css and course.js; this file is only words.
// Each level is one screen. Block types: text, list, callout, flipcards, steps, scenario, quiz.
// Sources are listed per level and shown as small links at the bottom of the screen.

window.SOURCES = {
  W1: { label: 'WorkSafe: Lifting, carrying, pushing and pulling', url: 'https://www.worksafe.govt.nz/topic-and-industry/manual-handling/lifting-carrying-pushing-and-pulling-whats-the-problem/' },
  W2: { label: 'WorkSafe: Preventing manual handling injuries', url: 'https://www.worksafe.govt.nz/topic-and-industry/manual-handling/preventing-manual-handling-injuries-fs/' },
  ACC: { label: 'ACC: Moving and Handling People, the NZ Guidelines', url: 'https://www.acc.co.nz/assets/provider/1d98940288/acc6075-moving-and-handling-people-guidelines.pdf' },
};

window.COURSE = {
  title: 'Move safely',
  points: { level: 10, question: 20, scenario: 15 },
  levels: [
    {
      heading: 'Move safely, every shift',
      blocks: [
        { type: 'text', html: 'Kia ora, and welcome. Moving things and people is part of almost every support work shift. Done wrong, it\'s one of the most common ways workers get hurt.' },
        { type: 'text', html: 'In the next 10 minutes you\'ll learn how to:' },
        { type: 'list', items: ['spot the risks before you move anything', 'choose the safest way to do the job', 'know when to stop and get help or equipment'] },
        { type: 'callout', icon: 'star', title: 'How it works', html: 'Work through eight short levels. You\'ll earn points for each level you finish and for every question you get right first time. Your score shows at the end.' },
        { type: 'callout', icon: 'info', tone: 'note', title: 'Sample course', html: 'This is a sample course made for a portfolio. It isn\'t accredited training. Always follow your workplace\'s own procedures and training.' },
      ],
      next: 'Start level 2',
      sources: [],
    },
    {
      heading: 'Your back has to last your whole career',
      blocks: [
        { type: 'text', html: 'Lifting, carrying, pushing and pulling can injure your muscles, joints, nerves and bones. The most common result is pain and injury in the lower back.' },
        { type: 'text', html: 'Some injuries happen in a second, like a sudden strain. Others build up slowly over months, and by the time it hurts, the damage is done.' },
        { type: 'callout', icon: 'shield', title: 'You have a duty too', html: 'Under the Health and Safety at Work Act 2015, you must:' ,
          items: ['take reasonable care of your own health and safety', 'make sure what you do (or don\'t do) doesn\'t harm anyone else', 'follow your workplace\'s reasonable rules and instructions'],
          after: 'Your employer has to give you safe equipment, training and supervision.' },
      ],
      next: 'Start level 3',
      sources: ['W1', 'W2'],
    },
    {
      heading: 'Look before you move',
      blocks: [
        { type: 'text', html: 'Before any move, stop for a few seconds and check for risks. WorkSafe groups them into five kinds. Flip each card to see what to look for.' },
        { type: 'flipcards', cards: [
          { front: 'Physical', back: 'Heavy loads, awkward postures, reaching, or holding one position for a long time.' },
          { front: 'The way the work is set up', back: 'How the task, equipment and rosters are organised. A rushed shift with no equipment nearby is a risk.' },
          { front: 'Environment', back: 'Temperature, lighting and noise. A dim, cramped bathroom is harder to work in safely.' },
          { front: 'Pressure and stress', back: 'High workload, or having little say in how the job gets done. Rushing leads to shortcuts.' },
          { front: 'You', back: 'Your age, past injuries and how tired you are. A move that\'s fine at the start of a shift can be too much at the end.' },
        ] },
      ],
      next: 'Start level 4',
      sources: ['W1'],
    },
    {
      heading: 'The safest lift is the one you don\'t do',
      blocks: [
        { type: 'text', html: 'WorkSafe\'s rule is simple: first, remove the risk if you can. If you can\'t, make it smaller.' },
        { type: 'steps', items: [
          { title: 'Remove it', text: 'Can the job be done without anyone lifting?' },
          { title: 'Use equipment', text: 'Trolleys, hoists and slides do the heavy work, as long as they\'re used properly and looked after.' },
          { title: 'Set it up better', text: 'Keep heavy things at waist height and avoid lifting from the floor.' },
          { title: 'Then use good technique', text: 'Technique is the last line of defence, not the first.' },
        ] },
      ],
      next: 'Start level 5',
      sources: ['W1'],
    },
    {
      heading: 'When you do have to lift',
      blocks: [
        { type: 'text', html: 'If there\'s no way to avoid lifting something, do it the safe way:' },
        { type: 'list', items: [
          'If it\'s too heavy for you, don\'t lift it. Get help or equipment.',
          'Keep the load in front of you and close to your body.',
          'Lift with your legs, not your back.',
          'Move your feet to turn. Don\'t twist your back.',
          'Aim to lift between thigh and waist height.',
          'On long shifts, take short breaks and swap tasks so your muscles get a rest.',
        ] },
      ],
      next: 'Start level 6',
      sources: ['W1', 'W2'],
    },
    {
      heading: 'People aren\'t loads',
      blocks: [
        { type: 'text', html: 'Moving a person is different from moving a box. People can be unsteady, confused or unpredictable, and pain or medication can change how they move.' },
        { type: 'list', items: [
          'Follow the person\'s moving and handling plan. It says which method, which equipment and how many carers. If their condition has changed, check before you start.',
          'Tell the person what will happen and ask their permission first.',
          'Let them do as much as they safely can for themselves.',
          'Use equipment like hoists and slide sheets. Don\'t lift a person by hand.',
          'Only use techniques and equipment you\'ve been trained on.',
        ] },
      ],
      next: 'Start level 7',
      sources: ['W1', 'ACC'],
    },
    {
      heading: 'What would you do?',
      blocks: [
        { type: 'scenario',
          situation: 'You\'re helping a resident, Mere, who has slid down in her bed. Your colleague is in a hurry and says, "Just grab under her arms and we\'ll pull her up."',
          choices: [
            { text: 'Do what your colleague says. It\'ll only take a second.', feedback: 'Lifting someone under the arms can be painful for them and puts too much force on their shoulders. Being quick isn\'t worth an injury. Try again.' },
            { text: 'Check Mere\'s moving and handling plan, explain to Mere what you\'re doing, then use the equipment the plan lists, like a slide sheet.', best: true, feedback: 'That\'s it. The plan tells you the right method, Mere knows what\'s happening, and the equipment takes the strain.' },
            { text: 'Tell your colleague you\'d rather not, and do it on your own later.', feedback: 'Good instinct to say no, but doing it alone is riskier. Say why it\'s unsafe, check the plan and use the right equipment together. Try again.' },
          ] },
      ],
      next: 'Start level 8',
      sources: ['ACC'],
    },
    {
      heading: 'Check what you know',
      blocks: [
        { type: 'text', html: 'Five questions. Get each one right first time to earn its points.' },
        { type: 'quiz', questions: [
          { q: 'What\'s the most common injury from manual handling?', options: ['Cuts to the hands', 'Lower back pain and injury', 'Broken toes'], answer: 1, feedback: 'Lower back injuries are the most common result.' },
          { q: 'What should you try first?', options: ['Lift carefully with good technique', 'Find a way to do the job without lifting', 'Ask for a back brace'], answer: 1, feedback: 'Remove the risk first. Technique comes last.' },
          { q: 'You need to turn while carrying a box. What do you do?', options: ['Twist at the waist', 'Move your feet', 'Hold the box further away'], answer: 1, feedback: 'Move your feet so your back doesn\'t twist.' },
          { q: 'Which of these is a "pressure and stress" risk?', options: ['A heavy box', 'A slippery floor', 'Being rushed with too much to do'], answer: 2, feedback: 'High workload and low control over the job are pressure and stress risks.' },
          { q: 'Under the law, which is your duty as a worker?', options: ['Buy your own lifting equipment', 'Follow your workplace\'s reasonable procedures', 'Write the training for new staff'], answer: 1, feedback: 'Workers must take reasonable care and follow reasonable instructions.' },
        ] },
      ],
      next: 'See my results',
      sources: ['W1', 'W2'],
    },
  ],
  summary: [
    'Look for risks before every move.',
    'Remove the lift first, use equipment second, technique last.',
    'If it\'s too heavy or you\'re unsure, stop and ask.',
  ],
};
