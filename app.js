// ============================================
// DSA COACH BOT - Functional Study Plan App (v2.0)
// ============================================

const dsaTopics = {
  "Arrays": [
    { id: "arr_1", name: "Array Basics & Patterns", difficulty: "Easy", weight: 1, problems: ["Two Sum", "Reverse Array"] },
    { id: "arr_2", name: "Prefix Sum & Kadane", difficulty: "Medium", weight: 2, problems: ["Subarray Sum K", "Max Subarray"] },
    { id: "arr_3", name: "Sliding Window Fixed", difficulty: "Medium", weight: 2, problems: ["Max Sum K", "First Negative"] },
    { id: "arr_4", name: "Sliding Window Variable", difficulty: "Hard", weight: 3, problems: ["Longest Substring", "Min Window"] }
  ],
  "Strings": [
    { id: "str_1", name: "String Manipulation", difficulty: "Easy", weight: 1, problems: ["Valid Palindrome", "Anagram"] },
    { id: "str_2", name: "KMP & Pattern Matching", difficulty: "Hard", weight: 4, problems: ["Strstr", "Shortest Palindrome"] }
  ],
  "Linked Lists": [
    { id: "ll_1", name: "LL Traversal & Reverse", difficulty: "Easy", weight: 2, problems: ["Middle of LL", "Reverse LL"] },
    { id: "ll_2", name: "Fast & Slow Pointers", difficulty: "Medium", weight: 2, problems: ["Cycle Detection", "Reorder List"] },
    { id: "ll_3", name: "Reverse K-Group", difficulty: "Hard", weight: 4, problems: ["Reverse Nodes in K", "Merge K Sorted"] }
  ],
  "Trees": [
    { id: "tr_1", name: "Binary Tree DFS/BFS", difficulty: "Easy", weight: 2, problems: ["Inorder", "Level Order"] },
    { id: "tr_2", name: "Tree Path Sums", difficulty: "Medium", weight: 3, problems: ["Path Sum II", "Max Path Sum"] },
    { id: "tr_3", name: "LCA & Serializing", difficulty: "Hard", weight: 4, problems: ["LCA", "Construct from Pre/In"] }
  ],
  "Graphs": [
    { id: "gr_1", name: "Graph Traversal", difficulty: "Medium", weight: 3, problems: ["Clone Graph", "Number of Islands"] },
    { id: "gr_2", name: "Topological Sort", difficulty: "Medium", weight: 3, problems: ["Course Schedule", "Alien Dictionary"] },
    { id: "gr_3", name: "Dijkstra & MST", difficulty: "Hard", weight: 5, problems: ["Network Delay", "Cheapest Flights"] }
  ],
  "DP": [
    { id: "dp_1", name: "DP - 1D Patterns", difficulty: "Medium", weight: 4, problems: ["Climbing Stairs", "House Robber"] },
    { id: "dp_2", name: "DP - Knapsack & LCS", difficulty: "Hard", weight: 5, problems: ["0/1 Knapsack", "LCS"] },
    { id: "dp_3", name: "DP - Matrix & Strings", difficulty: "Hard", weight: 5, problems: ["Edit Distance", "Matrix Chain"] }
  ]
};

class StudyPlanDistributor {
  constructor(months, dailyHours, level) {
    this.months = months;
    this.dailyHours = dailyHours;
    this.level = level; // beginner, intermediate, advanced
    this.capacityPerWeek = dailyHours * 7;
  }

  calculatePlan() {
    const allTopics = [];
    Object.keys(dsaTopics).forEach(cat => {
      dsaTopics[cat].forEach(topic => allTopics.push({ ...topic, category: cat }));
    });

    // Sort based on difficulty/skill level
    if (this.level === 'beginner') {
      allTopics.sort((a, b) => a.weight - b.weight);
    } else if (this.level === 'advanced') {
      allTopics.sort((a, b) => b.weight - a.weight);
    }

    const plan = [];
    let currentWeek = 1;
    let pointsUsedThisWeek = 0;
    let pointsSinceLastRevision = 0;

    allTopics.forEach((topic, index) => {
      // Logic for Revision Days
      if (pointsSinceLastRevision >= 10) {
        plan.push({ type: 'revision', week: currentWeek, name: 'Revision & Consolidation' });
        pointsSinceLastRevision = 0;
        pointsUsedThisWeek += 2; // Revision takes space
      }

      // If week full, move to next
      if (pointsUsedThisWeek + topic.weight > this.capacityPerWeek) {
        // Add Mock Interview at end of significant phases (Foundations, Core)
        if (currentWeek % 4 === 0) {
          plan.push({ type: 'milestone', week: currentWeek, name: 'Phase Mock Interview' });
        }
        currentWeek++;
        pointsUsedThisWeek = 0;
      }

      plan.push({ ...topic, type: 'topic', week: currentWeek });
      pointsUsedThisWeek += topic.weight;
      pointsSinceLastRevision += topic.weight;
    });

    return plan;
  }
}

class DSAStorage {
  static SCHEMA_VERSION = '2.0';
  
  static get(key) {
    const val = localStorage.getItem(`dsa_v2_${key}`);
    return val ? JSON.parse(val) : null;
  }

  static set(key, val) {
    localStorage.setItem(`dsa_v2_${key}`, JSON.stringify(val));
  }

