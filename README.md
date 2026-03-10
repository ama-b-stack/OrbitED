🛰️ OrbitEd: The Intelligent Student Operating System

Team TinyTide Submission | Amaya Bell | World Wide Vibe Hackathon 2026

🛑 Critical Judge's Note: Accessing the Mission

To experience the full authenticated student lifecycle, please use the following credentials.

Important: Usernames and passwords are case-sensitive and must be entered in all lowercase to sync with the neural bridge.

Portal: Student Launchpad

Username: alex_star

Password: orbit123

Optimization: While OrbitEd is responsive and performs excellently on mobile devices, the UI is optimized for student laptops (Web) to reflect the primary hardware provided by school districts.

🎯 Executive Summary

OrbitEd is a production-ready neural bridge designed to solve the "Disengagement Gap." We transform the rigid, often isolating experience of modern education into a mission-based RPG ecosystem. By combining real-time BrightData web scraping (Urban Institute & LinkedIn) with agentic AI tutoring (ATLAS), we bridge the distance between classroom curriculum and real-world career trajectories.

1. Consistency with Challenge Statement

Challenge Stream: Workforce, Business & Economic Growth
OrbitEd transforms the classroom into a high-octane talent pipeline, directly addressing economic growth by aligning student effort with real-world business demand.

Real-Time Opportunity Mapping (Powered by BrightData): Our integrated BrightData Scrapers proactively crawl LinkedIn and major job boards to identify local workforce opportunities that our students would excel in, given insights gained from ATLAS and the student's interactions with it, as well as their learning style, grades (strengths) and skill set. By surfacing these as "S-Rank Bounties" (e.g., local tech internships, skill related volunteer work, etc.), OrbitEd ensures students are working toward careers that exist in their community today, and enhance our journey into tomorrow.

Workforce Readiness Intelligence: Using Gemini AI combined with Urban Institute district data (BrightData crawler), OrbitEd assesses environmental risk factors that lead to dropouts (absenteeism, funding gaps). It proactively deploys the ATLAS AI Tutor to provide intensive STEM and logic support to high-risk students, ensuring a diverse and qualified workforce regardless of district socioeconomic status.

2. Quality and Design

Technical Execution: Built on a reactive stack (React 18 + Tailwind CSS), OrbitED's architecture features a sophisticated Dual-Scraper Pipeline that handles asynchronous data collection from multiple web sources simultaneously.

Sophisticated UI/UX: We utilize a "Glassmorphism" aesthetic with a custom-built Pixel Engine for avatars and pets, ensuring the app feels like a premium consumer product rather than "clunky school software."

3. Originality and Impact

S-Rank Bounties (Real-Time Job and Volunteer Matching): OrbitEd innovates by using BrightData's LinkedIn/Job Board Scrapers to identify local internships in real-time. It doesn't just tell a student to "study logic"—it finds a local internship and, before it even presents it to the student, it runs through Gemini along with an analysis of the student's strengths, interests, and portfolio as a high-stakes "S-Rank Bounty," creating a literal bridge from the classroom to an engineer that can put their skills back into the community.

ATLAS AI (Agentic Math): Unlike standard LLM wrappers, ATLAS uses LaTeX rendering to teach complex logic ($P \land Q$) through a conversational, Socratic method. It uses progressive insights gained throughout the student's gradeschool career, as well as their achievements, learning style, and report card, to develop a strengths profile that will shape their growth journey with ATLAS. ATLAS will motivate the student to be their best self, and help them translate their focus and skills into productive lifestyles that align with who **they** are, rather than comparing themselves to their peers in an environment that may favor some skillsets over others.

OrbitED is meant to sync directly into a school's pre-existing grading and scheduling system. We do the extra work, like reviewing missed questions on a test with each student, answering questions mid lesson, or even *asking* some--just to check--so the teachers can focus on what they do best: guiding each student's journey.

Hey pet! The student is hooked with a Tamagotchi-esque structure, in which their pet's vitality is wholly dependent on their attendance.

🛠️ Feature Walkthrough: Welcome to OrbitED!

Step 1: The Landing Page (The Hook)

Take a gander at the Nexus and Exploration views. These establish the "why" behind the project, highlighting my motivation as a Montgomery native to solve our city's educational disparities--of which I've seen first hand.

Step 2: The Mission Board (Wait for the Scrapers)

Upon login, give the BrightData Neural Scrapers a moment to run in the background. You will see:

District Intel Widget: Displays scraped risk metrics (absenteeism, funding) for the local school.

ATLAS Career Match: A high-visibility "S-Rank" mission matched specifically to the student's Target Career Path (found in the job board scrape).

After that, take a look around. Step into the shoes of our student Alex, who has a lot of important missions to take on.

**Mission Board**: Click on tasks to "complete" them in the mission board. Notice how they need a teacher's approval before you're able to get those sweet, sweet coins, and notice how the gradebook synced tasks cannot be altered at all. They will update when the grades post, and the max amount of coins that can be earned for each assignment is listed. Didn't get the perfect score? That's okay. The student will still take home some coins. Their cup may not runneth over, but it doth not remain empty!

**District Intel**: At the school level (for Montgomery itself), certain schools will have a set risk profile determined based on the heaping amount of information provided by Urban Institute, scraped by BrightData, and analyzed by Gemini to be given a risk profile. When OrbitED goes national, we will send a combination of district intel as well as school intel to ATLAS to be analyzed and given a risk profile. This won't actually be shown to students--this is just for demo!
- Higher risk will make ATLAS more persistent in checking in with the student, as well as put heavier weight on focus and attendance retention.

