$(document).ready(function () {


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
          str += ("<tr><td class='id'>" + row.ID +
            "</td><td class='fname'><span>" + row.fname +
            "</span></td><td class='lname'><span>" + row.lname +
            "</span></td><td class='email'><span>" + row.email +
            "</span></td><td class='groupName'><span>" + row.groupName +
            "</span></td><td class='tel'><span>" + row.tel +
            "</span></td><td><button class='deleteRow'>Delete</button></td></tr>");
        }
        $("#users").html(str);

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
      success: function () {
        alert("Database Updated");
        getUsers();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#errorLog").text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      }
    });
  });


  $('#users').on('click', 'span', function () {

    let dataClass = $(this).parent().attr('class');

    let spanText = $(this).text();
    let td = $(this).parent();
    let input = $("<input type='text' value='" + spanText + "'>");
    td.html(input);

    $(input).keyup(function (e) {
      let val = null;
      let span = null;
      if (e.which == 13) {
        val = $(input).val();
        span = $("<span>" + val + "</span>");
        td.html(span);

        let dataToSend = {
          id: td.parent().find("[class='id']").html()
        };
        dataToSend[dataClass] = val;

        $.ajax({
          url: "/update-user",
          dataType: "json",
          type: "POST",
          data: dataToSend,
          success: function () {
            $("#status").html("DB updated.");
            getUsers();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            $("#errorLog").text(jqXHR.statusText);
            console.log("ERROR:", jqXHR, textStatus, errorThrown);
          }

        });
      }
    })

  });


  $('#users').on('click', 'button', function () {
    var answer = confirm("Are you sure you want to delete this user?");
    if (answer == true) {
      console.log("Deleting the row.");
      let td = $(this).parent();
      let dataToSend = {
        id: td.parent().find("[class='id']").html()
      };

      $.ajax({
        url: "/delete-user",
        dataType: "json",
        type: "POST",
        data: dataToSend,
        success: function () {
          $("#status").html("DB updated.");
          getUsers();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#errorLog").text(jqXHR.statusText);
          console.log("ERROR:", jqXHR, textStatus, errorThrown);
        }
      });
    }

  });

});