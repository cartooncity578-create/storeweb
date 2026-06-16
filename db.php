<?php
$host = "localhost";
$user = "DB_USERNAME"; // Yahan apne database ka username daalo
$pass = "DB_PASSWORD"; // Yahan password daalo
$dbname = "zubaygames"; // Database ka naam

$conn = mysqli_connect($host, $user, $pass, $dbname);
if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }
?>