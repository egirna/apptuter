 <?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$con=mysqli_connect('localhost', 'apptuter_sa', 'P@$$w0rd'); 
$uiid=$_GET['uiid'];
$push = $_GET['push'];
$color = $_GET['color'];
$pageName = $_GET['pagename'];
$createdTime = $_GET['time'];

// Check connection
if (mysqli_connect_errno()) {
$response->data = null;
$response->errorResponse = "Failed to connect to MySQL: " . mysqli_connect_error();
  echo json_encode($response);
}
mysqli_select_db($con,'apptuter_app');

$retrievedObj = getAccount($uiid,$con);
if($retrievedObj!=null)
echo json_encode($retrievedObj);

else{
$result3 = mysqli_query($con,"INSERT INTO Account (DeviceId) VALUES ('$uiid')");
$account = mysqli_fetch_assoc($result3);
if($account!=null){
$accountId = $account['Id'];
$result4 = mysqli_query($con,"INSERT INTO Settings (PushNotification,Theme) VALUES ('$push','$color')");
$result5 = mysqli_query($con,"INSERT INTO CreatedApps (PageName,CreatedTime,AccountId) VALUES ('$pageNmae','$time','$accountId')");

echo json_encode(getAccount($uiid,$con));
}
else
echo null;
}

function getAccount($uid,$co){
 
$result = mysqli_query($co,"SELECT * FROM Account WHERE DeviceId='$uid'");

$account = mysqli_fetch_assoc($result);
if($account!=null){
$id=$account['SettingsId'];

$result2 = mysqli_query($co,"SELECT * FROM Settings WHERE Id='$id'");
$settings = mysqli_fetch_assoc($result2);

$response = Array('Account'=>$account,'Settings'=>$settings);

return $response;
}
else
return $account;
}

?> 