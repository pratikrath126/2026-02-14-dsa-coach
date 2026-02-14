const dsaTopics = [
    { name: "Arrays & Strings", difficulty: "Easy", week: 1 },
    { name: "Two Pointers", difficulty: "Easy", week: 2 },
    { name: "Sliding Window", difficulty: "Medium", week: 3 },
    { name: "Hashing & Sets", difficulty: "Easy", week: 4 },
    { name: "Recursion Fundamentals", difficulty: "Easy", week: 5 },
    { name: "Fast & Slow Pointers", difficulty: "Medium", week: 6 },
    { name: "Stacks & Queues", difficulty: "Easy", week: 7 },
    { name: "Binary Search", difficulty: "Medium", week: 8 },
    { name: "Linked Lists (Basic)", difficulty: "Easy", week: 9 },
    { name: "Linked Lists (Advanced)", difficulty: "Medium", week: 10 },
    { name: "Trees (Traversal)", difficulty: "Easy", week: 11 },
    { name: "Trees (DFS/BFS)", difficulty: "Medium", week: 12 },
    { name: "Heap & Priority Queues", difficulty: "Medium", week: 13 },
    { name: "Backtracking (Basics)", difficulty: "Medium", week: 14 },
    { name: "Backtracking (Complex)", difficulty: "Hard", week: 15 },
    { name: "Trie", difficulty: "Medium", week: 16 },
    { name: "Graphs (Basics)", difficulty: "Medium", week: 17 },
    { name: "Graphs (Dijkstra/MST)", difficulty: "Hard", week: 18 },
    { name: "Dynamic Programming (1D)", difficulty: "Medium", week: 19 },
    { name: "Dynamic Programming (2D)", difficulty: "Hard", week: 20 },
    { name: "Dynamic Programming (Advanced)", difficulty: "Hard", week: 21 },
    { name: "Bit Manipulation", difficulty: "Easy", week: 22 },
    { name: "Segment Trees / Fenwick", difficulty: "Hard", week: 23 },
    { name: "System Design / Mock Interviews", difficulty: "Hard", week: 24 }
];

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const planContainer = document.getElementById('planContainer');
    const overallProgress = document.getElementById('overallProgress');
    const progressText = document.getElementById('progressText');
    const chatInput = document.getElementById('chatInput');
    const sendChat = document.getElementById('sendChat');
    const chatBox = document.getElementById('chatBox');

    // Load state from localStorage
    let completedTopics = JSON.parse(localStorage.getItem('dsa_completed')) || [];
    let currentPlan = JSON.parse(localStorage.getItem('dsa_current_plan')) || null;

    if (currentPlan) {
        renderPlan(currentPlan);
        updateProgress();
    }

    generateBtn.addEventListener('click', () => {
        const role = document.getElementById('targetRole').value || "SDE-1";
        const months = parseInt(document.getElementById('timeline').value) || 6;
        const totalWeeks = months * 4;

        // Scale topics to fit timeline
        const plan = dsaTopics.filter(t => t.week <= totalWeeks).map(t => {
            // Adjust week scaling if timeline is short
            const adjustedWeek = Math.max(1, Math.ceil((t.week / 24) * totalWeeks));
            return { ...t, week: adjustedWeek };
        });

        currentPlan = plan;
        localStorage.setItem('dsa_current_plan', JSON.stringify(plan));
        renderPlan(plan);
        updateProgress();
        
        botMessage(`Great choice! I've prepared a ${months}-month roadmap for ${role}. We'll cover ${plan.length} core DSA modules. Let's start with Week 1!`);
    });

    function renderPlan(plan) {
        planContainer.innerHTML = '';
        const weeks = [...new Set(plan.map(t => t.week))].sort((a, b) => a - b);

        weeks.forEach(weekNum => {
            const weekTopics = plan.filter(t => t.week === weekNum);
            const weekDiv = document.createElement('div');
            weekDiv.className = 'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden';
            
            let topicsHtml = weekTopics.map(topic => `
                <div class="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" ${completedTopics.includes(topic.name) ? 'checked' : ''} 
                            data-topic="${topic.name}" class="topic-checkbox w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300">
                        <span class="text-slate-700 font-medium">${topic.name}</span>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full ${getDiffClass(topic.difficulty)}">${topic.difficulty}</span>
                </div>
            `).join('');

            weekDiv.innerHTML = `
                <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800">Week ${weekNum}</h3>
                    <span class="text-xs text-slate-400 uppercase tracking-wider">Milestone</span>
                </div>
                <div class="divide-y divide-slate-100">
                    ${topicsHtml}
                </div>
            `;
            planContainer.appendChild(weekDiv);
        });

        // Add checkbox listeners
        document.querySelectorAll('.topic-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const topic = e.target.dataset.topic;
                if (e.target.checked) {
                    if (!completedTopics.includes(topic)) completedTopics.push(topic);
                } else {
                    completedTopics = completedTopics.filter(t => t !== topic);
                }
                localStorage.setItem('dsa_completed', JSON.stringify(completedTopics));
                updateProgress();
            });
        });
    }

    function updateProgress() {
        if (!currentPlan) return;
        const total = currentPlan.length;
        const count = completedTopics.filter(t => currentPlan.find(p => p.name === t)).length;
        const percent = Math.round((count / total) * 100) || 0;
        
        overallProgress.style.width = `${percent}%`;
        progressText.innerText = `${count} of ${total} topics completed (${percent}%)`;
    }

    function getDiffClass(diff) {
        if (diff === 'Easy') return 'bg-green-100 text-green-700';
        if (diff === 'Medium') return 'bg-orange-100 text-orange-700';
        return 'bg-red-100 text-red-700';
    }

    // Chat Logic
    sendChat.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleChat(); });

    function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        userMessage(text);
        chatInput.value = '';

        setTimeout(() => {
            const reply = getCoachReply(text);
            botMessage(reply);
        }, 600);
    }

    function userMessage(text) {
        const div = document.createElement('div');
        div.className = 'bg-indigo-600 text-white p-3 rounded-lg self-end max-w-[80%] ml-auto shadow-sm';
        div.innerText = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function botMessage(text) {
        const div = document.createElement('div');
        div.className = 'bg-slate-100 p-3 rounded-lg text-slate-700 self-start max-w-[80%] shadow-sm border border-slate-200';
        div.innerText = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function getCoachReply(text) {
        const lower = text.toLowerCase();
        if (lower.includes('stuck') || lower.includes('help')) return "Don't worry! Try breaking the problem down into smaller sub-problems. Have you tried drawing it on paper first?";
        if (lower.includes('dp') || lower.includes('dynamic programming')) return "DP is all about identifying redundant subproblems. Try visualizing the state tree!";
        if (lower.includes('role') || lower.includes('interview')) return "Focus on your current week's topics. Consistency beats intensity when preparing for SDE roles.";
        return "Keep going, Pratik! Focus on understanding the 'why' behind each algorithm, not just the code.";
    }
});
