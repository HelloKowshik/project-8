const StorageModule = (function () { 
    return {
        addTask(task) {
            let tasks;
            if (localStorage.getItem('tasks') === null) {
                tasks = [];
                tasks.push(task);
            } else {
                tasks = JSON.parse(localStorage.getItem('tasks'));
                tasks.push(task);
            }
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },
        getTasks() {
            let tasks;
            if (localStorage.getItem('tasks') === null) {
                tasks = [];
            } else {
                tasks = JSON.parse(localStorage.getItem('tasks'));

            }
            return tasks;
        },
        updateTask(upDatedTask) {
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            const taskAfterUpdate = tasks.map(task => {
                if (task.id === upDatedTask.id) {
                    task.title = upDatedTask.title;
                    task.completed = upDatedTask.completed;
                    return task; 
                } else {
                    return task;
                }
            });
            localStorage.setItem('tasks', JSON.stringify(taskAfterUpdate));
        },
        deleteTask(taskToDelete) {
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            let taskAfterDelete = tasks.filter(task => task.id !== taskToDelete.id);
            tasks = taskAfterDelete;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
})();


const TaskModule = (function () { 
    let data = {
        tasks: StorageModule.getTasks(),
        currentTask: null
    };
    return {
        getTasks () {
            return data.tasks;
        },
        getTaskById(id) {
            return data.tasks.find(task =>
                task.id === id);
        },
        setCurrentTask(taskToEdit) {
            // console.log(task);
            data.currentTask = taskToEdit;
        },
        getCurrentTask() {
            return data.currentTask;
        },
        updateItem(taskTitle) {
            let foundTask = null;
            data.tasks = data.tasks.map(task => { 
                if (task.id === data.currentTask.id) {
                    task.title = taskTitle;
                    foundTask = task;
                    return task;
                } else {
                    return task;
                }
            });
            return foundTask;
        },
        getTotalTaskCounter() {
            return data.tasks.length;  
        },
        getCompletedTaskCounter() {
            return data.tasks.reduce((acc, currentTask) => {
                if (currentTask.completed) {
                  ++acc;
                  return acc;
                } else {
                  return acc;
                }
              }, 0);
        },
        deleteTask(currentTask) {
            const tasksAfterDelete = data.tasks.filter(task => task.id !== currentTask.id);
            // console.log(tasksAfterDelete);
            data.tasks = tasksAfterDelete;
            
        },
        getData() {
            return data;
        },
        addTask(taskTitle) {
            const id = data.tasks.length > 0 ? (data.tasks[data.tasks.length-1].id +1) : 0;
            const task = {
                id,
                title: taskTitle,
                completed: false
            };
            const dataWithUpdatedTask = {
                ...data,
                tasks: [...data.tasks, task]
            };
            console.log(dataWithUpdatedTask);
            data = dataWithUpdatedTask;
            return task;
        },
        completedTask(id) {
            data.tasks = data.tasks.map(task => {
                if (task.id === id) {
                    task.completed = !task.completed;
                    return task;
                } else {
                    return task;
                }
            });
        }
    }
})();


const UiModule = (function () { 
    const selectors = {
        taskContainer: 'task-container',
        addTask: '.add-task',
        updateTask: '.update-task',
        deleteTask: '.delete-task',
        backBtn: '.back-btn',
        taskTitle: 'task-title',
        completedTasks: '.completed-tasks',
        totalTasks: '.total-tasks',
        alert: '.alert'
    };
    const hideTaskContainer = function(){
        document.getElementById(selectors.taskContainer).style.display = 'none';
    }
    const showTaskContainer = function () {
        document.getElementById(selectors.taskContainer).style.display = 'block';
    };;
    return {
        getSelectors() {
            return selectors;  
        },
        showEditState() { 
            document.querySelector(selectors.addTask).style.display = 'none';
            document.querySelector(selectors.updateTask).style.display = 'block';
            document.querySelector(selectors.deleteTask).style.display = 'block';
            document.querySelector(selectors.backBtn).style.display = 'block';
        },
        clearEditState() {
            document.querySelector(selectors.addTask).style.display = 'block';
            document.querySelector(selectors.updateTask).style.display = 'none';
            document.querySelector(selectors.deleteTask).style.display = 'none';
            document.querySelector(selectors.backBtn).style.display = 'none';
        },
        getTitleInput() {
            return document.getElementById(selectors.taskTitle).value;
        },
        showAlert(msg, className) {
            // console.log(msg, className);
            const div = document.createElement('div');
            div.textContent = msg;
            div.className = className;
            document.getElementById(selectors.taskContainer).insertAdjacentElement('beforebegin', div);
            if (document.querySelector(selectors.alert)) {
                this.clearAlert();
            }
        },
        clearAlert() {
            setTimeout(() => { 
                document.querySelector(selectors.alert).remove();
            }, 2000);
        },
        clearFields() {
            document.getElementById(selectors.taskTitle).value = '';
        },
        populateForm(taskTitle) {
            UiModule.showEditState();
            document.getElementById(selectors.taskTitle).value = taskTitle;
        },
        showTotalTaskCount(taskCount) {
            document.querySelector(selectors.totalTasks).textContent = taskCount;
        },
        showCompletedTaskCounter(taskCount) {
            document.querySelector(selectors.completedTasks).textContent = taskCount;
        },
        populateTask(task) {
            let { id, title, completed } = task;
            showTaskContainer();
            let output = '';
            output += `
                <div class="task-item mb-2" id="task-${id}">
                <div class="row">
                    <div class="col-sm-6">
                        <h5>${title}</h5>
                    </div>
                    <div class="col-sm-6">
                        <a href="#" class="completed-task float-right mr-2">
                            <i class="fas fa-check"></i>
                        </a>
                        <a href="#" class="edit-task float-right mr-3">
                            <i class="fas fa-pencil-alt"></i>
                        </a>
                    </div>
                </div>
            </div>`;
            document.getElementById(selectors.taskContainer).insertAdjacentHTML('beforeend', output);
        },
        populateTasks(tasks) {
            if (tasks.length === 0) {
                hideTaskContainer();
            } else {
                showTaskContainer();
                let output = '';
            tasks.forEach(task => {
                const { id, title, completed } = task;
                output += `
                <div class="task-item mb-2" id="task-${id}">
                <div class="row">
                    <div class="col-sm-6">
                        <h5 class=${completed === true? 'completed-task' : ''}>${title}</h5>
                    </div>
                    <div class="col-sm-6">
                        <a href="#" class="completed-task float-right mr-2">
                            <i class="fas fa-check"></i>
                        </a>
                        <a href="#" class="edit-task float-right mr-3">
                            <i class="fas fa-pencil-alt"></i>
                        </a>
                    </div>
                </div>
            </div>`;
            });
            document.getElementById(selectors.taskContainer).innerHTML = output;
            }
            
        }
    }
})();


const AppModule = (function (TaskModule, UiModule, StorageModule) {
    const loadEventListener = function () {
        const selectors = UiModule.getSelectors();
        document.querySelector(selectors.addTask).addEventListener('click', taskAddSubmit);
        document.querySelector(selectors.updateTask).addEventListener('click', taskUpdateSubmit);
        document.querySelector(selectors.deleteTask).addEventListener('click', taskDeleteSubmit);
        document.querySelector(selectors.backBtn).addEventListener('click', backToAddTaskState);
        document.getElementById(selectors.taskContainer).addEventListener('click', completedTask);

        document.getElementById(selectors.taskContainer).addEventListener('click', editTask);
    }

    function taskAddSubmit(e) {
        e.preventDefault();
        const taskTitle = UiModule.getTitleInput();
        // console.log(taskTitle);
        if (taskTitle.trim() === '') {
            UiModule.showAlert('Empty Field Not Allowed', 'alert alert-warning');
        } else {
            let task = TaskModule.addTask(taskTitle);
            console.log(task);
            StorageModule.addTask(task);
            UiModule.clearFields();
            const totalTask = TaskModule.getTotalTaskCounter();
            UiModule.showTotalTaskCount(totalTask);
            // console.log(task);
            UiModule.populateTask(task);
        }
    }

    function completedTask(e) {
        if (e.target.parentElement.classList.contains('completed-task')) {
            let targetId = e.target.parentElement.parentElement.parentElement.parentElement.id;
            let id = Number(targetId.split('-')[1]);
            // console.log(id);

            TaskModule.completedTask(id);
            let updatedTask = TaskModule.getTaskById(id);
            StorageModule.updateTask(updatedTask);
            let completedTaskCounter = TaskModule.getCompletedTaskCounter();
            UiModule.showCompletedTaskCounter(completedTaskCounter);
            let tasks = TaskModule.getTasks();
            UiModule.populateTasks(tasks);
        }
    }
    
    function editTask(e) {
        if (e.target.parentElement.classList.contains('edit-task')) {
            UiModule.showEditState();
            let targetId = e.target.parentElement.parentElement.parentElement.parentElement.id;
            let id = Number(targetId.split('-')[1]);
            let taskToUpdate = TaskModule.getTaskById(id);
            console.log(taskToUpdate);
            TaskModule.setCurrentTask(taskToUpdate);
            UiModule.populateForm(taskToUpdate.title);
        }
    }
    
    function taskUpdateSubmit(e) {
        e.preventDefault();
        let titleInput = UiModule.getTitleInput();
        let updatedTask = TaskModule.updateItem(titleInput);
        StorageModule.updateTask(updatedTask);
        // console.log(updatedTask);
        UiModule.clearFields();
        UiModule.clearEditState();
        let tasks = TaskModule.getTasks();
        UiModule.populateTasks(tasks);
    }

    function taskDeleteSubmit(e) {
        e.preventDefault();
        let currentTask = TaskModule.getCurrentTask();
        TaskModule.deleteTask(currentTask);
        StorageModule.deleteTask(currentTask);
        UiModule.clearFields();
        UiModule.clearEditState();
        let tasks = TaskModule.getTasks();
        UiModule.populateTasks(tasks);

    }

    function backToAddTaskState(e) {
        e.preventDefault();
        UiModule.clearEditState();
        UiModule.clearFields();
    }

    return {
        init() {
            const totalTask = TaskModule.getTotalTaskCounter();
            UiModule.showTotalTaskCount(totalTask);
            let tasks = TaskModule.getTasks();
            UiModule.populateTasks(tasks);
            // UiModule.showEditState();
            UiModule.clearEditState();
            loadEventListener();
        }
    }
})(TaskModule, UiModule, StorageModule);
AppModule.init();
