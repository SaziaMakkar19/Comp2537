
$(document).ready(function() {


  function getUsers() {
    $.ajax({
      url: "/get-users",
      dataType: "json",
      type: "GET",
      success: function (data) {
        console.log(data);
        let str = `        <tr>
  <th class="tableHeader"><span>ID</span></th>
  <th class="tableHeader"><span>First Name</span></th>
  <th class="tableHeader"><span>Last Name</span></th>
  <th class="tableHeader"><span>Email</span></th>
  <th class="tableHeader"><span>Group Name</span></th>
  <th class="tableHeader"><span>Phone Number</span></th>
  </tr>`;
        for (let i = 0; i < data.rows.length; i++) {
          let row = data.rows[i];
          //console.log("row", row);
          str += ("<tr><td class='fname'>" + row.ID +
            "</td><td>" + row.fname +
            "</td><td class='lname'><span>" +
            "</td><td>" + row.lname +
            "</td><td class='email'><span>" +
            "</td><td>" + row.email +
            "</td><td class='groupName'><span>" +
            "</td><td>" + row.groupName +
            "</td><td class='tel'><span>" +
            row.tel + "</span></td></tr>");
            // "<td><button id=" + row.ID + "\">close</button></td>"
        }
        //console.log(str);
        $("#content").html(str);
  
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#errorLog").text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      }
    });
  }
  getUsers();
  
  $('#submit').click(function (e) {
    e.preventDefault();
  
    let formData = {
      fname: $("#fname").val(),
      lname: $("#lname").val(),
      email: $("#email").val(),
      groupName: $("#groupName").val(),
      tel: $("#tel").val()
    };
    

    $("#fname").val("");
    $("#lname").val("");
    $("#email").val("");
    $("#groupName").val("");
    $("#tel").val("");
  
    $.ajax({
      url: "/add-users",
      dataType: "json",
      type: "POST",
      data: formData,
      success: function (data) {
        //console.log(data);
        $("#status").html("DB updated.");
        getUsers();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#errorLog").text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      }
    });
  });

  
  $('#deleteAll').click(function(e) {
    e.preventDefault();

    $.ajax({
        url: "/delete-all-users",
        dataType: "json",
        type: "POST",
        success: function(data) {
            console.log(data);
            $("#status").html("All records deleted.");
            getUsers();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#errorLog").text(jqXHR.statusText);
            console.log("ERROR:", jqXHR, textStatus, errorThrown);
        }

    });
});





});
