<?php
header("Access-Control-Allow-Origin: *");
extract($_GET);
$url ="https://www.expensify.com/api?command=Get&authToken=$authToken&returnValueList=transactionList";

$content= file_get_contents($url);

echo $content;

?>