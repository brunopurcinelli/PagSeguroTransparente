<?php 
 $timezone = 'America/Sao_Paulo';
date_default_timezone_set($timezone);

$sandBox = 1;

if ($sandBox == 0) {
    $emailPagseguro = "Email_PagSeguro";
    $tokenPagseguro = "Token_PagSeguro";

    $scriptPagseguro = "https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
    $urlPagseguro = "https://ws.pagseguro.uol.com.br/v2/";

} else {
    $emailPagseguro = "Email_SandBox_PagSeguro";
    $tokenPagseguro = "Token_SandBox_PagSeguro";

    $scriptPagseguro = "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
    $urlPagseguro = "https://ws.sandbox.pagseguro.uol.com.br/v2/";
}
