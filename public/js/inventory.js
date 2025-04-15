'use strict' 
 
 // Get a list of items in inventory based on the classification_id 
 let classificationList = document.querySelector("#classificationList")
 classificationList.addEventListener("change", async function (){  
  let classification_id = classificationList.value 
  console.log(`classification_id is: ${classification_id}`) 
  const tableBody = document.getElementById("inventoryDisplay")
  const response = await fetch(`/inv/getInventory/${classification_id}`)
  const data = await response.json()

  if (data.message) {
    // Display the "no inventory" message
    tableBody.innerHTML = `<tr><td colspan="4">${data.message}</td></tr>`
  } else {
    // Build the table with inventory data
    buildInventoryList(data)
  }
 })

 // Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
    let inventoryDisplay = document.getElementById("inventoryDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead class="table-head">'; 
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody class="table-body">'; 
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { 
     console.log(element.inv_id + ", " + element.inv_model); 
     dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
     dataTable += `<td><a href='/inv/edit/${element.inv_id}' class="modify-btn" title='Click to update'>Modify</a></td>`; 
     dataTable += `<td><a href='/inv/delete/${element.inv_id}' class="delete-btn" title='Click to delete'>Delete</a></td></tr>`; 
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; 
   }