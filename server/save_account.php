 <?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$con=mysqli_connect('localhost', 'sa', 'P@$$w0rd'); 
$uiid=$_GET['uiid'];
$push=$_GET['push'];
// Check connection
if (mysqli_connect_errno()) {
$response->data = null;
$response->errorResponse = "Failed to connect to MySQL: " . mysqli_connect_error();
  echo json_encode($response);
}
mysqli_select_db($con,'apptuter_app'); 
$result = mysqli_query($con,"INSERT INTO Account (DeviceId) VALUES ('$uiid')");

if($result){
$id=mysqli_insert_id($con);
$storedrow = mysqli_query($con,"SELECT * FROM Account WHERE Id='$id'");
$row = mysqli_fetch_assoc($storedrow);
echo json_encode($row);
}
else
echo null;

?> 