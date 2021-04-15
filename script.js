// Data authorization needed for API to access
var authData=null;
var a_Data=null;

// Button to add a new transaction to the form
document.getElementById("new_transaction").addEventListener("click", newTrans);
document.getElementById('app-btn').addEventListener('click', logMeIn, true);



//===================================== FUNCTION TO LOGIN TO API ==================================================================>
function logMeIn() {
      
    // Variables for displaying pages. Login page and Transaction List page.
    transactionContainer = 'transactionContainer';
    authContainer = 'auth__container';
    var x = document.getElementById(transactionContainer);
    var y = document.getElementById(authContainer);

    // Variables for user input on Login page
    var txt = document.getElementById('e-mail').value;
    var pwd = document.getElementById('pwd').value;

    // Variables from the API. *API Link used for reference only*
    link = "https://www.expensify.com/api?command=Authenticate&partnerName=applicant&partnerPassword=d7c3119c6cdab02d68d9&partnerUserID=txt&partnerUserSecret=pwd"

    partnerName = "applicant"; //Hard coded variable for partnerName
    partnerPassword = "d7c3119c6cdab02d68d9"; //Hard coded variable for partnerPassword
    partnerUserID = txt;     //User input for the email login assigned to partnerUserID variable
    partnerUserSecret = pwd; //User input for the password login assigned to partnerUserSecret variable

    // Get API params using variables above for the PHP proxies. 
   const args = {
       partnerName: partnerName,
       partnerPassword: partnerPassword,
       partnerUserID: partnerUserID,
       partnerUserSecret:partnerUserSecret
   };

  // Locate the localhost php proxy file for auth *XAMPP server installation required*
  const url = "http://localhost/auth/auth.php";

  // Talk to the PHP Auth Proxy to request entry to API server
   $.get(url, args, (msg)=>{
       authData = JSON.parse(msg);
       
       if(authData.hasOwnProperty("jsonCode"))
       {
           switch(authData.jsonCode)
           {
               case 401:
                   alert("Error 401: Invalid entry. Please retype again.");
                break;
               case 404:
                    alert("Error 404: User not found");
                break;  
               case 500:
                    alert("Error 500: Forbidden");
                 break;
               default:
                   displayHomePage(x,y);
                 break;  
           }
       }
   });
}

var GV_TRANS=null;
var GV_TRANS_ROWS=10;
var GV_TRANS_PAGE=1;

//===================================== FUNCTION TO DISPLAY HOMEPAGE ==============================================================>

function displayHomePage(x, y) {
    console.log("API RESPONSE: Success!");

    // Make the login page disappear and the main page appear
    y.style.visibility = "hidden"
    y.style.display = "none";
    x.style.visibility = "visible";
    x.style.display = "block";

    // Collect the Auth token
    auth_Token = authData.authToken;

    // Locate the localhost php proxy file for data *XAMPP server installation required*
    const args2 = {
        authToken: auth_Token,
        returnValueList: "transactionList"
    };

    // Talk to the PHP Data Proxy to request most updated transaction list
    const data_url = "http://localhost/auth/data.php";
    $.get(data_url, args2, (my_msg)=>{
        a_Data = JSON.parse(my_msg);
        GV_TRANS=a_Data.transactionList;
        console.log(a_Data);
        displayTrans();
    });
}

//============================FUNCTION TO DISPLAY THE TRANSACTION LIST ON HOMEPAGE =================================================>

function displayTrans (page=1)
{
    // Variables to format the table to display the transaction list
    var i;
    let content = "";

    // Display line by line, every entered transaction from the API transaction list
    for(i = 0; i < GV_TRANS_ROWS; i++)
    {
        date = GV_TRANS[i].created;
        merchName = GV_TRANS[i].merchant; 
        amnt =GV_TRANS[i].amount;

        const row= `<tr><td>${date}</td><td>${merchName}</td><td>${amnt}</td></tr>`;
        content +=row;
    }
    $("#divTbody").html(content);
}
//============================FUNCTION TO DISPLAY THE ADD TRANSACTION WINDOW ======================================================>
function newTrans() {

    // Make the transaction form appear and the transaction table disappear
    console.log("Hello! Make new Transaction!");
    var disappear = document.getElementById('transactionTable');
    disappear.style.visibility = "hidden";

    var appear = document.getElementById('transactionForm');
    appear.style.visibility = "visible";
   
}

//================================ FUNCTION TO SUBMIT A NEW TRANSACTION ============================================================>
function submitForm() {

    // Collect the user information
    const newRow = {
        amount: $("#amount").val(),
        merchant: $("#merchant").val(),
        created: $("#created").val()
    }

    // Collect the Auth token
    auth_Token = authData.authToken;

    // Locate the localhost php proxy file for data *XAMPP server installation required*
    const args3 = {
        authToken: auth_Token,
        amount: newRow.amount,
        merchant: newRow.merchant,
        created: newRow.created
    };

    // Talk to the PHP Data Proxy to request most updated transaction list
    const data_entry_url = "http://localhost/auth/addData.php";
    $.get(data_entry_url, args3, (my_msg)=>{
        new_Data = JSON.parse(my_msg);
        GV_TRANS=new_Data.transactionList;
        console.log(new_Data);

    });

    // Attempting to throw an error when user does not fill out form entirely. Does not work, however, functionality remains intact  
    if(newRow.amount && newRow.merchant == null && newRow.created == 'mm/dd/yyyy')
    {
        alert("Please fill out form completely!");
    }
    else
    {
        console.log("New Data added: " + args3);
        GV_TRANS.unshift(args3);
        console.log("New Merchant added to list!");
        closeForm();
        displayTrans(1);
    }
}


//================================ FUNCTION TO CLOSE FORM =========================================================================>
function closeForm() {
    // Make Add transaction form disappear
    var disappear = document.getElementById('transactionForm');
    disappear.style.visibility = "hidden";

    // Make transaction list appear
    var appear = document.getElementById('transactionTable');
    appear.style.visibility = "visible";
}

//================================ FUNCTION TO LOG OUT USER =======================================================================>
function logMeOut()
{
    // Variables for displaying pages. Login page and Transaction List page.
    transactionContainer = 'transactionContainer';
    authContainer = 'auth__container';
    var y = document.getElementById(transactionContainer);
    var x = document.getElementById(authContainer);
    
    // Make the login disappear and the main page appear
    y.style.visibility = "hidden"
    y.style.display = "none";
    x.style.visibility = "visible";
    x.style.display = "grid";
    
    console.log("You are now logged out!");
}



//==================================================================================================================================>
//==================================================================================================================================>
