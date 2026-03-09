# OrbitED System Architecture

## High-Level Overview
OrbitED is an educational engagement infrastructure that bridges real-world educational data with a digital RPG ecosystem.

## Technology Stack
* **Frontend:** React / Tailwind CSS (Deployed on Replit)
* **Intelligence Engine:** Gemini 3.1 Pro (Multimodal Live API)
* **Data Scraping:** Bright Data Web Scrapers: LinkedIn and UrbanData Web Scrapers
* **State Management:** React Context API

## The Atlas Engine (Gemini 3.1)
The core "Design Logic" of OrbitED relies on **Proactive Scaffolding**. Unlike reactive chatbots, Atlas uses the Gemini 3.1 Multimodal stream to:
1.  **Listen:** Process live lecture audio or text in real-time.
2.  **Evaluate:** Identify "Knowledge Gaps" based on student performance history.
3.  **Incentivize:** Trigger "Bounty" drops (Coins/Cards) directly into the Student Locker.
4.  **Equal Opportunity:** In a world where there's 1 teacher to 30 children, make it difficult for a child to be left behind by tailoring their learning to their style (audio, image, etc.)

## Architectural Invariants
* **Zero-Cloud PII:** All student grade data is processed via secure API tokens; no personal identifiable information is stored on the OrbitED servers.
* **The Bridge Logic:** The "Wallet" acts as a one-way bridge where academic success creates digital assets, ensuring the "Game" never distracts from the "Learning."

## Impact Path
By using **Predictive Analytics** on Montgomery absenteeism data, OrbitED identifies "At-Risk" students before they fall out of the civic loop, providing an automated safety intervention at scale.