**Notice Board**: District wide and school tailored. Brewbaker will get both Brewbaker-relevant notices and district notices, but not McKee-relevant notices, of course.

**Comms**: A teacher letting their students know they'll be out Friday? Dante sending yet another request to trade his mid-level card with your legendary one? It's all here.

**Wallet Stats**: You know what they say: If it ain't broke, don't fix it... but what if we are broke? The wallet is here to tell you the news, and how or why you got here.

**The Vibe**: Competition can be a great motivator. The Vibe is a live feed celebrating the accomplishments of students around the district... Alex wants to be there someday. Shoot for the stars, Alex.

**Learning Profile**: Click on the gear at the bottom right, right above the ATLAS widget. Here, a student can initialize their learning journey by noting whether they're a shy learner, their preferred learning style, as well as their target career path. Things change, and so these settings are always open to be changed, too.

Step 3: ATLAS AI Tutor (Agentic Interaction)

Launch ATLAS from the dashboard.

**Info Bar**: Alex's focus streak tells us how many days he's gone without missing school or not interacting with his neural bridge. We see his current grade in this class, and... Coinsss! If they're here, we know we're either earnin' em or spendin' em.

**My Sessions**: Saved sessions so students can go back to them any time. Add a new chat. Archive a chat. ATLAS uses these conversations to tailor its role in helping drive career and future minded students by honing in on their strengths and interests, or filling any gaps it notices. But ATLAS is only ATLAS... nothing can ever beat a teacher. ATLAS can extract general insights and give them to teachers to better help the student.

**ATLAS Terminal**: Talk with ATLAS, powered by Gemini, enriched by data scraped using BrightData! Are you smarter than a middle schooler? Test your knowledge with ATLAS as he helps Alex in Logic class.

**Action Board**: Everyone loves extra coins. The student can gain some by having knowledge checks or assignment help based on the synced gradebook and schedule, where ATLAS will see upcoming tests, quizzes, or assignments. Teachers can even require a tutoring session from the teacher's control panel.

**Suggested Actions**: ATLAS may suggest review sessions with it, based on gaps ATLAS noticed from missed questions in submitted work (and will throw some coins your way, if you do). ATLAS will also remind you that it thinks you're swell and should definitely check out that skill-relevant bounty, and will explain to you why you're perfect for the work!

**Sync Class Audio**: When ATLAS is truly in production and synced with classroom tools, teachers can turn on live transcription from the Teacher Control Panel and ATLAS will push random knowledge checks throughout the lesson (with a reward for the right answer, of course) based on the context of this transcription. But, we aren't synced with any classroom tools currently, so feel free to click the "Sync Class Audio" button while listening to a TedTalk! But, for the sake of time (and many browsers don't quite like these pesky listeners) you can test the Demo Tools at the bottom right (a purple widget) to force a "Live Knowledge Check" as if a teacher were currently lecturing. Be ready!

Step 4: Digital Locker (Identity & Economy)

Navigate to the Locker by going back to the dashboard and clicking "Open Digital Locker" to see a simple peek at the gamified reward loop:

**Homeroom**: Say hello to your cute Stardew Valley-like character. Below it is a status message that you can change, with some restrictions. The pxelated version of your study buddy pet is always next to you, with traits that align with your own. They grow with you in levels, and give you motivating words! But watch it when their vitality drops... Everyone gets a little cranky.

**Items**: But wait a minute... You notice that our little avatar doesn't match our generated profile photo? Take a look through the items and find blond hair, and equip it! You can also set a room theme, pose, and items for your pet. You'll also see the store--go ahead and buy something, and equip it! But keep your eye on your coin purse at the top...

**Trophy Cabinet**: Verified achievements given officially, digitally! You will see an example roblox code. With future collaborations, these achievements will come with roblox codes that give the student an identical item in Roblox to their acievement item. It would be highly rare, as the only way to get that item will be to collect that specific achievement in OrbitED! You can click on any other achievements to see how one would come about these achievements, as well as download a verified certificate/credential.

**Deck**: Who doesn't like trading cards? Click on each to flip them over and read a bit about the significance of the card, as well as how it can be gained. The history tab shows a snapshot of every card gained by the student and how; via trade, or earning. Try it yourself! Initiate a card trade with a classmate by clicking on "Trade Hub". Select a student, look through their card deck, and select a card you want to trade for. Confirm the trade request, go back and look at another's student's deck, or simply don't trade at all!

Note: The teacher directory contains structural UI blueprints to demonstrate the planned B2G (Business-to-Government) architecture. The Student directory contains the fully operable hackathon MVP.

4. Commercialization

OrbitED is designed to sustain itself beyond this hackathon through a B2B / B2G (Business-to-Government) Model:
    
    Phase 1 (Current): MVP deployment featuring the Atlas Knowledge Checks and Student Locker logic.

    Phase 2 (Partnerships): Local Montgomery businesses (Tech, Manufacturing, Healthcare) sponsor specific "Bounties" to build early brand loyalty and secure talent pipelines.

    Phase 3 (Workforce): Activation of the Teacher/Admin Command Center, providing the city with a live dashboard of student skills, effectively mapping the future workforce in real-time.

Institutional Adoption: OrbitEd provides a "Locker" for verified credentials that students can export as PDF Certfications, creating immediate value for colleges and employers.

Strategic Partnerships: We demonstrate a viable model by rewarding academic milestones with Roblox Skin Codes, showcasing how corporate partnerships can be funneled directly into student engagement.

OrbitEd - Bridge the Gap. Shoot for the Stars.
Built with ❤️ by TinyTide.
