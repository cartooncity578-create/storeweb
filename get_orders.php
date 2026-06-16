<?php
include 'db.php';
$res = mysqli_query($conn, "SELECT * FROM orders ORDER BY id DESC");
while($row = mysqli_fetch_assoc($res)) {
    echo "<tr class='border-b'>
            <td class='p-4'>{$row['method']}</td>
            <td class='p-4'>{$row['amount']}</td>
            <td class='p-4 text-mono'>{$row['txid']}</td>
            <td class='p-4'><span class='text-yellow-600 font-bold'>{$row['status']}</span></td>
          </tr>";
}
?>