let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const saveBtn = document.getElementById("saveBtn");

titleInput.addEventListener("input", () => {
    saveBtn.disabled = titleInput.value.trim() === "";
});

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    if (!title) return;

    if (editId !== null) {
        tasks[editId].title = title;
        tasks[editId].desc = desc;
        editId = null;
    } else {
        tasks.push({
            title,
            desc,
            completed: false,
            createdAt: new Date(),
            completedAt: null
        });
    }

    titleInput.value = "";
    descInput.value = "";
    saveBtn.disabled = true;

    saveData();
    render();
}

function render() {
    const pending = document.getElementById("pending");
    const completed = document.getElementById("completed");

    pending.innerHTML = "";
    completed.innerHTML = "";

    let p = 0, c = 0;

    tasks.forEach((t, i) => {
        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
            <div>
                <strong>${t.title}</strong><br>
                <small>${t.desc || ""}</small><br>
                <small>Added: ${new Date(t.createdAt).toLocaleString()}</small>
                ${t.completedAt ? `<br><small>Done: ${new Date(t.completedAt).toLocaleString()}</small>` : ""}
            </div>
            <div class="actions">
                ${!t.completed ? `<button title="Completed" class="complete" onclick="completeTask(${i})">✓</button>` : ""}
                <button title="Edit" class="edit" onclick="editTask(${i})">✎</button>
                <button title="Delete" class="delete" onclick="deleteTask(${i})">✕</button>
            </div>
        `;

        if (t.completed) {
            completed.appendChild(div);
            c++;
        } else {
            pending.appendChild(div);
            p++;
        }
    });

    if (p === 0) {
        pending.innerHTML = `
            <div class="empty">
                <strong>No pending tasks</strong>
                Everything looks clear for now. Add a task anytime.
            </div>`;
    }

    if (c === 0) {
        completed.innerHTML = `
            <div class="empty">
                <strong>No completed tasks</strong>
                Once you complete a task, it will show up here.
            </div>`;
    }

    document.getElementById("totalCount").textContent = tasks.length;
    document.getElementById("pendingCount").textContent = p;
    document.getElementById("completedCount").textContent = c;

    document.getElementById("pendingBadge").textContent = p;
    document.getElementById("completedBadge").textContent = c;
}


function completeTask(i) {
    tasks[i].completed = true;
    tasks[i].completedAt = new Date();
    saveData();
    render();
}

function editTask(i) {
    titleInput.value = tasks[i].title;
    descInput.value = tasks[i].desc;
    saveBtn.disabled = false;
    editId = i;
}

function deleteTask(i) {
    tasks.splice(i, 1);
    saveData();
    render();
}

render();