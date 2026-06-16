<?php 
// Database connection include karo
include 'db.php'; 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - ZubayGames</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 p-6">
    <div class="max-w-5xl mx-auto">
        <h1 class="text-2xl font-bold mb-6 text-slate-800">Orders Dashboard</h1>

        <div class="bg-white rounded-2xl shadow overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-slate-50 border-b">
                    <tr>
                        <th class="p-4 text-sm font-bold text-slate-600">Method</th>
                        <th class="p-4 text-sm font-bold text-slate-600">Amount</th>
                        <th class="p-4 text-sm font-bold text-slate-600">Transaction ID</th>
                        <th class="p-4 text-sm font-bold text-slate-600">Status</th>
                    </tr>
                </thead>
                <tbody id="order-list">
                    <?php
                    // Database se saare orders utha rahe hain
                    $res = mysqli_query($conn, "SELECT * FROM orders ORDER BY id DESC");
                    while($row = mysqli_fetch_assoc($res)) {
                        echo "<tr class='border-b hover:bg-slate-50'>
                                <td class='p-4 text-sm font-bold'>{$row['method']}</td>
                                <td class='p-4 text-sm font-bold text-blue-600'>৳ {$row['amount']}</td>
                                <td class='p-4 text-sm font-mono'>{$row['txid']}</td>
                                <td class='p-4'>
                                    <span class='px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold uppercase'>
                                        {$row['status']}
                                    </span>
                                </td>
                              </tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>