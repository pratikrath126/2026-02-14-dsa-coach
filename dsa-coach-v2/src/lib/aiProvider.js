export async function getCoachResponse(message, context) {
  // In a real app, this would call an API route that interacts with Gemini/OpenAI
  // For this standalone demo, we simulate it with a sophisticated pattern matcher 
  // or a placeholder for a real fetch.
  
  try {
    /*
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context })
    });
    return await response.json();
    */
    
    // Simulated Intelligent Logic
    const msg = message.toLowerCase();
    const responses = [
      { trigger: ['stuck', 'hard', 'difficult'], response: "DSA is about patterns. If you're stuck on " + (context.currentTopic || 'this problem') + ", try to visualize the recursion tree or the array transformations. What's the brute force approach?" },
      { trigger: ['hello', 'hi', 'hey'], response: "Hey there! Ready to tackle some Striver's A2Z sheet today? You've completed " + context.progress + "% so far. Let's keep the streak alive!" },
      { trigger: ['plan', 'schedule', 'study'], response: "Based on your goals, you should focus on Step " + context.nextStep + " today. Don't rush; quality of understanding beats quantity of problems." },
      { trigger: ['interview', 'mock'], response: "Mock interviews are great for confidence. Try to explain your thought process out loud while coding. Want to simulate a 30-minute session?" }
    ];

    const match = responses.find(r => r.trigger.some(t => msg.includes(t)));
    return match ? match.response : "Interesting point. How does this connect to the time complexity of your current solution? Remember, we aim for the most optimal approach in the A2Z sheet.";
    
  } catch (error) {
    return "I'm having a bit of trouble connecting to my brain. But keep coding!";
  }
}
