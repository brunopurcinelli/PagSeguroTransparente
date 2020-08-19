<?php 
 $timezone = 'America/Sao_Paulo';
date_default_timezone_set($timezone);

$sandBox = 1;

if ($sandBox == 0) {
    $emailPagseguro = "purcinelli_k19@hotmail.com";
    $tokenPagseguro = "e615dfc7-7c74-409b-a271-4265c6831a0b363db03d4f7ba9e5cbae0441d3fc5d4f346f-43e3-45b0-8f6f-23d0759a76d7";

    $scriptPagseguro = "https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
    $urlPagseguro = "https://ws.pagseguro.uol.com.br/v2/";

} else {
    $emailPagseguro = "purcinelli_k19@hotmail.com";
    $tokenPagseguro = "5E53502523F6411AA4A544FE794F4C82";

    $scriptPagseguro = "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
    $urlPagseguro = "https://ws.sandbox.pagseguro.uol.com.br/v2/";
}