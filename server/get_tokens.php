 <?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$con=mysqli_connect('localhost', 'egdotcom_aptuser', 'TIP4IqF(N@aL'); 
$uiid=$_GET['id'];

// Check connection
if (mysqli_connect_errno()) {
$response->data = null;
$response->errorMessage = "Failed to connect to MySQL: " . mysqli_connect_error();
  echo json_encode($response);
}
mysqli_select_db($con,'apptuter_app');

$retrievedObj = getToken($id);
if($retrievedObj!=null)
echo json_encode($retrievedObj);


function getToken($id){
 
$result = mysqli_query($co,"SELECT * FROM Application WHERE Id='$id'");

$application= mysqli_fetch_assoc($result);

return $application;

}

?> 