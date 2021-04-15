<?php
header("Access-Control-Allow-Origin: *");
extract($_GET);
$url ="https://www.expensify.com/api?command=Authenticate&partnerName=$partnerName&partnerPassword=$partnerPassword&partnerUserID=$partnerUserID&partnerUserSecret=$partnerUserSecret";

$content= file_get_contents($url);

echo $content;

?>