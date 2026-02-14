# Study Plan & DSA Coach Bot - REVISED PLAN (v2.0)

## 1. Weighted Point System
Instead of simple scaling, each topic is assigned "Work Points" based on complexity:
- **Foundations (Arrays, Strings, Hashing):** 1 point per topic.
- **Linear Data Structures (Linked Lists, Stacks, Queues):** 2 points per topic.
- **Non-Linear (Trees, BST, Heaps):** 3 points per topic.
- **Advanced (Graphs, Backtracking):** 4 points per topic.
- **Mastery (Dynamic Programming, Segment Trees):** 5 points per topic.

## 2. Capacity-Based Distribution
- **Total Capacity (CP):** `Target Months * 4 (weeks) * Daily Hours * 7 (days)`.
- **Topic Mapping:** Subtopics are pulled from the master list and assigned to weeks until the weekly point capacity is reached.
- **Adaptive Scheduling:** If the timeline is short (e.g., 1 month), the bot will prioritize "Must Know" topics and merge related ones.

## 3. Scheduler Enhancements
- **Revision Intervals:** For every 10 points of "New Learning" earned, 1 "Revision Day" is automatically inserted into the plan.
- **Phase Milestones:**
    - **Foundation Phase:** End of week 4 (Mock Interview 1).
    - **Core Phase:** End of week 16 (Mock Interview 2).
    - **Mastery Phase:** End of week 24 (Final Mock Interview).

## 4. LocalStorage Schema 2.0
```json
{
  "profile": {
    "targetRole": "string",
    "timelineMonths": "number",
    "dailyHours": "number",
    "skillLevel": "beginner|intermediate|advanced"
  },
  "progress": {
    "completedTopicIds": ["string"],
    "totalPointsEarned": "number",
    "revisionHistory": [{"topicId": "string", "lastRevised": "timestamp"}]
  },
  "sessions": [
    {"date": "string", "topicId": "string", "durationMinutes": "number"}
  ],
  "chatHistory": [
    {"role": "user|bot", "text": "string", "timestamp": "number"}
  ]
}
```

## 5. CoachBot Intelligence
- **Intent Detection:** Detects if the user is "stuck", "frustrated", or "celebrating".
- **Contextual Awareness:** The bot knows which week you are currently in and suggests specific resources for that week's topic.
- **Proactive Intervention:** If no progress is logged for 3 days, the bot sends a motivational nudge upon next open.

## 6. UI Updates
- Add `input[type="number"]` for **Daily Hours**.
- Add `select` for **Current Level**.
- Add a **Detailed Progress Stats** card.
