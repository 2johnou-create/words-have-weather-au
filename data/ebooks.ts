import type { EpisodeCategory } from "./episodes";

export type EbookPage = {
  pageNumber: number;
  kind: "cover" | "story" | "practice" | "adult-notes";
  kicker?: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
};

export type Ebook = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: EpisodeCategory;
  ages: string;
  characters: string[];
  hook: string;
  blurb: string;
  releaseDate: string;
  keyMessage: string;
  learningFocus: string[];
  curriculum: string[];
  pages: EbookPage[];
  pdfPath: string;
  epubPath: string;
};

const art = (slug: string, scene: number) =>
  `/ebooks/art/${slug}/scene-${String(scene).padStart(2, "0")}.jpg`;

export const ebooks: Ebook[] = [
  {
    id: "WHW-EB-001",
    slug: "mina-and-the-missing-shoe",
    title: "Mina and the Missing Shoe",
    subtitle: "A four-minute morning storm",
    category: "Sprout",
    ages: "4-7",
    characters: ["Mina", "Alex", "Willo"],
    hook: "The front door felt a thousand footsteps away - and the bus was due in four minutes.",
    blurb: "A missing shoe, a sharp sentence and one small choice turn the morning rush into a story about keeping the deadline without making Mina the problem.",
    releaseDate: "2026-08-25",
    keyMessage: "Name the problem, keep the boundary and offer one doable choice without turning a difficult moment into a label about the child.",
    learningFocus: ["Morning transitions", "Behaviour is not identity", "Choice inside a boundary"],
    curriculum: ["EYLF V2.0 - Outcome 1: identity and agency", "EYLF V2.0 - Outcome 3: wellbeing", "Australian Curriculum v9.0 - Personal and Social capability"],
    pdfPath: "/ebook-downloads/mina-and-the-missing-shoe-education-edition.pdf",
    epubPath: "/ebook-downloads/mina-and-the-missing-shoe.epub",
    pages: [
      { pageNumber: 1, kind: "cover", kicker: "A Words Have Weather Story eBook", title: "Mina and the Missing Shoe", text: "A four-minute morning storm", image: art("mina-and-the-missing-shoe", 1), imageAlt: "Mina searches for a missing shoe while Alex waits by the front door." },
      { pageNumber: 2, kind: "story", kicker: "The hook", title: "Four minutes", text: "The front door felt a thousand footsteps away - and the bus was due in four minutes. Mina had one yellow sock, one red shoe and no blue shoe anywhere.", image: art("mina-and-the-missing-shoe", 1), imageAlt: "Mina searches the hallway for her blue shoe as the school morning moves quickly." },
      { pageNumber: 3, kind: "story", kicker: "The pressure line", title: "A line lands", text: "Alex looked at the clock. \"Why do you always make us late?\" The words came out faster than Alex meant them to.", image: art("mina-and-the-missing-shoe", 2), imageAlt: "Alex speaks sharply while Mina freezes beside the shoe rack." },
      { pageNumber: 4, kind: "story", kicker: "Possible word-weather", title: "The hallway shrinks", text: "Mina stopped looking. A small grey cloud gathered around her shoulders. Willo's leaf ears dipped. \"She may hear that she is the problem,\" Willo said.", image: art("mina-and-the-missing-shoe", 3), imageAlt: "Willo notices a small grey cloud around Mina as she sits by the shoe rack." },
      { pageNumber: 5, kind: "story", kicker: "Keep the boundary", title: "The bus is still coming", text: "Alex breathed out. The time did not change. School did not disappear. But the next sentence could.", image: art("mina-and-the-missing-shoe", 4), imageAlt: "Alex pauses near Mina while keeping the leaving-for-school boundary." },
      { pageNumber: 6, kind: "story", kicker: "Repair", title: "Try the next sentence", text: "\"That came out sharp. We still need to leave. We can look together for one minute, or you can wear the red pair. Which works?\"", image: art("mina-and-the-missing-shoe", 4), imageAlt: "Alex offers Mina two clear footwear choices with a calm open hand." },
      { pageNumber: 7, kind: "story", kicker: "A small choice", title: "Red will do", text: "Mina did not smile. She looked once more behind the basket, then pulled on the other red shoe. \"Red,\" she said.", image: art("mina-and-the-missing-shoe", 5), imageAlt: "Mina chooses the red shoes while Alex checks under the sofa." },
      { pageNumber: 8, kind: "story", kicker: "Carry it forward", title: "Not perfect. Possible.", text: "They reached the corner as the bus rolled near. The blue shoe was still missing. The morning was still hurried. But Mina was not the thing that needed fixing.", image: art("mina-and-the-missing-shoe", 6), imageAlt: "Mina and Alex walk together toward a suburban bus stop in calmer light." },
      { pageNumber: 9, kind: "practice", kicker: "Read it again", title: "What changed the weather?", text: "The boundary stayed: they had to leave. The weather shifted when Alex repaired the label, named the real problem and made the next step small enough to choose.", image: art("mina-and-the-missing-shoe", 6), imageAlt: "Willo follows Mina and Alex as the cloudy morning opens into warmer light." },
      { pageNumber: 10, kind: "practice", kicker: "Try it together", title: "Two shoes, two sentences", text: "Say the pressure line once. Pause. Then try: \"We need to leave. Look together for one minute, or wear the other pair?\" Ask the child which version gives them more room to think.", image: art("mina-and-the-missing-shoe", 2), imageAlt: "A calm hallway moment with the two pairs of shoes visible." },
      { pageNumber: 11, kind: "practice", kicker: "Willo wonders", title: "Where did the problem go?", text: "In the first line, Mina sounded like the problem. In the next line, the missing shoe and the deadline became the problem adults and children could face together.", image: art("mina-and-the-missing-shoe", 3), imageAlt: "Willo watches the word-weather around the hallway change." },
      { pageNumber: 12, kind: "adult-notes", kicker: "For parents, carers and educators", title: "Adult notes", text: "Key message: keep the leaving boundary and separate the child from the problem. Try: (1) act out both sentences with two toy shoes; (2) draw the weather each line might create; (3) rehearse two acceptable choices before the next rushed morning. With younger children, use fewer words and show the choices. A calm sentence may help; it does not guarantee immediate cooperation.", image: "/character-lineup.png", imageAlt: "The Words Have Weather cast together." },
    ],
  },
  {
    id: "WHW-EB-002",
    slug: "leo-and-the-cup-that-slipped",
    title: "Leo and the Cup That Slipped",
    subtitle: "A spill is something to solve, not someone to blame",
    category: "Sprout",
    ages: "4-7",
    characters: ["Leo", "Ms Chen", "Willo"],
    hook: "The water hit the floor before Leo's cardboard tower did.",
    blurb: "When a classroom spill becomes a label, Ms Chen repairs the line, keeps everyone safe and gives Leo a way back into the moment.",
    releaseDate: "2026-08-25",
    keyMessage: "Describe what happened and the safety step that comes next; avoid turning an accident into a judgement about the child.",
    learningFocus: ["Accidents and repair", "Classroom safety", "Specific, non-shaming language"],
    curriculum: ["EYLF V2.0 - Outcome 3: wellbeing", "EYLF V2.0 - Outcome 5: communication", "Australian Curriculum v9.0 - Personal and Social capability"],
    pdfPath: "/ebook-downloads/leo-and-the-cup-that-slipped-education-edition.pdf",
    epubPath: "/ebook-downloads/leo-and-the-cup-that-slipped.epub",
    pages: [
      { pageNumber: 1, kind: "cover", kicker: "A Words Have Weather Story eBook", title: "Leo and the Cup That Slipped", text: "A spill is something to solve, not someone to blame", image: art("leo-and-the-cup-that-slipped", 1), imageAlt: "Leo reaches across a classroom table as a cup begins to tip." },
      { pageNumber: 2, kind: "story", kicker: "The hook", title: "Before the tower", text: "The water hit the floor before Leo's cardboard tower did. It raced under the table and around Ms Chen's shoe.", image: art("leo-and-the-cup-that-slipped", 1), imageAlt: "Water spills beside Leo's cardboard tower during a classroom activity." },
      { pageNumber: 3, kind: "story", kicker: "The pressure line", title: "Careful?", text: "\"Careful! You never watch what you're doing,\" Ms Chen said. Leo's hands stopped in the air.", image: art("leo-and-the-cup-that-slipped", 2), imageAlt: "Ms Chen reacts sharply while Leo pulls his shoulders inward after the spill." },
      { pageNumber: 4, kind: "story", kicker: "Possible word-weather", title: "A chilly drizzle", text: "A cold blue drizzle appeared around Leo. Willo tilted one leaf ear. \"He may hear that accidents are who he is,\" Willo said.", image: art("leo-and-the-cup-that-slipped", 3), imageAlt: "Willo notices chilly blue word-weather gathering around Leo." },
      { pageNumber: 5, kind: "story", kicker: "Keep safety", title: "Feet first", text: "Ms Chen held one hand up so the class stayed clear of the slippery patch. Safety still mattered. So did the way back.", image: art("leo-and-the-cup-that-slipped", 4), imageAlt: "Ms Chen keeps children away from the wet floor while kneeling near Leo." },
      { pageNumber: 6, kind: "story", kicker: "Repair", title: "Name what happened", text: "\"I made that sound like you were the problem. The cup spilled and the floor is slippery. Cloth or paper towel - which will you use?\"", image: art("leo-and-the-cup-that-slipped", 4), imageAlt: "Ms Chen offers Leo a cloth or paper towel choice." },
      { pageNumber: 7, kind: "story", kicker: "A way back", title: "The cloth", text: "Leo watched the puddle for a moment. Then he chose the cloth. Ms Chen took the other corner. They pushed the water into one small shining line.", image: art("leo-and-the-cup-that-slipped", 5), imageAlt: "Leo and Ms Chen clean the spill together after a pause." },
      { pageNumber: 8, kind: "story", kicker: "Carry it forward", title: "Still building", text: "Leo's tower leaned. His cheeks were still warm. But his hands started again - one careful cardboard piece at a time.", image: art("leo-and-the-cup-that-slipped", 6), imageAlt: "Leo returns to his cardboard tower while Ms Chen offers a calm nod." },
      { pageNumber: 9, kind: "practice", kicker: "Read it again", title: "Accident or identity?", text: "\"The cup spilled\" names an event. \"You never watch\" makes a story about Leo. Specific words leave more room for safety, learning and repair.", image: art("leo-and-the-cup-that-slipped", 3), imageAlt: "Willo observes the difference between chilly and calmer word-weather." },
      { pageNumber: 10, kind: "practice", kicker: "Try it together", title: "Spill rehearsal", text: "Tip an empty cup on purpose. Practise three steps: stop feet, name the spill, choose a clean-up tool. Keep the game light and never use a real mistake as a public lesson.", image: art("leo-and-the-cup-that-slipped", 5), imageAlt: "A classroom cloth and paper towel sit beside a safely cleaned table." },
      { pageNumber: 11, kind: "practice", kicker: "Willo wonders", title: "What could Ms Chen keep?", text: "Ms Chen did not have to pretend the floor was safe. She kept the safety boundary and changed the part that labelled Leo.", image: art("leo-and-the-cup-that-slipped", 6), imageAlt: "Willo's chest mark glows softly beside Leo's rebuilt tower." },
      { pageNumber: 12, kind: "adult-notes", kicker: "For parents, carers and educators", title: "Adult notes", text: "Key message: describe the event, protect safety and make repair possible without shame. Try: (1) sort phrases into event words and identity labels; (2) role-play stop-name-choose; (3) invite children to draw what responsibility can look like after an accident. For ages 4-5, keep to one instruction at a time. Do not require an apology before safety is restored.", image: "/character-lineup.png", imageAlt: "The Words Have Weather cast together." },
    ],
  },
  {
    id: "WHW-EB-003",
    slug: "zahra-and-the-group-chat-storm",
    title: "Zahra and the Group Chat Storm",
    subtitle: "A full stop has no face",
    category: "All Ages",
    ages: "8-12",
    characters: ["Zahra", "Leo", "Arthur", "Willo"],
    hook: "One full stop turned a joke into a storm.",
    blurb: "An ambiguous message grows a face, a tone and a whole argument until Zahra learns to check meaning before answering the weather she imagined.",
    releaseDate: "2026-08-25",
    keyMessage: "Digital messages lose tone and expression; pause, protect privacy and check meaning before treating an interpretation as a fact.",
    learningFocus: ["Digital communication", "Checking assumptions", "Privacy and respectful group work"],
    curriculum: ["Australian Curriculum v9.0 - Digital Literacy", "Australian Curriculum v9.0 - Personal and Social capability", "Australian Curriculum v9.0 - English: interacting with others"],
    pdfPath: "/ebook-downloads/zahra-and-the-group-chat-storm-education-edition.pdf",
    epubPath: "/ebook-downloads/zahra-and-the-group-chat-storm.epub",
    pages: [
      { pageNumber: 1, kind: "cover", kicker: "A Words Have Weather Story eBook", title: "Zahra and the Group Chat Storm", text: "A full stop has no face", image: art("zahra-and-the-group-chat-storm", 1), imageAlt: "Zahra reads an ambiguous group-chat message on a tablet." },
      { pageNumber: 2, kind: "story", kicker: "The hook", title: "One full stop", text: "One full stop turned a joke into a storm. On Zahra's screen, Leo had written only: \"Fine.\"", image: art("zahra-and-the-group-chat-storm", 1), imageAlt: "Zahra looks uncertain at an unreadable short message on her tablet." },
      { pageNumber: 3, kind: "story", kicker: "The fast story", title: "Zahra adds a face", text: "Zahra heard an eye-roll. She pictured a smirk. Her fingers answered the face she had imagined, not the three letters Leo had sent.", image: art("zahra-and-the-group-chat-storm", 2), imageAlt: "Zahra types quickly as subtle stormy word-weather gathers around the tablet." },
      { pageNumber: 4, kind: "story", kicker: "Possible word-weather", title: "Two rooms, one storm", text: "Across town, Leo stared at Zahra's reply. Willo watched the storm stretch between two quiet rooms. Neither screen showed the voice behind the words.", image: art("zahra-and-the-group-chat-storm", 3), imageAlt: "Leo reads a message at home and looks uncertain." },
      { pageNumber: 5, kind: "story", kicker: "The pause", title: "No faces in a message", text: "The next day Arthur found them at opposite ends of a library table. \"A message has no face,\" he said. \"Ask before you lend it one.\"", image: art("zahra-and-the-group-chat-storm", 4), imageAlt: "Zahra and Leo sit apart in a library while Arthur quietly shelves books." },
      { pageNumber: 6, kind: "story", kicker: "Try the next sentence", title: "Check meaning", text: "Zahra put her tablet face-down. \"When I read 'fine', I thought you were angry. Was that what you meant?\"", image: art("zahra-and-the-group-chat-storm", 5), imageAlt: "Zahra asks Leo a question with an open listening gesture." },
      { pageNumber: 7, kind: "story", kicker: "An answer", title: "The missing voice", text: "Leo shook his head. He had been hurrying to dinner. \"I meant the poster plan was fine. I didn't know it sounded sharp.\"", image: art("zahra-and-the-group-chat-storm", 5), imageAlt: "Leo explains while Zahra listens and Willo's cloud begins to thin." },
      { pageNumber: 8, kind: "story", kicker: "Repair", title: "Slow enough to hear", text: "They agreed: if a message felt hot, they would pause. No screenshots. No forwarding. First, one question in private.", image: art("zahra-and-the-group-chat-storm", 6), imageAlt: "The group talks with devices face-down around the library table." },
      { pageNumber: 9, kind: "practice", kicker: "Read it again", title: "Fact, guess or question?", text: "Fact: Leo wrote a short reply. Guess: Leo was angry. Question: \"Was that what you meant?\" A question makes room for information the screen cannot carry.", image: art("zahra-and-the-group-chat-storm", 2), imageAlt: "Willo notices the difference between a digital guess and a clarifying question." },
      { pageNumber: 10, kind: "practice", kicker: "Try it together", title: "Give the message three voices", text: "Read the same short sentence as rushed, cheerful and annoyed. Which parts are visible in text? Create a family or class rule for hot messages: pause, keep it private, check.", image: art("zahra-and-the-group-chat-storm", 6), imageAlt: "Zahra, Leo and their group practise talking before returning to devices." },
      { pageNumber: 11, kind: "practice", kicker: "Willo wonders", title: "What stayed private?", text: "Zahra asked Leo directly. She did not recruit an audience, post a screenshot or demand an immediate answer. Repair had a smaller, safer room.", image: art("zahra-and-the-group-chat-storm", 4), imageAlt: "Arthur and Willo keep a respectful distance while Zahra and Leo speak privately." },
      { pageNumber: 12, kind: "adult-notes", kicker: "For parents, carers and educators", title: "Adult notes", text: "Key message: text removes tone, so check meaning before acting on an interpretation. Try: (1) label examples fact, guess or question; (2) write a three-step hot-message plan; (3) compare a message with an in-person version. Keep examples fictional, never project a child's real chat to a group, and follow school or family online-safety procedures where harm is possible.", image: "/character-lineup.png", imageAlt: "The Words Have Weather cast together." },
    ],
  },
  {
    id: "WHW-EB-004",
    slug: "minas-last-jump",
    title: "Mina's Last Jump",
    subtitle: "The boundary stayed when screen time ended",
    category: "All Ages",
    ages: "6-10",
    characters: ["Mina", "Alex", "Willo"],
    hook: "The game was one jump from saving when the timer chimed.",
    blurb: "Mina is not ready to stop. Alex keeps the screen-time limit, repairs an abrupt command and offers a small piece of control inside a non-negotiable ending.",
    releaseDate: "2026-08-25",
    keyMessage: "A firm boundary can include acknowledgement, a brief transition cue and limited choice; respectful words do not require the adult to remove the limit.",
    learningFocus: ["Screen transitions", "Choice within limits", "Acknowledging disappointment"],
    curriculum: ["Australian Curriculum v9.0 - Personal and Social capability", "Australian Curriculum v9.0 - Digital Literacy", "EYLF V2.0 - Outcome 3: wellbeing"],
    pdfPath: "/ebook-downloads/minas-last-jump-education-edition.pdf",
    epubPath: "/ebook-downloads/minas-last-jump.epub",
    pages: [
      { pageNumber: 1, kind: "cover", kicker: "A Words Have Weather Story eBook", title: "Mina's Last Jump", text: "The boundary stayed when screen time ended", image: art("minas-last-jump", 1), imageAlt: "Mina focuses on a tablet game as the screen-time timer lights up." },
      { pageNumber: 2, kind: "story", kicker: "The hook", title: "One jump away", text: "The game was one jump from saving when the timer chimed. Mina leaned closer. Her thumbs moved faster.", image: art("minas-last-jump", 1), imageAlt: "Mina concentrates on an unbranded game as a timer signals the end." },
      { pageNumber: 3, kind: "story", kicker: "The pressure line", title: "Off. Now.", text: "\"Off. Now. I won't ask again,\" Alex called from the kitchen. Mina held the tablet tighter.", image: art("minas-last-jump", 2), imageAlt: "Alex gives an abrupt instruction while Mina grips the tablet." },
      { pageNumber: 4, kind: "story", kicker: "Possible word-weather", title: "The room crackles", text: "Orange word-weather crackled between them. Willo lifted one palm. \"She may hear only the power, not the plan,\" Willo said.", image: art("minas-last-jump", 3), imageAlt: "Willo notices crackling orange word-weather as Mina turns away upset." },
      { pageNumber: 5, kind: "story", kicker: "Keep the boundary", title: "Finished still means finished", text: "Alex came closer and breathed once. The timer had rung. The tablet was still going away. The boundary stayed.", image: art("minas-last-jump", 4), imageAlt: "Alex crouches near Mina and calmly keeps the screen-time boundary." },
      { pageNumber: 6, kind: "story", kicker: "Repair", title: "Two ways to close", text: "\"That sounded like a threat. Screen time is finished, and I know the jump mattered. Do you want to save it, or shall I?\"", image: art("minas-last-jump", 4), imageAlt: "Alex offers Mina two ways to close the game while Willo signals a pause." },
      { pageNumber: 7, kind: "story", kicker: "Disappointment can stay", title: "Save", text: "Mina frowned. She pressed the save button, slowly, and held out the tablet. \"I still don't like it.\"", image: art("minas-last-jump", 5), imageAlt: "Mina saves the game and hands over the tablet while still disappointed." },
      { pageNumber: 8, kind: "story", kicker: "Carry it forward", title: "The next page", text: "\"You don't have to like it,\" Alex said. Mina chose her sketchbook. The room was quieter, not perfect - and the limit had not moved.", image: art("minas-last-jump", 6), imageAlt: "Mina draws at the table while Alex stays nearby and the room settles." },
      { pageNumber: 9, kind: "practice", kicker: "Read it again", title: "What was the choice?", text: "Mina could not choose more screen time. She could choose how the game closed. A bounded choice is honest only when both options are acceptable to the adult.", image: art("minas-last-jump", 5), imageAlt: "Mina chooses how to close the game without changing the end time." },
      { pageNumber: 10, kind: "practice", kicker: "Try it together", title: "Build a closing ritual", text: "Choose one five-minute cue, one final action and one next activity before the next screen session. Practise the words when nobody is already upset.", image: art("minas-last-jump", 6), imageAlt: "A tablet rests away from reach beside Mina's open sketchbook." },
      { pageNumber: 11, kind: "practice", kicker: "Willo wonders", title: "Can clear also be kind?", text: "Kind did not mean more time. Clear did not need a threat. Alex named the ending, acknowledged the hard part and offered one small piece of control.", image: art("minas-last-jump", 3), imageAlt: "Willo observes the screen-time word-weather becoming clearer." },
      { pageNumber: 12, kind: "adult-notes", kicker: "For parents, carers and educators", title: "Adult notes", text: "Key message: keep the screen-time limit and make the transition predictable. Try: (1) design a three-step closing ritual; (2) role-play save-or-adult-saves; (3) draw a choice map showing what can and cannot change. For younger children, use a visual timer and one short sentence. For persistent conflict, review whether the timing, game save points and transition demand are realistic.", image: "/character-lineup.png", imageAlt: "The Words Have Weather cast together." },
    ],
  },
  {
    id: "WHW-EB-005",
    slug: "leo-and-the-question-that-wouldnt-start",
    title: "Leo and the Question That Wouldn't Start",
    subtitle: "Knowing is not the same as being ready to speak",
    category: "Trail",
    ages: "8-12",
    characters: ["Leo", "Ms Chen", "Zahra", "Willo"],
    hook: "Leo knew every answer - except how to raise his hand.",
    blurb: "A public comparison turns classroom participation into fog. Ms Chen repairs privately and opens three genuine routes back into learning.",
    releaseDate: "2026-08-25",
    keyMessage: "Participation has more than one visible form; private repair and multiple response pathways protect dignity while keeping the learning goal.",
    learningFocus: ["Participation barriers", "Private correction", "Multiple ways to respond"],
    curriculum: ["Australian Curriculum v9.0 - Personal and Social capability", "Australian Curriculum v9.0 - English: oral interactions", "Australian Curriculum v9.0 - Student diversity and access"],
    pdfPath: "/ebook-downloads/leo-and-the-question-that-wouldnt-start-education-edition.pdf",
    epubPath: "/ebook-downloads/leo-and-the-question-that-wouldnt-start.epub",
    pages: [
      { pageNumber: 1, kind: "cover", kicker: "A Words Have Weather Story eBook", title: "Leo and the Question That Wouldn't Start", text: "Knowing is not the same as being ready to speak", image: art("leo-and-the-question-that-wouldnt-start", 1), imageAlt: "Leo knows an answer in class but cannot yet raise his hand." },
      { pageNumber: 2, kind: "story", kicker: "The hook", title: "Every answer", text: "Leo knew every answer - except how to raise his hand. In his head, the words were lined up and ready. At his elbow, they disappeared.", image: art("leo-and-the-question-that-wouldnt-start", 1), imageAlt: "Leo sits in class with an idea while his hand remains by the desk." },
      { pageNumber: 3, kind: "story", kicker: "The pressure line", title: "Everyone else", text: "Ms Chen waited, then said, \"Everyone else has shared. Leo, you need to join in.\" Twenty-four eyes seemed to turn at once.", image: art("leo-and-the-question-that-wouldnt-start", 2), imageAlt: "Ms Chen makes a public comparison while Leo looks down." },
      { pageNumber: 4, kind: "story", kicker: "Possible word-weather", title: "The fog arrives", text: "Pale fog filled the space between Leo and the class. Willo listened beside the desk. \"More eyes may make the answer harder to reach,\" Willo said.", image: art("leo-and-the-question-that-wouldnt-start", 3), imageAlt: "Willo sits by Leo's desk as pale word-weather fog gathers." },
      { pageNumber: 5, kind: "story", kicker: "Private repair", title: "A smaller room", text: "At recess, Ms Chen chose the quiet side table. \"I put you on display. I am sorry. The learning still matters, and we need a better way to show it.\"", image: art("leo-and-the-question-that-wouldnt-start", 4), imageAlt: "Ms Chen speaks privately with Leo at a quiet side table." },
      { pageNumber: 6, kind: "story", kicker: "Three routes", title: "Say, write or pass", text: "\"Next time, you can say the idea, write it on a card, or pass and come back later. Which should we try first?\"", image: art("leo-and-the-question-that-wouldnt-start", 4), imageAlt: "Ms Chen offers Leo three participation routes with speech, writing and pause materials." },
      { pageNumber: 7, kind: "story", kicker: "The card", title: "The question begins", text: "Leo chose a card. He wrote one sentence. Zahra kept working beside him without reading over his shoulder.", image: art("leo-and-the-question-that-wouldnt-start", 5), imageAlt: "Leo writes his idea on a card while Zahra gives him space." },
      { pageNumber: 8, kind: "story", kicker: "Participation", title: "Visible in a new way", text: "Leo placed the card on the class board himself. Ms Chen nodded and kept teaching. No spotlight. No cheer. The idea had arrived.", image: art("leo-and-the-question-that-wouldnt-start", 6), imageAlt: "Leo places his idea card on the class board while Ms Chen acknowledges calmly." },
      { pageNumber: 9, kind: "practice", kicker: "Read it again", title: "What was the goal?", text: "The goal was not a raised hand. The goal was for Leo to take part in thinking and sharing. Once the route changed, the learning could stay.", image: art("leo-and-the-question-that-wouldnt-start", 6), imageAlt: "Leo's contribution is visible on the class idea board." },
      { pageNumber: 10, kind: "practice", kicker: "Try it together", title: "Participation menu", text: "Build a class menu: speak, point, write, draw, pair-share or pass-and-return. Ask which routes still show the learning goal and when safety or assessment rules narrow the choices.", image: art("leo-and-the-question-that-wouldnt-start", 5), imageAlt: "Different classroom participation materials sit ready on a desk." },
      { pageNumber: 11, kind: "practice", kicker: "Willo wonders", title: "Who needed the repair?", text: "Leo did not need to apologise for the fog. Ms Chen repaired the public pressure and changed the participation design.", image: art("leo-and-the-question-that-wouldnt-start", 3), imageAlt: "Willo listens as the classroom fog begins to lift." },
      { pageNumber: 12, kind: "adult-notes", kicker: "For parents, carers and educators", title: "Adult notes", text: "Key message: preserve the learning goal while widening legitimate ways to participate. Try: (1) co-design a participation menu; (2) sort tasks by the skill being assessed; (3) practise a private repair after public pressure. Do not diagnose silence from one story. Follow documented adjustments, consult the learner and relevant support people, and keep safeguarding or safety instructions clear.", image: "/character-lineup.png", imageAlt: "The Words Have Weather cast together." },
    ],
  },
  {
    id: "WHW-EB-006",
    slug: "zahra-and-the-bridge-back",
    title: "Zahra and the Bridge Back",
    subtitle: "Repair can be offered; it cannot be forced",
    category: "Trail",
    ages: "9-13",
    characters: ["Zahra", "Leo", "Arthur", "Willo"],
    hook: "The words had stopped. The friendship hadn't.",
    blurb: "After a blaming line breaks the conversation, Zahra learns to name the specific problem, offer repair and leave Leo free to decide when he is ready.",
    releaseDate: "2026-08-25",
    keyMessage: "A useful repair names the harmful line and the specific issue, changes the next action and respects the other person's timing.",
    learningFocus: ["Relationship repair", "Consent and timing", "Specific problem language"],
    curriculum: ["Australian Curriculum v9.0 - Personal and Social capability", "Australian Curriculum v9.0 - Ethical Understanding", "Australian Curriculum v9.0 - English: interacting with others"],
    pdfPath: "/ebook-downloads/zahra-and-the-bridge-back-education-edition.pdf",
    epubPath: "/ebook-downloads/zahra-and-the-bridge-back.epub",
    pages: [
      { pageNumber: 1, kind: "cover", kicker: "A Words Have Weather Story eBook", title: "Zahra and the Bridge Back", text: "Repair can be offered; it cannot be forced", image: art("zahra-and-the-bridge-back", 1), imageAlt: "Zahra and Leo disagree beside a tipped cardboard bridge model." },
      { pageNumber: 2, kind: "story", kicker: "The hook", title: "After the words", text: "The words had stopped. The friendship hadn't. It waited somewhere between Zahra's side of the project table and Leo's.", image: art("zahra-and-the-bridge-back", 1), imageAlt: "Zahra and Leo stand on opposite sides of a community project table." },
      { pageNumber: 3, kind: "story", kicker: "The blaming line", title: "Everything?", text: "The bridge model had tipped. Zahra had snapped, \"You ruin everything.\" Leo stepped back as if the words had pushed him.", image: art("zahra-and-the-bridge-back", 2), imageAlt: "Leo steps back after Zahra uses a blaming line." },
      { pageNumber: 4, kind: "story", kicker: "Possible word-weather", title: "A windy gap", text: "Willo watched a windy gap open between them. The word everything blew the broken bridge into every other moment they had shared.", image: art("zahra-and-the-bridge-back", 2), imageAlt: "Willo notices a windy word-weather gap between Zahra and Leo." },
      { pageNumber: 5, kind: "story", kicker: "A pause", title: "The hall steps", text: "Zahra sat outside. Arthur watered the rosemary and waited until the silence had room. \"A bridge can be offered,\" he said. \"The other person chooses when to cross.\"", image: art("zahra-and-the-bridge-back", 3), imageAlt: "Zahra sits on the hall steps while Arthur tends plants nearby." },
      { pageNumber: 6, kind: "story", kicker: "Prepare the repair", title: "From everything to one thing", text: "Zahra practised: not everything. The poster base. Not you always. I was worried it would fall. Not make him forgive me. Ask if he is ready.", image: art("zahra-and-the-bridge-back", 4), imageAlt: "Arthur offers brief perspective while Zahra thinks and Willo observes." },
      { pageNumber: 7, kind: "story", kicker: "Offer", title: "A bridge, not a demand", text: "\"I blamed all of you for one problem,\" Zahra told Leo. \"I was upset that the base tipped. Can I try that conversation again?\"", image: art("zahra-and-the-bridge-back", 5), imageAlt: "Zahra offers Leo a specific repair while respecting his space." },
      { pageNumber: 8, kind: "story", kicker: "Timing belongs to both", title: "Not yet", text: "Leo looked at the bridge. \"Not yet. Maybe after lunch.\" Zahra nodded. The offer stayed open without pulling him across it.", image: art("zahra-and-the-bridge-back", 5), imageAlt: "Leo remains cautious while Zahra listens to his request for time." },
      { pageNumber: 9, kind: "story", kicker: "Later", title: "One piece at a time", text: "After lunch, Leo brought tape. Zahra held the base. They repaired one cardboard beam, then another. The friendship was not proved by a perfect ending. It was being handled with more care.", image: art("zahra-and-the-bridge-back", 6), imageAlt: "Zahra and Leo repair the cardboard bridge together later." },
      { pageNumber: 10, kind: "practice", kicker: "Try it together", title: "The repair ladder", text: "Step 1: name your line. Step 2: name the specific issue. Step 3: say what you will change. Step 4: ask, do not demand. Step 5: respect the answer and the time requested.", image: art("zahra-and-the-bridge-back", 6), imageAlt: "The repaired cardboard bridge rests between Zahra and Leo." },
      { pageNumber: 11, kind: "practice", kicker: "Willo wonders", title: "What did Zahra not control?", text: "Zahra could control the honesty of her repair and her next action. She could not control Leo's readiness, feelings or answer.", image: art("zahra-and-the-bridge-back", 4), imageAlt: "Willo and Arthur observe a thoughtful pause without intruding." },
      { pageNumber: 12, kind: "adult-notes", kicker: "For parents, carers and educators", title: "Adult notes", text: "Key message: repair is an accountable offer, not a shortcut to forgiveness. Try: (1) rewrite global labels as specific observations; (2) rehearse the five-step repair ladder; (3) discuss what respectful 'not yet' can look like. Do not pressure children to hug, forgive or resume contact. Where there is bullying, coercion or harm, use the relevant school or safeguarding response rather than treating the issue as an equal disagreement.", image: "/character-lineup.png", imageAlt: "The Words Have Weather cast together." },
    ],
  },
];

export const ebooksByCategory = (["Sprout", "All Ages", "Trail"] as const).map((category) => ({
  category,
  books: ebooks.filter((book) => book.category === category),
}));

export function getEbook(slug: string) {
  return ebooks.find((book) => book.slug === slug);
}
