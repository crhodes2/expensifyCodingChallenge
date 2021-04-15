<?php
header("Access-Control-Allow-Origin: *");    
extract($_POST);
$url = "https://www.expensify.com/api?command=CreateTransaction&authToken=$authToken&created=$created&amount=$amount&merchant=$merchant";

$content= file_get_contents($url);

echo $content;

?>