let currentColumn = null;
let draggedElement = null;
//  رویدادهای Drag & Drop
document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("task")) {
    draggedElement = e.target;
    e.target.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  }
});

document.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("task")) {
    e.target.classList.remove("dragging");
  }
});

// ستون‌ها را برای Drop آماده کن
document.querySelectorAll(".column").forEach((column) => {
  const tasksContainer = column.querySelector(".tasks-container");

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", (e) => {
    if (e.target === column) {
      column.classList.remove("drag-over");
    }
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("drag-over");
    if (draggedElement) {
      tasksContainer.appendChild(draggedElement);
      draggedElement = null;
    }
  });

  // Drop برای Container تسک‌ها
  tasksContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });

  tasksContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedElement) {
      tasksContainer.appendChild(draggedElement);
      draggedElement = null;
    }
  });
});

// متغیر برای ذخیره ستون فعلی
let activeColumn = null;

function showAddTaskModal(columnStatus) {
  activeColumn = columnStatus;
  document.getElementById("addTaskModal").classList.add("active");
  document.getElementById("taskTitle").focus();
}

function closeAddTaskModal() {
  document.getElementById("addTaskModal").classList.remove("active");
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDesc").value = "";
  document.getElementById("taskPriority").value = "medium";
}

function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDesc").value.trim();
  const priority = document.getElementById("taskPriority").value;

  if (!title) {
    alert("لطفاً عنوان تسک را وارد کنید");
    return;
  }

  const priorityLabels = {
    high: "اولویت بالا",
    medium: "اولویت متوسط",
    low: "اولویت پایین",
  };

  const taskHTML = `
                <div class="task" draggable="true">
                    <div class="task-title">${escapeHtml(title)}</div>
                    <div class="task-description">${escapeHtml(description)}</div>
                    <div class="task-priority priority-${priority}">${priorityLabels[priority]}</div>
                    <button class="delete-btn" onclick="deleteTask(this)">حذف</button>
                    <div class="clear"></div>
                </div>
            `;

  const tasksContainer = document.getElementById(`${activeColumn}-tasks`);
  tasksContainer.insertAdjacentHTML("beforeend", taskHTML);

  closeAddTaskModal();
}

function deleteTask(button) {
  button.closest(".task").remove();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// بستن modal با کلید Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAddTaskModal();
  }
});

// بستن modal با کلیک خارج از آن
document.getElementById("addTaskModal").addEventListener("click", (e) => {
  if (e.target.id === "addTaskModal") {
    closeAddTaskModal();
  }
});

// فشار Enter برای اضافه کردن تسک
document.getElementById("taskTitle").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
