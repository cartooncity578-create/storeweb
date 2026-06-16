<?php
include 'db.php';
$method = $_POST['method'];
$amount = $_POST['amount'];
$txid = $_POST['txid'];

$sql = "INSERT INTO orders (method, amount, txid, status) VALUES ('$method', '$amount', '$txid', 'Pending')";
mysqli_query($conn, $sql);
echo "Success";
?>