const taskContainer = document.querySelector(".task__container");

console.log(taskContainer);


const newCard= ({id, 
    imageUrl, 
    taskTitle, 
    taskDescription, 
    taskType,}) => ` <div class="col-md-6 col-lg-4">
<div class="card ">
 <div class="card-header d-flex justify-content-end gap-2">
     <button type="button" class="btn btn-outline-success"><i class="fas fa-pencil-alt"></i></button>
     <button type="button" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i></button>
 </div>
 <img 
  src= ${imageUrl}
  class="card-img-top" alt="...">
 <div class="card-body">
   <h5 class="card-title">${taskTitle}</h5>
   <p class="card-text">
    ${taskDescription}
    </p>
   <span class="badge bg-primary">${taskType}</span>
 </div>
 <div class="card-footer text-muted d-flex justify-content-end">
     <button type="button" class="btn btn-outline-primary">Open Task</button>
 </div>
</div>
</div>`


const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`,  // unique no for card id 
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType:document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };

    const createNewCard= newCard(taskData);

    taskContainer.insertAdjacentHTML("beforeend", createNewCard);

    
};


// parent obj of html-> document 