  static saveProgress(topicId) {
    const progress = this.get('progress') || { completedTopicIds: [], totalPoints: 0 };
    if (!progress.completedTopicIds.includes(topicId)) {
      progress.completedTopicIds.push(topicId);
      this.set('progress', progress);
    }
  }

  static addChatMessage(role, text) {
    const history = this.get('chat') || [];
    history.push({ role, text, timestamp: Date.now() });
    this.set('chat', history.slice(-50)); // Keep last 50
  }
}

class CoachBot {
  static getResponse(msg, currentWeek) {
    const lower = msg.toLowerCase();
    if (lower.includes('stuck')) return "Don't panic. Break the problem into subproblems. Have you drawn the state transition yet?";
    if (lower.includes('hi') || lower.includes('hello')) return "Hello! Ready to crush some code today? You're on Week " + currentWeek + ".";
    if (lower.includes('hard') || lower.includes('difficult')) return "It is hard, that's why it's valuable. Focus on the core pattern, not the syntax.";
    return "Consistency beats intensity. Keep going!";
  }
}

// UI Setup
document.addEventListener('DOMContentLoaded', () => {
  const genBtn = document.getElementById('generateBtn');
  const planContainer = document.getElementById('planContainer');
  const chatInput = document.getElementById('chatInput');
  const sendChat = document.getElementById('sendChat');
  const chatBox = document.getElementById('chatBox');
  const darkModeToggle = document.getElementById('darkModeToggle');

  // Theme Init
  if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');

  darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });

  // Load History
  const history = DSAStorage.get('chat') || [];
  history.forEach(m => appendMessage(m.role, m.text));

  genBtn.addEventListener('click', () => {
    const months = document.getElementById('timeline').value;
    const hours = document.getElementById('dailyHours').value;
    const level = document.getElementById('skillLevel').value;

    const distributor = new StudyPlanDistributor(months, hours, level);
    const plan = distributor.calculatePlan();
    renderPlan(plan);
    DSAStorage.set('plan', plan);
    
    botReply("Plan generated! I've weighted topics by complexity and scheduled revision days for you.");
  });

  function renderPlan(plan) {
    planContainer.innerHTML = '';
    let currentWeek = 0;
    let weekDiv = null;

    plan.forEach(item => {
      if (item.week !== currentWeek) {
        currentWeek = item.week;
        weekDiv = document.createElement('div');
        weekDiv.className = 'mb-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700';
        weekDiv.innerHTML = `<h3 class="text-indigo-600 dark:text-indigo-400 font-bold mb-4">Week ${currentWeek}</h3>`;
        planContainer.appendChild(weekDiv);
      }

      const itemDiv = document.createElement('div');
      itemDiv.className = 'flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors border-b border-slate-50 dark:border-slate-700 last:border-0';
      
      if (item.type === 'topic') {
        const checked = (DSAStorage.get('progress')?.completedTopicIds || []).includes(item.id);
        itemDiv.innerHTML = `
          <input type="checkbox" ${checked ? 'checked' : ''} class="w-5 h-5 rounded" onchange="toggleTopic('${item.id}', this.checked)">
          <div class="flex-1">
            <div class="text-sm font-medium dark:text-slate-200">${item.name}</div>
            <div class="text-xs text-slate-500">${item.category} • ${item.weight} pts</div>
          </div>
          <span class="text-[10px] uppercase px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-500">${item.difficulty}</span>
        `;
      } else if (item.type === 'revision') {
        itemDiv.innerHTML = `<i class="fas fa-sync text-orange-500"></i> <span class="text-sm font-semibold text-orange-600">${item.name}</span>`;
      } else {
        itemDiv.innerHTML = `<i class="fas fa-trophy text-green-500"></i> <span class="text-sm font-semibold text-green-600">${item.name}</span>`;
      }
      weekDiv.appendChild(itemDiv);
    });
  }

  window.toggleTopic = (id, checked) => {
    if (checked) DSAStorage.saveProgress(id);
    else {
      const p = DSAStorage.get('progress');
      p.completedTopicIds = p.completedTopicIds.filter(tid => tid !== id);
      DSAStorage.set('progress', p);
    }
    updateStats();
  };

  function updateStats() {
    const progress = DSAStorage.get('progress') || { completedTopicIds: [] };
    document.getElementById('overallProgress').style.width = (progress.completedTopicIds.length / 20 * 100) + '%';
    document.getElementById('progressText').innerText = progress.completedTopicIds.length + " topics completed";
  }

  sendChat.addEventListener('click', () => {
    const txt = chatInput.value;
    if (!txt) return;
    appendMessage('user', txt);
    DSAStorage.addChatMessage('user', txt);
    chatInput.value = '';
    
    setTimeout(() => {
      const reply = CoachBot.getResponse(txt, 1);
      botReply(reply);
    }, 500);
  });

  function botReply(txt) {
    appendMessage('bot', txt);
    DSAStorage.addChatMessage('bot', txt);
  }

  function appendMessage(role, txt) {
    const div = document.createElement('div');
    div.className = `p-3 rounded-lg max-w-[85%] ${role === 'user' ? 'bg-indigo-600 text-white ml-auto' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`;
    div.innerText = txt;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
